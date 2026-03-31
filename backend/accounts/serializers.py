from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "full_name", "email", "mobile_number", 
            "address", "is_business_account", "is_verified_business", "profile_image",
        ]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'full_name', 'mobile_number', 'address', 
            'is_business_account', 'profile_image', 'password', 'confirm_password',
        ]

    def validate_full_name(self, value):
        if not any(char.isalpha() for char in value):
             raise serializers.ValidationError("Full name must contain at least one letter.")
        return value

    def validate_mobile_number(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Mobile number must be exactly 10 digits.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name'),
            mobile_number=validated_data.get('mobile_number'),
            address=validated_data.get('address'),
            is_business_account=validated_data.get('is_business_account', False),
            profile_image=validated_data.get('profile_image'),
            user_type='customer'
        )
        return user

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['user_type'] = user.user_type
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user_data = UserSerializer(self.user).data
        user_data['user_type'] = self.user.user_type
        data['user'] = user_data
        return data

class AdminUserListSerializer(serializers.ModelSerializer):
    total_orders = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'mobile_number', 
            'is_business_account', 'is_verified_business', 
            'user_type', 'date_joined', 'total_orders', 'total_spent'
        ]