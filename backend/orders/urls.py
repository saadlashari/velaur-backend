from django.urls import path
from .views import CreateOrderView, UserOrderListView, OrderDetailView

urlpatterns = [
    path('', CreateOrderView.as_view(), name='create-order'),
    path('my-orders/', UserOrderListView.as_view(), name='user-orders'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]