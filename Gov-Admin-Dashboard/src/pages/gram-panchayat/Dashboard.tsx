import { FileText, CheckCircle, Clock, AlertTriangle, FileCheck, Briefcase, Users } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ComplaintMap } from '@/components/dashboard/ComplaintMap';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ComplaintCategoryChart } from '@/components/dashboard/ComplaintCategoryChart';
import { useQuery } from '@tanstack/react-query';
import { Complaint, NewsItem, DashboardStats } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fetchComplaints, fetchDashboardStats, fetchNews } from '@/lib/api';

export function GramPanchayatDashboard() {
  const {
    data: stats = null,
    isLoading: statsLoading,
  } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  const {
    data: complaints = [],
  } = useQuery<Complaint[]>({
    queryKey: ['complaints'],
    queryFn: fetchComplaints,
  });

  const {
    data: newsItems = [],
  } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  const ruralComplaints = complaints.filter((c) => !c.isUrban);
  const urgentNews = newsItems
    .filter((n) => n.priority === 'urgent' || n.priority === 'important')
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-navy-light rounded-xl p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold">Welcome, Gram Sevak</h2>
        <p className="text-primary-foreground/80 mt-1">Mulshi Gram Panchayat Dashboard</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-primary-foreground/10 px-3 py-1.5 rounded-lg">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Last updated: {new Date().toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Complaints"
          value={stats?.totalComplaints ?? 0}
          subtitle="All time"
          icon={FileText}
          variant="primary"
        />
        <StatsCard
          title="Pending"
          value={stats?.pendingComplaints ?? 0}
          subtitle="Requires attention"
          icon={Clock}
          variant="warning"
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard
          title="Resolved"
          value={stats?.resolvedComplaints ?? 0}
          subtitle="This month"
          icon={CheckCircle}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Escalated"
          value={stats?.escalatedComplaints ?? 0}
          subtitle="To Zilla Parishad"
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Documents Issued"
          value={stats?.totalDocuments ?? 0}
          subtitle="Blockchain verified"
          icon={FileCheck}
        />
        <StatsCard
          title="Active Vacancies"
          value={stats?.totalVacancies ?? 0}
          subtitle="Women empowerment"
          icon={Briefcase}
        />
        <StatsCard
          title="Beneficiaries"
          value={(stats?.totalBeneficiaries ?? 0).toLocaleString()}
          subtitle="Scheme coverage"
          icon={Users}
        />
      </div>

      {/* Map and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ComplaintMap filterType="rural" />
        </div>
        <div>
          <ComplaintCategoryChart isUrban={false} />
        </div>
      </div>

      {/* News and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Important Announcements */}
        <div className="dashboard-section">
          <h3 className="text-lg font-semibold mb-4">Important Announcements</h3>
          <div className="space-y-4">
            {urgentNews.map((news) => (
              <div
                key={news.id}
                className={cn(
                  'p-4 rounded-lg border-l-4',
                  news.priority === 'urgent' ? 'bg-destructive/5 border-destructive' :
                  news.priority === 'important' ? 'bg-warning/5 border-warning' :
                  'bg-muted border-muted-foreground'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={news.priority === 'urgent' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {news.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {news.category}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm">{news.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{news.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {news.publishedAt.toLocaleDateString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <RecentActivity />
      </div>

      {/* Pending Complaints Table */}
      <div className="dashboard-section">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Pending Complaints</h3>
          <Badge variant="secondary">{ruralComplaints.filter(c => c.status === 'pending').length} pending</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ticket</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {ruralComplaints.filter(c => c.status === 'pending').slice(0, 5).map((complaint) => (
                <tr key={complaint.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-primary">{complaint.ticketNumber}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm">{complaint.title}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-xs capitalize">
                      {complaint.category.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">{complaint.location.name}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      className={cn(
                        'text-xs',
                        complaint.priority === 'critical' && 'bg-destructive text-destructive-foreground',
                        complaint.priority === 'high' && 'bg-warning text-warning-foreground',
                        complaint.priority === 'medium' && 'bg-primary text-primary-foreground',
                        complaint.priority === 'low' && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {complaint.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground">
                      {complaint.createdAt.toLocaleDateString('en-IN')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}










// import { FileText, CheckCircle, Clock, AlertTriangle, FileCheck, Briefcase, Users } from 'lucide-react';
// import { StatsCard } from '@/components/dashboard/StatsCard';
// import { ComplaintMap } from '@/components/dashboard/ComplaintMap';
// import { RecentActivity } from '@/components/dashboard/RecentActivity';
// import { ComplaintCategoryChart } from '@/components/dashboard/ComplaintCategoryChart';
// import { useQuery } from '@tanstack/react-query';
// import { Complaint, NewsItem, DashboardStats } from '@/data/dummyData';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { fetchComplaints, fetchDashboardStats, fetchNews } from '@/lib/api';

// export function GramPanchayatDashboard() {
//   const {
//     data: stats = null,
//     isLoading: statsLoading,
//     isError: statsError,
//   } = useQuery<DashboardStats>({
//     queryKey: ['dashboard-stats'],
//     queryFn: fetchDashboardStats,
//   });

//   const {
//     data: complaints = [],
//     isLoading: complaintsLoading,
//     isError: complaintsError,
//   } = useQuery<Complaint[]>({
//     queryKey: ['complaints'],
//     queryFn: fetchComplaints,
//   });

//   const {
//     data: newsItems = [],
//     isLoading: newsLoading,
//     isError: newsError,
//   } = useQuery<NewsItem[]>({
//     queryKey: ['news'],
//     queryFn: fetchNews,
//   });

//   // Safe filtering with null checks
//   const ruralComplaints = complaints?.filter((c) => c && !c.isUrban) || [];
//   const urgentNews = newsItems
//     ?.filter((n) => n && (n.priority === 'urgent' || n.priority === 'important'))
//     ?.slice(0, 3) || [];

//   // Show loading state
//   if (statsLoading || complaintsLoading || newsLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-muted-foreground">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-primary to-navy-light rounded-xl p-6 text-primary-foreground">
//         <h2 className="text-2xl font-bold">Welcome, Gram Sevak</h2>
//         <p className="text-primary-foreground/80 mt-1">Mulshi Gram Panchayat Dashboard</p>
//         <div className="mt-4 flex items-center gap-4">
//           <div className="flex items-center gap-2 bg-primary-foreground/10 px-3 py-1.5 rounded-lg">
//             <Clock className="h-4 w-4" />
//             <span className="text-sm">Last updated: {new Date().toLocaleString('en-IN')}</span>
//           </div>
//         </div>
//       </div>

//       {/* Error Messages */}
//       {(statsError || complaintsError || newsError) && (
//         <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
//           <p className="text-sm text-destructive">
//             {statsError && 'Failed to load statistics. '}
//             {complaintsError && 'Failed to load complaints. '}
//             {newsError && 'Failed to load news. '}
//             Please try refreshing the page.
//           </p>
//         </div>
//       )}

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard
//           title="Total Complaints"
//           value={stats?.totalComplaints ?? 0}
//           subtitle="All time"
//           icon={FileText}
//           variant="primary"
//         />
//         <StatsCard
//           title="Pending"
//           value={stats?.pendingComplaints ?? 0}
//           subtitle="Requires attention"
//           icon={Clock}
//           variant="warning"
//           trend={{ value: 12, isPositive: false }}
//         />
//         <StatsCard
//           title="Resolved"
//           value={stats?.resolvedComplaints ?? 0}
//           subtitle="This month"
//           icon={CheckCircle}
//           variant="success"
//           trend={{ value: 8, isPositive: true }}
//         />
//         <StatsCard
//           title="Escalated"
//           value={stats?.escalatedComplaints ?? 0}
//           subtitle="To Zilla Parishad"
//           icon={AlertTriangle}
//           variant="destructive"
//         />
//       </div>

//       {/* Second Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <StatsCard
//           title="Documents Issued"
//           value={stats?.totalDocuments ?? 0}
//           subtitle="Blockchain verified"
//           icon={FileCheck}
//         />
//         <StatsCard
//           title="Active Vacancies"
//           value={stats?.totalVacancies ?? 0}
//           subtitle="Women empowerment"
//           icon={Briefcase}
//         />
//         <StatsCard
//           title="Beneficiaries"
//           value={(stats?.totalBeneficiaries ?? 0).toLocaleString('en-IN')}
//           subtitle="Scheme coverage"
//           icon={Users}
//         />
//       </div>

//       {/* Map and Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <ComplaintMap filterType="rural" />
//         </div>
//         <div>
//           <ComplaintCategoryChart isUrban={false} />
//         </div>
//       </div>

//       {/* News and Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Important Announcements */}
//         <div className="dashboard-section">
//           <h3 className="text-lg font-semibold mb-4">Important Announcements</h3>
//           {urgentNews && urgentNews.length > 0 ? (
//             <div className="space-y-4">
//               {urgentNews.map((news) => (
//                 <div
//                   key={news.id}
//                   className={cn(
//                     'p-4 rounded-lg border-l-4',
//                     news.priority === 'urgent' ? 'bg-destructive/5 border-destructive' :
//                     news.priority === 'important' ? 'bg-warning/5 border-warning' :
//                     'bg-muted border-muted-foreground'
//                   )}
//                 >
//                   <div className="flex items-center gap-2 mb-2">
//                     <Badge
//                       variant={news.priority === 'urgent' ? 'destructive' : 'secondary'}
//                       className="text-xs"
//                     >
//                       {news.priority?.toUpperCase()}
//                     </Badge>
//                     <Badge variant="outline" className="text-xs capitalize">
//                       {news.category}
//                     </Badge>
//                   </div>
//                   <h4 className="font-medium text-sm">{news.title}</h4>
//                   <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{news.content}</p>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     {news.publishedAt ? new Date(news.publishedAt).toLocaleDateString('en-IN') : 'N/A'}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-muted-foreground">
//               <p className="text-sm">No urgent announcements at this time</p>
//             </div>
//           )}
//         </div>

//         <RecentActivity />
//       </div>

//       {/* Pending Complaints Table */}
//       <div className="dashboard-section">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold">Pending Complaints</h3>
//           <Badge variant="secondary">
//             {ruralComplaints?.filter(c => c?.status === 'pending')?.length || 0} pending
//           </Badge>
//         </div>
//         {ruralComplaints && ruralComplaints.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-border">
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ticket</th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
//                   <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {ruralComplaints
//                   .filter(c => c && c.status === 'pending')
//                   .slice(0, 5)
//                   .map((complaint) => (
//                     <tr key={complaint.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
//                       <td className="py-3 px-4">
//                         <span className="text-sm font-medium text-primary">
//                           {complaint.ticketNumber || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4">
//                         <span className="text-sm">{complaint.title || 'Untitled'}</span>
//                       </td>
//                       <td className="py-3 px-4">
//                         <Badge variant="outline" className="text-xs capitalize">
//                           {complaint.category?.replace('_', ' ') || 'N/A'}
//                         </Badge>
//                       </td>
//                       <td className="py-3 px-4">
//                         <span className="text-sm text-muted-foreground">
//                           {complaint.location?.name || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="py-3 px-4">
//                         <Badge
//                           className={cn(
//                             'text-xs',
//                             complaint.priority === 'critical' && 'bg-destructive text-destructive-foreground',
//                             complaint.priority === 'high' && 'bg-warning text-warning-foreground',
//                             complaint.priority === 'medium' && 'bg-primary text-primary-foreground',
//                             complaint.priority === 'low' && 'bg-muted text-muted-foreground'
//                           )}
//                         >
//                           {complaint.priority || 'N/A'}
//                         </Badge>
//                       </td>
//                       <td className="py-3 px-4">
//                         <span className="text-sm text-muted-foreground">
//                           {complaint.createdAt 
//                             ? new Date(complaint.createdAt).toLocaleDateString('en-IN')
//                             : 'N/A'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-8 text-muted-foreground">
//             <p className="text-sm">No pending complaints</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }