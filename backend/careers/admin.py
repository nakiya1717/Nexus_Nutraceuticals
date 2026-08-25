from django.contrib import admin
from django.utils.html import format_html
from .models import Job, JobApplication

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'location', 'is_featured', 'application_deadline')
    list_filter = ('status', 'is_featured', 'employment_type')
    search_fields = ('title', 'slug', 'job_code')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Basic Info', {
            'fields': ('job_code', 'title', 'slug', 'department', 'short_description', 'full_description')
        }),
        ('Job Details', {
            'fields': ('location', 'employment_type', 'workplace_type', 'experience_required', 'education_required', 'salary_display')
        }),
        ('Dynamic Lists (JSON arrays of strings)', {
            'fields': ('responsibilities', 'required_skills', 'preferred_skills', 'benefits')
        }),
        ('Status & Publishing', {
            'fields': ('status', 'is_featured', 'application_deadline', 'published_at', 'closed_at')
        })
    )

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'mobile_number', 'email', 'job', 'total_experience', 'expected_salary', 'has_two_wheeler', 'application_status', 'applied_at')
    list_filter = ('application_status', 'job', 'has_two_wheeler', 'comfortable_with_field_marketing')
    search_fields = ('full_name', 'mobile_number', 'email')
    readonly_fields = ('applied_at', 'updated_at', 'consent_accepted')
    fieldsets = (
        ('Candidate Details', {
            'fields': ('job', 'full_name', 'mobile_number', 'email', 'current_city', 'current_address')
        }),
        ('Professional Details', {
            'fields': ('highest_education', 'current_company', 'current_job_title', 'total_experience', 'sales_marketing_experience', 'expected_salary', 'notice_period')
        }),
        ('Screening Questions', {
            'fields': ('why_join', 'has_two_wheeler', 'comfortable_with_field_marketing', 'comfortable_with_business_visits')
        }),
        ('Resume & Consent', {
            'fields': ('resume', 'consent_accepted')
        }),
        ('Administration', {
            'fields': ('application_status', 'admin_notes', 'applied_at', 'updated_at')
        })
    )
