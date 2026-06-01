from django.urls import path
from . import views

urlpatterns = [
    path('all', views.list_departments),
    path('create', views.create_department),
    path('<int:id>', views.get_department),
    path('<int:id>/update', views.update_department),
    path('<int:id>/delete', views.delete_department),
    path('<int:id>/incidents', views.department_incidents),
    path('<int:id>/assign/<int:incident_id>', views.assign_incident),
    path('depart-names', views.get_depart_names, name='get_depart_names'),
]