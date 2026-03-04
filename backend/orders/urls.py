from django.urls import path
from .views import (
    OrderCreateView,
    OrderListView,
    AdminMarkPaidView,
    CustomerMarkReceivedView,
)

urlpatterns = [
    path("create/", OrderCreateView.as_view()),
    path("", OrderListView.as_view()),

    # Admin
    path("admin/mark-paid/<int:pk>/", AdminMarkPaidView.as_view()),

    # Customer
    path("mark-received/<int:pk>/", CustomerMarkReceivedView.as_view()),
]