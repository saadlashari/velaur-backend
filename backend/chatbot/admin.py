from django.contrib import admin
from .models import ChatbotConfig, FAQ, StorePolicy, CustomReply, ChatSession


@admin.register(ChatbotConfig)
class ChatbotConfigAdmin(admin.ModelAdmin):
    list_display = ['bot_name', 'easypaisa_number', 'jazzcash_number', 'is_active', 'updated_at']
    fieldsets = (
        ('Bot Settings', {
            'fields': ('bot_name', 'welcome_message', 'is_active')
        }),
        ('EasyPaisa', {
            'fields': ('easypaisa_number', 'easypaisa_account_name'),
            'classes': ('wide',)
        }),
        ('JazzCash', {
            'fields': ('jazzcash_number', 'jazzcash_account_name'),
            'classes': ('wide',)
        }),
    )

    def has_add_permission(self, request):
        # Only one config allowed
        return not ChatbotConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'priority', 'is_active', 'created_at']
    list_editable = ['priority', 'is_active']
    search_fields = ['question', 'answer', 'keywords']
    list_filter = ['is_active']


@admin.register(StorePolicy)
class StorePolicyAdmin(admin.ModelAdmin):
    list_display = ['title', 'policy_type', 'is_active']
    list_editable = ['is_active']
    list_filter = ['policy_type', 'is_active']


@admin.register(CustomReply)
class CustomReplyAdmin(admin.ModelAdmin):
    list_display = ['trigger_phrase', 'priority', 'is_active']
    list_editable = ['priority', 'is_active']
    search_fields = ['trigger_phrase', 'reply']


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'user', 'checkout_step', 'created_at']
    readonly_fields = ['session_id', 'user', 'jwt_token', 'cart_data', 'checkout_step', 'pending_order_data', 'created_at']
    list_filter = ['checkout_step']

    def has_add_permission(self, request):
        return False