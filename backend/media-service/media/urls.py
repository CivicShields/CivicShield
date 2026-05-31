from django.urls import path
from . import views

urlpatterns = [
    path('upload', views.upload_media, name='upload_media'),
    path('<uuid:media_id>', views.get_media, name='get_media'),
    path('<uuid:media_id>/delete', views.delete_media, name='delete_media'),
    path('all', views.all_media, name='all_media'),
]