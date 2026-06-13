from django.urls import path
from .views.admin_views import admin_list_incidents, admin_remove_incidents, admin_update_incident
from .views.user_views import create_incident, list_user_incidents, find_nearby_incidents
from .views.dept_views import list_dept_incidents, update_status

urlpatterns = [
    # urls for normal user
    path('create/', create_incident, name='incident-create'),
    path("reporter/", list_user_incidents, name="list-incidents"),
    path("nearby/", find_nearby_incidents, name="find-nearby-incidents"),

    # urls for departments
    path("department/<uuid:department_id>/", list_dept_incidents, name="dept-incidents"),
    path("department/<uuid:department_id>/status/", update_status, name="update-status"),

    #urls for admin
    path("admin/list/", admin_list_incidents, name="admin-list-incidents"),
    path("admin/<int:id>/remove/", admin_remove_incidents, name="admin-remove-incidents"),
    path("admin/update/<int:id>/", admin_update_incident, name="admin-update-incident")
]