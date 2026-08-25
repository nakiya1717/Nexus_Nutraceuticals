from django.db import models

class ContactEnquiry(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Contacted', 'Contacted'),
        ('Follow-up', 'Follow-up'),
        ('Resolved', 'Resolved'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='New')

    class Meta:
        verbose_name_plural = 'Contact Enquiries'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.email}"
