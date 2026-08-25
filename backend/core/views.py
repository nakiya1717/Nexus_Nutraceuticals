from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import WebsiteSettings
from .serializers import WebsiteSettingsSerializer

class WebsiteSettingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        settings = WebsiteSettings.objects.first()
        if not settings:
            # Create default if none exists
            settings = WebsiteSettings.objects.create()
        
        serializer = WebsiteSettingsSerializer(settings)
        return Response(serializer.data)
