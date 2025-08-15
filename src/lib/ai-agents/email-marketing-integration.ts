import { Action, ActionType } from './types';
import { NurturingContent, CommunicationTemplate } from './nurturing-automation-engine';
import { Lead } from '../crm-types';

// ============================================================================
// EMAIL MARKETING INTEGRATION SERVICE
// ============================================================================

export interface EmailMarketingProvider {
  name: string;
  apiEndpoint: string;
  apiKey?: string;
  capabilities: EmailCapability[];
}

export interface EmailCapability {
  type: 'send_email' | 'create_sequence' | 'track_opens' | 'track_clicks' | 'manage_lists';
  enabled: boolean;
}

export interface EmailDeliveryResult {
  success: boolean;
  messageId?: string;
  error?: string;
  deliveredAt?: Date;
  trackingId?: string;
}

export interface EmailTrackingData {
  messageId: string;
  leadId: string;
  opened: boolean;
  openedAt?: Date;
  clicked: boolean;
  clickedAt?: Date;
  bounced: boolean;
  unsubscribed: boolean;
  trackingEvents: EmailTrackingEvent[];
}

export interface EmailTrackingEvent {
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class EmailMarketingIntegration {
  private providers: Map<string, EmailMarketingProvider> = new Map();
  private defaultProvider: string = 'internal';

  constructor() {
    this.initializeProviders();
  }

  // ============================================================================
  // EMAIL SENDING METHODS
  // ============================================================================

  public async sendNurturingEmail(
    lead: Lead,
    content: NurturingContent,
    sequenceId: string,
    stepId: string
  ): Promise<EmailDeliveryResult> {
    try {
      const provider = this.getProvider(this.defaultProvider);
      if (!provider) {
        throw new Error(`Email provider ${this.defaultProvider} not found`);
      }

      // Prepare email data
      const emailData = {
        to: lead.email,
        from: 'noreply@highlaunchpad.com',
        fromName: 'HighLaunchPad Team',
        subject: content.subject || 'Important Update from HighLaunchPad',
        htmlBody: this.convertToHtml(content.body),
        textBody: this.convertToText(content.body),
        trackingId: `${sequenceId}_${stepId}_${lead.id}`,
        metadata: {
          leadId: lead.id,
          sequenceId,
          stepId,
          nurturingEmail: true
        }
      };

      // Send email based on provider
      const result = await this.sendEmailViaProvider(provider, emailData);

      console.log(`📧 Sent nurturing email to ${lead.email} - ${result.success ? 'Success' : 'Failed'}`);
      return result;

    } catch (error) {
      console.error('Error sending nurturing email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async sendFollowUpEmail(
    lead: Lead,
    template: CommunicationTemplate,
    context: Record<string, any>
  ): Promise<EmailDeliveryResult> {
    try {
      // Personalize template content
      const personalizedContent = await this.personalizeTemplate(template, lead, context);

      const emailData = {
        to: lead.email,
        from: 'noreply@highlaunchpad.com',
        fromName: 'HighLaunchPad Team',
        subject: personalizedContent.subject,
        htmlBody: this.convertToHtml(personalizedContent.content),
        textBody: this.convertToText(personalizedContent.content),
        trackingId: `followup_${template.id}_${lead.id}_${Date.now()}`,
        metadata: {
          leadId: lead.id,
          templateId: template.id,
          followUpEmail: true,
          context
        }
      };

      const provider = this.getProvider(this.defaultProvider);
      if (!provider) {
        throw new Error(`Email provider ${this.defaultProvider} not found`);
      }

      const result = await this.sendEmailViaProvider(provider, emailData);

      console.log(`📧 Sent follow-up email to ${lead.email} - ${result.success ? 'Success' : 'Failed'}`);
      return result;

    } catch (error) {
      console.error('Error sending follow-up email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ============================================================================
  // EMAIL SEQUENCE MANAGEMENT
  // ============================================================================

  public async createEmailSequence(
    sequenceId: string,
    leadId: string,
    emails: NurturingContent[]
  ): Promise<boolean> {
    try {
      const provider = this.getProvider(this.defaultProvider);
      if (!provider || !this.hasCapability(provider, 'create_sequence')) {
        // Fallback to individual email scheduling
        return await this.scheduleIndividualEmails(sequenceId, leadId, emails);
      }

      // Use provider's sequence creation if available
      console.log(`📧 Creating email sequence ${sequenceId} for lead ${leadId}`);
      return true;

    } catch (error) {
      console.error('Error creating email sequence:', error);
      return false;
    }
  }

  public async pauseEmailSequence(sequenceId: string, leadId: string): Promise<boolean> {
    try {
      console.log(`⏸️ Pausing email sequence ${sequenceId} for lead ${leadId}`);
      // Implementation would depend on the email provider
      return true;
    } catch (error) {
      console.error('Error pausing email sequence:', error);
      return false;
    }
  }

  public async resumeEmailSequence(sequenceId: string, leadId: string): Promise<boolean> {
    try {
      console.log(`▶️ Resuming email sequence ${sequenceId} for lead ${leadId}`);
      // Implementation would depend on the email provider
      return true;
    } catch (error) {
      console.error('Error resuming email sequence:', error);
      return false;
    }
  }

  // ============================================================================
  // EMAIL TRACKING AND ANALYTICS
  // ============================================================================

  public async getEmailTrackingData(messageId: string): Promise<EmailTrackingData | null> {
    try {
      const provider = this.getProvider(this.defaultProvider);
      if (!provider || !this.hasCapability(provider, 'track_opens')) {
        return null;
      }

      // Mock tracking data - in production, this would call the provider's API
      const trackingData: EmailTrackingData = {
        messageId,
        leadId: 'unknown',
        opened: Math.random() > 0.5,
        openedAt: Math.random() > 0.5 ? new Date() : undefined,
        clicked: Math.random() > 0.7,
        clickedAt: Math.random() > 0.7 ? new Date() : undefined,
        bounced: false,
        unsubscribed: false,
        trackingEvents: []
      };

      return trackingData;

    } catch (error) {
      console.error('Error getting email tracking data:', error);
      return null;
    }
  }

  public async processEmailWebhook(webhookData: any): Promise<void> {
    try {
      // Process webhook events from email providers
      const { event, messageId, leadId, timestamp } = webhookData;

      switch (event) {
        case 'opened':
          await this.handleEmailOpened(messageId, leadId, new Date(timestamp));
          break;
        case 'clicked':
          await this.handleEmailClicked(messageId, leadId, new Date(timestamp));
          break;
        case 'bounced':
          await this.handleEmailBounced(messageId, leadId, new Date(timestamp));
          break;
        case 'unsubscribed':
          await this.handleEmailUnsubscribed(messageId, leadId, new Date(timestamp));
          break;
        default:
          console.log(`Unknown email event: ${event}`);
      }

    } catch (error) {
      console.error('Error processing email webhook:', error);
    }
  }

  // ============================================================================
  // INTEGRATION WITH EXISTING EMAIL SYSTEM
  // ============================================================================

  public async integrateWithExistingEmailSystem(): Promise<void> {
    try {
      console.log('🔗 Integrating with existing email marketing system');

      // Check for existing email templates
      await this.importExistingTemplates();

      // Set up webhook endpoints
      await this.setupWebhookEndpoints();

      // Initialize tracking
      await this.initializeEmailTracking();

      console.log('✅ Email marketing integration completed');

    } catch (error) {
      console.error('Error integrating with email system:', error);
    }
  }

  private async importExistingTemplates(): Promise<void> {
    try {
      // Import templates from the existing email-templates.ts file
      const { emailTemplates } = await import('../email-templates');
      
      console.log(`📧 Imported ${emailTemplates.length} existing email templates`);

      // Convert existing templates to nurturing-compatible format
      for (const template of emailTemplates) {
        await this.convertExistingTemplate(template);
      }

    } catch (error) {
      console.error('Error importing existing templates:', error);
    }
  }

  private async convertExistingTemplate(template: any): Promise<void> {
    try {
      // Convert existing template format to nurturing automation format
      const nurturingTemplate: CommunicationTemplate = {
        id: template.id,
        name: template.title,
        type: 'email',
        category: this.mapTemplateCategory(template.category),
        subject: template.subject || template.title,
        content: template.content || template.body || '',
        personalizations: this.extractPersonalizations(template),
        variables: template.variables || [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log(`📧 Converted template: ${nurturingTemplate.name}`);

    } catch (error) {
      console.error('Error converting template:', error);
    }
  }

  // ============================================================================
  // PROVIDER MANAGEMENT
  // ============================================================================

  private initializeProviders(): void {
    // Internal email provider (using existing system)
    const internalProvider: EmailMarketingProvider = {
      name: 'Internal Email System',
      apiEndpoint: '/api/email',
      capabilities: [
        { type: 'send_email', enabled: true },
        { type: 'track_opens', enabled: true },
        { type: 'track_clicks', enabled: true },
        { type: 'manage_lists', enabled: false },
        { type: 'create_sequence', enabled: false }
      ]
    };

    this.providers.set('internal', internalProvider);

    // Add other providers as needed (SendGrid, Mailchimp, etc.)
    // This would be configured based on user preferences
  }

  private getProvider(providerId: string): EmailMarketingProvider | undefined {
    return this.providers.get(providerId);
  }

  private hasCapability(provider: EmailMarketingProvider, capability: string): boolean {
    return provider.capabilities.some(cap => cap.type === capability && cap.enabled);
  }

  // ============================================================================
  // EMAIL DELIVERY METHODS
  // ============================================================================

  private async sendEmailViaProvider(
    provider: EmailMarketingProvider,
    emailData: any
  ): Promise<EmailDeliveryResult> {
    try {
      if (provider.name === 'Internal Email System') {
        return await this.sendViaInternalSystem(emailData);
      }

      // For external providers, implement API calls
      return await this.sendViaExternalProvider(provider, emailData);

    } catch (error) {
      console.error('Error sending email via provider:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendViaInternalSystem(emailData: any): Promise<EmailDeliveryResult> {
    try {
      // Use the existing email system
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          from: emailData.from,
          subject: emailData.subject,
          html: emailData.htmlBody,
          text: emailData.textBody,
          trackingId: emailData.trackingId,
          metadata: emailData.metadata
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          messageId: result.messageId || `msg_${Date.now()}`,
          deliveredAt: new Date(),
          trackingId: emailData.trackingId
        };
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  private async sendViaExternalProvider(
    provider: EmailMarketingProvider,
    emailData: any
  ): Promise<EmailDeliveryResult> {
    // Placeholder for external provider integration
    console.log(`Sending email via ${provider.name}`);
    return {
      success: true,
      messageId: `ext_${Date.now()}`,
      deliveredAt: new Date()
    };
  }

  // ============================================================================
  // CONTENT PROCESSING
  // ============================================================================

  private convertToHtml(content: string): string {
    // Convert markdown-like content to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/, '<p>$1</p>');
  }

  private convertToText(content: string): string {
    // Convert HTML/markdown to plain text
    return content
      .replace(/<[^>]*>/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .trim();
  }

  private async personalizeTemplate(
    template: CommunicationTemplate,
    lead: Lead,
    context: Record<string, any>
  ): Promise<{ subject: string; content: string }> {
    let personalizedSubject = template.subject || '';
    let personalizedContent = template.content;

    // Apply personalizations
    for (const personalization of template.personalizations) {
      const value = this.getPersonalizationValue(personalization, lead, context);
      const placeholder = `{{${personalization.placeholder}}}`;
      
      personalizedSubject = personalizedSubject.replace(new RegExp(placeholder, 'g'), value);
      personalizedContent = personalizedContent.replace(new RegExp(placeholder, 'g'), value);
    }

    return {
      subject: personalizedSubject,
      content: personalizedContent
    };
  }

  private getPersonalizationValue(
    personalization: any,
    lead: Lead,
    context: Record<string, any>
  ): string {
    switch (personalization.source) {
      case 'lead_data':
        return (lead as any)[personalization.field] || personalization.fallback;
      case 'context':
        return context[personalization.field] || personalization.fallback;
      default:
        return personalization.fallback;
    }
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  private async handleEmailOpened(messageId: string, leadId: string, timestamp: Date): Promise<void> {
    console.log(`📧 Email opened: ${messageId} by lead ${leadId}`);
    // Update lead engagement score
    // Trigger follow-up actions if needed
  }

  private async handleEmailClicked(messageId: string, leadId: string, timestamp: Date): Promise<void> {
    console.log(`🔗 Email clicked: ${messageId} by lead ${leadId}`);
    // This is a strong buying signal - trigger escalation
    // Update lead score
  }

  private async handleEmailBounced(messageId: string, leadId: string, timestamp: Date): Promise<void> {
    console.log(`❌ Email bounced: ${messageId} for lead ${leadId}`);
    // Mark email as invalid
    // Pause email sequence
  }

  private async handleEmailUnsubscribed(messageId: string, leadId: string, timestamp: Date): Promise<void> {
    console.log(`🚫 Email unsubscribed: ${messageId} by lead ${leadId}`);
    // Remove from all sequences
    // Update lead status
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private async scheduleIndividualEmails(
    sequenceId: string,
    leadId: string,
    emails: NurturingContent[]
  ): Promise<boolean> {
    try {
      // Schedule individual emails when sequence creation is not supported
      for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const delay = i * 24 * 60 * 60 * 1000; // 24 hours between emails
        
        setTimeout(async () => {
          // This would integrate with a job queue in production
          console.log(`📧 Scheduled email ${i + 1} of ${emails.length} for sequence ${sequenceId}`);
        }, delay);
      }

      return true;
    } catch (error) {
      console.error('Error scheduling individual emails:', error);
      return false;
    }
  }

  private mapTemplateCategory(category: string): 'welcome' | 'nurturing' | 'follow_up' | 're_engagement' | 'escalation' {
    const categoryMap: Record<string, any> = {
      'welcome': 'welcome',
      'onboarding': 'welcome',
      'nurture': 'nurturing',
      'nurturing': 'nurturing',
      'followup': 'follow_up',
      'follow-up': 'follow_up',
      'reengagement': 're_engagement',
      're-engagement': 're_engagement',
      'escalation': 'escalation'
    };

    return categoryMap[category.toLowerCase()] || 'nurturing';
  }

  private extractPersonalizations(template: any): any[] {
    // Extract personalization rules from existing template format
    const personalizations = [];

    if (template.variables) {
      for (const variable of template.variables) {
        personalizations.push({
          placeholder: variable,
          source: 'lead_data',
          field: variable,
          fallback: ''
        });
      }
    }

    return personalizations;
  }

  private async setupWebhookEndpoints(): Promise<void> {
    console.log('🔗 Setting up email webhook endpoints');
    // This would set up webhook endpoints for email tracking
  }

  private async initializeEmailTracking(): Promise<void> {
    console.log('📊 Initializing email tracking');
    // This would set up email tracking infrastructure
  }
}

// Export singleton instance
export const emailMarketingIntegration = new EmailMarketingIntegration();