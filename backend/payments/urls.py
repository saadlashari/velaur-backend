from django.urls import path
from .views import SubmitPaymentView, PaymentDetailView, PaymentInfoView

urlpatterns = [
    path('', SubmitPaymentView.as_view(), name='submit-payment'),
    path('info/', PaymentInfoView.as_view(), name='payment-info'),
    path('<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
]