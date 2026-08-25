from django.db import models
from django.core.exceptions import ValidationError

class WebsiteSettings(models.Model):
    # Basic Information
    company_name = models.CharField(max_length=255, default='Nexus Nutraceuticals')
    website_name = models.CharField(max_length=255, default='Nexus Nutraceuticals')
    tagline = models.CharField(max_length=255, blank=True, null=True)

    # Contact Information
    primary_phone = models.CharField(max_length=20, blank=True, null=True)
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True, help_text="Enter number with country code, no +, no spaces (e.g., 916357002100)")
    email_address = models.EmailField(blank=True, null=True)
    
    # Tax Settings
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00, help_text="Total GST percentage (e.g., 5.00)")
    cgst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=2.50, help_text="CGST percentage (e.g., 2.50)")
    sgst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=2.50, help_text="SGST percentage (e.g., 2.50)")

    # Social Media Links
    instagram_url = models.URLField(blank=True, null=True)
    facebook_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)

    # Marketed By Details
    marketed_by_name = models.CharField(max_length=255, default='Nexus Nutraceuticals')
    marketed_by_address = models.CharField(max_length=500, blank=True, null=True)
    marketed_by_city = models.CharField(max_length=100, default='Ahmedabad')
    marketed_by_state = models.CharField(max_length=100, default='Gujarat')
    marketed_by_pin = models.CharField(max_length=20, default='382418')
    marketed_by_country = models.CharField(max_length=100, default='India')

    # Manufactured By Details
    manufactured_by_name = models.CharField(max_length=255, default='Genix Nutraceuticals LLP')
    manufactured_by_address = models.CharField(max_length=500, blank=True, null=True)
    manufactured_by_city = models.CharField(max_length=100, blank=True, null=True)
    manufactured_by_state = models.CharField(max_length=100, default='Gujarat')
    manufactured_by_pin = models.CharField(max_length=20, blank=True, null=True)
    manufactured_by_country = models.CharField(max_length=100, default='India')

    # Business Information
    fssai_license = models.CharField(max_length=50, blank=True, null=True)
    gst_number = models.CharField(max_length=50, blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Website Settings'
        verbose_name_plural = 'Website Settings'

    def save(self, *args, **kwargs):
        if not self.pk and WebsiteSettings.objects.exists():
            raise ValidationError('There can be only one WebsiteSettings instance')
        return super(WebsiteSettings, self).save(*args, **kwargs)

    def __str__(self):
        return "Global Website Settings"
