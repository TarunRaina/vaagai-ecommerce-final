from rest_framework import generics, permissions
from rest_framework.response import Response
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
        appointments = Appointment.objects.filter(user=self.request.user).order_by('-created_at')

        for appointment in appointments:
            appointment.check_and_expire()

        return appointments


# Admin - View all appointments
class AdminAppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        appointments = Appointment.objects.all().order_by('-created_at')

        for appointment in appointments:
            appointment.check_and_expire()

        return appointments


# Admin - Approve / Reject
class AppointmentStatusUpdateView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentStatusUpdateSerializer
    permission_classes = [permissions.IsAdminUser]


# Notifications - Mark Seen
class MarkAdminSeenView(generics.GenericAPIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        Appointment.objects.all().update(is_seen_by_admin=True)
        return Response({"message": "Marked all as seen by admin"})

class MarkUserSeenView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Appointment.objects.filter(user=request.user).update(is_seen_by_user=True)
        return Response({"message": "Marked all as seen by user"})

# Notifications - Unseen Counts
class UnseenCountView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.user_type == 'admin':
            count = Appointment.objects.filter(is_seen_by_admin=False).count()
        else:
            count = Appointment.objects.filter(user=request.user, is_seen_by_user=False).count()
        return Response({"unseen_count": count})