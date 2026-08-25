from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    short_description = models.TextField(blank=True)
    full_description = models.TextField(blank=True)
    main_image = models.ImageField(upload_to='products/', blank=True, null=True)
    mrp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    # HTML/Rich Text fields for tabs
    ingredients = models.TextField(blank=True)
    nutritional_information = models.TextField(blank=True)
    directions_for_use = models.TextField(blank=True)
    warning = models.TextField(blank=True)
    benefits = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    image = models.ImageField(upload_to='products/variants/', help_text="Original product jar image")
    short_description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('product', 'slug')
        ordering = ['display_order']

    def __str__(self):
        return f"{self.product.name} - {self.name}"

class PackOffer(models.Model):
    variant = models.ForeignKey(ProductVariant, related_name='offers', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    mrp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_label = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    
    class Meta:
        unique_together = ('variant', 'quantity')
        ordering = ['display_order']

    def __str__(self):
        return f"{self.variant.name} - {self.name}"
