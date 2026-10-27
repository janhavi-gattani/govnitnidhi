import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentTypes, IssuedDocument, DocumentType } from '@/data/dummyData';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search,
  Plus,
  FileCheck,
  Shield,
  Eye,
  Copy,
  QrCode,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { fetchIssuedDocuments } from '@/lib/api';

interface DocumentsPageProps {
  type: 'gram_panchayat' | 'zilla_parishad';
}

export function DocumentsPage({ type }: DocumentsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    documentType: '' as DocumentType,
    citizenName: '',
    citizenAadhaar: '',
  });

  const {
    data: issuedDocuments = [],
    isLoading,
    isError,
  } = useQuery<IssuedDocument[]>({
    queryKey: ['documents'],
    queryFn: fetchIssuedDocuments,
  });

  const filteredDocuments = issuedDocuments.filter((doc) => {
    const matchesSearch =
      doc.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.blockchainHash.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.documentType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleIssueDocument = () => {
    if (!newDocument.documentType || !newDocument.citizenName || !newDocument.citizenAadhaar) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const hash = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    toast.success(`Document issued successfully! Blockchain Hash: ${hash.slice(0, 20)}...`);
    setIsIssueDialogOpen(false);
    setNewDocument({ documentType: '' as DocumentType, citizenName: '', citizenAadhaar: '' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'revoked':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Issuance</h2>
          <p className="text-muted-foreground">
            Blockchain-verified document management
          </p>
        </div>
        <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Issue New Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                Issue New Document
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="docType">Document Type</Label>
                <Select
                  value={newDocument.documentType}
                  onValueChange={(value) =>
                    setNewDocument({ ...newDocument, documentType: value as DocumentType })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((docType) => (
                      <SelectItem key={docType.id} value={docType.id}>
                        {docType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="citizenName">Citizen Name</Label>
                <Input
                  id="citizenName"
                  placeholder="Enter full name"
                  className="mt-2"
                  value={newDocument.citizenName}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, citizenName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="aadhaar">Aadhaar Number (Last 4 digits)</Label>
                <Input
                  id="aadhaar"
                  placeholder="XXXX-XXXX-1234"
                  className="mt-2"
                  value={newDocument.citizenAadhaar}
                  onChange={(e) =>
                    setNewDocument({ ...newDocument, citizenAadhaar: e.target.value })
                  }
                />
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-success" />
                  <span className="font-medium">Blockchain Security</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This document will be cryptographically secured on blockchain.
                  A unique verification hash will be generated.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsIssueDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleIssueDocument} className="bg-accent hover:bg-accent/90">
                <FileCheck className="h-4 w-4 mr-2" />
                Issue Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Issued</p>
          <p className="text-2xl font-bold mt-1">{issuedDocuments.length}</p>
        </div>
        <div className="stat-card bg-success/5 border-success/20">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold mt-1 text-success">
            {issuedDocuments.filter((d) => d.status === 'active').length}
          </p>
        </div>
        <div className="stat-card bg-warning/5 border-warning/20">
          <p className="text-sm text-muted-foreground">Expired</p>
          <p className="text-2xl font-bold mt-1 text-warning">
            {issuedDocuments.filter((d) => d.status === 'expired').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Verifications</p>
          <p className="text-2xl font-bold mt-1">
            {issuedDocuments.reduce((sum, d) => sum + d.verificationCount, 0)}
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
                placeholder="Search by name or blockchain hash..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {documentTypes.map((docType) => (
                <SelectItem key={docType.id} value={docType.id}>
                  {docType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        )}
        {isError && (
          <p className="text-sm text-destructive">Failed to load documents from the server.</p>
        )}
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="dashboard-section hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <FileCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {documentTypes.find((t) => t.id === doc.documentType)?.label}
                  </h4>
                  <p className="text-xs text-muted-foreground">{doc.citizenName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(doc.status)}
                <span
                  className={cn(
                    'text-xs font-medium capitalize',
                    doc.status === 'active' && 'text-success',
                    doc.status === 'expired' && 'text-warning',
                    doc.status === 'revoked' && 'text-destructive'
                  )}
                >
                  {doc.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Blockchain Hash</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate font-mono">
                    {doc.blockchainHash}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => copyToClipboard(doc.blockchainHash)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Aadhaar: {doc.citizenAadhaar}
                </span>
                <span className="text-muted-foreground">
                  Verified {doc.verificationCount}x
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Issued: {doc.issuedAt.toLocaleDateString('en-IN')}</span>
                <span>By: {doc.issuedBy}</span>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <QrCode className="h-3 w-3 mr-1" />
                  QR Code
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground dashboard-section">
          No documents found matching your criteria
        </div>
      )}
    </div>
  );
}
