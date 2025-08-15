import {
  Event,
  Action,
  ActionType,
  EventType,
  DecisionContext,
  ExecutionResult
} from './types';

import {
  Lead,
  LeadScore,
  BuyingSignal,
  NurturingSequence,
  NurturingStep,
  EscalationTrigger,
  Priority,
  InteractionType,
  CommunicationChannel,
  QualificationStatus,
  JourneyStage
} from '../crm-types';

// ============================================================================
// NURTURING SEQUENCE TYPES
// ============================================================================

export interface NurturingTemplate {
  id: string;
  name: string;
  description: string;
  targetAudience: string[];
  triggerConditions: NurturingTriggerCondition[];
  steps: NurturingSequenceStep[];
  exitConditions: NurturingExitCondition[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NurturingSequenceStep {
  id: string;
  order: number;
  type: 'email' | 'sms' | 'call_task' | 'social_follow' | 'content_delivery';
  name: string;
  delayHours: number;
  content: NurturingContent;
  conditions?: NurturingStepCondition[];
  buyingSignalTriggers?: BuyingSignalTrigger[];
  escalationRules?: EscalationRule[];
}

export interface NurturingContent {
  templateId?: string;
  subject?: string;
  body: string;
  personalizations: PersonalizationRule[];
  attachments?: ContentAttachment[];
  callToAction?: CallToAction;
}

export interface PersonalizationRule {
  placeholder: string;
  source: 'lead_data' | 'company_data' | 'behavior_data' | 'custom';
  field: string;
  fallback: string;
}

export interface ContentAttachment {
  type: 'pdf' | 'image' | 'video' | 'link';
  url: string;
  title: string;
  description?: string;
}

export interface CallToAction {
  text: string;
  url: string;
  type: 'primary' | 'secondary';
  trackingId?: string;
}

export interface NurturingTriggerCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range';
  value: any;
  weight: number;
}

export interface NurturingStepCondition {
  field: string;
  operator: string;
  value: any;
  action: 'skip' | 'delay' | 'branch';
}

export interface NurturingExitCondition {
  field: string;
  operator: string;
  value: any;
  reason: string;
}

// ============================================================================
// BUYING SIGNAL DETECTION TYPES
// ============================================================================

export interface BuyingSignalTrigger {
  signalType: string;
  threshold: number;
  action: 'escalate' | 'fast_track' | 'personalize' | 'schedule_call';
  priority: Priority;
}

export interface BuyingSignalPattern {
  id: string;
  name: string;
  description: string;
  indicators: SignalIndicator[];
  weight: number;
  confidence: number;
  actionTriggers: BuyingSignalTrigger[];
}

export interface SignalIndicator {
  type: 'behavioral' | 'engagement' | 'content' | 'timing';
  metric: string;
  threshold: number;
  timeWindow: number; // hours
}

export interface EscalationRule {
  id: string;
  name: string;
  conditions: EscalationCondition[];
  action: EscalationAction;
  priority: Priority;
  assignTo?: string;
  notificationTemplate?: string;
}

export interface EscalationCondition {
  type: 'buying_signal' | 'engagement_score' | 'time_threshold' | 'interaction_count';
  threshold: number;
  operator: 'greater_than' | 'less_than' | 'equals';
}

export interface EscalationAction {
  type: 'assign_to_sales' | 'schedule_call' | 'send_notification' | 'create_task';
  parameters: Record<string, any>;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
}

// ============================================================================
// COMMUNICATION TEMPLATE TYPES
// ============================================================================

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'call_script';
  category: 'welcome' | 'nurturing' | 'follow_up' | 're_engagement' | 'escalation';
  subject?: string;
  content: string;
  personalizations: PersonalizationRule[];
  variables: TemplateVariable[];
  industrySpecific?: string[];
  audienceSegment?: string[];
  isActive: boolean;
  performanceMetrics?: TemplateMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: any;
}

export interface TemplateMetrics {
  openRate?: number;
  clickRate?: number;
  responseRate?: number;
  conversionRate?: number;
  unsubscribeRate?: number;
  lastUpdated: Date;
}

// ============================================================================
// NURTURING AUTOMATION ENGINE
// ============================================================================

export class NurturingAutomationEngine {
  private nurturingTemplates: Map<string, NurturingTemplate> = new Map();
  private buyingSignalPatterns: Map<string, BuyingSignalPattern> = new Map();
  private communicationTemplates: Map<string, CommunicationTemplate> = new Map();
  private activeSequences: Map<string, ActiveNurturingSequence> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
    this.initializeBuyingSignalPatterns();
    this.initializeCommunicationTemplates();
  }

  // ============================================================================
  // MAIN AUTOMATION METHODS
  // ============================================================================

  public async createNurturingSequence(
    lead: Lead,
    context: DecisionContext
  ): Promise<Action[]> {
    const actions: Action[] = [];

    try {
      // Find appropriate nurturing template
      const template = await this.selectNurturingTemplate(lead, context);
      if (!template) {
        console.log(`No suitable nurturing template found for lead ${lead.id}`);
        return actions;
      }

      // Create active sequence
      const activeSequence: ActiveNurturingSequence = {
        id: `seq_${lead.id}_${Date.now()}`,
        leadId: lead.id,
        templateId: template.id,
        currentStepIndex: 0,
        status: 'active',
        startedAt: new Date(),
        nextActionAt: new Date(Date.now() + template.steps[0].delayHours * 60 * 60 * 1000),
        completedSteps: [],
        metadata: {
          leadScore: lead.score,
          qualification: lead.qualification,
          source: lead.source
        }
      };

      this.activeSequences.set(activeSequence.id, activeSequence);

      // Schedule first step
      const firstStepAction = await this.createStepAction(
        activeSequence,
        template.steps[0],
        lead,
        context
      );

      if (firstStepAction) {
        actions.push(firstStepAction);
      }

      // Create monitoring action
      actions.push({
        id: `monitor_sequence_${activeSequence.id}`,
        type: ActionType.CREATE_TASK,
        agentId: 'nurturing_engine',
        timestamp: new Date(),
        parameters: {
          taskType: 'monitor_nurturing_sequence',
          sequenceId: activeSequence.id,
          leadId: lead.id,
          scheduledFor: activeSequence.nextActionAt
        },
        priority: 3
      });

      console.log(`🎯 Created nurturing sequence for lead ${lead.id} using template ${template.name}`);

    } catch (error) {
      console.error('Error creating nurturing sequence:', error);
    }

    return actions;
  }

  public async detectBuyingSignals(
    lead: Lead,
    interactionData: any,
    context: DecisionContext
  ): Promise<BuyingSignal[]> {
    const detectedSignals: BuyingSignal[] = [];

    try {
      // Convert Map to array and process with Promise.all for proper async handling
      const patternEntries = Array.from(this.buyingSignalPatterns.entries());
      
      for (const [patternId, pattern] of patternEntries) {
        const signalStrength = await this.evaluateBuyingSignalPattern(
          pattern,
          lead,
          interactionData,
          context
        );

        if (signalStrength > pattern.confidence) {
          detectedSignals.push({
            type: pattern.name,
            strength: signalStrength,
            description: pattern.description,
            detectedAt: new Date(),
            source: 'nurturing_automation_engine',
            metadata: {
              patternId,
              interactionData: interactionData?.type,
              leadScore: lead.score?.total
            }
          });
        }
      }

      console.log(`🔍 Detected ${detectedSignals.length} buying signals for lead ${lead.id}`);

    } catch (error) {
      console.error('Error detecting buying signals:', error);
    }

    return detectedSignals;
  }

  public async createEscalationTriggers(
    lead: Lead,
    buyingSignals: BuyingSignal[],
    context: DecisionContext
  ): Promise<Action[]> {
    const actions: Action[] = [];

    try {
      // Check for high-strength buying signals
      const strongSignals = buyingSignals.filter(signal => signal.strength > 0.7);
      
      if (strongSignals.length > 0) {
        // Create immediate escalation
        actions.push({
          id: `escalate_${lead.id}_${Date.now()}`,
          type: ActionType.ESCALATE,
          agentId: 'nurturing_engine',
          timestamp: new Date(),
          parameters: {
            leadId: lead.id,
            reason: 'Strong buying signals detected',
            signals: strongSignals,
            urgency: 'high',
            recommendedAction: 'immediate_contact',
            assignTo: lead.assignedTo || 'sales_team'
          },
          priority: 1
        });

        // Schedule immediate follow-up
        actions.push({
          id: `followup_${lead.id}_${Date.now()}`,
          type: ActionType.SCHEDULE_FOLLOWUP,
          agentId: 'nurturing_engine',
          timestamp: new Date(),
          parameters: {
            leadId: lead.id,
            followupType: 'immediate_call',
            scheduledFor: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            reason: 'High-intent buying signals detected',
            priority: 'urgent',
            context: {
              signals: strongSignals,
              leadScore: lead.score,
              lastInteraction: context.currentContext.conversationHistory[0]
            }
          },
          priority: 1
        });

        // Pause current nurturing sequence
        const activeSequence = this.findActiveSequenceForLead(lead.id);
        if (activeSequence) {
          activeSequence.status = 'paused';
          activeSequence.pausedAt = new Date();
          activeSequence.pauseReason = 'escalated_to_sales';
        }
      }

      // Check for medium-strength signals
      const mediumSignals = buyingSignals.filter(signal => 
        signal.strength > 0.4 && signal.strength <= 0.7
      );

      if (mediumSignals.length > 0) {
        // Fast-track nurturing sequence
        actions.push({
          id: `fasttrack_${lead.id}_${Date.now()}`,
          type: ActionType.UPDATE_RECORD,
          agentId: 'nurturing_engine',
          timestamp: new Date(),
          parameters: {
            recordType: 'nurturing_sequence',
            recordId: this.findActiveSequenceForLead(lead.id)?.id,
            updates: {
              priority: 'high',
              accelerated: true,
              nextActionAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
            }
          },
          priority: 2
        });
      }

      console.log(`⚡ Created ${actions.length} escalation actions for lead ${lead.id}`);

    } catch (error) {
      console.error('Error creating escalation triggers:', error);
    }

    return actions;
  }

  public async processNurturingStep(
    sequenceId: string,
    context: DecisionContext
  ): Promise<Action[]> {
    const actions: Action[] = [];

    try {
      const activeSequence = this.activeSequences.get(sequenceId);
      if (!activeSequence || activeSequence.status !== 'active') {
        return actions;
      }

      const template = this.nurturingTemplates.get(activeSequence.templateId);
      if (!template) {
        console.error(`Template not found: ${activeSequence.templateId}`);
        return actions;
      }

      const currentStep = template.steps[activeSequence.currentStepIndex];
      if (!currentStep) {
        // Sequence completed
        activeSequence.status = 'completed';
        activeSequence.completedAt = new Date();
        console.log(`✅ Nurturing sequence ${sequenceId} completed`);
        return actions;
      }

      // Get lead data from context
      const leadData = context.currentContext.conversationHistory.find(
        h => h.leadId === activeSequence.leadId
      );

      if (!leadData) {
        console.error(`Lead data not found for sequence ${sequenceId}`);
        return actions;
      }

      // Execute current step
      const stepAction = await this.executeNurturingStep(
        activeSequence,
        currentStep,
        leadData,
        context
      );

      if (stepAction) {
        actions.push(stepAction);
      }

      // Update sequence progress
      activeSequence.currentStepIndex++;
      activeSequence.completedSteps.push({
        stepId: currentStep.id,
        completedAt: new Date(),
        success: true
      });

      // Schedule next step if available
      if (activeSequence.currentStepIndex < template.steps.length) {
        const nextStep = template.steps[activeSequence.currentStepIndex];
        activeSequence.nextActionAt = new Date(
          Date.now() + nextStep.delayHours * 60 * 60 * 1000
        );

        actions.push({
          id: `schedule_next_step_${sequenceId}`,
          type: ActionType.CREATE_TASK,
          agentId: 'nurturing_engine',
          timestamp: new Date(),
          parameters: {
            taskType: 'execute_nurturing_step',
            sequenceId: sequenceId,
            stepIndex: activeSequence.currentStepIndex,
            scheduledFor: activeSequence.nextActionAt
          },
          priority: 3
        });
      }

      console.log(`📧 Processed nurturing step ${currentStep.name} for sequence ${sequenceId}`);

    } catch (error) {
      console.error('Error processing nurturing step:', error);
    }

    return actions;
  }

  // ============================================================================
  // TEMPLATE SELECTION AND PERSONALIZATION
  // ============================================================================

  private async selectNurturingTemplate(
    lead: Lead,
    context: DecisionContext
  ): Promise<NurturingTemplate | null> {
    let bestTemplate: NurturingTemplate | null = null;
    let bestScore = 0;

    // Convert Map to array to avoid iteration issues
    const templateEntries = Array.from(this.nurturingTemplates.entries());
    
    for (const [templateId, template] of templateEntries) {
      if (!template.isActive) continue;

      const score = await this.calculateTemplateScore(template, lead, context);
      if (score > bestScore) {
        bestScore = score;
        bestTemplate = template;
      }
    }

    return bestTemplate;
  }

  private async calculateTemplateScore(
    template: NurturingTemplate,
    lead: Lead,
    context: DecisionContext
  ): Promise<number> {
    let score = 0;

    // Check trigger conditions
    for (const condition of template.triggerConditions) {
      if (this.evaluateCondition(condition, lead, context)) {
        score += condition.weight;
      }
    }

    // Bonus for qualification match
    if (lead.qualification === QualificationStatus.MARKETING_QUALIFIED) {
      score += 10;
    }

    // Bonus for lead score range
    if (lead.score && lead.score.total >= 40 && lead.score.total < 80) {
      score += 5;
    }

    return score;
  }

  private evaluateCondition(
    condition: NurturingTriggerCondition,
    lead: Lead,
    context: DecisionContext
  ): boolean {
    const fieldValue = this.getFieldValue(condition.field, lead, context);
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase());
      case 'in_range':
        const [min, max] = condition.value;
        return Number(fieldValue) >= min && Number(fieldValue) <= max;
      default:
        return false;
    }
  }

  private getFieldValue(field: string, lead: Lead, context: DecisionContext): any {
    const fieldParts = field.split('.');
    let value: any = lead;

    for (const part of fieldParts) {
      value = value?.[part];
    }

    return value;
  }

  // ============================================================================
  // STEP EXECUTION
  // ============================================================================

  private async createStepAction(
    sequence: ActiveNurturingSequence,
    step: NurturingSequenceStep,
    lead: Lead,
    context: DecisionContext
  ): Promise<Action | null> {
    try {
      const personalizedContent = await this.personalizeContent(
        step.content,
        lead,
        context
      );

      switch (step.type) {
        case 'email':
          return {
            id: `email_${sequence.id}_${step.id}`,
            type: ActionType.SEND_MESSAGE,
            agentId: 'nurturing_engine',
            timestamp: new Date(),
            parameters: {
              channel: 'email',
              recipient: lead.email,
              subject: personalizedContent.subject,
              body: personalizedContent.body,
              templateId: personalizedContent.templateId,
              leadId: lead.id,
              sequenceId: sequence.id,
              stepId: step.id,
              trackingEnabled: true
            },
            priority: 2
          };

        case 'sms':
          return {
            id: `sms_${sequence.id}_${step.id}`,
            type: ActionType.SEND_MESSAGE,
            agentId: 'nurturing_engine',
            timestamp: new Date(),
            parameters: {
              channel: 'sms',
              recipient: lead.phone,
              message: personalizedContent.body,
              leadId: lead.id,
              sequenceId: sequence.id,
              stepId: step.id
            },
            priority: 2
          };

        case 'call_task':
          return {
            id: `call_task_${sequence.id}_${step.id}`,
            type: ActionType.CREATE_TASK,
            agentId: 'nurturing_engine',
            timestamp: new Date(),
            parameters: {
              taskType: 'call_lead',
              leadId: lead.id,
              title: `Call ${lead.firstName} ${lead.lastName}`,
              description: personalizedContent.body,
              assignedTo: lead.assignedTo,
              priority: 'medium',
              dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            },
            priority: 2
          };

        default:
          console.warn(`Unsupported step type: ${step.type}`);
          return null;
      }
    } catch (error) {
      console.error('Error creating step action:', error);
      return null;
    }
  }

  private async executeNurturingStep(
    sequence: ActiveNurturingSequence,
    step: NurturingSequenceStep,
    leadData: any,
    context: DecisionContext
  ): Promise<Action | null> {
    // Check step conditions
    if (step.conditions) {
      for (const condition of step.conditions) {
        if (!this.evaluateStepCondition(condition, leadData, context)) {
          if (condition.action === 'skip') {
            console.log(`Skipping step ${step.name} due to condition`);
            return null;
          }
        }
      }
    }

    return this.createStepAction(sequence, step, leadData, context);
  }

  private evaluateStepCondition(
    condition: NurturingStepCondition,
    leadData: any,
    context: DecisionContext
  ): boolean {
    const fieldValue = this.getFieldValue(condition.field, leadData, context);
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      default:
        return true;
    }
  }

  // ============================================================================
  // CONTENT PERSONALIZATION
  // ============================================================================

  private async personalizeContent(
    content: NurturingContent,
    lead: Lead,
    context: DecisionContext
  ): Promise<NurturingContent> {
    let personalizedSubject = content.subject || '';
    let personalizedBody = content.body;

    // Apply personalization rules
    for (const rule of content.personalizations) {
      const value = await this.getPersonalizationValue(rule, lead, context);
      const placeholder = `{{${rule.placeholder}}}`;
      
      personalizedSubject = personalizedSubject.replace(new RegExp(placeholder, 'g'), value);
      personalizedBody = personalizedBody.replace(new RegExp(placeholder, 'g'), value);
    }

    return {
      ...content,
      subject: personalizedSubject,
      body: personalizedBody
    };
  }

  private async getPersonalizationValue(
    rule: PersonalizationRule,
    lead: Lead,
    context: DecisionContext
  ): Promise<string> {
    try {
      switch (rule.source) {
        case 'lead_data':
          return this.getFieldValue(rule.field, lead, context) || rule.fallback;
        case 'company_data':
          return lead.company || rule.fallback;
        case 'behavior_data':
          // This would integrate with analytics data
          return rule.fallback;
        case 'custom':
          return rule.fallback;
        default:
          return rule.fallback;
      }
    } catch (error) {
      console.error('Error getting personalization value:', error);
      return rule.fallback;
    }
  }

  // ============================================================================
  // BUYING SIGNAL EVALUATION
  // ============================================================================

  private async evaluateBuyingSignalPattern(
    pattern: BuyingSignalPattern,
    lead: Lead,
    interactionData: any,
    context: DecisionContext
  ): Promise<number> {
    let totalScore = 0;
    let maxScore = 0;

    for (const indicator of pattern.indicators) {
      const score = await this.evaluateSignalIndicator(
        indicator,
        lead,
        interactionData,
        context
      );
      totalScore += score;
      maxScore += 1; // Normalized to 0-1 scale
    }

    return maxScore > 0 ? totalScore / maxScore : 0;
  }

  private async evaluateSignalIndicator(
    indicator: SignalIndicator,
    lead: Lead,
    interactionData: any,
    context: DecisionContext
  ): Promise<number> {
    switch (indicator.type) {
      case 'behavioral':
        return this.evaluateBehavioralIndicator(indicator, lead, interactionData);
      case 'engagement':
        return this.evaluateEngagementIndicator(indicator, lead, context);
      case 'content':
        return this.evaluateContentIndicator(indicator, interactionData);
      case 'timing':
        return this.evaluateTimingIndicator(indicator, lead, context);
      default:
        return 0;
    }
  }

  private evaluateBehavioralIndicator(
    indicator: SignalIndicator,
    lead: Lead,
    interactionData: any
  ): number {
    // Example behavioral indicators
    switch (indicator.metric) {
      case 'pricing_page_visits':
        const visits = interactionData?.pricingPageVisits || 0;
        return visits >= indicator.threshold ? 1 : visits / indicator.threshold;
      case 'demo_requests':
        const requests = interactionData?.demoRequests || 0;
        return requests >= indicator.threshold ? 1 : 0;
      default:
        return 0;
    }
  }

  private evaluateEngagementIndicator(
    indicator: SignalIndicator,
    lead: Lead,
    context: DecisionContext
  ): number {
    switch (indicator.metric) {
      case 'email_opens':
        // This would integrate with email tracking data
        return 0.5; // Placeholder
      case 'content_downloads':
        // This would integrate with content tracking
        return 0.3; // Placeholder
      default:
        return 0;
    }
  }

  private evaluateContentIndicator(
    indicator: SignalIndicator,
    interactionData: any
  ): number {
    switch (indicator.metric) {
      case 'pricing_keywords':
        const content = interactionData?.content?.toLowerCase() || '';
        const pricingKeywords = ['price', 'cost', 'pricing', 'quote', 'budget'];
        const matches = pricingKeywords.filter(keyword => content.includes(keyword));
        return matches.length >= indicator.threshold ? 1 : matches.length / indicator.threshold;
      default:
        return 0;
    }
  }

  private evaluateTimingIndicator(
    indicator: SignalIndicator,
    lead: Lead,
    context: DecisionContext
  ): number {
    switch (indicator.metric) {
      case 'recent_activity':
        const lastActivity = lead.updatedAt || lead.createdAt;
        const hoursSinceActivity = (Date.now() - lastActivity.toDate().getTime()) / (1000 * 60 * 60);
        return hoursSinceActivity <= indicator.timeWindow ? 1 : 0;
      default:
        return 0;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private findActiveSequenceForLead(leadId: string): ActiveNurturingSequence | null {
    // Convert Map to array to avoid iteration issues
    const sequenceEntries = Array.from(this.activeSequences.entries());
    
    for (const [sequenceId, sequence] of sequenceEntries) {
      if (sequence.leadId === leadId && sequence.status === 'active') {
        return sequence;
      }
    }
    return null;
  }

  // ============================================================================
  // INITIALIZATION METHODS
  // ============================================================================

  private initializeDefaultTemplates(): void {
    // Marketing Qualified Lead Nurturing Template
    const mqlTemplate: NurturingTemplate = {
      id: 'mql_nurturing_v1',
      name: 'Marketing Qualified Lead Nurturing',
      description: 'Standard nurturing sequence for marketing qualified leads',
      targetAudience: ['marketing_qualified'],
      triggerConditions: [
        {
          field: 'qualification',
          operator: 'equals',
          value: QualificationStatus.MARKETING_QUALIFIED,
          weight: 10
        },
        {
          field: 'score.total',
          operator: 'in_range',
          value: [40, 79],
          weight: 5
        }
      ],
      steps: [
        {
          id: 'welcome_email',
          order: 1,
          type: 'email',
          name: 'Welcome Email',
          delayHours: 1,
          content: {
            subject: 'Welcome to HighLaunchPad, {{firstName}}!',
            body: `Hi {{firstName}},

Welcome to HighLaunchPad! I'm excited to help you transform your business with our AI-powered CRM platform.

Based on your interest in {{leadSource}}, I thought you'd love to see how other {{industry}} professionals are using HighLaunchPad to:

• Automate their lead nurturing (saving 10+ hours per week)
• Increase conversion rates by 40% with AI-powered insights
• Replace 5+ expensive tools with one unified platform

I've prepared a personalized demo that shows exactly how HighLaunchPad can work for your {{company}} business.

Would you like to schedule a quick 15-minute call this week?

Best regards,
The HighLaunchPad Team

P.S. Check out our success stories: [link]`,
            personalizations: [
              {
                placeholder: 'firstName',
                source: 'lead_data',
                field: 'firstName',
                fallback: 'there'
              },
              {
                placeholder: 'leadSource',
                source: 'lead_data',
                field: 'source',
                fallback: 'our platform'
              },
              {
                placeholder: 'industry',
                source: 'company_data',
                field: 'industry',
                fallback: 'business'
              },
              {
                placeholder: 'company',
                source: 'lead_data',
                field: 'company',
                fallback: 'your'
              }
            ],
            callToAction: {
              text: 'Schedule Your Demo',
              url: 'https://calendly.com/highlaunchpad/demo',
              type: 'primary'
            }
          },
          buyingSignalTriggers: [
            {
              signalType: 'demo_request',
              threshold: 0.8,
              action: 'escalate',
              priority: Priority.HIGH
            }
          ]
        },
        {
          id: 'value_proposition_email',
          order: 2,
          type: 'email',
          name: 'Value Proposition Email',
          delayHours: 72,
          content: {
            subject: '{{firstName}}, see how {{company}} can save $300+/month',
            body: `Hi {{firstName}},

I wanted to follow up on my previous email about HighLaunchPad.

I've been thinking about {{company}} and how you could benefit from consolidating your marketing tools.

Here's what most {{industry}} businesses are spending monthly:
• CRM: $50-100/month
• Email Marketing: $30-80/month  
• Funnel Builder: $97-297/month
• Social Scheduler: $15-50/month
• Analytics: $20-100/month

Total: $212-627/month for basic features

HighLaunchPad replaces ALL of these for just $29/month.

That's potential savings of $183-598 every single month!

Plus, you get AI-powered automation that works 24/7 to nurture your leads and grow your business.

Ready to see how much you could save? Let's chat for 15 minutes.

Best,
The HighLaunchPad Team`,
            personalizations: [
              {
                placeholder: 'firstName',
                source: 'lead_data',
                field: 'firstName',
                fallback: 'there'
              },
              {
                placeholder: 'company',
                source: 'lead_data',
                field: 'company',
                fallback: 'your business'
              },
              {
                placeholder: 'industry',
                source: 'company_data',
                field: 'industry',
                fallback: 'business'
              }
            ],
            callToAction: {
              text: 'Calculate Your Savings',
              url: 'https://highlaunchpad.com/calculator',
              type: 'primary'
            }
          }
        },
        {
          id: 'social_proof_email',
          order: 3,
          type: 'email',
          name: 'Social Proof Email',
          delayHours: 120,
          content: {
            subject: 'How {{customerName}} increased conversions by 40%',
            body: `Hi {{firstName}},

I wanted to share a quick success story that might resonate with you.

{{customerName}}, a {{customerIndustry}} professional just like you, was struggling with:
• Managing leads across multiple platforms
• Following up consistently with prospects  
• Creating engaging content for social media
• Tracking which marketing efforts actually worked

Sound familiar?

After switching to HighLaunchPad, here's what happened:
✅ 40% increase in lead conversion rates
✅ 10 hours saved per week on manual tasks
✅ 60% improvement in email open rates
✅ $400/month saved on tool subscriptions

"HighLaunchPad transformed how I run my business. The AI automation handles my lead nurturing while I focus on closing deals." - {{customerName}}

Want to see similar results for {{company}}?

Let's schedule a brief call to discuss your specific goals.

Best,
The HighLaunchPad Team`,
            personalizations: [
              {
                placeholder: 'firstName',
                source: 'lead_data',
                field: 'firstName',
                fallback: 'there'
              },
              {
                placeholder: 'company',
                source: 'lead_data',
                field: 'company',
                fallback: 'your business'
              },
              {
                placeholder: 'customerName',
                source: 'custom',
                field: 'testimonial_customer',
                fallback: 'Sarah Johnson'
              },
              {
                placeholder: 'customerIndustry',
                source: 'custom',
                field: 'testimonial_industry',
                fallback: 'marketing'
              }
            ],
            callToAction: {
              text: 'Book Your Strategy Call',
              url: 'https://calendly.com/highlaunchpad/strategy',
              type: 'primary'
            }
          }
        }
      ],
      exitConditions: [
        {
          field: 'qualification',
          operator: 'equals',
          value: QualificationStatus.SALES_QUALIFIED,
          reason: 'Promoted to sales qualified'
        },
        {
          field: 'status',
          operator: 'equals',
          value: 'unsubscribed',
          reason: 'Lead unsubscribed'
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.nurturingTemplates.set(mqlTemplate.id, mqlTemplate);
  }

  private initializeBuyingSignalPatterns(): void {
    // High-Intent Buying Signal Pattern
    const highIntentPattern: BuyingSignalPattern = {
      id: 'high_intent_v1',
      name: 'High Purchase Intent',
      description: 'Strong indicators of immediate purchase intent',
      indicators: [
        {
          type: 'behavioral',
          metric: 'pricing_page_visits',
          threshold: 3,
          timeWindow: 24
        },
        {
          type: 'behavioral',
          metric: 'demo_requests',
          threshold: 1,
          timeWindow: 168
        },
        {
          type: 'content',
          metric: 'pricing_keywords',
          threshold: 2,
          timeWindow: 48
        }
      ],
      weight: 1.0,
      confidence: 0.7,
      actionTriggers: [
        {
          signalType: 'high_intent',
          threshold: 0.7,
          action: 'escalate',
          priority: Priority.URGENT
        }
      ]
    };

    this.buyingSignalPatterns.set(highIntentPattern.id, highIntentPattern);

    // Medium-Intent Buying Signal Pattern
    const mediumIntentPattern: BuyingSignalPattern = {
      id: 'medium_intent_v1',
      name: 'Medium Purchase Intent',
      description: 'Moderate indicators of purchase consideration',
      indicators: [
        {
          type: 'engagement',
          metric: 'email_opens',
          threshold: 3,
          timeWindow: 72
        },
        {
          type: 'behavioral',
          metric: 'feature_page_visits',
          threshold: 2,
          timeWindow: 48
        },
        {
          type: 'timing',
          metric: 'recent_activity',
          threshold: 1,
          timeWindow: 24
        }
      ],
      weight: 0.8,
      confidence: 0.5,
      actionTriggers: [
        {
          signalType: 'medium_intent',
          threshold: 0.5,
          action: 'fast_track',
          priority: Priority.MEDIUM
        }
      ]
    };

    this.buyingSignalPatterns.set(mediumIntentPattern.id, mediumIntentPattern);
  }

  private initializeCommunicationTemplates(): void {
    // Welcome Email Template
    const welcomeTemplate: CommunicationTemplate = {
      id: 'welcome_email_v1',
      name: 'Welcome Email Template',
      type: 'email',
      category: 'welcome',
      subject: 'Welcome to HighLaunchPad, {{firstName}}!',
      content: `Hi {{firstName}},

Welcome to HighLaunchPad! I'm excited to help you transform your business with our AI-powered CRM platform.

Based on your interest in {{leadSource}}, I thought you'd love to see how other {{industry}} professionals are using HighLaunchPad to:

• Automate their lead nurturing (saving 10+ hours per week)
• Increase conversion rates by 40% with AI-powered insights  
• Replace 5+ expensive tools with one unified platform

I've prepared a personalized demo that shows exactly how HighLaunchPad can work for your {{company}} business.

Would you like to schedule a quick 15-minute call this week?

Best regards,
The HighLaunchPad Team

P.S. Check out our success stories: [link]`,
      personalizations: [
        {
          placeholder: 'firstName',
          source: 'lead_data',
          field: 'firstName',
          fallback: 'there'
        },
        {
          placeholder: 'leadSource',
          source: 'lead_data',
          field: 'source',
          fallback: 'our platform'
        },
        {
          placeholder: 'industry',
          source: 'company_data',
          field: 'industry',
          fallback: 'business'
        },
        {
          placeholder: 'company',
          source: 'lead_data',
          field: 'company',
          fallback: 'your'
        }
      ],
      variables: [
        {
          name: 'firstName',
          description: 'Lead first name',
          type: 'text',
          required: true
        },
        {
          name: 'company',
          description: 'Lead company name',
          type: 'text',
          required: false
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.communicationTemplates.set(welcomeTemplate.id, welcomeTemplate);
  }
}

// ============================================================================
// ACTIVE SEQUENCE TRACKING
// ============================================================================

interface ActiveNurturingSequence {
  id: string;
  leadId: string;
  templateId: string;
  currentStepIndex: number;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  startedAt: Date;
  nextActionAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  pauseReason?: string;
  completedSteps: CompletedStep[];
  metadata: Record<string, any>;
}

interface CompletedStep {
  stepId: string;
  completedAt: Date;
  success: boolean;
  result?: any;
  error?: string;
}

// Export the engine instance
export const nurturingEngine = new NurturingAutomationEngine();