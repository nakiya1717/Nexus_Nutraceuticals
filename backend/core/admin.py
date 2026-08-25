from django.contrib import admin
from .models import WebsiteSettings

@admin.register(WebsiteSettings)
class WebsiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Basic Information', {
            'fields': ('company_name', 'website_name', 'tagline')
        }),
        ('Contact Information', {
            'fields': ('primary_phone', 'whatsapp_number', 'email_address')
        }),
        ('Social Media', {
            'fields': ('instagram_url', 'facebook_url', 'youtube_url')
        }),
        ('Marketed By', {
            'fields': ('marketed_by_name', 'marketed_by_address', 'marketed_by_city', 'marketed_by_state', 'marketed_by_pin', 'marketed_by_country')
        }),
        ('Manufactured By', {
            'fields': ('manufactured_by_name', 'manufactured_by_address', 'manufactured_by_city', 'manufactured_by_state', 'manufactured_by_pin', 'manufactured_by_country')
        }),
        ('Business Information', {
            'fields': ('fssai_license', 'gst_number')
        }),
    )

    def has_add_permission(self, request):
        # Enforce singleton: disable add if an instance already exists
        if WebsiteSettings.objects.exists():
            return False
        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        # Prevent deleting the only instance
        return False
