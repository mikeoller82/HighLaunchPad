'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Filter, Download, Eye, Trash2, Archive, 
  Calendar, User, Mail, Phone, MapPin, FileText,
  CheckCircle, XCircle, Clock, AlertTriangle,
  MoreHorizontal, RefreshCw, Star, Flag
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { FormSubmission } from '@/lib/form-types';

interface FormSubmissionsProps {
  formId: string;
  formName: string;
}

// Mock submission data
const mockSubmissions: FormSubmission[] = [
  {
    id: 'sub_001',
    formId: 'form_001',
    data: {
      'full-name': 'John Smith',
      'email': 'john.smith@example.com',
      'phone': '+1 (555) 123-4567',
      'company': 'Acme Corp',
      'message': 'Interested in your enterprise solution. Would like to schedule a demo.',
      'budget': '$50K-$100K',
      'timeline': '1-3 months'
    },
    submittedAt: new Date('2024-01-15T10:30:00Z'),
    submitterInfo: {
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      email: 'john.smith@example.com'
    },
    status: 'processed',
    paymentStatus: 'completed'
  },
  {
    id: 'sub_002',
    formId: 'form_001',
    data: {
      'full-name': 'Sarah Johnson',
      'email': 'sarah.j@techstartup.com',
      'phone': '+1 (555) 987-6543',
      'company': 'TechStartup Inc',
      'message': 'Looking for a cost-effective solution for our growing team.',
      'budget': '$10K-$50K',
      'timeline': 'ASAP'
    },
    submittedAt: new Date('2024-01-15T14:22:00Z'),
    submitterInfo: {
      ip: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      email: 'sarah.j@techstartup.com'
    },
    status: 'pending'
  },
  {
    id: 'sub_003',
    formId: 'form_001',
    data: {
      'full-name': 'Michael Chen',
      'email': 'mchen@globalcorp.com',
      'phone': '+1 (555) 456-7890',
      'company': 'Global Corp',
      'message': 'Need integration with our existing CRM system.',
      'budget': '$100K+',
      'timeline': '3-6 months'
    },
    submittedAt: new Date('2024-01-14T16:45:00Z'),
    submitterInfo: {
      ip: '203.0.113.42',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      email: 'mchen@globalcorp.com'
    },
    status: 'processed',
    files: [
      {
        fieldId: 'requirements-doc',
        filename: 'requirements.pdf',
        url: '/uploads/requirements.pdf',
        size: 2048576,
        type: 'application/pdf'
      }
    ]
  },
  {
    id: 'sub_004',
    formId: 'form_001',
    data: {
      'full-name': 'Emily Rodriguez',
      'email': 'emily.r@nonprofit.org',
      'phone': '+1 (555) 321-0987',
      'company': 'Community Nonprofit',
      'message': 'Seeking pro-bono or discounted services for our nonprofit.',
      'budget': 'Under $10K',
      'timeline': '6+ months'
    },
    submittedAt: new Date('2024-01-14T09:15:00Z'),
    submitterInfo: {
      ip: '198.51.100.25',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      email: 'emily.r@nonprofit.org'
    },
    status: 'failed'
  }
];

export function FormSubmissions({ formId, formName }: FormSubmissionsProps) {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [sortBy, setSortBy] = useState('date-desc');

  const getStatusBadge = (status: FormSubmission['status']) => {
    switch (status) {
      case 'processed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Processed</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status?: FormSubmission['paymentStatus']) => {
    if (!status) return null;
    
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Payment Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Payment Failed</Badge>;
      default:
        return null;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = searchTerm === '' || 
      Object.values(submission.data).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      submission.submitterInfo.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      case 'date-asc':
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      case 'name-asc':
        return String(a.data['full-name'] || '').localeCompare(String(b.data['full-name'] || ''));
      case 'name-desc':
        return String(b.data['full-name'] || '').localeCompare(String(a.data['full-name'] || ''));
      default:
        return 0;
    }
  });

  const exportSubmissions = () => {
    const csvContent = [
      // Header
      ['Date', 'Name', 'Email', 'Status', 'Data'].join(','),
      // Data rows
      ...sortedSubmissions.map(sub => [
        sub.submittedAt.toISOString(),
        sub.data['full-name'] || '',
        sub.submitterInfo.email || '',
        sub.status,
        JSON.stringify(sub.data).replace(/"/g, '""')
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formName.replace(/\s+/g, '-').toLowerCase()}-submissions.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateSubmissionStatus = (submissionId: string, newStatus: FormSubmission['status']) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId ? { ...sub, status: newStatus } : sub
    ));
  };

  const deleteSubmission = (submissionId: string) => {
    if (confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Form Submissions</h1>
          <p className="text-muted-foreground">{formName} • {submissions.length} total submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportSubmissions}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {submissions.filter(s => s.status === 'processed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {submissions.filter(s => s.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {submissions.filter(s => s.status === 'failed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submitted</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSubmissions.map((submission) => (
                <TableRow key={submission.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">
                          {submission.submittedAt.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {submission.submittedAt.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{submission.data['full-name'] || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {submission.submitterInfo.email || submission.data['email'] || 'N/A'}
                      </div>
                      {submission.data['phone'] && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {submission.data['phone']}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{submission.data['company'] || 'N/A'}</div>
                    {submission.data['budget'] && (
                      <div className="text-sm text-muted-foreground">{submission.data['budget']}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(submission.status)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(submission.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedSubmission(submission)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => updateSubmissionStatus(submission.id, 'processed')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Processed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateSubmissionStatus(submission.id, 'pending')}>
                          <Clock className="h-4 w-4 mr-2" />
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => deleteSubmission(submission.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {sortedSubmissions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No submissions found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Submissions will appear here once users start filling out your form'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Detail Dialog */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Submission Details</DialogTitle>
              <DialogDescription>
                Submitted on {selectedSubmission.submittedAt.toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <Tabs defaultValue="data" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="data">Form Data</TabsTrigger>
                  <TabsTrigger value="meta">Metadata</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>
                
                <TabsContent value="data" className="space-y-4">
                  <div className="grid gap-4">
                    {Object.entries(selectedSubmission.data).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                        <div className="font-medium capitalize">
                          {key.replace(/[-_]/g, ' ')}
                        </div>
                        <div className="col-span-2">
                          {typeof value === 'string' && value.length > 100 ? (
                            <div>
                              <div className="line-clamp-3">{value}</div>
                              <Button variant="link" className="p-0 h-auto text-xs">
                                Show more
                              </Button>
                            </div>
                          ) : (
                            <div className="break-words">{String(value)}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="meta" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                      <div className="font-medium">Submission ID</div>
                      <div className="col-span-2 font-mono text-sm">{selectedSubmission.id}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                      <div className="font-medium">IP Address</div>
                      <div className="col-span-2">{selectedSubmission.submitterInfo.ip}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                      <div className="font-medium">User Agent</div>
                      <div className="col-span-2 text-sm break-all">{selectedSubmission.submitterInfo.userAgent}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                      <div className="font-medium">Status</div>
                      <div className="col-span-2">{getStatusBadge(selectedSubmission.status)}</div>
                    </div>
                    {selectedSubmission.paymentStatus && (
                      <div className="grid grid-cols-3 gap-4 p-3 border rounded-lg">
                        <div className="font-medium">Payment Status</div>
                        <div className="col-span-2">{getPaymentStatusBadge(selectedSubmission.paymentStatus)}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="files" className="space-y-4">
                  {selectedSubmission.files && selectedSubmission.files.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSubmission.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{file.filename}</div>
                              <div className="text-sm text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No files attached to this submission</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}