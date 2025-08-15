/**
 * Lead Magnet Integration System
 * Functional opt-in forms with automation triggers
 */

export interface LeadMagnet {
  id: string;
  name: string;
  type: 'ebook' | 'checklist' | 'template' | 'video_series' | 'webinar' | 'free_trial' | 'consultation';
  title: string;
  description: string;
  deliveryMethod: 'email' | 'download' | 'redirect' | 'access_grant';
  fileUrl?: string;
  redirectUrl?: string;
  emailTemplate?: string;
  value: string; // Perceived value (e.g., "$97 Value")
  active: boolean;
  createdAt: Date;
}

export interface OptInForm {
  id: string;
  leadMagnetId: string;
  name: string;
  fields: FormField[];
  design: FormDesign;
  placement: 'inline' | 'popup' | 'slide_in' | 'exit_intent' | 'scroll_trigger';
  triggers: FormTrigger[];
  thankYouMessage: string;
  redirectAfterOptIn?: string;
  active: boolean;
}

export interface FormField {
  id: string;
  type: 'email' | 'text' | 'phone' | 'select' | 'checkbox' | 'radio';
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule[];
  options?: string[]; // For select, radio, checkbox
}

export interface FormDesign {
  theme: 'minimal' | 'professional' | 'bold' | 'gradient';
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonText: string;
  buttonColor: string;
  borderRadius: number;
  shadow: boolean;
  animation: 'none' | 'fade_in' | 'slide_up' | 'bounce';
}

export interface FormTrigger {
  type: 'time_delay' | 'scroll_percentage' | 'exit_intent' | 'page_views' | 'inactivity';
  value?: number; // seconds for time_delay, percentage for scroll, etc.
  conditions?: {
    pages?: string[];
    userSegment?: string[];
    deviceType?: 'desktop' | 'mobile' | 'tablet';
    trafficSource?: string[];
  };
}

export interface ValidationRule {
  field: string;
  type: 'email' | 'phone' | 'min_length' | 'max_length' | 'pattern' | 'required' | 'step_complete';
  value?: string | number;
  message: string;
}

export interface AutomationTrigger {
  id: string;
  name: string;
  event: 'form_submission' | 'lead_magnet_download' | 'email_opened' | 'link_clicked';
  conditions?: {
    leadMagnetId?: string;
    formId?: string;
    userTags?: string[];
    timeDelay?: number; // in minutes
  };
  actions: AutomationAction[];
  active: boolean;
}

export interface AutomationAction {
  type: 'send_email' | 'add_tag' | 'update_field' | 'webhook' | 'create_task' | 'add_to_sequence';
  config: any;
  delay?: number; // in minutes
}

export interface LeadData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  customFields: Record<string, any>;
  leadMagnetId: string;
  formId: string;
  source: string;
  ipAddress?: string;
  userAgent?: string;
  submittedAt: Date;
  tags: string[];
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'unsubscribed';
}

export class LeadMagnetIntegration {
  private leadMagnets: Map<string, LeadMagnet> = new Map();
  private optInForms: Map<string, OptInForm> = new Map();
  private automationTriggers: Map<string, AutomationTrigger> = new Map();
  private leads: Map<string, LeadData> = new Map();
  private activeTriggers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Create a new lead magnet
   */
  createLeadMagnet(config: Omit<LeadMagnet, 'id' | 'createdAt'>): LeadMagnet {
    const leadMagnet: LeadMagnet = {
      ...config,
      id: this.generateId(),
      createdAt: new Date()
    };

    this.leadMagnets.set(leadMagnet.id, leadMagnet);
    return leadMagnet;
  }

  /**
   * Create opt-in form for lead magnet
   */
  createOptInForm(config: Omit<OptInForm, 'id'>): OptInForm {
    const form: OptInForm = {
      ...config,
      id: this.generateId()
    };

    this.optInForms.set(form.id, form);
    return form;
  }

  /**
   * Create quick lead magnet with form
   */
  createQuickLeadMagnet(config: {
    name: string;
    title: string;
    description: string;
    type: LeadMagnet['type'];
    fileUrl?: string;
    value: string;
    formPlacement?: OptInForm['placement'];
    buttonText?: string;
    primaryColor?: string;
  }): { leadMagnet: LeadMagnet; form: OptInForm } {
    // Create lead magnet
    const leadMagnet = this.createLeadMagnet({
      name: config.name,
      type: config.type,
      title: config.title,
      description: config.description,
      deliveryMethod: config.fileUrl ? 'download' : 'email',
      fileUrl: config.fileUrl,
      value: config.value,
      active: true
    });

    // Create default form
    const form = this.createOptInForm({
      leadMagnetId: leadMagnet.id,
      name: `${config.name} Form`,
      fields: [
        {
          id: 'email',
          type: 'email',
          name: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email address',
          required: true,
          validation: [
            { field: 'email', type: 'email', message: 'Please enter a valid email address' }
          ]
        },
        {
          id: 'firstName',
          type: 'text',
          name: 'firstName',
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true,
          validation: [
            { field: 'firstName', type: 'min_length', value: 2, message: 'First name must be at least 2 characters' }
          ]
        }
      ],
      design: {
        theme: 'professional',
        primaryColor: config.primaryColor || '#3B82F6',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        buttonText: config.buttonText || 'Get Free Access',
        buttonColor: config.primaryColor || '#3B82F6',
        borderRadius: 8,
        shadow: true,
        animation: 'fade_in'
      },
      placement: config.formPlacement || 'inline',
      triggers: [
        {
          type: 'time_delay',
          value: 5
        }
      ],
      thankYouMessage: `Thank you! Your ${config.type} will be delivered to your email shortly.`,
      active: true
    });

    return { leadMagnet, form };
  }

  /**
   * Submit opt-in form
   */
  async submitForm(formId: string, data: Record<string, any>, context?: {
    source?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ success: boolean; leadId?: string; error?: string }> {
    const form = this.optInForms.get(formId);
    if (!form || !form.active) {
      return { success: false, error: 'Form not found or inactive' };
    }

    const leadMagnet = this.leadMagnets.get(form.leadMagnetId);
    if (!leadMagnet || !leadMagnet.active) {
      return { success: false, error: 'Lead magnet not found or inactive' };
    }

    // Validate form data
    const validation = this.validateFormData(form, data);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    // Create lead record
    const lead: LeadData = {
      id: this.generateId(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      customFields: this.extractCustomFields(form, data),
      leadMagnetId: leadMagnet.id,
      formId: form.id,
      source: context?.source || 'direct',
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent,
      submittedAt: new Date(),
      tags: [leadMagnet.type, 'lead_magnet_subscriber'],
      status: 'new'
    };

    this.leads.set(lead.id, lead);

    // Trigger automations
    await this.triggerAutomations('form_submission', {
      leadId: lead.id,
      formId: form.id,
      leadMagnetId: leadMagnet.id
    });

    // Deliver lead magnet
    await this.deliverLeadMagnet(leadMagnet, lead);

    return { success: true, leadId: lead.id };
  }

  /**
   * Create automation trigger
   */
  createAutomationTrigger(config: Omit<AutomationTrigger, 'id'>): AutomationTrigger {
    const trigger: AutomationTrigger = {
      ...config,
      id: this.generateId()
    };

    this.automationTriggers.set(trigger.id, trigger);
    return trigger;
  }

  /**
   * Create email sequence automation
   */
  createEmailSequence(config: {
    name: string;
    leadMagnetId: string;
    emails: {
      subject: string;
      content: string;
      delay: number; // days after opt-in
    }[];
  }): AutomationTrigger[] {
    return config.emails.map((email, index) => {
      return this.createAutomationTrigger({
        name: `${config.name} - Email ${index + 1}`,
        event: index === 0 ? 'form_submission' : 'email_opened',
        conditions: {
          leadMagnetId: config.leadMagnetId,
          timeDelay: email.delay * 24 * 60 // convert days to minutes
        },
        actions: [
          {
            type: 'send_email',
            config: {
              subject: email.subject,
              content: email.content,
              template: 'default'
            },
            delay: email.delay * 24 * 60
          }
        ],
        active: true
      });
    });
  }

  /**
   * Get form for display
   */
  getFormForDisplay(formId: string, userContext?: any): OptInForm | null {
    const form = this.optInForms.get(formId);
    if (!form || !form.active) return null;

    // Check if form should be shown based on triggers
    const shouldShow = form.triggers.some(trigger => 
      this.evaluateTrigger(trigger, userContext)
    );

    return shouldShow ? form : null;
  }

  /**
   * Get lead magnet by ID
   */
  getLeadMagnet(id: string): LeadMagnet | undefined {
    return this.leadMagnets.get(id);
  }

  /**
   * Get all leads for a lead magnet
   */
  getLeadsForMagnet(leadMagnetId: string): LeadData[] {
    return Array.from(this.leads.values())
      .filter(lead => lead.leadMagnetId === leadMagnetId);
  }

  /**
   * Get conversion stats
   */
  getConversionStats(leadMagnetId: string): {
    totalLeads: number;
    conversionRate: number;
    recentLeads: LeadData[];
  } {
    const leads = this.getLeadsForMagnet(leadMagnetId);
    const recentLeads = leads
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
      .slice(0, 10);

    return {
      totalLeads: leads.length,
      conversionRate: 0, // Would need impression data to calculate
      recentLeads
    };
  }

  private validateFormData(form: OptInForm, data: Record<string, any>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    for (const field of form.fields) {
      const value = data[field.name];

      // Check required fields
      if (field.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field.label} is required`);
        continue;
      }

      // Run validation rules
      if (value && field.validation) {
        for (const rule of field.validation) {
          if (!this.validateField(value, rule)) {
            errors.push(rule.message);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateField(value: any, rule: ValidationRule): boolean {
    switch (rule.type) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^\+?[\d\s\-\(\)]+$/.test(value);
      case 'min_length':
        return value.toString().length >= (rule.value as number);
      case 'max_length':
        return value.toString().length <= (rule.value as number);
      case 'pattern':
        return new RegExp(rule.value as string).test(value);
      default:
        return true;
    }
  }

  private extractCustomFields(form: OptInForm, data: Record<string, any>): Record<string, any> {
    const standardFields = ['email', 'firstName', 'lastName', 'phone'];
    const customFields: Record<string, any> = {};

    for (const field of form.fields) {
      if (!standardFields.includes(field.name) && data[field.name] !== undefined) {
        customFields[field.name] = data[field.name];
      }
    }

    return customFields;
  }

  private async deliverLeadMagnet(leadMagnet: LeadMagnet, lead: LeadData): Promise<void> {
    switch (leadMagnet.deliveryMethod) {
      case 'email':
        // Send email with lead magnet
        await this.sendLeadMagnetEmail(leadMagnet, lead);
        break;
      case 'download':
        // Provide download link (handled by frontend)
        break;
      case 'redirect':
        // Redirect to URL (handled by frontend)
        break;
      case 'access_grant':
        // Grant access to member area
        await this.grantAccess(leadMagnet, lead);
        break;
    }
  }

  private async sendLeadMagnetEmail(leadMagnet: LeadMagnet, lead: LeadData): Promise<void> {
    // Email sending logic would integrate with email service
    console.log(`Sending lead magnet email to ${lead.email}`, {
      leadMagnet: leadMagnet.name,
      lead: lead.id
    });
  }

  private async grantAccess(leadMagnet: LeadMagnet, lead: LeadData): Promise<void> {
    // Access granting logic
    console.log(`Granting access to ${lead.email}`, {
      leadMagnet: leadMagnet.name,
      lead: lead.id
    });
  }

  private async triggerAutomations(event: string, context: any): Promise<void> {
    const triggers = Array.from(this.automationTriggers.values())
      .filter(trigger => trigger.active && trigger.event === event);

    for (const trigger of triggers) {
      if (this.evaluateAutomationConditions(trigger, context)) {
        await this.executeAutomationActions(trigger, context);
      }
    }
  }

  private evaluateAutomationConditions(trigger: AutomationTrigger, context: any): boolean {
    if (!trigger.conditions) return true;

    const { conditions } = trigger;

    if (conditions.leadMagnetId && conditions.leadMagnetId !== context.leadMagnetId) {
      return false;
    }

    if (conditions.formId && conditions.formId !== context.formId) {
      return false;
    }

    return true;
  }

  private async executeAutomationActions(trigger: AutomationTrigger, context: any): Promise<void> {
    for (const action of trigger.actions) {
      if (action.delay && action.delay > 0) {
        // Schedule delayed action
        setTimeout(() => {
          this.executeAction(action, context);
        }, action.delay * 60 * 1000);
      } else {
        await this.executeAction(action, context);
      }
    }
  }

  private async executeAction(action: AutomationAction, context: any): Promise<void> {
    switch (action.type) {
      case 'send_email':
        console.log('Sending automated email', { action: action.config, context });
        break;
      case 'add_tag':
        const lead = this.leads.get(context.leadId);
        if (lead && !lead.tags.includes(action.config.tag)) {
          lead.tags.push(action.config.tag);
        }
        break;
      case 'webhook':
        console.log('Triggering webhook', { url: action.config.url, context });
        break;
    }
  }

  private evaluateTrigger(trigger: FormTrigger, userContext?: any): boolean {
    // Simplified trigger evaluation - would be more complex in real implementation
    return true;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default LeadMagnetIntegration;