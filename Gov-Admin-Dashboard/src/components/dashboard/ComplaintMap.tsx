import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Complaint, Location } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { fetchComplaints } from '@/lib/api';

interface ComplaintMapProps {
  filterType?: 'all' | 'urban' | 'rural';
}

export function ComplaintMap({ filterType = 'all' }: ComplaintMapProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const {
    data: complaints = [],
    isLoading,
    isError,
  } = useQuery<Complaint[]>({
    queryKey: ['complaints'],
    queryFn: fetchComplaints,
  });

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (filterType === 'urban') return c.isUrban;
      if (filterType === 'rural') return !c.isUrban;
      return true;
    });
  }, [filterType]);

  const getMarkerColor = (complaint: Complaint) => {
    const daysSinceCreated = Math.floor(
      (new Date().getTime() - complaint.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (complaint.status === 'resolved') return 'bg-success';
    if (daysSinceCreated > 14 || complaint.priority === 'critical') return 'bg-destructive animate-pulse';
    if (daysSinceCreated > 7 || complaint.priority === 'high') return 'bg-warning';
    return 'bg-primary';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'escalated':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  // Pune district approximate bounds for positioning
  const mapBounds = {
    minLat: 18.0,
    maxLat: 19.3,
    minLng: 73.3,
    maxLng: 75.2,
  };

  const getPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const labelLocations: Location[] = useMemo(() => {
    const map: Record<string, Location> = {};
    complaints.forEach((c) => {
      map[c.location.id] = c.location;
    });
    return Object.values(map).slice(0, 6);
  }, [complaints]);
  if (isLoading) {
    return (
      <div className="dashboard-section">
        <p className="text-muted-foreground">Loading complaint map...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-section">
        <p className="text-destructive">Failed to load complaints for the map.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Complaint Distribution Map</h3>
          <p className="text-sm text-muted-foreground">Pune District, Maharashtra</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
            <span>Critical (&gt;14 days)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span>High (&gt;7 days)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span>Resolved</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-muted/50 to-muted rounded-xl h-[400px] overflow-hidden border border-border">
        {/* Map background with grid */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-foreground" />
          </svg>
        </div>

        {/* District outline approximation */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 20 15 Q 35 10, 55 12 Q 75 15, 85 25 Q 90 40, 88 55 Q 85 70, 75 82 Q 60 90, 45 88 Q 30 85, 20 75 Q 12 60, 15 45 Q 15 30, 20 15"
            fill="hsl(var(--primary) / 0.05)"
            stroke="hsl(var(--primary) / 0.3)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Location labels (derived from API complaints data) */}
        {labelLocations.map((loc) => {
          const pos = getPosition(loc.lat, loc.lng);
          return (
            <div
              key={loc.id}
              className="absolute text-[10px] text-muted-foreground font-medium"
              style={{ left: `${pos.x}%`, top: `${pos.y + 3}%` }}
            >
              {loc.name}
            </div>
          );
        })}

        {/* Complaint markers */}
        {filteredComplaints.map((complaint) => {
          const pos = getPosition(complaint.location.lat, complaint.location.lng);
          return (
            <button
              key={complaint.id}
              className={cn(
                'map-marker',
                getMarkerColor(complaint),
                selectedComplaint?.id === complaint.id && 'ring-4 ring-primary/30 scale-150 z-10'
              )}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => setSelectedComplaint(complaint)}
              title={complaint.title}
            />
          );
        })}

        {/* Selected complaint popup */}
        {selectedComplaint && (
          <Card
            className="absolute z-20 w-72 p-4 shadow-lg animate-fade-in"
            style={{
              left: `${Math.min(getPosition(selectedComplaint.location.lat, selectedComplaint.location.lng).x, 60)}%`,
              top: `${Math.min(getPosition(selectedComplaint.location.lat, selectedComplaint.location.lng).y + 5, 60)}%`,
            }}
          >
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedComplaint(null)}
            >
              ×
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    selectedComplaint.status === 'resolved' && 'border-success text-success',
                    selectedComplaint.status === 'pending' && 'border-warning text-warning',
                    selectedComplaint.status === 'in_progress' && 'border-primary text-primary',
                    selectedComplaint.status === 'escalated' && 'border-destructive text-destructive'
                  )}
                >
                  {getStatusIcon(selectedComplaint.status)}
                  <span className="ml-1 capitalize">{selectedComplaint.status.replace('_', ' ')}</span>
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {selectedComplaint.ticketNumber}
                </Badge>
              </div>
              <h4 className="font-semibold text-sm">{selectedComplaint.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{selectedComplaint.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {selectedComplaint.location.name}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered: {selectedComplaint.createdAt.toLocaleDateString('en-IN')}
              </p>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold text-foreground">{filteredComplaints.length}</p>
          <p className="text-xs text-muted-foreground">Total Complaints</p>
        </div>
        <div className="p-3 bg-destructive/5 rounded-lg">
          <p className="text-2xl font-bold text-destructive">
            {filteredComplaints.filter((c) => c.status === 'pending' || c.status === 'escalated').length}
          </p>
          <p className="text-xs text-muted-foreground">Pending/Escalated</p>
        </div>
        <div className="p-3 bg-warning/5 rounded-lg">
          <p className="text-2xl font-bold text-warning">
            {filteredComplaints.filter((c) => c.status === 'in_progress').length}
          </p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div className="p-3 bg-success/5 rounded-lg">
          <p className="text-2xl font-bold text-success">
            {filteredComplaints.filter((c) => c.status === 'resolved').length}
          </p>
          <p className="text-xs text-muted-foreground">Resolved</p>
        </div>
      </div>
    </div>
  );
}
