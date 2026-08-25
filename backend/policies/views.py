from rest_framework import generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Policy
from .serializers import PolicySerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class PolicyDetailView(generics.RetrieveAPIView):
    queryset = Policy.objects.filter(status='Published')
    serializer_class = PolicySerializer
    lookup_field = 'slug'

    # Cache for 1 hour, but invalidate logically when editing (we can skip cache for simplicity and fast updates if needed, 
    # but the instructions said cache invalidation. We'll omit @cache_page here and rely on DB for now for immediate updates 
    # as per "avoid aggressive caching").
    def get(self, request, *args, **kwargs):
        # prefetch related to avoid N+1
        policy = get_object_or_404(
            Policy.objects.prefetch_related('sections__items').select_related('contact_info'),
            slug=self.kwargs['slug'],
            status='Published'
        )
        serializer = self.get_serializer(policy)
        return Response(serializer.data)
