from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class Appointment(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments'
    )

    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    admin_reason = models.TextField(blank=True, null=True)
    user_note = models.TextField(blank=True, null=True)

    is_seen_by_admin = models.BooleanField(default=False)
    is_seen_by_user = models.BooleanField(default=True) # User books, so user has seen it.

    def __str__(self):
        return f"{self.user.username} - {self.date} {self.time}"
    def check_and_expire(self):
        if self.status == 'pending':
            if timezone.now() > self.created_at + timedelta(hours=24):
                self.status = 'expired'
                self.save()