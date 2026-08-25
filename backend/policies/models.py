from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

class PolicyContact(models.Model):
    company_name = models.CharField(max_length=255)
    support_email = models.EmailField(blank=True, null=True)
    support_phone = models.CharField(max_length=50, blank=True, null=True)
    support_whatsapp = models.CharField(max_length=50, blank=True, null=True)
    business_address = models.TextField(blank=True, null=True)
    contact_page_url = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name
    
    class Meta:
        verbose_name_plural = "Policy Contacts"

class Policy(models.Model):
    STATUS_CHOICES = (
        ('Draft', 'Draft'),
        ('Published', 'Published'),
        ('Unpublished', 'Unpublished'),
    )
    
    slug = models.SlugField(unique=True, max_length=255)
    title = models.CharField(max_length=255)
    short_description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True, help_text="CSS class or name for the icon")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    published_at = models.DateTimeField(blank=True, null=True)
    last_updated_at = models.DateTimeField(auto_now=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    canonical_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Optional link to contact info to render dynamically at the bottom
    contact_info = models.ForeignKey(PolicyContact, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Policies"
        indexes = [
            models.Index(fields=['slug', 'status']),
        ]

    def save(self, *args, **kwargs):
        if self.status == 'Published' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class PolicySection(models.Model):
    policy = models.ForeignKey(Policy, related_name='sections', on_delete=models.CASCADE)
    section_number = models.CharField(max_length=20, blank=True, null=True)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.policy.title} - {self.title}"

    class Meta:
        ordering = ['display_order']
        indexes = [
            models.Index(fields=['policy', 'display_order', 'is_active']),
        ]


class PolicyContentItem(models.Model):
    ITEM_TYPES = (
        ('paragraph', 'Paragraph'),
        ('bullet_list', 'Bullet List'),
        ('numbered_list', 'Numbered List'),
        ('information_card', 'Information Card'),
        ('warning_card', 'Warning Card'),
        ('important_notice', 'Important Notice'),
        ('timeline_step', 'Timeline Step'),
        ('delivery_card', 'Delivery Card'),
        ('eligibility_card', 'Eligibility Card'),
        ('contact_card', 'Contact Card'),
    )
    
    policy_section = models.ForeignKey(PolicySection, related_name='items', on_delete=models.CASCADE)
    item_type = models.CharField(max_length=50, choices=ITEM_TYPES, default='paragraph')
    title = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.policy_section.title} - {self.item_type}"

    class Meta:
        ordering = ['display_order']


class PolicyVersion(models.Model):
    policy = models.ForeignKey(Policy, on_delete=models.CASCADE, related_name='versions')
    version_number = models.PositiveIntegerField()
    policy_snapshot = models.JSONField()
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    change_summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.policy.title} - v{self.version_number}"


class PolicyAuditLog(models.Model):
    policy = models.ForeignKey(Policy, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=255)
    previous_data = models.JSONField(blank=True, null=True)
    new_data = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} on {self.policy.title if self.policy else 'Unknown'} at {self.created_at}"
