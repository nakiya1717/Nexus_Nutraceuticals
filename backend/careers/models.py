import os
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

def validate_resume_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.pdf', '.doc', '.docx']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Please upload a valid PDF, DOC, or DOCX resume.')

def validate_resume_size(value):
    max_size = 5 * 1024 * 1024 # 5 MB
    if value.size > max_size:
        raise ValidationError('This file is too large. Please upload a file smaller than 5 MB.')

def resume_upload_path(instance, filename):
    # secure filename generation
    ext = filename.split('.')[-1]
    new_filename = f"resume_{instance.mobile_number}_{timezone.now().strftime('%Y%m%d%H%M%S')}.{ext}"
    return os.path.join('resumes', new_filename)

class Job(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Published', 'Published'),
        ('Closed', 'Closed'),
    ]

    job_code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True)
    title = models.CharField(max_length=255)
    department = models.CharField(max_length=255, default='Sales & Marketing')
    short_description = models.TextField()
    full_description = models.TextField()
    
    location = models.CharField(max_length=255)
    employment_type = models.CharField(max_length=100)
    workplace_type = models.CharField(max_length=100)
    experience_required = models.CharField(max_length=255)
    education_required = models.CharField(max_length=255)
    salary_display = models.CharField(max_length=255, default="As per Experience + Attractive Performance-Based Incentives")
    
    responsibilities = models.JSONField(default=list, blank=True)
    required_skills = models.JSONField(default=list, blank=True)
    preferred_skills = models.JSONField(default=list, blank=True)
    benefits = models.JSONField(default=list, blank=True)
    
    application_deadline = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    is_featured = models.BooleanField(default=False)
    
    published_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.status == 'Published' and not self.published_at:
            self.published_at = timezone.now()
        if self.status == 'Closed' and not self.closed_at:
            self.closed_at = timezone.now()
        super().save(*args, **kwargs)


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('New', 'New'),
        ('Under Review', 'Under Review'),
        ('Shortlisted', 'Shortlisted'),
        ('Interview Scheduled', 'Interview Scheduled'),
        ('Selected', 'Selected'),
        ('Rejected', 'Rejected'),
        ('Withdrawn', 'Withdrawn'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    full_name = models.CharField(max_length=255)
    mobile_number = models.CharField(max_length=20)
    email = models.EmailField()
    current_city = models.CharField(max_length=255)
    current_address = models.TextField(blank=True, null=True)
    
    highest_education = models.CharField(max_length=255)
    current_company = models.CharField(max_length=255, blank=True, null=True)
    current_job_title = models.CharField(max_length=255, blank=True, null=True)
    total_experience = models.CharField(max_length=100)
    sales_marketing_experience = models.CharField(max_length=100, blank=True, null=True)
    expected_salary = models.CharField(max_length=100)
    notice_period = models.CharField(max_length=100)
    why_join = models.TextField(blank=True, null=True)
    
    has_two_wheeler = models.BooleanField(default=False)
    comfortable_with_field_marketing = models.BooleanField(default=False)
    comfortable_with_business_visits = models.BooleanField(default=False)
    
    resume = models.FileField(upload_to=resume_upload_path, validators=[validate_resume_extension, validate_resume_size])
    consent_accepted = models.BooleanField(default=False)
    
    application_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='New')
    admin_notes = models.TextField(blank=True, null=True)
    
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.job.title}"

    class Meta:
        ordering = ['-applied_at']
