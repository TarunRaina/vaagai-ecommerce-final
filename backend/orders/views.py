from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .serializers import OrderCreateSerializer, OrderSerializer
from .models import Order

from rest_framework.permissions import IsAdminUser

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

        order.received_status = "received"
        order.save()

        return Response({"message": "Order marked as received"})
    

class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Order.objects.all().order_by("-created_at")


class AdminMarkReceivedView(generics.UpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all()

    def patch(self, request, pk):
        order = self.get_object()
        order.received_status = "received"
        order.save()

        return Response({"message": "Order marked as received"})