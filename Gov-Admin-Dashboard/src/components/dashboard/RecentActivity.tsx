// import { useQuery } from '@tanstack/react-query';
// import { UserActivity } from '@/data/dummyData';
// import { FileText, Bell, Briefcase, Users, FileCheck } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { fetchRecentActivities } from '@/lib/api';

// const moduleIcons = {
//   complaints: FileText,
//   documents: FileCheck,
//   vacancies: Briefcase,
//   schemes: Users,
//   news: Bell,
// };

// const moduleColors = {
//   complaints: 'bg-primary/10 text-primary',
//   documents: 'bg-success/10 text-success',
//   vacancies: 'bg-accent/10 text-accent',
//   schemes: 'bg-warning/10 text-warning',
//   news: 'bg-muted text-muted-foreground',
// };

// export function RecentActivity() {
//   const {
//     data: activities = [],
//     isLoading,
//     isError,
//   } = useQuery<UserActivity[]>({
//     queryKey: ['activities'],
//     queryFn: fetchRecentActivities,
//   });

//   return (
//     <div className="dashboard-section">
//       <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
//       {isLoading && (
//         <p className="text-sm text-muted-foreground">Loading recent activity...</p>
//       )}
//       {isError && (
//         <p className="text-sm text-destructive">Failed to load recent activity.</p>
//       )}
//       <div className="space-y-4">
//         {activities.map((activity) => {
//           const Icon = moduleIcons[activity.module];
//           return (
//             <div key={activity.id} className="flex items-start gap-4">
//               <div className={cn('p-2 rounded-lg shrink-0', moduleColors[activity.module])}>
//                 <Icon className="h-4 w-4" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-foreground">{activity.action}</p>
//                 <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {activity.timestamp.toLocaleString('en-IN', {
//                     day: 'numeric',
//                     month: 'short',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }





import { useQuery } from '@tanstack/react-query';
import { Activity, FileText, Users, Briefcase, Newspaper, Award, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserActivity {
  id: string;
  user: string;
  action: string;
  description: string;
  module: 'complaints' | 'documents' | 'vacancies' | 'schemes' | 'news' | 'campaigns';
  timestamp: string;
  related_content_type?: string;
  related_object_id?: string;
}

const API_BASE_URL = 'http://localhost:8000/api';

const fetchActivities = async (): Promise<UserActivity[]> => {
  const response = await fetch(`${API_BASE_URL}/activities/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch activities');
  const data = await response.json();
  return data.results || data;
};

const getModuleIcon = (module: string) => {
  const icons = {
    complaints: FileText,
    documents: FileText,
    vacancies: Briefcase,
    schemes: Award,
    news: Newspaper,
    campaigns: Phone,
  };
  return icons[module as keyof typeof icons] || Activity;
};

const getModuleColor = (module: string) => {
  const colors = {
    complaints: 'text-blue-500 bg-blue-500/10',
    documents: 'text-green-500 bg-green-500/10',
    vacancies: 'text-purple-500 bg-purple-500/10',
    schemes: 'text-orange-500 bg-orange-500/10',
    news: 'text-pink-500 bg-pink-500/10',
    campaigns: 'text-indigo-500 bg-indigo-500/10',
  };
  return colors[module as keyof typeof colors] || 'text-gray-500 bg-gray-500/10';
};

export function RecentActivity() {
  const {
    data: activities = [],
    isLoading,
    isError,
  } = useQuery<UserActivity[]>({
    queryKey: ['activities'],
    queryFn: fetchActivities,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="dashboard-section">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-section">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-sm text-destructive">Failed to load activities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      
      {activities && activities.length > 0 ? (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {activities.slice(0, 10).map((activity) => {
            const Icon = getModuleIcon(activity.module);
            const colorClass = getModuleColor(activity.module);
            
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={cn('p-2 rounded-lg shrink-0', colorClass)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action || 'Activity'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {activity.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground capitalize">
                      {activity.module?.replace('_', ' ') || 'Unknown'}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp
                        ? new Date(activity.timestamp).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  );
}