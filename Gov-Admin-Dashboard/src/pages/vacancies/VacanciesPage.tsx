// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { JobVacancy } from '@/data/dummyData';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Progress } from '@/components/ui/progress';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Search,
//   Plus,
//   Briefcase,
//   MapPin,
//   Calendar,
//   Users,
//   IndianRupee,
//   GraduationCap,
//   Eye,
//   Edit,
//   Clock,
//   CheckCircle,
//   XCircle,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { fetchJobVacancies } from '@/lib/api';

// interface VacanciesPageProps {
//   type: 'gram_panchayat' | 'zilla_parishad';
// }

// export function VacanciesPage({ type }: VacanciesPageProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(null);
//   const [newVacancy, setNewVacancy] = useState({
//     title: '',
//     department: '',
//     location: '',
//     salary: '',
//     eligibility: '',
//     description: '',
//     totalPositions: 1,
//   });

//   const {
//     data: jobVacancies = [],
//     isLoading,
//     isError,
//   } = useQuery<JobVacancy[]>({
//     queryKey: ['job-vacancies'],
//     queryFn: fetchJobVacancies,
//   });

//   const filteredVacancies = jobVacancies.filter((vacancy) => {
//     const matchesSearch =
//       vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       vacancy.department.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || vacancy.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleCreateVacancy = () => {
//     if (!newVacancy.title || !newVacancy.department) {
//       toast.error('Please fill all required fields');
//       return;
//     }
//     toast.success('Vacancy posted successfully!');
//     setIsCreateDialogOpen(false);
//     setNewVacancy({
//       title: '',
//       department: '',
//       location: '',
//       salary: '',
//       eligibility: '',
//       description: '',
//       totalPositions: 1,
//     });
//   };

//   const getStatusBadge = (status: string) => {
//     const styles = {
//       open: 'bg-success/10 text-success border-success/20',
//       closed: 'bg-muted text-muted-foreground border-muted',
//       filled: 'bg-primary/10 text-primary border-primary/20',
//     };

//     const icons = {
//       open: <CheckCircle className="h-3 w-3 mr-1" />,
//       closed: <XCircle className="h-3 w-3 mr-1" />,
//       filled: <Users className="h-3 w-3 mr-1" />,
//     };

//     return (
//       <Badge variant="outline" className={cn('capitalize', styles[status as keyof typeof styles])}>
//         {icons[status as keyof typeof icons]}
//         {status}
//       </Badge>
//     );
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Women Empowerment Vacancies</h2>
//           <p className="text-muted-foreground">
//             Job opportunities for women in government bodies
//           </p>
//         </div>
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="bg-accent hover:bg-accent/90">
//               <Plus className="h-4 w-4 mr-2" />
//               Post New Vacancy
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-lg">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Briefcase className="h-5 w-5 text-accent" />
//                 Post New Vacancy
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
//               <div>
//                 <Label htmlFor="title">Job Title *</Label>
//                 <Input
//                   id="title"
//                   placeholder="e.g., Anganwadi Worker"
//                   className="mt-2"
//                   value={newVacancy.title}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="department">Department *</Label>
//                 <Input
//                   id="department"
//                   placeholder="e.g., Women & Child Development"
//                   className="mt-2"
//                   value={newVacancy.department}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, department: e.target.value })}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="location">Location</Label>
//                   <Input
//                     id="location"
//                     placeholder="e.g., Mulshi Taluka"
//                     className="mt-2"
//                     value={newVacancy.location}
//                     onChange={(e) => setNewVacancy({ ...newVacancy, location: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="positions">Positions</Label>
//                   <Input
//                     id="positions"
//                     type="number"
//                     min="1"
//                     className="mt-2"
//                     value={newVacancy.totalPositions}
//                     onChange={(e) =>
//                       setNewVacancy({ ...newVacancy, totalPositions: parseInt(e.target.value) || 1 })
//                     }
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="salary">Salary Range</Label>
//                 <Input
//                   id="salary"
//                   placeholder="e.g., ₹8,000 - ₹12,000/month"
//                   className="mt-2"
//                   value={newVacancy.salary}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, salary: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="eligibility">Eligibility Criteria</Label>
//                 <Input
//                   id="eligibility"
//                   placeholder="e.g., 10th Pass, Female candidates only"
//                   className="mt-2"
//                   value={newVacancy.eligibility}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, eligibility: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="description">Job Description</Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Detailed job description..."
//                   className="mt-2"
//                   rows={3}
//                   value={newVacancy.description}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleCreateVacancy} className="bg-accent hover:bg-accent/90">
//                 <Briefcase className="h-4 w-4 mr-2" />
//                 Post Vacancy
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="stat-card bg-success/5 border-success/20">
//           <p className="text-sm text-muted-foreground">Open Vacancies</p>
//           <p className="text-2xl font-bold mt-1 text-success">
//             {jobVacancies.filter((v) => v.status === 'open').length}
//           </p>
//         </div>
//         <div className="stat-card">
//           <p className="text-sm text-muted-foreground">Total Positions</p>
//           <p className="text-2xl font-bold mt-1">
//             {jobVacancies.reduce((sum, v) => sum + v.totalPositions, 0)}
//           </p>
//         </div>
//         <div className="stat-card bg-accent/5 border-accent/20">
//           <p className="text-sm text-muted-foreground">Total Applications</p>
//           <p className="text-2xl font-bold mt-1 text-accent">
//             {jobVacancies.reduce((sum, v) => sum + v.appliedCount, 0)}
//           </p>
//         </div>
//         <div className="stat-card bg-primary/5 border-primary/20">
//           <p className="text-sm text-muted-foreground">Positions Filled</p>
//           <p className="text-2xl font-bold mt-1 text-primary">
//             {jobVacancies.filter((v) => v.status === 'filled').reduce((sum, v) => sum + v.totalPositions, 0)}
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
//                 placeholder="Search by title or department..."
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
//               <SelectItem value="open">Open</SelectItem>
//               <SelectItem value="closed">Closed</SelectItem>
//               <SelectItem value="filled">Filled</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Vacancies List */}
//       <div className="space-y-4">
//         {isLoading && (
//           <p className="text-sm text-muted-foreground">Loading vacancies...</p>
//         )}
//         {isError && (
//           <p className="text-sm text-destructive">Failed to load vacancies from the server.</p>
//         )}
//         {filteredVacancies.map((vacancy) => (
//           <div key={vacancy.id} className="dashboard-section hover:shadow-md transition-shadow">
//             <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//               <div className="flex-1">
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 rounded-xl bg-accent/10 shrink-0">
//                     <Briefcase className="h-6 w-6 text-accent" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h3 className="font-semibold text-lg">{vacancy.title}</h3>
//                       {getStatusBadge(vacancy.status)}
//                     </div>
//                     <p className="text-sm text-muted-foreground mb-3">{vacancy.description}</p>
//                     <div className="flex flex-wrap gap-4 text-sm">
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <Briefcase className="h-4 w-4" />
//                         {vacancy.department}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <MapPin className="h-4 w-4" />
//                         {vacancy.location}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <IndianRupee className="h-4 w-4" />
//                         {vacancy.salary}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <GraduationCap className="h-4 w-4" />
//                         {vacancy.eligibility}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="lg:w-64 shrink-0">
//                 <div className="p-4 bg-muted/50 rounded-lg">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium">Applications</span>
//                     <span className="text-sm text-muted-foreground">
//                       {vacancy.appliedCount} / {vacancy.totalPositions}
//                     </span>
//                   </div>
//                   <Progress
//                     value={Math.min((vacancy.appliedCount / vacancy.totalPositions) * 100, 100)}
//                     className="h-2"
//                     indicatorClassName={
//                       vacancy.appliedCount >= vacancy.totalPositions
//                         ? 'bg-success'
//                         : 'bg-accent'
//                     }
//                   />
//                   <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                       <Users className="h-3 w-3" />
//                       {vacancy.appliedCount} applied
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-3 w-3" />
//                       {Math.max(0, vacancy.totalPositions - vacancy.appliedCount)} remaining
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
//                     <Calendar className="h-3 w-3" />
//                     Deadline: {vacancy.deadline.toLocaleDateString('en-IN')}
//                   </div>
//                 </div>

//                 <div className="flex gap-2 mt-3">
//                   <Button variant="outline" size="sm" className="flex-1">
//                     <Eye className="h-3 w-3 mr-1" />
//                     View
//                   </Button>
//                   <Button variant="outline" size="sm" className="flex-1">
//                     <Edit className="h-3 w-3 mr-1" />
//                     Edit
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredVacancies.length === 0 && (
//         <div className="text-center py-12 text-muted-foreground dashboard-section">
//           No vacancies found matching your criteria
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
// import { Progress } from '@/components/ui/progress';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Search,
//   Plus,
//   Briefcase,
//   MapPin,
//   Calendar,
//   Users,
//   IndianRupee,
//   GraduationCap,
//   Eye,
//   Edit,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Loader2,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';

// interface JobVacancy {
//   id: string;
//   title: string;
//   department: string;
//   location_text: string;
//   salary_range: string;
//   eligibility: string;
//   description: string;
//   deadline: string;
//   total_positions: number;
//   filled_positions: number;
//   status: 'open' | 'closed' | 'filled';
//   applied_count: number;
//   posted_at: string;
//   requirements?: Record<string, any>;
// }

// interface VacanciesPageProps {
//   type: 'gram_panchayat' | 'zilla_parishad';
// }

// export default function VacanciesPage({ type }: VacanciesPageProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(null);
//   const [newVacancy, setNewVacancy] = useState({
//     title: '',
//     department: '',
//     location_text: '',
//     salary_range: '',
//     eligibility: '',
//     description: '',
//     total_positions: 1,
//     deadline: '',
//   });

//   const queryClient = useQueryClient();

//   // Fetch job vacancies
//   const {
//     data: jobVacancies = [],
//     isLoading,
//     isError,
//   } = useQuery<JobVacancy[]>({
//     queryKey: ['job-vacancies'],
//     queryFn: async () => {
//       const response = await fetch('http://localhost:8000/api/job-vacancies/', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch vacancies');
//       const data = await response.json();
//       return data.results || data;
//     },
//   });

//   // Create vacancy mutation
//   const createVacancyMutation = useMutation({
//     mutationFn: async (vacancyData: typeof newVacancy) => {
//       const response = await fetch('http://localhost:8000/api/job-vacancies/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify({
//           ...vacancyData,
//           status: 'open',
//           filled_positions: 0,
//         }),
//       });
//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.detail || 'Failed to create vacancy');
//       }
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['job-vacancies'] });
//       toast.success('Vacancy posted successfully!');
//       setIsCreateDialogOpen(false);
//       setNewVacancy({
//         title: '',
//         department: '',
//         location_text: '',
//         salary_range: '',
//         eligibility: '',
//         description: '',
//         total_positions: 1,
//         deadline: '',
//       });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to post vacancy');
//     },
//   });

//   // Update vacancy mutation
//   const updateVacancyMutation = useMutation({
//     mutationFn: async (vacancyData: Partial<JobVacancy> & { id: string }) => {
//       const response = await fetch(`/api/job-vacancies/${vacancyData.id}/`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify(vacancyData),
//       });
//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.detail || 'Failed to update vacancy');
//       }
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['job-vacancies'] });
//       toast.success('Vacancy updated successfully!');
//       setIsEditDialogOpen(false);
//       setSelectedVacancy(null);
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update vacancy');
//     },
//   });

//   const filteredVacancies = jobVacancies.filter((vacancy) => {
//     const matchesSearch =
//       vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       vacancy.department.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || vacancy.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleCreateVacancy = () => {
//     if (!newVacancy.title || !newVacancy.department || !newVacancy.deadline) {
//       toast.error('Please fill all required fields (Title, Department, Deadline)');
//       return;
//     }
//     createVacancyMutation.mutate(newVacancy);
//   };

//   const handleUpdateVacancy = () => {
//     if (!selectedVacancy) return;
//     updateVacancyMutation.mutate(selectedVacancy);
//   };

//   const handleViewVacancy = (vacancy: JobVacancy) => {
//     setSelectedVacancy(vacancy);
//     setIsViewDialogOpen(true);
//   };

//   const handleEditVacancy = (vacancy: JobVacancy) => {
//     setSelectedVacancy(vacancy);
//     setIsEditDialogOpen(true);
//   };

//   const getStatusBadge = (status: string) => {
//     const styles = {
//       open: 'bg-success/10 text-success border-success/20',
//       closed: 'bg-muted text-muted-foreground border-muted',
//       filled: 'bg-primary/10 text-primary border-primary/20',
//     };

//     const icons = {
//       open: <CheckCircle className="h-3 w-3 mr-1" />,
//       closed: <XCircle className="h-3 w-3 mr-1" />,
//       filled: <Users className="h-3 w-3 mr-1" />,
//     };

//     return (
//       <Badge variant="outline" className={cn('capitalize', styles[status as keyof typeof styles])}>
//         {icons[status as keyof typeof icons]}
//         {status}
//       </Badge>
//     );
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Women Empowerment Vacancies</h2>
//           <p className="text-muted-foreground">
//             Job opportunities for women in government bodies
//           </p>
//         </div>
        
//         {/* Create Dialog */}
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="bg-accent hover:bg-accent/90">
//               <Plus className="h-4 w-4 mr-2" />
//               Post New Vacancy
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Briefcase className="h-5 w-5 text-accent" />
//                 Post New Vacancy
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <div>
//                 <Label htmlFor="title">Job Title *</Label>
//                 <Input
//                   id="title"
//                   placeholder="e.g., Anganwadi Worker"
//                   className="mt-2"
//                   value={newVacancy.title}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="department">Department *</Label>
//                 <Input
//                   id="department"
//                   placeholder="e.g., Women & Child Development"
//                   className="mt-2"
//                   value={newVacancy.department}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, department: e.target.value })}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="location">Location</Label>
//                   <Input
//                     id="location"
//                     placeholder="e.g., Mulshi Taluka"
//                     className="mt-2"
//                     value={newVacancy.location_text}
//                     onChange={(e) => setNewVacancy({ ...newVacancy, location_text: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="positions">Positions</Label>
//                   <Input
//                     id="positions"
//                     type="number"
//                     min="1"
//                     className="mt-2"
//                     value={newVacancy.total_positions}
//                     onChange={(e) =>
//                       setNewVacancy({ ...newVacancy, total_positions: parseInt(e.target.value) || 1 })
//                     }
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="salary">Salary Range</Label>
//                 <Input
//                   id="salary"
//                   placeholder="e.g., ₹8,000 - ₹12,000/month"
//                   className="mt-2"
//                   value={newVacancy.salary_range}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, salary_range: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="eligibility">Eligibility Criteria</Label>
//                 <Input
//                   id="eligibility"
//                   placeholder="e.g., 10th Pass, Female candidates only"
//                   className="mt-2"
//                   value={newVacancy.eligibility}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, eligibility: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="deadline">Application Deadline *</Label>
//                 <Input
//                   id="deadline"
//                   type="datetime-local"
//                   className="mt-2"
//                   value={newVacancy.deadline}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, deadline: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="description">Job Description</Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Detailed job description..."
//                   className="mt-2"
//                   rows={3}
//                   value={newVacancy.description}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleCreateVacancy} 
//                 className="bg-accent hover:bg-accent/90"
//                 disabled={createVacancyMutation.isPending}
//               >
//                 {createVacancyMutation.isPending ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Posting...
//                   </>
//                 ) : (
//                   <>
//                     <Briefcase className="h-4 w-4 mr-2" />
//                     Post Vacancy
//                   </>
//                 )}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="p-4 rounded-lg border bg-success/5 border-success/20">
//           <p className="text-sm text-muted-foreground">Open Vacancies</p>
//           <p className="text-2xl font-bold mt-1 text-success">
//             {jobVacancies.filter((v) => v.status === 'open').length}
//           </p>
//         </div>
//         <div className="p-4 rounded-lg border">
//           <p className="text-sm text-muted-foreground">Total Positions</p>
//           <p className="text-2xl font-bold mt-1">
//             {jobVacancies.reduce((sum, v) => sum + v.total_positions, 0)}
//           </p>
//         </div>
//         <div className="p-4 rounded-lg border bg-accent/5 border-accent/20">
//           <p className="text-sm text-muted-foreground">Total Applications</p>
//           <p className="text-2xl font-bold mt-1 text-accent">
//             {jobVacancies.reduce((sum, v) => sum + v.applied_count, 0)}
//           </p>
//         </div>
//         <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
//           <p className="text-sm text-muted-foreground">Positions Filled</p>
//           <p className="text-2xl font-bold mt-1 text-primary">
//             {jobVacancies.filter((v) => v.status === 'filled').reduce((sum, v) => sum + v.total_positions, 0)}
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="p-4 rounded-lg border bg-card">
//         <div className="flex flex-wrap gap-4">
//           <div className="flex-1 min-w-[200px]">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by title or department..."
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
//               <SelectItem value="open">Open</SelectItem>
//               <SelectItem value="closed">Closed</SelectItem>
//               <SelectItem value="filled">Filled</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Vacancies List */}
//       <div className="space-y-4">
//         {isLoading && (
//           <div className="text-center py-8">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
//             <p className="text-sm text-muted-foreground mt-2">Loading vacancies...</p>
//           </div>
//         )}
//         {isError && (
//           <p className="text-sm text-destructive text-center py-8">
//             Failed to load vacancies from the server.
//           </p>
//         )}
//         {filteredVacancies.map((vacancy) => (
//           <div key={vacancy.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
//             <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//               <div className="flex-1">
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 rounded-xl bg-accent/10 shrink-0">
//                     <Briefcase className="h-6 w-6 text-accent" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h3 className="font-semibold text-lg">{vacancy.title}</h3>
//                       {getStatusBadge(vacancy.status)}
//                     </div>
//                     <p className="text-sm text-muted-foreground mb-3">{vacancy.description}</p>
//                     <div className="flex flex-wrap gap-4 text-sm">
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <Briefcase className="h-4 w-4" />
//                         {vacancy.department}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <MapPin className="h-4 w-4" />
//                         {vacancy.location_text}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <IndianRupee className="h-4 w-4" />
//                         {vacancy.salary_range}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <GraduationCap className="h-4 w-4" />
//                         {vacancy.eligibility}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="lg:w-64 shrink-0">
//                 <div className="p-4 bg-muted/50 rounded-lg">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium">Applications</span>
//                     <span className="text-sm text-muted-foreground">
//                       {vacancy.applied_count} / {vacancy.total_positions}
//                     </span>
//                   </div>
//                   <Progress
//                     value={Math.min((vacancy.applied_count / vacancy.total_positions) * 100, 100)}
//                     className="h-2"
//                   />
//                   <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                       <Users className="h-3 w-3" />
//                       {vacancy.applied_count} applied
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-3 w-3" />
//                       {Math.max(0, vacancy.total_positions - vacancy.applied_count)} remaining
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
//                     <Calendar className="h-3 w-3" />
//                     Deadline: {new Date(vacancy.deadline).toLocaleDateString('en-IN')}
//                   </div>
//                 </div>

//                 <div className="flex gap-2 mt-3">
//                   <Button 
//                     variant="outline" 
//                     size="sm" 
//                     className="flex-1"
//                     onClick={() => handleViewVacancy(vacancy)}
//                   >
//                     <Eye className="h-3 w-3 mr-1" />
//                     View
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     size="sm" 
//                     className="flex-1"
//                     onClick={() => handleEditVacancy(vacancy)}
//                   >
//                     <Edit className="h-3 w-3 mr-1" />
//                     Edit
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredVacancies.length === 0 && !isLoading && (
//         <div className="text-center py-12 text-muted-foreground p-4 rounded-lg border bg-card">
//           No vacancies found matching your criteria
//         </div>
//       )}

//       {/* View Dialog */}
//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Briefcase className="h-5 w-5 text-accent" />
//               Vacancy Details
//             </DialogTitle>
//           </DialogHeader>
//           {selectedVacancy && (
//             <div className="space-y-6 py-4">
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="text-xl font-semibold">{selectedVacancy.title}</h3>
//                   {getStatusBadge(selectedVacancy.status)}
//                 </div>
//                 <p className="text-muted-foreground">{selectedVacancy.department}</p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <MapPin className="h-4 w-4" />
//                     <span className="font-medium">Location</span>
//                   </div>
//                   <p className="pl-6">{selectedVacancy.location_text}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <IndianRupee className="h-4 w-4" />
//                     <span className="font-medium">Salary Range</span>
//                   </div>
//                   <p className="pl-6">{selectedVacancy.salary_range}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Users className="h-4 w-4" />
//                     <span className="font-medium">Total Positions</span>
//                   </div>
//                   <p className="pl-6">{selectedVacancy.total_positions}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Calendar className="h-4 w-4" />
//                     <span className="font-medium">Deadline</span>
//                   </div>
//                   <p className="pl-6">{new Date(selectedVacancy.deadline).toLocaleDateString('en-IN')}</p>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-sm font-medium">
//                   <GraduationCap className="h-4 w-4" />
//                   Eligibility Criteria
//                 </div>
//                 <p className="text-sm text-muted-foreground pl-6">{selectedVacancy.eligibility}</p>
//               </div>

//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium">Job Description</h4>
//                 <p className="text-sm text-muted-foreground">{selectedVacancy.description}</p>
//               </div>

//               <div className="p-4 bg-muted/50 rounded-lg">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium">Application Progress</span>
//                   <span className="text-sm text-muted-foreground">
//                     {selectedVacancy.applied_count} / {selectedVacancy.total_positions}
//                   </span>
//                 </div>
//                 <Progress
//                   value={Math.min((selectedVacancy.applied_count / selectedVacancy.total_positions) * 100, 100)}
//                   className="h-2"
//                 />
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Edit className="h-5 w-5 text-accent" />
//               Edit Vacancy
//             </DialogTitle>
//           </DialogHeader>
//           {selectedVacancy && (
//             <div className="space-y-4 py-4">
//               <div>
//                 <Label htmlFor="edit-title">Job Title *</Label>
//                 <Input
//                   id="edit-title"
//                   className="mt-2"
//                   value={selectedVacancy.title}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, title: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-department">Department *</Label>
//                 <Input
//                   id="edit-department"
//                   className="mt-2"
//                   value={selectedVacancy.department}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, department: e.target.value })}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="edit-location">Location</Label>
//                   <Input
//                     id="edit-location"
//                     className="mt-2"
//                     value={selectedVacancy.location_text}
//                     onChange={(e) => setSelectedVacancy({ ...selectedVacancy, location_text: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="edit-positions">Positions</Label>
//                   <Input
//                     id="edit-positions"
//                     type="number"
//                     min="1"
//                     className="mt-2"
//                     value={selectedVacancy.total_positions}
//                     onChange={(e) =>
//                       setSelectedVacancy({ ...selectedVacancy, total_positions: parseInt(e.target.value) || 1 })
//                     }
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="edit-salary">Salary Range</Label>
//                 <Input
//                   id="edit-salary"
//                   className="mt-2"
//                   value={selectedVacancy.salary_range}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, salary_range: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-eligibility">Eligibility Criteria</Label>
//                 <Input
//                   id="edit-eligibility"
//                   className="mt-2"
//                   value={selectedVacancy.eligibility}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, eligibility: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-status">Status</Label>
//                 <Select
//                   value={selectedVacancy.status}
//                   onValueChange={(value: 'open' | 'closed' | 'filled') =>
//                     setSelectedVacancy({ ...selectedVacancy, status: value })
//                   }
//                 >
//                   <SelectTrigger className="mt-2">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="open">Open</SelectItem>
//                     <SelectItem value="closed">Closed</SelectItem>
//                     <SelectItem value="filled">Filled</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="edit-deadline">Application Deadline</Label>
//                 <Input
//                   id="edit-deadline"
//                   type="datetime-local"
//                   className="mt-2"
//                   value={selectedVacancy.deadline ? new Date(selectedVacancy.deadline).toISOString().slice(0, 16) : ''}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, deadline: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-description">Job Description</Label>
//                 <Textarea
//                   id="edit-description"
//                   className="mt-2"
//                   rows={3}
//                   value={selectedVacancy.description}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, description: e.target.value })}
//                 />
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleUpdateVacancy}
//               className="bg-accent hover:bg-accent/90"
//               disabled={updateVacancyMutation.isPending}
//             >
//               {updateVacancyMutation.isPending ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <Edit className="h-4 w-4 mr-2" />
//                   Update Vacancy
//                 </>
//               )}
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
// import { Progress } from '@/components/ui/progress';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Search,
//   Plus,
//   Briefcase,
//   MapPin,
//   Calendar,
//   Users,
//   IndianRupee,
//   GraduationCap,
//   Eye,
//   Edit,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Loader2,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';

// interface Location {
//   id: string;
//   name: string;
//   type: string;
// }

// interface JobVacancy {
//   id: string;
//   title: string;
//   department: string;
//   location: string;
//   location_text: string;
//   salary_range: string;
//   eligibility: string;
//   description: string;
//   deadline: string;
//   total_positions: number;
//   filled_positions: number;
//   status: 'open' | 'closed' | 'filled';
//   applied_count: number;
//   posted_at: string;
//   requirements?: Record<string, any>;
// }

// interface VacanciesPageProps {
//   type: 'gram_panchayat' | 'zilla_parishad';
// }

// export default function VacanciesPage({ type }: VacanciesPageProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(null);
//   const [newVacancy, setNewVacancy] = useState({
//     title: '',
//     department: '',
//     location: '',
//     location_text: '',
//     salary_range: '',
//     eligibility: '',
//     description: '',
//     total_positions: 1,
//     deadline: '',
//   });

//   const queryClient = useQueryClient();

//   // Fetch locations
//   const { data: locations = [] } = useQuery<Location[]>({
//     queryKey: ['locations'],
//     queryFn: async () => {
//       const response = await fetch('http://localhost:8000/api/locations/', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch locations');
//       const data = await response.json();
//       return data.results || data;
//     },
//   });

//   // Fetch job vacancies
//   const {
//     data: jobVacancies = [],
//     isLoading,
//     isError,
//   } = useQuery<JobVacancy[]>({
//     queryKey: ['job-vacancies'],
//     queryFn: async () => {
//       const response = await fetch('http://localhost:8000/api/job-vacancies/', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch vacancies');
//       const data = await response.json();
//       return data.results || data;
//     },
//   });

//   // Create vacancy mutation
//   const createVacancyMutation = useMutation({
//     mutationFn: async (vacancyData: typeof newVacancy) => {
//       // Convert datetime-local to ISO format
//       const deadlineISO = new Date(vacancyData.deadline).toISOString();
      
//       const response = await fetch('http://localhost:8000/api/job-vacancies/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify({
//           title: vacancyData.title,
//           department: vacancyData.department,
//           location: vacancyData.location, // UUID of location
//           location_text: vacancyData.location_text,
//           salary_range: vacancyData.salary_range,
//           eligibility: vacancyData.eligibility,
//           description: vacancyData.description,
//           total_positions: vacancyData.total_positions,
//           deadline: deadlineISO,
//           status: 'open',
//           filled_positions: 0,
//         }),
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         let errorMessage = 'Failed to create vacancy';
//         try {
//           const error = JSON.parse(errorText);
//           errorMessage = error.detail || JSON.stringify(error);
//         } catch {
//           errorMessage = errorText || errorMessage;
//         }
//         throw new Error(errorMessage);
//       }
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['job-vacancies'] });
//       toast.success('Vacancy posted successfully!');
//       setIsCreateDialogOpen(false);
//       setNewVacancy({
//         title: '',
//         department: '',
//         location: '',
//         location_text: '',
//         salary_range: '',
//         eligibility: '',
//         description: '',
//         total_positions: 1,
//         deadline: '',
//       });
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to post vacancy');
//     },
//   });

//   // Update vacancy mutation
//   const updateVacancyMutation = useMutation({
//     mutationFn: async (vacancyData: Partial<JobVacancy> & { id: string }) => {
//       // Convert deadline to ISO format if it's being updated
//       const updateData: any = { ...vacancyData };
//       if (updateData.deadline) {
//         updateData.deadline = new Date(updateData.deadline).toISOString();
//       }
//       delete updateData.id;
      
//       const response = await fetch(`http://localhost:8000/api/job-vacancies/${vacancyData.id}/`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//         body: JSON.stringify(updateData),
//       });
      
//       if (!response.ok) {
//         const errorText = await response.text();
//         let errorMessage = 'Failed to update vacancy';
//         try {
//           const error = JSON.parse(errorText);
//           errorMessage = error.detail || JSON.stringify(error);
//         } catch {
//           errorMessage = errorText || errorMessage;
//         }
//         throw new Error(errorMessage);
//       }
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['job-vacancies'] });
//       toast.success('Vacancy updated successfully!');
//       setIsEditDialogOpen(false);
//       setSelectedVacancy(null);
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || 'Failed to update vacancy');
//     },
//   });

//   const filteredVacancies = jobVacancies.filter((vacancy) => {
//     const matchesSearch =
//       vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       vacancy.department.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || vacancy.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleCreateVacancy = () => {
//     if (!newVacancy.title || !newVacancy.department || !newVacancy.deadline) {
//       toast.error('Please fill all required fields (Title, Department, Location, Deadline)');
//       return;
//     }
//     if (!newVacancy.location) {
//       toast.error('Please select a location');
//       return;
//     }
//     createVacancyMutation.mutate(newVacancy);
//   };

//   const handleUpdateVacancy = () => {
//     if (!selectedVacancy) return;
//     updateVacancyMutation.mutate(selectedVacancy);
//   };

//   const handleViewVacancy = (vacancy: JobVacancy) => {
//     setSelectedVacancy(vacancy);
//     setIsViewDialogOpen(true);
//   };

//   const handleEditVacancy = (vacancy: JobVacancy) => {
//     setSelectedVacancy(vacancy);
//     setIsEditDialogOpen(true);
//   };

//   const getStatusBadge = (status: string) => {
//     const styles = {
//       open: 'bg-success/10 text-success border-success/20',
//       closed: 'bg-muted text-muted-foreground border-muted',
//       filled: 'bg-primary/10 text-primary border-primary/20',
//     };

//     const icons = {
//       open: <CheckCircle className="h-3 w-3 mr-1" />,
//       closed: <XCircle className="h-3 w-3 mr-1" />,
//       filled: <Users className="h-3 w-3 mr-1" />,
//     };

//     return (
//       <Badge variant="outline" className={cn('capitalize', styles[status as keyof typeof styles])}>
//         {icons[status as keyof typeof icons]}
//         {status}
//       </Badge>
//     );
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Women Empowerment Vacancies</h2>
//           <p className="text-muted-foreground">
//             Job opportunities for women in government bodies
//           </p>
//         </div>
        
//         {/* Create Dialog */}
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="bg-accent hover:bg-accent/90">
//               <Plus className="h-4 w-4 mr-2" />
//               Post New Vacancy
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Briefcase className="h-5 w-5 text-accent" />
//                 Post New Vacancy
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <div>
//                 <Label htmlFor="title">Job Title *</Label>
//                 <Input
//                   id="title"
//                   placeholder="e.g., Anganwadi Worker"
//                   className="mt-2"
//                   value={newVacancy.title}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="department">Department *</Label>
//                 <Input
//                   id="department"
//                   placeholder="e.g., Women & Child Development"
//                   className="mt-2"
//                   value={newVacancy.department}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, department: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="location">Location *</Label>
//                 <Select
//                   value={newVacancy.location}
//                   onValueChange={(value) => {
//                     const selectedLoc = locations.find(l => l.id === value);
//                     setNewVacancy({ 
//                       ...newVacancy, 
//                       location: value,
//                       location_text: selectedLoc?.name || ''
//                     });
//                   }}
//                 >
//                   <SelectTrigger className="mt-2">
//                     <SelectValue placeholder="Select location" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {locations.map((location) => (
//                       <SelectItem key={location.id} value={location.id}>
//                         {location.name} ({location.type})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="positions">Positions *</Label>
//                 <Input
//                   id="positions"
//                   type="number"
//                   min="1"
//                   className="mt-2"
//                   value={newVacancy.total_positions}
//                   onChange={(e) =>
//                     setNewVacancy({ ...newVacancy, total_positions: parseInt(e.target.value) || 1 })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="salary">Salary Range</Label>
//                 <Input
//                   id="salary"
//                   placeholder="e.g., ₹8,000 - ₹12,000/month"
//                   className="mt-2"
//                   value={newVacancy.salary_range}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, salary_range: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="eligibility">Eligibility Criteria</Label>
//                 <Input
//                   id="eligibility"
//                   placeholder="e.g., 10th Pass, Female candidates only"
//                   className="mt-2"
//                   value={newVacancy.eligibility}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, eligibility: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="deadline">Application Deadline *</Label>
//                 <Input
//                   id="deadline"
//                   type="datetime-local"
//                   className="mt-2"
//                   value={newVacancy.deadline}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, deadline: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="description">Job Description</Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Detailed job description..."
//                   className="mt-2"
//                   rows={3}
//                   value={newVacancy.description}
//                   onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleCreateVacancy} 
//                 className="bg-accent hover:bg-accent/90"
//                 disabled={createVacancyMutation.isPending}
//               >
//                 {createVacancyMutation.isPending ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Posting...
//                   </>
//                 ) : (
//                   <>
//                     <Briefcase className="h-4 w-4 mr-2" />
//                     Post Vacancy
//                   </>
//                 )}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="p-4 rounded-lg border bg-success/5 border-success/20">
//           <p className="text-sm text-muted-foreground">Open Vacancies</p>
//           <p className="text-2xl font-bold mt-1 text-success">
//             {jobVacancies.filter((v) => v.status === 'open').length}
//           </p>
//         </div>
//         <div className="p-4 rounded-lg border">
//           <p className="text-sm text-muted-foreground">Total Positions</p>
//           <p className="text-2xl font-bold mt-1">
//             {jobVacancies.reduce((sum, v) => sum + v.total_positions, 0)}
//           </p>
//         </div>
//         <div className="p-4 rounded-lg border bg-accent/5 border-accent/20">
//           <p className="text-sm text-muted-foreground">Total Applications</p>
//           <p className="text-2xl font-bold mt-1 text-accent">
//             {jobVacancies.reduce((sum, v) => sum + v.applied_count, 0)}
//           </p>
//         </div>
//         <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
//           <p className="text-sm text-muted-foreground">Positions Filled</p>
//           <p className="text-2xl font-bold mt-1 text-primary">
//             {jobVacancies.filter((v) => v.status === 'filled').reduce((sum, v) => sum + v.total_positions, 0)}
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="p-4 rounded-lg border bg-card">
//         <div className="flex flex-wrap gap-4">
//           <div className="flex-1 min-w-[200px]">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by title or department..."
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
//               <SelectItem value="open">Open</SelectItem>
//               <SelectItem value="closed">Closed</SelectItem>
//               <SelectItem value="filled">Filled</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Vacancies List */}
//       <div className="space-y-4">
//         {isLoading && (
//           <div className="text-center py-8">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
//             <p className="text-sm text-muted-foreground mt-2">Loading vacancies...</p>
//           </div>
//         )}
//         {isError && (
//           <p className="text-sm text-destructive text-center py-8">
//             Failed to load vacancies from the server.
//           </p>
//         )}
//         {filteredVacancies.map((vacancy) => (
//           <div key={vacancy.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
//             <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//               <div className="flex-1">
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 rounded-xl bg-accent/10 shrink-0">
//                     <Briefcase className="h-6 w-6 text-accent" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h3 className="font-semibold text-lg">{vacancy.title}</h3>
//                       {getStatusBadge(vacancy.status)}
//                     </div>
//                     <p className="text-sm text-muted-foreground mb-3">{vacancy.description}</p>
//                     <div className="flex flex-wrap gap-4 text-sm">
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <Briefcase className="h-4 w-4" />
//                         {vacancy.department}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <MapPin className="h-4 w-4" />
//                         {vacancy.location_text}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <IndianRupee className="h-4 w-4" />
//                         {vacancy.salary_range}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-muted-foreground">
//                         <GraduationCap className="h-4 w-4" />
//                         {vacancy.eligibility}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="lg:w-64 shrink-0">
//                 <div className="p-4 bg-muted/50 rounded-lg">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium">Applications</span>
//                     <span className="text-sm text-muted-foreground">
//                       {vacancy.applied_count} / {vacancy.total_positions}
//                     </span>
//                   </div>
//                   <Progress
//                     value={Math.min((vacancy.applied_count / vacancy.total_positions) * 100, 100)}
//                     className="h-2"
//                   />
//                   <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                       <Users className="h-3 w-3" />
//                       {vacancy.applied_count} applied
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-3 w-3" />
//                       {Math.max(0, vacancy.total_positions - vacancy.applied_count)} remaining
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
//                     <Calendar className="h-3 w-3" />
//                     Deadline: {new Date(vacancy.deadline).toLocaleDateString('en-IN')}
//                   </div>
//                 </div>

//                 <div className="flex gap-2 mt-3">
//                   <Button 
//                     variant="outline" 
//                     size="sm" 
//                     className="flex-1"
//                     onClick={() => handleViewVacancy(vacancy)}
//                   >
//                     <Eye className="h-3 w-3 mr-1" />
//                     View
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     size="sm" 
//                     className="flex-1"
//                     onClick={() => handleEditVacancy(vacancy)}
//                   >
//                     <Edit className="h-3 w-3 mr-1" />
//                     Edit
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredVacancies.length === 0 && !isLoading && (
//         <div className="text-center py-12 text-muted-foreground p-4 rounded-lg border bg-card">
//           No vacancies found matching your criteria
//         </div>
//       )}

//       {/* View Dialog */}
//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Briefcase className="h-5 w-5 text-accent" />
//               Vacancy Details
//             </DialogTitle>
//           </DialogHeader>
//           {selectedVacancy && (
//             <div className="space-y-6 py-4">
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <h3 className="text-xl font-semibold">{selectedVacancy.title}</h3>
//                   {getStatusBadge(selectedVacancy.status)}
//                 </div>
//                 <p className="text-muted-foreground">{selectedVacancy.department}</p>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <MapPin className="h-4 w-4" />
//                     <span className="font-medium">Location</span>
//                   </div>
//                   <p className="pl-6">{selectedVacancy.location_text}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <IndianRupee className="h-4 w-4" />
//                     <span className="font-medium">Salary Range</span>
//                   </div>
//                   <p className="pl-6">{selectedVacancy.salary_range}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Users className="h-4 w-4" />
//                     <span className="font-medium">Total Positions</span>
//                   </div>
//                   <p className="pl-6">{selectedVacancy.total_positions}</p>
//                 </div>
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Calendar className="h-4 w-4" />
//                     <span className="font-medium">Deadline</span>
//                   </div>
//                   <p className="pl-6">{new Date(selectedVacancy.deadline).toLocaleDateString('en-IN')}</p>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-sm font-medium">
//                   <GraduationCap className="h-4 w-4" />
//                   Eligibility Criteria
//                 </div>
//                 <p className="text-sm text-muted-foreground pl-6">{selectedVacancy.eligibility}</p>
//               </div>

//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium">Job Description</h4>
//                 <p className="text-sm text-muted-foreground">{selectedVacancy.description}</p>
//               </div>

//               <div className="p-4 bg-muted/50 rounded-lg">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium">Application Progress</span>
//                   <span className="text-sm text-muted-foreground">
//                     {selectedVacancy.applied_count} / {selectedVacancy.total_positions}
//                   </span>
//                 </div>
//                 <Progress
//                   value={Math.min((selectedVacancy.applied_count / selectedVacancy.total_positions) * 100, 100)}
//                   className="h-2"
//                 />
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Edit className="h-5 w-5 text-accent" />
//               Edit Vacancy
//             </DialogTitle>
//           </DialogHeader>
//           {selectedVacancy && (
//             <div className="space-y-4 py-4">
//               <div>
//                 <Label htmlFor="edit-title">Job Title *</Label>
//                 <Input
//                   id="edit-title"
//                   className="mt-2"
//                   value={selectedVacancy.title}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, title: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-department">Department *</Label>
//                 <Input
//                   id="edit-department"
//                   className="mt-2"
//                   value={selectedVacancy.department}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, department: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-location">Location *</Label>
//                 <Select
//                   value={selectedVacancy.location}
//                   onValueChange={(value) => {
//                     const selectedLoc = locations.find(l => l.id === value);
//                     setSelectedVacancy({ 
//                       ...selectedVacancy, 
//                       location: value,
//                       location_text: selectedLoc?.name || selectedVacancy.location_text
//                     });
//                   }}
//                 >
//                   <SelectTrigger className="mt-2">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {locations.map((location) => (
//                       <SelectItem key={location.id} value={location.id}>
//                         {location.name} ({location.type})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="edit-positions">Positions</Label>
//                 <Input
//                   id="edit-positions"
//                   type="number"
//                   min="1"
//                   className="mt-2"
//                   value={selectedVacancy.total_positions}
//                   onChange={(e) =>
//                     setSelectedVacancy({ ...selectedVacancy, total_positions: parseInt(e.target.value) || 1 })
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-salary">Salary Range</Label>
//                 <Input
//                   id="edit-salary"
//                   className="mt-2"
//                   value={selectedVacancy.salary_range}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, salary_range: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-eligibility">Eligibility Criteria</Label>
//                 <Input
//                   id="edit-eligibility"
//                   className="mt-2"
//                   value={selectedVacancy.eligibility}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, eligibility: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-status">Status</Label>
//                 <Select
//                   value={selectedVacancy.status}
//                   onValueChange={(value: 'open' | 'closed' | 'filled') =>
//                     setSelectedVacancy({ ...selectedVacancy, status: value })
//                   }
//                 >
//                   <SelectTrigger className="mt-2">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="open">Open</SelectItem>
//                     <SelectItem value="closed">Closed</SelectItem>
//                     <SelectItem value="filled">Filled</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="edit-deadline">Application Deadline</Label>
//                 <Input
//                   id="edit-deadline"
//                   type="datetime-local"
//                   className="mt-2"
//                   value={selectedVacancy.deadline ? new Date(selectedVacancy.deadline).toISOString().slice(0, 16) : ''}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, deadline: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="edit-description">Job Description</Label>
//                 <Textarea
//                   id="edit-description"
//                   className="mt-2"
//                   rows={3}
//                   value={selectedVacancy.description}
//                   onChange={(e) => setSelectedVacancy({ ...selectedVacancy, description: e.target.value })}
//                 />
//               </div>
//             </div>
//           )}
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleUpdateVacancy}
//               className="bg-accent hover:bg-accent/90"
//               disabled={updateVacancyMutation.isPending}
//             >
//               {updateVacancyMutation.isPending ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <Edit className="h-4 w-4 mr-2" />
//                   Update Vacancy
//                 </>
//               )}
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
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  GraduationCap,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Location {
  id: string;
  name: string;
  type: string;
}

interface JobApplication {
  id: string;
  applicant_name: string;
  applicant_phone: string;
  applicant_email: string;
  status: string;
  applied_at: string;
  resume: string;
  cover_letter?: string;
}

interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  location_text: string;
  salary_range: string;
  eligibility: string;
  description: string;
  deadline: string;
  total_positions: number;
  filled_positions: number;
  status: 'open' | 'closed' | 'filled';
  applied_count: number;
  posted_at: string;
  requirements?: Record<string, any>;
  applications?: JobApplication[];
}

interface VacanciesPageProps {
  type: 'gram_panchayat' | 'zilla_parishad';
}

export default function VacanciesPage({ type }: VacanciesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<JobVacancy | null>(null);
  const [newVacancy, setNewVacancy] = useState({
    title: '',
    department: '',
    location: '',
    location_text: '',
    salary_range: '',
    eligibility: '',
    description: '',
    total_positions: 1,
    deadline: '',
  });

  const queryClient = useQueryClient();

  // Fetch locations
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/locations/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch locations');
      const data = await response.json();
      return data.results || data;
    },
  });

  // Fetch job vacancies
  const {
    data: jobVacancies = [],
    isLoading,
    isError,
  } = useQuery<JobVacancy[]>({
    queryKey: ['job-vacancies'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/job-vacancies/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch vacancies');
      const data = await response.json();
      return data.results || data;
    },
  });

  // Create vacancy mutation
  const createVacancyMutation = useMutation({
    mutationFn: async (vacancyData: typeof newVacancy) => {
      // Convert datetime-local to ISO format
      const deadlineISO = new Date(vacancyData.deadline).toISOString();
      
      const response = await fetch('http://localhost:8000/api/job-vacancies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          title: vacancyData.title,
          department: vacancyData.department,
          location: vacancyData.location, // UUID of location
          location_text: vacancyData.location_text,
          salary_range: vacancyData.salary_range,
          eligibility: vacancyData.eligibility,
          description: vacancyData.description,
          total_positions: vacancyData.total_positions,
          deadline: deadlineISO,
          status: 'open',
          filled_positions: 0,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to create vacancy';
        try {
          const error = JSON.parse(errorText);
          errorMessage = error.detail || JSON.stringify(error);
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-vacancies'] });
      toast.success('Vacancy posted successfully!');
      setIsCreateDialogOpen(false);
      setNewVacancy({
        title: '',
        department: '',
        location: '',
        location_text: '',
        salary_range: '',
        eligibility: '',
        description: '',
        total_positions: 1,
        deadline: '',
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to post vacancy');
    },
  });

  // Update vacancy mutation
  const updateVacancyMutation = useMutation({
    mutationFn: async (vacancyData: Partial<JobVacancy> & { id: string }) => {
      // Convert deadline to ISO format if it's being updated
      const updateData: any = { ...vacancyData };
      if (updateData.deadline) {
        updateData.deadline = new Date(updateData.deadline).toISOString();
      }
      delete updateData.id;
      
      const response = await fetch(`http://localhost:8000/api/job-vacancies/${vacancyData.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to update vacancy';
        try {
          const error = JSON.parse(errorText);
          errorMessage = error.detail || JSON.stringify(error);
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-vacancies'] });
      toast.success('Vacancy updated successfully!');
      setIsEditDialogOpen(false);
      setSelectedVacancy(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update vacancy');
    },
  });

  // Delete vacancy mutation
  const deleteVacancyMutation = useMutation({
    mutationFn: async (vacancyId: string) => {
      const response = await fetch(`http://localhost:8000/api/job-vacancies/${vacancyId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to delete vacancy';
        try {
          const error = JSON.parse(errorText);
          errorMessage = error.detail || JSON.stringify(error);
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-vacancies'] });
      toast.success('Vacancy deleted successfully!');
      setIsViewDialogOpen(false);
      setSelectedVacancy(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete vacancy');
    },
  });

  const filteredVacancies = jobVacancies.filter((vacancy) => {
    const matchesSearch =
      vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vacancy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateVacancy = () => {
    if (!newVacancy.title || !newVacancy.department || !newVacancy.deadline) {
      toast.error('Please fill all required fields (Title, Department, Location, Deadline)');
      return;
    }
    if (!newVacancy.location) {
      toast.error('Please select a location');
      return;
    }
    createVacancyMutation.mutate(newVacancy);
  };

  const handleUpdateVacancy = () => {
    if (!selectedVacancy) return;
    updateVacancyMutation.mutate(selectedVacancy);
  };

  const handleDeleteVacancy = (vacancyId: string) => {
    if (window.confirm('Are you sure you want to delete this vacancy? This action cannot be undone.')) {
      deleteVacancyMutation.mutate(vacancyId);
    }
  };

  const handleViewVacancy = (vacancy: JobVacancy) => {
    setSelectedVacancy(vacancy);
    setIsViewDialogOpen(true);
  };

  const handleEditVacancy = (vacancy: JobVacancy) => {
    setSelectedVacancy(vacancy);
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-success/10 text-success border-success/20',
      closed: 'bg-muted text-muted-foreground border-muted',
      filled: 'bg-primary/10 text-primary border-primary/20',
    };

    const icons = {
      open: <CheckCircle className="h-3 w-3 mr-1" />,
      closed: <XCircle className="h-3 w-3 mr-1" />,
      filled: <Users className="h-3 w-3 mr-1" />,
    };

    return (
      <Badge variant="outline" className={cn('capitalize', styles[status as keyof typeof styles])}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Women Empowerment Vacancies</h2>
          <p className="text-muted-foreground">
            Job opportunities for women in government bodies
          </p>
        </div>
        
        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Post New Vacancy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" />
                Post New Vacancy
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Anganwadi Worker"
                  className="mt-2"
                  value={newVacancy.title}
                  onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  placeholder="e.g., Women & Child Development"
                  className="mt-2"
                  value={newVacancy.department}
                  onChange={(e) => setNewVacancy({ ...newVacancy, department: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={newVacancy.location}
                  onValueChange={(value) => {
                    const selectedLoc = locations.find(l => l.id === value);
                    setNewVacancy({ 
                      ...newVacancy, 
                      location: value,
                      location_text: selectedLoc?.name || ''
                    });
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name} ({location.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="positions">Positions *</Label>
                <Input
                  id="positions"
                  type="number"
                  min="1"
                  className="mt-2"
                  value={newVacancy.total_positions}
                  onChange={(e) =>
                    setNewVacancy({ ...newVacancy, total_positions: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  placeholder="e.g., ₹8,000 - ₹12,000/month"
                  className="mt-2"
                  value={newVacancy.salary_range}
                  onChange={(e) => setNewVacancy({ ...newVacancy, salary_range: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Input
                  id="eligibility"
                  placeholder="e.g., 10th Pass, Female candidates only"
                  className="mt-2"
                  value={newVacancy.eligibility}
                  onChange={(e) => setNewVacancy({ ...newVacancy, eligibility: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  className="mt-2"
                  value={newVacancy.deadline}
                  onChange={(e) => setNewVacancy({ ...newVacancy, deadline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed job description..."
                  className="mt-2"
                  rows={3}
                  value={newVacancy.description}
                  onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateVacancy} 
                className="bg-accent hover:bg-accent/90"
                disabled={createVacancyMutation.isPending}
              >
                {createVacancyMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Briefcase className="h-4 w-4 mr-2" />
                    Post Vacancy
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border bg-success/5 border-success/20">
          <p className="text-sm text-muted-foreground">Open Vacancies</p>
          <p className="text-2xl font-bold mt-1 text-success">
            {jobVacancies.filter((v) => v.status === 'open').length}
          </p>
        </div>
        <div className="p-4 rounded-lg border">
          <p className="text-sm text-muted-foreground">Total Positions</p>
          <p className="text-2xl font-bold mt-1">
            {jobVacancies.reduce((sum, v) => sum + v.total_positions, 0)}
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-accent/5 border-accent/20">
          <p className="text-sm text-muted-foreground">Total Applications</p>
          <p className="text-2xl font-bold mt-1 text-accent">
            {jobVacancies.reduce((sum, v) => sum + v.applied_count, 0)}
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
          <p className="text-sm text-muted-foreground">Positions Filled</p>
          <p className="text-2xl font-bold mt-1 text-primary">
            {jobVacancies.filter((v) => v.status === 'filled').reduce((sum, v) => sum + v.total_positions, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or department..."
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
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vacancies List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">Loading vacancies...</p>
          </div>
        )}
        {isError && (
          <p className="text-sm text-destructive text-center py-8">
            Failed to load vacancies from the server.
          </p>
        )}
        {filteredVacancies.map((vacancy) => (
          <div key={vacancy.id} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent/10 shrink-0">
                    <Briefcase className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{vacancy.title}</h3>
                      {getStatusBadge(vacancy.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{vacancy.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {vacancy.department}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {vacancy.location_text}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <IndianRupee className="h-4 w-4" />
                        {vacancy.salary_range}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        {vacancy.eligibility}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-64 shrink-0">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Applications</span>
                    <span className="text-sm text-muted-foreground">
                      {vacancy.applied_count} / {vacancy.total_positions}
                    </span>
                  </div>
                  <Progress
                    value={Math.min((vacancy.applied_count / vacancy.total_positions) * 100, 100)}
                    className="h-2"
                  />
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {vacancy.applied_count} applied
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.max(0, vacancy.total_positions - vacancy.applied_count)} remaining
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Deadline: {new Date(vacancy.deadline).toLocaleDateString('en-IN')}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewVacancy(vacancy)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditVacancy(vacancy)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteVacancy(vacancy.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVacancies.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground p-4 rounded-lg border bg-card">
          No vacancies found matching your criteria
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-accent" />
              Vacancy Details
            </DialogTitle>
          </DialogHeader>
          {selectedVacancy && (
            <div className="space-y-6 py-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{selectedVacancy.title}</h3>
                  {getStatusBadge(selectedVacancy.status)}
                </div>
                <p className="text-muted-foreground">{selectedVacancy.department}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Location</span>
                  </div>
                  <p className="pl-6">{selectedVacancy.location_text}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    <span className="font-medium">Salary Range</span>
                  </div>
                  <p className="pl-6">{selectedVacancy.salary_range}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Total Positions</span>
                  </div>
                  <p className="pl-6">{selectedVacancy.total_positions}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Deadline</span>
                  </div>
                  <p className="pl-6">{new Date(selectedVacancy.deadline).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GraduationCap className="h-4 w-4" />
                  Eligibility Criteria
                </div>
                <p className="text-sm text-muted-foreground pl-6">{selectedVacancy.eligibility}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Job Description</h4>
                <p className="text-sm text-muted-foreground">{selectedVacancy.description}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Application Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedVacancy.applied_count} / {selectedVacancy.total_positions}
                  </span>
                </div>
                <Progress
                  value={Math.min((selectedVacancy.applied_count / selectedVacancy.total_positions) * 100, 100)}
                  className="h-2"
                />
              </div>

              {/* Applications List */}
              {selectedVacancy.applications && selectedVacancy.applications.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Applied Candidates ({selectedVacancy.applications.length})</h4>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {selectedVacancy.applications.map((application) => (
                      <div key={application.id} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">{application.applicant_name}</h5>
                              <Badge variant="outline" className="text-xs">
                                {application.status}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                {application.applicant_phone}
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {application.applicant_email}
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                Applied: {new Date(application.applied_at).toLocaleDateString('en-IN')}
                              </div>
                            </div>
                            {application.cover_letter && (
                              <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                                <div className="flex items-center gap-1 mb-1 font-medium">
                                  <FileText className="h-3 w-3" />
                                  Cover Letter
                                </div>
                                <p className="text-muted-foreground line-clamp-2">{application.cover_letter}</p>
                              </div>
                            )}
                          </div>
                          {application.resume && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`http://localhost:8000${application.resume}`, '_blank')}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Resume
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedVacancy.applications && selectedVacancy.applications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border rounded-lg bg-muted/20">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No applications received yet</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => selectedVacancy && handleDeleteVacancy(selectedVacancy.id)}
              disabled={deleteVacancyMutation.isPending}
            >
              {deleteVacancyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Vacancy
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-accent" />
              Edit Vacancy
            </DialogTitle>
          </DialogHeader>
          {selectedVacancy && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title">Job Title *</Label>
                <Input
                  id="edit-title"
                  className="mt-2"
                  value={selectedVacancy.title}
                  onChange={(e) => setSelectedVacancy({ ...selectedVacancy, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-department">Department *</Label>
                <Input
                  id="edit-department"
                  className="mt-2"
                  value={selectedVacancy.department}
                  onChange={(e) => setSelectedVacancy({ ...selectedVacancy, department: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location *</Label>
                <Select
                  value={selectedVacancy.location}
                  onValueChange={(value) => {
                    const selectedLoc = locations.find(l => l.id === value);
                    setSelectedVacancy({ 
                      ...selectedVacancy, 
                      location: value,
                      location_text: selectedLoc?.name || selectedVacancy.location_text
                    });
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name} ({location.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-positions">Positions</Label>
                <Input
                  id="edit-positions"
                  type="number"
                  min="1"
                  className="mt-2"
                  value={selectedVacancy.total_positions}
                  onChange={(e) =>
                    setSelectedVacancy({ ...selectedVacancy, total_positions: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-salary">Salary Range</Label>
                <Input
                  id="edit-salary"
                  className="mt-2"
                  value={selectedVacancy.salary_range}
                  onChange={(e) => setSelectedVacancy({ ...selectedVacancy, salary_range: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-eligibility">Eligibility Criteria</Label>
                <Input
                  id="edit-eligibility"
                  className="mt-2"
                  value={selectedVacancy.eligibility}
                  onChange={(e) => setSelectedVacancy({ ...selectedVacancy, eligibility: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={selectedVacancy.status}
                  onValueChange={(value: 'open' | 'closed' | 'filled') =>
                    setSelectedVacancy({ ...selectedVacancy, status: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="filled">Filled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-deadline">Application Deadline</Label>
                <Input
                  id="edit-deadline"
                  type="datetime-local"
                  className="mt-2"
                  value={selectedVacancy.deadline ? new Date(selectedVacancy.deadline).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setSelectedVacancy({ ...selectedVacancy, deadline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Job Description</Label>
                <Textarea
                  id="edit-description"
                  className="mt-2"
                  rows={3}
                  value={selectedVacancy.description}
                  onChange={(e) => setSelectedVacancy({ ...selectedVacancy, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateVacancy}
              className="bg-accent hover:bg-accent/90"
              disabled={updateVacancyMutation.isPending}
            >
              {updateVacancyMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Vacancy
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}