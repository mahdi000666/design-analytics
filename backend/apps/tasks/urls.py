from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, estimate_task_hours

router = DefaultRouter()
router.register(r'', TaskViewSet, basename='task')

urlpatterns = [
    path('estimate-hours/', estimate_task_hours, name='task-estimate-hours'),
    *router.urls,
]