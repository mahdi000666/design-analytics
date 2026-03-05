from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import ActivateAccountSerializer


@api_view(['POST'])
@permission_classes([AllowAny])   # must be public — user has no token yet
def activate_account(request):
    serializer = ActivateAccountSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()

    return Response({
        'message': f'Account activated. Welcome {user.full_name}, you can now log in.'
    }, status=status.HTTP_200_OK)