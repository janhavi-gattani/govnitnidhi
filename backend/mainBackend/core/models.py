import uuid
from django.db import models, transaction
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone


# ====================== USER MANAGEMENT ======================

class User(AbstractUser):
    ROLE_CHOICES = [
        ('gram_panchayat_admin', 'Gram Panchayat Admin'),
        ('zilla_parishad_admin', 'Zilla Parishad Admin'),
        ('citizen', 'Citizen'),
        ('department_official', 'Department Official'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, unique=True)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='citizen')
    panchayat = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['phone_number']),
        ]

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Location(models.Model):
    TYPE_CHOICES = [
        ('village', 'Village'),
        ('town', 'Town'),
        ('city', 'City'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    panchayat_name = models.CharField(max_length=200, null=True, blank=True)
    parent_location = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='sub_locations')
    district = models.CharField(max_length=100, default='Pune')
    taluka = models.CharField(max_length=100, null=True, blank=True)
    is_urban = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'locations'
        indexes = [
            models.Index(fields=['type']),
            models.Index(fields=['district', 'taluka']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


# ====================== COMPLAINT MANAGEMENT ======================

class Complaint(models.Model):
    CATEGORY_CHOICES = [
        ('water_supply', 'Water Supply'),
        ('sanitation', 'Sanitation'),
        ('electricity', 'Electricity'),
        ('roads', 'Roads & Infrastructure'),
        ('healthcare', 'Healthcare'),
        ('education', 'Education'),
        ('agriculture', 'Agriculture'),
        ('public_safety', 'Public Safety'),
        ('welfare_schemes', 'Welfare Schemes'),
        ('land_disputes', 'Land Disputes'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('escalated', 'Escalated'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    ESCALATION_CHOICES = [
        ('zilla_parishad', 'Zilla Parishad'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ticket_number = models.CharField(max_length=50, unique=True, editable=False)
    title = models.CharField(max_length=300)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='complaints')
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name='complaints')
    citizen_name = models.CharField(max_length=200)
    citizen_phone = models.CharField(max_length=17)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_complaints')
    assigned_department = models.CharField(max_length=200, null=True, blank=True)
    escalated_to = models.CharField(max_length=30, choices=ESCALATION_CHOICES, null=True, blank=True)
    escalation_reason = models.TextField(null=True, blank=True)
    resolution_notes = models.TextField(null=True, blank=True)
    is_urban = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'complaints'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['ticket_number']),
            models.Index(fields=['status']),
            models.Index(fields=['category']),
            models.Index(fields=['priority']),
            models.Index(fields=['-created_at']),
        ]

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            prefix = 'ZP' if self.is_urban else 'GP'
            year = timezone.now().year

            with transaction.atomic():
                last = Complaint.objects.select_for_update().filter(
                    ticket_number__startswith=f"{prefix}-{year}-"
                ).order_by('-ticket_number').first()

                if last:
                    last_num = int(last.ticket_number.split('-')[-1])
                    next_num = last_num + 1
                else:
                    next_num = 1

                self.ticket_number = f"{prefix}-{year}-{next_num:03d}"

        if self.status == 'resolved' and not self.resolved_at:
            self.resolved_at = timezone.now()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_number} - {self.title}"


class ComplaintAttachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='complaints/attachments/%Y/%m/')
    file_type = models.CharField(max_length=50)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'complaint_attachments'

    def __str__(self):
        return f"Attachment for {self.complaint.ticket_number}"


class ComplaintHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='history')
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    comments = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'complaint_history'
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.complaint.ticket_number} - {self.old_status} → {self.new_status}"


# ====================== DOCUMENT MANAGEMENT ======================

class IssuedDocument(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('birth_certificate', 'Birth Certificate'),
        ('death_certificate', 'Death Certificate'),
        ('caste_certificate', 'Caste Certificate'),
        ('income_certificate', 'Income Certificate'),
        ('domicile_certificate', 'Domicile Certificate'),
        ('land_record', 'Land Record (7/12)'),
        ('ration_card', 'Ration Card'),
        ('property_tax_receipt', 'Property Tax Receipt'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('revoked', 'Revoked'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPE_CHOICES)
    citizen = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    citizen_name = models.CharField(max_length=200)
    citizen_aadhaar = models.CharField(max_length=100)  # Should be encrypted in production
    blockchain_hash = models.CharField(max_length=200, unique=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    issued_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='issued_documents')
    issuing_authority = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='issued_documents')
    verification_count = models.IntegerField(default=0)
    document_file = models.FileField(upload_to='documents/issued/%Y/%m/')
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'issued_documents'
        ordering = ['-issued_at']
        indexes = [
            models.Index(fields=['blockchain_hash']),
            models.Index(fields=['document_type']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.get_document_type_display()} - {self.citizen_name}"


class DocumentVerification(models.Model):
    VERIFICATION_METHOD_CHOICES = [
        ('blockchain', 'Blockchain'),
        ('manual', 'Manual'),
        ('api', 'API'),
    ]
    
    RESULT_CHOICES = [
        ('valid', 'Valid'),
        ('invalid', 'Invalid'),
        ('expired', 'Expired'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(IssuedDocument, on_delete=models.CASCADE, related_name='verifications')
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    verified_at = models.DateTimeField(auto_now_add=True)
    verification_method = models.CharField(max_length=20, choices=VERIFICATION_METHOD_CHOICES)
    ip_address = models.GenericIPAddressField()
    result = models.CharField(max_length=20, choices=RESULT_CHOICES)

    class Meta:
        db_table = 'document_verifications'
        ordering = ['-verified_at']

    def __str__(self):
        return f"Verification of {self.document.id} - {self.result}"


# ====================== EMPLOYMENT & WOMEN EMPOWERMENT ======================

class JobVacancy(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('filled', 'Filled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    department = models.CharField(max_length=200)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='job_vacancies')
    location_text = models.CharField(max_length=200)
    salary_range = models.CharField(max_length=100)
    eligibility = models.TextField()
    description = models.TextField()
    deadline = models.DateTimeField()
    posted_at = models.DateTimeField(auto_now_add=True)
    total_positions = models.IntegerField(default=1)
    filled_positions = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='posted_vacancies')
    requirements = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'job_vacancies'
        ordering = ['-posted_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['deadline']),
        ]

    def __str__(self):
        return f"{self.title} - {self.department}"

    @property
    def applied_count(self):
        return self.applications.count()


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('selected', 'Selected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vacancy = models.ForeignKey(JobVacancy, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_applications')
    applicant_name = models.CharField(max_length=200)
    applicant_phone = models.CharField(max_length=17)
    applicant_email = models.EmailField()
    # resume = models.FileField(upload_to='jobs/resumes/%Y/%m/', null=True, blank=True)
    resume = models.FileField(upload_to='jobs/resumes/%Y/%m/', null=True, blank=True)  # ✅ Changed here
    cover_letter = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_applications')
    notes = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'job_applications'
        ordering = ['-applied_at']
        unique_together = ['vacancy', 'applicant']

    def __str__(self):
        return f"{self.applicant_name} - {self.vacancy.title}"


# ====================== NEWS & ANNOUNCEMENTS ======================

class NewsItem(models.Model):
    CATEGORY_CHOICES = [
        ('announcement', 'Announcement'),
        ('scheme', 'Scheme'),
        ('event', 'Event'),
        ('alert', 'Alert'),
        ('development', 'Development'),
    ]
    
    TARGET_AUDIENCE_CHOICES = [
        ('all', 'All'),
        ('gram_panchayat', 'Gram Panchayat'),
        ('urban', 'Urban'),
    ]
    
    PRIORITY_CHOICES = [
        ('normal', 'Normal'),
        ('important', 'Important'),
        ('urgent', 'Urgent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=300)
    content = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    published_at = models.DateTimeField(auto_now_add=True)
    published_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='published_news')
    publishing_authority = models.CharField(max_length=200)
    target_audience = models.CharField(max_length=30, choices=TARGET_AUDIENCE_CHOICES, default='all')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    is_active = models.BooleanField(default=True)
    views_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'news_items'
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['target_audience']),
            models.Index(fields=['priority']),
        ]

    def __str__(self):
        return self.title


class NewsAttachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    news_item = models.ForeignKey(NewsItem, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='news/attachments/%Y/%m/')
    file_type = models.CharField(max_length=50)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'news_attachments'

    def __str__(self):
        return f"Attachment for {self.news_item.title}"


# ====================== GOVERNMENT SCHEMES ======================

class Scheme(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('upcoming', 'Upcoming'),
        ('closed', 'Closed'),
    ]
    
    SCHEME_TYPE_CHOICES = [
        ('central', 'Central'),
        ('state', 'State'),
        ('district', 'District'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=300)
    description = models.TextField()
    eligibility = models.TextField()
    benefits = models.TextField()
    department = models.CharField(max_length=200)
    application_deadline = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    beneficiary_count = models.IntegerField(default=0)
    total_budget = models.CharField(max_length=100)
    scheme_type = models.CharField(max_length=20, choices=SCHEME_TYPE_CHOICES, default='state')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'schemes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['scheme_type']),
        ]

    def __str__(self):
        return self.name


class SchemeDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='required_documents')
    document_name = models.CharField(max_length=200)
    is_mandatory = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'scheme_documents'
        ordering = ['order']

    def __str__(self):
        return f"{self.scheme.name} - {self.document_name}"


class SchemeBeneficiary(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('on_hold', 'On Hold'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='beneficiaries')
    beneficiary = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheme_benefits')
    beneficiary_name = models.CharField(max_length=200)
    beneficiary_aadhaar = models.CharField(max_length=100)  # Should be encrypted
    application_date = models.DateTimeField(auto_now_add=True)
    approval_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    amount_received = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_beneficiaries')
    remarks = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'scheme_beneficiaries'
        ordering = ['-application_date']
        unique_together = ['scheme', 'beneficiary']

    def __str__(self):
        return f"{self.beneficiary_name} - {self.scheme.name}"


# ====================== BULK COMMUNICATION ======================

class BulkCallingCampaign(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=300)
    message = models.TextField()
    audio_file = models.FileField(upload_to='campaigns/audio/', null=True, blank=True)
    scheduled_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    completed_calls = models.IntegerField(default=0)
    failed_calls = models.IntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='campaigns')
    target_location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaigns')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bulk_calling_campaigns'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class CampaignRecipient(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('busy', 'Busy'),
        ('no_answer', 'No Answer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campaign = models.ForeignKey(BulkCallingCampaign, on_delete=models.CASCADE, related_name='recipients')
    phone_number = models.CharField(max_length=17)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    attempted_at = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True)  # in seconds
    error_message = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'campaign_recipients'
        unique_together = ['campaign', 'phone_number']

    def __str__(self):
        return f"{self.campaign.name} - {self.phone_number}"


# ====================== ANALYTICS & AUDIT ======================

class DashboardMetrics(models.Model):
    LOCATION_TYPE_CHOICES = [
        ('gram_panchayat', 'Gram Panchayat'),
        ('zilla_parishad', 'Zilla Parishad'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True, blank=True, related_name='metrics')
    location_type = models.CharField(max_length=30, choices=LOCATION_TYPE_CHOICES)
    total_complaints = models.IntegerField(default=0)
    pending_complaints = models.IntegerField(default=0)
    resolved_complaints = models.IntegerField(default=0)
    escalated_complaints = models.IntegerField(default=0)
    total_documents = models.IntegerField(default=0)
    total_vacancies = models.IntegerField(default=0)
    total_beneficiaries = models.IntegerField(default=0)
    avg_resolution_time = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # in days
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'dashboard_metrics'
        ordering = ['-date']
        unique_together = ['date', 'location', 'location_type']

    def __str__(self):
        return f"Metrics for {self.location_type} on {self.date}"


class UserActivity(models.Model):
    MODULE_CHOICES = [
        ('complaints', 'Complaints'),
        ('documents', 'Documents'),
        ('vacancies', 'Vacancies'),
        ('schemes', 'Schemes'),
        ('news', 'News'),
        ('campaigns', 'Campaigns'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=100)
    description = models.TextField()
    module = models.CharField(max_length=30, choices=MODULE_CHOICES)
    related_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    related_object_id = models.UUIDField(null=True, blank=True)
    related_object = GenericForeignKey('related_content_type', 'related_object_id')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_activities'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['module']),
            models.Index(fields=['-timestamp']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.action}"


# ====================== NOTIFICATIONS ======================

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('complaint_update', 'Complaint Update'),
        ('document_ready', 'Document Ready'),
        ('job_alert', 'Job Alert'),
        ('scheme_announcement', 'Scheme Announcement'),
        ('news', 'News'),
        ('general', 'General'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=300)
    message = models.TextField()
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE_CHOICES, default='general')
    is_read = models.BooleanField(default=False)
    related_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    related_object_id = models.UUIDField(null=True, blank=True)
    related_object = GenericForeignKey('related_content_type', 'related_object_id')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_read']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"Notification for {self.recipient.username} - {self.title}"