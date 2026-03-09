from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'user', 'user_email', 'user_name', 'date', 'time', 'status', 'user_note', 'admin_reason', 'is_seen_by_admin', 'is_seen_by_user', 'created_at']
        read_only_fields = ['user', 'status', 'is_seen_by_admin', 'is_seen_by_user', 'created_at']

    def validate(self, data):
        from django.utils import timezone
        import datetime

        appointment_date = data.get('date')
        appointment_time = data.get('time')

        # 1. Past Date Check
        if appointment_date < timezone.now().date():
            raise serializers.ValidationError({"date": "You cannot book an appointment for a past date."})
        
        # 2. Sunday Check
        if appointment_date.weekday() == 6: # 6 is Sunday in Python's weekday()
            raise serializers.ValidationError({"date": "Appointments are not available on Sundays."})

        return data


class AppointmentStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status', 'admin_reason', 'is_seen_by_user']

    def update(self, instance, validated_data):
        # Whenever admin updates status, mark it as unseen by user
        instance.status = validated_data.get('status', instance.status)
        instance.admin_reason = validated_data.get('admin_reason', instance.admin_reason)
        instance.is_seen_by_user = False
        instance.save()
        return instance