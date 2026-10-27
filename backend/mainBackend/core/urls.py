from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from .views import (
    UserViewSet, LocationViewSet, ComplaintViewSet,
    ComplaintAttachmentViewSet, IssuedDocumentViewSet,
    JobVacancyViewSet, JobApplicationViewSet,
    NewsItemViewSet, SchemeViewSet, SchemeBeneficiaryViewSet,
    BulkCallingCampaignViewSet, DashboardMetricsViewSet,
    UserActivityViewSet, NotificationViewSet,
    dashboard_stats,
    document_by_aadhar, document_collection
)
from .views import CustomTokenObtainPairView


from .twilio_views import (
    complaint_resolved_twiml,
    custom_call_twiml,
    call_status_callback
)
# Create router
router = DefaultRouter()

# Register viewsets
router.register(r'users', UserViewSet, basename='user')
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'complaints', ComplaintViewSet, basename='complaint')
router.register(r'complaint-attachments', ComplaintAttachmentViewSet, basename='complaint-attachment')
router.register(r'documents', IssuedDocumentViewSet, basename='document')
router.register(r'job-vacancies', JobVacancyViewSet, basename='job-vacancy')
router.register(r'job-applications', JobApplicationViewSet, basename='job-application')
router.register(r'news', NewsItemViewSet, basename='news')
router.register(r'schemes', SchemeViewSet, basename='scheme')
router.register(r'scheme-beneficiaries', SchemeBeneficiaryViewSet, basename='scheme-beneficiary')
router.register(r'campaigns', BulkCallingCampaignViewSet, basename='campaign')
router.register(r'metrics', DashboardMetricsViewSet, basename='metrics')
router.register(r'activities', UserActivityViewSet, basename='activity')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    # Authentication endpoints
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Dashboard statistics
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),

    path('twilio/complaint-resolved', complaint_resolved_twiml, name='twilio-complaint-resolved'),
    path('twilio/custom-call', custom_call_twiml, name='twilio-custom-call'),
    path('twilio/call-status', call_status_callback, name='twilio-call-status'),

    # Custom document endpoints for mobile app & authority dashboard
    path('documents/<str:aadhar_id>/', document_by_aadhar, name='document_by_aadhar_slash'),
    path('documents/<str:aadhar_id>', document_by_aadhar, name='document_by_aadhar'),
    path('documents/', document_collection, name='document_collection_slash'),
    path('documents', document_collection, name='document_collection'),

    
    # Include router URLs   
    path('', include(router.urls)),
]