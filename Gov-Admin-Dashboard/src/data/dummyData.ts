// Pune District Locations for Map
export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'village' | 'town' | 'city';
  panchayat?: string;
}

export const puneLocations: Location[] = [
  { id: 'loc1', name: 'Shivajinagar', lat: 18.5308, lng: 73.8475, type: 'city' },
  { id: 'loc2', name: 'Kothrud', lat: 18.5074, lng: 73.8077, type: 'city' },
  { id: 'loc3', name: 'Hadapsar', lat: 18.5089, lng: 73.9260, type: 'city' },
  { id: 'loc4', name: 'Baramati', lat: 18.1515, lng: 74.5777, type: 'town', panchayat: 'Baramati Gram Panchayat' },
  { id: 'loc5', name: 'Junnar', lat: 19.2086, lng: 73.8789, type: 'town', panchayat: 'Junnar Gram Panchayat' },
  { id: 'loc6', name: 'Mulshi', lat: 18.5200, lng: 73.5100, type: 'village', panchayat: 'Mulshi Gram Panchayat' },
  { id: 'loc7', name: 'Velhe', lat: 18.2800, lng: 73.6300, type: 'village', panchayat: 'Velhe Gram Panchayat' },
  { id: 'loc8', name: 'Bhor', lat: 18.1500, lng: 73.8500, type: 'town', panchayat: 'Bhor Gram Panchayat' },
  { id: 'loc9', name: 'Daund', lat: 18.4600, lng: 74.5800, type: 'town', panchayat: 'Daund Gram Panchayat' },
  { id: 'loc10', name: 'Indapur', lat: 18.1100, lng: 75.0200, type: 'town', panchayat: 'Indapur Gram Panchayat' },
  { id: 'loc11', name: 'Shirur', lat: 18.8300, lng: 74.3800, type: 'town', panchayat: 'Shirur Gram Panchayat' },
  { id: 'loc12', name: 'Maval', lat: 18.7500, lng: 73.4100, type: 'village', panchayat: 'Maval Gram Panchayat' },
];

// Complaint Categories
export type ComplaintCategory = 
  | 'water_supply' 
  | 'sanitation' 
  | 'electricity' 
  | 'roads' 
  | 'healthcare' 
  | 'education' 
  | 'agriculture' 
  | 'public_safety'
  | 'welfare_schemes'
  | 'land_disputes';

export const complaintCategories: { id: ComplaintCategory; label: string; icon: string }[] = [
  { id: 'water_supply', label: 'Water Supply', icon: 'droplet' },
  { id: 'sanitation', label: 'Sanitation', icon: 'trash-2' },
  { id: 'electricity', label: 'Electricity', icon: 'zap' },
  { id: 'roads', label: 'Roads & Infrastructure', icon: 'road' },
  { id: 'healthcare', label: 'Healthcare', icon: 'heart-pulse' },
  { id: 'education', label: 'Education', icon: 'graduation-cap' },
  { id: 'agriculture', label: 'Agriculture', icon: 'wheat' },
  { id: 'public_safety', label: 'Public Safety', icon: 'shield' },
  { id: 'welfare_schemes', label: 'Welfare Schemes', icon: 'hand-helping' },
  { id: 'land_disputes', label: 'Land Disputes', icon: 'map-pin' },
];

// Complaint Status
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'escalated';

// Complaint Interface
export interface Complaint {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: Location;
  citizenName: string;
  citizenPhone: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  escalatedTo?: 'zilla_parishad';
  resolutionNotes?: string;
  attachments?: string[];
  isUrban: boolean;
}

// Dummy Complaints Data
export const complaints: Complaint[] = [
  {
    id: 'c1',
    ticketNumber: 'GP-2024-001',
    title: 'Irregular Water Supply in Ward 5',
    description: 'Water supply has been irregular for the past 2 weeks. Residents are facing severe difficulties.',
    category: 'water_supply',
    status: 'pending',
    priority: 'high',
    location: puneLocations[5],
    citizenName: 'Ramesh Patil',
    citizenPhone: '+91 9876543210',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
    isUrban: false,
  },
  {
    id: 'c2',
    ticketNumber: 'GP-2024-002',
    title: 'Street Lights Not Working',
    description: 'Multiple street lights on Main Road have been non-functional for a month.',
    category: 'electricity',
    status: 'in_progress',
    priority: 'medium',
    location: puneLocations[3],
    citizenName: 'Sunita Jadhav',
    citizenPhone: '+91 9876543211',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-12'),
    assignedTo: 'Electrical Dept.',
    isUrban: false,
  },
  {
    id: 'c3',
    ticketNumber: 'ZP-2024-001',
    title: 'Pothole-ridden Road Near Market',
    description: 'The main market road has dangerous potholes causing accidents.',
    category: 'roads',
    status: 'escalated',
    priority: 'critical',
    location: puneLocations[0],
    citizenName: 'Vijay Kumar',
    citizenPhone: '+91 9876543212',
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-12-01'),
    escalatedTo: 'zilla_parishad',
    isUrban: true,
  },
  {
    id: 'c4',
    ticketNumber: 'GP-2024-003',
    title: 'PHC Doctor Absent',
    description: 'The Primary Health Centre doctor has been absent for 3 days without notice.',
    category: 'healthcare',
    status: 'resolved',
    priority: 'high',
    location: puneLocations[7],
    citizenName: 'Meera Shinde',
    citizenPhone: '+91 9876543213',
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-14'),
    resolutionNotes: 'Substitute doctor arranged. Regular doctor rejoined.',
    isUrban: false,
  },
  {
    id: 'c5',
    ticketNumber: 'ZP-2024-002',
    title: 'Garbage Not Collected for 5 Days',
    description: 'Garbage has been piling up in Sector 12 for almost a week.',
    category: 'sanitation',
    status: 'in_progress',
    priority: 'high',
    location: puneLocations[1],
    citizenName: 'Anil Deshmukh',
    citizenPhone: '+91 9876543214',
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-14'),
    assignedTo: 'Sanitation Dept.',
    isUrban: true,
  },
  {
    id: 'c6',
    ticketNumber: 'GP-2024-004',
    title: 'School Building Needs Repair',
    description: 'The government primary school building has cracks and leaking roof.',
    category: 'education',
    status: 'pending',
    priority: 'medium',
    location: puneLocations[4],
    citizenName: 'Priya Gaikwad',
    citizenPhone: '+91 9876543215',
    createdAt: new Date('2024-12-11'),
    updatedAt: new Date('2024-12-11'),
    isUrban: false,
  },
  {
    id: 'c7',
    ticketNumber: 'GP-2024-005',
    title: 'Crop Insurance Not Received',
    description: 'Farmers in the village have not received their crop insurance claims from last season.',
    category: 'agriculture',
    status: 'escalated',
    priority: 'critical',
    location: puneLocations[9],
    citizenName: 'Shankar Bhosale',
    citizenPhone: '+91 9876543216',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-12-05'),
    escalatedTo: 'zilla_parishad',
    isUrban: false,
  },
  {
    id: 'c8',
    ticketNumber: 'ZP-2024-003',
    title: 'Land Record Discrepancy',
    description: 'Mismatch in land records causing legal issues for property transfer.',
    category: 'land_disputes',
    status: 'in_progress',
    priority: 'high',
    location: puneLocations[2],
    citizenName: 'Rajesh Thorat',
    citizenPhone: '+91 9876543217',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-10'),
    assignedTo: 'Revenue Dept.',
    isUrban: true,
  },
];

// Document Types
export type DocumentType = 
  | 'birth_certificate'
  | 'death_certificate'
  | 'caste_certificate'
  | 'income_certificate'
  | 'domicile_certificate'
  | 'land_record'
  | 'ration_card'
  | 'property_tax_receipt';

export const documentTypes: { id: DocumentType; label: string }[] = [
  { id: 'birth_certificate', label: 'Birth Certificate' },
  { id: 'death_certificate', label: 'Death Certificate' },
  { id: 'caste_certificate', label: 'Caste Certificate' },
  { id: 'income_certificate', label: 'Income Certificate' },
  { id: 'domicile_certificate', label: 'Domicile Certificate' },
  { id: 'land_record', label: 'Land Record (7/12)' },
  { id: 'ration_card', label: 'Ration Card' },
  { id: 'property_tax_receipt', label: 'Property Tax Receipt' },
];

// Issued Document
export interface IssuedDocument {
  id: string;
  documentType: DocumentType;
  citizenName: string;
  citizenAadhaar: string;
  blockchainHash: string;
  issuedAt: Date;
  expiresAt?: Date;
  status: 'active' | 'expired' | 'revoked';
  issuedBy: string;
  verificationCount: number;
}

export const issuedDocuments: IssuedDocument[] = [
  {
    id: 'doc1',
    documentType: 'birth_certificate',
    citizenName: 'Arjun Patil',
    citizenAadhaar: 'XXXX-XXXX-1234',
    blockchainHash: '0x7f8e9d2c3b4a5f6e7d8c9b0a1e2f3d4c5b6a7f8e',
    issuedAt: new Date('2024-11-15'),
    status: 'active',
    issuedBy: 'Mulshi Gram Panchayat',
    verificationCount: 3,
  },
  {
    id: 'doc2',
    documentType: 'income_certificate',
    citizenName: 'Kavita Jadhav',
    citizenAadhaar: 'XXXX-XXXX-5678',
    blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    issuedAt: new Date('2024-10-20'),
    expiresAt: new Date('2025-10-20'),
    status: 'active',
    issuedBy: 'Baramati Gram Panchayat',
    verificationCount: 7,
  },
  {
    id: 'doc3',
    documentType: 'land_record',
    citizenName: 'Suresh Bhosale',
    citizenAadhaar: 'XXXX-XXXX-9012',
    blockchainHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
    issuedAt: new Date('2024-08-10'),
    status: 'active',
    issuedBy: 'Junnar Gram Panchayat',
    verificationCount: 12,
  },
  {
    id: 'doc4',
    documentType: 'caste_certificate',
    citizenName: 'Pooja Gaikwad',
    citizenAadhaar: 'XXXX-XXXX-3456',
    blockchainHash: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
    issuedAt: new Date('2024-09-05'),
    status: 'active',
    issuedBy: 'Bhor Gram Panchayat',
    verificationCount: 5,
  },
];

// Job Vacancy for Women Empowerment
export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  eligibility: string;
  deadline: Date;
  postedAt: Date;
  totalPositions: number;
  appliedCount: number;
  status: 'open' | 'closed' | 'filled';
  description: string;
}

export const jobVacancies: JobVacancy[] = [
  {
    id: 'job1',
    title: 'Anganwadi Worker',
    department: 'Women & Child Development',
    location: 'Mulshi Taluka',
    salary: '₹8,000 - ₹12,000/month',
    eligibility: '10th Pass, Female candidates only',
    deadline: new Date('2024-12-31'),
    postedAt: new Date('2024-12-01'),
    totalPositions: 15,
    appliedCount: 42,
    status: 'open',
    description: 'Looking for dedicated women to serve as Anganwadi workers in rural areas.',
  },
  {
    id: 'job2',
    title: 'ASHA Health Worker',
    department: 'Health Department',
    location: 'Baramati Block',
    salary: '₹6,000 - ₹10,000/month',
    eligibility: '8th Pass, Married women preferred',
    deadline: new Date('2024-12-25'),
    postedAt: new Date('2024-11-28'),
    totalPositions: 25,
    appliedCount: 78,
    status: 'open',
    description: 'ASHA workers needed for community health initiatives.',
  },
  {
    id: 'job3',
    title: 'Self-Help Group Coordinator',
    department: 'Rural Development',
    location: 'Junnar Taluka',
    salary: '₹15,000 - ₹20,000/month',
    eligibility: 'Graduate, Experience in community work',
    deadline: new Date('2025-01-15'),
    postedAt: new Date('2024-12-10'),
    totalPositions: 5,
    appliedCount: 23,
    status: 'open',
    description: 'Coordinate and manage Self-Help Groups in the region.',
  },
  {
    id: 'job4',
    title: 'Data Entry Operator',
    department: 'Zilla Parishad IT Cell',
    location: 'Pune (HQ)',
    salary: '₹12,000 - ₹18,000/month',
    eligibility: '12th Pass, Computer knowledge',
    deadline: new Date('2024-12-20'),
    postedAt: new Date('2024-11-20'),
    totalPositions: 10,
    appliedCount: 56,
    status: 'open',
    description: 'Data entry and digitization of government records.',
  },
  {
    id: 'job5',
    title: 'Mid-Day Meal Supervisor',
    department: 'Education Department',
    location: 'Shirur Block',
    salary: '₹7,000 - ₹9,000/month',
    eligibility: '8th Pass, Female candidates',
    deadline: new Date('2024-12-15'),
    postedAt: new Date('2024-11-15'),
    totalPositions: 20,
    appliedCount: 20,
    status: 'filled',
    description: 'Supervise mid-day meal program in government schools.',
  },
];

// News/Announcements
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'scheme' | 'event' | 'alert' | 'development';
  publishedAt: Date;
  publishedBy: string;
  targetAudience: 'all' | 'gram_panchayat' | 'urban';
  priority: 'normal' | 'important' | 'urgent';
  attachments?: string[];
}

export const newsItems: NewsItem[] = [
  {
    id: 'news1',
    title: 'PM Kisan Samman Nidhi - 16th Installment Released',
    content: 'The 16th installment of PM Kisan Samman Nidhi has been released. All eligible farmers will receive ₹2,000 in their bank accounts.',
    category: 'scheme',
    publishedAt: new Date('2024-12-14'),
    publishedBy: 'Zilla Parishad, Pune',
    targetAudience: 'all',
    priority: 'important',
  },
  {
    id: 'news2',
    title: 'Gram Sabha Meeting Scheduled - December 26',
    content: 'The quarterly Gram Sabha meeting is scheduled for December 26, 2024 at 10:00 AM. All villagers are requested to attend.',
    category: 'announcement',
    publishedAt: new Date('2024-12-13'),
    publishedBy: 'Mulshi Gram Panchayat',
    targetAudience: 'gram_panchayat',
    priority: 'normal',
  },
  {
    id: 'news3',
    title: 'Water Conservation Workshop',
    content: 'Free workshop on water conservation and rainwater harvesting techniques. Date: December 20, 2024. Venue: Community Hall.',
    category: 'event',
    publishedAt: new Date('2024-12-12'),
    publishedBy: 'Agriculture Department',
    targetAudience: 'all',
    priority: 'normal',
  },
  {
    id: 'news4',
    title: 'Alert: Heavy Rainfall Expected',
    content: 'IMD has issued a warning for heavy rainfall in Pune district for the next 48 hours. Citizens are advised to take precautions.',
    category: 'alert',
    publishedAt: new Date('2024-12-14'),
    publishedBy: 'District Collector Office',
    targetAudience: 'all',
    priority: 'urgent',
  },
  {
    id: 'news5',
    title: 'New Road Construction - Baramati to Daund',
    content: 'Construction of 25 km new road connecting Baramati and Daund has commenced. Expected completion: March 2025.',
    category: 'development',
    publishedAt: new Date('2024-12-10'),
    publishedBy: 'PWD, Pune',
    targetAudience: 'all',
    priority: 'normal',
  },
];

// Government Schemes
export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  department: string;
  applicationDeadline?: Date;
  status: 'active' | 'upcoming' | 'closed';
  documentsRequired: string[];
  beneficiaryCount: number;
  totalBudget: string;
}

export const schemes: Scheme[] = [
  {
    id: 'scheme1',
    name: 'Pradhan Mantri Awas Yojana - Gramin',
    description: 'Housing for rural poor families. Financial assistance for construction of pucca houses.',
    eligibility: 'BPL families, landless laborers, scheduled castes/tribes',
    benefits: '₹1.20 Lakh for plain areas, ₹1.30 Lakh for hilly areas',
    department: 'Ministry of Rural Development',
    status: 'active',
    documentsRequired: ['Aadhaar Card', 'BPL Card', 'Bank Account', 'Land Document'],
    beneficiaryCount: 2450,
    totalBudget: '₹29.4 Crore',
  },
  {
    id: 'scheme2',
    name: 'Mahatma Gandhi NREGA',
    description: 'Guaranteed 100 days of wage employment per year to rural households.',
    eligibility: 'Adult members of rural households willing to do unskilled manual work',
    benefits: '₹273/day wage (Maharashtra)',
    department: 'Ministry of Rural Development',
    status: 'active',
    documentsRequired: ['Job Card', 'Aadhaar Card', 'Bank Account'],
    beneficiaryCount: 15680,
    totalBudget: '₹42.8 Crore',
  },
  {
    id: 'scheme3',
    name: 'Ladki Bahin Yojana',
    description: 'Financial assistance to women for economic empowerment.',
    eligibility: 'Women aged 21-60 years, annual family income below ₹2.5 Lakh',
    benefits: '₹1,500 per month',
    department: 'Women & Child Development',
    applicationDeadline: new Date('2025-03-31'),
    status: 'active',
    documentsRequired: ['Aadhaar Card', 'Income Certificate', 'Bank Account', 'Domicile Certificate'],
    beneficiaryCount: 8920,
    totalBudget: '₹16.1 Crore',
  },
  {
    id: 'scheme4',
    name: 'Shetkari Sanman Yojana',
    description: 'Crop loan waiver scheme for farmers.',
    eligibility: 'Farmers with outstanding crop loans up to ₹2 Lakh',
    benefits: 'Complete loan waiver up to ₹2 Lakh',
    department: 'Agriculture Department',
    status: 'active',
    documentsRequired: ['7/12 Extract', 'Loan Details', 'Aadhaar Card', 'Bank Statement'],
    beneficiaryCount: 3240,
    totalBudget: '₹64.8 Crore',
  },
];

// Bulk Calling Campaign
export interface BulkCallingCampaign {
  id: string;
  name: string;
  message: string;
  audioFile?: string;
  targetNumbers: string[];
  scheduledAt: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  completedCalls: number;
  failedCalls: number;
  createdBy: string;
}

export const bulkCallingCampaigns: BulkCallingCampaign[] = [
  {
    id: 'camp1',
    name: 'Gram Sabha Meeting Reminder',
    message: 'Reminder: Gram Sabha meeting on December 26 at 10 AM. Your participation is important.',
    targetNumbers: ['+919876543210', '+919876543211', '+919876543212', '+919876543213', '+919876543214'],
    scheduledAt: new Date('2024-12-24T09:00:00'),
    status: 'scheduled',
    completedCalls: 0,
    failedCalls: 0,
    createdBy: 'Mulshi Gram Panchayat',
  },
  {
    id: 'camp2',
    name: 'Vaccination Drive Announcement',
    message: 'Free vaccination camp on December 18 at PHC. Bring Aadhaar card.',
    targetNumbers: ['+919876543215', '+919876543216', '+919876543217'],
    scheduledAt: new Date('2024-12-16T10:00:00'),
    status: 'completed',
    completedCalls: 245,
    failedCalls: 12,
    createdBy: 'Health Department',
  },
];

// Dashboard Statistics
export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  escalatedComplaints: number;
  totalDocuments: number;
  totalVacancies: number;
  totalBeneficiaries: number;
  avgResolutionTime: string;
}

export const gramPanchayatStats: DashboardStats = {
  totalComplaints: 156,
  pendingComplaints: 34,
  resolvedComplaints: 98,
  escalatedComplaints: 12,
  totalDocuments: 1245,
  totalVacancies: 8,
  totalBeneficiaries: 4560,
  avgResolutionTime: '4.2 days',
};

export const zillaParishadStats: DashboardStats = {
  totalComplaints: 892,
  pendingComplaints: 156,
  resolvedComplaints: 645,
  escalatedComplaints: 45,
  totalDocuments: 8920,
  totalVacancies: 35,
  totalBeneficiaries: 45600,
  avgResolutionTime: '6.8 days',
};

// User Activity/History
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: Date;
  module: 'complaints' | 'documents' | 'vacancies' | 'schemes' | 'news';
}

export const recentActivities: UserActivity[] = [
  {
    id: 'act1',
    userId: 'admin1',
    action: 'Resolved Complaint',
    description: 'Resolved complaint GP-2024-003 regarding PHC doctor',
    timestamp: new Date('2024-12-14T14:30:00'),
    module: 'complaints',
  },
  {
    id: 'act2',
    userId: 'admin1',
    action: 'Issued Document',
    description: 'Issued birth certificate for Arjun Patil',
    timestamp: new Date('2024-12-14T11:20:00'),
    module: 'documents',
  },
  {
    id: 'act3',
    userId: 'admin1',
    action: 'Posted Vacancy',
    description: 'Posted new vacancy for Anganwadi Worker',
    timestamp: new Date('2024-12-13T16:45:00'),
    module: 'vacancies',
  },
  {
    id: 'act4',
    userId: 'admin1',
    action: 'Published News',
    description: 'Published announcement about Gram Sabha meeting',
    timestamp: new Date('2024-12-13T10:00:00'),
    module: 'news',
  },
  {
    id: 'act5',
    userId: 'admin1',
    action: 'Escalated Complaint',
    description: 'Escalated complaint GP-2024-005 to Zilla Parishad',
    timestamp: new Date('2024-12-12T15:30:00'),
    module: 'complaints',
  },
];
