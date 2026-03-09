import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Category, Product

# Define new categories
new_category_names = [
    "Colored Glasses",
    "PVC Doors",
    "Sliding Windows",
    "UPVC Windows",
    "WPC Doors"
]

print("--- Step 1: Creating New Categories ---")
new_cats = {}
for name in new_category_names:
    cat, created = Category.objects.get_or_create(name=name)
    new_cats[name] = cat
    if created:
        print(f"Created category: {name}")
    else:
        print(f"Category already exists: {name}")

print("\n--- Step 2: Migrating Products ---")
# Migration mapping (best guess based on names)
# ID: 1 | Name: Plywood | Products: 1 (door type wooden 1)
# ID: 3 | Name: Hardware | Products: 1 (testproduct)

prod1 = Product.objects.filter(name="door type wooden 1").first()
if prod1:
    prod1.category = new_cats["WPC Doors"]
    prod1.save()
    print(f"Migrated '{prod1.name}' to 'WPC Doors'")

prod2 = Product.objects.filter(name="testproduct").first()
if prod2:
    prod2.category = new_cats["Colored Glasses"]
    prod2.save()
    print(f"Migrated '{prod2.name}' to 'Colored Glasses'")

# If there are any other products under old categories, move them to the first new category
old_category_names = ["Plywood", "Laminates", "Hardware", "Veneers"]
for old_name in old_category_names:
    try:
        old_cat = Category.objects.get(name=old_name)
        products = Product.objects.filter(category=old_cat)
        for prod in products:
            prod.category = new_cats["WPC Doors"] # Fallback
            prod.save()
            print(f"Fallback migration: '{prod.name}' to 'WPC Doors'")
        
        print(f"\n--- Step 3: Deleting Old Category '{old_name}' ---")
        old_cat.delete()
        print(f"Deleted old category: {old_name}")
    except Category.DoesNotExist:
        print(f"Old category '{old_name}' not found or already deleted.")

print("\n--- Migration Complete ---")
