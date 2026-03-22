from rest_framework import serializers
from django.db.models import Sum
from .models import Project, ProjectAssignment
from apps.users.models import Designer


class ProjectAssignmentReadSerializer(serializers.ModelSerializer):
    designer_id   = serializers.IntegerField(source='designer.id', read_only=True)
    designer_name = serializers.CharField(source='designer.user.full_name', read_only=True)

    class Meta:
        model  = ProjectAssignment
        fields = ['designer_id', 'designer_name', 'assigned_at']


class ProjectReadSerializer(serializers.ModelSerializer):
    client_name  = serializers.CharField(source='client.user.full_name', read_only=True)
    actual_hours = serializers.SerializerMethodField()
    assignments  = ProjectAssignmentReadSerializer(many=True, read_only=True)

    class Meta:
        model  = Project
        fields = [
            'id', 'project_name', 'description', 'status', 'category',
            'budget_hours', 'budget_amount', 'deadline',
            'client', 'client_name', 'actual_hours', 'assignments',
            'created_at', 'updated_at',
        ]

    def get_actual_hours(self, obj):
        result = obj.tasks.aggregate(total=Sum('time_logs__hours_spent'))
        return result['total'] or 0


class ProjectWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Project
        fields = [
            'client', 'project_name', 'description',
            'budget_hours', 'budget_amount', 'deadline', 'status', 'category',
        ]


class AssignDesignerSerializer(serializers.Serializer):
    # Accepts a plain designer PK — no model instance needed on this payload.
    designer_id = serializers.PrimaryKeyRelatedField(
        queryset=Designer.objects.select_related('user').all()
    )