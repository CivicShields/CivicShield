from django.urls import path
from . import views

urlpatterns = [

    path('notifications/user/<uuid:user_id>/', views.user_notifications),

    path('notifications/<uuid:id>/read/', views.mark_as_read),

    path('notifications/incident/<uuid:incident_id>/', views.trigger_incident_notification),

    path('notifications/send/', views.send_notification),

    path('notifications/escalation/<uuid:incident_id>/', views.trigger_escalation),

    path('notifications/', views.all_notifications),

    path('notifications/delete/<uuid:id>/', views.delete_notification),
]