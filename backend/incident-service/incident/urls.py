from django.urls import path
from .views.user_views import list_user_incidents, create_incident
from .views.department_views import list_dept_incidents, update_status 
from .views.admin_views import admin_list_incidents, admin_remove_incidents, admin_update_incident

urlpatterns = [
    # urls for normal user
    path('create/', create_incident, name='incident-create'),
    path("reporter/<int:id>", list_user_incidents, name="list-incidents"),

    # urls for departments
    path("department/<int:id>", list_dept_incidents, name="dept-incidents"),
    path("department/<int:id>/status", update_status, name="update-status"),

    #urls for admin
    path("admin/list", admin_list_incidents, name="admin-list-incidents"),
    path("admin/<int:id>/remove", admin_remove_incidents, name="admin-remove-incidents"),
    path("admin/update/<int:id>", admin_update_incident, name="admin-update-incident")
]