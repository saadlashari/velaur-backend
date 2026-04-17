from django.db import models


class ChatbotConfig(models.Model):
    """Admin controls payment numbers and global settings"""
    easypaisa_number = models.CharField(max_length=20, default='03XX-XXXXXXX')
    easypaisa_account_name = models.CharField(max_length=100, default='Velaur Fragrances')
    jazzcash_number = models.CharField(max_length=20, default='03XX-XXXXXXX')
    jazzcash_account_name = models.CharField(max_length=100, default='Velaur Fragrances')
    welcome_message = models.TextField(
        default='🌹 Welcome to Velaur! I am Vera, your luxury fragrance assistant. How can I help you today?'
    )
    bot_name = models.CharField(max_length=50, default='Vera')
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Chatbot Configuration'
        verbose_name_plural = 'Chatbot Configuration'

    def __str__(self):
        return 'Chatbot Config'

    def save(self, *args, **kwargs):
        # Only one config allowed
        self.pk = 1
        super().save(*args, **kwargs)


class FAQ(models.Model):
    question = models.CharField(max_length=300)
    answer = models.TextField()
    keywords = models.CharField(
        max_length=300,
        help_text='Comma separated keywords e.g: delivery,shipping,time',
        blank=True
    )
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=0, help_text='Higher number = higher priority')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-priority']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question


class StorePolicy(models.Model):
    POLICY_TYPES = [
        ('delivery', 'Delivery Policy'),
        ('refund', 'Refund Policy'),
        ('exchange', 'Exchange Policy'),
        ('payment', 'Payment Policy'),
        ('general', 'General Policy'),
    ]
    policy_type = models.CharField(max_length=20, choices=POLICY_TYPES)
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Store Policy'
        verbose_name_plural = 'Store Policies'

    def __str__(self):
        return f'{self.get_policy_type_display()} - {self.title}'


class CustomReply(models.Model):
    """Admin can override AI responses for specific triggers"""
    trigger_phrase = models.CharField(
        max_length=200,
        help_text='When user says this phrase, use custom reply'
    )
    reply = models.TextField()
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=0)

    class Meta:
        ordering = ['-priority']
        verbose_name = 'Custom Reply'
        verbose_name_plural = 'Custom Replies'

    def __str__(self):
        return self.trigger_phrase


class ChatSession(models.Model):
    """Track chat sessions"""
    session_id = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        'users.CustomUser',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    jwt_token = models.TextField(blank=True)
    cart_data = models.JSONField(default=dict)
    checkout_step = models.CharField(max_length=50, default='idle')
    pending_order_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Session {self.session_id}'