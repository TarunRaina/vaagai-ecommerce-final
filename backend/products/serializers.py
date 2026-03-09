from rest_framework import serializers
from .models import Product, Category, Wishlist, Review
from django.db.models import Avg, Sum, F

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    b2b_discounted_price = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    total_sales = serializers.SerializerMethodField()
    total_revenue = serializers.SerializerMethodField()

    def get_total_sales(self, obj):
        from orders.models import OrderItem
        return obj.orderitem_set.filter(order__payment_status='paid').aggregate(Sum('quantity'))['quantity__sum'] or 0

    def get_total_revenue(self, obj):
        from decimal import Decimal
        from django.db.models import F
        result = obj.orderitem_set.filter(order__payment_status='paid').aggregate(
            total=Sum(F('quantity') * F('price'))
        )['total'] or 0
        return float(result)

    def get_average_rating(self, obj):
        return obj.reviews.aggregate(Avg('rating'))['rating__avg'] or 0

    def get_review_count(self, obj):
        return obj.reviews.count()

    def get_b2b_discounted_price(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated and getattr(user, 'is_verified_business', False):
            try:
                from b2b.models import B2BDiscountSettings
                from decimal import Decimal
                settings = B2BDiscountSettings.objects.filter(id=1).first()
                if not settings:
                    settings, _ = B2BDiscountSettings.objects.get_or_create(id=1)
                
                discount_factor = Decimal('1') - (settings.base_discount_percent / Decimal('100'))
                return obj.price * discount_factor
            except Exception:
                return None
        return None

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative")
        return value

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_id', 'name', 'description', 
            'price', 'stock', 'image', 'is_active', 'created_at', 
            'b2b_discounted_price', 'reviews', 'average_rating', 'review_count',
            'total_sales', 'total_revenue',
            'material', 'finish', 'build_time', 'certification'
        ]

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'created_at']