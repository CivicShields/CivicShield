from django.urls import path
from . import views

urlpatterns = [
    # Frontend endpoints (authenticated user)
    path('user/<int:user_id>/', views.my_notifications, name='my_notifications'),
    path('<uuid:id>/read/', views.mark_as_read, name='mark_as_read'),
    path('delete/<uuid:id>/', views.delete_notification, name='delete_notification'),
    path('all/', views.all_notifications, name='all_notifications'),
    path('department/<uuid:department_id>/', views.department_notifications, name='department_notifications'),
    
    # Internal service-to-service endpoints 
    path('internal/incident-created/', views.incident_created, name='incident_created'),
    path('internal/status-update/', views.status_update, name='status_update'),
]