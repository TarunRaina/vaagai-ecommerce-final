from rest_framework import serializers
from .models import B2BApplication, B2BDiscountSettings
from accounts.models import User

class B2BApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = B2BApplication
        fields = [
            'id', 'user_email', 'user_full_name', 'business_name', 
            'gst_number', 'business_type', 'business_address', 
            'contact_number', 'status', 'admin_notes', 'created_at'
        ]
        read_only_fields = ['status', 'admin_notes', 'created_at']

class B2BReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = B2BApplication
        fields = ['status', 'admin_notes']

class B2BDiscountSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = B2BDiscountSettings
        fields = '__all__'
