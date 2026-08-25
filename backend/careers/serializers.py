from rest_framework import serializers
from django.db import models
from .models import Job, JobApplication
from django.utils import timezone

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'job_code', 'slug', 'title', 'department', 'short_description', 'full_description',
            'location', 'employment_type', 'workplace_type', 'experience_required',
            'education_required', 'salary_display', 'responsibilities', 'required_skills',
            'preferred_skills', 'benefits', 'application_deadline', 'status', 'is_featured',
            'published_at'
        ]

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        exclude = ['application_status', 'admin_notes', 'applied_at', 'updated_at']

    def validate(self, data):
        job = data.get('job')
        if job.status != 'Published':
            raise serializers.ValidationError({"job": "This job is not currently open for applications."})
        if job.application_deadline and job.application_deadline < timezone.now():
            raise serializers.ValidationError({"job": "The application deadline for this job has passed."})
        if not data.get('consent_accepted'):
            raise serializers.ValidationError({"consent_accepted": "You must accept the consent to apply."})
        
        # Duplicate application prevention: same email or mobile for same job in last 30 days
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        recent_applications = JobApplication.objects.filter(
            job=job,
            applied_at__gte=thirty_days_ago
        ).filter(
            models.Q(email=data.get('email')) | models.Q(mobile_number=data.get('mobile_number'))
        )
        
        if recent_applications.exists():
            raise serializers.ValidationError("You have already applied for this job recently. Please wait before applying again.")
            
        return data

    def validate_full_name(self, value):
        import re
        if not value or not value.strip():
            raise serializers.ValidationError("Please enter your full name.")
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Please enter your full name.")
        if any(char.isdigit() for char in value):
            raise serializers.ValidationError("Full name should not contain numbers.")
        # Only allow letters, spaces, dots, hyphens
        if not re.match(r'^[A-Za-z\s\.\-]+$', value):
            raise serializers.ValidationError("Full name should not contain special characters.")
        return value

    def validate_mobile_number(self, value):
        import re
        if not re.match(r'^[6-9][0-9]{9}$', str(value)):
            raise serializers.ValidationError("Please enter a valid 10-digit Indian mobile number.")
        return value

    def validate_email(self, value):
        import re
        if not re.match(r'^[\w\.\+\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$', value):
            raise serializers.ValidationError("Please enter a valid email address.")
        return value
