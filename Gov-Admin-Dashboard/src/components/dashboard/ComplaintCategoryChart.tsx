import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { complaintCategories, Complaint } from '@/data/dummyData';
import { Progress } from '@/components/ui/progress';
import { fetchComplaints } from '@/lib/api';

interface ComplaintCategoryChartProps {
  isUrban?: boolean;
}

export function ComplaintCategoryChart({ isUrban }: ComplaintCategoryChartProps) {
  const {
    data: complaints = [],
  } = useQuery<Complaint[]>({
    queryKey: ['complaints'],
    queryFn: fetchComplaints,
  });

  const categoryData = useMemo(() => {
    const filteredComplaints =
      isUrban !== undefined ? complaints.filter((c) => c.isUrban === isUrban) : complaints;

    const counts: Record<string, number> = {};
    filteredComplaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });

    const total = filteredComplaints.length || 1;
    return complaintCategories
      .map((cat) => ({
        ...cat,
        count: counts[cat.id] || 0,
        percentage: Math.round(((counts[cat.id] || 0) / total) * 100),
      }))
      .filter((cat) => cat.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [isUrban]);

  const colors = [
    'bg-primary',
    'bg-accent',
    'bg-success',
    'bg-warning',
    'bg-destructive',
    'bg-navy-light',
    'bg-forest',
    'bg-muted-foreground',
  ];

  return (
    <div className="dashboard-section">
      <h3 className="text-lg font-semibold mb-4">Complaints by Category</h3>
      <div className="space-y-4">
        {categoryData.map((cat, index) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-foreground">{cat.label}</span>
              <span className="text-sm text-muted-foreground">{cat.count} ({cat.percentage}%)</span>
            </div>
            <Progress 
              value={cat.percentage} 
              className="h-2"
              indicatorClassName={colors[index % colors.length]}
            />
          </div>
        ))}
        {categoryData.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No complaints data available</p>
        )}
      </div>
    </div>
  );
}
