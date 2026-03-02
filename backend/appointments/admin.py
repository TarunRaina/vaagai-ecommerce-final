from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "date", "time", "status", "created_at")
    list_filter = ("status", "date", "created_at")
    search_fields = ("user__username",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)

    fieldsets = (
        ("Appointment Info", {
            "fields": ("user", "date", "time", "status")
        }),
        ("Metadata", {
            "fields": ("created_at",)
        }),
    )