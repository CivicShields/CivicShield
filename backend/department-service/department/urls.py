from django.urls import path
from . import views

urlpatterns = [
    path('all/', views.list_departments),
    path('create/', views.create_department),
    path('<uuid:department_id>/', views.get_department),
    path('<uuid:department_id>/update/', views.update_department),
    path('<uuid:department_id>/delete/', views.delete_department),
    path('<uuid:department_id>/incidents/', views.department_incidents),
    path('<uuid:department_id>/assign/<uuid:id>/', views.assign_incident),
    path('depart-names/', views.get_depart_names, name='get_depart_names')
]