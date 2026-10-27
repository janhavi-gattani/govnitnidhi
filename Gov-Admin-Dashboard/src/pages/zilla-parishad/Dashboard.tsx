// import { FileText, CheckCircle, Clock, AlertTriangle, FileCheck, Briefcase, Users, TrendingUp, MapPin } from 'lucide-react';
// import { StatsCard } from '@/components/dashboard/StatsCard';
// import { ComplaintMap } from '@/components/dashboard/ComplaintMap';
// import { RecentActivity } from '@/components/dashboard/RecentActivity';
// import { ComplaintCategoryChart } from '@/components/dashboard/ComplaintCategoryChart';
// import { useQuery } from '@tanstack/react-query';
// import { Complaint, NewsItem, Scheme, DashboardStats } from '@/data/dummyData';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';
// import { Card } from '@/components/ui/card';
// import { fetchComplaints, fetchDashboardStats, fetchNews, fetchSchemes } from '@/lib/api';

// export function ZillaParishadDashboard() {
//   const {
//     data: stats = null,
//   } = useQuery<DashboardStats>({
//     queryKey: ['dashboard-stats'],
//     queryFn: fetchDashboardStats,
//   });

//   const {
//     data: complaints = [],
//   } = useQuery<Complaint[]>({
//     queryKey: ['complaints'],
//     queryFn: fetchComplaints,
//   });

//   const {
//     data: newsItems = [],
//   } = useQuery<NewsItem[]>({
//     queryKey: ['news'],
//     queryFn: fetchNews,
//   });

//   const {
//     data: schemes = [],
//   } = useQuery<Scheme[]>({
//     queryKey: ['schemes'],
//     queryFn: fetchSchemes,
//   });

//   const escalatedComplaints = complaints.filter((c) => c.escalatedTo === 'zilla_parishad');
//   const urgentNews = newsItems
//     .filter((n) => n.priority === 'urgent' || n.priority === 'important')
//     .slice(0, 3);

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-accent to-saffron rounded-xl p-6 text-accent-foreground">
//         <h2 className="text-2xl font-bold">Welcome, District Officer</h2>
//         <p className="text-accent-foreground/80 mt-1">Zilla Parishad - Pune District Command Center</p>
//         <div className="mt-4 flex items-center gap-4 flex-wrap">
//           <div className="flex items-center gap-2 bg-accent-foreground/10 px-3 py-1.5 rounded-lg">
//             <Clock className="h-4 w-4" />
//             <span className="text-sm">Last updated: {new Date().toLocaleString('en-IN')}</span>
//           </div>
//           <div className="flex items-center gap-2 bg-accent-foreground/10 px-3 py-1.5 rounded-lg">
//             <MapPin className="h-4 w-4" />
//             <span className="text-sm">13 Talukas | 1,866 Villages</span>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard
//           title="Total Complaints"
//           value={stats?.totalComplaints ?? 0}
//           subtitle="District-wide"
//           icon={FileText}
//           variant="primary"
//         />
//         <StatsCard
//           title="Pending"
//           value={stats?.pendingComplaints ?? 0}
//           subtitle="Requires attention"
//           icon={Clock}
//           variant="warning"
//           trend={{ value: 5, isPositive: false }}
//         />
//         <StatsCard
//           title="Resolved"
//           value={stats?.resolvedComplaints ?? 0}
//           subtitle="This month"
//           icon={CheckCircle}
//           variant="success"
//           trend={{ value: 15, isPositive: true }}
//         />
//         <StatsCard
//           title="Escalated"
//           value={stats?.escalatedComplaints ?? 0}
//           subtitle="From Gram Panchayats"
//           icon={AlertTriangle}
//           variant="destructive"
//         />
//       </div>

//       {/* Second Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <StatsCard
//           title="Documents Issued"
//           value={(stats?.totalDocuments ?? 0).toLocaleString()}
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
//           value={(stats?.totalBeneficiaries ?? 0).toLocaleString()}
//           subtitle="Scheme coverage"
//           icon={Users}
//         />
//         <StatsCard
//           title="Avg. Resolution"
//           value={stats?.avgResolutionTime ?? '0 days'}
//           subtitle="Time to resolve"
//           icon={TrendingUp}
//         />
//       </div>

//       {/* Map - Full Width */}
//       <ComplaintMap filterType="all" />

//       {/* Charts and Info */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <ComplaintCategoryChart />
        
//         {/* Scheme Overview */}
//         <div className="dashboard-section">
//           <h3 className="text-lg font-semibold mb-4">Active Schemes</h3>
//           <div className="space-y-4">
//             {schemes.filter(s => s.status === 'active').slice(0, 4).map((scheme) => (
//               <div key={scheme.id} className="p-3 bg-muted/50 rounded-lg">
//                 <h4 className="font-medium text-sm">{scheme.name}</h4>
//                 <div className="flex items-center justify-between mt-2">
//                   <span className="text-xs text-muted-foreground">
//                     {scheme.beneficiaryCount.toLocaleString()} beneficiaries
//                   </span>
//                   <Badge variant="outline" className="text-xs">
//                     {scheme.totalBudget}
//                   </Badge>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Important Announcements */}
//         <div className="dashboard-section">
//           <h3 className="text-lg font-semibold mb-4">Priority Alerts</h3>
//           <div className="space-y-4">
//             {urgentNews.map((news) => (
//               <div
//                 key={news.id}
//                 className={cn(
//                   'p-4 rounded-lg border-l-4',
//                   news.priority === 'urgent' ? 'bg-destructive/5 border-destructive' :
//                   news.priority === 'important' ? 'bg-warning/5 border-warning' :
//                   'bg-muted border-muted-foreground'
//                 )}
//               >
//                 <div className="flex items-center gap-2 mb-2">
//                   <Badge
//                     variant={news.priority === 'urgent' ? 'destructive' : 'secondary'}
//                     className="text-xs"
//                   >
//                     {news.priority.toUpperCase()}
//                   </Badge>
//                 </div>
//                 <h4 className="font-medium text-sm">{news.title}</h4>
//                 <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{news.content}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Escalated Complaints and Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Escalated Complaints Table */}
//         <div className="dashboard-section">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold">Escalated from Gram Panchayats</h3>
//             <Badge variant="destructive">{escalatedComplaints.length} escalated</Badge>
//           </div>
//           <div className="space-y-3">
//             {escalatedComplaints.map((complaint) => (
//               <Card key={complaint.id} className="p-4 border-l-4 border-destructive">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium text-primary">{complaint.ticketNumber}</span>
//                   <Badge
//                     className={cn(
//                       'text-xs',
//                       complaint.priority === 'critical' && 'bg-destructive text-destructive-foreground',
//                       complaint.priority === 'high' && 'bg-warning text-warning-foreground'
//                     )}
//                   >
//                     {complaint.priority}
//                   </Badge>
//                 </div>
//                 <h4 className="font-medium text-sm">{complaint.title}</h4>
//                 <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
//                   <span className="flex items-center gap-1">
//                     <MapPin className="h-3 w-3" />
//                     {complaint.location.name}
//                   </span>
//                   <span>
//                     {Math.floor((new Date().getTime() - complaint.createdAt.getTime()) / (1000 * 60 * 60 * 24))} days old
//                   </span>
//                 </div>
//               </Card>
//             ))}
//             {escalatedComplaints.length === 0 && (
//               <p className="text-sm text-muted-foreground text-center py-4">No escalated complaints</p>
//             )}
//           </div>
//         </div>

//         <RecentActivity />
//       </div>

//       {/* Area-wise Complaint Summary (derived from real complaints data) */}
//       <div className="dashboard-section">
//         <h3 className="text-lg font-semibold mb-4">Area-wise Complaint Summary</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//           {Object.values(
//             complaints.reduce<Record<string, { name: string; count: number }>>((acc, c) => {
//               const key = c.location.name;
//               if (!acc[key]) {
//                 acc[key] = { name: key, count: 0 };
//               }
//               acc[key].count += 1;
//               return acc;
//             }, {}),
//           )
//             .sort((a, b) => b.count - a.count)
//             .slice(0, 12)
//             .map((area) => (
//               <div
//                 key={area.name}
//                 className="p-4 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors cursor-pointer"
//               >
//                 <p className="font-semibold text-xl text-foreground">{area.count}</p>
//                 <p className="text-xs text-muted-foreground mt-1">{area.name}</p>
//               </div>
//             ))}
//           {complaints.length === 0 && (
//             <p className="text-sm text-muted-foreground col-span-full text-center">
//               No complaints available to summarize
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }








import { FileText, CheckCircle, Clock, AlertTriangle, FileCheck, Briefcase, Users, TrendingUp, MapPin } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ComplaintMap } from '@/components/dashboard/ComplaintMap';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ComplaintCategoryChart } from '@/components/dashboard/ComplaintCategoryChart';
import { useQuery } from '@tanstack/react-query';
import { Complaint, NewsItem, Scheme, DashboardStats } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { fetchComplaints, fetchDashboardStats, fetchNews, fetchSchemes } from '@/lib/api';

export function ZillaParishadDashboard() {
  const {
    data: stats = null,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  const {
    data: complaints = [],
    isLoading: complaintsLoading,
    isError: complaintsError,
  } = useQuery<Complaint[]>({
    queryKey: ['complaints'],
    queryFn: fetchComplaints,
  });

  const {
    data: newsItems = [],
    isLoading: newsLoading,
    isError: newsError,
  } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  const {
    data: schemes = [],
    isLoading: schemesLoading,
    isError: schemesError,
  } = useQuery<Scheme[]>({
    queryKey: ['schemes'],
    queryFn: fetchSchemes,
  });

  // Safe filtering with null checks
  const escalatedComplaints = complaints?.filter((c) => c && c.escalatedTo === 'zilla_parishad') || [];
  const urgentNews = newsItems
    ?.filter((n) => n && (n.priority === 'urgent' || n.priority === 'important'))
    ?.slice(0, 3) || [];
  const activeSchemes = schemes?.filter(s => s && s.status === 'active') || [];

  // Show loading state
  if (statsLoading || complaintsLoading || newsLoading || schemesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-accent to-saffron rounded-xl p-6 text-accent-foreground">
        <h2 className="text-2xl font-bold">Welcome, District Officer</h2>
        <p className="text-accent-foreground/80 mt-1">Zilla Parishad - Pune District Command Center</p>
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-accent-foreground/10 px-3 py-1.5 rounded-lg">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Last updated: {new Date().toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-2 bg-accent-foreground/10 px-3 py-1.5 rounded-lg">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">13 Talukas | 1,866 Villages</span>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {(statsError || complaintsError || newsError || schemesError) && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">
            {statsError && 'Failed to load statistics. '}
            {complaintsError && 'Failed to load complaints. '}
            {newsError && 'Failed to load news. '}
            {schemesError && 'Failed to load schemes. '}
            Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Complaints"
          value={stats?.totalComplaints ?? 0}
          subtitle="District-wide"
          icon={FileText}
          variant="primary"
        />
        <StatsCard
          title="Pending"
          value={stats?.pendingComplaints ?? 0}
          subtitle="Requires attention"
          icon={Clock}
          variant="warning"
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Resolved"
          value={stats?.resolvedComplaints ?? 0}
          subtitle="This month"
          icon={CheckCircle}
          variant="success"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Escalated"
          value={stats?.escalatedComplaints ?? 0}
          subtitle="From Gram Panchayats"
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      {/* Second Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Documents Issued"
          value={(stats?.totalDocuments ?? 0).toLocaleString('en-IN')}
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
          value={(stats?.totalBeneficiaries ?? 0).toLocaleString('en-IN')}
          subtitle="Scheme coverage"
          icon={Users}
        />
        <StatsCard
          title="Avg. Resolution"
          value={stats?.avgResolutionTime ?? '0 days'}
          subtitle="Time to resolve"
          icon={TrendingUp}
        />
      </div>

      {/* Map - Full Width */}
      <ComplaintMap filterType="all" />

      {/* Charts and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ComplaintCategoryChart />
        
        {/* Scheme Overview */}
        <div className="dashboard-section">
          <h3 className="text-lg font-semibold mb-4">Active Schemes</h3>
          {activeSchemes && activeSchemes.length > 0 ? (
            <div className="space-y-4">
              {activeSchemes.slice(0, 4).map((scheme) => (
                <div key={scheme.id} className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">{scheme.name || 'Unnamed Scheme'}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {(scheme.beneficiaryCount || 0).toLocaleString('en-IN')} beneficiaries
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {scheme.totalBudget || 'N/A'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No active schemes</p>
            </div>
          )}
        </div>

        {/* Important Announcements */}
        <div className="dashboard-section">
          <h3 className="text-lg font-semibold mb-4">Priority Alerts</h3>
          {urgentNews && urgentNews.length > 0 ? (
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
                      {news.priority?.toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm">{news.title || 'Untitled'}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {news.content || 'No content'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No priority alerts</p>
            </div>
          )}
        </div>
      </div>

      {/* Escalated Complaints and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Escalated Complaints Table */}
        <div className="dashboard-section">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Escalated from Gram Panchayats</h3>
            <Badge variant="destructive">{escalatedComplaints?.length || 0} escalated</Badge>
          </div>
          {escalatedComplaints && escalatedComplaints.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {escalatedComplaints.map((complaint) => (
                <Card key={complaint.id} className="p-4 border-l-4 border-destructive">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">
                      {complaint.ticketNumber || 'N/A'}
                    </span>
                    <Badge
                      className={cn(
                        'text-xs',
                        complaint.priority === 'critical' && 'bg-destructive text-destructive-foreground',
                        complaint.priority === 'high' && 'bg-warning text-warning-foreground',
                        complaint.priority === 'medium' && 'bg-primary text-primary-foreground',
                        complaint.priority === 'low' && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {complaint.priority || 'N/A'}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm">{complaint.title || 'Untitled'}</h4>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {complaint.location?.name || 'Unknown'}
                    </span>
                    {complaint.createdAt && (
                      <span>
                        {Math.floor((new Date().getTime() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days old
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No escalated complaints</p>
            </div>
          )}
        </div>

        <RecentActivity />
      </div>

      {/* Area-wise Complaint Summary */}
      <div className="dashboard-section">
        <h3 className="text-lg font-semibold mb-4">Area-wise Complaint Summary</h3>
        {complaints && complaints.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.values(
              complaints.reduce<Record<string, { name: string; count: number }>>((acc, c) => {
                if (c && c.location && c.location.name) {
                  const key = c.location.name;
                  if (!acc[key]) {
                    acc[key] = { name: key, count: 0 };
                  }
                  acc[key].count += 1;
                }
                return acc;
              }, {}),
            )
              .sort((a, b) => b.count - a.count)
              .slice(0, 12)
              .map((area) => (
                <div
                  key={area.name}
                  className="p-4 bg-muted/50 rounded-lg text-center hover:bg-muted transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-xl text-foreground">{area.count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{area.name}</p>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No complaints available to summarize</p>
          </div>
        )}
      </div>
    </div>
  );
}










