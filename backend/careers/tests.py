import io
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Job, JobApplication
from django.utils import timezone
from django.core.management import call_command

class CareersTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.published_job = Job.objects.create(
            slug='marketing-sales-executive',
            title='Marketing & Sales Executive',
            short_description='Join us',
            full_description='Long desc',
            status='Published'
        )
        self.draft_job = Job.objects.create(
            slug='draft-job',
            title='Draft Job',
            short_description='Draft',
            full_description='Draft desc',
            status='Draft'
        )
        self.closed_job = Job.objects.create(
            slug='closed-job',
            title='Closed Job',
            short_description='Closed',
            full_description='Closed desc',
            status='Closed'
        )
        self.deadline_job = Job.objects.create(
            slug='deadline-job',
            title='Deadline Job',
            short_description='Deadline',
            full_description='Deadline desc',
            status='Published',
            application_deadline=timezone.now() - timezone.timedelta(days=1)
        )

        self.apply_url = reverse('job-apply', kwargs={'slug': self.published_job.slug})
        self.valid_resume = SimpleUploadedFile("resume.pdf", b"file_content", content_type="application/pdf")
        self.invalid_resume = SimpleUploadedFile("script.py", b"print('hello')", content_type="text/x-python")

    def test_job_creation(self):
        self.assertEqual(Job.objects.count(), 4)
        self.assertTrue(Job.objects.filter(slug='marketing-sales-executive').exists())

    def test_published_job_visibility(self):
        response = self.client.get(reverse('job-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        slugs = [job['slug'] for job in response.data]
        self.assertIn(self.published_job.slug, slugs)
        self.assertNotIn(self.draft_job.slug, slugs)
        self.assertNotIn(self.closed_job.slug, slugs)
        self.assertNotIn(self.deadline_job.slug, slugs)

    def test_public_api_response(self):
        response = self.client.get(reverse('job-detail', kwargs={'slug': self.published_job.slug}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['slug'], self.published_job.slug)

    def test_invalid_slug_returns_404(self):
        response = self.client.get(reverse('job-detail', kwargs={'slug': 'non-existent-job'}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_draft_job_hidden(self):
        response = self.client.get(reverse('job-detail', kwargs={'slug': self.draft_job.slug}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_closed_job_visible_but_application_blocked(self):
        # detail api should return 200 for closed job so UI can show "Position Closed"
        response = self.client.get(reverse('job-detail', kwargs={'slug': self.closed_job.slug}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        apply_url_closed = reverse('job-apply', kwargs={'slug': self.closed_job.slug})
        data = {
            'full_name': 'Test User',
            'mobile_number': '1234567890',
            'email': 'test@example.com',
            'current_city': 'City',
            'highest_education': 'Degree',
            'total_experience': '1 year',
            'expected_salary': '10k',
            'notice_period': 'immediate',
            'consent_accepted': True,
            'resume': self.valid_resume
        }
        res = self.client.post(apply_url_closed, data, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('job', res.data)

    def test_deadline_validation(self):
        apply_url_deadline = reverse('job-apply', kwargs={'slug': self.deadline_job.slug})
        data = {
            'full_name': 'Test User',
            'mobile_number': '1234567890',
            'email': 'test@example.com',
            'current_city': 'City',
            'highest_education': 'Degree',
            'total_experience': '1 year',
            'expected_salary': '10k',
            'notice_period': 'immediate',
            'consent_accepted': True,
            'resume': self.valid_resume
        }
        res = self.client.post(apply_url_deadline, data, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('job', res.data)

    def test_valid_resume_accepted(self):
        self.valid_resume.seek(0)
        data = {
            'full_name': 'Test User',
            'mobile_number': '1234567890',
            'email': 'test@example.com',
            'current_city': 'City',
            'highest_education': 'Degree',
            'total_experience': '1 year',
            'expected_salary': '10k',
            'notice_period': 'immediate',
            'consent_accepted': True,
            'resume': self.valid_resume
        }
        res = self.client.post(self.apply_url, data, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_invalid_resume_rejected(self):
        self.invalid_resume.seek(0)
        data = {
            'full_name': 'Test User',
            'mobile_number': '1234567891',
            'email': 'test2@example.com',
            'current_city': 'City',
            'highest_education': 'Degree',
            'total_experience': '1 year',
            'expected_salary': '10k',
            'notice_period': 'immediate',
            'consent_accepted': True,
            'resume': self.invalid_resume
        }
        res = self.client.post(self.apply_url, data, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('resume', res.data)

    def test_required_consent_validation(self):
        self.valid_resume.seek(0)
        data = {
            'full_name': 'Test User',
            'mobile_number': '1234567892',
            'email': 'test3@example.com',
            'current_city': 'City',
            'highest_education': 'Degree',
            'total_experience': '1 year',
            'expected_salary': '10k',
            'notice_period': 'immediate',
            'consent_accepted': False, # False consent
            'resume': self.valid_resume
        }
        res = self.client.post(self.apply_url, data, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('consent_accepted', res.data)

    def test_duplicate_application_protection(self):
        self.valid_resume.seek(0)
        data = {
            'full_name': 'Test User',
            'mobile_number': '9999999999',
            'email': 'duplicate@example.com',
            'current_city': 'City',
            'highest_education': 'Degree',
            'total_experience': '1 year',
            'expected_salary': '10k',
            'notice_period': 'immediate',
            'consent_accepted': True,
            'resume': self.valid_resume
        }
        res1 = self.client.post(self.apply_url, data, format='multipart')
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        
        self.valid_resume.seek(0)
        res2 = self.client.post(self.apply_url, data, format='multipart')
        self.assertEqual(res2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', res2.data)

    def test_seed_command_idempotency(self):
        call_command('seed_careers')
        jobs_count = Job.objects.filter(slug='marketing-sales-executive').count()
        self.assertEqual(jobs_count, 1)
        
        call_command('seed_careers')
        jobs_count_after = Job.objects.filter(slug='marketing-sales-executive').count()
        self.assertEqual(jobs_count_after, 1)
