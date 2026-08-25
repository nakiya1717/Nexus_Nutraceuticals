from rest_framework import serializers
from .models import Product, ProductVariant, PackOffer

class PackOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackOffer
        fields = ['id', 'name', 'quantity', 'mrp', 'selling_price', 'discount_label', 'display_order']

class ProductVariantSerializer(serializers.ModelSerializer):
    offers = serializers.SerializerMethodField()
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'slug', 'image', 'short_description', 'display_order', 'offers']

    def get_offers(self, obj):
        # Filter only active offers
        offers = obj.offers.filter(is_active=True).order_by('display_order')
        return PackOfferSerializer(offers, many=True).data

class ProductSerializer(serializers.ModelSerializer):
    variants = serializers.SerializerMethodField()
    main_image = serializers.ImageField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'short_description', 'full_description', 'main_image',
            'mrp', 'selling_price', 'ingredients', 'nutritional_information',
            'directions_for_use', 'warning', 'benefits', 'variants'
        ]

    def get_variants(self, obj):
        # Filter only active variants
        variants = obj.variants.filter(is_active=True).order_by('display_order')
        # Pass context so that nested serializers can resolve absolute URLs for images
        return ProductVariantSerializer(variants, many=True, context=self.context).data
