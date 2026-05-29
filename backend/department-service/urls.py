from django.urls import path
from . import views

urlpatterns = [
    path('', views.DepartmentListView.as_view()),
    path('<int:dept_id>/', views.DepartmentDetailView.as_view()),
]