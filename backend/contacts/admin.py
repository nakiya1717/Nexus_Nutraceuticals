from django.contrib import admin
from .models import ContactEnquiry

@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone_number', 'short_message', 'created_at', 'status')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'email', 'phone_number', 'message')
    readonly_fields = ('created_at',)
    
    def short_message(self, obj):
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    short_message.short_description = 'Message Preview'
