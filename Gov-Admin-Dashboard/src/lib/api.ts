import {
  Complaint,
  Location,
  NewsItem,
  Scheme,
  JobVacancy,
  IssuedDocument,
  BulkCallingCampaign,
  DashboardStats,
  UserActivity,
} from "@/data/dummyData";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     headers: {
//       "Content-Type": "application/json",
//       ...getAuthHeaders(),
//       ...(options.headers || {}),
//     },
//     ...options,
//   });

//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     throw new Error(text || `Request failed with status ${res.status}`);
//   }

//   return (await res.json()) as T;
// }

//me********************************************************

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (res.status === 401) {
    // Clear auth data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    throw new Error("Authentication failed. Please login again.");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  // ✅ Handle 204 No Content (DELETE success)
  if (res.status === 204) {
    return undefined as T;
  }

  // ✅ Handle empty body safely
  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}




// AUTH

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  role: "gram_panchayat_admin" | "zilla_parishad_admin" | "citizen" | "department_official";
  panchayat: string | null;
  panchayat_name?: string | null;
}

export async function login(username: string, password: string): Promise<{
  access: string;
  refresh: string;
  user: AuthenticatedUser;
}> {
  const tokenRes = await apiFetch<{ access: string; refresh: string }>("/auth/token/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  localStorage.setItem("accessToken", tokenRes.access);
  localStorage.setItem("refreshToken", tokenRes.refresh);

  const user = await apiFetch<AuthenticatedUser>("/users/me/");
  localStorage.setItem("currentUser", JSON.stringify(user));

  return { ...tokenRes, user };
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return null;
  }
  
  try {
    const user = await apiFetch<AuthenticatedUser>("/users/me/");
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  } catch (error) {
    // Token is invalid, clear everything
    logout();
    return null;
  }
}

// Simple in-memory cache for locations so we don't refetch on every call
let locationsCache: Record<string, Location> | null = null;

interface ApiLocation {
  id: string;
  name: string;
  latitude: string | number;
  longitude: string | number;
  type: "village" | "town" | "city";
  panchayat_name?: string | null;
  is_urban: boolean;
}

async function fetchLocationsMap(): Promise<Record<string, Location>> {
  if (locationsCache) return locationsCache;

  // Fetch a reasonably large page so we simulate the earlier dummy dataset
  const data = await apiFetch<{ results?: ApiLocation[]; count?: number } | ApiLocation[]>(
    "/locations/?page_size=500",
  );

  const items = Array.isArray(data) ? data : data.results || [];

  const map: Record<string, Location> = {};

  items.forEach((loc) => {
    const lat = typeof loc.latitude === "string" ? parseFloat(loc.latitude) : loc.latitude;
    const lng = typeof loc.longitude === "string" ? parseFloat(loc.longitude) : loc.longitude;

    map[loc.id] = {
      id: loc.id,
      name: loc.name,
      lat: lat,
      lng: lng,
      type: loc.type,
      panchayat: loc.panchayat_name || undefined,
    };
  });

  locationsCache = map;
  return map;
}

interface ApiComplaint {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  category:
    | "water_supply"
    | "sanitation"
    | "electricity"
    | "roads"
    | "healthcare"
    | "education"
    | "agriculture"
    | "public_safety"
    | "welfare_schemes"
    | "land_disputes";
  status: "pending" | "in_progress" | "resolved" | "escalated";
  priority: "low" | "medium" | "high" | "critical";
  location: string;
  location_name: string;
  citizen_name: string;
  citizen_phone: string;
  escalated_to: "zilla_parishad" | null;
  resolution_notes: string | null;
  is_urban: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchComplaints(): Promise<Complaint[]> {
  const [locations, data] = await Promise.all([
    fetchLocationsMap(),
    apiFetch<{ results?: ApiComplaint[]; count?: number } | ApiComplaint[]>(
      "/complaints/?page_size=500&ordering=-created_at",
    ),
  ]);

  const items = Array.isArray(data) ? data : data.results || [];

  return items.map((c) => {
    const loc = locations[c.location];

    const location: Location = loc || {
      id: c.location,
      name: c.location_name,
      lat: 0,
      lng: 0,
      type: "village",
    };

    return {
      id: c.id,
      ticketNumber: c.ticket_number,
      title: c.title,
      description: c.description,
      category: c.category,
      status: c.status,
      priority: c.priority,
      location,
      citizenName: c.citizen_name,
      citizenPhone: c.citizen_phone,
      createdAt: new Date(c.created_at),
      updatedAt: new Date(c.updated_at),
      escalatedTo: c.escalated_to || undefined,
      resolutionNotes: c.resolution_notes || undefined,
      isUrban: c.is_urban,
    };
  });
}

// ========================= COMPLAINT MUTATIONS =========================

export async function resolveComplaint(complaintId: string, resolutionNotes: string): Promise<void> {
  await apiFetch<void>(`/complaints/${complaintId}/resolve/`, {
    method: "POST",
    body: JSON.stringify({ resolution_notes: resolutionNotes }),
  });
}

export async function escalateComplaint(complaintId: string, reason: string): Promise<void> {
  await apiFetch<void>(`/complaints/${complaintId}/escalate/`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// NEWS

interface ApiNewsItem {
  id: string;
  title: string;
  content: string;
  category: NewsItem["category"];
  published_at: string;
  published_by_name: string | null;
  publishing_authority: string;
  target_audience: NewsItem["targetAudience"];
  priority: NewsItem["priority"];
}

export async function fetchNews(): Promise<NewsItem[]> {
  const data = await apiFetch<{ results?: ApiNewsItem[] } | ApiNewsItem[]>("/news/?page_size=200");
  const items = Array.isArray(data) ? data : data.results || [];

  return items.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    category: n.category,
    publishedAt: new Date(n.published_at),
    publishedBy: n.published_by_name || n.publishing_authority,
    targetAudience: n.target_audience,
    priority: n.priority,
  }));
}

// SCHEMES

interface ApiScheme {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  department: string;
  application_deadline: string | null;
  status: Scheme["status"];
  beneficiary_count: number;
  total_budget: string;
  required_documents?: { document_name: string }[];
}

export async function fetchSchemes(): Promise<Scheme[]> {
  const data = await apiFetch<{ results?: ApiScheme[] } | ApiScheme[]>("/schemes/?page_size=200");
  const items = Array.isArray(data) ? data : data.results || [];

  return items.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    eligibility: s.eligibility,
    benefits: s.benefits,
    department: s.department,
    applicationDeadline: s.application_deadline ? new Date(s.application_deadline) : undefined,
    status: s.status,
    beneficiaryCount: s.beneficiary_count,
    totalBudget: s.total_budget,
    documentsRequired: (s.required_documents || []).map((d) => d.document_name),
  }));
}

// VACANCIES

interface ApiJobVacancy {
  id: string;
  title: string;
  department: string;
  location_name: string;
  location_text: string;
  salary_range: string;
  eligibility: string;
  description: string;
  deadline: string;
  posted_at: string;
  total_positions: number;
  filled_positions: number;
  status: JobVacancy["status"];
  applied_count: number;
}

export async function fetchJobVacancies(): Promise<JobVacancy[]> {
  const data = await apiFetch<{ results?: ApiJobVacancy[] } | ApiJobVacancy[]>(
    "/job-vacancies/?page_size=200",
  );
  const items = Array.isArray(data) ? data : data.results || [];

  return items.map((v) => ({
    id: v.id,
    title: v.title,
    department: v.department,
    location: v.location_text || v.location_name,
    salary: v.salary_range,
    eligibility: v.eligibility,
    deadline: new Date(v.deadline),
    postedAt: new Date(v.posted_at),
    totalPositions: v.total_positions,
    appliedCount: v.applied_count,
    status: v.status,
    description: v.description,
  }));
}

// DOCUMENTS

interface ApiIssuedDocument {
  id: string;
  document_type: IssuedDocument["documentType"];
  citizen_name: string;
  citizen_aadhaar: string;
  blockchain_hash: string;
  issued_at: string;
  expires_at: string | null;
  status: IssuedDocument["status"];
  issued_by_name: string | null;
  issuing_authority_name: string;
  verification_count: number;
}

export async function fetchIssuedDocuments(): Promise<IssuedDocument[]> {
  const data = await apiFetch<{ results?: ApiIssuedDocument[] } | ApiIssuedDocument[]>(
    "/documents/?page_size=200",
  );
  const items = Array.isArray(data) ? data : data.results || [];

  return items.map((d) => ({
    id: d.id,
    documentType: d.document_type,
    citizenName: d.citizen_name,
    citizenAadhaar: d.citizen_aadhaar,
    blockchainHash: d.blockchain_hash,
    issuedAt: new Date(d.issued_at),
    expiresAt: d.expires_at ? new Date(d.expires_at) : undefined,
    status: d.status,
    issuedBy: d.issued_by_name || d.issuing_authority_name,
    verificationCount: d.verification_count,
  }));
}

// BULK CALLING CAMPAIGNS

interface ApiCampaignRecipient {
  phone_number: string;
}

interface ApiBulkCallingCampaign {
  id: string;
  name: string;
  message: string;
  audio_file: string | null;
  scheduled_at: string;
  status: BulkCallingCampaign["status"];
  completed_calls: number;
  failed_calls: number;
  created_by_name: string;
  recipients: ApiCampaignRecipient[];
}

export async function fetchBulkCallingCampaigns(): Promise<BulkCallingCampaign[]> {
  const data = await apiFetch<{ results?: ApiBulkCallingCampaign[] } | ApiBulkCallingCampaign[]>(
    "/campaigns/?page_size=200",
  );
  const items = Array.isArray(data) ? data : data.results || [];

  return items.map((c) => ({
    id: c.id,
    name: c.name,
    message: c.message,
    audioFile: c.audio_file || undefined,
    targetNumbers: c.recipients.map((r) => r.phone_number),
    scheduledAt: new Date(c.scheduled_at),
    status: c.status,
    completedCalls: c.completed_calls,
    failedCalls: c.failed_calls,
    createdBy: c.created_by_name,
  }));
}

interface CreateBulkCallingCampaignPayload {
  name: string;
  message: string;
  phone_numbers: string[];
  scheduled_at: string;
}

export async function createBulkCallingCampaign(
  payload: CreateBulkCallingCampaignPayload,
): Promise<BulkCallingCampaign> {
  const data = await apiFetch<ApiBulkCallingCampaign>("/campaigns/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return {
    id: data.id,
    name: data.name,
    message: data.message,
    audioFile: data.audio_file || undefined,
    targetNumbers: data.recipients.map((r) => r.phone_number),
    scheduledAt: new Date(data.scheduled_at),
    status: data.status,
    completedCalls: data.completed_calls,
    failedCalls: data.failed_calls,
    createdBy: data.created_by_name,
  };
}

export async function startBulkCallingCampaign(campaignId: string): Promise<BulkCallingCampaign> {
  const data = await apiFetch<ApiBulkCallingCampaign>(`/campaigns/${campaignId}/start/`, {
    method: "POST",
  });

  return {
    id: data.id,
    name: data.name,
    message: data.message,
    audioFile: data.audio_file || undefined,
    targetNumbers: data.recipients.map((r) => r.phone_number),
    scheduledAt: new Date(data.scheduled_at),
    status: data.status,
    completedCalls: data.completed_calls,
    failedCalls: data.failed_calls,
    createdBy: data.created_by_name,
  };
}

// DASHBOARD STATS

interface ApiDashboardStats {
  total_complaints: number;
  pending_complaints: number;
  resolved_complaints: number;
  escalated_complaints: number;
  total_documents: number;
  total_vacancies: number;
  total_beneficiaries: number;
  avg_resolution_time: string;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data = await apiFetch<ApiDashboardStats>("/dashboard/stats/");
  return {
    totalComplaints: data.total_complaints,
    pendingComplaints: data.pending_complaints,
    resolvedComplaints: data.resolved_complaints,
    escalatedComplaints: data.escalated_complaints,
    totalDocuments: data.total_documents,
    totalVacancies: data.total_vacancies,
    totalBeneficiaries: data.total_beneficiaries,
    avgResolutionTime: data.avg_resolution_time,
  };
}

// USER ACTIVITIES

interface ApiUserActivity {
  id: string;
  user: string;
  action: string;
  description: string;
  module: UserActivity["module"];
  timestamp: string;
}

export async function fetchRecentActivities(): Promise<UserActivity[]> {
  const data = await apiFetch<{ results?: ApiUserActivity[] } | ApiUserActivity[]>(
    "/activities/?page_size=50&ordering=-timestamp",
  );
  const items = Array.isArray(data) ? data : data.results || [];

  return items.map((a) => ({
    id: a.id,
    userId: a.user,
    action: a.action,
    description: a.description,
    module: a.module,
    timestamp: new Date(a.timestamp),
  }));
}



//me********************************************************

// Replace your createNewsItem function with this:

// Replace your createNewsItem function with this:

export async function createNewsItem(newsData: {
  title: string;
  content: string;
  category: string;
  priority: string;
  target_audience: string;
}): Promise<NewsItem> {
  // Get current user to set publishing_authority
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const publishingAuthority = currentUser.panchayat_name || currentUser.username || "System";
  
  const payload = {
    ...newsData,
    publishing_authority: publishingAuthority,
  };
  
  console.log('Creating news with payload:', payload); // Debug log
  
  const data = await apiFetch<ApiNewsItem>("/news/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  console.log('Received response:', data); // Debug log

  // Transform the API response to match NewsItem interface
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category,
    publishedAt: new Date(data.published_at),
    publishedBy: data.published_by_name || data.publishing_authority,
    targetAudience: data.target_audience,
    priority: data.priority,
  };
}



export async function deleteNewsItem(newsId: string): Promise<void> {
  await apiFetch<void>(`/news/${newsId}/`, {
    method: "DELETE",
  });
}


export const updateNewsItem = async ({ id, data }: { id: string; data: any }) => {
  const response = await fetch(`http://localhost:8000/api/news/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: JSON.stringify({
      title: data.title,
      content: data.content,
      category: data.category,
      priority: data.priority,
      target_audience: data.targetAudience,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to update news');
  }

  return response.json();
};



















