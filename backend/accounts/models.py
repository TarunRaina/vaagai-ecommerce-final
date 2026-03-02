from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    )

    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='customer')

    def __str__(self):
        return self.username