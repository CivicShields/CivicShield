from django.urls import path
from .views.user_views import list_incidents, create_incident
from .views.department_views import list_incidents

urlpatterns = [
    # urls for normal user
    path('create/', create_incident, name='incident-create'),
    path("reporter/<int:id>/", list_incidents, name="list-incidents"),

    # urls for departments
    path("department/<int:id>/", list_incidents, name="dept-incidents"),
    #path("incidents/<int:id>/status/", update_status, name="update-incident-status"),

]