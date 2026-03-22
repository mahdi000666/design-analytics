from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.users.permissions import IsManager
from apps.users.models import Client, Designer

from .serializers import ActivateAccountSerializer, CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Replaces the default simplejwt login view so it uses our serializer,
    which embeds email and role in the JWT payload.
    Everything else (response shape, HTTP method) is unchanged.
    """
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])   # public — user has no token yet
def activate_account(request):
    serializer = ActivateAccountSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()

    return Response(
        {'message': f'Account activated. Welcome {user.full_name}, you can now log in.'},
        status=status.HTTP_200_OK,
    )

@api_view(['GET'])
@permission_classes([IsManager])
def client_list(request):
    clients = Client.objects.select_related('user').all()
    return Response([{'id': c.id, 'name': c.user.full_name} for c in clients])


@api_view(['GET'])
@permission_classes([IsManager])
def designer_list(request):
    designers = Designer.objects.select_related('user').all()
    return Response([{'id': d.id, 'name': d.user.full_name} for d in designers])