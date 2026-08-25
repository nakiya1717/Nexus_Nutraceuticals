from rest_framework import serializers
from .models import ContactEnquiry

class ContactEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEnquiry
        fields = '__all__'
