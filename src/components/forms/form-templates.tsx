'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Star, Crown, Building2, Users, ShoppingCart, Heart, FileText, Calendar, CreditCard, MessageSquare, UserCheck, Briefcase, GraduationCap, Home, Stethoscope, Car, Plane, Gift, Zap } from 'lucide-react';
import type { FormTemplate } from '@/lib/form-types';

interface FormTemplatesProps {
  onSelectTemplate: (template: FormTemplate) => void;
  onClose: () => void;
}

const formTemplates: FormTemplate[] = [
  // Business & Lead Generation
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Professional contact form for business inquiries',
    category: 'business',
    thumbnail: '/templates/contact-form.png',
    tags: ['contact', 'business', 'inquiry'],
    isPremium: false,
    industry: ['general', 'business', 'services'],
    useCase: ['lead-generation', 'customer-support'],
    fields: [
      { id: '1', type: 'text', label: 'Full Name', required: true, width: 'half' },
      { id: '2', type: 'email', label: 'Email Address', required: true, width: 'half' },
      { id: '3', type: 'phone', label: 'Phone Number', width: 'half' },
      { id: '4', type: 'text', label: 'Company', width: 'half' },
      { id: '5', type: 'select', label: 'Inquiry Type', options: ['General Inquiry', 'Sales', 'Support', 'Partnership'], required: true },
      { id: '6', type: 'textarea', label: 'Message', required: true, rows: 4 }
    ],
    settings: {
      name: 'Contact Form',
      submitButtonText: 'Send Message',
      successMessage: 'Thank you for your message! We\'ll get back to you soon.',
      enableNotifications: true,
      notifications: {
        admin: { enabled: true, emails: ['admin@company.com'], template: 'New contact form submission' },
        user: { enabled: true, template: 'Thank you for contacting us', subject: 'We received your message' }
      }
    }
  },
  {
    id: 'lead-qualification',
    name: 'Lead Qualification Form',
    description: 'Comprehensive lead qualification and scoring form',
    category: 'business',
    thumbnail: '/templates/lead-qualification.png',
    tags: ['lead', 'qualification', 'sales', 'crm'],
    isPremium: true,
    industry: ['b2b', 'saas', 'consulting'],
    useCase: ['lead-generation', 'sales-qualification'],
    fields: [
      { id: '1', type: 'section', label: 'Contact Information' },
      { id: '2', type: 'text', label: 'Full Name', required: true, width: 'half' },
      { id: '3', type: 'email', label: 'Business Email', required: true, width: 'half' },
      { id: '4', type: 'phone', label: 'Phone Number', required: true, width: 'half' },
      { id: '5', type: 'text', label: 'Job Title', required: true, width: 'half' },
      { id: '6', type: 'text', label: 'Company Name', required: true, width: 'half' },
      { id: '7', type: 'select', label: 'Company Size', options: ['1-10', '11-50', '51-200', '201-1000', '1000+'], required: true, width: 'half' },
      { id: '8', type: 'section', label: 'Project Details' },
      { id: '9', type: 'select', label: 'Budget Range', options: ['Under $10K', '$10K-$50K', '$50K-$100K', '$100K-$500K', '$500K+'], required: true },
      { id: '10', type: 'select', label: 'Timeline', options: ['ASAP', '1-3 months', '3-6 months', '6+ months'], required: true },
      { id: '11', type: 'textarea', label: 'Project Description', required: true, rows: 4 }
    ],
    settings: {
      name: 'Lead Qualification Form',
      submitButtonText: 'Submit Qualification',
      successMessage: 'Thank you! Our sales team will contact you within 24 hours.',
      enableAnalytics: true,
      integrations: [
        { type: 'crm', enabled: true, config: { provider: 'salesforce' } }
      ]
    }
  },
  // E-commerce
  {
    id: 'product-order',
    name: 'Product Order Form',
    description: 'Complete product ordering form with payment integration',
    category: 'ecommerce',
    thumbnail: '/templates/product-order.png',
    tags: ['order', 'payment', 'ecommerce', 'checkout'],
    isPremium: true,
    industry: ['retail', 'ecommerce', 'manufacturing'],
    useCase: ['order-processing', 'payment-collection'],
    fields: [
      { id: '1', type: 'section', label: 'Customer Information' },
      { id: '2', type: 'text', label: 'Full Name', required: true, width: 'half' },
      { id: '3', type: 'email', label: 'Email Address', required: true, width: 'half' },
      { id: '4', type: 'phone', label: 'Phone Number', required: true },
      { id: '5', type: 'address', label: 'Shipping Address', required: true },
      { id: '6', type: 'section', label: 'Order Details' },
      { id: '7', type: 'select', label: 'Product', options: ['Product A - $99', 'Product B - $149', 'Product C - $199'], required: true },
      { id: '8', type: 'number', label: 'Quantity', required: true, min: 1, defaultValue: 1 },
      { id: '9', type: 'calculation', label: 'Total Amount', calculations: { formula: 'quantity * price', fields: ['quantity', 'product'] } },
      { id: '10', type: 'payment', label: 'Payment Information', required: true }
    ],
    settings: {
      name: 'Product Order Form',
      submitButtonText: 'Complete Order',
      successMessage: 'Order placed successfully! You will receive a confirmation email shortly.',
      enablePayments: true,
      payments: {
        enabled: true,
        currency: 'USD',
        allowCustomAmount: false,
        paymentMethods: ['card', 'paypal']
      }
    }
  },
  // Event Registration
  {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'Professional event registration with attendee management',
    category: 'events',
    thumbnail: '/templates/event-registration.png',
    tags: ['event', 'registration', 'attendee', 'conference'],
    isPremium: false,
    industry: ['events', 'education', 'corporate'],
    useCase: ['event-management', 'registration'],
    fields: [
      { id: '1', type: 'section', label: 'Attendee Information' },
      { id: '2', type: 'text', label: 'First Name', required: true, width: 'half' },
      { id: '3', type: 'text', label: 'Last Name', required: true, width: 'half' },
      { id: '4', type: 'email', label: 'Email Address', required: true, width: 'half' },
      { id: '5', type: 'phone', label: 'Phone Number', width: 'half' },
      { id: '6', type: 'text', label: 'Company/Organization', width: 'half' },
      { id: '7', type: 'text', label: 'Job Title', width: 'half' },
      { id: '8', type: 'section', label: 'Event Preferences' },
      { id: '9', type: 'select', label: 'Ticket Type', options: ['General Admission - $99', 'VIP - $199', 'Student - $49'], required: true },
      { id: '10', type: 'checkbox', label: 'Sessions', options: ['Keynote', 'Workshop A', 'Workshop B', 'Networking Lunch', 'Panel Discussion'] },
      { id: '11', type: 'textarea', label: 'Dietary Restrictions', placeholder: 'Please specify any dietary restrictions or allergies' },
      { id: '12', type: 'checkbox', label: 'I agree to receive event updates via email' }
    ],
    settings: {
      name: 'Event Registration',
      submitButtonText: 'Register Now',
      successMessage: 'Registration successful! Check your email for event details and tickets.',
      enableScheduling: true,
      scheduling: {
        timezone: 'America/New_York',
        allowedDays: [1, 2, 3, 4, 5],
        allowedHours: { start: '09:00', end: '17:00' }
      }
    }
  },
  // Healthcare
  {
    id: 'patient-intake',
    name: 'Patient Intake Form',
    description: 'Comprehensive medical patient intake form',
    category: 'healthcare',
    thumbnail: '/templates/patient-intake.png',
    tags: ['medical', 'patient', 'healthcare', 'intake'],
    isPremium: true,
    industry: ['healthcare', 'medical', 'dental'],
    useCase: ['patient-onboarding', 'medical-records'],
    fields: [
      { id: '1', type: 'section', label: 'Patient Information' },
      { id: '2', type: 'text', label: 'Full Name', required: true, width: 'half' },
      { id: '3', type: 'date', label: 'Date of Birth', required: true, width: 'half' },
      { id: '4', type: 'select', label: 'Gender', options: ['Male', 'Female', 'Other', 'Prefer not to say'], width: 'half' },
      { id: '5', type: 'phone', label: 'Phone Number', required: true, width: 'half' },
      { id: '6', type: 'email', label: 'Email Address', required: true },
      { id: '7', type: 'address', label: 'Home Address', required: true },
      { id: '8', type: 'section', label: 'Emergency Contact' },
      { id: '9', type: 'text', label: 'Emergency Contact Name', required: true, width: 'half' },
      { id: '10', type: 'phone', label: 'Emergency Contact Phone', required: true, width: 'half' },
      { id: '11', type: 'text', label: 'Relationship', required: true, width: 'half' },
      { id: '12', type: 'section', label: 'Medical History' },
      { id: '13', type: 'textarea', label: 'Current Medications', rows: 3 },
      { id: '14', type: 'textarea', label: 'Known Allergies', rows: 3 },
      { id: '15', type: 'textarea', label: 'Medical Conditions', rows: 3 },
      { id: '16', type: 'signature', label: 'Patient Signature', required: true }
    ],
    settings: {
      name: 'Patient Intake Form',
      submitButtonText: 'Submit Intake Form',
      successMessage: 'Thank you! Your intake form has been submitted successfully.',
      security: {
        enableEncryption: true,
        enableAuditLog: true,
        enableCaptcha: true,
        enableRateLimit: true,
        maxSubmissionsPerHour: 5
      }
    }
  },
  // Job Application
  {
    id: 'job-application',
    name: 'Job Application Form',
    description: 'Professional job application with resume upload',
    category: 'hr',
    thumbnail: '/templates/job-application.png',
    tags: ['job', 'application', 'hr', 'recruitment'],
    isPremium: false,
    industry: ['hr', 'recruitment', 'corporate'],
    useCase: ['hiring', 'recruitment'],
    fields: [
      { id: '1', type: 'section', label: 'Personal Information' },
      { id: '2', type: 'text', label: 'Full Name', required: true, width: 'half' },
      { id: '3', type: 'email', label: 'Email Address', required: true, width: 'half' },
      { id: '4', type: 'phone', label: 'Phone Number', required: true, width: 'half' },
      { id: '5', type: 'text', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/yourprofile', width: 'half' },
      { id: '6', type: 'address', label: 'Current Address' },
      { id: '7', type: 'section', label: 'Position Details' },
      { id: '8', type: 'select', label: 'Position Applied For', options: ['Software Engineer', 'Product Manager', 'Designer', 'Marketing Manager', 'Sales Representative'], required: true },
      { id: '9', type: 'select', label: 'How did you hear about us?', options: ['Company Website', 'LinkedIn', 'Job Board', 'Referral', 'Other'] },
      { id: '10', type: 'currency', label: 'Expected Salary', placeholder: 'Enter expected annual salary' },
      { id: '11', type: 'date', label: 'Available Start Date', required: true },
      { id: '12', type: 'section', label: 'Documents' },
      { id: '13', type: 'file', label: 'Resume/CV', required: true, accept: '.pdf,.doc,.docx', maxFileSize: 5 },
      { id: '14', type: 'file', label: 'Cover Letter', accept: '.pdf,.doc,.docx', maxFileSize: 5 },
      { id: '15', type: 'file', label: 'Portfolio (Optional)', accept: '.pdf,.zip', maxFileSize: 10 },
      { id: '16', type: 'section', label: 'Additional Information' },
      { id: '17', type: 'textarea', label: 'Why do you want to work here?', required: true, rows: 4 },
      { id: '18', type: 'checkbox', label: 'I authorize the company to contact my references' }
    ],
    settings: {
      name: 'Job Application Form',
      submitButtonText: 'Submit Application',
      successMessage: 'Application submitted successfully! We will review your application and get back to you soon.',
      enableFileUploads: true,
      maxFileSize: 10,
      allowedFileTypes: ['.pdf', '.doc', '.docx', '.zip']
    }
  },
  // Survey & Feedback
  {
    id: 'customer-satisfaction',
    name: 'Customer Satisfaction Survey',
    description: 'Comprehensive customer satisfaction and NPS survey',
    category: 'survey',
    thumbnail: '/templates/customer-satisfaction.png',
    tags: ['survey', 'feedback', 'nps', 'satisfaction'],
    isPremium: false,
    industry: ['general', 'retail', 'services'],
    useCase: ['feedback-collection', 'customer-research'],
    fields: [
      { id: '1', type: 'section', label: 'About Your Experience' },
      { id: '2', type: 'rating', label: 'Overall Satisfaction', required: true, ratingScale: 5 },
      { id: '3', type: 'nps', label: 'How likely are you to recommend us?', required: true, npsLabels: { low: 'Not likely', high: 'Very likely' } },
      { id: '4', type: 'likert', label: 'Please rate the following aspects:', required: true, 
        matrixRows: ['Product Quality', 'Customer Service', 'Value for Money', 'Delivery Speed'],
        likertScale: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'] },
      { id: '5', type: 'section', label: 'Feedback' },
      { id: '6', type: 'textarea', label: 'What did you like most?', rows: 3 },
      { id: '7', type: 'textarea', label: 'What could we improve?', rows: 3 },
      { id: '8', type: 'select', label: 'How often do you use our service?', options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'First time'] },
      { id: '9', type: 'checkbox', label: 'Would you like us to follow up on your feedback?' }
    ],
    settings: {
      name: 'Customer Satisfaction Survey',
      submitButtonText: 'Submit Feedback',
      successMessage: 'Thank you for your valuable feedback!',
      enableAnalytics: true,
      allowMultipleSubmissions: false
    }
  }
];

const categories = [
  { id: 'all', label: 'All Templates', icon: FileText },
  { id: 'business', label: 'Business', icon: Building2 },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'healthcare', label: 'Healthcare', icon: Stethoscope },
  { id: 'hr', label: 'HR & Recruitment', icon: Users },
  { id: 'survey', label: 'Survey & Feedback', icon: MessageSquare },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'real-estate', label: 'Real Estate', icon: Home },
  { id: 'automotive', label: 'Automotive', icon: Car },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'nonprofit', label: 'Non-profit', icon: Heart }
];

export function FormTemplates({ onSelectTemplate, onClose }: FormTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const filteredTemplates = formTemplates.filter(template => {
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesPremium = !showPremiumOnly || template.isPremium;
    
    return matchesSearch && matchesCategory && matchesPremium;
  });

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Form Templates</h2>
              <p className="text-muted-foreground">Choose from professional templates to get started quickly</p>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant={showPremiumOnly ? "default" : "outline"}
              onClick={() => setShowPremiumOnly(!showPremiumOnly)}
              className="flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Premium Only
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r p-4">
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    {category.label}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 p-6">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {template.name}
                            {template.isPremium && <Crown className="h-4 w-4 text-yellow-500" />}
                          </CardTitle>
                          <CardDescription className="mt-1">{template.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {template.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{template.fields.length}</span> fields
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => onSelectTemplate(template)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No templates found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or category filters</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}