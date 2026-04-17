from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'price', 'quantity', 'subtotal']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'phone', 'total_price', 'status', 'created_at']
    list_editable = ['status']
    list_filter = ['status', 'created_at']
    search_fields = ['full_name', 'email', 'phone']
    readonly_fields = ['created_at']
    inlines = [OrderItemInline]

    # Delete allow karo
    def has_delete_permission(self, request, obj=None):
        return True

    # Add band rakho
    def has_add_permission(self, request):
        return False