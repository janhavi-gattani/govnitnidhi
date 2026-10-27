// import { useState } from 'react';
// import { Link, useLocation, Outlet } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   FileText,
//   Users,
//   Bell,
//   Briefcase,
//   FileCheck,
//   Phone,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   MapPin,
//   ChevronDown,
//   Building2,
//   Home,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// interface DashboardLayoutProps {
//   type: 'gram_panchayat' | 'zilla_parishad';
// }

// const gramPanchayatNavItems = [
//   { icon: LayoutDashboard, label: 'Dashboard', path: '/gram-panchayat' },
//   { icon: FileText, label: 'Complaints', path: '/gram-panchayat/complaints' },
//   { icon: FileCheck, label: 'Documents', path: '/gram-panchayat/documents' },
//   { icon: Briefcase, label: 'Vacancies', path: '/gram-panchayat/vacancies' },
//   { icon: Bell, label: 'News & Updates', path: '/gram-panchayat/news' },
//   { icon: Phone, label: 'Bulk Calling', path: '/gram-panchayat/bulk-calling' },
//   { icon: Users, label: 'Schemes', path: '/gram-panchayat/schemes' },
// ];

// const zillaParishadNavItems = [
//   { icon: LayoutDashboard, label: 'Dashboard', path: '/zilla-parishad' },
//   { icon: FileText, label: 'Complaints', path: '/zilla-parishad/complaints' },
//   { icon: FileCheck, label: 'Documents', path: '/zilla-parishad/documents' },
//   { icon: Briefcase, label: 'Vacancies', path: '/zilla-parishad/vacancies' },
//   { icon: Bell, label: 'News & Updates', path: '/zilla-parishad/news' },
//   { icon: Users, label: 'Schemes', path: '/zilla-parishad/schemes' },
//   { icon: MapPin, label: 'Regional Overview', path: '/zilla-parishad/regional' },
//   { icon: Settings, label: 'Settings', path: '/zilla-parishad/settings' },
// ];

// export function DashboardLayout({ type }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();

//   const navItems = type === 'gram_panchayat' ? gramPanchayatNavItems : zillaParishadNavItems;
//   const title = type === 'gram_panchayat' ? 'Gram Panchayat Dashboard' : 'Zilla Parishad Dashboard';
//   const subtitle = type === 'gram_panchayat' ? 'Mulshi, Pune District' : 'Pune District, Maharashtra';

//   return (
//     <div className="flex h-screen bg-background">
//       {/* Sidebar */}
//       <aside
//         className={cn(
//           'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 lg:relative',
//           sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
//         )}
//       >
//         {/* Logo Section */}
//         <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
//           {sidebarOpen && (
//             <div className="flex items-center gap-3">
//               {type === 'gram_panchayat' ? (
//                 <Home className="h-8 w-8 text-sidebar-primary" />
//               ) : (
//                 <Building2 className="h-8 w-8 text-sidebar-primary" />
//               )}
//               <div className="flex flex-col">
//                 <span className="font-bold text-sidebar-foreground text-sm">Aarohan</span>
//                 <span className="text-xs text-sidebar-foreground/70">Viksit Bharat</span>
//               </div>
//             </div>
//           )}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
//             onClick={() => setSidebarOpen(false)}
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto p-4 space-y-1">
//           {navItems.map((item) => {
//             const isActive = location.pathname === item.path;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={cn(
//                   'nav-link',
//                   isActive && 'nav-link-active'
//                 )}
//               >
//                 <item.icon className="h-5 w-5 shrink-0" />
//                 {sidebarOpen && <span>{item.label}</span>}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* User Section */}
//         <div className="border-t border-sidebar-border p-4">
//           {sidebarOpen ? (
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
//                 {type === 'gram_panchayat' ? 'GP' : 'ZP'}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-sidebar-foreground truncate">
//                   Admin User
//                 </p>
//                 <p className="text-xs text-sidebar-foreground/70 truncate">
//                   {type === 'gram_panchayat' ? 'Gram Sevak' : 'District Officer'}
//                 </p>
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent">
//                     <ChevronDown className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-48">
//                   <DropdownMenuItem>
//                     <Settings className="mr-2 h-4 w-4" />
//                     Settings
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link to="/">
//                       <LogOut className="mr-2 h-4 w-4" />
//                       Logout
//                     </Link>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           ) : (
//             <div className="flex justify-center">
//               <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
//                 {type === 'gram_panchayat' ? 'GP' : 'ZP'}
//               </div>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="lg:hidden"
//               onClick={() => setSidebarOpen(true)}
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="hidden lg:flex"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//             <div>
//               <h1 className="font-semibold text-foreground">{title}</h1>
//               <p className="text-xs text-muted-foreground">{subtitle}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <Button variant="outline" size="sm" asChild>
//               <Link to={type === 'gram_panchayat' ? '/zilla-parishad' : '/gram-panchayat'}>
//                 Switch to {type === 'gram_panchayat' ? 'Zilla Parishad' : 'Gram Panchayat'}
//               </Link>
//             </Button>
//             <div className="relative">
//               <Bell className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
//               <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
//                 3
//               </span>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }





import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Bell,
  Briefcase,
  FileCheck,
  Phone,
  Settings,
  LogOut,
  Menu,
  X,
  MapPin,
  ChevronDown,
  Building2,
  Home,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DashboardLayoutProps {
  type: 'gram_panchayat' | 'zilla_parishad';
}

interface Notification {
  id: string;
  recipient: string;
  recipient_username: string;
  title: string;
  message: string;
  notification_type: 'complaint_update' | 'document_ready' | 'job_alert' | 'scheme_announcement' | 'news' | 'general';
  is_read: boolean;
  related_content_type?: string;
  related_object_id?: string;
  created_at: string;
}

const API_BASE_URL = 'http://localhost:8000/api';

const gramPanchayatNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/gram-panchayat' },
  { icon: FileText, label: 'Complaints', path: '/gram-panchayat/complaints' },
  { icon: FileCheck, label: 'Documents', path: '/gram-panchayat/documents' },
  { icon: Briefcase, label: 'Vacancies', path: '/gram-panchayat/vacancies' },
  { icon: Bell, label: 'News & Updates', path: '/gram-panchayat/news' },
  { icon: Phone, label: 'Bulk Calling', path: '/gram-panchayat/bulk-calling' },
  { icon: Users, label: 'Schemes', path: '/gram-panchayat/schemes' },
];

const zillaParishadNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/zilla-parishad' },
  { icon: FileText, label: 'Complaints', path: '/zilla-parishad/complaints' },
  { icon: FileCheck, label: 'Documents', path: '/zilla-parishad/documents' },
  { icon: Briefcase, label: 'Vacancies', path: '/zilla-parishad/vacancies' },
  { icon: Bell, label: 'News & Updates', path: '/zilla-parishad/news' },
  { icon: Users, label: 'Schemes', path: '/zilla-parishad/schemes' },
  { icon: MapPin, label: 'Regional Overview', path: '/zilla-parishad/regional' },
  { icon: Settings, label: 'Settings', path: '/zilla-parishad/settings' },
];

const getNotificationIcon = (type: string) => {
  const icons = {
    complaint_update: FileText,
    document_ready: FileCheck,
    job_alert: Briefcase,
    scheme_announcement: Users,
    news: Bell,
    general: Bell,
  };
  return icons[type as keyof typeof icons] || Bell;
};

const getNotificationColor = (type: string) => {
  const colors = {
    complaint_update: 'text-blue-500 bg-blue-500/10',
    document_ready: 'text-green-500 bg-green-500/10',
    job_alert: 'text-purple-500 bg-purple-500/10',
    scheme_announcement: 'text-orange-500 bg-orange-500/10',
    news: 'text-pink-500 bg-pink-500/10',
    general: 'text-gray-500 bg-gray-500/10',
  };
  return colors[type as keyof typeof colors] || 'text-gray-500 bg-gray-500/10';
};

export function DashboardLayout({ type }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const queryClient = useQueryClient();

  const navItems = type === 'gram_panchayat' ? gramPanchayatNavItems : zillaParishadNavItems;
  const title = type === 'gram_panchayat' ? 'Gram Panchayat Dashboard' : 'Zilla Parishad Dashboard';
  const subtitle = type === 'gram_panchayat' ? 'Baramati, Pune District' : 'Pune District, Maharashtra';

  // Fetch notifications
  const {
    data: notifications = [],
    isLoading: notificationsLoading,
  } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/notifications/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      return data.results || data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/mark_read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/notifications/mark_all_read/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to mark all as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 lg:relative',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              {type === 'gram_panchayat' ? (
                <Home className="h-8 w-8 text-sidebar-primary" />
              ) : (
                <Building2 className="h-8 w-8 text-sidebar-primary" />
              )}
              <div className="flex flex-col">
                <span className="font-bold text-sidebar-foreground text-sm">Aarohan</span>
                <span className="text-xs text-sidebar-foreground/70">Viksit Bharat</span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'nav-link',
                  isActive && 'nav-link-active'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
                {type === 'gram_panchayat' ? 'GP' : 'ZP'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  Admin User
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {type === 'gram_panchayat' ? 'Gram Sevak' : 'District Officer'}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
                {type === 'gram_panchayat' ? 'GP' : 'ZP'}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">{title}</h1>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* <Button variant="outline" size="sm" asChild>
              <Link to={type === 'gram_panchayat' ? '/zilla-parishad' : '/gram-panchayat'}>
                Switch to {type === 'gram_panchayat' ? 'Zilla Parishad' : 'Gram Panchayat'}
              </Link>
            </Button> */}

            {/* Notification Bell */}
            <Sheet open={notificationOpen} onOpenChange={setNotificationOpen}>
              <SheetTrigger asChild>
                <button className="relative">
                  <Bell className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] text-destructive-foreground flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive">{unreadCount} new</Badge>
                    )}
                  </SheetTitle>
                  <SheetDescription>
                    Stay updated with latest activities
                  </SheetDescription>
                </SheetHeader>

                {/* Actions */}
                {unreadCount > 0 && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="flex-1"
                    >
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Mark all as read
                    </Button>
                  </div>
                )}

                {/* Notifications List */}
                <ScrollArea className="h-[calc(100vh-200px)] mt-4">
                  {notificationsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : notifications && notifications.length > 0 ? (
                    <div className="space-y-2">
                      {notifications.map((notification) => {
                        const Icon = getNotificationIcon(notification.notification_type);
                        const colorClass = getNotificationColor(notification.notification_type);

                        return (
                          <div
                            key={notification.id}
                            className={cn(
                              'p-4 rounded-lg border transition-colors cursor-pointer',
                              notification.is_read
                                ? 'bg-muted/30 border-border'
                                : 'bg-primary/5 border-primary/20'
                            )}
                            onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn('p-2 rounded-lg shrink-0', colorClass)}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="text-sm font-medium">{notification.title}</h4>
                                  {!notification.is_read && (
                                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1"></div>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {notification.notification_type.replace('_', ' ')}
                                  </Badge>
                                  <span>•</span>
                                  <span>
                                    {new Date(notification.created_at).toLocaleString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
                      <p className="text-sm font-medium text-foreground">No notifications</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You're all caught up!
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}