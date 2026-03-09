from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    USER_TYPE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    )

    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='customer'
    )

    email = models.EmailField(unique=True)

    full_name = models.CharField(max_length=255)

    address = models.TextField(blank=True, null=True)

    mobile_number = models.CharField(max_length=15)

    is_business_account = models.BooleanField(default=False)
    is_verified_business = models.BooleanField(default=False)

    profile_image = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    def save(self, *args, **kwargs):
    # Automatically set user_type to admin if superuser
        if self.is_superuser:
            self.user_type = 'admin'
        super().save(*args, **kwargs)