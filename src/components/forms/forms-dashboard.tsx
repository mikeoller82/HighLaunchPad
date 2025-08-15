'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Plus, Search, Filter, MoreHorizontal, Eye, Edit, Copy, Trash2, 
  BarChart3, Users, FileText, Calendar, Settings, Share2, 
  Download, Upload, Star, Crown, Zap, TrendingUp, Clock,
  CheckCircle, XCircle, AlertTriangle, Globe, Smartphone, Monitor
} from 'lucide-react';
import { FormBuilder } from './form-builder';
import { FormAnalytics } from './form-analytics';
import { FormSubmissions } from './form-submissions';
import { FormTemplates } from './form-templates';
import type { FormTemplate, FormField, FormSettings } from '@/lib/form-types';
import { toast } from 'sonner';

interface FormData {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  submissions: number;
  conversionRate: number;
  createdAt: Date;
  updatedAt: Date;
  fields: FormField[];
  settings: FormSettings;
  isPremium?: boolean;
  category: string;
}

// Mock forms data
const mockForms: FormData[] = [
  {
    id: 'form_001',
    name: 'Contact Form',
    description: 'General contact form for website visitors',
    status: 'published',
    views: 12847,
    submissions: 3421,
    conversionRate: 26.6,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    category: 'business',
    fields: [],
    settings: {
      name: 'Contact Form',
      submitButtonText: 'Send Message',
      successMessage: 'Thank you for your message!'
    }
  },
  {
    id: 'form_002',
    name: 'Lead Qualification Survey',
    description: 'Comprehensive lead qualification form for sales team',
    status: 'published',
    views: 8934,
    submissions: 1876,
    conversionRate: 21.0,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
    category: 'business',
    isPremium: true,
    fields: [],
    settings: {
      name: 'Lead Qualification Survey',
      submitButtonText: 'Submit Qualification',
      successMessage: 'Thank you! Our sales team will contact you soon.'
    }
  },
  {
    id: 'form_003',
    name: 'Event Registration',
    description: 'Registration form for upcoming conference',
    status: 'published',
    views: 5672,
    submissions: 2134,
    conversionRate: 37.6,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    category: 'events',
    fields: [],
    settings: {
      name: 'Event Registration',
      submitButtonText: 'Register Now',
      successMessage: 'Registration successful!'
    }
  },
  {
    id: 'form_004',
    name: 'Customer Feedback',
    description: 'Post-purchase customer satisfaction survey',
    status: 'draft',
    views: 0,
    submissions: 0,
    conversionRate: 0,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    category: 'survey',
    fields: [],
    settings: {
      name: 'Customer Feedback',
      submitButtonText: 'Submit Feedback',
      successMessage: 'Thank you for your feedback!'
    }
  }
];

export function FormsDashboard() {
  const [forms, setForms] = useState<FormData[]>(mockForms);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeView, setActiveView] = useState<'dashboard' | 'builder' | 'analytics' | 'submissions'>('dashboard');
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const getStatusBadge = (status: FormData['status']) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Published</Badge>;
      case 'draft':
        return <Badge variant="secondary"><Edit className="h-3 w-3 mr-1" />Draft</Badge>;
      case 'archived':
        return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getConversionColor = (rate: number) => {
    if (rate >= 30) return 'text-green-600';
    if (rate >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = searchTerm === '' || 
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || form.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedForms = [...filteredForms].sort((a, b) => {
    switch (sortBy) {
      case 'updated-desc':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'updated-asc':
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'submissions-desc':
        return b.submissions - a.submissions;
      case 'conversion-desc':
        return b.conversionRate - a.conversionRate;
      default:
        return 0;
    }
  });

  const createNewForm = () => {
    const newForm: FormData = {
      id: `form_${Date.now()}`,
      name: 'New Form',
      description: 'A new form',
      status: 'draft',
      views: 0,
      submissions: 0,
      conversionRate: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: 'business',
      fields: [],
      settings: {
        name: 'New Form',
        submitButtonText: 'Submit',
        successMessage: 'Thank you for your submission!'
      }
    };
    
    setForms(prev => [newForm, ...prev]);
    setSelectedForm(newForm);
    setActiveView('builder');
    toast.success('New form created');
  };

  const duplicateForm = (form: FormData) => {
    const duplicatedForm: FormData = {
      ...form,
      id: `form_${Date.now()}`,
      name: `${form.name} (Copy)`,
      status: 'draft',
      views: 0,
      submissions: 0,
      conversionRate: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setForms(prev => [duplicatedForm, ...prev]);
    toast.success('Form duplicated');
  };

  const deleteForm = (formId: string) => {
    if (confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      setForms(prev => prev.filter(f => f.id !== formId));
      toast.success('Form deleted');
    }
  };

  const handleTemplateSelect = (template: FormTemplate) => {
    const newForm: FormData = {
      id: `form_${Date.now()}`,
      name: template.name,
      description: template.description,
      status: 'draft',
      views: 0,
      submissions: 0,
      conversionRate: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: template.category,
      fields: template.fields,
      settings: template.settings
    };
    
    setForms(prev => [newForm, ...prev]);
    setSelectedForm(newForm);
    setShowTemplates(false);
    setActiveView('builder');
    toast.success(`Form created from template: ${template.name}`);
  };

  if (activeView === 'builder' && selectedForm) {
    return (
      <div className="h-screen flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
              ← Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{selectedForm.name}</h1>
              <p className="text-sm text-muted-foreground">Form Builder</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(selectedForm.status)}
          </div>
        </div>
        <div className="flex-1">
          <FormBuilder 
            initialFields={selectedForm.fields} 
            initialSettings={selectedForm.settings}
          />
        </div>
      </div>
    );
  }

  if (activeView === 'analytics' && selectedForm) {
    return (
      <div className="h-screen flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
              ← Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{selectedForm.name}</h1>
              <p className="text-sm text-muted-foreground">Analytics</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <FormAnalytics formId={selectedForm.id} formName={selectedForm.name} />
        </div>
      </div>
    );
  }

  if (activeView === 'submissions' && selectedForm) {
    return (
      <div className="h-screen flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setActiveView('dashboard')}>
              ← Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{selectedForm.name}</h1>
              <p className="text-sm text-muted-foreground">Submissions</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <FormSubmissions formId={selectedForm.id} formName={selectedForm.name} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Forms</h1>
            <p className="text-muted-foreground">Create, manage, and analyze your forms</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowTemplates(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button onClick={createNewForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forms.length}</div>
              <p className="text-xs text-muted-foreground">
                {forms.filter(f => f.status === 'published').length} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {forms.reduce((sum, form) => sum + form.views, 0).toLocaleString()}
              </div>
              <p className="text-xs text-green-600">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {forms.reduce((sum, form) => sum + form.submissions, 0).toLocaleString()}
              </div>
              <p className="text-xs text-green-600">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(forms.reduce((sum, form) => sum + form.conversionRate, 0) / forms.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Across all forms</p>
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
                  placeholder="Search forms..."
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
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="survey">Survey</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated-desc">Recently Updated</SelectItem>
                  <SelectItem value="updated-asc">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="submissions-desc">Most Submissions</SelectItem>
                  <SelectItem value="conversion-desc">Best Conversion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedForms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {form.name}
                      {form.isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
                    </CardTitle>
                    <CardDescription className="mt-1">{form.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedForm(form); setActiveView('builder'); }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Form
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedForm(form); setActiveView('analytics'); }}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedForm(form); setActiveView('submissions'); }}>
                        <Users className="h-4 w-4 mr-2" />
                        View Submissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => duplicateForm(form)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => deleteForm(form.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  {getStatusBadge(form.status)}
                  <Badge variant="outline" className="text-xs capitalize">
                    {form.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">{form.views.toLocaleString()}</div>
                      <div className="text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{form.submissions.toLocaleString()}</div>
                      <div className="text-muted-foreground">Submissions</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${getConversionColor(form.conversionRate)}`}>
                        {form.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-muted-foreground">Conversion</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => { setSelectedForm(form); setActiveView('builder'); }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => { setSelectedForm(form); setActiveView('analytics'); }}
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                  </div>

                  {/* Last updated */}
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {form.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedForms.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No forms found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first form'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
                <div className="flex gap-3 justify-center">
                  <Button onClick={createNewForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Form
                  </Button>
                  <Button variant="outline" onClick={() => setShowTemplates(true)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Templates
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {showTemplates && (
        <FormTemplates 
          onSelectTemplate={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </>
  );
}