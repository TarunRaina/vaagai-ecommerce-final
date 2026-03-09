from rest_framework import generics, permissions
from django.db.models import Count, Sum
from .models import User
from .serializers import AdminUserListSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

class IsAdminUserType(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.user_type == 'admin'

class AdminUserListView(generics.ListAPIView):
    serializer_class = AdminUserListSerializer
    permission_classes = [IsAdminUserType]

    def get_queryset(self):
        return User.objects.filter(user_type='customer').annotate(
            total_orders=Count('orders', distinct=True),
            total_spent=Sum('orders__total_amount')
        ).order_by('-date_joined')

class AdminUserOrderDetailView(APIView):
    permission_classes = [IsAdminUserType]

    def get(self, request, user_id):
        # Import Order here to avoid circular imports if any
        from orders.models import Order
        from orders.serializers import OrderSerializer # Assuming it exists

        orders = Order.objects.filter(user_id=user_id).order_by('-created_at')
        # We'll use a simple list for now if OrderSerializer isn't easily available or complex
        data = [{
            'id': o.id,
            'total_amount': o.total_amount,
            'payment_status': o.payment_status,
            'received_status': o.received_status,
            'created_at': o.created_at,
            'order_type': o.order_type
        } for o in orders]
        
        return Response(data)
