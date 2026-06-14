from django.urls import path
from . import views

urlpatterns = [
    path('user/<uuid:user_id>/', views.user_notifications),
    path('<uuid:id>/read/', views.mark_as_read),
    path('incident/<uuid:incident_id>/', views.trigger_incident_notification),
    path('send/', views.send_notification),
    path('escalation/<uuid:incident_id>/', views.trigger_escalation),
    path('all/', views.all_notifications),
    path('delete/<uuid:id>/', views.delete_notification),
]