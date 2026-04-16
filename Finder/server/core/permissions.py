from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.groups.filter(name="ADMIN").exists()


class IsPolice(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user, "userprofile") and request.user.userprofile.role == "POLICE"


class IsPublic(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated