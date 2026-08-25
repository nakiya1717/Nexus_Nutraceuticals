from rest_framework import serializers
from .models import Policy, PolicySection, PolicyContentItem, PolicyContact

class PolicyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyContact
        fields = ['company_name', 'support_email', 'support_phone', 'support_whatsapp', 'business_address', 'contact_page_url']

class PolicyContentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyContentItem
        fields = ['id', 'item_type', 'title', 'content', 'icon', 'display_order']

class PolicySectionSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = PolicySection
        fields = ['id', 'section_number', 'title', 'subtitle', 'content', 'icon', 'display_order', 'items']

    def get_items(self, obj):
        # Only return active items ordered by display_order
        active_items = obj.items.filter(is_active=True).order_by('display_order')
        return PolicyContentItemSerializer(active_items, many=True).data

class PolicySerializer(serializers.ModelSerializer):
    contact_info = PolicyContactSerializer(read_only=True)
    sections = serializers.SerializerMethodField()

    class Meta:
        model = Policy
        fields = [
            'slug', 'title', 'short_description', 'icon', 'status', 'published_at',
            'last_updated_at', 'meta_title', 'meta_description', 'canonical_url',
            'contact_info', 'sections'
        ]

    def get_sections(self, obj):
        # Only return active sections ordered by display_order
        active_sections = obj.sections.filter(is_active=True).order_by('display_order')
        return PolicySectionSerializer(active_sections, many=True).data
