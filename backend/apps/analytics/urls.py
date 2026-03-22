from django.urls import path
from .views import AITestView

urlpatterns = [
    path('ai-test/', AITestView.as_view(), name='ai-test'),
    # your other analytics urls...
]