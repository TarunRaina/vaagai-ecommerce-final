from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'full_name',
            'mobile_number',
            'address',
            'is_business_account',
            'profile_image',
            'password',
            'confirm_password',
        ]

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        user = User.objects.create_user(
            username=validated_data['email'],  # use email as username internally
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

        # Add custom fields
        token['email'] = user.email
        token['user_type'] = user.user_type

        return token
    
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "email",
            "mobile_number",
            "address",
            "is_business_account",
            "profile_image",
        ]