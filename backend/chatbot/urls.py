from django.urls import path
from .views import ChatbotView, ChatbotConfigView, ChatbotAuthView
from .views import chatbot_config


urlpatterns = [
    path('', ChatbotView.as_view(), name='chatbot'),
    path('config/', ChatbotConfigView.as_view(), name='chatbot-config'),
    path('auth/', ChatbotAuthView.as_view(), name='chatbot-auth'),
    path('config/', chatbot_config, name='chatbot-config'),
]