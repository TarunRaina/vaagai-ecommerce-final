import os
import django
import sys

# Setup django
sys.path.append('backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import connection

print(f"CONNECTED_DB: {connection.settings_dict['NAME']}")
print(f"CONNECTED_PORT: {connection.settings_dict['PORT']}")

cursor = connection.cursor()
cursor.execute("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog') ORDER BY table_schema, table_name")
tables = cursor.fetchall()
if not tables:
    print("NO_TABLES_FOUND")
else:
    for schema, name in tables:
        print(f"TABLE: {schema}.{name}")

from accounts.models import User
print(f"SUPERUSER_COUNT: {User.objects.filter(is_superuser=True).count()}")
