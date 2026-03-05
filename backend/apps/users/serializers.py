from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from .models import InvitationToken


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Adds email and role into the JWT payload so the React AuthContext can
    decode the user's identity without a separate /api/users/me/ call.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)   # already contains user_id, exp, iat
        token['email'] = user.email
        token['role']  = user.role
        return token


class ActivateAccountSerializer(serializers.Serializer):
    """
    Validates the token and new password submitted from the activation page.
    Not a ModelSerializer because we're doing a multi-step operation
    across User and InvitationToken, not a single model create/update.
    """
    token    = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_token(self, value):
        try:
            invitation = InvitationToken.objects.get(token=value)
        except InvitationToken.DoesNotExist:
            raise serializers.ValidationError('Invalid token.')

        if invitation.is_used:
            raise serializers.ValidationError('This token has already been used.')

        if invitation.expires_at < timezone.now():
            raise serializers.ValidationError('This token has expired.')

        return value

    def save(self):
        token_value = self.validated_data['token']
        password    = self.validated_data['password']

        invitation = InvitationToken.objects.get(token=token_value)
        user       = invitation.user

        user.set_password(password)
        user.is_active = True
        user.save()

        invitation.is_used = True
        invitation.save()

        return user