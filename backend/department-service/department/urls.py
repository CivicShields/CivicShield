from django.urls import path
from . import views

urlpatterns = [
    path('create-depart/', views.create_depart, name='create_depart'),
    path('get-all-departs/', views.get_depart_list, name='get_depart_list'),
    path('get-depart/', views.get_depart, name='get_depart'),
    path('update-depart/', views.update_depart, name='update-depart'),
    path('delete-depart/', views.delete_depart, name='delete-depart'),
]