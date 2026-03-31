from rest_framework import serializers
from .models import Order, OrderItem, ShippingState
from products.models import Product
from django.db import transaction


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField()


class OrderCreateSerializer(serializers.Serializer):
    items = OrderItemCreateSerializer(many=True)

    order_type = serializers.CharField()
    installation_type = serializers.CharField()
    delivery_method = serializers.CharField()
    payment_method = serializers.CharField()
    delivery_address = serializers.CharField(required=False, allow_blank=True)
    pincode = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        if data.get("delivery_method") == "home_delivery":
            pincode = data.get("pincode")
            if not pincode:
                raise serializers.ValidationError({"pincode": "Pincode is required for home delivery."})
            
            if not pincode.isdigit() or len(pincode) != 6:
                raise serializers.ValidationError({"pincode": "Invalid pincode format. Must be 6 digits."})

            # Check if state is served
            from .utils import get_states_from_pincode
            possible_states = get_states_from_pincode(pincode)
            if not possible_states:
                raise serializers.ValidationError({"pincode": "Invalid or unsupported pincode region."})

            # Check if any of these states are active in our DB
            active_shipping_states = ShippingState.objects.filter(is_active=True).values_list('name', flat=True)
            is_served = any(state in active_shipping_states for state in possible_states)

            if not is_served:
                raise serializers.ValidationError({"pincode": f"Delivery currently not available for this region ({', '.join(possible_states)})."})

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        items_data = validated_data['items']

        with transaction.atomic():
            order = Order.objects.create(
                        user=user,
                        order_type=validated_data["order_type"],
                        installation_type=validated_data["installation_type"],
                        delivery_method=validated_data["delivery_method"],
                        payment_method=validated_data["payment_method"],
                        delivery_address=validated_data.get("delivery_address", ""),
                        pincode=validated_data.get("pincode", "")
                    )

            total_amount = 0

            # Fetch B2B Settings
            from b2b.models import B2BDiscountSettings
            b2b_settings, _ = B2BDiscountSettings.objects.get_or_create(id=1)
            
            is_b2b = user.is_verified_business

            for item in items_data:
                product = Product.objects.get(id=item['product_id'])

                if product.stock < item['quantity']:
                    raise serializers.ValidationError(
                        f"Insufficient stock for {product.name}"
                    )

                product.stock -= item['quantity']
                product.save()

                price = product.price
                
                # Apply B2B Discounts
                if is_b2b:
                    if item['quantity'] >= b2b_settings.bulk_threshold:
                        discount = b2b_settings.bulk_discount_percent
                    else:
                        discount = b2b_settings.base_discount_percent
                    
                    price = price * (1 - (discount / 100))

                total_price = price * item['quantity']
                total_amount += total_price

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item['quantity'],
                    price=price
                )

            order.total_amount = total_amount
            order.save()

            # --- CLEAR CART ---
            from products.models import Cart
            try:
                cart = Cart.objects.get(user=user)
                cart.items.all().delete()
            except Cart.DoesNotExist:
                pass

        return order


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name")
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "product_image", "quantity", "price"]

    def get_product_image(self, obj):
        if obj.product.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
            return obj.product.image.url
        return None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.full_name", read_only=True)
    user_phone = serializers.CharField(source="user.mobile_number", read_only=True)
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "user_email",
            "user_name",
            "user_phone",
            "order_type",
            "installation_type",
            "delivery_method",
            "payment_method",
            "delivery_address",
            "pincode",
            "payment_status",
            "received_status",
            "total_amount",
            "total_items",
            "estimated_delivery",
            "shipped_at",
            "delivered_at",
            "created_at",
            "items",
        ]

    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

class ShippingStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingState
        fields = ['id', 'name', 'is_active']