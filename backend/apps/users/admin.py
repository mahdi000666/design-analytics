from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import User, Designer, Client, InvitationToken


class InviteUserForm(forms.ModelForm):
    """
    Custom creation form that requires no password.
    The user sets their password via the invitation email link.
    """
    class Meta:
        model = User
        fields = ('email', 'full_name', 'role')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_unusable_password()   # marks password as unset — login impossible until activated
        user.is_active = False         # stays inactive until invitation link is clicked
        if commit:
            user.save()
        return user


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_form      = InviteUserForm     # use our custom form for creation
    list_display  = ('email', 'full_name', 'role', 'is_active', 'created_at')
    list_filter   = ('role', 'is_active')
    search_fields = ('email', 'full_name')
    ordering      = ('email',)

    # Form for editing existing users
    fieldsets = (
        (None,          {'fields': ('email', 'password')}),
        ('Personal',    {'fields': ('full_name', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

    # Form for creating new users — no password fields
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'role'),
        }),
    )


@admin.register(Designer)
class DesignerAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'hourly_rate', 'available_hours_per_week')


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'industry')


@admin.register(InvitationToken)
class InvitationTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_used', 'expires_at')