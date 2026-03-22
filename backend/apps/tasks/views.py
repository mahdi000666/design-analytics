import json
import os
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from groq import Groq

from .models import Task
from .serializers import TaskReadSerializer, TaskWriteSerializer
from apps.users.permissions import IsManager, IsManagerOrDesigner

from apps.timelog.models import TimeLog


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user       = self.request.user
        project_id = self.request.query_params.get('project')

        # Base queryset — scoped by role so designers can't see tasks for
        # projects they're not assigned to.
        if user.role == 'Manager':
            qs = Task.objects.select_related('project').prefetch_related('subtasks')
        elif user.role == 'Designer':
            qs = Task.objects.filter(
                project__assignments__designer__user=user
            ).select_related('project').prefetch_related('subtasks')
        else:
            qs = Task.objects.none()

        if project_id:
            qs = qs.filter(project_id=project_id)

        # Return only top-level tasks — subtasks come via the nested serializer.
        return qs.filter(parent_task__isnull=True)

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return TaskWriteSerializer
        return TaskReadSerializer

    def get_permissions(self):
        if self.action in ('create', 'destroy'):
            return [IsManager()]
        if self.action in ('update', 'partial_update'):
            return [IsManagerOrDesigner()]
        return [IsAuthenticated()]


# ---------------------------------------------------------------------------
# AI Hour Estimator — separate function-based view, not part of the ViewSet.
# Kept isolated so it can be called independently from the task creation form
# without the task existing yet.
# ---------------------------------------------------------------------------

_groq_client = Groq(api_key=os.getenv('GROQ_API_KEY', ''))

ESTIMATOR_SYSTEM_PROMPT = """
You are an experienced graphic design project manager.
Given a task name and description, estimate how many hours a professional designer
would need to complete it. Consider complexity, typical revision cycles, and
design industry norms.

Respond ONLY with valid JSON in this exact shape — no prose, no markdown fences:
{"estimated_hours": <float>, "reasoning": "<one sentence>"}

If the description is too vague to estimate, return:
{"estimated_hours": null, "reasoning": "Description too vague to estimate."}
""".strip()


@api_view(['POST'])
@permission_classes([IsManager])
def estimate_task_hours(request):
    task_name   = request.data.get('task_name', '').strip()
    description = request.data.get('description', '').strip()
    project_id  = request.data.get('project_id')

    if not task_name:
        return Response({'detail': 'task_name is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch historical context from the same project
    historical = ''
    if project_id:
        logs = (
            TimeLog.objects
            .filter(task__project_id=project_id)
            .select_related('task')
            .values('task__task_name', 'task__estimated_hours', 'hours_spent')
            .order_by('-created_at')[:10]
        )
        if logs:
            lines = [
                f"- \"{l['task__task_name']}\": estimated {l['task__estimated_hours']}h, actual {l['hours_spent']}h"
                for l in logs
            ]
            historical = '\n'.join(lines)

    user_message = f"Task: {task_name}\nDescription: {description or 'No description provided.'}"
    if historical:
        user_message += f"\n\nRecent tasks on this project for context:\n{historical}"

    try:
        chat = _groq_client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[
                {'role': 'system', 'content': ESTIMATOR_SYSTEM_PROMPT},
                {'role': 'user',   'content': user_message},
            ],
            temperature=0.2,   # Low — we want consistent, not creative, estimates.
            max_tokens=100,
        )
        raw    = chat.choices[0].message.content.strip()
        result = json.loads(raw)

        # Validate the shape before passing it to the client.
        if 'estimated_hours' not in result or 'reasoning' not in result:
            raise ValueError('Unexpected response shape')

    except (json.JSONDecodeError, ValueError):
        # Malformed JSON from the model — degrade gracefully.
        return Response({'estimated_hours': None, 'reasoning': 'AI returned an unexpected response.'})
    except Exception:
        # Groq is down, rate-limited, etc.
        return Response({'estimated_hours': None, 'reasoning': 'AI service unavailable.'})

    return Response(result)