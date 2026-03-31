from rest_framework import serializers
from .models import Product, Category, Wishlist, Review, Cart, CartItem
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

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )
    item_total = serializers.SerializerMethodField()

    def get_item_total(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        price = obj.product.price
        
        if user and user.is_authenticated and getattr(user, 'is_verified_business', False):
            try:
                from b2b.models import B2BDiscountSettings
                from decimal import Decimal
                settings = B2BDiscountSettings.objects.filter(id=1).first()
                if not settings:
                    settings, _ = B2BDiscountSettings.objects.get_or_create(id=1)
                
                # REUSE BULK LOGIC
                if obj.quantity >= settings.bulk_threshold:
                    discount = settings.bulk_discount_percent
                else:
                    discount = settings.base_discount_percent
                    
                discount_factor = Decimal('1') - (discount / Decimal('100'))
                price = obj.product.price * discount_factor
            except Exception:
                pass
        
        return price * obj.quantity

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'item_total', 'added_at']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    total_items = serializers.SerializerMethodField()

    def get_total_price(self, obj):
        # Pass the request context to the CartItemSerializer to calculate item_total correctly
        # This requires creating a serializer instance for each item to access its get_item_total method
        request = self.context.get('request')
        total = sum(CartItemSerializer(item, context={'request': request}).get_item_total(item) for item in obj.items.all())
        return total

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price', 'total_items', 'updated_at']