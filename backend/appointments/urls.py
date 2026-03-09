from django.urls import path
from . import views

urlpatterns = [
    path('book/', views.AppointmentCreateView.as_view()),
    path('my/', views.MyAppointmentListView.as_view()),
    path('admin/', views.AdminAppointmentListView.as_view()),
    path('update/<int:pk>/', views.AppointmentStatusUpdateView.as_view()),
    path('mark-admin-seen/', views.MarkAdminSeenView.as_view()),
    path('mark-user-seen/', views.MarkUserSeenView.as_view()),
    path('unseen-count/', views.UnseenCountView.as_view()),
]