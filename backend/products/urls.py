from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    AdminProductDetailView,
    ProductCreateView,
    ProductUpdateView,
    ProductDeleteView,
    AdminProductListView,
    CategoryListView,
    ReviewListCreateView,
    CartDetailView,
    AddToCartView,
    UpdateCartItemView,
    WishlistListView,
    WishlistCreateView,
    WishlistDeleteView
)

urlpatterns = [
    path('', ProductListView.as_view()),
    path('<int:pk>/', ProductDetailView.as_view()),
    path('<int:product_id>/reviews/', ReviewListCreateView.as_view()),


    path('categories/', CategoryListView.as_view()),
    # Admin
    path('admin/list/', AdminProductListView.as_view()),
    path('admin/<int:pk>/', AdminProductDetailView.as_view()),
    path('create/', ProductCreateView.as_view()),
    path('update/<int:pk>/', ProductUpdateView.as_view()),
    path('delete/<int:pk>/', ProductDeleteView.as_view()),

    # Wishlist
    path('wishlist/', WishlistListView.as_view()),
    path('wishlist/add/', WishlistCreateView.as_view()),
    path('wishlist/delete/<int:pk>/', WishlistDeleteView.as_view()),

    # Cart
    path('cart/', CartDetailView.as_view()),
    path('cart/add/', AddToCartView.as_view()),
    path('cart/item/<int:item_pk>/', UpdateCartItemView.as_view()),

]