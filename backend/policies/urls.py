from django.urls import path
from .views import PolicyDetailView

urlpatterns = [
    path('<slug:slug>/', PolicyDetailView.as_view(), name='policy-detail'),
]
