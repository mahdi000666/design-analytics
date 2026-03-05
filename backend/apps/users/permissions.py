from rest_framework.permissions import BasePermission


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Manager'


class IsDesigner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Designer'


class IsClient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Client'


class IsManagerOrDesigner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('Manager', 'Designer')