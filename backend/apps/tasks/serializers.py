from rest_framework import serializers
from .models import Task


class TaskReadSerializer(serializers.ModelSerializer):
    subtasks     = serializers.SerializerMethodField()
    project_name = serializers.CharField(source='project.project_name', read_only=True)

    class Meta:
        model  = Task
        fields = [
            'id', 'project', 'project_name', 'parent_task',
            'task_name', 'description', 'estimated_hours',
            'status', 'is_unplanned', 'created_at', 'subtasks',
        ]

    def get_subtasks(self, obj):
        # Only recurse one level — avoids expensive deep nesting for MVP.
        # Parent tasks are fetched with ?project= filter; subtasks render inline.
        return TaskReadSerializer(obj.subtasks.all(), many=True).data


class TaskWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Task
        fields = [
            'project', 'parent_task', 'task_name', 'description',
            'estimated_hours', 'status', 'is_unplanned',
        ]

    def validate(self, attrs):
        # Prevent assigning a subtask's parent from a different project.
        parent = attrs.get('parent_task')
        project = attrs.get('project', getattr(self.instance, 'project', None))
        if parent and parent.project_id != project.id:
            raise serializers.ValidationError(
                {'parent_task': 'Parent task must belong to the same project.'}
            )
        return attrs