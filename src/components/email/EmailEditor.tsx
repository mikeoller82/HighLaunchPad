'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { 
  Eye, Save, Send, Copy, Palette, Settings, Users, 
  Image as ImageIcon, Link, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered,
  Undo, Redo, Download, Upload, Mail, Smartphone, Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { professionalEmailTemplates, EmailTemplate } from '@/lib/email-templates-full';

interface EmailData {
  id?: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  templateId?: string;
  variables: Record<string, string>;
  recipients?: string[];
  scheduledAt?: Date;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: Date;
  updatedAt: Date;
}

interface EmailEditorProps {
  templateId?: string;
  emailId?: string;
  onSave?: (email: EmailData) => void;
  onSend?: (email: EmailData) => void;
}

export function EmailEditor({ templateId, emailId, onSave, onSend }: EmailEditorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Email data state
  const [email, setEmail] = useState<EmailData>({
    subject: '',
    htmlContent: '',
    textContent: '',
    variables: {},
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Editor state
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'settings'>('design');
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Load template or existing email
  useEffect(() => {
    if (templateId) {
      const template = professionalEmailTemplates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        setEmail(prev => ({
          ...prev,
          subject: template.subject,
          htmlContent: template.htmlContent,
          textContent: template.textContent,
          templateId: template.id,
          variables: template.variables.reduce((acc, variable) => {
            acc[variable] = `{{${variable}}}`;
            return acc;
          }, {} as Record<string, string>)
        }));
      }
    }
  }, [templateId]);

  const saveEmailToFirestore = useCallback(async (emailData: EmailData) => {
    if (!user) return;
    const idToken = await user.getIdToken();
    const response = await fetch('/api/email/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error('Failed to save email');
    }

    return response.json();
  }, [user]);

  const handleAutoSave = useCallback(async () => {
    if (!user) return;
    
    try {
      // Save to Firestore
      await saveEmailToFirestore(email);
      setIsDirty(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [email, user, saveEmailToFirestore]);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && user) {
      const saveTimer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      
      return () => clearTimeout(saveTimer);
    }
  }, [email, isDirty, user, handleAutoSave]);

  const handleSaveEmail = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to save your email.'
      });
      return;
    }

    setIsSaving(true);
    try {
      const savedEmail = await saveEmailToFirestore(email);
      setEmail(prev => ({ ...prev, ...savedEmail }));
      setIsDirty(false);
      
      toast({
        title: 'Email Saved',
        description: 'Your email has been saved successfully.'
      });
      
      onSave?.(savedEmail);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save email. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendEmail = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to send emails.'
      });
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          ...email,
          status: 'sent',
          sentAt: new Date()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const result = await response.json();
      
      toast({
        title: 'Email Sent',
        description: `Email sent successfully to ${result.recipientCount} recipients.`
      });
      
      onSend?.(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Send Failed',
        description: 'Failed to send email. Please try again.'
      });
    }
  };

  const updateEmailContent = (field: keyof EmailData, value: any) => {
    setEmail(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }));
    setIsDirty(true);
  };

  const insertVariable = (variable: string) => {
    const variableTag = `{{${variable}}}`;
    const textArea = document.getElementById('email-content') as HTMLTextAreaElement;
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const text = textArea.value;
      const newText = text.substring(0, start) + variableTag + text.substring(end);
      updateEmailContent('htmlContent', newText);
      
      // Set cursor position after inserted variable
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + variableTag.length, start + variableTag.length);
      }, 0);
    }
  };

  const renderPreview = () => {
    let processedHtml = email.htmlContent;
    
    // Replace variables with actual values
    Object.entries(email.variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedHtml = processedHtml.replace(regex, value);
    });

    return (
      <div 
        className={cn(
          "border rounded-lg overflow-auto bg-white",
          previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
        )}
        style={{ 
          minHeight: '600px',
          transform: previewMode === 'mobile' ? 'scale(0.8)' : 'scale(1)',
          transformOrigin: 'top center'
        }}
      >
        <div dangerouslySetInnerHTML={{ 
          __html: (() => {
            // Sanitize HTML to prevent Quirks Mode
            let sanitized = processedHtml;
            
            // Remove any DOCTYPE declarations that might conflict
            sanitized = sanitized.replace(/<!DOCTYPE[^>]*>/gi, '');
            
            // Remove html, head, body tags that could cause issues in fragments
            sanitized = sanitized.replace(/<\/?(?:html|head|body)[^>]*>/gi, '');
            
            // Ensure content is wrapped in a proper container if it's not already
            if (sanitized && !sanitized.trim().startsWith('<div') && !sanitized.trim().startsWith('<table') && !sanitized.trim().startsWith('<p')) {
              sanitized = `<div>${sanitized}</div>`;
            }
            
            return sanitized;
          })()
        }} />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_350px] gap-6 h-[calc(100vh-120px)]">
      {/* Left Sidebar - Templates & Variables */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Email Templates</CardTitle>
          <CardDescription>Choose a template to get started</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[300px] overflow-y-auto px-4">
            {professionalEmailTemplates.slice(0, 4).map(template => (
              <div
                key={template.id}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-colors mb-2",
                  selectedTemplate?.id === template.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                )}
                onClick={() => {
                  setSelectedTemplate(template);
                  setEmail(prev => ({
                    ...prev,
                    subject: template.subject,
                    htmlContent: template.htmlContent,
                    textContent: template.textContent,
                    templateId: template.id
                  }));
                }}
              >
                <div className="font-medium text-sm">{template.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
                <div className="flex gap-1 mt-2">
                  {template.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {selectedTemplate && (
            <>
              <Separator className="my-4" />
              <div className="px-4 pb-4">
                <h4 className="font-medium mb-3">Template Variables</h4>
                <div className="space-y-2">
                  {selectedTemplate.variables.map(variable => (
                    <div key={variable} className="flex items-center justify-between">
                      <span className="text-sm font-mono">{`{{${variable}}}`}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(variable)}
                      >
                        Insert
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Main Editor */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Email Editor</CardTitle>
            <CardDescription>
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}>
              {previewMode === 'desktop' ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveEmail} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button size="sm" onClick={handleSendEmail}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="m-0 p-4 h-[calc(100%-48px)]">
              <div className="space-y-4 h-full">
                <div>
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={email.subject}
                    onChange={(e) => updateEmailContent('subject', e.target.value)}
                    placeholder="Enter email subject..."
                  />
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="email-content">Email Content (HTML)</Label>
                  <Textarea
                    id="email-content"
                    value={email.htmlContent}
                    onChange={(e) => updateEmailContent('htmlContent', e.target.value)}
                    placeholder="Enter your email content..."
                    className="h-[calc(100%-60px)] font-mono text-sm"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="m-0 p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-content">Plain Text Version</Label>
                  <Textarea
                    id="text-content"
                    value={email.textContent}
                    onChange={(e) => updateEmailContent('textContent', e.target.value)}
                    placeholder="Enter plain text version..."
                    rows={10}
                  />
                </div>
                
                {selectedTemplate && (
                  <div>
                    <h4 className="font-medium mb-3">Variable Values</h4>
                    <div className="space-y-3">
                      {selectedTemplate.variables.map(variable => (
                        <div key={variable}>
                          <Label htmlFor={variable}>{variable.replace('_', ' ').toUpperCase()}</Label>
                          <Input
                            id={variable}
                            value={email.variables[variable] || ''}
                            onChange={(e) => updateEmailContent('variables', {
                              ...email.variables,
                              [variable]: e.target.value
                            })}
                            placeholder={`Enter ${variable}...`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="m-0 p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={email.status} onValueChange={(value) => updateEmailContent('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">Email Metrics</h4>
                  {selectedTemplate && (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedTemplate.metrics.averageOpenRate}%
                        </div>
                        <div className="text-sm text-muted-foreground">Open Rate</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedTemplate.metrics.averageClickRate}%
                        </div>
                        <div className="text-sm text-muted-foreground">Click Rate</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedTemplate.metrics.averageConversionRate}%
                        </div>
                        <div className="text-sm text-muted-foreground">Conversion</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Right Sidebar - Preview */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview
          </CardTitle>
          <CardDescription>
            {previewMode === 'desktop' ? 'Desktop View' : 'Mobile View'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-80px)]">
          <div className="h-full overflow-auto p-4">
            {renderPreview()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}