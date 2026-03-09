import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Category, Product

print("--- Existing Categories ---")
categories = Category.objects.all()
for cat in categories:
    product_count = Product.objects.filter(category=cat).count()
    print(f"ID: {cat.id} | Name: {cat.name} | Products: {product_count}")

print("\n--- Products and their Categories ---")
products = Product.objects.all()
for prod in products:
    print(f"Product: {prod.name} | Category: {prod.category.name}")
