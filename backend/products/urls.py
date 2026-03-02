from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    ProductCreateView,
    ProductUpdateView,
    ProductDeleteView,
)

from .views import (
    WishlistListView,
    WishlistCreateView,
    WishlistDeleteView,
)

urlpatterns = [
    path('', ProductListView.as_view()),
    path('<int:pk>/', ProductDetailView.as_view()),

    # Admin
    path('create/', ProductCreateView.as_view()),
    path('update/<int:pk>/', ProductUpdateView.as_view()),
    path('delete/<int:pk>/', ProductDeleteView.as_view()),

    # Wishlist
    path('wishlist/', WishlistListView.as_view()),
    path('wishlist/add/', WishlistCreateView.as_view()),
    path('wishlist/delete/<int:pk>/', WishlistDeleteView.as_view()),
]