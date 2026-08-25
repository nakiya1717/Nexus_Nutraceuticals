from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import ContactEnquiry
from .serializers import ContactEnquirySerializer

class ContactEnquiryCreateView(generics.CreateAPIView):
    queryset = ContactEnquiry.objects.all()
    serializer_class = ContactEnquirySerializer
    permission_classes = [AllowAny]
