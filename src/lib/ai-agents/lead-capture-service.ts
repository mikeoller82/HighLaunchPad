import { EventEmitter } from 'events';
import {
  Lead,
  LeadSource,
  LeadStatus,
  QualificationStatus,
  LeadScore,
  BuyingSignal,
  AIInsights,
  JourneyStage,
  InteractionType,
  CommunicationChannel,
  Priority
} from '../crm-types';

import {
  Event,
  EventType,
  ActionType
} from './types';

import { LeadManagementAgent } from './lead-management-agent';

// Lead Capture Configuration
export interface LeadCaptureConfig {
  enableRealTimeProcessing: boolean;
  enableDataEnrichment: boolean;
  enableAutomaticScoring: boolean;
  enableAutomaticQualification: boolean;
  enableEventGeneration: boolean;
  processingDelay: number; // milliseconds
  enrichmentSources: string[];
  validationRules: LeadValidationRule[];
  duplicateDetection: DuplicateDetectionConfig;
}

// Lead Validation Rules
export interface LeadValidationRule {
  field: string;
  required: boolean;
  type: 'email' | 'phone' | 'text' | 'number' | 'url';
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  customValidator?: (value: any) => boolean;
}

// Duplicate Detection Configuration
export interface DuplicateDetectionConfig {
  enabled: boolean;
  matchFields: string[];
  fuzzyMatching: boolean;
  threshold: number; // 0-1 scale for fuzzy matching
  action: 'merge' | 'skip' | 'flag' | 'create_anyway';
}

// Lead Enrichment Data
export interface LeadEnrichmentData {
  source: string;
  confidence: number; // 0-1 scale
  data: Record<string, any>;
  timestamp: Date;
}

// Lead Processing Result
export interface LeadProcessingResult {
  success: boolean;
  leadId?: string;
  lead?: Lead;
  score?: LeadScore;
  qualification?: QualificationStatus;
  assignedTo?: string;
  errors?: string[];
  warnings?: string[];
  enrichmentData?: LeadEnrichmentData[];
  duplicateCheck?: {
    isDuplicate: boolean;
    matchedLeads?: string[];
    confidence?: number;
  };
  processingTime: number;
  eventsGenerated: Event[];
}

// Raw Lead Data from Forms
export interface RawLeadData {
  // Basic Information
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  
  // Source Information
  source: LeadSource;
  sourceDetails?: {
    formId?: string;
    pageUrl?: string;
    referrer?: string;
    campaign?: string;
    medium?: string;
    utmParameters?: Record<string, string>;
  };
  
  // Additional Data
  message?: string;
  interests?: string[];
  budget?: string;
  timeline?: string;
  
  // Tracking Data
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  
  // Custom Fields
  customFields?: Record<string, any>;
  
  // Metadata
  capturedAt: Date;
  workspaceId: string;
}

// Lead Capture and Processing Service
export class LeadCaptureService extends EventEmitter {
  private config: LeadCaptureConfig;
  private leadAgent: LeadManagementAgent;
  private processingQueue: RawLeadData[] = [];
  private isProcessing: boolean = false;
  private enrichmentProviders: Map<string, EnrichmentProvider> = new Map();

  constructor(config: LeadCaptureConfig, leadAgent: LeadManagementAgent) {
    super();
    this.config = config;
    this.leadAgent = leadAgent;
    
    // Initialize enrichment providers
    this.initializeEnrichmentProviders();
    
    // Start processing queue if real-time processing is enabled
    if (config.enableRealTimeProcessing) {
      this.startProcessingQueue();
    }
  }

  // Main lead capture method
  public async captureLead(rawLeadData: RawLeadData): Promise<LeadProcessingResult> {
    const startTime = Date.now();
    const result: LeadProcessingResult = {
      success: false,
      errors: [],
      warnings: [],
      processingTime: 0,
      eventsGenerated: []
    };

    try {
      console.log(`📥 Capturing lead from ${rawLeadData.source}: ${rawLeadData.email}`);

      // Step 1: Validate lead data
      const validationResult = await this.validateLeadData(rawLeadData);
      if (!validationResult.isValid) {
        result.errors = validationResult.errors;
        result.processingTime = Date.now() - startTime;
        return result;
      }

      // Step 2: Check for duplicates
      if (this.config.duplicateDetection.enabled) {
        const duplicateCheck = await this.checkForDuplicates(rawLeadData);
        result.duplicateCheck = duplicateCheck;
        
        if (duplicateCheck.isDuplicate && this.config.duplicateDetection.action === 'skip') {
          result.warnings?.push('Lead skipped due to duplicate detection');
          result.success = true;
          result.processingTime = Date.now() - startTime;
          return result;
        }
      }

      // Step 3: Create lead record
      const lead = await this.createLeadRecord(rawLeadData);
      result.lead = lead;
      result.leadId = lead.id;

      // Step 4: Enrich lead data
      if (this.config.enableDataEnrichment) {
        const enrichmentData = await this.enrichLeadData(lead);
        result.enrichmentData = enrichmentData;
        
        // Update lead with enriched data
        await this.updateLeadWithEnrichment(lead, enrichmentData);
      }

      // Step 5: Score the lead
      if (this.config.enableAutomaticScoring) {
        const score = await this.leadAgent.scoreLead(lead);
        result.score = score;
        lead.score = score;
      }

      // Step 6: Qualify the lead
      if (this.config.enableAutomaticQualification && result.score) {
        const qualification = this.leadAgent.qualifyLead(result.score.total);
        result.qualification = qualification;
        lead.qualification = qualification;
      }

      // Step 7: Assign the lead
      const assignedUserId = await this.leadAgent.assignLead(lead);
      if (assignedUserId) {
        result.assignedTo = assignedUserId;
        lead.assignedTo = assignedUserId;
        lead.assignedAt = new Date();
      }

      // Step 8: Generate events
      if (this.config.enableEventGeneration) {
        const events = await this.generateEvents(lead, rawLeadData);
        result.eventsGenerated = events;
        
        // Emit events for processing
        for (const event of events) {
          this.emit('leadEvent', event);
        }
      }

      // Step 9: Add to processing queue for real-time processing
      if (this.config.enableRealTimeProcessing) {
        this.addToProcessingQueue(rawLeadData);
      }

      result.success = true;
      result.processingTime = Date.now() - startTime;

      console.log(`✅ Lead captured successfully: ${lead.id} (${result.processingTime}ms)`);
      
      // Emit success event
      this.emit('leadCaptured', { lead, result });

      return result;

    } catch (error) {
      console.error('❌ Lead capture failed:', error);
      result.errors?.push(error instanceof Error ? error.message : String(error));
      result.processingTime = Date.now() - startTime;
      
      // Emit error event
      this.emit('leadCaptureError', { rawLeadData, error, result });
      
      return result;
    }
  }

  // Batch lead processing
  public async captureLeads(rawLeadsData: RawLeadData[]): Promise<LeadProcessingResult[]> {
    console.log(`📥 Batch capturing ${rawLeadsData.length} leads`);
    
    const results: LeadProcessingResult[] = [];
    const batchSize = 10; // Process in batches to avoid overwhelming the system
    
    for (let i = 0; i < rawLeadsData.length; i += batchSize) {
      const batch = rawLeadsData.slice(i, i + batchSize);
      const batchPromises = batch.map(rawLead => this.captureLead(rawLead));
      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            success: false,
            errors: [result.reason?.message || 'Unknown error'],
            processingTime: 0,
            eventsGenerated: []
          });
        }
      }
      
      // Small delay between batches
      if (i + batchSize < rawLeadsData.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`✅ Batch processing completed: ${results.filter(r => r.success).length}/${results.length} successful`);
    return results;
  }

  // Integration with existing forms
  public async integrateWithForm(formId: string, formData: Record<string, any>): Promise<LeadProcessingResult> {
    console.log(`📝 Processing form submission: ${formId}`);
    
    // Map form data to raw lead data
    const rawLeadData: RawLeadData = {
      firstName: formData.firstName || formData.first_name || formData.name?.split(' ')[0],
      lastName: formData.lastName || formData.last_name || formData.name?.split(' ').slice(1).join(' '),
      email: formData.email,
      phone: formData.phone || formData.phoneNumber || formData.phone_number,
      company: formData.company || formData.organization,
      jobTitle: formData.jobTitle || formData.job_title || formData.title,
      message: formData.message || formData.comments || formData.notes,
      interests: this.parseInterests(formData.interests || formData.services),
      budget: formData.budget,
      timeline: formData.timeline,
      source: this.determineLeadSource(formData.source || 'website_form'),
      sourceDetails: {
        formId,
        pageUrl: formData.pageUrl || formData.page_url,
        referrer: formData.referrer,
        campaign: formData.campaign || formData.utm_campaign,
        medium: formData.medium || formData.utm_medium,
        utmParameters: this.extractUtmParameters(formData)
      },
      customFields: this.extractCustomFields(formData),
      capturedAt: new Date(),
      workspaceId: formData.workspaceId || 'default'
    };

    return this.captureLead(rawLeadData);
  }

  // Real-time lead processing pipeline
  private async startProcessingQueue(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log('🔄 Starting real-time lead processing queue');
    
    const processQueue = async () => {
      while (this.processingQueue.length > 0) {
        const rawLead = this.processingQueue.shift();
        if (rawLead) {
          try {
            await this.processLeadInRealTime(rawLead);
          } catch (error) {
            console.error('❌ Real-time processing error:', error);
          }
        }
        
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, this.config.processingDelay));
      }
      
      // Continue processing after a short delay
      setTimeout(processQueue, 1000);
    };
    
    processQueue();
  }

  private async processLeadInRealTime(rawLead: RawLeadData): Promise<void> {
    console.log(`⚡ Real-time processing lead: ${rawLead.email}`);
    
    // Generate additional events for real-time processing
    const events: Event[] = [
      {
        id: `realtime_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        type: EventType.DATA_UPDATED,
        timestamp: new Date(),
        source: 'lead_capture_service',
        data: {
          leadData: rawLead,
          processingType: 'realtime',
          enrichmentNeeded: true
        },
        priority: 7
      }
    ];
    
    // Emit events for agent processing
    for (const event of events) {
      this.emit('realtimeEvent', event);
    }
  }

  private addToProcessingQueue(rawLead: RawLeadData): void {
    this.processingQueue.push(rawLead);
    console.log(`📋 Added to processing queue: ${this.processingQueue.length} items`);
  }

  // Lead data validation
  private async validateLeadData(rawLead: RawLeadData): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    // Apply validation rules
    for (const rule of this.config.validationRules) {
      const value = (rawLead as any)[rule.field];
      
      // Required field check
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors.push(`${rule.field} is required`);
        continue;
      }
      
      // Skip further validation if field is empty and not required
      if (!value) continue;
      
      // Type validation
      switch (rule.type) {
        case 'email':
          if (!this.isValidEmail(value)) {
            errors.push(`${rule.field} must be a valid email address`);
          }
          break;
        case 'phone':
          if (!this.isValidPhone(value)) {
            errors.push(`${rule.field} must be a valid phone number`);
          }
          break;
        case 'url':
          if (!this.isValidUrl(value)) {
            errors.push(`${rule.field} must be a valid URL`);
          }
          break;
      }
      
      // Pattern validation
      if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
        errors.push(`${rule.field} does not match required pattern`);
      }
      
      // Length validation
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${rule.field} must be no more than ${rule.maxLength} characters`);
      }
      
      // Custom validation
      if (rule.customValidator && !rule.customValidator(value)) {
        errors.push(`${rule.field} failed custom validation`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Duplicate detection
  private async checkForDuplicates(rawLead: RawLeadData): Promise<{
    isDuplicate: boolean;
    matchedLeads?: string[];
    confidence?: number;
  }> {
    // This is a simplified implementation
    // In production, this would query the database for existing leads
    
    const matchFields = this.config.duplicateDetection.matchFields;
    const threshold = this.config.duplicateDetection.threshold;
    
    // Simulate duplicate check
    const potentialDuplicates: string[] = [];
    let maxConfidence = 0;
    
    // In a real implementation, this would:
    // 1. Query database for leads with matching email, phone, or other fields
    // 2. Use fuzzy matching algorithms for name/company matching
    // 3. Calculate confidence scores based on field matches
    
    return {
      isDuplicate: potentialDuplicates.length > 0,
      matchedLeads: potentialDuplicates,
      confidence: maxConfidence
    };
  }

  // Create lead record
  private async createLeadRecord(rawLead: RawLeadData): Promise<Lead> {
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    const lead: Lead = {
      id: leadId,
      contactId: `contact_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      firstName: rawLead.firstName || '',
      lastName: rawLead.lastName || '',
      email: rawLead.email,
      phone: rawLead.phone,
      company: rawLead.company,
      
      source: rawLead.source,
      status: LeadStatus.NEW,
      priority: Priority.NORMAL,
      qualification: QualificationStatus.UNQUALIFIED,
      userId: 'system', // TODO: Get actual user ID from context
      
      score: {
        total: 0,
        engagement: 0,
        fit: 0,
        intent: 0,
        timing: 0,
        demographic: 0,
        behavioral: 0,
        firmographic: 0,
        factors: []
      },
      
      journeyStage: JourneyStage.AWARENESS,
      engagementScore: 0,
      conversionProbability: 0,
      
      enrichedData: {},
      tags: rawLead.interests || [],
      
      createdAt: new Date(),
      updatedAt: new Date(),
      
      dataQuality: {
        completeness: this.calculateDataCompleteness(rawLead),
        sources: ['form_submission']
      }
    };
    
    return lead;
  }

  // Data enrichment
  private async enrichLeadData(lead: Lead): Promise<LeadEnrichmentData[]> {
    const enrichmentData: LeadEnrichmentData[] = [];
    
    for (const [source, provider] of Array.from(this.enrichmentProviders.entries())) {
      try {
        const data = await provider.enrich(lead);
        if (data) {
          enrichmentData.push({
            source,
            confidence: data.confidence || 0.7,
            data: data.enrichedData,
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.warn(`⚠️ Enrichment failed for ${source}:`, error);
      }
    }
    
    return enrichmentData;
  }

  private async updateLeadWithEnrichment(lead: Lead, enrichmentData: LeadEnrichmentData[]): Promise<void> {
    for (const enrichment of enrichmentData) {
      // Update lead with enriched data based on confidence
      if (enrichment.confidence > 0.6) {
        lead.enrichedData = lead.enrichedData || {};
        Object.assign(lead.enrichedData, enrichment.data);
      }
    }
    
    // Update data quality score
    lead.dataQuality = lead.dataQuality || { completeness: 0, sources: [] };
    lead.dataQuality.completeness = this.calculateDataCompleteness(lead);
    lead.dataQuality.sources.push(...enrichmentData.map(e => e.source));
    lead.updatedAt = new Date();
  }

  // Event generation
  private async generateEvents(lead: Lead, rawLead: RawLeadData): Promise<Event[]> {
    const events: Event[] = [];
    
    // Lead captured event
    events.push({
      id: `lead_captured_${lead.id}_${Date.now()}`,
      type: EventType.LEAD_CAPTURED,
      timestamp: new Date(),
      source: 'lead_capture_service',
      data: {
        lead,
        rawData: rawLead,
        source: rawLead.source,
        formId: rawLead.sourceDetails?.formId
      },
      priority: 8,
      leadId: lead.id
    });
    
    // Customer interaction event if there's a message
    if (rawLead.message) {
      events.push({
        id: `interaction_${lead.id}_${Date.now()}`,
        type: EventType.CUSTOMER_INTERACTION,
        timestamp: new Date(),
        source: 'form_submission',
        data: {
          type: InteractionType.FORM_SUBMISSION,
          content: rawLead.message,
          channel: CommunicationChannel.CHAT,
          leadId: lead.id
        },
        priority: 6,
        leadId: lead.id
      });
    }
    
    return events;
  }

  // Helper methods
  private initializeEnrichmentProviders(): void {
    // Initialize mock enrichment providers
    this.enrichmentProviders.set('company_info', new MockCompanyEnrichmentProvider());
    this.enrichmentProviders.set('social_profiles', new MockSocialEnrichmentProvider());
  }

  private parseInterests(interests: any): string[] {
    if (Array.isArray(interests)) return interests;
    if (typeof interests === 'string') return interests.split(',').map(s => s.trim());
    return [];
  }

  private determineLeadSource(source: string): LeadSource {
    const sourceMap: Record<string, LeadSource> = {
      'website_form': LeadSource.WEBSITE_FORM,
      'social_media': LeadSource.SOCIAL_MEDIA,
      'email_campaign': LeadSource.EMAIL_CAMPAIGN,
      'referral': LeadSource.REFERRAL,
      'paid_advertising': LeadSource.PAID_ADVERTISING,
      'organic_search': LeadSource.ORGANIC_SEARCH,
      'direct': LeadSource.DIRECT,
      'webinar': LeadSource.WEBINAR,
      'content_download': LeadSource.CONTENT_DOWNLOAD,
      'phone_call': LeadSource.PHONE_CALL,
      'trade_show': LeadSource.TRADE_SHOW,
      'partner': LeadSource.PARTNER
    };
    
    return sourceMap[source.toLowerCase()] || LeadSource.OTHER;
  }

  private extractUtmParameters(formData: Record<string, any>): Record<string, string> {
    const utmParams: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (key.startsWith('utm_') && value) {
        utmParams[key] = String(value);
      }
    }
    
    return utmParams;
  }

  private extractCustomFields(formData: Record<string, any>): Record<string, any> {
    const standardFields = [
      'firstName', 'first_name', 'lastName', 'last_name', 'name',
      'email', 'phone', 'phoneNumber', 'phone_number',
      'company', 'organization', 'jobTitle', 'job_title', 'title',
      'message', 'comments', 'notes', 'interests', 'services',
      'budget', 'timeline', 'source', 'pageUrl', 'page_url',
      'referrer', 'campaign', 'utm_campaign', 'medium', 'utm_medium',
      'workspaceId'
    ];
    
    const customFields: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (!standardFields.includes(key) && !key.startsWith('utm_')) {
        customFields[key] = value;
      }
    }
    
    return customFields;
  }

  private calculateDataCompleteness(data: any): number {
    const requiredFields = ['firstName', 'lastName', 'email', 'company'];
    const optionalFields = ['phone', 'jobTitle', 'message'];
    
    let completedRequired = 0;
    let completedOptional = 0;
    
    for (const field of requiredFields) {
      if (data[field] && data[field].toString().trim() !== '') {
        completedRequired++;
      }
    }
    
    for (const field of optionalFields) {
      if (data[field] && data[field].toString().trim() !== '') {
        completedOptional++;
      }
    }
    
    // Required fields are weighted more heavily
    const requiredWeight = 0.7;
    const optionalWeight = 0.3;
    
    const requiredScore = (completedRequired / requiredFields.length) * requiredWeight;
    const optionalScore = (completedOptional / optionalFields.length) * optionalWeight;
    
    return Math.min(1, requiredScore + optionalScore);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Public methods for configuration
  public updateConfig(newConfig: Partial<LeadCaptureConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 Lead capture configuration updated');
  }

  public getStats(): {
    queueSize: number;
    isProcessing: boolean;
    enrichmentProviders: string[];
  } {
    return {
      queueSize: this.processingQueue.length,
      isProcessing: this.isProcessing,
      enrichmentProviders: Array.from(this.enrichmentProviders.keys())
    };
  }
}

// Enrichment Provider Interface
interface EnrichmentProvider {
  enrich(lead: Lead): Promise<{ confidence: number; enrichedData: Record<string, any> } | null>;
}

// Mock enrichment providers for testing
class MockCompanyEnrichmentProvider implements EnrichmentProvider {
  async enrich(lead: Lead): Promise<{ confidence: number; enrichedData: Record<string, any> } | null> {
    if (!lead.company) return null;
    
    // Simulate company data enrichment
    return {
      confidence: 0.8,
      enrichedData: {
        companyInfo: {
          industry: 'Technology',
          size: '100-499',
          revenue: '$10M-$50M',
          website: `https://${lead.company.toLowerCase().replace(/\s+/g, '')}.com`,
          location: 'San Francisco, CA'
        }
      }
    };
  }
}

class MockSocialEnrichmentProvider implements EnrichmentProvider {
  async enrich(lead: Lead): Promise<{ confidence: number; enrichedData: Record<string, any> } | null> {
    if (!lead.email) return null;
    
    // Simulate social profile enrichment
    return {
      confidence: 0.6,
      enrichedData: {
        socialProfiles: {
          linkedin: `https://linkedin.com/in/${lead.firstName?.toLowerCase()}-${lead.lastName?.toLowerCase()}`,
          twitter: `@${lead.firstName?.toLowerCase()}${lead.lastName?.toLowerCase()}`
        }
      }
    };
  }
}

// Factory function to create a configured Lead Capture Service
export function createLeadCaptureService(
  leadAgent: LeadManagementAgent,
  config?: Partial<LeadCaptureConfig>
): LeadCaptureService {
  const defaultConfig: LeadCaptureConfig = {
    enableRealTimeProcessing: true,
    enableDataEnrichment: true,
    enableAutomaticScoring: true,
    enableAutomaticQualification: true,
    enableEventGeneration: true,
    processingDelay: 1000, // 1 second
    enrichmentSources: ['company_info', 'social_profiles'],
    validationRules: [
      {
        field: 'email',
        required: true,
        type: 'email'
      },
      {
        field: 'firstName',
        required: false,
        type: 'text',
        minLength: 1,
        maxLength: 50
      },
      {
        field: 'lastName',
        required: false,
        type: 'text',
        minLength: 1,
        maxLength: 50
      },
      {
        field: 'phone',
        required: false,
        type: 'phone'
      }
    ],
    duplicateDetection: {
      enabled: true,
      matchFields: ['email', 'phone'],
      fuzzyMatching: true,
      threshold: 0.8,
      action: 'flag'
    }
  };

  const finalConfig = { ...defaultConfig, ...config };
  return new LeadCaptureService(finalConfig, leadAgent);
}