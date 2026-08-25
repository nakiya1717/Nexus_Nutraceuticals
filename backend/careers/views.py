from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Job
from .serializers import JobSerializer, JobApplicationSerializer

class JobListAPIView(generics.ListAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        return Job.objects.filter(
            status='Published'
        ).exclude(
            application_deadline__lt=timezone.now()
        ).order_by('-is_featured', '-published_at')

class JobDetailAPIView(generics.RetrieveAPIView):
    serializer_class = JobSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        # We allow retrieval of 'Closed' jobs too so we can show "This Position Is Currently Closed"
        return Job.objects.exclude(status='Draft')

class JobApplyAPIView(APIView):
    def post(self, request, slug, *args, **kwargs):
        job = get_object_or_404(Job.objects.exclude(status='Draft'), slug=slug)
        
        # Merge job ID into the data payload
        data = request.data.copy()
        data['job'] = job.id
        
        serializer = JobApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Application submitted successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
