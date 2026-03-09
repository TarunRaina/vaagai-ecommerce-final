from django.db import models
from django.conf import settings

class B2BApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='b2b_application'
    )
    business_name = models.CharField(max_length=255)
    gst_number = models.CharField(max_length=15)
    business_type = models.CharField(max_length=100)
    business_address = models.TextField()
    contact_number = models.CharField(max_length=15)
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    admin_notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.business_name} ({self.user.email})"

class B2BDiscountSettings(models.Model):
    base_discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=10.00)
    bulk_threshold = models.PositiveIntegerField(default=10)
    bulk_discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=18.00)

    class Meta:
        verbose_name = "B2B Discount Settings"
        verbose_name_plural = "B2B Discount Settings"

    def __str__(self):
        return "Global B2B Discount Settings"
