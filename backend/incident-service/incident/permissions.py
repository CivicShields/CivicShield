from rest_framework.permissions import BasePermission  # type: ignore[import]
import requests


class IsReporter(BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.reporter_id == request.user.id
    

class IsDepartment(BasePermission):

    def has_object_permission(self, request, view, obj, *args, **kwargs):
        USERS_URL = "Url to query department here"
        response = requests.get(f"{USERS_URL}/users/{request.user.id}/")
        if response.status_code == 200:
            user_data = response.json()
            return user_data.get("department_id") == obj.department_id
        print("Failed to fetch user data:", response.status_code, response.text)
        return False