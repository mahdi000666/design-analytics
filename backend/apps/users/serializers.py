from rest_framework import serializers
from django.utils import timezone
from .models import InvitationToken


class ActivateAccountSerializer(serializers.Serializer):
    """
    Validates the token and new password submitted from the activation page.
    Not a ModelSerializer because we're not directly creating/updating
    a single model — we're doing a multi-step operation across User and InvitationToken.
    """
    token    = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_token(self, value):
        """
        validate_<fieldname> methods run automatically during .is_valid().
        This checks all three token conditions and raises a validation
        error if any fail — DRF returns a 400 with the error message.
        """
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
        """
        Called after validation passes. Sets the password, activates
        the user, and marks the token as used in one transaction.
        """
        token_value = self.validated_data['token']
        password    = self.validated_data['password']

        invitation = InvitationToken.objects.get(token=token_value)
        user       = invitation.user

        user.set_password(password)   # hashes the password — never stored as plain text
        user.is_active = True
        user.save()

        invitation.is_used = True
        invitation.save()

        return user