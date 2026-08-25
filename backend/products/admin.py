from django.contrib import admin
from .models import Product, ProductVariant, PackOffer

class ProductVariantInline(admin.StackedInline):
    model = ProductVariant
    extra = 1
    prepopulated_fields = {'slug': ('name',)}
    show_change_link = True # Allows clicking through to variant to edit offers

class PackOfferInline(admin.TabularInline):
    model = PackOffer
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'is_featured', 'updated_at')
    list_filter = ('is_active', 'is_featured')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductVariantInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'is_active', 'is_featured', 'main_image', 'mrp', 'selling_price')
        }),
        ('Descriptions', {
            'fields': ('short_description', 'full_description')
        }),
        ('Content Tabs', {
            'fields': ('ingredients', 'nutritional_information', 'directions_for_use', 'warning', 'benefits')
        }),
    )

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'name', 'slug', 'is_active', 'display_order')
    list_filter = ('is_active', 'product')
    search_fields = ('name', 'product__name')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [PackOfferInline]

@admin.register(PackOffer)
class PackOfferAdmin(admin.ModelAdmin):
    list_display = ('variant', 'name', 'quantity', 'mrp', 'selling_price', 'is_active', 'display_order')
    list_filter = ('is_active', 'variant__product', 'variant')
    search_fields = ('name', 'variant__name')
