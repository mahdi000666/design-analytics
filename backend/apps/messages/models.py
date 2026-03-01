from django.db import models
from apps.projects.models import Project
from apps.users.models import User


class Message(models.Model):
    project      = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='messages')
    sender       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content_text = models.TextField()
    is_read      = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=['project', 'created_at'])]
        ordering = ['created_at']