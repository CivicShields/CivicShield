from django.urls import path
from . import views

urlpatterns = [
    path('departments/', views.list_departments),
    path('departments/create/', views.create_department),
    path('departments/<int:id>/', views.get_department),
    path('departments/<int:id>/update/', views.update_department),
    path('departments/<int:id>/delete/', views.delete_department),
    path('departments/<int:id>/incidents/', views.department_incidents),
    path('departments/<int:id>/assign/<int:incident_id>/', views.assign_incident),
]