from django.db import models
from apps.projects.models import Project
from apps.users.models import User


class FileUpload(models.Model):
    project     = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    file_type   = models.CharField(max_length=20)     # 'deliverable' | 'reference' | 'brand_guideline'
    file_name   = models.CharField(max_length=255)
    file_path   = models.CharField(max_length=500)    # Path within MEDIA_ROOT
    file_size   = models.IntegerField()                # Bytes
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.file_name} ({self.project.project_name})'