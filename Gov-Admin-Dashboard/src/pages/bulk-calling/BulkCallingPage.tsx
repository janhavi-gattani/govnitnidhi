import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BulkCallingCampaign } from '@/data/dummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Phone,
  Plus,
  Upload,
  Play,
  Pause,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  FileAudio,
  Calendar,
  PhoneCall,
  PhoneMissed,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { createBulkCallingCampaign, fetchBulkCallingCampaigns, startBulkCallingCampaign } from '@/lib/api';

export function BulkCallingPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    message: '',
    numbers: '',
    scheduledDate: '',
    scheduledTime: '',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const {
    data: bulkCallingCampaigns = [],
    isLoading,
    isError,
  } = useQuery<BulkCallingCampaign[]>({
    queryKey: ['campaigns'],
    queryFn: fetchBulkCallingCampaigns,
  });

  const createMutation = useMutation({
    mutationFn: createBulkCallingCampaign,
    onSuccess: () => {
      toast.success('Bulk calling campaign created successfully!');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setIsCreateDialogOpen(false);
      setNewCampaign({
        name: '',
        message: '',
        numbers: '',
        scheduledDate: '',
        scheduledTime: '',
      });
      setUploadedFile(null);
    },
    onError: () => {
      toast.error('Failed to create campaign');
    },
  });

  const startMutation = useMutation({
    mutationFn: startBulkCallingCampaign,
    onSuccess: () => {
      toast.success('Campaign started');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: () => {
      toast.error('Failed to start campaign');
    },
  });

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.message) {
      toast.error('Please fill all required fields');
      return;
    }

    const phoneNumbers = newCampaign.numbers
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean);

    const scheduledDateTime =
      newCampaign.scheduledDate && newCampaign.scheduledTime
        ? new Date(`${newCampaign.scheduledDate}T${newCampaign.scheduledTime}:00`)
        : new Date();

    createMutation.mutate({
      name: newCampaign.name,
      message: newCampaign.message,
      phone_numbers: phoneNumbers,
      scheduled_at: scheduledDateTime.toISOString(),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'audio/mpeg' || file.type === 'audio/wav' || file.name.endsWith('.csv')) {
        setUploadedFile(file);
        toast.success(`File "${file.name}" uploaded successfully`);
      } else {
        toast.error('Please upload a valid audio file (MP3/WAV) or CSV file');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      scheduled: 'bg-warning/10 text-warning border-warning/20',
      in_progress: 'bg-primary/10 text-primary border-primary/20',
      completed: 'bg-success/10 text-success border-success/20',
      cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
    };

    const icons = {
      scheduled: <Clock className="h-3 w-3 mr-1" />,
      in_progress: <Play className="h-3 w-3 mr-1" />,
      completed: <CheckCircle className="h-3 w-3 mr-1" />,
      cancelled: <XCircle className="h-3 w-3 mr-1" />,
    };

    return (
      <Badge variant="outline" className={cn('capitalize', styles[status as keyof typeof styles])}>
        {icons[status as keyof typeof icons]}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bulk Calling Campaigns</h2>
          <p className="text-muted-foreground">
            Send voice messages to multiple citizens at once
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-accent" />
                Create Bulk Calling Campaign
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name *</Label>
                <Input
                  id="campaignName"
                  placeholder="e.g., Gram Sabha Reminder"
                  className="mt-2"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="message">Voice Message Text *</Label>
                <Textarea
                  id="message"
                  placeholder="Enter the message to be read out..."
                  className="mt-2"
                  rows={3}
                  value={newCampaign.message}
                  onChange={(e) => setNewCampaign({ ...newCampaign, message: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This text will be converted to speech using AI voice assistant
                </p>
              </div>
              <div>
                <Label>Or Upload Audio File</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept=".mp3,.wav"
                    className="hidden"
                    id="audioUpload"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="audioUpload" className="cursor-pointer">
                    <FileAudio className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {uploadedFile ? uploadedFile.name : 'Click to upload MP3/WAV file'}
                    </p>
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="numbers">Phone Numbers</Label>
                <Textarea
                  id="numbers"
                  placeholder="Enter phone numbers (one per line) or upload CSV"
                  className="mt-2"
                  rows={3}
                  value={newCampaign.numbers}
                  onChange={(e) => setNewCampaign({ ...newCampaign, numbers: e.target.value })}
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    id="csvUpload"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="csvUpload">
                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="h-3 w-3 mr-1" />
                        Upload CSV
                      </span>
                    </Button>
                  </label>
                  <span className="text-xs text-muted-foreground">
                    CSV should have "phone" column
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduleDate">Schedule Date</Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    className="mt-2"
                    value={newCampaign.scheduledDate}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, scheduledDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="scheduleTime">Schedule Time</Label>
                  <Input
                    id="scheduleTime"
                    type="time"
                    className="mt-2"
                    value={newCampaign.scheduledTime}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, scheduledTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-accent" />
                  <span className="font-medium">IVR Voice System</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Messages will be delivered via automated voice calls using AI text-to-speech.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign} className="bg-accent hover:bg-accent/90">
                <Phone className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Campaigns</p>
          <p className="text-2xl font-bold mt-1">{bulkCallingCampaigns.length}</p>
        </div>
        <div className="stat-card bg-success/5 border-success/20">
          <p className="text-sm text-muted-foreground">Completed Calls</p>
          <p className="text-2xl font-bold mt-1 text-success">
            {bulkCallingCampaigns.reduce((sum, c) => sum + c.completedCalls, 0)}
          </p>
        </div>
        <div className="stat-card bg-destructive/5 border-destructive/20">
          <p className="text-sm text-muted-foreground">Failed Calls</p>
          <p className="text-2xl font-bold mt-1 text-destructive">
            {bulkCallingCampaigns.reduce((sum, c) => sum + c.failedCalls, 0)}
          </p>
        </div>
        <div className="stat-card bg-warning/5 border-warning/20">
          <p className="text-sm text-muted-foreground">Scheduled</p>
          <p className="text-2xl font-bold mt-1 text-warning">
            {bulkCallingCampaigns.filter((c) => c.status === 'scheduled').length}
          </p>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading campaigns...</p>
        )}
        {isError && (
          <p className="text-sm text-destructive">Failed to load campaigns from the server.</p>
        )}
        {bulkCallingCampaigns.map((campaign) => {
          const totalCalls = campaign.completedCalls + campaign.failedCalls;
          const successRate = totalCalls > 0 
            ? Math.round((campaign.completedCalls / totalCalls) * 100) 
            : 0;

          return (
            <div key={campaign.id} className="dashboard-section hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-accent/10 shrink-0">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">"{campaign.message}"</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {campaign.targetNumbers.length} recipients
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {campaign.scheduledAt.toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <span>By: {campaign.createdBy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-72 shrink-0">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Call Progress</span>
                      <span className="text-sm text-muted-foreground">{successRate}% success</span>
                    </div>
                    <Progress
                      value={successRate}
                      className="h-2"
                      indicatorClassName={successRate > 80 ? 'bg-success' : successRate > 50 ? 'bg-warning' : 'bg-destructive'}
                    />
                    <div className="flex items-center justify-between mt-3 text-xs">
                      <div className="flex items-center gap-1 text-success">
                        <PhoneCall className="h-3 w-3" />
                        {campaign.completedCalls} completed
                      </div>
                      <div className="flex items-center gap-1 text-destructive">
                        <PhoneMissed className="h-3 w-3" />
                        {campaign.failedCalls} failed
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    {campaign.status === 'scheduled' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => startMutation.mutate(campaign.id)}
                          disabled={startMutation.isPending}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          {startMutation.isPending ? 'Starting...' : 'Start Now'}
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {campaign.status === 'in_progress' && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    )}
                    {campaign.status === 'completed' && (
                      <Button variant="outline" size="sm" className="flex-1">
                        View Report
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {bulkCallingCampaigns.length === 0 && (
        <div className="text-center py-12 text-muted-foreground dashboard-section">
          No campaigns created yet. Create your first bulk calling campaign.
        </div>
      )}
    </div>
  );
}
