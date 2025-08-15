import { BaseAgent } from './base-agent';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  AgentType,
  EventType,
  ActionType,
  Event,
  Action,
  ExecutionResult,
  Feedback,
  DecisionContext,
  AgentConfiguration
} from './types';

export class JourneyOrchestrationAgent extends BaseAgent {
  protected async processEvents(events: Event[]): Promise<void> {
    console.log(`JourneyOrchestrationAgent ${this.id} processing ${events.length} events`);
    
    for (const event of events) {
      this.context.conversationHistory.push({
        type: 'journey_event',
        timestamp: event.timestamp,
        data: event.data
      });
    }
  }

  protected async makeDecisions(context: DecisionContext): Promise<Action[]> {
    const actions: Action[] = [];
    
    for (const event of context.events) {
      const journeyStage = this.identifyJourneyStage(event);
      const touchpoints = this.planNextTouchpoints(event, journeyStage);
      
      // Trigger appropriate workflows based on journey stage
      for (const touchpoint of touchpoints) {
        actions.push({
          id: `journey_${event.id}_${touchpoint.type}_${Date.now()}`,
          type: ActionType.TRIGGER_WORKFLOW,
          agentId: this.id,
          timestamp: new Date(),
          parameters: {
            workflowType: touchpoint.type,
            customerId: event.customerId,
            leadId: event.leadId,
            journeyStage,
            touchpointData: touchpoint,
            scheduledFor: touchpoint.scheduledFor
          },
          priority: touchpoint.priority
        });
      }

      // Update customer journey record
      actions.push({
        id: `update_journey_${event.id}_${Date.now()}`,
        type: ActionType.UPDATE_RECORD,
        agentId: this.id,
        timestamp: new Date(),
        parameters: {
          recordType: 'customer_journey',
          recordId: event.customerId || event.leadId,
          updates: {
            currentStage: journeyStage,
            lastTouchpoint: new Date(),
            nextPlannedTouchpoints: touchpoints,
            journeyScore: this.calculateJourneyScore(event, journeyStage)
          }
        },
        priority: 4
      });
    }

    return actions;
  }

  protected async executeActions(actions: Action[]): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];

    for (const action of actions) {
      try {
        let result: any = {};

        switch (action.type) {
          case ActionType.TRIGGER_WORKFLOW:
            result = await this.triggerWorkflow(action.parameters);
            break;
          case ActionType.UPDATE_RECORD:
            result = await this.updateJourneyRecord(action.parameters);
            break;
          default:
            throw new Error(`Unsupported action type: ${action.type}`);
        }

        results.push({
          actionId: action.id,
          success: true,
          result,
          timestamp: new Date()
        });
      } catch (error) {
        results.push({
          actionId: action.id,
          success: false,
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date()
        });
      }
    }

    return results;
  }

  protected async processFeedback(feedback: Feedback[]): Promise<void> {
    console.log(`JourneyOrchestrationAgent ${this.id} processing ${feedback.length} feedback items`);
    
    for (const fb of feedback) {
      if (fb.outcome === 'success' && fb.score && fb.score > 0.8) {
        console.log(`High-performing journey touchpoint: ${fb.actionId}`);
      } else if (fb.outcome === 'failure') {
        console.log(`Failed journey touchpoint: ${fb.actionId} - ${fb.details}`);
      }
    }
  }

  private identifyJourneyStage(event: Event): string {
    const eventData = event.data;
    
    // Determine journey stage based on event type and data
    switch (event.type) {
      case EventType.LEAD_CAPTURED:
        return 'awareness';
      case EventType.CUSTOMER_INTERACTION:
        if (eventData.interactionType === 'demo_request') return 'consideration';
        if (eventData.interactionType === 'pricing_inquiry') return 'decision';
        return 'engagement';
      case EventType.DEAL_UPDATED:
        if (eventData.stage === 'proposal') return 'decision';
        if (eventData.stage === 'closed_won') return 'onboarding';
        return 'consideration';
      default:
        return 'engagement';
    }
  }

  private planNextTouchpoints(event: Event, journeyStage: string): Array<{
    type: string;
    scheduledFor: Date;
    priority: number;
    channel: string;
    content: string;
  }> {
    const touchpoints: Array<{
      type: string;
      scheduledFor: Date;
      priority: number;
      channel: string;
      content: string;
    }> = [];

    const now = new Date();

    switch (journeyStage) {
      case 'awareness':
        touchpoints.push({
          type: 'welcome_email',
          scheduledFor: new Date(now.getTime() + 5 * 60 * 1000), // 5 minutes
          priority: 7,
          channel: 'email',
          content: 'Welcome and introduction to our platform'
        });
        touchpoints.push({
          type: 'educational_content',
          scheduledFor: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day
          priority: 5,
          channel: 'email',
          content: 'Industry insights and best practices'
        });
        break;

      case 'engagement':
        touchpoints.push({
          type: 'nurture_email',
          scheduledFor: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
          priority: 6,
          channel: 'email',
          content: 'Product features and benefits'
        });
        touchpoints.push({
          type: 'social_follow',
          scheduledFor: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
          priority: 3,
          channel: 'social',
          content: 'Connect on social media'
        });
        break;

      case 'consideration':
        touchpoints.push({
          type: 'demo_invitation',
          scheduledFor: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 hours
          priority: 8,
          channel: 'email',
          content: 'Personalized demo invitation'
        });
        touchpoints.push({
          type: 'case_study',
          scheduledFor: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
          priority: 6,
          channel: 'email',
          content: 'Relevant customer success stories'
        });
        break;

      case 'decision':
        touchpoints.push({
          type: 'sales_followup',
          scheduledFor: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours
          priority: 9,
          channel: 'phone',
          content: 'Personal sales consultation'
        });
        touchpoints.push({
          type: 'proposal_followup',
          scheduledFor: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day
          priority: 8,
          channel: 'email',
          content: 'Proposal review and Q&A'
        });
        break;

      case 'onboarding':
        touchpoints.push({
          type: 'onboarding_welcome',
          scheduledFor: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes
          priority: 9,
          channel: 'email',
          content: 'Welcome to the platform - getting started guide'
        });
        touchpoints.push({
          type: 'setup_assistance',
          scheduledFor: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 day
          priority: 8,
          channel: 'phone',
          content: 'Setup assistance and training session'
        });
        break;
    }

    return touchpoints;
  }

  private calculateJourneyScore(event: Event, journeyStage: string): number {
    let score = 50; // Base score

    // Adjust based on journey stage progression
    const stageScores = {
      'awareness': 20,
      'engagement': 40,
      'consideration': 60,
      'decision': 80,
      'onboarding': 90,
      'retention': 95
    };

    score = stageScores[journeyStage as keyof typeof stageScores] || 50;

    // Adjust based on engagement level
    const eventData = event.data;
    if (eventData.engagementScore) {
      score = (score + eventData.engagementScore) / 2;
    }

    // Adjust based on time since last interaction
    if (eventData.lastInteractionDate) {
      const daysSinceLastInteraction = Math.floor(
        (Date.now() - new Date(eventData.lastInteractionDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastInteraction > 7) {
        score *= 0.8; // Reduce score for inactive prospects
      } else if (daysSinceLastInteraction < 1) {
        score *= 1.1; // Boost score for recent activity
      }
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }

  private async triggerWorkflow(parameters: any): Promise<any> {
    console.log(`Triggering ${parameters.workflowType} workflow for customer ${parameters.customerId}`);
    
    // Generate AI-powered content for the touchpoint
    const aiContent = await this.generateTouchpointContent(
      parameters.workflowType,
      parameters.journeyStage,
      parameters.touchpointData,
      parameters.customerId
    );

    // Simulate workflow execution with AI-generated content
    const workflowResult = {
      workflowId: `workflow_${Date.now()}`,
      workflowType: parameters.workflowType,
      customerId: parameters.customerId,
      journeyStage: parameters.journeyStage,
      scheduledFor: parameters.scheduledFor,
      status: 'scheduled',
      touchpointData: {
        ...parameters.touchpointData,
        aiGeneratedContent: aiContent
      },
      timestamp: new Date()
    };

    return workflowResult;
  }

  private async generateTouchpointContent(
    workflowType: string, 
    journeyStage: string, 
    touchpointData: any, 
    customerId: string
  ): Promise<string> {
    try {
      // Get API key from environment
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('No API key available, using default touchpoint content');
        return touchpointData.content || `Default ${workflowType} content`;
      }

      // Create AI instance
      const userAI = genkit({
        plugins: [
          googleAI({ apiKey }),
        ],
      });

      const prompt = this.buildTouchpointPrompt(workflowType, journeyStage, touchpointData, customerId);

      const response = await userAI.generate({
        model: googleAI.model('gemini-2.0-flash-exp'),
        prompt: prompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      });

      return response.text || touchpointData.content || `Personalized ${workflowType} content`;

    } catch (error) {
      console.error('AI touchpoint content generation failed:', error);
      // Fallback to default content on error
      return touchpointData.content || `Default ${workflowType} content`;
    }
  }

  private buildTouchpointPrompt(workflowType: string, journeyStage: string, touchpointData: any, customerId: string): string {
    const currentTime = new Date().toLocaleString();
    const channel = touchpointData.channel || 'email';
    
    // Get customer context from conversation history
    const customerContext = this.context.conversationHistory
      .filter(h => h.data.customerId === customerId || h.data.leadId === customerId)
      .slice(-3)
      .map(h => `${h.type}: ${JSON.stringify(h.data)}`)
      .join('\n');

    return `You are a customer journey specialist and marketing automation expert with 10+ years of experience creating personalized, high-converting customer touchpoints that drive engagement and conversions.

## Touchpoint Context
**Current Time:** ${currentTime}
**Workflow Type:** ${workflowType}
**Journey Stage:** ${journeyStage}
**Channel:** ${channel}
**Customer ID:** ${customerId}
**Priority Level:** ${touchpointData.priority}/10

## Customer Context & History
${customerContext || 'New customer - no previous interaction history'}

## Your Mission
Create compelling, personalized content for this specific touchpoint that:
1. Aligns with the customer's current journey stage
2. Provides genuine value and moves them forward
3. Feels personal and relevant to their situation
4. Matches the channel's best practices and tone
5. Includes a clear, appropriate call-to-action

## Journey Stage Guidelines

### ${journeyStage.toUpperCase()} Stage Focus:
${this.getJourneyStageGuidelines(journeyStage)}

## Workflow-Specific Requirements

### ${workflowType.toUpperCase()} Content:
${this.getWorkflowSpecificGuidelines(workflowType, channel)}

## Channel Optimization for ${channel.toUpperCase()}:
${this.getChannelGuidelines(channel)}

## Content Structure Requirements
${channel === 'email' ? `
**Subject Line:** Compelling, personalized subject (40-50 characters)
**Preview Text:** Engaging preview that complements subject (90-100 characters)
**Opening:** Personal greeting with relevant context
**Body:** Value-driven content with clear benefits
**Call-to-Action:** Specific, action-oriented CTA
**Closing:** Professional but warm sign-off
` : channel === 'phone' ? `
**Opening Script:** Warm, professional introduction
**Value Proposition:** Clear reason for the call
**Discovery Questions:** 2-3 relevant questions to ask
**Next Steps:** Clear path forward
**Objection Handling:** Anticipated concerns and responses
` : channel === 'social' ? `
**Hook:** Attention-grabbing opening
**Value:** Quick, digestible insight or tip
**Engagement:** Question or call for interaction
**CTA:** Subtle but clear next step
` : `
**Opening:** Contextual, personalized greeting
**Value Delivery:** Relevant, helpful information
**Clear Next Step:** Obvious path forward
**Professional Tone:** Appropriate for the channel
`}

## Personalization Elements
- Reference their current journey stage and progress
- Acknowledge any previous interactions or touchpoints
- Use language that matches their engagement level
- Include relevant timing and urgency when appropriate
- Show understanding of their business context

## Quality Standards
- Every sentence must provide value or move the relationship forward
- Use conversational, human language (avoid corporate speak)
- Include specific, actionable next steps
- Create genuine curiosity and interest
- Build trust through expertise and helpfulness
- Maintain professional but approachable tone

Generate content that feels personally crafted for this customer at this exact moment in their journey, optimized for maximum engagement and conversion on ${channel}.`;
  }

  private getJourneyStageGuidelines(stage: string): string {
    switch (stage) {
      case 'awareness':
        return `- Welcome and orient the new prospect
- Introduce your value proposition clearly
- Set expectations for the relationship
- Provide immediate value through education
- Build initial trust and credibility
- Focus on problem identification and education`;

      case 'engagement':
        return `- Deepen the relationship through valuable content
- Demonstrate expertise and thought leadership
- Understand their specific needs and challenges
- Provide relevant resources and insights
- Build trust through consistent value delivery
- Move toward more specific solution discussions`;

      case 'consideration':
        return `- Present specific solutions to their identified problems
- Provide social proof and case studies
- Address potential objections proactively
- Demonstrate ROI and business value
- Offer trials, demos, or consultations
- Create urgency around their business needs`;

      case 'decision':
        return `- Provide final reassurance and risk mitigation
- Offer personalized proposals and pricing
- Address any remaining objections or concerns
- Create compelling reasons to act now
- Provide clear next steps to move forward
- Emphasize unique value and differentiation`;

      case 'onboarding':
        return `- Welcome them as a new customer
- Set clear expectations for the onboarding process
- Provide step-by-step guidance and support
- Ensure early wins and quick value realization
- Build confidence in their decision
- Establish ongoing communication patterns`;

      default:
        return `- Provide relevant, valuable content for their current situation
- Move the relationship forward constructively
- Build trust through helpful, expert guidance
- Include clear next steps for continued engagement`;
    }
  }

  private getWorkflowSpecificGuidelines(workflowType: string, channel: string): string {
    switch (workflowType) {
      case 'welcome_email':
        return `- Warm, enthusiastic welcome message
- Set clear expectations for what comes next
- Provide immediate value (resource, tip, or insight)
- Include easy ways to get started or learn more
- Establish your expertise and commitment to their success`;

      case 'educational_content':
        return `- Share valuable industry insights or best practices
- Position yourself as a thought leader and expert
- Provide actionable tips they can implement immediately
- Include relevant examples or case studies
- Encourage engagement through questions or feedback`;

      case 'nurture_email':
        return `- Continue building the relationship with valuable content
- Address common challenges in their industry or role
- Provide solutions and recommendations
- Include social proof or success stories
- Move toward more specific solution discussions`;

      case 'demo_invitation':
        return `- Create excitement about seeing the solution in action
- Highlight specific benefits they'll discover in the demo
- Make scheduling easy and convenient
- Address any potential concerns about time investment
- Emphasize the personalized, relevant nature of the demo`;

      case 'case_study':
        return `- Present a relevant success story from a similar customer
- Highlight specific results and ROI achieved
- Draw parallels to their situation and challenges
- Build confidence in your solution's effectiveness
- Include a clear path to achieve similar results`;

      case 'sales_followup':
        return `- Reference previous conversations and context
- Provide additional information or clarification
- Address any concerns or objections raised
- Present next steps clearly and confidently
- Create appropriate urgency around their timeline`;

      case 'proposal_followup':
        return `- Check on their review of the proposal
- Offer to clarify any questions or concerns
- Provide additional supporting information if needed
- Suggest a meeting to discuss next steps
- Reinforce the value and ROI of moving forward`;

      case 'onboarding_welcome':
        return `- Celebrate their decision to move forward
- Outline the onboarding process and timeline
- Set expectations for support and communication
- Provide immediate next steps to get started
- Reassure them about the value they'll receive`;

      case 'setup_assistance':
        return `- Offer specific help with implementation
- Provide resources and documentation
- Schedule training or consultation sessions
- Address any technical or process questions
- Ensure they feel supported and confident`;

      default:
        return `- Provide relevant, helpful content for this touchpoint
- Move the customer relationship forward
- Include appropriate calls-to-action
- Maintain professional, engaging tone`;
    }
  }

  private getChannelGuidelines(channel: string): string {
    switch (channel) {
      case 'email':
        return `- Subject line must be compelling and personal (40-50 chars)
- Preview text should complement and expand on subject
- Use scannable formatting with bullet points and short paragraphs
- Include one clear, prominent call-to-action
- Mobile-optimize for readability
- Professional but conversational tone`;

      case 'phone':
        return `- Prepare a warm, professional opening
- Have a clear reason for calling and value proposition
- Include discovery questions to understand their needs
- Be ready to handle common objections
- End with specific next steps and follow-up plan`;

      case 'social':
        return `- Keep content concise and engaging
- Use platform-appropriate language and tone
- Include relevant hashtags or mentions
- Encourage interaction and engagement
- Provide value in a shareable format`;

      case 'sms':
        return `- Keep messages short and to the point
- Include clear value proposition
- Use conversational, friendly tone
- Include easy way to respond or take action
- Respect frequency and timing preferences`;

      default:
        return `- Match the channel's typical communication style
- Optimize content length for the platform
- Include appropriate calls-to-action
- Maintain professional, engaging tone`;
    }
  }

  private async updateJourneyRecord(parameters: any): Promise<any> {
    console.log(`Updating journey record for ${parameters.recordId}`);
    
    return {
      recordId: parameters.recordId,
      recordType: parameters.recordType,
      updatedFields: Object.keys(parameters.updates),
      journeyStage: parameters.updates.currentStage,
      journeyScore: parameters.updates.journeyScore,
      timestamp: new Date()
    };
  }

  // Advanced journey optimization methods
  public async optimizeJourneyPath(customerId: string, currentStage: string, historicalData: any[]): Promise<{
    recommendedPath: string[];
    expectedConversionRate: number;
    estimatedTimeToConversion: number;
  }> {
    // Analyze historical data to optimize journey paths
    const pathAnalysis = this.analyzeHistoricalPaths(historicalData);
    const recommendedPath = this.generateOptimalPath(currentStage, pathAnalysis);
    
    return {
      recommendedPath,
      expectedConversionRate: this.calculateExpectedConversion(recommendedPath, pathAnalysis),
      estimatedTimeToConversion: this.estimateConversionTime(recommendedPath, pathAnalysis)
    };
  }

  private analyzeHistoricalPaths(historicalData: any[]): any {
    // Analyze successful conversion paths from historical data
    const successfulPaths = historicalData.filter(data => data.converted);
    const pathFrequency: Record<string, number> = {};
    
    successfulPaths.forEach(path => {
      const pathKey = path.stages.join(' -> ');
      pathFrequency[pathKey] = (pathFrequency[pathKey] || 0) + 1;
    });

    return {
      mostSuccessfulPaths: Object.entries(pathFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      averageConversionTime: this.calculateAverageConversionTime(successfulPaths),
      stageConversionRates: this.calculateStageConversionRates(historicalData)
    };
  }

  private generateOptimalPath(currentStage: string, pathAnalysis: any): string[] {
    // Generate optimal path based on analysis
    const commonPaths = {
      'awareness': ['awareness', 'engagement', 'consideration', 'decision', 'onboarding'],
      'engagement': ['engagement', 'consideration', 'decision', 'onboarding'],
      'consideration': ['consideration', 'decision', 'onboarding'],
      'decision': ['decision', 'onboarding'],
      'onboarding': ['onboarding', 'retention']
    };

    return commonPaths[currentStage as keyof typeof commonPaths] || ['engagement', 'consideration', 'decision'];
  }

  private calculateExpectedConversion(path: string[], pathAnalysis: any): number {
    // Calculate expected conversion rate based on path and historical data
    let conversionRate = 0.15; // Base conversion rate
    
    // Adjust based on path length and historical performance
    if (path.length <= 3) conversionRate *= 1.2; // Shorter paths tend to convert better
    if (path.includes('consideration') && path.includes('decision')) conversionRate *= 1.3;
    
    return Math.min(1, conversionRate);
  }

  private estimateConversionTime(path: string[], pathAnalysis: any): number {
    // Estimate time to conversion in days
    const stageTimings = {
      'awareness': 3,
      'engagement': 7,
      'consideration': 14,
      'decision': 21,
      'onboarding': 7
    };

    return path.reduce((total, stage) => {
      return total + (stageTimings[stage as keyof typeof stageTimings] || 7);
    }, 0);
  }

  private calculateAverageConversionTime(successfulPaths: any[]): number {
    if (successfulPaths.length === 0) return 30; // Default 30 days
    
    const totalTime = successfulPaths.reduce((sum, path) => sum + (path.conversionTime || 30), 0);
    return totalTime / successfulPaths.length;
  }

  private calculateStageConversionRates(historicalData: any[]): Record<string, number> {
    const stageConversions: Record<string, { total: number; converted: number }> = {};
    
    historicalData.forEach(data => {
      data.stages?.forEach((stage: string) => {
        if (!stageConversions[stage]) {
          stageConversions[stage] = { total: 0, converted: 0 };
        }
        stageConversions[stage].total++;
        if (data.converted) {
          stageConversions[stage].converted++;
        }
      });
    });

    const conversionRates: Record<string, number> = {};
    Object.entries(stageConversions).forEach(([stage, data]) => {
      conversionRates[stage] = data.total > 0 ? data.converted / data.total : 0;
    });

    return conversionRates;
  }
}

export function createJourneyOrchestrationAgent(id: string): JourneyOrchestrationAgent {
  const config: AgentConfiguration = {
    id,
    type: AgentType.JOURNEY_ORCHESTRATION,
    name: `Journey Orchestration Agent ${id}`,
    description: 'Orchestrates customer journeys and touchpoints',
    capabilities: [
      {
        name: 'Journey Orchestration',
        description: 'Plans and executes customer journey touchpoints',
        requiredPermissions: ['read_customers', 'trigger_workflows', 'update_journeys'],
        supportedEventTypes: [
          EventType.LEAD_CAPTURED,
          EventType.CUSTOMER_INTERACTION,
          EventType.DEAL_UPDATED
        ],
        supportedActionTypes: [
          ActionType.TRIGGER_WORKFLOW,
          ActionType.UPDATE_RECORD
        ]
      }
    ],
    enabled: true,
    priority: 5,
    maxConcurrentActions: 12,
    learningEnabled: true,
    configuration: {
      touchpointOptimization: true,
      personalizedJourneys: true,
      multiChannelOrchestration: true
    }
  };

  return new JourneyOrchestrationAgent(config);
}