from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView, activate_account, client_list, designer_list

urlpatterns = [
    # CustomTokenObtainPairView is used instead of the default TokenObtainPairView
    # so the JWT payload includes email and role — needed by the React AuthContext.
    path('token/',         CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(),          name='token_refresh'),
    path('activate/',      activate_account,                    name='activate_account'),
    path('clients/',   client_list,   name='client-list'),
    path('designers/', designer_list, name='designer-list'),
]