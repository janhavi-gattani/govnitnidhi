from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from django.db.models import Count, Avg, Q, F
from django.utils import timezone
from datetime import timedelta
from .models import (
    User, Location, Complaint, ComplaintAttachment, ComplaintHistory,
    IssuedDocument, DocumentVerification, JobVacancy, JobApplication,
    NewsItem, NewsAttachment, Scheme, SchemeDocument, SchemeBeneficiary,
    BulkCallingCampaign, CampaignRecipient, DashboardMetrics,
    UserActivity, Notification
)
from .serializers import (
    UserSerializer, UserRegistrationSerializer, LocationSerializer,
    ComplaintSerializer, ComplaintCreateSerializer, ComplaintUpdateSerializer,
    ComplaintAttachmentSerializer, ComplaintHistorySerializer,
    IssuedDocumentSerializer, DocumentVerificationSerializer,
    JobVacancySerializer, JobApplicationSerializer,
    NewsItemSerializer, NewsAttachmentSerializer,
    SchemeSerializer, SchemeDocumentSerializer, SchemeBeneficiarySerializer,
    BulkCallingCampaignSerializer, CampaignRecipientSerializer,
    DashboardMetricsSerializer, UserActivitySerializer,
    NotificationSerializer, ComplaintStatisticsSerializer,
    DashboardStatsSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from .twilio_service import twilio_service
import logging

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ====================== PAGINATION ======================

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


# ====================== USER MANAGEMENT ======================

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active', 'panchayat']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
    ordering_fields = ['created_at', 'username']
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type', 'district', 'taluka', 'is_urban']
    search_fields = ['name', 'panchayat_name']
    
    @action(detail=False, methods=['get'])
    def hierarchy(self, request):
        """Get location hierarchy (districts -> talukas -> villages)"""
        root_locations = Location.objects.filter(parent_location__isnull=True)
        serializer = self.get_serializer(root_locations, many=True)
        return Response(serializer.data)


# ====================== COMPLAINT MANAGEMENT ======================
logger = logging.getLogger(__name__)

# class ComplaintViewSet(viewsets.ModelViewSet):
#     queryset = Complaint.objects.all()
#     permission_classes = [IsAuthenticated]
#     pagination_class = StandardResultsSetPagination
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
#     filterset_fields = ['status', 'category', 'priority', 'location', 'is_urban', 'escalated_to']
#     search_fields = ['ticket_number', 'title', 'description', 'citizen_name']
#     ordering_fields = ['created_at', 'updated_at', 'priority']
    
#     def get_serializer_class(self):
#         if self.action == 'create':
#             return ComplaintCreateSerializer
#         elif self.action in ['update', 'partial_update']:
#             return ComplaintUpdateSerializer
#         return ComplaintSerializer
    
#     def get_queryset(self):
#         queryset = super().get_queryset()
#         user = self.request.user
        
#         # Filter based on user role
#         if user.role == 'citizen':
#             queryset = queryset.filter(citizen=user)
#         elif user.role == 'gram_panchayat_admin':
#             queryset = queryset.filter(location__panchayat=user.panchayat, is_urban=False)
#         elif user.role == 'zilla_parishad_admin':
#             # Zilla Parishad can see all complaints
#             pass
        
#         return queryset.select_related('location', 'citizen', 'assigned_to')
    
#     def perform_update(self, serializer):
#         old_instance = self.get_object()
#         instance = serializer.save()
        
#         # Create history entry if status changed
#         if old_instance.status != instance.status:
#             ComplaintHistory.objects.create(
#                 complaint=instance,
#                 changed_by=self.request.user,
#                 old_status=old_instance.status,
#                 new_status=instance.status,
#                 comments=self.request.data.get('comments', '')
#             )
        
#         # Log activity
#         UserActivity.objects.create(
#             user=self.request.user,
#             action='Updated Complaint',
#             description=f"Updated complaint {instance.ticket_number}",
#             module='complaints',
#             related_content_type=self.get_content_type(),
#             related_object_id=instance.id
#         )
    
#     @action(detail=True, methods=['post'])
#     def escalate(self, request, pk=None):
#         complaint = self.get_object()
#         complaint.status = 'escalated'
#         complaint.escalated_to = 'zilla_parishad'
#         complaint.escalation_reason = request.data.get('reason', '')
#         complaint.save()
        
#         # Create history
#         ComplaintHistory.objects.create(
#             complaint=complaint,
#             changed_by=request.user,
#             old_status=complaint.status,
#             new_status='escalated',
#             comments=f"Escalated to Zilla Parishad: {complaint.escalation_reason}"
#         )
        
#         serializer = self.get_serializer(complaint)
#         return Response(serializer.data)
    
#     # @action(detail=True, methods=['post'])
#     # def resolve(self, request, pk=None):
#     #     complaint = self.get_object()
#     #     complaint.status = 'resolved'
#     #     complaint.resolution_notes = request.data.get('resolution_notes', '')
#     #     complaint.resolved_at = timezone.now()
#     #     complaint.save()
        
#     #     # Create history
#     #     ComplaintHistory.objects.create(
#     #         complaint=complaint,
#     #         changed_by=request.user,
#     #         old_status='in_progress',
#     #         new_status='resolved',
#     #         comments=complaint.resolution_notes
#     #     )
        
#     #     # Create notification for citizen
#     #     Notification.objects.create(
#     #         recipient=complaint.citizen,
#     #         title='Complaint Resolved',
#     #         message=f"Your complaint {complaint.ticket_number} has been resolved.",
#     #         notification_type='complaint_update',
#     #         related_content_type=self.get_content_type(),
#     #         related_object_id=complaint.id
#     #     )
        
#     #     serializer = self.get_serializer(complaint)
#     #     return Response(serializer.data)

#     @action(detail=True, methods=['post'])
#     def resolve(self, request, pk=None):
#         complaint = self.get_object()
#         old_status = complaint.status
        
#         complaint.status = 'resolved'
#         complaint.resolution_notes = request.data.get('resolution_notes', '')
#         complaint.resolved_at = timezone.now()
#         complaint.save()
        
#         # Create history
#         ComplaintHistory.objects.create(
#             complaint=complaint,
#             changed_by=request.user,
#             old_status=old_status,
#             new_status='resolved',
#             comments=complaint.resolution_notes
#         )
        
#         # Create notification for citizen
#         Notification.objects.create(
#             recipient=complaint.citizen,
#             title='Complaint Resolved',
#             message=f"Your complaint {complaint.ticket_number} has been resolved.",
#             notification_type='complaint_update',
#             related_content_type=self.get_content_type(),
#             related_object_id=complaint.id
#         )
        
#         # Make voice call to citizen
#         try:
#             # Format phone number (ensure it has country code)
#             phone_number = complaint.citizen_phone
#             if not phone_number.startswith('+'):
#                 # Assuming Indian numbers, add +91
#                 phone_number = f"+91{phone_number.lstrip('0')}"
            
#             logger.info(f"Attempting to call {phone_number} for complaint {complaint.ticket_number}")
            
#             call_result = twilio_service.make_complaint_resolution_call(
#                 complaint=complaint,
#                 to_phone_number=phone_number
#             )
            
#             if call_result['success']:
#                 logger.info(f"Call initiated successfully: {call_result['call_sid']}")
#                 response_data = self.get_serializer(complaint).data
#                 response_data['call_status'] = {
#                     'initiated': True,
#                     'call_sid': call_result['call_sid'],
#                     'message': 'Voice call initiated to citizen'
#                 }
#                 return Response(response_data)
#             else:
#                 logger.error(f"Call failed: {call_result.get('error')}")
#                 response_data = self.get_serializer(complaint).data
#                 response_data['call_status'] = {
#                     'initiated': False,
#                     'error': call_result.get('error'),
#                     'message': 'Complaint resolved but voice call failed'
#                 }
#                 return Response(response_data)
                
#         except Exception as e:
#             logger.error(f"Exception during call: {str(e)}")
#             response_data = self.get_serializer(complaint).data
#             response_data['call_status'] = {
#                 'initiated': False,
#                 'error': str(e),
#                 'message': 'Complaint resolved but voice call encountered an error'
#             }
#             return Response(response_data)


class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'priority', 'location', 'is_urban', 'escalated_to']
    search_fields = ['ticket_number', 'title', 'description', 'citizen_name']
    ordering_fields = ['created_at', 'updated_at', 'priority']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Log activity
        instance = serializer.instance
        UserActivity.objects.create(
            user=request.user,
            action='Created Complaint',
            description=f"Created complaint {instance.ticket_number}",
            module='complaints',
            related_content_type=self.get_content_type(),
            related_object_id=instance.id
        )
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            {'complaint_id': instance.ticket_number}, 
            status=status.HTTP_201_CREATED, 
            headers=headers
        )
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ComplaintCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ComplaintUpdateSerializer
        return ComplaintSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Filter based on user role
        if user.role == 'citizen':
            queryset = queryset.filter(citizen=user)
        elif user.role == 'gram_panchayat_admin':
            # Filter by the panchayat location directly
            if user.panchayat:
                # Get complaints in this location or its sub-locations
                queryset = queryset.filter(
                    location=user.panchayat,
                    is_urban=False
                ).exclude(escalated_to='zilla_parishad')
            else:
                # If user has no panchayat assigned, return empty queryset
                queryset = queryset.none()
        elif user.role == 'zilla_parishad_admin':
            # Zilla Parishad sees urban complaints OR escalated complaints
            queryset = queryset.filter(
                models.Q(is_urban=True) | models.Q(escalated_to='zilla_parishad')
            )
        
        return queryset.select_related('location', 'citizen', 'assigned_to')
    
    def perform_update(self, serializer):
        old_instance = self.get_object()
        instance = serializer.save()
        
        # Create history entry if status changed
        if old_instance.status != instance.status:
            ComplaintHistory.objects.create(
                complaint=instance,
                changed_by=self.request.user,
                old_status=old_instance.status,
                new_status=instance.status,
                comments=self.request.data.get('comments', '')
            )
        
        # Log activity
        UserActivity.objects.create(
            user=self.request.user,
            action='Updated Complaint',
            description=f"Updated complaint {instance.ticket_number}",
            module='complaints',
            related_content_type=self.get_content_type(),
            related_object_id=instance.id
        )
    
    @action(detail=True, methods=['post'])
    def escalate(self, request, pk=None):
        complaint = self.get_object()
        old_status = complaint.status
        
        complaint.status = 'escalated'
        complaint.escalated_to = 'zilla_parishad'
        complaint.escalation_reason = request.data.get('reason', '')
        complaint.save()
        
        # Create history
        ComplaintHistory.objects.create(
            complaint=complaint,
            changed_by=request.user,
            old_status=old_status,
            new_status='escalated',
            comments=f"Escalated to Zilla Parishad: {complaint.escalation_reason}"
        )
        
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            action='Escalated Complaint',
            description=f"Escalated complaint {complaint.ticket_number} to Zilla Parishad",
            module='complaints',
            related_content_type=self.get_content_type(),
            related_object_id=complaint.id
        )
        
        serializer = self.get_serializer(complaint)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        complaint = self.get_object()
        old_status = complaint.status
        
        resolution_notes = request.data.get('resolution_notes', '')
        if not resolution_notes:
            return Response(
                {'error': 'Resolution notes are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        complaint.status = 'resolved'
        complaint.resolution_notes = resolution_notes
        complaint.resolved_at = timezone.now()
        complaint.save()
        
        # Create history
        ComplaintHistory.objects.create(
            complaint=complaint,
            changed_by=request.user,
            old_status=old_status,
            new_status='resolved',
            comments=complaint.resolution_notes
        )
        
        # Create notification for citizen
        try:
            Notification.objects.create(
                recipient=complaint.citizen,
                title='Complaint Resolved',
                message=f"Your complaint {complaint.ticket_number} has been resolved.",
                notification_type='complaint_update',
                related_content_type=self.get_content_type(),
                related_object_id=complaint.id
            )
        except Exception as e:
            logger.error(f"Failed to create notification: {str(e)}")
        
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            action='Resolved Complaint',
            description=f"Resolved complaint {complaint.ticket_number}",
            module='complaints',
            related_content_type=self.get_content_type(),
            related_object_id=complaint.id
        )
        
        # Make voice call to citizen
        call_status = {
            'initiated': False,
            'message': 'Voice call not attempted'
        }
        
        try:
            # Format phone number (ensure it has country code)
            phone_number = complaint.citizen_phone
            if not phone_number.startswith('+'):
                # Assuming Indian numbers, add +91
                phone_number = f"+91{phone_number.lstrip('0')}"
            
            logger.info(f"Attempting to call {phone_number} for complaint {complaint.ticket_number}")
            
            call_result = twilio_service.make_complaint_resolution_call(
                complaint=complaint,
                to_phone_number=phone_number
            )
            
            if call_result['success']:
                logger.info(f"Call initiated successfully: {call_result['call_sid']}")
                call_status = {
                    'initiated': True,
                    'call_sid': call_result['call_sid'],
                    'message': 'Voice call initiated to citizen'
                }
            else:
                logger.error(f"Call failed: {call_result.get('error')}")
                call_status = {
                    'initiated': False,
                    'error': call_result.get('error'),
                    'message': 'Complaint resolved but voice call failed'
                }
                
        except Exception as e:
            logger.error(f"Exception during call: {str(e)}")
            call_status = {
                'initiated': False,
                'error': str(e),
                'message': 'Complaint resolved but voice call encountered an error'
            }
        
        response_data = self.get_serializer(complaint).data
        response_data['call_status'] = call_status
        return Response(response_data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get complaint statistics"""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'pending': queryset.filter(status='pending').count(),
            'in_progress': queryset.filter(status='in_progress').count(),
            'resolved': queryset.filter(status='resolved').count(),
            'escalated': queryset.filter(status='escalated').count(),
            'by_category': dict(queryset.values('category').annotate(count=Count('id')).values_list('category', 'count')),
            'by_priority': dict(queryset.values('priority').annotate(count=Count('id')).values_list('priority', 'count')),
        }
        
        # Calculate average resolution time
        resolved = queryset.filter(status='resolved', resolved_at__isnull=False)
        if resolved.exists():
            avg_time = resolved.annotate(
                resolution_time=F('resolved_at') - F('created_at')
            ).aggregate(avg=Avg('resolution_time'))['avg']
            stats['avg_resolution_time'] = avg_time.days if avg_time else 0
        else:
            stats['avg_resolution_time'] = 0
        
        serializer = ComplaintStatisticsSerializer(stats)
        return Response(serializer.data)
    
    def get_content_type(self):
        from django.contrib.contenttypes.models import ContentType
        return ContentType.objects.get_for_model(Complaint)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get complaint statistics"""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'pending': queryset.filter(status='pending').count(),
            'in_progress': queryset.filter(status='in_progress').count(),
            'resolved': queryset.filter(status='resolved').count(),
            'escalated': queryset.filter(status='escalated').count(),
            'by_category': dict(queryset.values('category').annotate(count=Count('id')).values_list('category', 'count')),
            'by_priority': dict(queryset.values('priority').annotate(count=Count('id')).values_list('priority', 'count')),
        }
        
        # Calculate average resolution time
        resolved = queryset.filter(status='resolved', resolved_at__isnull=False)
        if resolved.exists():
            avg_time = resolved.annotate(
                resolution_time=F('resolved_at') - F('created_at')
            ).aggregate(avg=Avg('resolution_time'))['avg']
            stats['avg_resolution_time'] = avg_time.days if avg_time else 0
        else:
            stats['avg_resolution_time'] = 0
        
        serializer = ComplaintStatisticsSerializer(stats)
        return Response(serializer.data)
    
    def get_content_type(self):
        from django.contrib.contenttypes.models import ContentType
        return ContentType.objects.get_for_model(Complaint)


class ComplaintAttachmentViewSet(viewsets.ModelViewSet):
    queryset = ComplaintAttachment.objects.all()
    serializer_class = ComplaintAttachmentSerializer
    permission_classes = [IsAuthenticated]


# ====================== DOCUMENT MANAGEMENT ======================

class IssuedDocumentViewSet(viewsets.ModelViewSet):
    queryset = IssuedDocument.objects.all()
    serializer_class = IssuedDocumentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['document_type', 'status', 'issuing_authority']
    search_fields = ['citizen_name', 'blockchain_hash']
    ordering_fields = ['issued_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if user.role == 'citizen':
            queryset = queryset.filter(citizen=user)
        
        return queryset.select_related('citizen', 'issued_by', 'issuing_authority')
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        document = self.get_object()
        
        # Create verification record
        verification = DocumentVerification.objects.create(
            document=document,
            verified_by=request.user,
            verification_method=request.data.get('method', 'manual'),
            ip_address=self.get_client_ip(request),
            result='valid' if document.status == 'active' else 'invalid'
        )
        
        # Update verification count
        document.verification_count += 1
        document.save()
        
        serializer = DocumentVerificationSerializer(verification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def verify_by_hash(self, request):
        """Verify document by blockchain hash"""
        blockchain_hash = request.data.get('hash')
        
        try:
            document = IssuedDocument.objects.get(blockchain_hash=blockchain_hash)
            
            # Create verification record
            verification = DocumentVerification.objects.create(
                document=document,
                verification_method='blockchain',
                ip_address=self.get_client_ip(request),
                result='valid' if document.status == 'active' else 'expired'
            )
            
            document.verification_count += 1
            document.save()
            
            return Response({
                'valid': document.status == 'active',
                'document': IssuedDocumentSerializer(document).data,
                'verification': DocumentVerificationSerializer(verification).data
            })
        except IssuedDocument.DoesNotExist:
            return Response({
                'valid': False,
                'message': 'Document not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


# ====================== EMPLOYMENT ======================

class JobVacancyViewSet(viewsets.ModelViewSet):
    queryset = JobVacancy.objects.all()
    serializer_class = JobVacancySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'department', 'location']
    search_fields = ['title', 'description']
    ordering_fields = ['posted_at', 'deadline']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter active vacancies for citizens
        if self.request.user.role == 'Citizen':
            queryset = queryset.filter(status='open', deadline__gte=timezone.now())
        
        return queryset.select_related('location', 'posted_by')
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        vacancy = self.get_object()
        
        # Check if already applied
        if JobApplication.objects.filter(vacancy=vacancy, applicant=request.user).exists():
            return Response({
                'error': 'You have already applied for this vacancy'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create application
        application_data = {
            'vacancy': vacancy.id,
            'applicant': request.user.id,
            'applicant_name': request.data.get('applicant_name'),
            'applicant_phone': request.data.get('applicant_phone'),
            'applicant_email': request.data.get('applicant_email'),
            'cover_letter': request.data.get('cover_letter', '')
        }
        
        serializer = JobApplicationSerializer(data=application_data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'vacancy']
    ordering_fields = ['applied_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if user.role == 'citizen':
            queryset = queryset.filter(applicant=user)
        
        return queryset.select_related('vacancy', 'applicant', 'reviewed_by')


# ====================== NEWS & ANNOUNCEMENTS ======================

class NewsItemViewSet(viewsets.ModelViewSet):
    queryset = NewsItem.objects.filter(is_active=True)
    serializer_class = NewsItemSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'target_audience', 'priority']
    search_fields = ['title', 'content']
    ordering_fields = ['published_at', 'priority']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Filter by target audience
        if user.role == 'gram_panchayat_admin':
            queryset = queryset.filter(Q(target_audience='all') | Q(target_audience='gram_panchayat'))
        elif user.role == 'zilla_parishad_admin':
            queryset = queryset.filter(Q(target_audience='all') | Q(target_audience='urban'))
        
        return queryset.select_related('published_by')
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment views
        instance.views_count += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# ====================== GOVERNMENT SCHEMES ======================

class SchemeViewSet(viewsets.ModelViewSet):
    queryset = Scheme.objects.all()
    serializer_class = SchemeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'scheme_type', 'department']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at']
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        scheme = self.get_object()
        
        # Check if already applied
        if SchemeBeneficiary.objects.filter(scheme=scheme, beneficiary=request.user).exists():
            return Response({
                'error': 'You have already applied for this scheme'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create beneficiary application
        beneficiary = SchemeBeneficiary.objects.create(
            scheme=scheme,
            beneficiary=request.user,
            beneficiary_name=request.data.get('beneficiary_name'),
            beneficiary_aadhaar=request.data.get('beneficiary_aadhaar'),
            status='pending'
        )
        
        serializer = SchemeBeneficiarySerializer(beneficiary)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SchemeBeneficiaryViewSet(viewsets.ModelViewSet):
    queryset = SchemeBeneficiary.objects.all()
    serializer_class = SchemeBeneficiarySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'scheme']
    ordering_fields = ['application_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if user.role == 'citizen':
            queryset = queryset.filter(beneficiary=user)
        
        return queryset.select_related('scheme', 'beneficiary', 'approved_by')
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        beneficiary = self.get_object()
        beneficiary.status = 'approved'
        beneficiary.approval_date = timezone.now()
        beneficiary.approved_by = request.user
        beneficiary.amount_received = request.data.get('amount', 0)
        beneficiary.save()
        
        # Update scheme beneficiary count
        scheme = beneficiary.scheme
        scheme.beneficiary_count = scheme.beneficiaries.filter(status='approved').count()
        scheme.save()
        
        serializer = self.get_serializer(beneficiary)
        return Response(serializer.data)


# ====================== BULK COMMUNICATION ======================

class BulkCallingCampaignViewSet(viewsets.ModelViewSet):
    queryset = BulkCallingCampaign.objects.all()
    serializer_class = BulkCallingCampaignSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['scheduled_at', 'created_at']
    
    def perform_create(self, serializer):
        campaign = serializer.save(created_by=self.request.user)
        
        # Create recipients from phone numbers in request
        phone_numbers = self.request.data.get('phone_numbers', [])
        for phone in phone_numbers:
            CampaignRecipient.objects.create(
                campaign=campaign,
                phone_number=phone
            )
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        campaign = self.get_object()
        campaign.status = 'in_progress'
        campaign.save()
        
        # Here you would integrate with actual calling service
        # For now, just update status
        
        serializer = self.get_serializer(campaign)
        return Response(serializer.data)


# ====================== ANALYTICS & DASHBOARD ======================

class DashboardMetricsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DashboardMetrics.objects.all()
    serializer_class = DashboardMetricsSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['location_type', 'location', 'date']
    ordering_fields = ['date']


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def dashboard_stats(request):
#     """Get dashboard statistics based on user role"""
#     user = request.user
    
#     if user.role == 'gram_panchayat_admin':
#         complaints = Complaint.objects.filter(location__panchayat=user.panchayat, is_urban=False)
#         documents = IssuedDocument.objects.filter(issuing_authority=user.panchayat)
#         location_type = 'gram_panchayat'
#     elif user.role == 'zilla_parishad_admin':
#         complaints = Complaint.objects.all()
#         documents = IssuedDocument.objects.all()
#         location_type = 'zilla_parishad'
#     else:
#         complaints = Complaint.objects.filter(citizen=user)
#         documents = IssuedDocument.objects.filter(citizen=user)
#         location_type = 'citizen'
    
#     # Calculate metrics
#     resolved = complaints.filter(status='resolved', resolved_at__isnull=False)
#     if resolved.exists():
#         avg_time = resolved.annotate(
#             resolution_time=F('resolved_at') - F('created_at')
#         ).aggregate(avg=Avg('resolution_time'))['avg']
#         avg_resolution_time = f"{avg_time.days}.{int((avg_time.seconds / 3600) * 10)} days" if avg_time else "0 days"
#     else:
#         avg_resolution_time = "0 days"
    
#     stats = {
#         'total_complaints': complaints.count(),
#         'pending_complaints': complaints.filter(status='pending').count(),
#         'resolved_complaints': complaints.filter(status='resolved').count(),
#         'escalated_complaints': complaints.filter(status='escalated').count(),
#         'total_documents': documents.count(),
#         'total_vacancies': JobVacancy.objects.filter(status='open').count(),
#         'total_beneficiaries': SchemeBeneficiary.objects.filter(status='approved').count(),
#         'avg_resolution_time': avg_resolution_time
#     }
    
#     serializer = DashboardStatsSerializer(stats)
#     return Response(serializer.data)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics based on user role"""
    user = request.user
    
    try:
        if user.role == 'gram_panchayat_admin':
            # Fix: Use location=user.panchayat instead of location__panchayat=user.panchayat
            if user.panchayat:
                # Gram Panchayat sees only rural complaints in their location that are NOT escalated
                complaints = Complaint.objects.filter(
                    location=user.panchayat,
                    is_urban=False
                ).exclude(escalated_to='zilla_parishad')
                documents = IssuedDocument.objects.filter(issuing_authority=user.panchayat)
                vacancies = JobVacancy.objects.filter(location=user.panchayat, status='open')
                beneficiaries = SchemeBeneficiary.objects.filter(beneficiary__panchayat=user.panchayat, status='approved')
            else:
                # If user has no panchayat assigned, return empty querysets
                complaints = Complaint.objects.none()
                documents = IssuedDocument.objects.none()
                vacancies = JobVacancy.objects.none()
                beneficiaries = SchemeBeneficiary.objects.none()
            location_type = 'gram_panchayat'
            
        elif user.role == 'zilla_parishad_admin':
            # Zilla Parishad sees urban complaints OR escalated complaints
            complaints = Complaint.objects.filter(
                models.Q(is_urban=True) | models.Q(escalated_to='zilla_parishad')
            )
            documents = IssuedDocument.objects.all()
            vacancies = JobVacancy.objects.filter(status='open')
            beneficiaries = SchemeBeneficiary.objects.filter(status='approved')
            location_type = 'zilla_parishad'
            
        else:  # citizen or other roles
            complaints = Complaint.objects.filter(citizen=user)
            documents = IssuedDocument.objects.filter(citizen=user)
            vacancies = JobVacancy.objects.none()  # Citizens don't see all vacancies in stats
            beneficiaries = SchemeBeneficiary.objects.none()  # Citizens don't see all beneficiaries
            location_type = 'citizen'
        
        # Calculate metrics
        resolved = complaints.filter(status='resolved', resolved_at__isnull=False)
        if resolved.exists():
            avg_time = resolved.annotate(
                resolution_time=F('resolved_at') - F('created_at')
            ).aggregate(avg=Avg('resolution_time'))['avg']
            
            if avg_time:
                avg_days = avg_time.days
                avg_hours = int((avg_time.seconds / 3600))
                avg_resolution_time = f"{avg_days}.{avg_hours} days" if avg_days > 0 else f"{avg_hours} hours"
            else:
                avg_resolution_time = "0 days"
        else:
            avg_resolution_time = "0 days"
        
        stats = {
            'total_complaints': complaints.count(),
            'pending_complaints': complaints.filter(status='pending').count(),
            'resolved_complaints': complaints.filter(status='resolved').count(),
            'escalated_complaints': complaints.filter(status='escalated').count(),
            'total_documents': documents.count(),
            'total_vacancies': vacancies.count(),
            'total_beneficiaries': beneficiaries.count(),
            'avg_resolution_time': avg_resolution_time,
            'location_type': location_type,
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)
        
    except Exception as e:
        logger.error(f"Error in dashboard_stats: {str(e)}", exc_info=True)
        return Response(
            {
                'error': 'Failed to fetch dashboard statistics',
                'detail': str(e),
                'total_complaints': 0,
                'pending_complaints': 0,
                'resolved_complaints': 0,
                'escalated_complaints': 0,
                'total_documents': 0,
                'total_vacancies': 0,
                'total_beneficiaries': 0,
                'avg_resolution_time': '0 days'
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ====================== USER ACTIVITY & NOTIFICATIONS ======================

class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['user', 'module']
    ordering_fields = ['timestamp']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        if user.role != 'zilla_parishad_admin':
            queryset = queryset.filter(user=user)
        
        return queryset.select_related('user')[:50]  # Last 50 activities


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['is_read', 'notification_type']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).select_related('recipient')
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({'message': 'All notifications marked as read'})

# ====================== CUSTOM DOCUMENT ENDPOINTS FOR MOBILE & DASHBOARD ======================
import uuid

def _save_or_update_issued_document(data, default_aadhar=None):
    aadhar_card_id = data.get('aadhar_card_id') or data.get('recipientId') or default_aadhar or 'AADHAR-005'
    doc_id = data.get('doc_id') or data.get('documentId') or f'DOC-{uuid.uuid4().hex[:8].upper()}'
    doc_type = data.get('doc_type') or data.get('documentType') or 'birth_certificate'
    doc_hash = data.get('doc_hash') or data.get('documentHash')

    if not doc_hash:
        return Response({'error': 'doc_hash is required'}, status=status.HTTP_400_BAD_REQUEST)

    citizen = User.objects.filter(role='citizen').first() or User.objects.first()
    authority = Location.objects.first()

    doc, created = IssuedDocument.objects.update_or_create(
        blockchain_hash=doc_hash,
        defaults={
            'document_type': doc_type,
            'citizen': citizen,
            'issued_by': citizen,
            'citizen_name': data.get('recipientName') or data.get('recipient_name') or (citizen.get_full_name() if citizen else 'Citizen'),
            'citizen_aadhaar': aadhar_card_id,
            'issuing_authority': authority,
            'document_file': 'documents/issued/placeholder.pdf',
            'metadata': {
                'doc_id': doc_id,
                'aadhar_card_id': aadhar_card_id,
                'doc_type': doc_type,
                'doc_hash': doc_hash
            }
        }
    )

    return Response({
        'success': True,
        'message': 'Document stored in database successfully',
        'doc_id': doc_id,
        'id': str(doc.id)
    }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def document_by_aadhar(request, aadhar_id):
    if request.method == 'POST':
        return _save_or_update_issued_document(request.data, default_aadhar=aadhar_id)

    target = aadhar_id
    docs = IssuedDocument.objects.filter(
        Q(citizen_aadhaar=target) |
        Q(metadata__aadhar_card_id=target) |
        Q(metadata__doc_id=target)
    )

    if not docs.exists() and request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'citizen':
        docs = IssuedDocument.objects.filter(citizen=request.user)

    formatted_docs = []
    for d in docs:
        meta = d.metadata if isinstance(d.metadata, dict) else {}
        formatted_docs.append({
            'id': str(d.id),
            'doc_id': meta.get('doc_id') or str(d.id),
            'doc_hash': d.blockchain_hash,
            'doc_type': d.document_type,
            'aadhar_card_id': d.citizen_aadhaar or meta.get('aadhar_card_id') or target,
            'created_at': d.created_at.isoformat() if d.created_at else d.issued_at.isoformat(),
        })

    return Response({
        'success': True,
        'document_count': len(formatted_docs),
        'documents': formatted_docs
    })


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def document_collection(request):
    if request.method == 'POST':
        return _save_or_update_issued_document(request.data)

    target = request.query_params.get('aadhar_card_id') or request.query_params.get('aadhar')
    if target:
        docs = IssuedDocument.objects.filter(
            Q(citizen_aadhaar=target) |
            Q(metadata__aadhar_card_id=target)
        )
    elif request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'citizen':
        docs = IssuedDocument.objects.filter(citizen=request.user)
    else:
        docs = IssuedDocument.objects.all()

    formatted_docs = []
    for d in docs:
        meta = d.metadata if isinstance(d.metadata, dict) else {}
        formatted_docs.append({
            'id': str(d.id),
            'doc_id': meta.get('doc_id') or str(d.id),
            'doc_hash': d.blockchain_hash,
            'doc_type': d.document_type,
            'aadhar_card_id': d.citizen_aadhaar or meta.get('aadhar_card_id') or 'AADHAR-005',
            'created_at': d.created_at.isoformat() if d.created_at else d.issued_at.isoformat(),
        })

    return Response({
        'success': True,
        'document_count': len(formatted_docs),
        'documents': formatted_docs
    })
