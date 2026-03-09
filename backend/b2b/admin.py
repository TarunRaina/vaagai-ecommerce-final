from django.contrib import admin
from .models import B2BApplication, B2BDiscountSettings

@admin.register(B2BApplication)
class B2BApplicationAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'user', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('business_name', 'user__email', 'gst_number')

@admin.register(B2BDiscountSettings)
class B2BDiscountSettingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'base_discount_percent', 'bulk_threshold', 'bulk_discount_percent')
    def has_add_permission(self, request):
        return not B2BDiscountSettings.objects.exists()
