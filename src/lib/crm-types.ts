// Enhanced CRM Data Models for Agentic AI Platform

// ============================================================================
// CORE ENUMS AND TYPES
// ============================================================================

export enum LeadSource {
  WEBSITE_FORM = 'website_form',
  SOCIAL_MEDIA = 'social_media',
  EMAIL_CAMPAIGN = 'email_campaign',
  REFERRAL = 'referral',
  PAID_ADVERTISING = 'paid_advertising',
  ORGANIC_SEARCH = 'organic_search',
  DIRECT = 'direct',
  WEBINAR = 'webinar',
  CONTENT_DOWNLOAD = 'content_download',
  PHONE_CALL = 'phone_call',
  TRADE_SHOW = 'trade_show',
  PARTNER = 'partner',
  OTHER = 'other'
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  NURTURING = 'nurturing',
  CONVERTED = 'converted',
  LOST = 'lost',
  UNQUALIFIED = 'unqualified'
}

export enum QualificationStatus {
  UNQUALIFIED = 'unqualified',
  MARKETING_QUALIFIED = 'marketing_qualified',
  SALES_QUALIFIED = 'sales_qualified',
  OPPORTUNITY = 'opportunity'
}

export enum Priority {
  LOW = 'low',
  NORMAL = 'normal',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum InteractionType {
  EMAIL = 'email',
  PHONE = 'phone',
  MEETING = 'meeting',
  NOTE = 'note',
  TASK = 'task',
  SMS = 'sms',
  SOCIAL = 'social',
  FORM_SUBMISSION = 'form_submission'
}

export enum TagCategory {
  LEAD_SOURCE = 'lead_source',
  INDUSTRY = 'industry',
  COMPANY_SIZE = 'company_size',
  PRIORITY = 'priority',
  STATUS = 'status',
  BEHAVIOR = 'behavior',
  CUSTOM = 'custom'
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  avatar?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  notes?: string;
  tags: string[];
  customFields: Record<string, any>;
  userId: string;
  isActive: boolean;
  lastContactedAt?: any;
  createdAt: any;
  updatedAt: any;
}

export interface Lead {
  id: string;
  contactId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: Priority;
  estimatedValue?: number;
  notes?: string;
  tags?: string[];
  userId: string;
  score?: LeadScore;
  qualification?: QualificationStatus;
  journeyStage?: JourneyStage;
  engagementScore?: number;
  conversionProbability?: number;
  assignedTo?: string;
  assignedAt?: Date;
  enrichedData?: Record<string, any>;
  dataQuality?: {
    completeness: number;
    sources: string[];
  };
  createdAt: any;
  updatedAt: any;
}

export interface LeadScore {
  total: number;
  engagement: number;
  fit: number;
  intent: number;
  timing: number;
  // Legacy properties for backward compatibility
  demographic?: number;
  behavioral?: number;
  firmographic?: number;
  factors?: ScoringFactor[];
}

export interface BuyingSignal {
  type: string;
  strength: number; // 0-1 scale
  description: string;
  detectedAt: Date;
  source: string;
  metadata?: Record<string, any>;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  contactId: string;
  type: InteractionType;
  title: string;
  description?: string;
  outcome?: string;
  scheduledAt?: any;
  completedAt?: any;
  userId: string;
  createdBy: string;
  timestamp: any;
}

// ============================================================================
// PIPELINE TYPES
// ============================================================================

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
  isDefault?: boolean;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  stages: PipelineStage[];
  userId: string;
  isDefault: boolean;
  isActive: boolean;
  createdBy?: string;
  healthMetrics?: PipelineHealthMetrics;
  createdAt: any;
  updatedAt: any;
}

// ============================================================================
// TAG TYPES
// ============================================================================

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color: string;
  category: TagCategory;
  isActive: boolean;
  userId: string;
  usageCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface AutoTagRule {
  id: string;
  name: string;
  description?: string;
  conditions: AutoTagCondition[];
  tagIds: string[];
  isActive: boolean;
  userId: string;
  triggerCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface AutoTagCondition {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than';
  value: string;
}

// ============================================================================
// AI RECOMMENDATION TYPES
// ============================================================================

export interface NextBestAction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'follow_up' | 'nurture' | 'qualify' | 'demo';
  title: string;
  description: string;
  priority: Priority;
  confidence: number; // 0-1 scale
  reasoning: string;
  suggestedAt: Date;
  dueDate?: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// MISSING TYPES FOR AI AGENTS
// ============================================================================

export interface AIInsights {
  id: string;
  leadId: string;
  type: 'behavioral' | 'demographic' | 'engagement' | 'intent';
  insight: string;
  confidence: number;
  generatedAt: Date;
  metadata?: Record<string, any>;
}

export interface NurturingSequence {
  id: string;
  name: string;
  steps: NurturingStep[];
  triggerConditions: Record<string, any>;
  isActive: boolean;
}

export interface NurturingStep {
  id: string;
  order: number;
  type: 'email' | 'sms' | 'call' | 'task';
  content: string;
  delayHours: number;
}

export interface EscalationTrigger {
  id: string;
  name: string;
  conditions: Record<string, any>;
  action: string;
  priority: Priority;
}

export enum JourneyStage {
  AWARENESS = 'awareness',
  INTEREST = 'interest',
  CONSIDERATION = 'consideration',
  INTENT = 'intent',
  EVALUATION = 'evaluation',
  PURCHASE = 'purchase'
}

export interface ScoringFactor {
  name: string;
  weight: number;
  value: number;
  category: 'demographic' | 'behavioral' | 'engagement' | 'firmographic';
}

export enum CommunicationChannel {
  EMAIL = 'email',
  PHONE = 'phone',
  SMS = 'sms',
  SOCIAL = 'social',
  CHAT = 'chat',
  VIDEO = 'video'
}

// Add missing InteractionType values
export enum InteractionTypeExtended {
  EMAIL = 'email',
  PHONE = 'phone',
  MEETING = 'meeting',
  NOTE = 'note',
  TASK = 'task',
  SMS = 'sms',
  SOCIAL = 'social',
  FORM_SUBMISSION = 'form_submission'
}

// ============================================================================
// DEAL AND SALES TYPES
// ============================================================================

export enum DealStatus {
  OPEN = 'open',
  WON = 'won',
  LOST = 'lost',
  PENDING = 'pending'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface Deal {
  id: string;
  title: string;
  description?: string;
  value: number;
  currency: string;
  stage: PipelineStage;
  status: DealStatus;
  probability: number;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  leadId?: string;
  contactId: string;
  assignedTo: string;
  tags: string[];
  customFields: Record<string, any>;
  userId: string;
  createdAt: any;
  updatedAt: any;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  segment: CustomerSegment;
  lifetime_value: number;
  tags: string[];
  userId: string;
  createdAt: any;
  updatedAt: any;
}

export enum CustomerSegment {
  ENTERPRISE = 'enterprise',
  SMB = 'smb',
  STARTUP = 'startup',
  INDIVIDUAL = 'individual'
}

export interface Interaction {
  id: string;
  type: InteractionType;
  title: string;
  description: string;
  contactId: string;
  userId: string;
  timestamp: any;
  metadata?: Record<string, any>;
}

export interface DealPredictions {
  id: string;
  dealId: string;
  winProbability: number;
  expectedCloseDate: Date;
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
  generatedAt: Date;
}

export interface RiskAssessment {
  id: string;
  dealId: string;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  mitigation: string[];
  assessedAt: Date;
}

export interface RiskFactor {
  type: string;
  severity: number;
  description: string;
  impact: string;
}

export interface ForecastingData {
  period: string;
  totalValue: number;
  dealCount: number;
  winRate: number;
  averageDealSize: number;
  pipeline: Deal[];
}

export interface PipelineHealthMetrics {
  conversionRates: Record<string, number>;
  averageTimeInStage: Record<string, number>;
  bottlenecks: string[];
  recommendations: string[];
}