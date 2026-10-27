import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ComplaintMap } from '@/components/dashboard/ComplaintMap';
import { Progress } from '@/components/ui/progress';
import { Complaint } from '@/data/dummyData';
import { fetchComplaints } from '@/lib/api';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function RegionalOverview() {
  const [selectedTaluka, setSelectedTaluka] = useState<string>('all');

  const {
    data: complaints = [],
    isLoading,
    isError,
  } = useQuery<Complaint[]>({
    queryKey: ['complaints'],
    queryFn: fetchComplaints,
  });

  const talukas = useMemo(
    () =>
      Object.values(
        complaints.reduce<
          Record<string, { name: string; complaints: number; resolved: number; pending: number; escalated: number }>
        >((acc, c) => {
          const key = c.location.name;
          if (!acc[key]) {
            acc[key] = { name: key, complaints: 0, resolved: 0, pending: 0, escalated: 0 };
          }
          acc[key].complaints += 1;
          if (c.status === 'resolved') acc[key].resolved += 1;
          else if (c.status === 'pending') acc[key].pending += 1;
          else if (c.status === 'escalated') acc[key].escalated += 1;
          return acc;
        }, {}),
      ).sort((a, b) => b.complaints - a.complaints),
    [complaints],
  );

  const totalStats = talukas.reduce(
    (acc, t) => ({
      complaints: acc.complaints + t.complaints,
      resolved: acc.resolved + t.resolved,
      pending: acc.pending + t.pending,
      escalated: acc.escalated + t.escalated,
    }),
    { complaints: 0, resolved: 0, pending: 0, escalated: 0 }
  );

  const selectedData = selectedTaluka === 'all' 
    ? totalStats 
    : talukas.find(t => t.name === selectedTaluka) || totalStats;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Regional Overview</h2>
          <p className="text-muted-foreground">
            Area-wise performance and complaint analysis (live complaints data)
          </p>
        </div>
        <Select value={selectedTaluka} onValueChange={setSelectedTaluka}>
          <SelectTrigger className="w-[200px]">
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select Taluka" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {talukas.map((t) => (
              <SelectItem key={t.name} value={t.name}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Complaints</p>
              <p className="text-3xl font-bold mt-1">{selectedData.complaints}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card bg-success/5 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-3xl font-bold mt-1 text-success">{selectedData.resolved}</p>
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {Math.round((selectedData.resolved / selectedData.complaints) * 100)}% rate
              </p>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>
        <div className="stat-card bg-warning/5 border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold mt-1 text-warning">{selectedData.pending}</p>
            </div>
            <div className="p-3 rounded-xl bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
          </div>
        </div>
        <div className="stat-card bg-destructive/5 border-destructive/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Escalated</p>
              <p className="text-3xl font-bold mt-1 text-destructive">{selectedData.escalated}</p>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10">
              <TrendingDown className="h-6 w-6 text-destructive" />
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <ComplaintMap filterType="all" />

      {/* Taluka Performance Table */}
      <div className="dashboard-section">
        <h3 className="text-lg font-semibold mb-4">Taluka Performance Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-4 px-4 text-sm font-semibold">Taluka</th>
                <th className="text-left py-4 px-4 text-sm font-semibold">Total</th>
                <th className="text-left py-4 px-4 text-sm font-semibold">Resolved</th>
                <th className="text-left py-4 px-4 text-sm font-semibold">Pending</th>
                <th className="text-left py-4 px-4 text-sm font-semibold">Escalated</th>
                <th className="text-left py-4 px-4 text-sm font-semibold">Resolution Rate</th>
                <th className="text-left py-4 px-4 text-sm font-semibold">Performance</th>
              </tr>
            </thead>
            <tbody>
              {talukas.map((taluka) => {
                const resolutionRate = Math.round((taluka.resolved / taluka.complaints) * 100);
                const performance = resolutionRate >= 80 ? 'excellent' : resolutionRate >= 60 ? 'good' : 'needs_improvement';

                return (
                  <tr
                    key={taluka.name}
                    className={cn(
                      'border-b border-border/50 hover:bg-muted/30 transition-colors',
                      selectedTaluka === taluka.name && 'bg-accent/5'
                    )}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{taluka.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{taluka.complaints}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-success font-medium">{taluka.resolved}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-warning font-medium">{taluka.pending}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-destructive font-medium">{taluka.escalated}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={resolutionRate}
                          className="h-2 w-20"
                          indicatorClassName={
                            resolutionRate >= 80 ? 'bg-success' :
                            resolutionRate >= 60 ? 'bg-warning' : 'bg-destructive'
                          }
                        />
                        <span className="text-sm font-medium">{resolutionRate}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={cn(
                          'capitalize',
                          performance === 'excellent' && 'bg-success/10 text-success',
                          performance === 'good' && 'bg-warning/10 text-warning',
                          performance === 'needs_improvement' && 'bg-destructive/10 text-destructive'
                        )}
                      >
                        {performance.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="dashboard-section">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Critical Areas
          </h4>
          <div className="space-y-2">
            {talukas
              .filter(t => (t.resolved / t.complaints) < 0.7)
              .slice(0, 3)
              .map(t => (
                <div key={t.name} className="flex items-center justify-between p-2 bg-destructive/5 rounded-lg">
                  <span className="text-sm font-medium">{t.name}</span>
                  <Badge variant="destructive" className="text-xs">
                    {Math.round((t.resolved / t.complaints) * 100)}% resolved
                  </Badge>
                </div>
              ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Top Performers
          </h4>
          <div className="space-y-2">
            {talukas
              .sort((a, b) => (b.resolved / b.complaints) - (a.resolved / a.complaints))
              .slice(0, 3)
              .map(t => (
                <div key={t.name} className="flex items-center justify-between p-2 bg-success/5 rounded-lg">
                  <span className="text-sm font-medium">{t.name}</span>
                  <Badge className="bg-success text-success-foreground text-xs">
                    {Math.round((t.resolved / t.complaints) * 100)}% resolved
                  </Badge>
                </div>
              ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            High Volume Areas
          </h4>
          <div className="space-y-2">
            {talukas
              .sort((a, b) => b.complaints - a.complaints)
              .slice(0, 3)
              .map(t => (
                <div key={t.name} className="flex items-center justify-between p-2 bg-primary/5 rounded-lg">
                  <span className="text-sm font-medium">{t.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {t.complaints} complaints
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
