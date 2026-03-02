from django.urls import path
from .views import (
    AppointmentCreateView,
    MyAppointmentListView,
    AdminAppointmentListView,
    AppointmentStatusUpdateView,
)

urlpatterns = [
    path('book/', AppointmentCreateView.as_view()),
    path('my/', MyAppointmentListView.as_view()),
    path('admin/', AdminAppointmentListView.as_view()),
    path('update/<int:pk>/', AppointmentStatusUpdateView.as_view()),
]