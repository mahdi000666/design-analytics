from django.contrib import admin
from .models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display  = ('project', 'category', 'status', 'submitted_at', 'resolved_at')
    list_filter   = ('category', 'status')
    raw_id_fields = ('project',)