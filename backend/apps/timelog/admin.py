from django.contrib import admin
from .models import TimeLog


@admin.register(TimeLog)
class TimeLogAdmin(admin.ModelAdmin):
    list_display  = ('designer', 'task', 'hours_spent', 'created_at')
    list_filter   = ('designer', 'task__project')
    raw_id_fields = ('task', 'designer')