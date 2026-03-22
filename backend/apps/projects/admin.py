from django.contrib import admin
from .models import Project, ProjectAssignment

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display  = ['project_name', 'client', 'status', 'deadline', 'budget_amount']
    list_filter   = ['status']
    search_fields = ['project_name', 'client__user__full_name']

@admin.register(ProjectAssignment)
class ProjectAssignmentAdmin(admin.ModelAdmin):
    list_display = ['project', 'designer', 'assigned_at']