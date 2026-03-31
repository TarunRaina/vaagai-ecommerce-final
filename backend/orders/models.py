from django.db import models
from django.conf import settings
from products.models import Product

class ShippingState(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Order(models.Model):

    PAYMENT_STATUS = (
        ('unpaid', 'Amount Unpaid'),
        ('paid', 'Amount Paid'),
    )

    DELIVERY_STATUS = (
        ('pending', 'Pending'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
    )

    ORDER_TYPE = (
        ('individual', 'Individual'),
        ('b2b', 'Business'),
    )

    INSTALLATION_TYPE = (
        ('installation_required', 'Worker Installation Required'),
        ('product_only', 'Product Only'),
    )

    DELIVERY_METHOD = (
        ('home_delivery', 'Home Delivery'),
        ('shop_pickup', 'Shop Pickup'),
    )

    PAYMENT_METHOD = (
        ('cod', 'Cash On Delivery'),
        ('razorpay', 'Razorpay'),
        ('online', 'Online Payment (Mock)'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )

    order_type = models.CharField(max_length=20, choices=ORDER_TYPE)

    installation_type = models.CharField(max_length=30, choices=INSTALLATION_TYPE)

    delivery_method = models.CharField(max_length=20, choices=DELIVERY_METHOD)

    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD)

    # ⭐ NEW FIELD
    delivery_address = models.TextField(blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    is_seen = models.BooleanField(default=False)

    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default='unpaid'
    )

    received_status = models.CharField(
        max_length=20,
        choices=DELIVERY_STATUS,
        default='pending'
    )

    estimated_delivery = models.DateField(blank=True, null=True)
    shipped_at = models.DateTimeField(blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-default pincode for Shop Pickups if not provided
        if self.delivery_method == 'shop_pickup' and not self.pincode:
            self.pincode = '638112' # Default to Perundurai (Tamil Nadu)
        super().save(*args, **kwargs)
    
class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT
    )

    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"