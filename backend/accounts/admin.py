from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    # Fields shown in admin list view
    list_display = ("username", "email", "user_type", "is_staff", "is_active")

    # Add your custom field to fieldsets
    fieldsets = UserAdmin.fieldsets + (
        ("Additional Info", {"fields": ("user_type",)}),
    )

    # Fields when creating a user in admin
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Additional Info", {"fields": ("user_type",)}),
    )