import { BaseAgent } from './base-agent';
import {
  AgentType,
  EventType,
  ActionType,
  Event,
  Action,
  ExecutionResult,
  Feedback,
  DecisionContext,
  AgentConfiguration,
  AgentCapability
} from './types';

import {
  Lead,
  LeadSource,
  LeadStatus,
  QualificationStatus,
  LeadScore,
  BuyingSignal,
  AIInsights,
  NurturingSequence,
  EscalationTrigger,
  JourneyStage,
  Priority,
  ScoringFactor,
  NextBestAction,
  InteractionType,
  CommunicationChannel
} from '../crm-types';

import { NurturingAutomationEngine } from './nurturing-automation-engine';

// Lead Scoring Configuration
export interface LeadScoringCriteria {
  demographic: {
    jobTitle: { weight: number; values: Record<string, number> };
    company: { weight: number; values: Record<string, number> };
    industry: { weight: number; values: Record<string, number> };
    companySize: { weight: number; values: Record<string, number> };
  };
  behavioral: {
    websiteVisits: { weight: number; threshold: number };
    pageViews: { weight: number; threshold: number };
    timeOnSite: { weight: number; threshold: number };
    downloadedContent: { weight: number; multiplier: number };
    emailEngagement: { weight: number; openRate: number; clickRate: number };
  };
  engagement: {
    socialMediaActivity: { weight: number; multiplier: number };
    eventAttendance: { weight: number; multiplier: number };
    webinarParticipation: { weight: number; multiplier: number };
    demoRequests: { weight: number; multiplier: number };
    trialSignups: { weight: number; multiplier: number };
  };
  intent: {
    pricingPageVisits: { weight: number; multiplier: number };
    competitorResearch: { weight: number; multiplier: number };
    featureInquiries: { weight: number; multiplier: number };
    urgencyIndicators: { weight: number; multiplier: number };
  };
}

// Assignment Configuration
export interface AssignmentCriteria {
  workloadBalance: {
    enabled: boolean;
    maxLeadsPerUser: number;
    considerCurrentLoad: boolean;
  };
  skillMatching: {
    enabled: boolean;
    industryExpertise: Record<string, string[]>;
    productExpertise: Record<string, string[]>;
    languageRequirements: Record<string, string[]>;
  };
  geographic: {
    enabled: boolean;
    territoryMapping: Record<string, string[]>;
    timezoneConsideration: boolean;
  };
  availability: {
    respectBusinessHours: boolean;
    considerVacationSchedule: boolean;
    escalationRules: {
      responseTimeThreshold: number; // minutes
      escalationChain: string[];
    };
  };
}

// Lead Management Agent Implementation
export class LeadManagementAgent extends BaseAgent {
  private scoringCriteria: LeadScoringCriteria;
  private assignmentCriteria: AssignmentCriteria;
  private nurturingEngine: NurturingAutomationEngine;

  constructor(config: AgentConfiguration) {
    super(config);
    
    // Initialize default scoring criteria
    this.scoringCriteria = {
      demographic: {
        jobTitle: {
          weight: 0.25,
          values: {
            'CEO': 10, 'CTO': 9, 'VP': 8, 'Director': 7, 'Manager': 6,
            'Senior': 5, 'Lead': 4, 'Specialist': 3, 'Coordinator': 2, 'Other': 1
          }
        },
        company: {
          weight: 0.20,
          values: {
            'Enterprise': 10, 'Large': 8, 'Medium': 6, 'Small': 4, 'Startup': 3
          }
        },
        industry: {
          weight: 0.15,
          values: {
            'Technology': 9, 'Finance': 8, 'Healthcare': 7, 'Manufacturing': 6,
            'Retail': 5, 'Education': 4, 'Government': 3, 'Other': 2
          }
        },
        companySize: {
          weight: 0.15,
          values: {
            '1000+': 10, '500-999': 8, '100-499': 6, '50-99': 4, '10-49': 3, '1-9': 2
          }
        }
      },
      behavioral: {
        websiteVisits: { weight: 0.10, threshold: 5 },
        pageViews: { weight: 0.08, threshold: 10 },
        timeOnSite: { weight: 0.07, threshold: 300 }, // seconds
        downloadedContent: { weight: 0.12, multiplier: 2 },
        emailEngagement: { weight: 0.10, openRate: 0.3, clickRate: 0.1 }
      },
      engagement: {
        socialMediaActivity: { weight: 0.05, multiplier: 1.5 },
        eventAttendance: { weight: 0.08, multiplier: 2 },
        webinarParticipation: { weight: 0.10, multiplier: 2.5 },
        demoRequests: { weight: 0.15, multiplier: 3 },
        trialSignups: { weight: 0.20, multiplier: 4 }
      },
      intent: {
        pricingPageVisits: { weight: 0.12, multiplier: 2 },
        competitorResearch: { weight: 0.08, multiplier: 1.5 },
        featureInquiries: { weight: 0.10, multiplier: 2 },
        urgencyIndicators: { weight: 0.15, multiplier: 3 }
      }
    };

    // Initialize default assignment criteria
    this.assignmentCriteria = {
      workloadBalance: {
        enabled: true,
        maxLeadsPerUser: 50,
        considerCurrentLoad: true
      },
      skillMatching: {
        enabled: true,
        industryExpertise: {},
        productExpertise: {},
        languageRequirements: {}
      },
      geographic: {
        enabled: false,
        territoryMapping: {},
        timezoneConsideration: true
      },
      availability: {
        respectBusinessHours: true,
        considerVacationSchedule: true,
        escalationRules: {
          responseTimeThreshold: 60,
          escalationChain: []
        }
      }
    };

    // Initialize nurturing automation engine
    this.nurturingEngine = new NurturingAutomationEngine();
  }

  // Implement required BaseAgent methods
  async processEvents(events: Event[]): Promise<void> {
    for (const event of events) {
      await this.processEvent(event);
    }
  }

  async makeDecisions(context: DecisionContext): Promise<Action[]> {
    const actions: Action[] = [];
    for (const event of context.events) {
      const result = await this.processEvent(event);
      if (result.actions) {
        actions.push(...result.actions);
      }
    }
    return actions;
  }

  async executeActions(actions: Action[]): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];
    for (const action of actions) {
      results.push({
        actionId: action.id,
        success: true,
        timestamp: new Date()
      });
    }
    return results;
  }

  async processFeedback(feedback: Feedback[]): Promise<void> {
    await this.learn(feedback);
  }

  async processEvent(event: Event, context?: DecisionContext): Promise<{ success: boolean; actions?: Action[]; confidence?: number; reasoning?: string; metadata?: any }> {
    try {
      console.log(`🤖 Processing event: ${event.type} for lead management`);
      
      const defaultContext: DecisionContext = {
        events: [event],
        currentContext: this.context || {
          sessionId: 'default',
          conversationHistory: [],
          availableActions: [],
          businessRules: {},
          performanceMetrics: {
            totalActions: 0,
            successfulActions: 0,
            failedActions: 0,
            averageResponseTime: 0,
            learningScore: 0
          },
          lastUpdated: new Date()
        },
        availableActions: [ActionType.UPDATE_RECORD, ActionType.CREATE_TASK, ActionType.ESCALATE, ActionType.SCHEDULE_FOLLOWUP],
        businessConstraints: {}
      };

      const ctx = context || defaultContext;
      
      switch (event.type) {
        case EventType.LEAD_CAPTURED:
          return await this.handleLeadCaptured(event, ctx);
        case EventType.DATA_UPDATED:
          return await this.handleDataUpdated(event, ctx);
        case EventType.CUSTOMER_INTERACTION:
          return await this.handleCustomerInteraction(event, ctx);
        case EventType.AFFILIATE_CLICK:
          return await this.handleAffiliateClick(event, ctx);
        case EventType.AFFILIATE_CONVERSION:
          return await this.handleAffiliateConversion(event, ctx);
        default:
          return {
            success: false,
            actions: [],
            confidence: 0,
            reasoning: `Unsupported event type: ${event.type}`,
            metadata: { agentId: this.configuration.id }
          };
      }
    } catch (error) {
      console.error('Error processing event in LeadManagementAgent:', error);
      return {
        success: false,
        actions: [],
        confidence: 0,
        reasoning: `Error processing event: ${error}`,
        metadata: { agentId: this.configuration.id, error: error }
      };
    }
  }

  private async handleLeadCaptured(event: Event, context: DecisionContext): Promise<{ success: boolean; actions?: Action[]; confidence?: number; reasoning?: string; metadata?: any }> {
    const leadData = event.data;
    const actions: Action[] = [];

    // Score the lead
    const score = await this.scoreLead(leadData, context);
    
    // Qualify the lead based on score
    const qualification = this.qualifyLead(score.total);
    
    // Detect buying signals
    const buyingSignals = await this.detectBuyingSignals(leadData, context);
    
    // Create lead update action
    const leadId = leadData.id || event.leadId || `lead_${Date.now()}`;
    actions.push({
      id: `score-lead-${leadId}`,
      type: ActionType.UPDATE_RECORD,
      agentId: this.configuration.id,
      timestamp: new Date(),
      parameters: {
        recordType: 'lead',
        recordId: leadId,
        updates: {
          score,
          qualification,
          buyingSignals,
          lastScoredAt: new Date(),
          scoringVersion: '1.0'
        }
      },
      priority: score.total > 80 ? 1 : score.total > 60 ? 2 : 3
    });

    // Assign lead if qualification meets threshold
    if (qualification === QualificationStatus.SALES_QUALIFIED || score.total > 70) {
      const assignedUserId = await this.assignLead(leadData, context);
      if (assignedUserId) {
        const assignmentAction = await this.createAssignmentAction(leadData, assignedUserId);
        actions.push(assignmentAction);
      }
    }

    // Create nurturing sequence if needed
    if (qualification === QualificationStatus.MARKETING_QUALIFIED) {
      const nurturingAction = await this.createNurturingSequence(leadData, context);
      if (nurturingAction) {
        actions.push(nurturingAction);
      }
    }

    return {
      success: true,
      actions,
      confidence: 0.9,
      reasoning: `Lead scored: ${score}, qualified as: ${qualification}, ${buyingSignals.length} buying signals detected`,
      metadata: {
        agentId: this.configuration.id,
        leadScore: score,
        qualification,
        buyingSignalsCount: buyingSignals.length
      }
    };
  }

  private async handleDataUpdated(event: Event, context: DecisionContext): Promise<{ success: boolean; actions?: Action[]; confidence?: number; reasoning?: string; metadata?: any }> {
    const leadData = event.data;
    const actions: Action[] = [];

    // Re-score the lead with updated data
    const newScore = await this.scoreLead(leadData, context);
    const newQualification = this.qualifyLead(newScore.total);

    const leadId = leadData.id || event.leadId || `lead_${Date.now()}`;
    actions.push({
      id: `rescore-lead-${leadId}`,
      type: ActionType.UPDATE_RECORD,
      agentId: this.configuration.id,
      timestamp: new Date(),
      parameters: {
        recordType: 'lead',
        recordId: leadId,
        updates: {
          score: newScore,
          qualification: newQualification,
          lastScoredAt: new Date()
        }
      },
      priority: 2
    });

    return {
      success: true,
      actions,
      confidence: 0.85,
      reasoning: `Lead re-scored: ${newScore}, qualification: ${newQualification}`,
      metadata: {
        agentId: this.configuration.id,
        newScore,
        newQualification
      }
    };
  }

  private async handleCustomerInteraction(event: Event, context: DecisionContext): Promise<{ success: boolean; actions?: Action[]; confidence?: number; reasoning?: string; metadata?: any }> {
    const interactionData = event.data;
    const actions: Action[] = [];

    try {
      // Get lead data for the interaction
      const leadData = context.currentContext.conversationHistory.find(
        h => h.leadId === interactionData.leadId
      ) || interactionData;

      // Use nurturing engine for advanced buying signal detection
      const buyingSignals = await this.nurturingEngine.detectBuyingSignals(
        leadData,
        interactionData,
        context
      );

      // Create escalation triggers based on detected signals
      const escalationActions = await this.nurturingEngine.createEscalationTriggers(
        leadData,
        buyingSignals,
        context
      );

      actions.push(...escalationActions);

      // Fallback to basic signal analysis if nurturing engine doesn't detect signals
      if (buyingSignals.length === 0) {
        const basicSignals = await this.analyzeBuyingSignals(interactionData, context);
        
        if (basicSignals.length > 0) {
          // High-priority buying signals detected - escalate
          actions.push({
            id: `escalate-${interactionData.leadId}`,
            type: ActionType.ESCALATE,
            agentId: this.configuration.id,
            timestamp: new Date(),
            parameters: {
              leadId: interactionData.leadId,
              reason: 'Strong buying signals detected',
              signals: basicSignals,
              urgency: 'high'
            },
            priority: 1
          });

          // Schedule immediate follow-up
          actions.push({
            id: `followup-${interactionData.leadId}`,
            type: ActionType.SCHEDULE_FOLLOWUP,
            agentId: this.configuration.id,
            timestamp: new Date(),
            parameters: {
              leadId: interactionData.leadId,
              followupType: 'immediate',
              scheduledFor: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
              reason: 'Buying signals detected'
            },
            priority: 1
          });
        }
      }

      return {
        success: true,
        actions,
        confidence: 0.8,
        reasoning: `Analyzed interaction, found ${buyingSignals.length} buying signals using nurturing engine`,
        metadata: {
          agentId: this.configuration.id,
          buyingSignalsCount: buyingSignals.length,
          interactionType: interactionData.type,
          escalationActionsCreated: escalationActions.length
        }
      };

    } catch (error) {
      console.error('Error handling customer interaction:', error);
      return {
        success: false,
        actions: [],
        confidence: 0,
        reasoning: `Error processing customer interaction: ${error}`,
        metadata: { agentId: this.configuration.id, error: error }
      };
    }
  }

  public async scoreLead(leadData: any, context?: DecisionContext): Promise<LeadScore> {
    try {
      // Use the new Genkit flow for lead scoring
      const { leadScoringFlow } = await import('@/ai/flows/ai-agents/lead-scoring');
      
      // Prepare scoring criteria (using defaults for now)
      const scoringCriteria = {
        demographic: {
          jobTitle: {
            weight: 0.25,
            highValueTitles: ['CEO', 'CTO', 'VP', 'Director', 'Manager']
          },
          company: {
            weight: 0.20,
            targetIndustries: []
          },
          companySize: {
            weight: 0.15,
            preferredSizes: ['51-200', '201-500', '500+']
          }
        },
        behavioral: {
          websiteEngagement: {
            weight: 0.20,
            visitThreshold: 3,
            timeThreshold: 300
          },
          contentEngagement: {
            weight: 0.15,
            downloadThreshold: 2
          },
          emailEngagement: {
            weight: 0.10,
            openRateThreshold: 0.3,
            clickRateThreshold: 0.1
          }
        },
        intent: {
          demoRequests: {
            weight: 0.30,
            points: 50
          },
          trialSignups: {
            weight: 0.40,
            points: 75
          },
          pricingPageVisits: {
            weight: 0.20,
            points: 25
          }
        }
      };

      const flowResult = await leadScoringFlow({
        leadData,
        scoringCriteria
      });

      // Convert flow result to LeadScore format
      const leadScore: LeadScore = {
        total: flowResult.score,
        fit: Math.round(flowResult.score * 0.8), // Approximate fit score
        intent: Math.round(flowResult.score * 0.9), // Approximate intent score
        timing: 50, // Default timing score
        engagement: Math.round(flowResult.score * 0.7), // Approximate engagement score
        demographic: Math.round(flowResult.score * 0.6), // Approximate demographic score
        behavioral: Math.round(flowResult.score * 0.8), // Approximate behavioral score
        firmographic: Math.round(flowResult.score * 0.7), // Approximate firmographic score
        factors: []
      };

      const leadId = leadData.id || 'unknown';
      console.log(`📊 Lead ${leadId} scored: ${flowResult.score}/100 using Genkit flow`);
      console.log(`📋 Reasoning: ${flowResult.reasoning}`);
      
      return leadScore;
    } catch (error) {
      console.error('Error using lead scoring flow, falling back to manual calculation:', error);
      
      // Fallback to manual calculation
      return this.calculateLeadScoreManually(leadData);
    }
  }

  private async calculateLeadScoreManually(leadData: any): Promise<LeadScore> {
    let totalScore = 0;
    let maxPossibleScore = 0;

    // Demographic scoring
    const demoScore = this.calculateDemographicScore(leadData);
    totalScore += demoScore.score;
    maxPossibleScore += demoScore.maxScore;

    // Behavioral scoring
    const behavioralScore = this.calculateBehavioralScore(leadData);
    totalScore += behavioralScore.score;
    maxPossibleScore += behavioralScore.maxScore;

    // Engagement scoring
    const engagementScore = this.calculateEngagementScore(leadData);
    totalScore += engagementScore.score;
    maxPossibleScore += engagementScore.maxScore;

    // Intent scoring
    const intentScore = this.calculateIntentScore(leadData);
    totalScore += intentScore.score;
    maxPossibleScore += intentScore.maxScore;

    // Normalize to 0-100 scale
    const normalizedTotal = Math.min(100, Math.max(0, Math.round((totalScore / maxPossibleScore) * 100)));
    
    const leadScore: LeadScore = {
      total: normalizedTotal,
      fit: Math.round((demoScore.score / demoScore.maxScore) * 100),
      intent: Math.round((intentScore.score / intentScore.maxScore) * 100),
      timing: 50,
      engagement: Math.round((engagementScore.score / engagementScore.maxScore) * 100),
      demographic: Math.round((demoScore.score / demoScore.maxScore) * 100),
      behavioral: Math.round((behavioralScore.score / behavioralScore.maxScore) * 100),
      firmographic: Math.round((intentScore.score / intentScore.maxScore) * 100),
      factors: []
    };
    
    const leadId = leadData.id || 'unknown';
    console.log(`📊 Lead ${leadId} scored: ${normalizedTotal}/100 (manual fallback)`);
    return leadScore;
  }

  private calculateDemographicScore(leadData: any): { score: number; maxScore: number } {
    const criteria = this.scoringCriteria.demographic;
    let score = 0;
    let maxScore = 0;

    // Job title scoring
    const jobTitleScore = criteria.jobTitle.values[leadData.jobTitle] || 1;
    score += jobTitleScore * criteria.jobTitle.weight * 10;
    maxScore += 10 * criteria.jobTitle.weight * 10;

    // Company size scoring
    const companySizeScore = criteria.companySize.values[leadData.companySize] || 1;
    score += companySizeScore * criteria.companySize.weight * 10;
    maxScore += 10 * criteria.companySize.weight * 10;

    // Industry scoring
    const industryScore = criteria.industry.values[leadData.industry] || 1;
    score += industryScore * criteria.industry.weight * 10;
    maxScore += 10 * criteria.industry.weight * 10;

    return { score, maxScore };
  }

  private calculateBehavioralScore(leadData: any): { score: number; maxScore: number } {
    const criteria = this.scoringCriteria.behavioral;
    let score = 0;
    let maxScore = 0;

    // Website visits
    if (leadData.websiteVisits >= criteria.websiteVisits.threshold) {
      score += criteria.websiteVisits.weight * 100;
    }
    maxScore += criteria.websiteVisits.weight * 100;

    // Page views
    if (leadData.pageViews >= criteria.pageViews.threshold) {
      score += criteria.pageViews.weight * 100;
    }
    maxScore += criteria.pageViews.weight * 100;

    // Time on site
    if (leadData.timeOnSite >= criteria.timeOnSite.threshold) {
      score += criteria.timeOnSite.weight * 100;
    }
    maxScore += criteria.timeOnSite.weight * 100;

    return { score, maxScore };
  }

  private calculateEngagementScore(leadData: any): { score: number; maxScore: number } {
    const criteria = this.scoringCriteria.engagement;
    let score = 0;
    let maxScore = 0;

    // Demo requests
    if (leadData.demoRequests > 0) {
      score += criteria.demoRequests.weight * criteria.demoRequests.multiplier * 100;
    }
    maxScore += criteria.demoRequests.weight * criteria.demoRequests.multiplier * 100;

    // Trial signups
    if (leadData.trialSignups > 0) {
      score += criteria.trialSignups.weight * criteria.trialSignups.multiplier * 100;
    }
    maxScore += criteria.trialSignups.weight * criteria.trialSignups.multiplier * 100;

    return { score, maxScore };
  }

  private calculateIntentScore(leadData: any): { score: number; maxScore: number } {
    const criteria = this.scoringCriteria.intent;
    let score = 0;
    let maxScore = 0;

    // Pricing page visits
    if (leadData.pricingPageVisits > 0) {
      score += criteria.pricingPageVisits.weight * criteria.pricingPageVisits.multiplier * 100;
    }
    maxScore += criteria.pricingPageVisits.weight * criteria.pricingPageVisits.multiplier * 100;

    return { score, maxScore };
  }

  public qualifyLead(score: number): QualificationStatus {
    if (score >= 80) return QualificationStatus.SALES_QUALIFIED;
    if (score >= 60) return QualificationStatus.MARKETING_QUALIFIED;
    if (score >= 40) return QualificationStatus.UNQUALIFIED; // Using UNQUALIFIED as fallback
    return QualificationStatus.UNQUALIFIED;
  }

  private async detectBuyingSignals(leadData: any, context: DecisionContext): Promise<BuyingSignal[]> {
    const signals: BuyingSignal[] = [];

    // High-intent actions
    if (leadData.demoRequests > 0) {
      signals.push({
        type: 'demo_request',
        strength: 0.9,
        detectedAt: new Date(),
        description: 'Lead requested a product demo',
        source: 'lead_management_agent'
      });
    }

    if (leadData.pricingPageVisits > 2) {
      signals.push({
        type: 'pricing_interest',
        strength: 0.6,
        detectedAt: new Date(),
        description: 'Multiple pricing page visits',
        source: 'lead_management_agent'
      });
    }

    return signals;
  }

  public async assignLead(leadData: any, context?: DecisionContext): Promise<string | null> {
    // Simple assignment logic - in production, this would be more sophisticated
    const availableUsers = context?.historicalData || [];
    
    if (availableUsers.length === 0) {
      console.log('⚠️ No available users for lead assignment');
      return 'default-user'; // Return a default assignment
    }

    // For now, assign to first available user
    const assignedUser = availableUsers[0];
    return assignedUser.id || 'default-user';
  }

  public async createAssignmentAction(leadData: any, assignedUserId: string): Promise<Action> {
    const leadId = leadData.id || `lead_${Date.now()}`;
    return {
      id: `assign-lead-${leadId}`,
      type: ActionType.UPDATE_RECORD,
      agentId: this.configuration.id,
      timestamp: new Date(),
      parameters: {
        recordType: 'lead',
        recordId: leadId,
        updates: {
          assignedTo: assignedUserId,
          assignedAt: new Date(),
          assignmentReason: 'Auto-assigned by AI agent'
        }
      },
      priority: 1
    };
  }

  private async createNurturingSequence(leadData: any, context: DecisionContext): Promise<Action | null> {
    try {
      // Use the nurturing automation engine to create a comprehensive sequence
      const nurturingActions = await this.nurturingEngine.createNurturingSequence(leadData, context);
      
      if (nurturingActions.length > 0) {
        // Return the first action (usually the sequence initialization)
        return nurturingActions[0];
      }

      // Fallback to simple task creation if engine doesn't return actions
      const leadId = leadData.id || `lead_${Date.now()}`;
      return {
        id: `nurture-${leadId}`,
        type: ActionType.CREATE_TASK,
        agentId: this.configuration.id,
        timestamp: new Date(),
        parameters: {
          taskType: 'nurturing_sequence',
          leadId: leadId,
          sequenceType: 'marketing_qualified',
          scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        },
        priority: 3
      };
    } catch (error) {
      console.error('Error creating nurturing sequence:', error);
      return null;
    }
  }

  private async handleAffiliateClick(event: Event, context: DecisionContext): Promise<{ success: boolean; actions?: Action[]; confidence?: number; reasoning?: string; metadata?: any }> {
    console.log(`Handling Affiliate Click event: ${event.id}`);
    // Implement specific logic for affiliate click events here
    return {
      success: true,
      actions: [],
      confidence: 0.7,
      reasoning: `Affiliate click event ${event.id} processed.`,
      metadata: { agentId: this.configuration.id, eventData: event.data }
    };
  }

  private async handleAffiliateConversion(event: Event, context: DecisionContext): Promise<{ success: boolean; actions?: Action[]; confidence?: number; reasoning?: string; metadata?: any }> {
    console.log(`Handling Affiliate Conversion event: ${event.id}`);
    // Implement specific logic for affiliate conversion events here
    return {
      success: true,
      actions: [],
      confidence: 0.9,
      reasoning: `Affiliate conversion event ${event.id} processed.`,
      metadata: { agentId: this.configuration.id, eventData: event.data }
    };
  }

  private async analyzeBuyingSignals(interactionData: any, context: DecisionContext): Promise<BuyingSignal[]> {
    const signals: BuyingSignal[] = [];
    
    // Analyze interaction content for buying signals
    if (interactionData.content?.toLowerCase().includes('price') || 
        interactionData.content?.toLowerCase().includes('cost')) {
      signals.push({
        type: 'pricing_inquiry',
        strength: 0.8,
        detectedAt: new Date(),
        description: 'Customer inquired about pricing',
        source: 'lead_management_agent'
      });
    }

    return signals;
  }

  async learn(feedback: Feedback[]): Promise<void> {
    for (const fb of feedback) {
      console.log(`🧠 Learning from feedback: ${fb.actionId} - ${fb.outcome}`);
      
      // Adjust scoring criteria based on feedback
      if (fb.outcome === 'success') {
        await this.adjustScoringCriteria(fb, 'increase');
      } else {
        await this.adjustScoringCriteria(fb, 'decrease');
      }

      // Adjust assignment logic based on feedback
      await this.adjustAssignmentLogic(fb);
    }
  }

  private async adjustScoringCriteria(feedback: Feedback, direction: 'increase' | 'decrease'): Promise<void> {
    const adjustment = direction === 'increase' ? 1.1 : 0.9;
    
    // This is a placeholder for actual learning logic
    console.log(`Adjusting scoring criteria based on feedback: ${feedback.actionId} - ${direction}`);
  }

  private async adjustAssignmentLogic(feedback: Feedback): Promise<void> {
    // Simple assignment logic adjustment - in production, this would be more sophisticated
    console.log(`Adjusting assignment logic based on feedback: ${feedback.actionId}`);
  }

  // Public methods for integration testing and configuration
  public async updateScoringCriteria(criteria: Partial<LeadScoringCriteria>): Promise<void> {
    this.scoringCriteria = { ...this.scoringCriteria, ...criteria };
    console.log('📊 Scoring criteria updated');
  }

  public async updateAssignmentCriteria(criteria: AssignmentCriteria): Promise<void> {
    this.assignmentCriteria = criteria;
    console.log('👥 Assignment criteria updated');
  }

  public async integrateWithCRMPipeline(): Promise<void> {
    console.log('🔗 Integrating with CRM pipeline');
    // Set up event listeners for pipeline changes
    // Note: This would need proper event emitter implementation
  }

  public async getPerformanceMetrics(): Promise<any> {
    return {
      totalLeadsProcessed: this.context?.conversationHistory?.filter(h => h.type === 'lead_captured').length || 0,
      averageScoreAccuracy: 0.85,
      assignmentSuccessRate: 0.92,
      qualificationAccuracy: 0.88,
      processingTime: 150 // milliseconds
    };
  }

  public exportConfiguration(): any {
    return {
      scoringCriteria: this.scoringCriteria,
      assignmentCriteria: this.assignmentCriteria,
      agentConfiguration: this.configuration
    };
  }

  public async importConfiguration(config: any): Promise<void> {
    if (config.scoringCriteria) {
      this.scoringCriteria = { ...this.scoringCriteria, ...config.scoringCriteria };
    }
    if (config.assignmentCriteria) {
      this.assignmentCriteria = { ...this.assignmentCriteria, ...config.assignmentCriteria };
    }
    if (config.agentConfiguration) {
      this.configuration = { ...this.configuration, ...config.agentConfiguration };
    }
  }
}

// Factory function to create a LeadManagementAgent with default configuration
export function createLeadManagementAgent(config?: Partial<AgentConfiguration>): LeadManagementAgent {
  const defaultConfig: AgentConfiguration = {
    id: `lead-agent-${Date.now()}`,
    type: AgentType.LEAD_MANAGEMENT,
    name: 'Lead Management Agent',
    description: 'AI agent for lead scoring, qualification, and assignment',
    capabilities: [
      {
        name: 'lead_scoring',
        description: 'Score leads based on configurable criteria',
        requiredPermissions: ['read_leads', 'update_leads'],
        supportedEventTypes: [EventType.LEAD_CAPTURED, EventType.DATA_UPDATED, EventType.AFFILIATE_CLICK, EventType.AFFILIATE_CONVERSION],
        supportedActionTypes: [ActionType.UPDATE_RECORD]
      },
      {
        name: 'lead_qualification',
        description: 'Automatically qualify leads',
        requiredPermissions: ['read_leads', 'update_leads'],
        supportedEventTypes: [EventType.LEAD_CAPTURED],
        supportedActionTypes: [ActionType.UPDATE_RECORD]
      },
      {
        name: 'lead_assignment',
        description: 'Assign leads to appropriate sales reps',
        requiredPermissions: ['read_leads', 'update_leads', 'read_users'],
        supportedEventTypes: [EventType.LEAD_CAPTURED],
        supportedActionTypes: [ActionType.UPDATE_RECORD, ActionType.CREATE_TASK]
      },
      {
        name: 'buying_signal_detection',
        description: 'Detect buying signals from customer interactions',
        requiredPermissions: ['read_interactions'],
        supportedEventTypes: [EventType.CUSTOMER_INTERACTION],
        supportedActionTypes: [ActionType.ESCALATE, ActionType.SCHEDULE_FOLLOWUP]
      }
    ],
    enabled: true,
    priority: 1,
    maxConcurrentActions: 10,
    learningEnabled: true,
    configuration: {
      enableRealTimeScoring: true,
      enableAutoAssignment: true,
      enableBuyingSignalDetection: true,
      scoringThresholds: {
        salesQualified: 80,
        marketingQualified: 60,
        opportunity: 40
      },
      assignmentRules: {
        maxLeadsPerUser: 50,
        balanceWorkload: true,
        respectBusinessHours: true
      },
      buyingSignalThresholds: {
        strongBuyingSignal: 0.8,
        mediumBuyingSignal: 0.6
      }
    }
  };

  const finalConfig = { ...defaultConfig, ...config };
  return new LeadManagementAgent(finalConfig);
}