from django.urls import path
from .views import RegisterView, ProfileView
from . import views_admin

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path("profile/", ProfileView.as_view(), name='profile'),
    path('admin/users/', views_admin.AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:user_id>/orders/', views_admin.AdminUserOrderDetailView.as_view(), name='admin-user-orders'),
]