import os
import shutil
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nexus_api.settings')
django.setup()

from products.models import Product, ProductVariant, PackOffer
from django.core.files import File

def seed_db():
    print("Seeding database...")
    product, _ = Product.objects.get_or_create(
        slug='vitamin-b12-d3-powder',
        defaults={
            'name': 'Nexus Vitamin B12 + D3 Powder',
            'short_description': 'Formulated to support energy metabolism, nerve health, and immunity. 100% Vegetarian and Zero Sugar.',
            'full_description': 'Nexus Nutraceuticals Vitamin B12 + D3 Powder is formulated to support your daily wellness. Our proprietary water-soluble formula is 100% vegetarian and contains zero sugar.',
            'ingredients': '<p>Vitamin B12 (Cyanocobalamin), Vitamin D3 (Cholecalciferol), Excipients</p>',
            'nutritional_information': '<p>Vitamin B12: 2.2 mcg (100% RDA)</p>',
            'directions_for_use': '<p>Mix one scoop in water or juice daily.</p>',
            'warning': '<p>If you are pregnant, nursing, taking any medications, consult your doctor before use.</p>',
            'benefits': '<p>Supports energy metabolism, nerve health, and immunity.</p>',
            'mrp': 399.00,
            'selling_price': 359.00,
            'is_featured': True
        }
    )

    # Strawberry
    strawberry, _ = ProductVariant.objects.get_or_create(
        product=product,
        slug='strawberry',
        defaults={'name': 'Strawberry', 'display_order': 1}
    )
    if not strawberry.image:
        strawberry.image.save('b12-strawberry.jpg', File(open('e:/Nexus/public/b12-strawberry.jpg', 'rb')))

    # Orange
    orange, _ = ProductVariant.objects.get_or_create(
        product=product,
        slug='orange',
        defaults={'name': 'Orange', 'display_order': 2}
    )
    if not orange.image:
        orange.image.save('b12-orange.jpg', File(open('e:/Nexus/public/b12-orange.jpg', 'rb')))

    # Pack Offers for Strawberry
    PackOffer.objects.get_or_create(variant=strawberry, quantity=1, defaults={'name': 'Buy 1', 'mrp': 399.00, 'selling_price': 359.00, 'discount_label': '10% OFF', 'display_order': 1})
    PackOffer.objects.get_or_create(variant=strawberry, quantity=2, defaults={'name': 'Buy 2', 'mrp': 798.00, 'selling_price': 678.00, 'discount_label': '15% OFF', 'display_order': 2})
    PackOffer.objects.get_or_create(variant=strawberry, quantity=3, defaults={'name': 'Buy 3', 'mrp': 1197.00, 'selling_price': 999.00, 'discount_label': 'Special', 'display_order': 3})

    # Pack Offers for Orange
    PackOffer.objects.get_or_create(variant=orange, quantity=1, defaults={'name': 'Buy 1', 'mrp': 399.00, 'selling_price': 359.00, 'discount_label': '10% OFF', 'display_order': 1})
    PackOffer.objects.get_or_create(variant=orange, quantity=2, defaults={'name': 'Buy 2', 'mrp': 798.00, 'selling_price': 678.00, 'discount_label': '15% OFF', 'display_order': 2})
    PackOffer.objects.get_or_create(variant=orange, quantity=3, defaults={'name': 'Buy 3', 'mrp': 1197.00, 'selling_price': 999.00, 'discount_label': 'Special', 'display_order': 3})

    print("Seeding complete.")

if __name__ == '__main__':
    seed_db()
