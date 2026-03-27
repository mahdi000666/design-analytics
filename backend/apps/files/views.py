from rest_framework import viewsets, parsers, permissions

from .models import FileUpload
from .serializers import FileUploadReadSerializer, FileUploadWriteSerializer
from apps.users.permissions import IsManager


class FileUploadViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes     = [parsers.MultiPartParser, parsers.FormParser]
    # No PUT or PATCH — uploaded files are immutable; replace by delete + re-upload.
    http_method_names  = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        user       = self.request.user
        project_id = self.request.query_params.get('project')

        if user.role == 'Manager':
            qs = FileUpload.objects.select_related('project', 'uploaded_by').all()
        elif user.role == 'Designer':
            qs = FileUpload.objects.filter(
                project__assignments__designer__user=user
            ).select_related('project', 'uploaded_by')
        elif user.role == 'Client':
            qs = FileUpload.objects.filter(
                project__client__user=user
            ).select_related('project', 'uploaded_by')
        else:
            qs = FileUpload.objects.none()

        if project_id:
            qs = qs.filter(project_id=project_id)

        # distinct() prevents duplicate rows caused by the ProjectAssignment join
        # when a designer is assigned to the same project more than once (shouldn't
        # happen due to unique_together, but defensive here).
        return qs.distinct()

    def get_serializer_class(self):
        if self.action == 'create':
            return FileUploadWriteSerializer
        return FileUploadReadSerializer

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsManager()]
        return [permissions.IsAuthenticated()]