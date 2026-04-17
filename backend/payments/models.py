from django.db import models
from orders.models import Order

class Payment(models.Model):
    METHOD_CHOICES = [
        ('easypaisa', 'EasyPaisa'),
        ('jazzcash', 'JazzCash'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    transaction_number = models.CharField(max_length=100, help_text='Transaction ID from EasyPaisa/JazzCash')
    sender_number = models.CharField(max_length=20, help_text='Mobile number used for payment')
    screenshot = models.ImageField(upload_to='payment_screenshots/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order #{self.order.id} - {self.method} - {self.status}"