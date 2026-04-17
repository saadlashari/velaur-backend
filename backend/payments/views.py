from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .models import Payment
from .serializers import PaymentSerializer

class SubmitPaymentView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.AllowAny]

class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Payment.objects.all()

class PaymentInfoView(APIView):
    """Returns merchant numbers for EasyPaisa and JazzCash"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            'easypaisa': {
                'number': settings.EASYPAISA_NUMBER,
                'account_name': 'Velaur Fragrances',
            },
            'jazzcash': {
                'number': settings.JAZZCASH_NUMBER,
                'account_name': 'Velaur Fragrances',
            },
            'instructions': [
                'Select your preferred payment method',
                'Send the exact amount to the number shown',
                'Enter your transaction ID',
                'Upload a screenshot of the payment confirmation',
                'We will verify and confirm your order within 1-2 hours',
            ]
        })