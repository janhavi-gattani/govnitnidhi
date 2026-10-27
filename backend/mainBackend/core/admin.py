from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Location, Complaint, ComplaintAttachment, ComplaintHistory,
    IssuedDocument, DocumentVerification, JobVacancy, JobApplication,
    NewsItem, NewsAttachment, Scheme, SchemeDocument, SchemeBeneficiary,
    BulkCallingCampaign, CampaignRecipient, DashboardMetrics,
    UserActivity, Notification
)


# ====================== USER MANAGEMENT ======================

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'phone_number', 'role', 'panchayat', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'phone_number', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('phone_number', 'role', 'panchayat')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('phone_number', 'role', 'panchayat')}),
    )


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    # list_display = ['id', 'name', 'type', 'panchayat_name', 'district', 'taluka', 'is_urban', 'created_at']
    list_display = ['id', 'name']
    list_filter = ['type', 'is_urban', 'district', 'taluka']
    search_fields = ['name', 'panchayat_name']
    ordering = ['district', 'taluka', 'name']


# ====================== COMPLAINT MANAGEMENT ======================

class ComplaintAttachmentInline(admin.TabularInline):
    model = ComplaintAttachment
    extra = 0


class ComplaintHistoryInline(admin.TabularInline):
    model = ComplaintHistory
    extra = 0
    readonly_fields = ['timestamp']


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['ticket_number', 'title', 'category', 'status', 'priority', 'location', 'citizen_name', 'created_at']
    list_filter = ['status', 'category', 'priority', 'is_urban', 'created_at']
    search_fields = ['ticket_number', 'title', 'description', 'citizen_name']
    ordering = ['-created_at']
    readonly_fields = ['ticket_number', 'created_at', 'updated_at', 'resolved_at']
    inlines = [ComplaintAttachmentInline, ComplaintHistoryInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('ticket_number', 'title', 'description', 'category', 'priority')
        }),
        ('Status', {
            'fields': ('status', 'assigned_to', 'assigned_department', 'escalated_to', 'escalation_reason')
        }),
        ('Citizen Details', {
            'fields': ('citizen', 'citizen_name', 'citizen_phone', 'location', 'is_urban')
        }),
        ('Resolution', {
            'fields': ('resolution_notes', 'resolved_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


# ====================== DOCUMENT MANAGEMENT ======================

class DocumentVerificationInline(admin.TabularInline):
    model = DocumentVerification
    extra = 0
    readonly_fields = ['verified_at']


@admin.register(IssuedDocument)
class IssuedDocumentAdmin(admin.ModelAdmin):
    list_display = ['document_type', 'citizen_name', 'status', 'blockchain_hash', 'issued_at', 'verification_count']
    list_filter = ['document_type', 'status', 'issued_at']
    search_fields = ['citizen_name', 'blockchain_hash', 'citizen_aadhaar']
    ordering = ['-issued_at']
    readonly_fields = ['issued_at', 'verification_count', 'created_at', 'updated_at']
    inlines = [DocumentVerificationInline]


# ====================== EMPLOYMENT ======================

class JobApplicationInline(admin.TabularInline):
    model = JobApplication
    extra = 0
    readonly_fields = ['applied_at']


@admin.register(JobVacancy)
class JobVacancyAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'department', 'location', 'status', 'total_positions', 'filled_positions', 'deadline']
    list_filter = ['status', 'department', 'posted_at']
    search_fields = ['title', 'description']
    ordering = ['-posted_at']
    readonly_fields = ['posted_at', 'created_at', 'updated_at']
    inlines = [JobApplicationInline]


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant_name', 'vacancy', 'status', 'applied_at']
    list_filter = ['status', 'applied_at']
    search_fields = ['applicant_name', 'applicant_email']
    ordering = ['-applied_at']
    readonly_fields = ['applied_at', 'reviewed_at']


# ====================== NEWS & ANNOUNCEMENTS ======================

class NewsAttachmentInline(admin.TabularInline):
    model = NewsAttachment
    extra = 0


@admin.register(NewsItem)
class NewsItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'priority', 'target_audience', 'is_active', 'views_count', 'published_at']
    list_filter = ['category', 'priority', 'target_audience', 'is_active', 'published_at']
    search_fields = ['title', 'content']
    ordering = ['-published_at']
    readonly_fields = ['published_at', 'views_count', 'created_at', 'updated_at']
    inlines = [NewsAttachmentInline]


# ====================== GOVERNMENT SCHEMES ======================

class SchemeDocumentInline(admin.TabularInline):
    model = SchemeDocument
    extra = 1


class SchemeBeneficiaryInline(admin.TabularInline):
    model = SchemeBeneficiary
    extra = 0
    readonly_fields = ['application_date', 'approval_date']


@admin.register(Scheme)
class SchemeAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'department', 'status', 'scheme_type', 'beneficiary_count', 'total_budget']
    list_filter = ['status', 'scheme_type', 'department']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    readonly_fields = ['beneficiary_count', 'created_at', 'updated_at']
    inlines = [SchemeDocumentInline, SchemeBeneficiaryInline]


@admin.register(SchemeBeneficiary)
class SchemeBeneficiaryAdmin(admin.ModelAdmin):
    list_display = ['beneficiary_name', 'scheme', 'status', 'amount_received', 'application_date']
    list_filter = ['status', 'application_date']
    search_fields = ['beneficiary_name', 'beneficiary_aadhaar']
    ordering = ['-application_date']
    readonly_fields = ['application_date', 'approval_date']


# ====================== BULK COMMUNICATION ======================

class CampaignRecipientInline(admin.TabularInline):
    model = CampaignRecipient
    extra = 0
    readonly_fields = ['attempted_at']


@admin.register(BulkCallingCampaign)
class BulkCallingCampaignAdmin(admin.ModelAdmin):
    list_display = ['name', 'status', 'scheduled_at', 'completed_calls', 'failed_calls', 'created_by']
    list_filter = ['status', 'scheduled_at']
    search_fields = ['name', 'message']
    ordering = ['-created_at']
    readonly_fields = ['completed_calls', 'failed_calls', 'created_at', 'updated_at']
    inlines = [CampaignRecipientInline]


# ====================== ANALYTICS & AUDIT ======================

@admin.register(DashboardMetrics)
class DashboardMetricsAdmin(admin.ModelAdmin):
    list_display = [
        'date', 'location_type', 'location', 'total_complaints',
        'pending_complaints', 'resolved_complaints', 'total_documents'
    ]
    list_filter = ['location_type', 'date']
    ordering = ['-date']
    readonly_fields = ['created_at']


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'module', 'timestamp']
    list_filter = ['module', 'timestamp']
    search_fields = ['user__username', 'action', 'description']
    ordering = ['-timestamp']
    readonly_fields = ['timestamp']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'title', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['recipient__username', 'title', 'message']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


# Register remaining models without custom admin
admin.site.register(ComplaintAttachment)
admin.site.register(ComplaintHistory)
admin.site.register(DocumentVerification)
admin.site.register(NewsAttachment)
admin.site.register(SchemeDocument)
admin.site.register(CampaignRecipient)