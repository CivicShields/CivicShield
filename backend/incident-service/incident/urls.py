from django.urls import path
from .views.user_views import list_incidents, create_incident
from .views.department_views import list_incidents, update_status 
from .views.admin_views import list_incidents, remove_incidents, update_incident

urlpatterns = [
    # urls for normal user
    path('create/', create_incident, name='incident-create'),
    path("reporter/<int:id>/", list_incidents, name="list-incidents"),

    # urls for departments
    path("department/<int:id>/", list_incidents, name="dept-incidents"),
    path("department/<int:id>/status/", update_status, name="update-status"),

    #urls for admin
    path("admin/list/", list_incidents, name="admin-list-incidents"),
    path("admin/<int:id>/remove/", remove_incidents, name="admin-remove-incidents"),
    path("admin/update/<int:id>/", update_incident, name="admin-update-incident")
]