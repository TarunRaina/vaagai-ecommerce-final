from rest_framework import generics, status, views
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .serializers import OrderCreateSerializer, OrderSerializer, ShippingStateSerializer
from .models import Order, ShippingState
from django.utils import timezone

# Create order
class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated]


# List orders (for customer)
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


# Admin marks payment as paid
class AdminMarkPaidView(generics.UpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all()

    def patch(self, request, pk):
        order = self.get_object()
        order.payment_status = "paid"
        order.save()

        return Response({"message": "Payment marked as paid"})


# Customer marks order as received
class CustomerMarkReceivedView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()

    def patch(self, request, pk):

        order = self.get_object()

        # Only order owner can update
        if order.user != request.user:
            return Response(
                {"error": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Payment must be done first
        if order.payment_status != "paid":
            return Response(
                {"error": "Order not paid yet"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.received_status = "delivered"
        order.delivered_at = timezone.now()
        order.save()

        return Response({"message": "Order marked as received"})
    

class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Order.objects.all().order_by("-created_at")


class AdminMarkShippedView(generics.UpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all()

    def patch(self, request, pk):
        order = self.get_object()
        order.received_status = "shipped"
        order.shipped_at = timezone.now()
        order.save()
        return Response({"message": "Order marked as shipped", "shipped_at": order.shipped_at})

class AdminMarkDeliveredView(generics.UpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all()

    def patch(self, request, pk):
        order = self.get_object()
        order.received_status = "delivered"
        order.delivered_at = timezone.now()
        order.save()
        return Response({"message": "Order marked as delivered", "delivered_at": order.delivered_at})

class AdminUpdateLogisticsView(generics.UpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all()

    def patch(self, request, pk):
        order = self.get_object()
        estimated_delivery = request.data.get('estimated_delivery')
        if estimated_delivery:
            order.estimated_delivery = estimated_delivery
        
        order.save()
        return Response(OrderSerializer(order).data)

class ShippingStateListView(generics.ListAPIView):
    queryset = ShippingState.objects.all().order_by('name')
    serializer_class = ShippingStateSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class AdminShippingStateUpdateView(generics.UpdateAPIView):
    queryset = ShippingState.objects.all()
    serializer_class = ShippingStateSerializer
    permission_classes = [IsAdminUser]

    def patch(self, request, *args, **kwargs):
        state = self.get_object()
        state.is_active = request.data.get('is_active', state.is_active)
        state.save()
        return Response(ShippingStateSerializer(state).data)

class AdminOrderUnseenCountView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        count = Order.objects.filter(is_seen=False).count()
        return Response({"unseen_count": count})

class AdminMarkOrdersSeenView(views.APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        Order.objects.filter(is_seen=False).update(is_seen=True)
        return Response({"message": "All orders marked as seen"})

# Mock Payment Integration
class MockPaymentInitiateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # We reuse OrderCreateSerializer to create the order
        # It handles stock reduction and cart clearing
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        return Response({
            "status": "success",
            "order_id": order.id,
            "transaction_id": f"TXN_MOCK_{order.id}_{int(timezone.now().timestamp())}",
            "amount": order.total_amount
        }, status=status.HTTP_201_CREATED)

class MockPaymentVerifyView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        
        try:
            order = Order.objects.get(id=order_id, user=request.user)
            order.payment_status = "paid"
            order.save()
            return Response({"status": "success", "message": "Payment verified and order finalized."})
        except Order.DoesNotExist:
            return Response({"status": "error", "message": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

class MockPaymentCancelView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        try:
            order = Order.objects.get(id=order_id, user=request.user, payment_status="unpaid")
            order.delete()
            return Response({"status": "success", "message": "Order cancelled and removed."})
        except Order.DoesNotExist:
            return Response({"status": "error", "message": "Order not found or already processed."}, status=status.HTTP_404_NOT_FOUND)