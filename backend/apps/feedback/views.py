from rest_framework import viewsets, permissions

from .models import Feedback
from .serializers import (
    FeedbackReadSerializer,
    FeedbackWriteSerializer,
    FeedbackStatusSerializer,
)
from apps.users.permissions import IsClient, IsManagerOrDesigner


class FeedbackViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    # Full PUT not meaningful here — status transitions are incremental.
    http_method_names  = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        user       = self.request.user
        project_id = self.request.query_params.get('project')

        if user.role == 'Manager':
            qs = Feedback.objects.select_related('project').all()
        elif user.role == 'Designer':
            qs = Feedback.objects.filter(
                project__assignments__designer__user=user
            ).select_related('project')
        elif user.role == 'Client':
            qs = Feedback.objects.filter(
                project__client__user=user
            ).select_related('project')
        else:
            qs = Feedback.objects.none()

        if project_id:
            qs = qs.filter(project_id=project_id)

        return qs.distinct()

    def get_serializer_class(self):
        if self.action == 'create':
            return FeedbackWriteSerializer
        if self.action == 'partial_update':
            # Manager/Designer update only the status field.
            return FeedbackStatusSerializer
        return FeedbackReadSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsClient()]
        if self.action == 'partial_update':
            return [IsManagerOrDesigner()]
        return [permissions.IsAuthenticated()]