from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('change-password/', views.change_password, name='change_password'),
    path('me/', views.me, name='me'),
    path('users/', views.list_users, name='list_users'),
    path('users/<int:user_id>/role/', views.update_role, name='update_role'),
    path('users/<int:user_id>/', views.delete_user, name='delete_user'),
]