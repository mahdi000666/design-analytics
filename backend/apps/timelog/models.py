from django.db import models
from apps.tasks.models import Task
from apps.users.models import Designer


class TimeLog(models.Model):
    task        = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='time_logs')
    designer    = models.ForeignKey(Designer, on_delete=models.CASCADE, related_name='time_logs')
    hours_spent = models.DecimalField(max_digits=5, decimal_places=2)
    description = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['task', 'designer']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f'{self.hours_spent}h by {self.designer.user.full_name} on {self.task.task_name}'