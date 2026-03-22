from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView, activate_account

urlpatterns = [
    path('token/',         CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(),          name='token_refresh'),
    path('activate/',      activate_account,                    name='activate_account'),
]