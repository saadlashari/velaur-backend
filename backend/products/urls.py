from django.urls import path
from .views import ProductListView, ProductDetailView, FeaturedProductsView, CategoryListView

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('featured/', FeaturedProductsView.as_view(), name='featured-products'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
]