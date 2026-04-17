from django.contrib import admin
from django.utils.html import format_html
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['order', 'method', 'sender_number', 'transaction_number', 'status', 'payment_screenshot', 'created_at']
    list_editable = ['status']
    list_filter = ['status', 'method']
    readonly_fields = ['order', 'method', 'transaction_number', 'sender_number', 'show_screenshot', 'created_at']

    def has_add_permission(self, request):
        return False

    def payment_screenshot(self, obj):
        if obj.screenshot:
            return format_html('<a href="{}" target="_blank">📸 View</a>', obj.screenshot.url)
        return "No screenshot"
    payment_screenshot.short_description = 'Screenshot'

    def show_screenshot(self, obj):
        if obj.screenshot:
            return format_html('<img src="{}" style="max-width:400px; max-height:400px;" />', obj.screenshot.url)
        return "No screenshot uploaded"
    show_screenshot.short_description = 'Payment Screenshot'

    fields = ['order', 'method', 'sender_number', 'transaction_number', 'show_screenshot', 'status', 'created_at']