// import { useState, useMemo } from 'react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { complaintCategories, Complaint, ComplaintStatus, ComplaintCategory } from '@/data/dummyData';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import {
//   Search,
//   Filter,
//   Eye,
//   CheckCircle,
//   ArrowUpRight,
//   Clock,
//   MapPin,
//   Phone,
//   User,
//   Calendar,
//   AlertCircle,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { escalateComplaint, fetchComplaints, resolveComplaint } from '@/lib/api';

// interface ComplaintsPageProps {
//   type: 'gram_panchayat' | 'zilla_parishad';
// }

// export function ComplaintsPage({ type }: ComplaintsPageProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [categoryFilter, setCategoryFilter] = useState<string>('all');
//   const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
//   const [resolutionNotes, setResolutionNotes] = useState('');
//   const queryClient = useQueryClient();

//   const {
//     data: complaints = [],
//     isLoading,
//     isError,
//   } = useQuery<Complaint[]>({
//     queryKey: ['complaints'],
//     queryFn: fetchComplaints,
//   });

//   const resolveMutation = useMutation({
//     mutationFn: ({ id, notes }: { id: string; notes: string }) => resolveComplaint(id, notes),
//     onSuccess: () => {
//       toast.success('Complaint marked as resolved');
//       queryClient.invalidateQueries({ queryKey: ['complaints'] });
//       setSelectedComplaint(null);
//       setResolutionNotes('');
//     },
//     onError: () => {
//       toast.error('Failed to resolve complaint');
//     },
//   });

//   const escalateMutation = useMutation({
//     mutationFn: ({ id, reason }: { id: string; reason: string }) => escalateComplaint(id, reason),
//     onSuccess: () => {
//       toast.success('Complaint escalated to Zilla Parishad');
//       queryClient.invalidateQueries({ queryKey: ['complaints'] });
//       setSelectedComplaint(null);
//     },
//     onError: () => {
//       toast.error('Failed to escalate complaint');
//     },
//   });

//   const filteredComplaints = useMemo(() => {
//     let filtered = complaints;

//     // Filter by type (urban for ZP, rural for GP)
//     if (type === 'gram_panchayat') {
//       filtered = filtered.filter(c => !c.isUrban || c.escalatedTo !== 'zilla_parishad');
//     } else {
//       filtered = filtered.filter(c => c.isUrban || c.escalatedTo === 'zilla_parishad');
//     }

//     // Apply search
//     if (searchQuery) {
//       filtered = filtered.filter(
//         c =>
//           c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           c.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           c.citizenName.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Apply status filter
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(c => c.status === statusFilter);
//     }

//     // Apply category filter
//     if (categoryFilter !== 'all') {
//       filtered = filtered.filter(c => c.category === categoryFilter);
//     }

//     return filtered;
//   }, [type, searchQuery, statusFilter, categoryFilter]);

//   const handleResolve = (complaint: Complaint) => {
//     if (!resolutionNotes.trim()) {
//       toast.error('Please enter resolution notes before resolving');
//       return;
//     }
//     resolveMutation.mutate({ id: complaint.id, notes: resolutionNotes });
//   };

//   const handleEscalate = (complaint: Complaint) => {
//     escalateMutation.mutate({ id: complaint.id, reason: resolutionNotes });
//   };

//   const getStatusBadge = (status: ComplaintStatus) => {
//     const styles = {
//       pending: 'status-pending',
//       in_progress: 'status-in-progress',
//       resolved: 'status-resolved',
//       escalated: 'status-escalated',
//     };

//     return (
//       <span className={cn('status-badge', styles[status])}>
//         {status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
//         {status === 'in_progress' && <AlertCircle className="h-3 w-3 mr-1" />}
//         {status === 'resolved' && <CheckCircle className="h-3 w-3 mr-1" />}
//         {status === 'escalated' && <ArrowUpRight className="h-3 w-3 mr-1" />}
//         {status.replace('_', ' ')}
//       </span>
//     );
//   };

//   const getPriorityBadge = (priority: string) => {
//     const styles = {
//       critical: 'bg-destructive text-destructive-foreground',
//       high: 'bg-warning text-warning-foreground',
//       medium: 'bg-primary text-primary-foreground',
//       low: 'bg-muted text-muted-foreground',
//     };

//     return (
//       <Badge className={cn('text-xs', styles[priority as keyof typeof styles])}>
//         {priority}
//       </Badge>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="dashboard-section">
//         <p className="text-muted-foreground">Loading complaints...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="dashboard-section">
//         <p className="text-destructive">Failed to load complaints from the server.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Complaint Management</h2>
//           <p className="text-muted-foreground">
//             {type === 'gram_panchayat' ? 'Village-level complaints' : 'District-wide complaints'}
//           </p>
//         </div>
//         <Badge variant="outline" className="text-lg px-4 py-2">
//           {filteredComplaints.length} Complaints
//         </Badge>
//       </div>

//       {/* Filters */}
//       <div className="dashboard-section">
//         <div className="flex flex-wrap gap-4">
//           <div className="flex-1 min-w-[200px]">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by ticket, title, or citizen name..."
//                 className="pl-10"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[180px]">
//               <Filter className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Status</SelectItem>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="in_progress">In Progress</SelectItem>
//               <SelectItem value="resolved">Resolved</SelectItem>
//               <SelectItem value="escalated">Escalated</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//             <SelectTrigger className="w-[200px]">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {complaintCategories.map((cat) => (
//                 <SelectItem key={cat.id} value={cat.id}>
//                   {cat.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Complaints Table */}
//       <div className="dashboard-section overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-border bg-muted/50">
//                 <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Ticket #</th>
//                 <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Title</th>
//                 <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Category</th>
//                 <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Location</th>
//                 <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Priority</th>
//                 <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Status</th>
//                 <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Date</th>
//                 <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredComplaints.map((complaint) => (
//                 <tr
//                   key={complaint.id}
//                   className="border-b border-border/50 hover:bg-muted/30 transition-colors"
//                 >
//                   <td className="py-4 px-4">
//                     <span className="font-medium text-primary">{complaint.ticketNumber}</span>
//                   </td>
//                   <td className="py-4 px-4">
//                     <div>
//                       <p className="font-medium text-sm">{complaint.title}</p>
//                       <p className="text-xs text-muted-foreground truncate max-w-[200px]">
//                         {complaint.description}
//                       </p>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">
//                     <Badge variant="outline" className="text-xs capitalize">
//                       {complaint.category.replace('_', ' ')}
//                     </Badge>
//                   </td>
//                   <td className="py-4 px-4">
//                     <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                       <MapPin className="h-3 w-3" />
//                       {complaint.location.name}
//                     </div>
//                   </td>
//                   <td className="py-4 px-4">{getPriorityBadge(complaint.priority)}</td>
//                   <td className="py-4 px-4">{getStatusBadge(complaint.status)}</td>
//                   <td className="py-4 px-4">
//                     <span className="text-sm text-muted-foreground">
//                       {complaint.createdAt.toLocaleDateString('en-IN')}
//                     </span>
//                   </td>
//                   <td className="py-4 px-4">
//                     <Dialog>
//                       <DialogTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => setSelectedComplaint(complaint)}
//                         >
//                           <Eye className="h-4 w-4 mr-1" />
//                           View
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="max-w-2xl">
//                         <DialogHeader>
//                           <DialogTitle className="flex items-center gap-2">
//                             <span>{complaint.ticketNumber}</span>
//                             {getStatusBadge(complaint.status)}
//                           </DialogTitle>
//                         </DialogHeader>
//                         <div className="space-y-6">
//                           <div>
//                             <h4 className="font-semibold text-lg">{complaint.title}</h4>
//                             <p className="text-muted-foreground mt-2">{complaint.description}</p>
//                           </div>

//                           <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-3">
//                               <div className="flex items-center gap-2 text-sm">
//                                 <User className="h-4 w-4 text-muted-foreground" />
//                                 <span className="font-medium">Citizen:</span>
//                                 <span>{complaint.citizenName}</span>
//                               </div>
//                               <div className="flex items-center gap-2 text-sm">
//                                 <Phone className="h-4 w-4 text-muted-foreground" />
//                                 <span className="font-medium">Phone:</span>
//                                 <span>{complaint.citizenPhone}</span>
//                               </div>
//                               <div className="flex items-center gap-2 text-sm">
//                                 <MapPin className="h-4 w-4 text-muted-foreground" />
//                                 <span className="font-medium">Location:</span>
//                                 <span>{complaint.location.name}</span>
//                               </div>
//                             </div>
//                             <div className="space-y-3">
//                               <div className="flex items-center gap-2 text-sm">
//                                 <Calendar className="h-4 w-4 text-muted-foreground" />
//                                 <span className="font-medium">Created:</span>
//                                 <span>{complaint.createdAt.toLocaleDateString('en-IN')}</span>
//                               </div>
//                               <div className="flex items-center gap-2 text-sm">
//                                 <span className="font-medium">Priority:</span>
//                                 {getPriorityBadge(complaint.priority)}
//                               </div>
//                               <div className="flex items-center gap-2 text-sm">
//                                 <span className="font-medium">Category:</span>
//                                 <Badge variant="outline">{complaint.category.replace('_', ' ')}</Badge>
//                               </div>
//                             </div>
//                           </div>

//                           {complaint.status !== 'resolved' && (
//                             <div className="space-y-4 pt-4 border-t">
//                               <div>
//                                 <Label htmlFor="resolution">Resolution Notes</Label>
//                                 <Textarea
//                                   id="resolution"
//                                   placeholder="Enter resolution details..."
//                                   value={resolutionNotes}
//                                   onChange={(e) => setResolutionNotes(e.target.value)}
//                                   className="mt-2"
//                                 />
//                               </div>
//                               <div className="flex gap-3">
//                                 <Button
//                                   onClick={() => handleResolve(complaint)}
//                                   className="bg-success hover:bg-success/90"
//                                 >
//                                   <CheckCircle className="h-4 w-4 mr-2" />
//                                   Mark Resolved
//                                 </Button>
//                                 {type === 'gram_panchayat' && complaint.status !== 'escalated' && (
//                                   <Button
//                                     variant="outline"
//                                     onClick={() => handleEscalate(complaint)}
//                                     className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
//                                   >
//                                     <ArrowUpRight className="h-4 w-4 mr-2" />
//                                     Escalate to Zilla Parishad
//                                   </Button>
//                                 )}
//                               </div>
//                             </div>
//                           )}

//                           {complaint.resolutionNotes && (
//                             <div className="p-4 bg-success/10 rounded-lg">
//                               <h5 className="font-medium text-success mb-2">Resolution Notes</h5>
//                               <p className="text-sm">{complaint.resolutionNotes}</p>
//                             </div>
//                           )}
//                         </div>
//                       </DialogContent>
//                     </Dialog>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {filteredComplaints.length === 0 && (
//             <div className="text-center py-12 text-muted-foreground">
//               No complaints found matching your criteria
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }







import { useState, useMemo, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { complaintCategories, Complaint, ComplaintStatus } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  ArrowUpRight,
  Clock,
  MapPin,
  Phone,
  User,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { escalateComplaint, fetchComplaints, resolveComplaint } from '@/lib/api';

interface ComplaintsPageProps {
  type: 'gram_panchayat' | 'zilla_parishad';
}

export function ComplaintsPage({ type }: ComplaintsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const queryClient = useQueryClient();

  const {
    data: complaints = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Complaint[]>({
    queryKey: ['complaints'],
    queryFn: fetchComplaints,
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: 0, // Always consider data stale to refetch more often
  });

  // Refetch complaints when component mounts or type changes
  useEffect(() => {
    refetch();
  }, [type, refetch]);

  const resolveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => resolveComplaint(id, notes),
    onSuccess: () => {
      toast.success('Complaint marked as resolved');
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setSelectedComplaint(null);
      setResolutionNotes('');
    },
    onError: () => {
      toast.error('Failed to resolve complaint');
    },
  });

  const escalateMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => escalateComplaint(id, reason),
    onSuccess: () => {
      toast.success('Complaint escalated to Zilla Parishad');
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setSelectedComplaint(null);
      setResolutionNotes('');
    },
    onError: () => {
      toast.error('Failed to escalate complaint');
    },
  });

  const filteredComplaints = useMemo(() => {
    if (!complaints || complaints.length === 0) return [];
    
    let filtered = [...complaints];

    // Filter by type
    if (type === 'gram_panchayat') {
      // Gram Panchayat sees: rural complaints that are NOT escalated
      filtered = filtered.filter(c => 
        !c.isUrban && c.escalatedTo !== 'zilla_parishad'
      );
    } else {
      // Zilla Parishad sees: urban complaints OR escalated complaints
      filtered = filtered.filter(c => 
        c.isUrban || c.escalatedTo === 'zilla_parishad'
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.title?.toLowerCase().includes(query) ||
          c.ticketNumber?.toLowerCase().includes(query) ||
          c.citizenName?.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(c => c.category === categoryFilter);
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [complaints, type, searchQuery, statusFilter, categoryFilter]);

  const handleResolve = (complaint: Complaint) => {
    if (!resolutionNotes.trim()) {
      toast.error('Please enter resolution notes before resolving');
      return;
    }
    resolveMutation.mutate({ id: complaint.id, notes: resolutionNotes });
  };

  const handleEscalate = (complaint: Complaint) => {
    if (!resolutionNotes.trim()) {
      toast.error('Please enter escalation reason');
      return;
    }
    escalateMutation.mutate({ id: complaint.id, reason: resolutionNotes });
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    const styles = {
      pending: 'status-pending',
      in_progress: 'status-in-progress',
      resolved: 'status-resolved',
      escalated: 'status-escalated',
    };

    return (
      <span className={cn('status-badge', styles[status])}>
        {status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
        {status === 'in_progress' && <AlertCircle className="h-3 w-3 mr-1" />}
        {status === 'resolved' && <CheckCircle className="h-3 w-3 mr-1" />}
        {status === 'escalated' && <ArrowUpRight className="h-3 w-3 mr-1" />}
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      critical: 'bg-destructive text-destructive-foreground',
      high: 'bg-warning text-warning-foreground',
      medium: 'bg-primary text-primary-foreground',
      low: 'bg-muted text-muted-foreground',
    };

    return (
      <Badge className={cn('text-xs', styles[priority as keyof typeof styles] || styles.low)}>
        {priority}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="dashboard-section">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <p>Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-section">
        <div className="text-center space-y-4">
          <p className="text-destructive">Failed to load complaints from the server.</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Complaint Management</h2>
          <p className="text-muted-foreground">
            {type === 'gram_panchayat' ? 'Village-level complaints' : 'District-wide complaints'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {filteredComplaints.length} Complaints
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-section">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ticket, title, or citizen name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {complaintCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="dashboard-section overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Ticket #</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Title</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Category</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Location</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Priority</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-medium text-primary">{complaint.ticketNumber}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-sm">{complaint.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {complaint.description}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className="text-xs capitalize">
                      {complaint.category.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {complaint.location.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">{getPriorityBadge(complaint.priority)}</td>
                  <td className="py-4 px-4">{getStatusBadge(complaint.status)}</td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setResolutionNotes('');
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <span>{complaint.ticketNumber}</span>
                            {getStatusBadge(complaint.status)}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-lg">{complaint.title}</h4>
                            <p className="text-muted-foreground mt-2">{complaint.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Citizen:</span>
                                <span>{complaint.citizenName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Phone:</span>
                                <span>{complaint.citizenPhone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Location:</span>
                                <span>{complaint.location.name}</span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Created:</span>
                                <span>{new Date(complaint.createdAt).toLocaleDateString('en-IN')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Priority:</span>
                                {getPriorityBadge(complaint.priority)}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Category:</span>
                                <Badge variant="outline">{complaint.category.replace('_', ' ')}</Badge>
                              </div>
                            </div>
                          </div>

                          {complaint.status !== 'resolved' && complaint.status !== 'escalated' && (
                            <div className="space-y-4 pt-4 border-t">
                              <div>
                                <Label htmlFor="resolution">
                                  {type === 'gram_panchayat' ? 'Resolution Notes / Escalation Reason' : 'Resolution Notes'}
                                </Label>
                                <Textarea
                                  id="resolution"
                                  placeholder="Enter details..."
                                  value={resolutionNotes}
                                  onChange={(e) => setResolutionNotes(e.target.value)}
                                  className="mt-2"
                                  rows={4}
                                />
                              </div>
                              <div className="flex gap-3 flex-wrap">
                                <Button
                                  onClick={() => handleResolve(complaint)}
                                  disabled={resolveMutation.isPending}
                                  className="bg-success hover:bg-success/90"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  {resolveMutation.isPending ? 'Resolving...' : 'Mark Resolved'}
                                </Button>
                                {type === 'gram_panchayat' && (
                                  <Button
                                    variant="outline"
                                    onClick={() => handleEscalate(complaint)}
                                    disabled={escalateMutation.isPending}
                                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <ArrowUpRight className="h-4 w-4 mr-2" />
                                    {escalateMutation.isPending ? 'Escalating...' : 'Escalate to Zilla Parishad'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {complaint.resolutionNotes && (
                            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                              <h5 className="font-medium text-success mb-2 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Resolution Notes
                              </h5>
                              <p className="text-sm">{complaint.resolutionNotes}</p>
                            </div>
                          )}

                          {complaint.status === 'escalated' && (
                            <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                              <h5 className="font-medium text-warning mb-2 flex items-center gap-2">
                                <ArrowUpRight className="h-4 w-4" />
                                Escalated to Zilla Parishad
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                This complaint has been escalated and will be handled at the district level.
                              </p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredComplaints.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No complaints found</p>
              <p className="text-sm mt-1">
                {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : type === 'gram_panchayat'
                  ? 'No village-level complaints available'
                  : 'No district-level complaints available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}