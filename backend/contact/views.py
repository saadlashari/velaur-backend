from rest_framework import generics, permissions, serializers
from .models import ContactMessage

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'created_at']
        read_only_fields = ['created_at']

class ContactView(generics.CreateAPIView):
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny]