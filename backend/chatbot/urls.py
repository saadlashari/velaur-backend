from django.urls import path
from .views import ChatbotView, ChatbotConfigView, ChatbotAuthView

urlpatterns = [
    path('', ChatbotView.as_view(), name='chatbot'),
    path('config/', ChatbotConfigView.as_view(), name='chatbot-config'),
    path('auth/', ChatbotAuthView.as_view(), name='chatbot-auth'),
]