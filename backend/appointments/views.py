from rest_framework import generics, permissions
from .models import Appointment
from .serializers import AppointmentSerializer, AppointmentStatusUpdateSerializer


# Customer - Book appointment
class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Customer - View own appointments
class MyAppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        appointments = Appointment.objects.filter(user=self.request.user)

        for appointment in appointments:
            appointment.check_and_expire()

        return appointments


# Admin - View all appointments
class AdminAppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        appointments = Appointment.objects.all()

        for appointment in appointments:
            appointment.check_and_expire()

        return appointments


# Admin - Approve / Reject
class AppointmentStatusUpdateView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentStatusUpdateSerializer
    permission_classes = [permissions.IsAdminUser]