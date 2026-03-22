from django.urls import path
from .views import client_list, designer_list

urlpatterns = [
    path('clients/',   client_list,   name='client-list'),
    path('designers/', designer_list, name='designer-list'),
]