'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  PlusCircle, 
  Filter, 
  Settings,
  Tag,
  Users,
  GitBranch,
  Search,
  Eye,
  MoreHorizontal,
  Brain,
  TrendingUp,
  AlertTriangle,
  Zap,
  Target,
  Activity,
  Bell,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  writeBatch,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Lead, 
  LeadScore, 
  QualificationStatus, 
  BuyingSignal, 
  Priority,
  LeadSource,
  LeadStatus,
  Pipeline as PipelineType,
  PipelineStage,
  Contact,
  Tag as TagType,
  LeadActivity
} from "@/lib/crm-types";

// Import the new components
import { PipelineManager } from "@/components/dashboard/crm/pipeline-manager";
import { TagManager } from "@/components/dashboard/crm/tag-manager";
import { ContactCard } from "@/components/dashboard/crm/contact-card";

interface CRMData {
  contacts: Contact[];
  leads: Lead[];
  tags: TagType[];
  activities: LeadActivity[];
  currentPipeline: PipelineType | null;
}

interface LeadWithContact {
  lead: Lead;
  contact: Contact;
  score?: LeadScore;
  qualification?: QualificationStatus;
  buyingSignals?: BuyingSignal[];
  activities?: LeadActivity[];
  tags?: TagType[];
}

export default function CRMPage() {
  const [crmData, setCrmData] = useState<CRMData>({
    contacts: [],
    leads: [],
    tags: [],
    activities: [],
    currentPipeline: null
  });
  
  const [leadsWithContacts, setLeadsWithContacts] = useState<LeadWithContact[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'pipeline' | 'list' | 'tags'>('pipeline');
  const [draggedLead, setDraggedLead] = useState<LeadWithContact | null>(null);
  
  // Dialog states
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isPipelineOpen, setIsPipelineOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    location: '',
    notes: ''
  });

  const [newLead, setNewLead] = useState({
    contactId: '',
    source: LeadSource.WEBSITE_FORM,
    status: LeadStatus.NEW,
    priority: Priority.NORMAL,
    estimatedValue: 0,
    notes: '',
    tags: [] as string[]
  });

  // Load all CRM data
  useEffect(() => {
    if (!user) return;

    const unsubscribes: (() => void)[] = [];

    // Load contacts
    const contactsRef = collection(db, 'contacts');
    const contactsQuery = query(
      contactsRef,
      where('userId', '==', user.uid),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    unsubscribes.push(onSnapshot(contactsQuery, (snapshot) => {
      const contacts: Contact[] = [];
      snapshot.forEach((doc) => {
        contacts.push({ id: doc.id, ...doc.data() } as Contact);
      });
      setCrmData(prev => ({ ...prev, contacts }));
    }));

    // Load leads
    const leadsRef = collection(db, 'leads');
    const leadsQuery = query(
      leadsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    unsubscribes.push(onSnapshot(leadsQuery, (snapshot) => {
      const leads: Lead[] = [];
      snapshot.forEach((doc) => {
        leads.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setCrmData(prev => ({ ...prev, leads }));
    }));

    // Load tags
    const tagsRef = collection(db, 'tags');
    const tagsQuery = query(
      tagsRef,
      where('userId', '==', user.uid),
      where('isActive', '==', true),
      orderBy('name', 'asc')
    );

    unsubscribes.push(onSnapshot(tagsQuery, (snapshot) => {
      const tags: TagType[] = [];
      snapshot.forEach((doc) => {
        tags.push({ id: doc.id, ...doc.data() } as TagType);
      });
      setCrmData(prev => ({ ...prev, tags }));
    }));

    // Load activities
    const activitiesRef = collection(db, 'leadActivities');
    const activitiesQuery = query(
      activitiesRef,
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    unsubscribes.push(onSnapshot(activitiesQuery, (snapshot) => {
      const activities: LeadActivity[] = [];
      snapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() } as LeadActivity);
      });
      setCrmData(prev => ({ ...prev, activities }));
    }));

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [user]);

  // Combine leads with contacts and additional data
  useEffect(() => {
    const combined: LeadWithContact[] = crmData.leads.map(lead => {
      const contact = crmData.contacts.find(c => c.id === lead.contactId);
      const leadTags = crmData.tags.filter(tag => lead.tags?.includes(tag.id));
      const leadActivities = crmData.activities.filter(activity => activity.leadId === lead.id);
      
      // Mock AI scoring for demonstration (replace with actual AI integration)
      const mockScore: LeadScore = {
        total: Math.floor(Math.random() * 100),
        engagement: Math.floor(Math.random() * 100),
        fit: Math.floor(Math.random() * 100),
        intent: Math.floor(Math.random() * 100),
        timing: Math.floor(Math.random() * 100)
      };

      const mockQualification = [
        QualificationStatus.UNQUALIFIED,
        QualificationStatus.MARKETING_QUALIFIED,
        QualificationStatus.SALES_QUALIFIED,
        QualificationStatus.OPPORTUNITY
      ][Math.floor(Math.random() * 4)];

      const mockBuyingSignals: BuyingSignal[] = [
        {
          type: 'website_visit',
          strength: Math.random(),
          description: 'Multiple website visits',
          detectedAt: new Date(),
          source: 'website_analytics'
        }
      ];

      return {
        lead,
        contact: contact || {
          id: 'unknown',
          firstName: 'Unknown',
          lastName: 'Contact',
          email: '',
          phone: '',
          company: '',
          title: '',
          tags: [],
          customFields: {},
          userId: user?.uid || '',
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        score: mockScore,
        qualification: mockQualification,
        buyingSignals: mockBuyingSignals,
        activities: leadActivities,
        tags: leadTags
      };
    });

    setLeadsWithContacts(combined);
  }, [crmData.leads, crmData.contacts, crmData.tags, crmData.activities, user]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const contactData: Omit<Contact, 'id'> = {
        firstName: newContact.firstName,
        lastName: newContact.lastName,
        email: newContact.email,
        phone: newContact.phone,
        company: newContact.company,
        title: newContact.title,
        location: newContact.location,
        notes: newContact.notes,
        tags: [],
        customFields: {},
        userId: user.uid,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'contacts'), contactData);
      
      toast({
        title: "Contact Added",
        description: `${newContact.firstName} ${newContact.lastName} has been added successfully.`
      });

      setNewContact({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        location: '',
        notes: ''
      });
      setIsAddContactOpen(false);
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add contact. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const leadData: Omit<Lead, 'id'> = {
        contactId: newLead.contactId,
        firstName: crmData.contacts.find(c => c.id === newLead.contactId)?.firstName || '',
        lastName: crmData.contacts.find(c => c.id === newLead.contactId)?.lastName || '',
        email: crmData.contacts.find(c => c.id === newLead.contactId)?.email || '',
        company: crmData.contacts.find(c => c.id === newLead.contactId)?.company || '',
        source: newLead.source,
        status: newLead.status,
        priority: newLead.priority,
        estimatedValue: newLead.estimatedValue,
        notes: newLead.notes,
        tags: newLead.tags,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'leads'), leadData);
      
      toast({
        title: "Lead Added",
        description: "Lead has been added successfully."
      });

      setNewLead({
        contactId: '',
        source: LeadSource.WEBSITE_FORM,
        status: LeadStatus.NEW,
        priority: Priority.NORMAL,
        estimatedValue: 0,
        notes: '',
        tags: []
      });
      setIsAddLeadOpen(false);
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add lead. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (leadWithContact: LeadWithContact) => {
    setDraggedLead(leadWithContact);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    
    if (!draggedLead || !user) return;
    
    if (draggedLead.lead.status === targetStatus) {
      setDraggedLead(null);
      return;
    }

    try {
      const leadRef = doc(db, 'leads', draggedLead.lead.id);
      await updateDoc(leadRef, {
        status: targetStatus,
        updatedAt: serverTimestamp()
      });

      // Add activity record
      await addDoc(collection(db, 'leadActivities'), {
        leadId: draggedLead.lead.id,
        contactId: draggedLead.contact.id,
        type: 'status_change',
        title: `Status changed to ${targetStatus}`,
        description: `Lead moved from ${draggedLead.lead.status} to ${targetStatus}`,
        userId: user.uid,
        createdBy: user.uid,
        timestamp: serverTimestamp()
      });

      toast({
        title: "Lead Updated",
        description: `Lead moved to ${targetStatus.replace('_', ' ')}`
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lead. Please try again."
      });
    } finally {
      setDraggedLead(null);
    }
  };

  const filteredLeads = leadsWithContacts.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || item.lead.status === filterStatus;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tagId => item.lead.tags?.includes(tagId));
    
    return matchesSearch && matchesStatus && matchesTags;
  });

  const getLeadsByStatus = (status: LeadStatus) => {
    return filteredLeads.filter(item => item.lead.status === status);
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case LeadStatus.CONTACTED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case LeadStatus.QUALIFIED:
        return 'bg-green-100 text-green-800 border-green-200';
      case LeadStatus.CONVERTED:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case LeadStatus.LOST:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const pipelineStages = [
    { status: LeadStatus.NEW, title: 'New Leads', leads: getLeadsByStatus(LeadStatus.NEW) },
    { status: LeadStatus.CONTACTED, title: 'Contacted', leads: getLeadsByStatus(LeadStatus.CONTACTED) },
    { status: LeadStatus.QUALIFIED, title: 'Qualified', leads: getLeadsByStatus(LeadStatus.QUALIFIED) },
    { status: LeadStatus.CONVERTED, title: 'Converted', leads: getLeadsByStatus(LeadStatus.CONVERTED) }
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-600">Manage your contacts, leads, and sales pipeline</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Data
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold">{crmData.contacts.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                <p className="text-2xl font-bold">{crmData.leads.length}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold">
                  {leadsWithContacts.filter(l => l.score && l.score.total >= 80).length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {crmData.leads.length > 0 
                    ? Math.round((getLeadsByStatus(LeadStatus.CONVERTED).length / crmData.leads.length) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="h-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="pipeline">
                <GitBranch className="mr-2 h-4 w-4" />
                Pipeline
              </TabsTrigger>
              <TabsTrigger value="list">
                <Users className="mr-2 h-4 w-4" />
                Contacts
              </TabsTrigger>
              <TabsTrigger value="tags">
                <Tag className="mr-2 h-4 w-4" />
                Tags & Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddContact} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={newContact.firstName}
                          onChange={(e) => setNewContact(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={newContact.lastName}
                          onChange={(e) => setNewContact(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newContact.email}
                          onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newContact.phone}
                          onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={newContact.company}
                          onChange={(e) => setNewContact(prev => ({ ...prev, company: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newContact.title}
                          onChange={(e) => setNewContact(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newContact.location}
                        onChange={(e) => setNewContact(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newContact.notes}
                        onChange={(e) => setNewContact(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddContactOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Contact'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Target className="mr-2 h-4 w-4" />
                    Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddLead} className="space-y-4">
                    <div>
                      <Label htmlFor="contactId">Contact</Label>
                      <Select value={newLead.contactId} onValueChange={(value) => setNewLead(prev => ({ ...prev, contactId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a contact" />
                        </SelectTrigger>
                        <SelectContent>
                          {crmData.contacts.map((contact) => (
                            <SelectItem key={contact.id} value={contact.id}>
                              {contact.firstName} {contact.lastName} - {contact.company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="source">Source</Label>
                        <Select value={newLead.source} onValueChange={(value: LeadSource) => setNewLead(prev => ({ ...prev, source: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={LeadSource.WEBSITE_FORM}>Website Form</SelectItem>
                            <SelectItem value={LeadSource.SOCIAL_MEDIA}>Social Media</SelectItem>
                            <SelectItem value={LeadSource.EMAIL_CAMPAIGN}>Email Campaign</SelectItem>
                            <SelectItem value={LeadSource.REFERRAL}>Referral</SelectItem>
                            <SelectItem value={LeadSource.PAID_ADVERTISING}>Paid Advertising</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newLead.priority} onValueChange={(value: Priority) => setNewLead(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Priority.LOW}>Low</SelectItem>
                            <SelectItem value={Priority.NORMAL}>Normal</SelectItem>
                            <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                            <SelectItem value={Priority.HIGH}>High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="estimatedValue">Estimated Value</Label>
                      <Input
                        id="estimatedValue"
                        type="number"
                        value={newLead.estimatedValue}
                        onChange={(e) => setNewLead(prev => ({ ...prev, estimatedValue: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newLead.notes}
                        onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddLeadOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Lead'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="pipeline" className="h-full">
            <div className="grid grid-cols-4 gap-4 h-full">
              {pipelineStages.map((stage) => (
                <div key={stage.status} className="flex flex-col">
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {stage.leads.length}
                      </Badge>
                    </div>
                    <div className={cn("w-3 h-3 rounded-full", getStatusColor(stage.status))} />
                  </div>
                  
                  <div 
                    className="flex-1 space-y-3 p-2 bg-gray-50/50 rounded-lg min-h-[600px] overflow-y-auto"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.status)}
                  >
                    {stage.leads.map((leadWithContact) => (
                      <ContactCard
                        key={leadWithContact.lead.id}
                        contact={leadWithContact.contact}
                        lead={leadWithContact.lead}
                        score={leadWithContact.score}
                        qualification={leadWithContact.qualification}
                        buyingSignals={leadWithContact.buyingSignals}
                        tags={leadWithContact.tags}
                        activities={leadWithContact.activities}
                        onDragStart={() => handleDragStart(leadWithContact)}
                        compact={true}
                      />
                    ))}
                    
                    {stage.leads.length === 0 && (
                      <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        Drop leads here
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Select value={filterStatus} onValueChange={(value: LeadStatus | 'all') => setFilterStatus(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value={LeadStatus.NEW}>New</SelectItem>
                    <SelectItem value={LeadStatus.CONTACTED}>Contacted</SelectItem>
                    <SelectItem value={LeadStatus.QUALIFIED}>Qualified</SelectItem>
                    <SelectItem value={LeadStatus.CONVERTED}>Converted</SelectItem>
                    <SelectItem value={LeadStatus.LOST}>Lost</SelectItem>
                  </SelectContent>
                </Select>
                
                <TagManager 
                  mode="select"
                  selectedTags={selectedTags}
                  onTagSelect={(tagId) => {
                    setSelectedTags(prev => 
                      prev.includes(tagId) 
                        ? prev.filter(id => id !== tagId)
                        : [...prev, tagId]
                    );
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLeads.map((leadWithContact) => (
                  <ContactCard
                    key={leadWithContact.lead.id}
                    contact={leadWithContact.contact}
                    lead={leadWithContact.lead}
                    score={leadWithContact.score}
                    qualification={leadWithContact.qualification}
                    buyingSignals={leadWithContact.buyingSignals}
                    tags={leadWithContact.tags}
                    activities={leadWithContact.activities}
                  />
                ))}
              </div>
              
              {filteredLeads.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tags" className="h-full">
            <div className="space-y-8">
              <PipelineManager 
                currentPipeline={crmData.currentPipeline || undefined}
                onPipelineChange={(pipeline) => setCrmData(prev => ({ ...prev, currentPipeline: pipeline }))}
              />
              
              <Separator />
              
              <TagManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}