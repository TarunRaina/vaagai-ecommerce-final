from django.urls import path
from .views import (
    OrderCreateView,
    OrderListView,
    AdminMarkPaidView,
    CustomerMarkReceivedView,
    AdminOrderListView,
    ShippingStateListView,
    AdminShippingStateUpdateView,
    AdminMarkShippedView,
    AdminMarkDeliveredView,
    AdminUpdateLogisticsView,
    AdminOrderUnseenCountView,
    AdminMarkOrdersSeenView,
    MockPaymentInitiateView,
    MockPaymentVerifyView,
    MockPaymentCancelView,
)

urlpatterns = [
    # Mock Payment
    path('payment/mock/initiate/', MockPaymentInitiateView.as_view()),
    path('payment/mock/verify/', MockPaymentVerifyView.as_view()),
    path('payment/mock/cancel/', MockPaymentCancelView.as_view()),

    path('', OrderListView.as_view()),
    path('create/', OrderCreateView.as_view()),
    path('<int:pk>/', CustomerMarkReceivedView.as_view()), # Customer self-acknowledge
    
    # Admin
    path('admin/list/', AdminOrderListView.as_view()),
    path('admin/mark-paid/<int:pk>/', AdminMarkPaidView.as_view()),
    path('admin/mark-shipped/<int:pk>/', AdminMarkShippedView.as_view()),
    path('admin/mark-delivered/<int:pk>/', AdminMarkDeliveredView.as_view()),
    path('admin/logistics/<int:pk>/', AdminUpdateLogisticsView.as_view()),
    path('admin/shipping-states/<int:pk>/', AdminShippingStateUpdateView.as_view()),
    path('admin/unseen-count/', AdminOrderUnseenCountView.as_view()),
    path('admin/mark-seen/', AdminMarkOrdersSeenView.as_view()),
    path('shipping-states/', ShippingStateListView.as_view()),
]