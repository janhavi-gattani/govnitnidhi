from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, Location, Complaint, ComplaintAttachment, ComplaintHistory,
    IssuedDocument, DocumentVerification, JobVacancy, JobApplication,
    NewsItem, NewsAttachment, Scheme, SchemeDocument, SchemeBeneficiary,
    BulkCallingCampaign, CampaignRecipient, DashboardMetrics,
    UserActivity, Notification
)
# app/serializers.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom fields
        token["username"] = user.username

        return token



# ====================== USER MANAGEMENT ======================

class UserSerializer(serializers.ModelSerializer):
    panchayat_name = serializers.CharField(source='panchayat.name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'phone_number', 'first_name', 'last_name',
            'role', 'panchayat', 'panchayat_name', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'password', 'password2', 'first_name', 'last_name', 'role', 'panchayat']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class LocationSerializer(serializers.ModelSerializer):
    parent_location_name = serializers.CharField(source='parent_location.name', read_only=True)
    sub_locations = serializers.SerializerMethodField()
    
    class Meta:
        model = Location
        fields = [
            'id', 'name', 'latitude', 'longitude', 'type', 'panchayat_name',
            'parent_location', 'parent_location_name', 'district', 'taluka',
            'is_urban', 'sub_locations', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_sub_locations(self, obj):
        if obj.sub_locations.exists():
            return LocationSerializer(obj.sub_locations.all(), many=True).data
        return []


# ====================== COMPLAINT MANAGEMENT ======================

class ComplaintAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintAttachment
        fields = ['id', 'file', 'file_type', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class ComplaintHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = ComplaintHistory
        fields = ['id', 'old_status', 'new_status', 'comments', 'changed_by', 'changed_by_name', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class ComplaintSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)
    citizen_username = serializers.CharField(source='citizen.username', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    attachments = ComplaintAttachmentSerializer(many=True, read_only=True)
    history = ComplaintHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Complaint
        fields = [
            'id', 'ticket_number', 'title', 'description', 'category', 'status',
            'priority', 'location', 'location_name', 'citizen', 'citizen_username',
            'citizen_name', 'citizen_phone', 'assigned_to', 'assigned_to_name',
            'assigned_department', 'escalated_to', 'escalation_reason',
            'resolution_notes', 'is_urban', 'attachments', 'history',
            'created_at', 'updated_at', 'resolved_at'
        ]
        read_only_fields = ['id', 'ticket_number', 'created_at', 'updated_at', 'resolved_at']


class ComplaintCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = [
            'title', 'description', 'category', 'priority', 'location',
            'citizen_name', 'citizen_phone', 'is_urban'
        ]
    
    def create(self, validated_data):
        validated_data['citizen'] = self.context['request'].user
        return super().create(validated_data)


class ComplaintUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = [
            'status', 'assigned_to', 'assigned_department', 'escalated_to',
            'escalation_reason', 'resolution_notes'
        ]


# ====================== DOCUMENT MANAGEMENT ======================

class DocumentVerificationSerializer(serializers.ModelSerializer):
    verified_by_name = serializers.CharField(source='verified_by.get_full_name', read_only=True)
    
    class Meta:
        model = DocumentVerification
        fields = [
            'id', 'verification_method', 'ip_address', 'result',
            'verified_by', 'verified_by_name', 'verified_at'
        ]
        read_only_fields = ['id', 'verified_at']


class IssuedDocumentSerializer(serializers.ModelSerializer):
    citizen_username = serializers.CharField(source='citizen.username', read_only=True)
    issued_by_name = serializers.CharField(source='issued_by.get_full_name', read_only=True)
    issuing_authority_name = serializers.CharField(source='issuing_authority.name', read_only=True)
    verifications = DocumentVerificationSerializer(many=True, read_only=True)
    
    class Meta:
        model = IssuedDocument
        fields = [
            'id', 'document_type', 'citizen', 'citizen_username', 'citizen_name',
            'citizen_aadhaar', 'blockchain_hash', 'issued_at', 'expires_at',
            'status', 'issued_by', 'issued_by_name', 'issuing_authority',
            'issuing_authority_name', 'verification_count', 'document_file',
            'metadata', 'verifications', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'issued_at', 'verification_count', 'created_at', 'updated_at']


# ====================== EMPLOYMENT ======================

class JobApplicationSerializer(serializers.ModelSerializer):
    applicant_username = serializers.CharField(source='applicant.username', read_only=True)
    vacancy_title = serializers.CharField(source='vacancy.title', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'vacancy', 'vacancy_title', 'applicant', 'applicant_username',
            'applicant_name', 'applicant_phone', 'applicant_email', 'resume',
            'cover_letter', 'status', 'applied_at', 'reviewed_at',
            'reviewed_by', 'reviewed_by_name', 'notes'
        ]
        read_only_fields = ['id', 'applied_at', 'reviewed_at']


class JobVacancySerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)
    posted_by_name = serializers.CharField(source='posted_by.get_full_name', read_only=True)
    applied_count = serializers.IntegerField(read_only=True)
    applications = JobApplicationSerializer(many=True, read_only=True)
    
    class Meta:
        model = JobVacancy
        fields = [
            'id', 'title', 'department', 'location', 'location_name',
            'location_text', 'salary_range', 'eligibility', 'description',
            'deadline', 'posted_at', 'total_positions', 'filled_positions',
            'status', 'posted_by', 'posted_by_name', 'requirements',
            'applied_count', 'applications', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'posted_at', 'applied_count', 'created_at', 'updated_at']


# ====================== NEWS & ANNOUNCEMENTS ======================

class NewsAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsAttachment
        fields = ['id', 'file', 'file_type', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class NewsItemSerializer(serializers.ModelSerializer):
    published_by_name = serializers.CharField(source='published_by.get_full_name', read_only=True)
    attachments = NewsAttachmentSerializer(many=True, read_only=True)
    
    class Meta:
        model = NewsItem
        fields = [
            'id', 'title', 'content', 'category', 'published_at',
            'published_by', 'published_by_name', 'publishing_authority',
            'target_audience', 'priority', 'is_active', 'views_count',
            'attachments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'published_at', 'views_count', 'created_at', 'updated_at']


# ====================== GOVERNMENT SCHEMES ======================

class SchemeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchemeDocument
        fields = ['id', 'document_name', 'is_mandatory', 'order']
        read_only_fields = ['id']


class SchemeBeneficiarySerializer(serializers.ModelSerializer):
    beneficiary_username = serializers.CharField(source='beneficiary.username', read_only=True)
    scheme_name = serializers.CharField(source='scheme.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.get_full_name', read_only=True)
    
    class Meta:
        model = SchemeBeneficiary
        fields = [
            'id', 'scheme', 'scheme_name', 'beneficiary', 'beneficiary_username',
            'beneficiary_name', 'beneficiary_aadhaar', 'application_date',
            'approval_date', 'status', 'amount_received', 'approved_by',
            'approved_by_name', 'remarks'
        ]
        read_only_fields = ['id', 'application_date', 'approval_date']


class SchemeSerializer(serializers.ModelSerializer):
    required_documents = SchemeDocumentSerializer(many=True, read_only=True)
    beneficiaries = SchemeBeneficiarySerializer(many=True, read_only=True)
    
    class Meta:
        model = Scheme
        fields = [
            'id', 'name', 'description', 'eligibility', 'benefits',
            'department', 'application_deadline', 'status', 'beneficiary_count',
            'total_budget', 'scheme_type', 'required_documents', 'beneficiaries',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'beneficiary_count', 'created_at', 'updated_at']


# ====================== BULK COMMUNICATION ======================

class CampaignRecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignRecipient
        fields = [
            'id', 'phone_number', 'status', 'attempted_at', 'duration', 'error_message'
        ]
        read_only_fields = ['id', 'attempted_at']


class BulkCallingCampaignSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    target_location_name = serializers.CharField(source='target_location.name', read_only=True)
    recipients = CampaignRecipientSerializer(many=True, read_only=True)
    
    class Meta:
        model = BulkCallingCampaign
        fields = [
            'id', 'name', 'message', 'audio_file', 'scheduled_at', 'status',
            'completed_calls', 'failed_calls', 'created_by', 'created_by_name',
            'target_location', 'target_location_name', 'recipients',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'completed_calls', 'failed_calls', 'created_at', 'updated_at']


# ====================== ANALYTICS & AUDIT ======================

class DashboardMetricsSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)
    
    class Meta:
        model = DashboardMetrics
        fields = [
            'id', 'date', 'location', 'location_name', 'location_type',
            'total_complaints', 'pending_complaints', 'resolved_complaints',
            'escalated_complaints', 'total_documents', 'total_vacancies',
            'total_beneficiaries', 'avg_resolution_time', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserActivitySerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserActivity
        fields = [
            'id', 'user', 'user_username', 'action', 'description', 'module',
            'related_content_type', 'related_object_id', 'ip_address',
            'user_agent', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


# ====================== NOTIFICATIONS ======================

class NotificationSerializer(serializers.ModelSerializer):
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'recipient_username', 'title', 'message',
            'notification_type', 'is_read', 'related_content_type',
            'related_object_id', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ====================== STATISTICS SERIALIZERS ======================

class ComplaintStatisticsSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    pending = serializers.IntegerField()
    in_progress = serializers.IntegerField()
    resolved = serializers.IntegerField()
    escalated = serializers.IntegerField()
    by_category = serializers.DictField()
    by_priority = serializers.DictField()
    avg_resolution_time = serializers.DecimalField(max_digits=5, decimal_places=2)


class DashboardStatsSerializer(serializers.Serializer):
    total_complaints = serializers.IntegerField()
    pending_complaints = serializers.IntegerField()
    resolved_complaints = serializers.IntegerField()
    escalated_complaints = serializers.IntegerField()
    total_documents = serializers.IntegerField()
    total_vacancies = serializers.IntegerField()
    total_beneficiaries = serializers.IntegerField()
    avg_resolution_time = serializers.CharField()