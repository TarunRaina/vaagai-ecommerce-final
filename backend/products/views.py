from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from .models import Wishlist
from .serializers import WishlistSerializer
from rest_framework.permissions import IsAuthenticated


# Public product list
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


# Product detail
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


# Admin product create
class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]


# Admin product update
class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]


# Admin product delete
class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAdminUser]

# View wishlist
class WishlistListView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)


# Add to wishlist
class WishlistCreateView(generics.CreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Remove from wishlist
class WishlistDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
