from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display  = ['task_name', 'project', 'status', 'is_unplanned', 'estimated_hours']
    list_filter   = ['status', 'is_unplanned']
    search_fields = ['task_name', 'project__project_name']