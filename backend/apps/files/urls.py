from rest_framework.routers import DefaultRouter
from .views import FileUploadViewSet

router = DefaultRouter()
router.register(r'', FileUploadViewSet, basename='file')

urlpatterns = router.urls