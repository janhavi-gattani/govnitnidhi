// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Scheme } from '@/data/dummyData';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import {
//   Search,
//   Plus,
//   Users,
//   IndianRupee,
//   FileText,
//   CheckCircle,
//   Clock,
//   Calendar,
//   Building2,
//   Eye,
//   Edit,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { fetchSchemes } from '@/lib/api';

// interface SchemesPageProps {
//   type: 'gram_panchayat' | 'zilla_parishad';
// }

// export function SchemesPage({ type }: SchemesPageProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

//   const {
//     data: schemes = [],
//     isLoading,
//     isError,
//   } = useQuery<Scheme[]>({
//     queryKey: ['schemes'],
//     queryFn: fetchSchemes,
//   });

//   const filteredSchemes = schemes.filter((scheme) => {
//     const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || scheme.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusBadge = (status: string) => {
//     const styles = {
//       active: 'bg-success/10 text-success border-success/20',
//       upcoming: 'bg-warning/10 text-warning border-warning/20',
//       closed: 'bg-muted text-muted-foreground border-muted',
//     };

//     const icons = {
//       active: <CheckCircle className="h-3 w-3 mr-1" />,
//       upcoming: <Clock className="h-3 w-3 mr-1" />,
//       closed: <Calendar className="h-3 w-3 mr-1" />,
//     };

//     return (
//       <Badge variant="outline" className={cn('capitalize', styles[status as keyof typeof styles])}>
//         {icons[status as keyof typeof icons]}
//         {status}
//       </Badge>
//     );
//   };

//   const handleUploadScheme = () => {
//     toast.success('Scheme uploaded successfully!');
//     setIsCreateDialogOpen(false);
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Government Schemes</h2>
//           <p className="text-muted-foreground">
//             {type === 'zilla_parishad' ? 'Upload and manage schemes' : 'View available schemes'}
//           </p>
//         </div>
//         {type === 'zilla_parishad' && (
//           <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="bg-accent hover:bg-accent/90">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Upload New Scheme
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2">
//                   <Users className="h-5 w-5 text-accent" />
//                   Upload New Scheme
//                 </DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4 py-4">
//                 <div>
//                   <Label htmlFor="schemeName">Scheme Name *</Label>
//                   <Input
//                     id="schemeName"
//                     placeholder="e.g., Pradhan Mantri Awas Yojana"
//                     className="mt-2"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="schemeDesc">Description *</Label>
//                   <Textarea
//                     id="schemeDesc"
//                     placeholder="Detailed description of the scheme..."
//                     className="mt-2"
//                     rows={3}
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="department">Department</Label>
//                     <Input
//                       id="department"
//                       placeholder="e.g., Ministry of Rural Development"
//                       className="mt-2"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="budget">Total Budget</Label>
//                     <Input
//                       id="budget"
//                       placeholder="e.g., ₹10 Crore"
//                       className="mt-2"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="eligibility">Eligibility Criteria *</Label>
//                   <Textarea
//                     id="eligibility"
//                     placeholder="Who can apply for this scheme..."
//                     className="mt-2"
//                     rows={2}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="benefits">Benefits *</Label>
//                   <Textarea
//                     id="benefits"
//                     placeholder="What benefits does this scheme provide..."
//                     className="mt-2"
//                     rows={2}
//                   />
//                 </div>
//                 <div>
//                   <Label>Documents Required</Label>
//                   <div className="mt-2 p-3 border border-dashed rounded-lg">
//                     <Input
//                       placeholder="Enter document name and press Enter"
//                       className="border-0 p-0 focus-visible:ring-0"
//                     />
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       <Badge variant="secondary">Aadhaar Card</Badge>
//                       <Badge variant="secondary">Income Certificate</Badge>
//                       <Badge variant="secondary">Bank Account</Badge>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <Label>Application Deadline</Label>
//                   <Input type="date" className="mt-2" />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleUploadScheme} className="bg-accent hover:bg-accent/90">
//                   <Users className="h-4 w-4 mr-2" />
//                   Upload Scheme
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         )}
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="stat-card bg-success/5 border-success/20">
//           <p className="text-sm text-muted-foreground">Active Schemes</p>
//           <p className="text-2xl font-bold mt-1 text-success">
//             {schemes.filter((s) => s.status === 'active').length}
//           </p>
//         </div>
//         <div className="stat-card">
//           <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
//           <p className="text-2xl font-bold mt-1">
//             {schemes.reduce((sum, s) => sum + s.beneficiaryCount, 0).toLocaleString()}
//           </p>
//         </div>
//         <div className="stat-card bg-accent/5 border-accent/20">
//           <p className="text-sm text-muted-foreground">Total Budget</p>
//           <p className="text-2xl font-bold mt-1 text-accent">
//             {schemes
//               .map((s) => s.totalBudget)
//               .filter(Boolean)
//               .join(', ') || '—'}
//           </p>
//         </div>
//         <div className="stat-card">
//           <p className="text-sm text-muted-foreground">Departments</p>
//           <p className="text-2xl font-bold mt-1">
//             {new Set(schemes.map((s) => s.department)).size}
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="dashboard-section">
//         <div className="flex flex-wrap gap-4">
//           <div className="flex-1 min-w-[200px]">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search schemes..."
//                 className="pl-10"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="upcoming">Upcoming</SelectItem>
//               <SelectItem value="closed">Closed</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Schemes List */}
//       <Accordion type="single" collapsible className="space-y-4">
//         {isLoading && (
//           <p className="text-sm text-muted-foreground px-2">Loading schemes...</p>
//         )}
//         {isError && (
//           <p className="text-sm text-destructive px-2">Failed to load schemes from the server.</p>
//         )}
//         {filteredSchemes.map((scheme) => (
//           <AccordionItem
//             key={scheme.id}
//             value={scheme.id}
//             className="dashboard-section border rounded-xl overflow-hidden"
//           >
//             <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
//               <div className="flex items-center gap-4 w-full text-left">
//                 <div className="p-3 rounded-xl bg-primary/10 shrink-0">
//                   <Users className="h-6 w-6 text-primary" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-3 mb-1 flex-wrap">
//                     <h3 className="font-semibold">{scheme.name}</h3>
//                     {getStatusBadge(scheme.status)}
//                   </div>
//                   <p className="text-sm text-muted-foreground truncate">{scheme.description}</p>
//                 </div>
//                 <div className="hidden md:flex items-center gap-6 shrink-0">
//                   <div className="text-center">
//                     <p className="text-lg font-bold text-foreground">
//                       {scheme.beneficiaryCount.toLocaleString()}
//                     </p>
//                     <p className="text-xs text-muted-foreground">Beneficiaries</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-lg font-bold text-accent">{scheme.totalBudget}</p>
//                     <p className="text-xs text-muted-foreground">Budget</p>
//                   </div>
//                 </div>
//               </div>
//             </AccordionTrigger>
//             <AccordionContent className="px-6 pb-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <CheckCircle className="h-4 w-4 text-success" />
//                       Eligibility
//                     </h4>
//                     <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <IndianRupee className="h-4 w-4 text-accent" />
//                       Benefits
//                     </h4>
//                     <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <Building2 className="h-4 w-4 text-primary" />
//                       Department
//                     </h4>
//                     <p className="text-sm text-muted-foreground">{scheme.department}</p>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <FileText className="h-4 w-4 text-primary" />
//                       Documents Required
//                     </h4>
//                     <div className="flex flex-wrap gap-2">
//                       {scheme.documentsRequired.map((doc, index) => (
//                         <Badge key={index} variant="secondary" className="text-xs">
//                           {doc}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                   {scheme.applicationDeadline && (
//                     <div>
//                       <h4 className="font-medium flex items-center gap-2 mb-2">
//                         <Calendar className="h-4 w-4 text-warning" />
//                         Application Deadline
//                       </h4>
//                       <p className="text-sm text-muted-foreground">
//                         {scheme.applicationDeadline.toLocaleDateString('en-IN', {
//                           day: 'numeric',
//                           month: 'long',
//                           year: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   )}
//                   <div className="flex gap-2 pt-2">
//                     <Button variant="outline" size="sm">
//                       <Eye className="h-4 w-4 mr-1" />
//                       View Details
//                     </Button>
//                     {type === 'zilla_parishad' && (
//                       <Button variant="outline" size="sm">
//                         <Edit className="h-4 w-4 mr-1" />
//                         Edit
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>

//       {filteredSchemes.length === 0 && (
//         <div className="text-center py-12 text-muted-foreground dashboard-section">
//           No schemes found matching your criteria
//         </div>
//       )}
//     </div>
//   );
// }












// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import {
//   Search,
//   Plus,
//   Users,
//   IndianRupee,
//   FileText,
//   CheckCircle,
//   Clock,
//   Calendar,
//   Building2,
//   Eye,
//   Edit,
//   X,
//   Mail,
//   Phone,
//   CreditCard,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';

// interface SchemeDocument {
//   id: string;
//   document_name: string;
//   is_mandatory: boolean;
//   order: number;
// }

// interface SchemeBeneficiary {
//   id: string;
//   beneficiary_username: string;
//   beneficiary_name: string;
//   beneficiary_aadhaar: string;
//   application_date: string;
//   approval_date?: string;
//   status: 'pending' | 'approved' | 'rejected' | 'on_hold';
//   amount_received: string;
//   approved_by_name?: string;
//   remarks?: string;
// }

// interface Scheme {
//   id: string;
//   name: string;
//   description: string;
//   eligibility: string;
//   benefits: string;
//   department: string;
//   application_deadline?: string;
//   status: 'active' | 'upcoming' | 'closed';
//   beneficiary_count: number;
//   total_budget: string;
//   scheme_type: string;
//   required_documents: SchemeDocument[];
//   beneficiaries: SchemeBeneficiary[];
//   created_at: string;
//   updated_at: string;
// }

// interface SchemesPageProps {
//   type: 'gram_panchayat' | 'zilla_parishad';
// }

// const API_BASE_URL = 'http://localhost:8000/api'; // Update with your API base URL

// export default function SchemesPage({ type }: SchemesPageProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
//   const [editFormData, setEditFormData] = useState<Partial<Scheme>>({});
//   const [documentInput, setDocumentInput] = useState('');
//   const [documents, setDocuments] = useState<string[]>([]);

//   const queryClient = useQueryClient();

//   const {
//     data: schemes = [],
//     isLoading,
//     isError,
//   } = useQuery<Scheme[]>({
//     queryKey: ['schemes'],
//     queryFn: async () => {
//       const response = await fetch(`${API_BASE_URL}/schemes/`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch schemes');
//       const data = await response.json();
//       return data.results || data;
//     },
//   });

//   const createSchemeMutation = useMutation({
//     mutationFn: async (newScheme: any) => {
//       const response = await fetch(`${API_BASE_URL}/schemes/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify(newScheme),
//       });
//       if (!response.ok) throw new Error('Failed to create scheme');
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['schemes'] });
//       toast.success('Scheme uploaded successfully!');
//       setIsCreateDialogOpen(false);
//     },
//     onError: () => {
//       toast.error('Failed to upload scheme');
//     },
//   });

//   const updateSchemeMutation = useMutation({
//     mutationFn: async ({ id, data }: { id: string; data: any }) => {
//       const response = await fetch(`${API_BASE_URL}/schemes/${id}/`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) throw new Error('Failed to update scheme');
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['schemes'] });
//       toast.success('Scheme updated successfully!');
//       setIsEditDialogOpen(false);
//     },
//     onError: () => {
//       toast.error('Failed to update scheme');
//     },
//   });

//   const filteredSchemes = schemes.filter((scheme) => {
//     const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || scheme.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   // Fix total budget calculation
//   // const calculateTotalBudget = () => {
//   //   let total = 0;
//   //   schemes.forEach((scheme) => {
//   //     // Extract numeric value from budget string like "₹14,000 Crore"
//   //     const match = scheme.total_budget.match(/[\d,]+/);
//   //     if (match) {
//   //       const value = parseFloat(match[0].replace(/,/g, ''));
//   //       total += value;
//   //     }
//   //   });
//   //   return `₹${total.toLocaleString('en-IN')} Crore`;
//   // };

//   const calculateTotalBudget = () => {
//     let total = 0;
//     schemes.forEach((scheme) => {
//       // Add null/undefined check before calling match
//       if (scheme.total_budget) {
//         // Extract numeric value from budget string like "₹14,000 Crore"
//         const match = scheme.total_budget.match(/[\d,]+/);
//         if (match) {
//           const value = parseFloat(match[0].replace(/,/g, ''));
//           total += value;
//         }
//       }
//     });
//     return `₹${total.toLocaleString('en-IN')} Crore`;
//   };
//   const getStatusBadge = (status: string) => {
//     const styles = {
//       active: 'bg-success/10 text-success border-success/20',
//       upcoming: 'bg-warning/10 text-warning border-warning/20',
//       closed: 'bg-muted text-muted-foreground border-muted',
//       pending: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
//       approved: 'bg-success/10 text-success border-success/20',
//       rejected: 'bg-destructive/10 text-destructive border-destructive/20',
//       on_hold: 'bg-warning/10 text-warning border-warning/20',
//     };

//     const icons = {
//       active: <CheckCircle className="h-3 w-3 mr-1" />,
//       upcoming: <Clock className="h-3 w-3 mr-1" />,
//       closed: <Calendar className="h-3 w-3 mr-1" />,
//       pending: <Clock className="h-3 w-3 mr-1" />,
//       approved: <CheckCircle className="h-3 w-3 mr-1" />,
//       rejected: <X className="h-3 w-3 mr-1" />,
//       on_hold: <Clock className="h-3 w-3 mr-1" />,
//     };

//     return (
//       <Badge variant="outline" className={cn('capitalize', styles[status as keyof typeof styles])}>
//         {icons[status as keyof typeof icons]}
//         {status.replace('_', ' ')}
//       </Badge>
//     );
//   };

//   const handleViewScheme = (scheme: Scheme) => {
//     setSelectedScheme(scheme);
//     setIsViewDialogOpen(true);
//   };

//   const handleEditScheme = (scheme: Scheme) => {
//     setSelectedScheme(scheme);
//     setEditFormData({
//       name: scheme.name,
//       description: scheme.description,
//       eligibility: scheme.eligibility,
//       benefits: scheme.benefits,
//       department: scheme.department,
//       total_budget: scheme.total_budget,
//       status: scheme.status,
//       application_deadline: scheme.application_deadline,
//     });
//     setIsEditDialogOpen(true);
//   };

//   const handleUpdateScheme = () => {
//     if (selectedScheme) {
//       updateSchemeMutation.mutate({
//         id: selectedScheme.id,
//         data: editFormData,
//       });
//     }
//   };

//   const handleUploadScheme = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
    
//     const newScheme = {
//       name: formData.get('schemeName'),
//       description: formData.get('schemeDesc'),
//       eligibility: formData.get('eligibility'),
//       benefits: formData.get('benefits'),
//       department: formData.get('department'),
//       total_budget: formData.get('budget'),
//       status: 'active',
//       application_deadline: formData.get('deadline') || null,
//     };

//     createSchemeMutation.mutate(newScheme);
//   };

//   const addDocument = () => {
//     if (documentInput.trim()) {
//       setDocuments([...documents, documentInput.trim()]);
//       setDocumentInput('');
//     }
//   };

//   const removeDocument = (index: number) => {
//     setDocuments(documents.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Government Schemes</h2>
//           <p className="text-muted-foreground">
//             {type === 'zilla_parishad' ? 'Upload and manage schemes' : 'View available schemes'}
//           </p>
//         </div>
//         {type === 'zilla_parishad' && (
//           <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="bg-accent hover:bg-accent/90">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Upload New Scheme
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2">
//                   <Users className="h-5 w-5 text-accent" />
//                   Upload New Scheme
//                 </DialogTitle>
//               </DialogHeader>
//               <form onSubmit={handleUploadScheme} className="space-y-4 py-4">
//                 <div>
//                   <Label htmlFor="schemeName">Scheme Name *</Label>
//                   <Input
//                     id="schemeName"
//                     name="schemeName"
//                     placeholder="e.g., Pradhan Mantri Awas Yojana"
//                     className="mt-2"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="schemeDesc">Description *</Label>
//                   <Textarea
//                     id="schemeDesc"
//                     name="schemeDesc"
//                     placeholder="Detailed description of the scheme..."
//                     className="mt-2"
//                     rows={3}
//                     required
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="department">Department</Label>
//                     <Input
//                       id="department"
//                       name="department"
//                       placeholder="e.g., Ministry of Rural Development"
//                       className="mt-2"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="budget">Total Budget</Label>
//                     <Input
//                       id="budget"
//                       name="budget"
//                       placeholder="e.g., ₹10,000 Crore"
//                       className="mt-2"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="eligibility">Eligibility Criteria *</Label>
//                   <Textarea
//                     id="eligibility"
//                     name="eligibility"
//                     placeholder="Who can apply for this scheme..."
//                     className="mt-2"
//                     rows={2}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="benefits">Benefits *</Label>
//                   <Textarea
//                     id="benefits"
//                     name="benefits"
//                     placeholder="What benefits does this scheme provide..."
//                     className="mt-2"
//                     rows={2}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label>Documents Required</Label>
//                   <div className="mt-2 p-3 border border-dashed rounded-lg">
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Enter document name and press Enter"
//                         className="border-0 p-0 focus-visible:ring-0 flex-1"
//                         value={documentInput}
//                         onChange={(e) => setDocumentInput(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             addDocument();
//                           }
//                         }}
//                       />
//                       <Button type="button" size="sm" onClick={addDocument}>Add</Button>
//                     </div>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {documents.map((doc, index) => (
//                         <Badge key={index} variant="secondary" className="pr-1">
//                           {doc}
//                           <button
//                             type="button"
//                             onClick={() => removeDocument(index)}
//                             className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="deadline">Application Deadline</Label>
//                   <Input type="date" id="deadline" name="deadline" className="mt-2" />
//                 </div>
//                 <DialogFooter>
//                   <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" className="bg-accent hover:bg-accent/90">
//                     <Users className="h-4 w-4 mr-2" />
//                     Upload Scheme
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </DialogContent>
//           </Dialog>
//         )}
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="stat-card bg-success/5 border-success/20">
//           <p className="text-sm text-muted-foreground">Active Schemes</p>
//           <p className="text-2xl font-bold mt-1 text-success">
//             {schemes.filter((s) => s.status === 'active').length}
//           </p>
//         </div>
//         <div className="stat-card">
//           <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
//           <p className="text-2xl font-bold mt-1">
//             {schemes.reduce((sum, s) => sum + s.beneficiary_count, 0).toLocaleString()}
//           </p>
//         </div>
//         <div className="stat-card bg-accent/5 border-accent/20">
//           <p className="text-sm text-muted-foreground">Total Budget</p>
//           <p className="text-2xl font-bold mt-1 text-accent">
//             {calculateTotalBudget()}
//           </p>
//         </div>
//         <div className="stat-card">
//           <p className="text-sm text-muted-foreground">Departments</p>
//           <p className="text-2xl font-bold mt-1">
//             {new Set(schemes.map((s) => s.department)).size}
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="dashboard-section">
//         <div className="flex flex-wrap gap-4">
//           <div className="flex-1 min-w-[200px]">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search schemes..."
//                 className="pl-10"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="upcoming">Upcoming</SelectItem>
//               <SelectItem value="closed">Closed</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Schemes List */}
//       <Accordion type="single" collapsible className="space-y-4">
//         {isLoading && (
//           <p className="text-sm text-muted-foreground px-2">Loading schemes...</p>
//         )}
//         {isError && (
//           <p className="text-sm text-destructive px-2">Failed to load schemes from the server.</p>
//         )}
//         {filteredSchemes.map((scheme) => (
//           <AccordionItem
//             key={scheme.id}
//             value={scheme.id}
//             className="dashboard-section border rounded-xl overflow-hidden"
//           >
//             <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
//               <div className="flex items-center gap-4 w-full text-left">
//                 <div className="p-3 rounded-xl bg-primary/10 shrink-0">
//                   <Users className="h-6 w-6 text-primary" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-3 mb-1 flex-wrap">
//                     <h3 className="font-semibold">{scheme.name}</h3>
//                     {getStatusBadge(scheme.status)}
//                   </div>
//                   <p className="text-sm text-muted-foreground truncate">{scheme.description}</p>
//                 </div>
//                 <div className="hidden md:flex items-center gap-6 shrink-0">
//                   <div className="text-center">
//                     <p className="text-lg font-bold text-foreground">
//                       {scheme.beneficiary_count.toLocaleString()}
//                     </p>
//                     <p className="text-xs text-muted-foreground">Beneficiaries</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-lg font-bold text-accent">{scheme.total_budget}</p>
//                     <p className="text-xs text-muted-foreground">Budget</p>
//                   </div>
//                 </div>
//               </div>
//             </AccordionTrigger>
//             <AccordionContent className="px-6 pb-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <CheckCircle className="h-4 w-4 text-success" />
//                       Eligibility
//                     </h4>
//                     <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <IndianRupee className="h-4 w-4 text-accent" />
//                       Benefits
//                     </h4>
//                     <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <Building2 className="h-4 w-4 text-primary" />
//                       Department
//                     </h4>
//                     <p className="text-sm text-muted-foreground">{scheme.department}</p>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <FileText className="h-4 w-4 text-primary" />
//                       Documents Required
//                     </h4>
//                     <div className="flex flex-wrap gap-2">
//                       {scheme.required_documents?.map((doc) => (
//                         <Badge key={doc.id} variant="secondary" className="text-xs">
//                           {doc.document_name}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                   {scheme.application_deadline && (
//                     <div>
//                       <h4 className="font-medium flex items-center gap-2 mb-2">
//                         <Calendar className="h-4 w-4 text-warning" />
//                         Application Deadline
//                       </h4>
//                       <p className="text-sm text-muted-foreground">
//                         {new Date(scheme.application_deadline).toLocaleDateString('en-IN', {
//                           day: 'numeric',
//                           month: 'long',
//                           year: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   )}
//                   <div className="flex gap-2 pt-2">
//                     <Button variant="outline" size="sm" onClick={() => handleViewScheme(scheme)}>
//                       <Eye className="h-4 w-4 mr-1" />
//                       View Details
//                     </Button>
//                     {type === 'zilla_parishad' && (
//                       <Button variant="outline" size="sm" onClick={() => handleEditScheme(scheme)}>
//                         <Edit className="h-4 w-4 mr-1" />
//                         Edit
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>

//       {filteredSchemes.length === 0 && !isLoading && (
//         <div className="text-center py-12 text-muted-foreground dashboard-section">
//           No schemes found matching your criteria
//         </div>
//       )}

//       {/* View Details Dialog */}
//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Eye className="h-5 w-5 text-primary" />
//               {selectedScheme?.name}
//             </DialogTitle>
//           </DialogHeader>
//           {selectedScheme && (
//             <div className="space-y-6 py-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
//                     {getStatusBadge(selectedScheme.status)}
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Department</h4>
//                     <p className="text-sm">{selectedScheme.department}</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Total Budget</h4>
//                     <p className="text-sm font-semibold text-accent">{selectedScheme.total_budget}</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Beneficiary Count</h4>
//                     <p className="text-sm">{selectedScheme.beneficiary_count.toLocaleString()}</p>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Scheme Type</h4>
//                     <Badge variant="outline" className="capitalize">{selectedScheme.scheme_type}</Badge>
//                   </div>
//                   {selectedScheme.application_deadline && (
//                     <div>
//                       <h4 className="font-medium text-sm text-muted-foreground mb-1">Application Deadline</h4>
//                       <p className="text-sm">
//                         {new Date(selectedScheme.application_deadline).toLocaleDateString('en-IN', {
//                           day: 'numeric',
//                           month: 'long',
//                           year: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   )}
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Created At</h4>
//                     <p className="text-sm">
//                       {new Date(selectedScheme.created_at).toLocaleDateString('en-IN')}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4 border-t pt-4">
//                 <div>
//                   <h4 className="font-medium mb-2">Description</h4>
//                   <p className="text-sm text-muted-foreground">{selectedScheme.description}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Eligibility Criteria</h4>
//                   <p className="text-sm text-muted-foreground">{selectedScheme.eligibility}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Benefits</h4>
//                   <p className="text-sm text-muted-foreground">{selectedScheme.benefits}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Required Documents</h4>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedScheme.required_documents?.map((doc) => (
//                       <Badge key={doc.id} variant="secondary">
//                         {doc.document_name}
//                         {doc.is_mandatory && <span className="ml-1 text-destructive">*</span>}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Beneficiaries List */}
//               <div className="border-t pt-4">
//                 <h4 className="font-medium mb-4 flex items-center gap-2">
//                   <Users className="h-4 w-4" />
//                   Applied Beneficiaries ({selectedScheme.beneficiaries?.length || 0})
//                 </h4>
//                 {selectedScheme.beneficiaries && selectedScheme.beneficiaries.length > 0 ? (
//                   <div className="space-y-3 max-h-[300px] overflow-y-auto">
//                     {selectedScheme.beneficiaries.map((beneficiary) => (
//                       <div
//                         key={beneficiary.id}
//                         className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//                       >
//                         <div className="flex items-start justify-between gap-4">
//                           <div className="flex-1 space-y-2">
//                             <div className="flex items-center gap-3">
//                               <h5 className="font-medium">{beneficiary.beneficiary_name}</h5>
//                               {getStatusBadge(beneficiary.status)}
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
//                               <div className="flex items-center gap-2">
//                                 <Users className="h-3 w-3" />
//                                 <span>{beneficiary.beneficiary_username}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <CreditCard className="h-3 w-3" />
//                                 <span>Aadhaar: {beneficiary.beneficiary_aadhaar}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <Calendar className="h-3 w-3" />
//                                 <span>
//                                   Applied: {new Date(beneficiary.application_date).toLocaleDateString('en-IN')}
//                                 </span>
//                               </div>
//                               {beneficiary.status === 'approved' && beneficiary.amount_received && (
//                                 <div className="flex items-center gap-2">
//                                   <IndianRupee className="h-3 w-3" />
//                                   <span>Amount: ₹{parseFloat(beneficiary.amount_received).toLocaleString('en-IN')}</span>
//                                 </div>
//                               )}
//                             </div>
//                             {beneficiary.approved_by_name && (
//                               <p className="text-xs text-muted-foreground">
//                                 Approved by: {beneficiary.approved_by_name}
//                               </p>
//                             )}
//                             {beneficiary.remarks && (
//                               <p className="text-xs text-muted-foreground italic">
//                                 Remarks: {beneficiary.remarks}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-muted-foreground text-center py-8">
//                     No beneficiaries have applied for this scheme yet.
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Edit className="h-5 w-5 text-accent" />
//               Edit Scheme
//             </DialogTitle>
//           </DialogHeader>
//           {selectedScheme && (
//             <div className="space-y-4 py-4">
//               <div>
//                 <Label htmlFor="editSchemeName">Scheme Name *</Label>
//                 <Input
//                   id="editSchemeName"
//                   value={editFormData.name || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
//                   className="mt-2"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="editSchemeDesc">Description *</Label>
//                 <Textarea
//                   id="editSchemeDesc"
//                   value={editFormData.description || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
//                   className="mt-2"
//                   rows={3}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="editDepartment">Department</Label>
//                   <Input
//                     id="editDepartment"
//                     value={editFormData.department || ''}
//                     onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
//                     className="mt-2"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="editBudget">Total Budget</Label>
//                   <Input
//                     id="editBudget"
//                     value={editFormData.total_budget || ''}
//                     onChange={(e) => setEditFormData({ ...editFormData, total_budget: e.target.value })}
//                     className="mt-2"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="editStatus">Status</Label>
//                 <Select
//                   value={editFormData.status}
//                   onValueChange={(value: any) => setEditFormData({ ...editFormData, status: value })}
//                 >
//                   <SelectTrigger className="mt-2">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="upcoming">Upcoming</SelectItem>
//                     <SelectItem value="closed">Closed</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="editEligibility">Eligibility Criteria *</Label>
//                 <Textarea
//                   id="editEligibility"
//                   value={editFormData.eligibility || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, eligibility: e.target.value })}
//                   className="mt-2"
//                   rows={2}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="editBenefits">Benefits *</Label>
//                 <Textarea
//                   id="editBenefits"
//                   value={editFormData.benefits || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, benefits: e.target.value })}
//                   className="mt-2"
//                   rows={2}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="editDeadline">Application Deadline</Label>
//                 <Input
//                   type="date"
//                   id="editDeadline"
//                   value={editFormData.application_deadline ? editFormData.application_deadline.split('T')[0] : ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, application_deadline: e.target.value })}
//                   className="mt-2"
//                 />
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleUpdateScheme} className="bg-accent hover:bg-accent/90">
//               <Edit className="h-4 w-4 mr-2" />
//               Update Scheme
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }





















// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
// import {
//   Search,
//   Plus,
//   Users,
//   IndianRupee,
//   FileText,
//   CheckCircle,
//   Clock,
//   Calendar,
//   Building2,
//   Eye,
//   Edit,
//   X,
//   Mail,
//   Phone,
//   CreditCard,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';

// interface SchemeDocument {
//   id: string;
//   document_name: string;
//   is_mandatory: boolean;
//   order: number;
// }

// interface SchemeBeneficiary {
//   id: string;
//   beneficiary_username: string;
//   beneficiary_name: string;
//   beneficiary_aadhaar: string;
//   application_date: string;
//   approval_date?: string;
//   status: 'pending' | 'approved' | 'rejected' | 'on_hold';
//   amount_received: string;
//   approved_by_name?: string;
//   remarks?: string;
// }

// interface Scheme {
//   id: string;
//   name: string;
//   description: string;
//   eligibility: string;
//   benefits: string;
//   department: string;
//   application_deadline?: string;
//   status: 'active' | 'upcoming' | 'closed';
//   beneficiary_count: number;
//   total_budget: string;
//   scheme_type: string;
//   required_documents: SchemeDocument[];
//   beneficiaries: SchemeBeneficiary[];
//   created_at: string;
//   updated_at: string;
// }

// interface SchemesPageProps {
//   type: 'gram_panchayat' | 'zilla_parishad';
// }

// const API_BASE_URL = 'http://localhost:8000/api'; // Update with your API base URL

// export default function SchemesPage({ type }: SchemesPageProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
//   const [editFormData, setEditFormData] = useState<Partial<Scheme>>({});
//   const [documentInput, setDocumentInput] = useState('');
//   const [documents, setDocuments] = useState<string[]>([]);

//   const queryClient = useQueryClient();

//   const {
//     data: schemes = [],
//     isLoading,
//     isError,
//   } = useQuery<Scheme[]>({
//     queryKey: ['schemes'],
//     queryFn: async () => {
//       const response = await fetch(`${API_BASE_URL}/schemes/`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch schemes');
//       const data = await response.json();
//       return data.results || data;
//     },
//   });

//   const createSchemeMutation = useMutation({
//     mutationFn: async (newScheme: any) => {
//       const response = await fetch(`${API_BASE_URL}/schemes/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify(newScheme),
//       });
//       if (!response.ok) throw new Error('Failed to create scheme');
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['schemes'] });
//       toast.success('Scheme uploaded successfully!');
//       setIsCreateDialogOpen(false);
//     },
//     onError: () => {
//       toast.error('Failed to upload scheme');
//     },
//   });

//   const updateSchemeMutation = useMutation({
//     mutationFn: async ({ id, data }: { id: string; data: any }) => {
//       const response = await fetch(`${API_BASE_URL}/schemes/${id}/`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify(data),
//       });
//       if (!response.ok) throw new Error('Failed to update scheme');
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['schemes'] });
//       toast.success('Scheme updated successfully!');
//       setIsEditDialogOpen(false);
//     },
//     onError: () => {
//       toast.error('Failed to update scheme');
//     },
//   });

//   const filteredSchemes = schemes.filter((scheme) => {
//     const matchesSearch = scheme.name?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || scheme.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   // Fix total budget calculation
//   const calculateTotalBudget = () => {
//     let total = 0;
//     schemes.forEach((scheme) => {
//       // Add null/undefined check before calling match
//       if (scheme.total_budget) {
//         // Extract numeric value from budget string like "₹14,000 Crore"
//         const match = scheme.total_budget.match(/[\d,]+/);
//         if (match) {
//           const value = parseFloat(match[0].replace(/,/g, ''));
//           total += value;
//         }
//       }
//     });
//     return `₹${total.toLocaleString('en-IN')} Crore`;
//   };

//   const getStatusBadge = (status: string) => {
//     const styles = {
//       active: 'bg-success/10 text-success border-success/20',
//       upcoming: 'bg-warning/10 text-warning border-warning/20',
//       closed: 'bg-muted text-muted-foreground border-muted',
//       pending: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
//       approved: 'bg-success/10 text-success border-success/20',
//       rejected: 'bg-destructive/10 text-destructive border-destructive/20',
//       on_hold: 'bg-warning/10 text-warning border-warning/20',
//     };

//     const icons = {
//       active: <CheckCircle className="h-3 w-3 mr-1" />,
//       upcoming: <Clock className="h-3 w-3 mr-1" />,
//       closed: <Calendar className="h-3 w-3 mr-1" />,
//       pending: <Clock className="h-3 w-3 mr-1" />,
//       approved: <CheckCircle className="h-3 w-3 mr-1" />,
//       rejected: <X className="h-3 w-3 mr-1" />,
//       on_hold: <Clock className="h-3 w-3 mr-1" />,
//     };

//     return (
//       <Badge variant="outline" className={cn('capitalize', styles[status as keyof typeof styles])}>
//         {icons[status as keyof typeof icons]}
//         {status.replace('_', ' ')}
//       </Badge>
//     );
//   };

//   const handleViewScheme = (scheme: Scheme) => {
//     setSelectedScheme(scheme);
//     setIsViewDialogOpen(true);
//   };

//   const handleEditScheme = (scheme: Scheme) => {
//     setSelectedScheme(scheme);
//     setEditFormData({
//       name: scheme.name,
//       description: scheme.description,
//       eligibility: scheme.eligibility,
//       benefits: scheme.benefits,
//       department: scheme.department,
//       total_budget: scheme.total_budget,
//       status: scheme.status,
//       application_deadline: scheme.application_deadline,
//     });
//     setIsEditDialogOpen(true);
//   };

//   const handleUpdateScheme = () => {
//     if (selectedScheme) {
//       updateSchemeMutation.mutate({
//         id: selectedScheme.id,
//         data: editFormData,
//       });
//     }
//   };

//   const handleUploadScheme = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
    
//     const newScheme = {
//       name: formData.get('schemeName'),
//       description: formData.get('schemeDesc'),
//       eligibility: formData.get('eligibility'),
//       benefits: formData.get('benefits'),
//       department: formData.get('department'),
//       total_budget: formData.get('budget'),
//       status: 'active',
//       application_deadline: formData.get('deadline') || null,
//     };

//     createSchemeMutation.mutate(newScheme);
//   };

//   const addDocument = () => {
//     if (documentInput.trim()) {
//       setDocuments([...documents, documentInput.trim()]);
//       setDocumentInput('');
//     }
//   };

//   const removeDocument = (index: number) => {
//     setDocuments(documents.filter((_, i) => i !== index));
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading schemes...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (isError) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <p className="text-destructive mb-2">Failed to load schemes</p>
//           <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Government Schemes</h2>
//           <p className="text-muted-foreground">
//             {type === 'zilla_parishad' ? 'Upload and manage schemes' : 'View available schemes'}
//           </p>
//         </div>
//         {type === 'zilla_parishad' && (
//           <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="bg-accent hover:bg-accent/90">
//                 <Plus className="h-4 w-4 mr-2" />
//                 Upload New Scheme
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2">
//                   <Users className="h-5 w-5 text-accent" />
//                   Upload New Scheme
//                 </DialogTitle>
//               </DialogHeader>
//               <form onSubmit={handleUploadScheme} className="space-y-4 py-4">
//                 <div>
//                   <Label htmlFor="schemeName">Scheme Name *</Label>
//                   <Input
//                     id="schemeName"
//                     name="schemeName"
//                     placeholder="e.g., Pradhan Mantri Awas Yojana"
//                     className="mt-2"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="schemeDesc">Description *</Label>
//                   <Textarea
//                     id="schemeDesc"
//                     name="schemeDesc"
//                     placeholder="Detailed description of the scheme..."
//                     className="mt-2"
//                     rows={3}
//                     required
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="department">Department</Label>
//                     <Input
//                       id="department"
//                       name="department"
//                       placeholder="e.g., Ministry of Rural Development"
//                       className="mt-2"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="budget">Total Budget</Label>
//                     <Input
//                       id="budget"
//                       name="budget"
//                       placeholder="e.g., ₹10,000 Crore"
//                       className="mt-2"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="eligibility">Eligibility Criteria *</Label>
//                   <Textarea
//                     id="eligibility"
//                     name="eligibility"
//                     placeholder="Who can apply for this scheme..."
//                     className="mt-2"
//                     rows={2}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="benefits">Benefits *</Label>
//                   <Textarea
//                     id="benefits"
//                     name="benefits"
//                     placeholder="What benefits does this scheme provide..."
//                     className="mt-2"
//                     rows={2}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label>Documents Required</Label>
//                   <div className="mt-2 p-3 border border-dashed rounded-lg">
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Enter document name and press Enter"
//                         className="border-0 p-0 focus-visible:ring-0 flex-1"
//                         value={documentInput}
//                         onChange={(e) => setDocumentInput(e.target.value)}
//                         onKeyDown={(e) => {
//                           if (e.key === 'Enter') {
//                             e.preventDefault();
//                             addDocument();
//                           }
//                         }}
//                       />
//                       <Button type="button" size="sm" onClick={addDocument}>Add</Button>
//                     </div>
//                     <div className="flex flex-wrap gap-2 mt-2">
//                       {documents.map((doc, index) => (
//                         <Badge key={index} variant="secondary" className="pr-1">
//                           {doc}
//                           <button
//                             type="button"
//                             onClick={() => removeDocument(index)}
//                             className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
//                           >
//                             <X className="h-3 w-3" />
//                           </button>
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <Label htmlFor="deadline">Application Deadline</Label>
//                   <Input type="date" id="deadline" name="deadline" className="mt-2" />
//                 </div>
//                 <DialogFooter>
//                   <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" className="bg-accent hover:bg-accent/90">
//                     <Users className="h-4 w-4 mr-2" />
//                     Upload Scheme
//                   </Button>
//                 </DialogFooter>
//               </form>
//             </DialogContent>
//           </Dialog>
//         )}
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="stat-card bg-success/5 border-success/20">
//           <p className="text-sm text-muted-foreground">Active Schemes</p>
//           <p className="text-2xl font-bold mt-1 text-success">
//             {schemes.filter((s) => s.status === 'active').length}
//           </p>
//         </div>
//         <div className="stat-card">
//           <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
//           <p className="text-2xl font-bold mt-1">
//             {schemes.reduce((sum, s) => sum + (s.beneficiary_count || 0), 0).toLocaleString()}
//           </p>
//         </div>
//         <div className="stat-card bg-accent/5 border-accent/20">
//           <p className="text-sm text-muted-foreground">Total Budget</p>
//           <p className="text-2xl font-bold mt-1 text-accent">
//             {calculateTotalBudget()}
//           </p>
//         </div>
//         <div className="stat-card">
//           <p className="text-sm text-muted-foreground">Departments</p>
//           <p className="text-2xl font-bold mt-1">
//             {new Set(schemes.map((s) => s.department).filter(Boolean)).size}
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="dashboard-section">
//         <div className="flex flex-wrap gap-4">
//           <div className="flex-1 min-w-[200px]">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search schemes..."
//                 className="pl-10"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="upcoming">Upcoming</SelectItem>
//               <SelectItem value="closed">Closed</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Schemes List */}
//       <Accordion type="single" collapsible className="space-y-4">
//         {filteredSchemes.map((scheme) => (
//           <AccordionItem
//             key={scheme.id}
//             value={scheme.id}
//             className="dashboard-section border rounded-xl overflow-hidden"
//           >
//             <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
//               <div className="flex items-center gap-4 w-full text-left">
//                 <div className="p-3 rounded-xl bg-primary/10 shrink-0">
//                   <Users className="h-6 w-6 text-primary" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-3 mb-1 flex-wrap">
//                     <h3 className="font-semibold">{scheme.name}</h3>
//                     {getStatusBadge(scheme.status)}
//                   </div>
//                   <p className="text-sm text-muted-foreground truncate">{scheme.description}</p>
//                 </div>
//                 <div className="hidden md:flex items-center gap-6 shrink-0">
//                   <div className="text-center">
//                     <p className="text-lg font-bold text-foreground">
//                       {(scheme.beneficiary_count || 0).toLocaleString()}
//                     </p>
//                     <p className="text-xs text-muted-foreground">Beneficiaries</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-lg font-bold text-accent">{scheme.total_budget || 'N/A'}</p>
//                     <p className="text-xs text-muted-foreground">Budget</p>
//                   </div>
//                 </div>
//               </div>
//             </AccordionTrigger>
//             <AccordionContent className="px-6 pb-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <CheckCircle className="h-4 w-4 text-success" />
//                       Eligibility
//                     </h4>
//                     <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <IndianRupee className="h-4 w-4 text-accent" />
//                       Benefits
//                     </h4>
//                     <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <Building2 className="h-4 w-4 text-primary" />
//                       Department
//                     </h4>
//                     <p className="text-sm text-muted-foreground">{scheme.department}</p>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium flex items-center gap-2 mb-2">
//                       <FileText className="h-4 w-4 text-primary" />
//                       Documents Required
//                     </h4>
//                     <div className="flex flex-wrap gap-2">
//                       {scheme.required_documents && scheme.required_documents.length > 0 ? (
//                         scheme.required_documents.map((doc) => (
//                           <Badge key={doc.id} variant="secondary" className="text-xs">
//                             {doc.document_name}
//                           </Badge>
//                         ))
//                       ) : (
//                         <p className="text-xs text-muted-foreground">No documents specified</p>
//                       )}
//                     </div>
//                   </div>
//                   {scheme.application_deadline && (
//                     <div>
//                       <h4 className="font-medium flex items-center gap-2 mb-2">
//                         <Calendar className="h-4 w-4 text-warning" />
//                         Application Deadline
//                       </h4>
//                       <p className="text-sm text-muted-foreground">
//                         {new Date(scheme.application_deadline).toLocaleDateString('en-IN', {
//                           day: 'numeric',
//                           month: 'long',
//                           year: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   )}
//                   <div className="flex gap-2 pt-2">
//                     <Button variant="outline" size="sm" onClick={() => handleViewScheme(scheme)}>
//                       <Eye className="h-4 w-4 mr-1" />
//                       View Details
//                     </Button>
//                     {type === 'zilla_parishad' && (
//                       <Button variant="outline" size="sm" onClick={() => handleEditScheme(scheme)}>
//                         <Edit className="h-4 w-4 mr-1" />
//                         Edit
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>

//       {filteredSchemes.length === 0 && (
//         <div className="text-center py-12 text-muted-foreground dashboard-section">
//           No schemes found matching your criteria
//         </div>
//       )}

//       {/* View Details Dialog */}
//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Eye className="h-5 w-5 text-primary" />
//               {selectedScheme?.name}
//             </DialogTitle>
//           </DialogHeader>
//           {selectedScheme && (
//             <div className="space-y-6 py-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
//                     {getStatusBadge(selectedScheme.status)}
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Department</h4>
//                     <p className="text-sm">{selectedScheme.department}</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Total Budget</h4>
//                     <p className="text-sm font-semibold text-accent">{selectedScheme.total_budget || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Beneficiary Count</h4>
//                     <p className="text-sm">{(selectedScheme.beneficiary_count || 0).toLocaleString()}</p>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Scheme Type</h4>
//                     <Badge variant="outline" className="capitalize">{selectedScheme.scheme_type || 'N/A'}</Badge>
//                   </div>
//                   {selectedScheme.application_deadline && (
//                     <div>
//                       <h4 className="font-medium text-sm text-muted-foreground mb-1">Application Deadline</h4>
//                       <p className="text-sm">
//                         {new Date(selectedScheme.application_deadline).toLocaleDateString('en-IN', {
//                           day: 'numeric',
//                           month: 'long',
//                           year: 'numeric',
//                         })}
//                       </p>
//                     </div>
//                   )}
//                   <div>
//                     <h4 className="font-medium text-sm text-muted-foreground mb-1">Created At</h4>
//                     <p className="text-sm">
//                       {new Date(selectedScheme.created_at).toLocaleDateString('en-IN')}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4 border-t pt-4">
//                 <div>
//                   <h4 className="font-medium mb-2">Description</h4>
//                   <p className="text-sm text-muted-foreground">{selectedScheme.description}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Eligibility Criteria</h4>
//                   <p className="text-sm text-muted-foreground">{selectedScheme.eligibility}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Benefits</h4>
//                   <p className="text-sm text-muted-foreground">{selectedScheme.benefits}</p>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Required Documents</h4>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedScheme.required_documents && selectedScheme.required_documents.length > 0 ? (
//                       selectedScheme.required_documents.map((doc) => (
//                         <Badge key={doc.id} variant="secondary">
//                           {doc.document_name}
//                           {doc.is_mandatory && <span className="ml-1 text-destructive">*</span>}
//                         </Badge>
//                       ))
//                     ) : (
//                       <p className="text-xs text-muted-foreground">No documents specified</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Beneficiaries List */}
//               <div className="border-t pt-4">
//                 <h4 className="font-medium mb-4 flex items-center gap-2">
//                   <Users className="h-4 w-4" />
//                   Applied Beneficiaries ({selectedScheme.beneficiaries?.length || 0})
//                 </h4>
//                 {selectedScheme.beneficiaries && selectedScheme.beneficiaries.length > 0 ? (
//                   <div className="space-y-3 max-h-[300px] overflow-y-auto">
//                     {selectedScheme.beneficiaries.map((beneficiary) => (
//                       <div
//                         key={beneficiary.id}
//                         className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//                       >
//                         <div className="flex items-start justify-between gap-4">
//                           <div className="flex-1 space-y-2">
//                             <div className="flex items-center gap-3">
//                               <h5 className="font-medium">{beneficiary.beneficiary_name}</h5>
//                               {getStatusBadge(beneficiary.status)}
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
//                               <div className="flex items-center gap-2">
//                                 <Users className="h-3 w-3" />
//                                 <span>{beneficiary.beneficiary_username}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <CreditCard className="h-3 w-3" />
//                                 <span>Aadhaar: {beneficiary.beneficiary_aadhaar}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <Calendar className="h-3 w-3" />
//                                 <span>
//                                   Applied: {new Date(beneficiary.application_date).toLocaleDateString('en-IN')}
//                                 </span>
//                               </div>
//                               {beneficiary.status === 'approved' && beneficiary.amount_received && (
//                                 <div className="flex items-center gap-2">
//                                   <IndianRupee className="h-3 w-3" />
//                                   <span>Amount: ₹{parseFloat(beneficiary.amount_received).toLocaleString('en-IN')}</span>
//                                 </div>
//                               )}
//                             </div>
//                             {beneficiary.approved_by_name && (
//                               <p className="text-xs text-muted-foreground">
//                                 Approved by: {beneficiary.approved_by_name}
//                               </p>
//                             )}
//                             {beneficiary.remarks && (
//                               <p className="text-xs text-muted-foreground italic">
//                                 Remarks: {beneficiary.remarks}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-muted-foreground text-center py-8">
//                     No beneficiaries have applied for this scheme yet.
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Edit className="h-5 w-5 text-accent" />
//               Edit Scheme
//             </DialogTitle>
//           </DialogHeader>
//           {selectedScheme && (
//             <div className="space-y-4 py-4">
//               <div>
//                 <Label htmlFor="editSchemeName">Scheme Name *</Label>
//                 <Input
//                   id="editSchemeName"
//                   value={editFormData.name || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
//                   className="mt-2"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="editSchemeDesc">Description *</Label>
//                 <Textarea
//                   id="editSchemeDesc"
//                   value={editFormData.description || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
//                   className="mt-2"
//                   rows={3}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="editDepartment">Department</Label>
//                   <Input
//                     id="editDepartment"
//                     value={editFormData.department || ''}
//                     onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
//                     className="mt-2"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="editBudget">Total Budget</Label>
//                   <Input
//                     id="editBudget"
//                     value={editFormData.total_budget || ''}
//                     onChange={(e) => setEditFormData({ ...editFormData, total_budget: e.target.value })}
//                     className="mt-2"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="editStatus">Status</Label>
//                 <Select
//                   value={editFormData.status}
//                   onValueChange={(value: any) => setEditFormData({ ...editFormData, status: value })}
//                 >
//                   <SelectTrigger className="mt-2">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="active">Active</SelectItem>
//                     <SelectItem value="upcoming">Upcoming</SelectItem>
//                     <SelectItem value="closed">Closed</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="editEligibility">Eligibility Criteria *</Label>
//                 <Textarea
//                   id="editEligibility"
//                   value={editFormData.eligibility || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, eligibility: e.target.value })}
//                   className="mt-2"
//                   rows={2}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="editBenefits">Benefits *</Label>
//                 <Textarea
//                   id="editBenefits"
//                   value={editFormData.benefits || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, benefits: e.target.value })}
//                   className="mt-2"
//                   rows={2}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="editDeadline">Application Deadline</Label>
//                 <Input
//                   type="date"
//                   id="editDeadline"
//                   value={editFormData.application_deadline ? editFormData.application_deadline.split('T')[0] : ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, application_deadline: e.target.value })}
//                   className="mt-2"
//                 />
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleUpdateScheme} className="bg-accent hover:bg-accent/90">
//               <Edit className="h-4 w-4 mr-2" />
//               Update Scheme
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }















import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Search,
  Plus,
  Users,
  IndianRupee,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  Building2,
  Eye,
  Edit,
  X,
  Mail,
  Phone,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SchemeDocument {
  id: string;
  document_name: string;
  is_mandatory: boolean;
  order: number;
}

interface SchemeBeneficiary {
  id: string;
  beneficiary_username: string;
  beneficiary_name: string;
  beneficiary_aadhaar: string;
  application_date: string;
  approval_date?: string;
  status: 'pending' | 'approved' | 'rejected' | 'on_hold';
  amount_received: string;
  approved_by_name?: string;
  remarks?: string;
}

interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  department: string;
  application_deadline?: string;
  status: 'active' | 'upcoming' | 'closed';
  beneficiary_count: number;
  total_budget: string;
  scheme_type: string;
  required_documents: SchemeDocument[];
  beneficiaries: SchemeBeneficiary[];
  created_at: string;
  updated_at: string;
}

interface SchemesPageProps {
  type: 'gram_panchayat' | 'zilla_parishad';
}

const API_BASE_URL = 'http://localhost:8000/api'; // Update with your API base URL

export default function SchemesPage({ type }: SchemesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Scheme>>({});
  const [documentInput, setDocumentInput] = useState('');
  const [documents, setDocuments] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const {
    data: schemes = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Scheme[]>({
    queryKey: ['schemes'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/schemes/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch schemes');
      const data = await response.json();
      return data.results || data;
    },
    refetchInterval: 30000, // Auto-refetch every 30 seconds to keep data fresh
  });

  const createSchemeMutation = useMutation({
    mutationFn: async (newScheme: any) => {
      const response = await fetch(`${API_BASE_URL}/schemes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(newScheme),
      });
      if (!response.ok) throw new Error('Failed to create scheme');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
      toast.success('Scheme uploaded successfully!');
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to upload scheme');
    },
  });

  const updateSchemeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`${API_BASE_URL}/schemes/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update scheme');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
      toast.success('Scheme updated successfully!');
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to update scheme');
    },
  });

  // Helper function to get actual beneficiary count from the beneficiaries array
  const getActualBeneficiaryCount = (scheme: Scheme) => {
    return scheme.beneficiaries?.length || scheme.beneficiary_count || 0;
  };

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = scheme.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || scheme.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Fix total budget calculation
  const calculateTotalBudget = () => {
    let total = 0;
    schemes.forEach((scheme) => {
      // Add null/undefined check before calling match
      if (scheme.total_budget) {
        // Extract numeric value from budget string like "₹14,000 Crore"
        const match = scheme.total_budget.match(/[\d,]+/);
        if (match) {
          const value = parseFloat(match[0].replace(/,/g, ''));
          total += value;
        }
      }
    });
    return `₹${total.toLocaleString('en-IN')} Crore`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-success/10 text-success border-success/20',
      upcoming: 'bg-warning/10 text-warning border-warning/20',
      closed: 'bg-muted text-muted-foreground border-muted',
      pending: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      approved: 'bg-success/10 text-success border-success/20',
      rejected: 'bg-destructive/10 text-destructive border-destructive/20',
      on_hold: 'bg-warning/10 text-warning border-warning/20',
    };

    const icons = {
      active: <CheckCircle className="h-3 w-3 mr-1" />,
      upcoming: <Clock className="h-3 w-3 mr-1" />,
      closed: <Calendar className="h-3 w-3 mr-1" />,
      pending: <Clock className="h-3 w-3 mr-1" />,
      approved: <CheckCircle className="h-3 w-3 mr-1" />,
      rejected: <X className="h-3 w-3 mr-1" />,
      on_hold: <Clock className="h-3 w-3 mr-1" />,
    };

    return (
      <Badge variant="outline" className={cn('capitalize', styles[status as keyof typeof styles])}>
        {icons[status as keyof typeof icons]}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const handleViewScheme = async (scheme: Scheme) => {
    // Refetch the specific scheme to get updated beneficiaries count
    try {
      const response = await fetch(`${API_BASE_URL}/schemes/${scheme.id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        const updatedScheme = await response.json();
        setSelectedScheme(updatedScheme);
      } else {
        setSelectedScheme(scheme);
      }
    } catch (error) {
      console.error('Error fetching scheme details:', error);
      setSelectedScheme(scheme);
    }
    setIsViewDialogOpen(true);
  };

  const handleEditScheme = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setEditFormData({
      name: scheme.name,
      description: scheme.description,
      eligibility: scheme.eligibility,
      benefits: scheme.benefits,
      department: scheme.department,
      total_budget: scheme.total_budget,
      status: scheme.status,
      application_deadline: scheme.application_deadline,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateScheme = () => {
    if (selectedScheme) {
      updateSchemeMutation.mutate({
        id: selectedScheme.id,
        data: editFormData,
      });
    }
  };

  const handleUploadScheme = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newScheme = {
      name: formData.get('schemeName'),
      description: formData.get('schemeDesc'),
      eligibility: formData.get('eligibility'),
      benefits: formData.get('benefits'),
      department: formData.get('department'),
      total_budget: formData.get('budget'),
      status: 'active',
      application_deadline: formData.get('deadline') || null,
    };

    createSchemeMutation.mutate(newScheme);
  };

  const addDocument = () => {
    if (documentInput.trim()) {
      setDocuments([...documents, documentInput.trim()]);
      setDocumentInput('');
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleRefreshScheme = async () => {
    if (!selectedScheme) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/schemes/${selectedScheme.id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.ok) {
        const updatedScheme = await response.json();
        setSelectedScheme(updatedScheme);
        queryClient.invalidateQueries({ queryKey: ['schemes'] });
        toast.success('Data refreshed');
      }
    } catch (error) {
      toast.error('Failed to refresh data');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading schemes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load schemes</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Government Schemes</h2>
          <p className="text-muted-foreground">
            {type === 'zilla_parishad' ? 'Upload and manage schemes' : 'View available schemes'}
          </p>
        </div>
        {type === 'zilla_parishad' && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Upload New Scheme
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Upload New Scheme
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUploadScheme} className="space-y-4 py-4">
                <div>
                  <Label htmlFor="schemeName">Scheme Name *</Label>
                  <Input
                    id="schemeName"
                    name="schemeName"
                    placeholder="e.g., Pradhan Mantri Awas Yojana"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="schemeDesc">Description *</Label>
                  <Textarea
                    id="schemeDesc"
                    name="schemeDesc"
                    placeholder="Detailed description of the scheme..."
                    className="mt-2"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      placeholder="e.g., Ministry of Rural Development"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Total Budget</Label>
                    <Input
                      id="budget"
                      name="budget"
                      placeholder="e.g., ₹10,000 Crore"
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="eligibility">Eligibility Criteria *</Label>
                  <Textarea
                    id="eligibility"
                    name="eligibility"
                    placeholder="Who can apply for this scheme..."
                    className="mt-2"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="benefits">Benefits *</Label>
                  <Textarea
                    id="benefits"
                    name="benefits"
                    placeholder="What benefits does this scheme provide..."
                    className="mt-2"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <Label>Documents Required</Label>
                  <div className="mt-2 p-3 border border-dashed rounded-lg">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter document name and press Enter"
                        className="border-0 p-0 focus-visible:ring-0 flex-1"
                        value={documentInput}
                        onChange={(e) => setDocumentInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addDocument();
                          }
                        }}
                      />
                      <Button type="button" size="sm" onClick={addDocument}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {documents.map((doc, index) => (
                        <Badge key={index} variant="secondary" className="pr-1">
                          {doc}
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input type="date" id="deadline" name="deadline" className="mt-2" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-accent hover:bg-accent/90">
                    <Users className="h-4 w-4 mr-2" />
                    Upload Scheme
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card bg-success/5 border-success/20">
          <p className="text-sm text-muted-foreground">Active Schemes</p>
          <p className="text-2xl font-bold mt-1 text-success">
            {schemes.filter((s) => s.status === 'active').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
          <p className="text-2xl font-bold mt-1">
            {schemes.reduce((sum, s) => sum + getActualBeneficiaryCount(s), 0).toLocaleString()}
          </p>
        </div>
        <div className="stat-card bg-accent/5 border-accent/20">
          <p className="text-sm text-muted-foreground">Total Budget</p>
          <p className="text-2xl font-bold mt-1 text-accent">
            {calculateTotalBudget()}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Departments</p>
          <p className="text-2xl font-bold mt-1">
            {new Set(schemes.map((s) => s.department).filter(Boolean)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-section">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Schemes List */}
      <Accordion type="single" collapsible className="space-y-4">
        {filteredSchemes.map((scheme) => (
          <AccordionItem
            key={scheme.id}
            value={scheme.id}
            className="dashboard-section border rounded-xl overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-4 w-full text-left">
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-semibold">{scheme.name}</h3>
                    {getStatusBadge(scheme.status)}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{scheme.description}</p>
                </div>
                <div className="hidden md:flex items-center gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {getActualBeneficiaryCount(scheme).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Beneficiaries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-accent">{scheme.total_budget || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Budget</p>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Eligibility
                    </h4>
                    <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <IndianRupee className="h-4 w-4 text-accent" />
                      Benefits
                    </h4>
                    <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Department
                    </h4>
                    <p className="text-sm text-muted-foreground">{scheme.department}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Documents Required
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {scheme.required_documents && scheme.required_documents.length > 0 ? (
                        scheme.required_documents.map((doc) => (
                          <Badge key={doc.id} variant="secondary" className="text-xs">
                            {doc.document_name}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground">No documents specified</p>
                      )}
                    </div>
                  </div>
                  {scheme.application_deadline && (
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-warning" />
                        Application Deadline
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(scheme.application_deadline).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewScheme(scheme)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {type === 'zilla_parishad' && (
                      <Button variant="outline" size="sm" onClick={() => handleEditScheme(scheme)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground dashboard-section">
          No schemes found matching your criteria
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {selectedScheme?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedScheme && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Status</h4>
                    {getStatusBadge(selectedScheme.status)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Department</h4>
                    <p className="text-sm">{selectedScheme.department}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Total Budget</h4>
                    <p className="text-sm font-semibold text-accent">{selectedScheme.total_budget || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Beneficiary Count</h4>
                    <p className="text-sm">{getActualBeneficiaryCount(selectedScheme).toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Scheme Type</h4>
                    <Badge variant="outline" className="capitalize">{selectedScheme.scheme_type || 'N/A'}</Badge>
                  </div>
                  {selectedScheme.application_deadline && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Application Deadline</h4>
                      <p className="text-sm">
                        {new Date(selectedScheme.application_deadline).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Created At</h4>
                    <p className="text-sm">
                      {new Date(selectedScheme.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedScheme.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Eligibility Criteria</h4>
                  <p className="text-sm text-muted-foreground">{selectedScheme.eligibility}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <p className="text-sm text-muted-foreground">{selectedScheme.benefits}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Required Documents</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedScheme.required_documents && selectedScheme.required_documents.length > 0 ? (
                      selectedScheme.required_documents.map((doc) => (
                        <Badge key={doc.id} variant="secondary">
                          {doc.document_name}
                          {doc.is_mandatory && <span className="ml-1 text-destructive">*</span>}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No documents specified</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Beneficiaries List */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Applied Beneficiaries ({selectedScheme.beneficiaries?.length || 0})
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshScheme}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>
                {selectedScheme.beneficiaries && selectedScheme.beneficiaries.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {selectedScheme.beneficiaries.map((beneficiary) => (
                      <div
                        key={beneficiary.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h5 className="font-medium">{beneficiary.beneficiary_name}</h5>
                              {getStatusBadge(beneficiary.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>{beneficiary.beneficiary_username}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-3 w-3" />
                                <span>Aadhaar: {beneficiary.beneficiary_aadhaar}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Applied: {new Date(beneficiary.application_date).toLocaleDateString('en-IN')}
                                </span>
                              </div>
                              {beneficiary.status === 'approved' && beneficiary.amount_received && (
                                <div className="flex items-center gap-2">
                                  <IndianRupee className="h-3 w-3" />
                                  <span>Amount: ₹{parseFloat(beneficiary.amount_received).toLocaleString('en-IN')}</span>
                                </div>
                              )}
                            </div>
                            {beneficiary.approved_by_name && (
                              <p className="text-xs text-muted-foreground">
                                Approved by: {beneficiary.approved_by_name}
                              </p>
                            )}
                            {beneficiary.remarks && (
                              <p className="text-xs text-muted-foreground italic">
                                Remarks: {beneficiary.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No beneficiaries have applied for this scheme yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-accent" />
              Edit Scheme
            </DialogTitle>
          </DialogHeader>
          {selectedScheme && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="editSchemeName">Scheme Name *</Label>
                <Input
                  id="editSchemeName"
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="editSchemeDesc">Description *</Label>
                <Textarea
                  id="editSchemeDesc"
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="mt-2"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editDepartment">Department</Label>
                  <Input
                    id="editDepartment"
                    value={editFormData.department || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="editBudget">Total Budget</Label>
                  <Input
                    id="editBudget"
                    value={editFormData.total_budget || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, total_budget: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editStatus">Status</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value: any) => setEditFormData({ ...editFormData, status: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editEligibility">Eligibility Criteria *</Label>
                <Textarea
                  id="editEligibility"
                  value={editFormData.eligibility || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, eligibility: e.target.value })}
                  className="mt-2"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="editBenefits">Benefits *</Label>
                <Textarea
                  id="editBenefits"
                  value={editFormData.benefits || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, benefits: e.target.value })}
                  className="mt-2"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="editDeadline">Application Deadline</Label>
                <Input
                  type="date"
                  id="editDeadline"
                  value={editFormData.application_deadline ? editFormData.application_deadline.split('T')[0] : ''}
                  onChange={(e) => setEditFormData({ ...editFormData, application_deadline: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateScheme} className="bg-accent hover:bg-accent/90">
              <Edit className="h-4 w-4 mr-2" />
              Update Scheme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}