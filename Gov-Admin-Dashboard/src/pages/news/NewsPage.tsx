// import { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { NewsItem } from '@/data/dummyData';
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
//   Search,
//   Plus,
//   Bell,
//   AlertTriangle,
//   Info,
//   Calendar,
//   Users,
//   Megaphone,
//   Construction,
//   PartyPopper,
//   Edit,
//   Trash2,
//   Eye,
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { fetchNews } from '@/lib/api';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createNewsItem } from '@/lib/api';
// import { deleteNewsItem } from '@/lib/api';



// interface NewsPageProps {
//   type: 'gram_panchayat' | 'zilla_parishad';
// }

// export function NewsPage({ type }: NewsPageProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState<string>('all');
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [newNews, setNewNews] = useState({
//     title: '',
//     content: '',
//     category: 'announcement' as NewsItem['category'],
//     priority: 'normal' as NewsItem['priority'],
//     targetAudience: 'all' as NewsItem['targetAudience'],
//   });

// //me********************************************************

//   const queryClient = useQueryClient();
//   const createMutation = useMutation({
//     mutationFn: createNewsItem,
//     onSuccess: (data) => {
//       console.log('News created successfully:', data);
//       queryClient.invalidateQueries({ queryKey: ['news'] });
//       toast.success('News published successfully!');
//       setIsCreateDialogOpen(false);
//       setNewNews({
//         title: '',
//         content: '',
//         category: 'announcement',
//         priority: 'normal',
//         targetAudience: 'all',
//       });
//     },
//     onError: (error: Error) => {
//       console.error('Failed to create news:', error);
//       toast.error(`Failed to publish news: ${error.message}`);
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: deleteNewsItem,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['news'] });
//       toast.success('News deleted successfully!');
//     },
//     onError: (error: Error) => {
//       toast.error(`Failed to delete news: ${error.message}`);
//     },
//   });
  
//   // Add this handler function
//   const handleDelete = (newsId: string, newsTitle: string) => {
//     if (window.confirm(`Are you sure you want to delete "${newsTitle}"?`)) {
//       deleteMutation.mutate(newsId);
//     }
//   };

  
  
//   const {
//     data: newsItems = [],
//     isLoading,
//     isError,
//   } = useQuery<NewsItem[]>({
//     queryKey: ['news'],
//     queryFn: fetchNews,
//   });

//   const filteredNews = newsItems.filter((news) => {
//     const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = categoryFilter === 'all' || news.category === categoryFilter;
//     return matchesSearch && matchesCategory;
//   });

//   // const handlePublish = () => {
//   //   if (!newNews.title || !newNews.content) {
//   //     toast.error('Please fill all required fields');
//   //     return;
//   //   }
//   //   toast.success('News published successfully!');
//   //   setIsCreateDialogOpen(false);
//   //   setNewNews({
//   //     title: '',
//   //     content: '',
//   //     category: 'announcement',
//   //     priority: 'normal',
//   //     targetAudience: 'all',
//   //   });
//   // };
//   const handlePublish = () => {
//     console.log('handlePublish called'); // Debug
    
//     if (!newNews.title || !newNews.content) {
//       toast.error('Please fill all required fields');
//       return;
//     }
  
//     const payload = {
//       title: newNews.title,
//       content: newNews.content,
//       category: newNews.category,
//       priority: newNews.priority,
//       target_audience: newNews.targetAudience,
//     };
    
//     console.log('Mutation payload:', payload); // Debug
//     console.log('Mutation status:', createMutation.status); // Debug
    
//     createMutation.mutate(payload);
//   };
  
  
//   const getCategoryIcon = (category: string) => {
//     const icons = {
//       announcement: Megaphone,
//       scheme: Users,
//       event: PartyPopper,
//       alert: AlertTriangle,
//       development: Construction,
//     };
//     const Icon = icons[category as keyof typeof icons] || Bell;
//     return <Icon className="h-5 w-5" />;
//   };

//   const getPriorityStyles = (priority: string) => {
//     const styles = {
//       urgent: 'border-l-destructive bg-destructive/5',
//       important: 'border-l-warning bg-warning/5',
//       normal: 'border-l-muted-foreground bg-muted/30',
//     };
//     return styles[priority as keyof typeof styles] || styles.normal;
//   };

//   const getCategoryBadge = (category: string) => {
//     const styles = {
//       announcement: 'bg-primary/10 text-primary',
//       scheme: 'bg-success/10 text-success',
//       event: 'bg-accent/10 text-accent',
//       alert: 'bg-destructive/10 text-destructive',
//       development: 'bg-navy-light/10 text-navy-light',
//     };
//     return (
//       <Badge className={cn('capitalize', styles[category as keyof typeof styles])}>
//         {category}
//       </Badge>
//     );
//   };

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">News & Announcements</h2>
//           <p className="text-muted-foreground">
//             Publish updates and announcements for citizens
//           </p>
//         </div>
//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="bg-accent hover:bg-accent/90">
//               <Plus className="h-4 w-4 mr-2" />
//               Publish New
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-lg">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Megaphone className="h-5 w-5 text-accent" />
//                 Publish News / Announcement
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <div>
//                 <Label htmlFor="newsTitle">Title *</Label>
//                 <Input
//                   id="newsTitle"
//                   placeholder="Enter news title"
//                   className="mt-2"
//                   value={newNews.title}
//                   onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="newsContent">Content *</Label>
//                 <Textarea
//                   id="newsContent"
//                   placeholder="Enter detailed content..."
//                   className="mt-2"
//                   rows={4}
//                   value={newNews.content}
//                   onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label>Category</Label>
//                   <Select
//                     value={newNews.category}
//                     onValueChange={(value) =>
//                       setNewNews({ ...newNews, category: value as NewsItem['category'] })
//                     }
//                   >
//                     <SelectTrigger className="mt-2">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="announcement">Announcement</SelectItem>
//                       <SelectItem value="scheme">Scheme</SelectItem>
//                       <SelectItem value="event">Event</SelectItem>
//                       <SelectItem value="alert">Alert</SelectItem>
//                       <SelectItem value="development">Development</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label>Priority</Label>
//                   <Select
//                     value={newNews.priority}
//                     onValueChange={(value) =>
//                       setNewNews({ ...newNews, priority: value as NewsItem['priority'] })
//                     }
//                   >
//                     <SelectTrigger className="mt-2">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="normal">Normal</SelectItem>
//                       <SelectItem value="important">Important</SelectItem>
//                       <SelectItem value="urgent">Urgent</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div>
//                 <Label>Target Audience</Label>
//                 <Select
//                   value={newNews.targetAudience}
//                   onValueChange={(value) =>
//                     setNewNews({ ...newNews, targetAudience: value as NewsItem['targetAudience'] })
//                   }
//                 >
//                   <SelectTrigger className="mt-2">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Citizens</SelectItem>
//                     <SelectItem value="gram_panchayat">Rural Areas Only</SelectItem>
//                     <SelectItem value="urban">Urban Areas Only</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handlePublish} disabled={createMutation.isPending}
//  className="bg-accent hover:bg-accent/90">
//                 <Megaphone className="h-4 w-4 mr-2" />
//                 {createMutation.isPending ? 'Publishing...' : 'Publish'}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//         <div className="stat-card">
//           <p className="text-sm text-muted-foreground">Total Published</p>
//           <p className="text-2xl font-bold mt-1">{newsItems.length}</p>
//         </div>
//         <div className="stat-card bg-destructive/5 border-destructive/20">
//           <p className="text-sm text-muted-foreground">Urgent Alerts</p>
//           <p className="text-2xl font-bold mt-1 text-destructive">
//             {newsItems.filter((n) => n.priority === 'urgent').length}
//           </p>
//         </div>
//         <div className="stat-card bg-success/5 border-success/20">
//           <p className="text-sm text-muted-foreground">Schemes</p>
//           <p className="text-2xl font-bold mt-1 text-success">
//             {newsItems.filter((n) => n.category === 'scheme').length}
//           </p>
//         </div>
//         <div className="stat-card bg-accent/5 border-accent/20">
//           <p className="text-sm text-muted-foreground">Events</p>
//           <p className="text-2xl font-bold mt-1 text-accent">
//             {newsItems.filter((n) => n.category === 'event').length}
//           </p>
//         </div>
//         <div className="stat-card">
//           <p className="text-sm text-muted-foreground">Announcements</p>
//           <p className="text-2xl font-bold mt-1">
//             {newsItems.filter((n) => n.category === 'announcement').length}
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
//                 placeholder="Search news..."
//                 className="pl-10"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//           <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               <SelectItem value="announcement">Announcements</SelectItem>
//               <SelectItem value="scheme">Schemes</SelectItem>
//               <SelectItem value="event">Events</SelectItem>
//               <SelectItem value="alert">Alerts</SelectItem>
//               <SelectItem value="development">Development</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* News List */}
//       <div className="space-y-4">
//         {isLoading && (
//           <p className="text-sm text-muted-foreground">Loading news...</p>
//         )}
//         {isError && (
//           <p className="text-sm text-destructive">Failed to load news from the server.</p>
//         )}
//         {filteredNews.map((news) => (
//           <div
//             key={news.id}
//             className={cn(
//               'dashboard-section border-l-4 hover:shadow-md transition-shadow',
//               getPriorityStyles(news.priority)
//             )}
//           >
//             <div className="flex items-start gap-4">
//               <div
//                 className={cn(
//                   'p-3 rounded-xl shrink-0',
//                   news.category === 'alert' ? 'bg-destructive/10 text-destructive' :
//                   news.category === 'scheme' ? 'bg-success/10 text-success' :
//                   news.category === 'event' ? 'bg-accent/10 text-accent' :
//                   'bg-primary/10 text-primary'
//                 )}
//               >
//                 {getCategoryIcon(news.category)}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-3 mb-2 flex-wrap">
//                   {getCategoryBadge(news.category)}
//                   {news.priority !== 'normal' && (
//                     <Badge
//                       variant={news.priority === 'urgent' ? 'destructive' : 'secondary'}
//                       className="uppercase text-xs"
//                     >
//                       {news.priority}
//                     </Badge>
//                   )}
//                   <Badge variant="outline" className="text-xs capitalize">
//                     {news.targetAudience === 'all' ? 'All Citizens' :
//                      news.targetAudience === 'gram_panchayat' ? 'Rural' : 'Urban'}
//                   </Badge>
//                 </div>
//                 <h3 className="font-semibold text-lg">{news.title}</h3>
//                 <p className="text-sm text-muted-foreground mt-2">{news.content}</p>
//                 <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
//                   <div className="flex items-center gap-1">
//                     <Calendar className="h-3 w-3" />
//                     {news.publishedAt.toLocaleDateString('en-IN', {
//                       day: 'numeric',
//                       month: 'short',
//                       year: 'numeric',
//                     })}
//                   </div>
//                   <span>•</span>
//                   <span>{news.publishedBy}</span>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-2 shrink-0">
//                 <Button variant="ghost" size="icon">
//                   <Eye className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon">
//                   <Edit className="h-4 w-4" />
//                 </Button>
//                 <Button variant="ghost" size="icon"  onClick={() => handleDelete(news.id, news.title)}
//   disabled={deleteMutation.isPending}
//   >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredNews.length === 0 && (
//         <div className="text-center py-12 text-muted-foreground dashboard-section">
//           No news found matching your criteria
//         </div>
//       )}
//     </div>
//   );
// }




import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NewsItem } from '@/data/dummyData';
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
  Search,
  Plus,
  Bell,
  AlertTriangle,
  Info,
  Calendar,
  Users,
  Megaphone,
  Construction,
  PartyPopper,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { fetchNews, createNewsItem, deleteNewsItem, updateNewsItem } from '@/lib/api';

interface NewsPageProps {
  type: 'gram_panchayat' | 'zilla_parishad';
}

export function NewsPage({ type }: NewsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    category: 'announcement' as NewsItem['category'],
    priority: 'normal' as NewsItem['priority'],
    targetAudience: 'all' as NewsItem['targetAudience'],
  });

  const queryClient = useQueryClient();

  // Fetch news items
  const {
    data: newsItems = [],
    isLoading,
    isError,
  } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: fetchNews,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createNewsItem,
    onSuccess: (data) => {
      console.log('News created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('News published successfully!');
      setIsCreateDialogOpen(false);
      setNewNews({
        title: '',
        content: '',
        category: 'announcement',
        priority: 'normal',
        targetAudience: 'all',
      });
    },
    onError: (error: Error) => {
      console.error('Failed to create news:', error);
      toast.error(`Failed to publish news: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NewsItem> }) => {
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
        let errorMessage = 'Failed to update news';
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
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('News updated successfully!');
      setIsEditDialogOpen(false);
      setSelectedNews(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update news: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteNewsItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('News deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete news: ${error.message}`);
    },
  });

  const handlePublish = () => {
    if (!newNews.title || !newNews.content) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      title: newNews.title,
      content: newNews.content,
      category: newNews.category,
      priority: newNews.priority,
      target_audience: newNews.targetAudience,
    };

    createMutation.mutate(payload);
  };

  const handleUpdate = () => {
    if (!selectedNews) return;
    
    if (!selectedNews.title || !selectedNews.content) {
      toast.error('Please fill all required fields');
      return;
    }

    updateMutation.mutate({
      id: selectedNews.id,
      data: selectedNews,
    });
  };

  const handleDelete = (newsId: string, newsTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${newsTitle}"?`)) {
      deleteMutation.mutate(newsId);
    }
  };

  const handleViewNews = (news: NewsItem) => {
    setSelectedNews(news);
    setIsViewDialogOpen(true);
  };

  const handleEditNews = (news: NewsItem) => {
    setSelectedNews(news);
    setIsEditDialogOpen(true);
  };

  const filteredNews = newsItems.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || news.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    const icons = {
      announcement: Megaphone,
      scheme: Users,
      event: PartyPopper,
      alert: AlertTriangle,
      development: Construction,
    };
    const Icon = icons[category as keyof typeof icons] || Bell;
    return <Icon className="h-5 w-5" />;
  };

  const getPriorityStyles = (priority: string) => {
    const styles = {
      urgent: 'border-l-destructive bg-destructive/5',
      important: 'border-l-warning bg-warning/5',
      normal: 'border-l-muted-foreground bg-muted/30',
    };
    return styles[priority as keyof typeof styles] || styles.normal;
  };

  const getCategoryBadge = (category: string) => {
    const styles = {
      announcement: 'bg-primary/10 text-primary',
      scheme: 'bg-success/10 text-success',
      event: 'bg-accent/10 text-accent',
      alert: 'bg-destructive/10 text-destructive',
      development: 'bg-navy-light/10 text-navy-light',
    };
    return (
      <Badge className={cn('capitalize', styles[category as keyof typeof styles])}>
        {category}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">News & Announcements</h2>
          <p className="text-muted-foreground">
            Publish updates and announcements for citizens
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Publish New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-accent" />
                Publish News / Announcement
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="newsTitle">Title *</Label>
                <Input
                  id="newsTitle"
                  placeholder="Enter news title"
                  className="mt-2"
                  value={newNews.title}
                  onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="newsContent">Content *</Label>
                <Textarea
                  id="newsContent"
                  placeholder="Enter detailed content..."
                  className="mt-2"
                  rows={4}
                  value={newNews.content}
                  onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newNews.category}
                    onValueChange={(value) =>
                      setNewNews({ ...newNews, category: value as NewsItem['category'] })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="scheme">Scheme</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={newNews.priority}
                    onValueChange={(value) =>
                      setNewNews({ ...newNews, priority: value as NewsItem['priority'] })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Target Audience</Label>
                <Select
                  value={newNews.targetAudience}
                  onValueChange={(value) =>
                    setNewNews({ ...newNews, targetAudience: value as NewsItem['targetAudience'] })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Citizens</SelectItem>
                    <SelectItem value="gram_panchayat">Rural Areas Only</SelectItem>
                    <SelectItem value="urban">Urban Areas Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handlePublish}
                disabled={createMutation.isPending}
                className="bg-accent hover:bg-accent/90"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Megaphone className="h-4 w-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Published</p>
          <p className="text-2xl font-bold mt-1">{newsItems.length}</p>
        </div>
        <div className="stat-card bg-destructive/5 border-destructive/20">
          <p className="text-sm text-muted-foreground">Urgent Alerts</p>
          <p className="text-2xl font-bold mt-1 text-destructive">
            {newsItems.filter((n) => n.priority === 'urgent').length}
          </p>
        </div>
        <div className="stat-card bg-success/5 border-success/20">
          <p className="text-sm text-muted-foreground">Schemes</p>
          <p className="text-2xl font-bold mt-1 text-success">
            {newsItems.filter((n) => n.category === 'scheme').length}
          </p>
        </div>
        <div className="stat-card bg-accent/5 border-accent/20">
          <p className="text-sm text-muted-foreground">Events</p>
          <p className="text-2xl font-bold mt-1 text-accent">
            {newsItems.filter((n) => n.category === 'event').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Announcements</p>
          <p className="text-2xl font-bold mt-1">
            {newsItems.filter((n) => n.category === 'announcement').length}
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
                placeholder="Search news..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="announcement">Announcements</SelectItem>
              <SelectItem value="scheme">Schemes</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="alert">Alerts</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">Loading news...</p>
          </div>
        )}
        {isError && (
          <p className="text-sm text-destructive text-center py-8">
            Failed to load news from the server.
          </p>
        )}
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className={cn(
              'dashboard-section border-l-4 hover:shadow-md transition-shadow',
              getPriorityStyles(news.priority)
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'p-3 rounded-xl shrink-0',
                  news.category === 'alert' ? 'bg-destructive/10 text-destructive' :
                  news.category === 'scheme' ? 'bg-success/10 text-success' :
                  news.category === 'event' ? 'bg-accent/10 text-accent' :
                  'bg-primary/10 text-primary'
                )}
              >
                {getCategoryIcon(news.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {getCategoryBadge(news.category)}
                  {news.priority !== 'normal' && (
                    <Badge
                      variant={news.priority === 'urgent' ? 'destructive' : 'secondary'}
                      className="uppercase text-xs"
                    >
                      {news.priority}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs capitalize">
                    {news.targetAudience === 'all' ? 'All Citizens' :
                     news.targetAudience === 'gram_panchayat' ? 'Rural' : 'Urban'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg">{news.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{news.content}</p>
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {news.publishedAt.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <span>•</span>
                  <span>{news.publishedBy}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleViewNews(news)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEditNews(news)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(news.id, news.title)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground dashboard-section">
          No news found matching your criteria
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-accent" />
              News Details
            </DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-6 py-4">
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  {getCategoryBadge(selectedNews.category)}
                  {selectedNews.priority !== 'normal' && (
                    <Badge
                      variant={selectedNews.priority === 'urgent' ? 'destructive' : 'secondary'}
                      className="uppercase text-xs"
                    >
                      {selectedNews.priority}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs capitalize">
                    {selectedNews.targetAudience === 'all' ? 'All Citizens' :
                     selectedNews.targetAudience === 'gram_panchayat' ? 'Rural' : 'Urban'}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2">{selectedNews.title}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Published: {selectedNews.publishedAt.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                  <span>•</span>
                  <span>By: {selectedNews.publishedBy}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Content</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedNews.content}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium capitalize">{selectedNews.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <p className="text-sm font-medium capitalize">{selectedNews.priority}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Target Audience</p>
                  <p className="text-sm font-medium capitalize">
                    {selectedNews.targetAudience === 'all' ? 'All Citizens' :
                     selectedNews.targetAudience === 'gram_panchayat' ? 'Rural Areas' : 'Urban Areas'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="text-sm font-medium">{selectedNews.views_count || 0}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false);
                if (selectedNews) handleEditNews(selectedNews);
              }}
              className="bg-accent hover:bg-accent/90"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
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
              Edit News / Announcement
            </DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  placeholder="Enter news title"
                  className="mt-2"
                  value={selectedNews.title}
                  onChange={(e) => setSelectedNews({ ...selectedNews, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Content *</Label>
                <Textarea
                  id="edit-content"
                  placeholder="Enter detailed content..."
                  className="mt-2"
                  rows={4}
                  value={selectedNews.content}
                  onChange={(e) => setSelectedNews({ ...selectedNews, content: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={selectedNews.category}
                    onValueChange={(value) =>
                      setSelectedNews({ ...selectedNews, category: value as NewsItem['category'] })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="scheme">Scheme</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select
                    value={selectedNews.priority}
                    onValueChange={(value) =>
                      setSelectedNews({ ...selectedNews, priority: value as NewsItem['priority'] })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Target Audience</Label>
                <Select
                  value={selectedNews.targetAudience}
                  onValueChange={(value) =>
                    setSelectedNews({ ...selectedNews, targetAudience: value as NewsItem['targetAudience'] })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Citizens</SelectItem>
                    <SelectItem value="gram_panchayat">Rural Areas Only</SelectItem>
                    <SelectItem value="urban">Urban Areas Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="bg-accent hover:bg-accent/90"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}