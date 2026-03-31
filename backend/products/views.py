from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product, Category, Wishlist, Review, Cart, CartItem
from .serializers import (
    ProductSerializer, 
    CategorySerializer, 
    WishlistSerializer, 
    ReviewSerializer,
    CartSerializer,
    CartItemSerializer
)
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly


# Public product list
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


# Product detail (Public)
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer

# Admin product detail (Includes deactivated)
class AdminProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]


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

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

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

# --- CART VIEWS ---

class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        if product.stock < quantity:
            return Response({"error": "Not enough stock"}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        
        cart_item.save()
        return Response(CartSerializer(cart, context={'request': request}).data, status=status.HTTP_200_OK)

class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, item_pk):
        try:
            cart_item = CartItem.objects.get(pk=item_pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if quantity is not None:
            quantity = int(quantity)
            if quantity <= 0:
                cart_item.delete()
            else:
                if cart_item.product.stock < quantity:
                    return Response({"error": "Not enough stock"}, status=status.HTTP_400_BAD_REQUEST)
                cart_item.quantity = quantity
                cart_item.save()

        return Response(CartSerializer(cart_item.cart, context={'request': request}).data, status=status.HTTP_200_OK)

    def delete(self, request, item_pk):
        try:
            cart_item = CartItem.objects.get(pk=item_pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        cart = cart_item.cart
        cart_item.delete()
        return Response(CartSerializer(cart, context={'request': request}).data, status=status.HTTP_200_OK)


# Remove from wishlist
class WishlistDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

# Product Reviews
class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['product_id'])

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            product_id=self.kwargs['product_id']
        )

class AdminProductListView(generics.ListAPIView):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]

from .models import Category
from .serializers import CategorySerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]