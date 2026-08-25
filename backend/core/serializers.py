from rest_framework import serializers
from .models import WebsiteSettings

class WebsiteSettingsSerializer(serializers.ModelSerializer):
    whatsapp_link = serializers.SerializerMethodField()
    marketed_by = serializers.SerializerMethodField()
    manufactured_by = serializers.SerializerMethodField()

    class Meta:
        model = WebsiteSettings
        fields = [
            'company_name', 'website_name', 'tagline',
            'primary_phone', 'whatsapp_number', 'whatsapp_link', 'email_address',
            'gst_rate', 'cgst_rate', 'sgst_rate',
            'instagram_url', 'facebook_url', 'youtube_url',
            'marketed_by', 'manufactured_by',
            'fssai_license', 'gst_number'
        ]

    def get_whatsapp_link(self, obj):
        if obj.whatsapp_number:
            return f"https://wa.me/91{obj.whatsapp_number}"
        return ""

    def get_marketed_by(self, obj):
        return {
            "name": obj.marketed_by_name,
            "address": obj.marketed_by_address or "",
            "city": obj.marketed_by_city or "",
            "state": obj.marketed_by_state or "",
            "pin": obj.marketed_by_pin or "",
            "country": obj.marketed_by_country or ""
        }

    def get_manufactured_by(self, obj):
        return {
            "name": obj.manufactured_by_name,
            "address": obj.manufactured_by_address or "",
            "city": obj.manufactured_by_city or "",
            "state": obj.manufactured_by_state or "",
            "pin": obj.manufactured_by_pin or "",
            "country": obj.manufactured_by_country or ""
        }
