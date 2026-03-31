import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from orders.models import Order

# Legacy 'received' status was mapped to 'shipped' in the UI
# We'll also mark them as having been shipped 'now' if they don't have a date
from django.utils import timezone

orders = Order.objects.filter(received_status='received')
count = orders.count()
for order in orders:
    order.received_status = 'shipped'
    if not order.shipped_at:
        order.shipped_at = order.created_at # Approximate
    order.save()

print(f"Updated {count} legacy orders from 'received' to 'shipped'")
