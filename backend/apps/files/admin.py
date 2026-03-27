from django.contrib import admin
from .models import FileUpload


@admin.register(FileUpload)
class FileUploadAdmin(admin.ModelAdmin):
    list_display  = ('file_name', 'file_type', 'project', 'uploaded_by', 'uploaded_at')
    list_filter   = ('file_type', 'project')
    raw_id_fields = ('project', 'uploaded_by')