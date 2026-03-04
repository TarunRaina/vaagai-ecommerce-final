from rest_framework import serializers
from .models import Order, OrderItem
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
                        delivery_address=validated_data.get("delivery_address", "")
                    )

            total_amount = 0

            for item in items_data:
                product = Product.objects.get(id=item['product_id'])

                if product.stock < item['quantity']:
                    raise serializers.ValidationError(
                        f"Insufficient stock for {product.name}"
                    )

                product.stock -= item['quantity']
                product.save()

                price = product.price
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

        return order


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name")

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "payment_status",
            "received_status",
            "total_amount",
            "created_at",
            "items",
        ]