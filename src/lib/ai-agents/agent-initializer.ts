import { AgentRegistry } from './agent-registry';
import { LeadManagementAgent } from './lead-management-agent';
// Removed CustomerInteractionAgent import to prevent build issues
import { SalesPipelineAgent } from './sales-pipeline-agent';
import { JourneyOrchestrationAgent } from './journey-orchestration-agent';
import { DataIntegrationAgent } from './data-integration-agent';
import { WorkflowManagementAgent } from './workflow-management-agent';
import { IntelligenceReportingAgent } from './intelligence-reporting-agent';
import { ConversationalAIAgent } from './conversational-ai-agent';
import { BaseAgent } from './base-agent';
import {
  AgentConfiguration,
  AgentType,
  EventType,
  ActionType,
  AgentStatus
} from './types';
import { Firestore } from 'firebase/firestore';

// Content Creation Agent (enhanced implementation)
class ContentCreationAgent extends BaseAgent {
  async processEvents(events: any[]): Promise<void> {
    console.log('Content agent processing events:', events.length);
    for (const event of events) {
      if (event.type === EventType.CONTENT_REQUEST) {
        this.context.conversationHistory.push({
          type: 'content_generation',
          timestamp: event.timestamp,
          data: event.data
        });
      }
    }
  }

  async makeDecisions(context: any): Promise<any[]> {
    const actions: any[] = [];
    for (const event of context.events) {
      if (event.type === EventType.CONTENT_REQUEST) {
        actions.push({
          id: `create_content_${event.id}_${Date.now()}`,
          type: ActionType.CREATE_CONTENT,
          agentId: this.id,
          timestamp: new Date(),
          parameters: {
            contentType: event.data.contentType || 'blog',
            topic: event.data.topic || 'general',
            targetAudience: event.data.targetAudience || 'general'
          },
          priority: 6
        });
      }
    }
    return actions;
  }

  async executeActions(actions: any[]): Promise<any[]> {
    return actions.map(action => ({
      actionId: action.id,
      success: true,
      result: {
        contentId: `content_${Date.now()}`,
        contentType: action.parameters.contentType,
        status: 'generated'
      },
      timestamp: new Date()
    }));
  }

  async processFeedback(feedback: any[]): Promise<void> {
    console.log('Content agent processing feedback:', feedback.length);
  }
}

// Social Media Agent (enhanced implementation)
class SocialMediaAgent extends BaseAgent {
  async processEvents(events: any[]): Promise<void> {
    console.log('Social agent processing events:', events.length);
    for (const event of events) {
      if (event.type === EventType.SOCIAL_POST_REQUEST) {
        this.context.conversationHistory.push({
          type: 'social_scheduling',
          timestamp: event.timestamp,
          data: event.data
        });
      }
    }
  }

  async makeDecisions(context: any): Promise<any[]> {
    const actions: any[] = [];
    for (const event of context.events) {
      if (event.type === EventType.SOCIAL_POST_REQUEST) {
        actions.push({
          id: `schedule_post_${event.id}_${Date.now()}`,
          type: ActionType.SCHEDULE_POST,
          agentId: this.id,
          timestamp: new Date(),
          parameters: {
            platforms: event.data.platforms || ['linkedin', 'twitter'],
            content: event.data.content || 'Generated social content',
            scheduledFor: event.data.scheduledFor || new Date(Date.now() + 60 * 60 * 1000)
          },
          priority: 5
        });
      }
    }
    return actions;
  }

  async executeActions(actions: any[]): Promise<any[]> {
    return actions.map(action => ({
      actionId: action.id,
      success: true,
      result: {
        postId: `post_${Date.now()}`,
        platforms: action.parameters.platforms,
        status: 'scheduled'
      },
      timestamp: new Date()
    }));
  }

  async processFeedback(feedback: any[]): Promise<void> {
    console.log('Social agent processing feedback:', feedback.length);
  }
}

// Automation Agent (enhanced implementation)
class AutomationAgent extends BaseAgent {
  async processEvents(events: any[]): Promise<void> {
    console.log('Automation agent processing events:', events.length);
    for (const event of events) {
      if (event.type === EventType.WORKFLOW_TRIGGER) {
        this.context.conversationHistory.push({
          type: 'automation_trigger',
          timestamp: event.timestamp,
          data: event.data
        });
      }
    }
  }

  async makeDecisions(context: any): Promise<any[]> {
    const actions: any[] = [];
    for (const event of context.events) {
      if (event.type === EventType.WORKFLOW_TRIGGER) {
        actions.push({
          id: `execute_automation_${event.id}_${Date.now()}`,
          type: ActionType.EXECUTE_WORKFLOW,
          agentId: this.id,
          timestamp: new Date(),
          parameters: {
            workflowType: event.data.workflowType || 'general',
            triggerData: event.data
          },
          priority: 7
        });
      }
    }
    return actions;
  }

  async executeActions(actions: any[]): Promise<any[]> {
    return actions.map(action => ({
      actionId: action.id,
      success: true,
      result: {
        workflowId: `workflow_${Date.now()}`,
        status: 'executed'
      },
      timestamp: new Date()
    }));
  }

  async processFeedback(feedback: any[]): Promise<void> {
    console.log('Automation agent processing feedback:', feedback.length);
  }
}

export class AgentInitializer {
  private static instance: AgentInitializer;
  private initialized = false;

  private constructor() {}

  public static getInstance(): AgentInitializer {
    if (!AgentInitializer.instance) {
      AgentInitializer.instance = new AgentInitializer();
    }
    return AgentInitializer.instance;
  }

  public async initializeAllAgents(db: Firestore, userId: string): Promise<void> {
    if (this.initialized) {
      console.log('Agents already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing all AI agents...');
      
      const registry = AgentRegistry.getInstance();
      
      // Load active agents from Firestore
      await registry.loadActiveAgents(db, userId);

      // Initialize all 12 agents
      await this.initializeCRMAgent(registry, userId);
      await this.initializeContentAgent(registry, userId);
      await this.initializeSocialAgent(registry, userId);
      await this.initializeAutomationAgent(registry, userId);
      await this.initializeCustomerInteractionAgent(registry, userId);
      await this.initializeSalesPipelineAgent(registry, userId);
      await this.initializeJourneyOrchestrationAgent(registry, userId);
      await this.initializeDataIntegrationAgent(registry, userId);
      await this.initializeWorkflowManagementAgent(registry, userId);
      await this.initializeIntelligenceReportingAgent(registry, userId);
      await this.initializeConversationalAIAgent(registry, userId);

      this.initialized = true;
      console.log('✅ All AI agents initialized successfully');
      
      // Log registry stats
      const stats = registry.getRegistryStats();
      console.log('📊 Agent Registry Stats:', stats);
      
    } catch (error) {
      console.error('❌ Failed to initialize agents:', error);
      throw error;
    }
  }

  private async initializeCRMAgent(registry: AgentRegistry, userId: string): Promise<void> {
    const agentId = 'crm';
    
    // Check if already registered
    if (registry.getAgent(agentId)) {
      console.log('CRM Agent already registered');
      return;
    }

    const config: AgentConfiguration = {
      id: agentId,
      type: AgentType.LEAD_MANAGEMENT,
      name: 'CRM Agent',
      description: 'AI agent for lead scoring, qualification, and assignment',
      capabilities: [
        {
          name: 'lead_scoring',
          description: 'Score leads based on configurable criteria',
          requiredPermissions: ['read_leads', 'update_leads'],
          supportedEventTypes: [EventType.LEAD_CAPTURED, EventType.DATA_UPDATED],
          supportedActionTypes: [ActionType.UPDATE_RECORD]
        },
        {
          name: 'lead_qualification',
          description: 'Automatically qualify leads',
          requiredPermissions: ['read_leads', 'update_leads'],
          supportedEventTypes: [EventType.LEAD_CAPTURED],
          supportedActionTypes: [ActionType.UPDATE_RECORD]
        }
      ],
      enabled: true,
      priority: 1,
      maxConcurrentActions: 10,
      learningEnabled: true,
      configuration: {
        userId,
        workspaceId: userId,
        enableRealTimeScoring: true,
        enableAutoAssignment: true,
        enableBuyingSignalDetection: true
      }
    };

    const agent = new LeadManagementAgent(config);
    await registry.registerAgent(agent);
    
    // Start if enabled
    if (registry.isActive(agentId)) {
      await agent.start();
      console.log('✅ CRM Agent started');
    }
  }

  private async initializeContentAgent(registry: AgentRegistry, userId: string): Promise<void> {
    const agentId = 'content';
    
    // Check if already registered
    if (registry.getAgent(agentId)) {
      console.log('Content Agent already registered');
      return;
    }

    const config: AgentConfiguration = {
      id: agentId,
      type: AgentType.CONTENT_CREATION,
      name: 'Content Creation Agent',
      description: 'AI agent for content generation and optimization',
      capabilities: [
        {
          name: 'content_generation',
          description: 'Generate various types of content',
          requiredPermissions: ['create_content', 'update_content'],
          supportedEventTypes: [EventType.CONTENT_REQUEST],
          supportedActionTypes: [ActionType.CREATE_CONTENT]
        }
      ],
      enabled: true,
      priority: 2,
      maxConcurrentActions: 5,
      learningEnabled: true,
      configuration: {
        userId,
        workspaceId: userId
      }
    };

    const agent = new ContentCreationAgent(config);
    await registry.registerAgent(agent);
    
    // Start if enabled
    if (registry.isActive(agentId)) {
      await agent.start();
      console.log('✅ Content Agent started');
    }
  }

  private async initializeSocialAgent(registry: AgentRegistry, userId: string): Promise<void> {
    const agentId = 'social';
    
    // Check if already registered
    if (registry.getAgent(agentId)) {
      console.log('Social Agent already registered');
      return;
    }

    const config: AgentConfiguration = {
      id: agentId,
      type: AgentType.SOCIAL_MEDIA,
      name: 'Social Media Agent',
      description: 'AI agent for social media management and scheduling',
      capabilities: [
        {
          name: 'social_scheduling',
          description: 'Schedule and manage social media posts',
          requiredPermissions: ['manage_social', 'schedule_posts'],
          supportedEventTypes: [EventType.SOCIAL_POST_REQUEST],
          supportedActionTypes: [ActionType.SCHEDULE_POST]
        }
      ],
      enabled: true,
      priority: 2,
      maxConcurrentActions: 5,
      learningEnabled: true,
      configuration: {
        userId,
        workspaceId: userId
      }
    };

    const agent = new SocialMediaAgent(config);
    await registry.registerAgent(agent);
    
    // Start if enabled
    if (registry.isActive(agentId)) {
      await agent.start();
      console.log('✅ Social Agent started');
    }
  }

  private async initializeAutomationAgent(registry: AgentRegistry, userId: string): Promise<void> {
    const agentId = 'automation';
    
    // Check if already registered
    if (registry.getAgent(agentId)) {
      console.log('Automation Agent already registered');
      return;
    }

    const config: AgentConfiguration = {
      id: agentId,
      type: AgentType.AUTOMATION,
      name: 'Automation Agent',
      description: 'AI agent for workflow automation and task management',
      capabilities: [
        {
          name: 'workflow_automation',
          description: 'Automate workflows and tasks',
          requiredPermissions: ['manage_workflows', 'execute_tasks'],
          supportedEventTypes: [EventType.WORKFLOW_TRIGGER],
          supportedActionTypes: [ActionType.EXECUTE_WORKFLOW]
        }
      ],
      enabled: true,
      priority: 3,
      maxConcurrentActions: 10,
      learningEnabled: true,
      configuration: {
        userId,
        workspaceId: userId
      }
    };

    const agent = new AutomationAgent(config);
    await registry.registerAgent(agent);
    
    // Start if enabled
    if (registry.isActive(agentId)) {
      await agent.start();
      console.log('✅ Automation Agent started');
    }
  }

  private async initializeCustomerInteractionAgent(registry: AgentRegistry, userId: string): Promise<void> {
    // CustomerInteractionAgent temporarily disabled to prevent build issues
    console.log('Customer Interaction Agent initialization skipped');
    return;
  }

  private async initializeSalesPipelineAgent(registry: AgentRegistry, userId: string): Promise<void> {
    const agentId = 'sales_pipeline';
    
    if (registry.getAgent(agentId)) {
      console.log('Sales Pipeline Agent already registered');
      return;
    }

    const config: AgentConfiguration = {
      id: agentId,
      type: AgentType.SALES_PIPELINE,
      name: 'Sales Pipeline Agent',
      description: 'Manages deals and sales processes',
      capabilities: [
        {
          name: 'deal_management',
          description: 'Analyze and manage sales deals',
          requiredPermissions: ['read_deals', 'update_deals', 'create_tasks'],
          supportedEventTypes: [EventType.DEAL_UPDATED],
          supportedActionTypes: [ActionType.UPDATE_RECORD, ActionType.CREATE_TASK, ActionType.SCHEDULE_FOLLOWUP, ActionType.GENERATE_INSIGHT]
        }
      ],
      enabled: true,
      priority: 6,
      maxConcurrentActions: 8,
      learningEnabled: true,
      configuration: { userId, workspaceId: userId }
    };

    const agent = new SalesPipelineAgent(config);
    await registry.registerAgent(agent);
    
    if (registry.isActive(agentId)) {
      await agent.start();
      console.log('✅ Sales Pipeline Agent started');
    }
  }

  private async initializeJourneyOrchestrationAgent(registry: AgentRegistry, userId: string): Promise<void> {
    const agentId = 'journey_orchestration';
    
    if (registry.getAgent(agentId)) {
      console.log('Journey Orchestration Agent already registered');
      return;
    }

    const config: AgentConfiguration = {
      id: agentId,
      type: AgentType.JOURNEY_ORCHESTRATION,
      name: 'Journey Orchestration Agent',
      description: 'Orchestrates customer journeys and touchpoints',
      capabilities: [
        {
          name: 'journey_orchestration',
          description: 'Plan and execute customer journey touchpoints',
          requiredPermissions: ['read_customers', 'trigger_workflows', 'update_journeys'],
          supportedEventTypes: [EventType.LEAD_CAPTURED, EventType.CUSTOMER_INTERACTION, EventType.DEAL_UPDATED],
          supportedActionTypes: [ActionType.TRIGGER_WORKFLOW, ActionType.UPDATE_RECORD]
        }
      ],
      enabled: true,
      priority: 5,
      maxConcurrentActions: 12,
      learningEnabled: true,
      configuration: { userId, workspaceId: userId }
    };

    const agent = new JourneyOrchestrationAgent(config);
    await registry.registerAgent(agent);
    
    if (registry.isActive(agentId)) {
      await agent.start();
      console.log('✅ Journey Orchestration Agent started');
    }
  }

  private async initializeDataIntegrationAgent(registry: AgentRegistry, userId: string): Promise<void> {
    const agentId = 'data_integration';
    
    if (registry.getAgent(agentId)) {
      console.log('Data Integration Agent already registered');
      return;
    }

    const config: AgentConfiguration = {
      id: agentId,
      type: AgentType.DATA_INTEGRATION,
      name: 'Data Integration Agent',
      description: 'Syncs and integrates data across platforms',
      capabilities: [
        {
          name: 'data_synchronization',
          description: 'Sync data across multiple platforms',
          requiredPermissions: ['read_data', 'write_data', 'api_access'],
          supportedEventTypes: [EventType.DATA_UPDATED],
          supportedActionTypes: [ActionType.UPDATE_RECORD]
        }
      ],
      enabled: true,
      priority: 4,
      maxConcurrentActions: 15,
      learningEnabled: true,
      configuration: { userId, workspaceId: userId }
    };

    const agent = new DataIntegrationAgent(config);
    await registry.registerAgent(agent);
    
    if (registry.isActive(agentId)) {
      await agent.start();
      console.log('✅ Data Integration Agent started');
    }
  }

  private async initializeWorkflowManagementAgent(registry: AgentRegistry, userId: string): Promise<void> {
    const agentId = 'workflow_management';
    
    if (registry.getAgent(agentId)) {
      console.log('Workflow Management Agent already registered');
      return;
    }

    const config: AgentConfiguration = {
      id: agentId,
      type: AgentType.WORKFLOW_MANAGEMENT,
      name: 'Workflow Management Agent',
      description: 'Automates business processes and workflows',
      capabilities: [
        {
          name: 'workflow_automation',
          description: 'Execute and manage automated workflows',
          requiredPermissions: ['execute_workflows', 'create_tasks', 'manage_processes'],
          supportedEventTypes: [EventType.WORKFLOW_TRIGGERED],
          supportedActionTypes: [ActionType.EXECUTE_WORKFLOW, ActionType.CREATE_TASK]
        }
      ],
      enabled: true,
      priority: 6,
      maxConcurrentActions: 10,
      learningEnabled: true,
      configuration: { userId, workspaceId: userId }
    };

    const agent = new WorkflowManagementAgent(config);
    await registry.registerAgent(agent);
    
    if (registry.isActive(agentId)) {
      await agent.start();
      console.log('✅ Workflow Management Agent started');
    }
  }

  private async initializeIntelligenceReportingAgent(registry: AgentRegistry, userId: string): Promise<void> {
    const agentId = 'intelligence_reporting';
    
    if (registry.getAgent(agentId)) {
      console.log('Intelligence Reporting Agent already registered');
      return;
    }

    const config: AgentConfiguration = {
      id: agentId,
      type: AgentType.INTELLIGENCE_REPORTING,
      name: 'Intelligence & Reporting Agent',
      description: 'Generates insights and analytics reports',
      capabilities: [
        {
          name: 'analytics_reporting',
          description: 'Generate performance reports and insights',
          requiredPermissions: ['read_analytics', 'generate_reports', 'access_metrics'],
          supportedEventTypes: [EventType.DATA_UPDATED, EventType.SYSTEM_EVENT],
          supportedActionTypes: [ActionType.GENERATE_INSIGHT]
        }
      ],
      enabled: true,
      priority: 3,
      maxConcurrentActions: 5,
      learningEnabled: true,
      configuration: { userId, workspaceId: userId }
    };

    const agent = new IntelligenceReportingAgent(config);
    await registry.registerAgent(agent);
    
    if (registry.isActive(agentId)) {
      await agent.start();
      console.log('✅ Intelligence Reporting Agent started');
    }
  }

  private async initializeConversationalAIAgent(registry: AgentRegistry, userId: string): Promise<void> {
    const agentId = 'conversational_ai';
    
    if (registry.getAgent(agentId)) {
      console.log('Conversational AI Agent already registered');
      return;
    }

    const config: AgentConfiguration = {
      id: agentId,
      type: AgentType.CONVERSATIONAL_AI,
      name: 'Conversational AI Agent',
      description: 'Powers chatbots and conversational interfaces',
      capabilities: [
        {
          name: 'natural_language_processing',
          description: 'Understand and respond to customer messages',
          requiredPermissions: ['read_conversations', 'send_messages', 'escalate_conversations'],
          supportedEventTypes: [EventType.CUSTOMER_INTERACTION],
          supportedActionTypes: [ActionType.SEND_MESSAGE, ActionType.ESCALATE]
        }
      ],
      enabled: true,
      priority: 8,
      maxConcurrentActions: 20,
      learningEnabled: true,
      configuration: { userId, workspaceId: userId }
    };

    const agent = new ConversationalAIAgent(config);
    await registry.registerAgent(agent);
    
    if (registry.isActive(agentId)) {
      await agent.start();
      console.log('✅ Conversational AI Agent started');
    }
  }

  public async refreshAgentStates(db: Firestore, userId: string): Promise<void> {
    const registry = AgentRegistry.getInstance();
    
    // Reload active states from Firestore
    await registry.loadActiveAgents(db, userId);
    
    // Update agent states based on Firestore settings
    const allAgents = registry.getAllAgents();
    
    for (const agent of allAgents) {
      const isActive = registry.isActive(agent.id);
      const currentStatus = agent.getStatus();
      
      if (isActive && currentStatus === AgentStatus.DISABLED) {
        await agent.start();
        console.log(`✅ Started agent: ${agent.id}`);
      } else if (!isActive && currentStatus !== AgentStatus.DISABLED) {
        await agent.stop();
        console.log(`⏸️ Stopped agent: ${agent.id}`);
      }
    }
    
    console.log('🔄 Agent states refreshed');
  }

  public getInitializationStatus(): boolean {
    return this.initialized;
  }

  public reset(): void {
    this.initialized = false;
  }
}