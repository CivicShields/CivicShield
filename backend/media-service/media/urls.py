from django.urls import path
from . import views

urlpatterns = [
    path('media/upload', views.upload_media, name='upload_media'),
    path('media/<uuid:media_id>', views.get_media, name='get_media'),
    path('incidents/<uuid:incident_id>/media', views.incident_media, name='incident_media'),
    path('media/<uuid:media_id>/delete', views.delete_media, name='delete_media'),
]