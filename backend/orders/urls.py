from django.urls import path
from .views import OrderCreateView, OrderListView

urlpatterns = [
    path('create/', OrderCreateView.as_view()),
    path('', OrderListView.as_view()),
]