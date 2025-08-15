import { AgentRegistry } from './agent-registry';
import { AgentType, EventType, ActionType, Event, Action } from './types';
import { Firestore, doc, updateDoc, collection, addDoc } from 'firebase/firestore';

export interface PipelineIntegration {
  agentType: AgentType;
  pipelineFeature: string;
  eventMappings: EventMapping[];
  actionMappings: ActionMapping[];
}

export interface EventMapping {
  sourceEvent: string;
  targetEventType: EventType;
  dataTransform?: (data: any) => any;
}

export interface ActionMapping {
  actionType: ActionType;
  targetFeature: string;
  handler: (action: Action) => Promise<void>;
}

export class PipelineIntegrationService {
  private static instance: PipelineIntegrationService;
  private registry: AgentRegistry;
  private integrations: Map<string, PipelineIntegration[]> = new Map();
  private db?: Firestore;
  private workspaceId?: string;

  private constructor() {
    this.registry = AgentRegistry.getInstance();
    this.setupIntegrations();
  }

  public static getInstance(): PipelineIntegrationService {
    if (!PipelineIntegrationService.instance) {
      PipelineIntegrationService.instance = new PipelineIntegrationService();
    }
    return PipelineIntegrationService.instance;
  }

  public initialize(db: Firestore, workspaceId: string) {
    this.db = db;
    this.workspaceId = workspaceId;
  }

  private setupIntegrations() {
    // Lead Management Agent integrations
    this.addIntegration({
      agentType: AgentType.LEAD_MANAGEMENT,
      pipelineFeature: 'crm',
      eventMappings: [
        {
          sourceEvent: 'form_submission',
          targetEventType: EventType.LEAD_CAPTURED,
          dataTransform: (data) => ({
            leadId: data.id,
            source: 'form',
            contactInfo: data.formData,
            timestamp: new Date()
          })
        }
      ],
      actionMappings: [
        {
          actionType: ActionType.CREATE_TASK,
          targetFeature: 'crm',
          handler: this.handleCRMTaskCreation.bind(this)
        },
        {
          actionType: ActionType.UPDATE_RECORD,
          targetFeature: 'crm',
          handler: this.handleCRMRecordUpdate.bind(this)
        }
      ]
    });

    // Customer Interaction Agent integrations
    this.addIntegration({
      agentType: AgentType.CUSTOMER_INTERACTION,
      pipelineFeature: 'conversations',
      eventMappings: [
        {
          sourceEvent: 'message_received',
          targetEventType: EventType.CUSTOMER_INTERACTION,
          dataTransform: (data) => ({
            customerId: data.customerId,
            message: data.content,
            channel: data.channel,
            timestamp: new Date()
          })
        }
      ],
      actionMappings: [
        {
          actionType: ActionType.SEND_MESSAGE,
          targetFeature: 'conversations',
          handler: this.handleMessageSend.bind(this)
        }
      ]
    });

    // Sales Pipeline Agent integrations
    this.addIntegration({
      agentType: AgentType.SALES_PIPELINE,
      pipelineFeature: 'crm',
      eventMappings: [
        {
          sourceEvent: 'deal_stage_change',
          targetEventType: EventType.DEAL_UPDATED,
          dataTransform: (data) => ({
            dealId: data.dealId,
            previousStage: data.previousStage,
            newStage: data.newStage,
            timestamp: new Date()
          })
        }
      ],
      actionMappings: [
        {
          actionType: ActionType.SCHEDULE_FOLLOWUP,
          targetFeature: 'crm',
          handler: this.handleFollowupScheduling.bind(this)
        }
      ]
    });

    // Journey Orchestration Agent integrations
    this.addIntegration({
      agentType: AgentType.JOURNEY_ORCHESTRATION,
      pipelineFeature: 'automations',
      eventMappings: [
        {
          sourceEvent: 'customer_journey_trigger',
          targetEventType: EventType.WORKFLOW_TRIGGERED,
          dataTransform: (data) => ({
            customerId: data.customerId,
            journeyStage: data.stage,
            triggerEvent: data.trigger,
            timestamp: new Date()
          })
        }
      ],
      actionMappings: [
        {
          actionType: ActionType.TRIGGER_WORKFLOW,
          targetFeature: 'automations',
          handler: this.handleWorkflowTrigger.bind(this)
        }
      ]
    });

    // Email Marketing integrations
    this.addIntegration({
      agentType: AgentType.CUSTOMER_INTERACTION,
      pipelineFeature: 'email',
      eventMappings: [
        {
          sourceEvent: 'email_opened',
          targetEventType: EventType.CUSTOMER_INTERACTION,
          dataTransform: (data) => ({
            customerId: data.customerId,
            emailId: data.emailId,
            action: 'opened',
            timestamp: new Date()
          })
        }
      ],
      actionMappings: [
        {
          actionType: ActionType.SEND_MESSAGE,
          targetFeature: 'email',
          handler: this.handleEmailSend.bind(this)
        }
      ]
    });
  }

  private addIntegration(integration: PipelineIntegration) {
    const key = `${integration.agentType}_${integration.pipelineFeature}`;
    if (!this.integrations.has(key)) {
      this.integrations.set(key, []);
    }
    this.integrations.get(key)!.push(integration);
  }

  public async processEvent(sourceEvent: string, data: any, pipelineFeature: string) {
    if (!this.db || !this.workspaceId) return;

    // Find relevant integrations
    const relevantIntegrations = Array.from(this.integrations.values())
      .flat()
      .filter(integration => 
        integration.pipelineFeature === pipelineFeature &&
        integration.eventMappings.some(mapping => mapping.sourceEvent === sourceEvent)
      );

    for (const integration of relevantIntegrations) {
      const agent = this.registry.getAgentsByType(integration.agentType)[0];
      if (!agent || !this.registry.isActive(agent.id)) continue;

      // Transform and send events to agent
      for (const mapping of integration.eventMappings) {
        if (mapping.sourceEvent === sourceEvent) {
          const transformedData = mapping.dataTransform ? mapping.dataTransform(data) : data;
          const event: Event = {
            id: `${Date.now()}_${Math.random()}`,
            type: mapping.targetEventType,
            timestamp: new Date(),
            source: pipelineFeature,
            data: transformedData,
            priority: 1
          };

          await agent.perceive([event]);
        }
      }
    }
  }

  // Action handlers for different pipeline features
  private async handleCRMTaskCreation(action: Action) {
    if (!this.db || !this.workspaceId) return;

    try {
      const tasksRef = collection(this.db, 'workspaces', this.workspaceId, 'tasks');
      await addDoc(tasksRef, {
        title: action.parameters.title || 'AI Generated Task',
        description: action.parameters.description || '',
        assignedTo: action.parameters.assignedTo || null,
        dueDate: action.parameters.dueDate || null,
        priority: action.parameters.priority || 'medium',
        status: 'pending',
        createdBy: 'ai_agent',
        createdAt: new Date(),
        leadId: action.parameters.leadId || null,
        dealId: action.parameters.dealId || null
      });
    } catch (error) {
      console.error('Error creating CRM task:', error);
    }
  }

  private async handleCRMRecordUpdate(action: Action) {
    if (!this.db || !this.workspaceId) return;

    try {
      const recordType = action.parameters.recordType; // 'leads' or 'deals'
      const recordId = action.parameters.recordId;
      const updates = action.parameters.updates;

      if (recordType && recordId && updates) {
        const recordRef = doc(this.db, 'workspaces', this.workspaceId, recordType, recordId);
        await updateDoc(recordRef, {
          ...updates,
          lastUpdatedBy: 'ai_agent',
          lastUpdatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating CRM record:', error);
    }
  }

  private async handleMessageSend(action: Action) {
    if (!this.db || !this.workspaceId) return;

    try {
      const messagesRef = collection(this.db, 'workspaces', this.workspaceId, 'messages');
      await addDoc(messagesRef, {
        content: action.parameters.message || '',
        recipientId: action.parameters.recipientId || null,
        channel: action.parameters.channel || 'system',
        type: 'ai_response',
        sentBy: 'ai_agent',
        sentAt: new Date(),
        conversationId: action.parameters.conversationId || null
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  private async handleFollowupScheduling(action: Action) {
    if (!this.db || !this.workspaceId) return;

    try {
      const followupsRef = collection(this.db, 'workspaces', this.workspaceId, 'followups');
      await addDoc(followupsRef, {
        title: action.parameters.title || 'AI Scheduled Follow-up',
        description: action.parameters.description || '',
        scheduledFor: action.parameters.scheduledFor || new Date(Date.now() + 24 * 60 * 60 * 1000), // Default: 24 hours
        contactId: action.parameters.contactId || null,
        dealId: action.parameters.dealId || null,
        type: action.parameters.type || 'call',
        status: 'scheduled',
        createdBy: 'ai_agent',
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
    }
  }

  private async handleWorkflowTrigger(action: Action) {
    if (!this.db || !this.workspaceId) return;

    try {
      const workflowsRef = collection(this.db, 'workspaces', this.workspaceId, 'workflow_executions');
      await addDoc(workflowsRef, {
        workflowId: action.parameters.workflowId || null,
        triggeredBy: 'ai_agent',
        triggeredAt: new Date(),
        customerId: action.parameters.customerId || null,
        parameters: action.parameters.workflowParameters || {},
        status: 'running'
      });
    } catch (error) {
      console.error('Error triggering workflow:', error);
    }
  }

  private async handleEmailSend(action: Action) {
    if (!this.db || !this.workspaceId) return;

    try {
      const emailsRef = collection(this.db, 'workspaces', this.workspaceId, 'emails');
      await addDoc(emailsRef, {
        to: action.parameters.to || '',
        subject: action.parameters.subject || 'AI Generated Email',
        content: action.parameters.content || '',
        type: 'ai_generated',
        status: 'queued',
        sentBy: 'ai_agent',
        createdAt: new Date(),
        campaignId: action.parameters.campaignId || null
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  public getIntegrationsForAgent(agentType: AgentType): PipelineIntegration[] {
    return Array.from(this.integrations.values())
      .flat()
      .filter(integration => integration.agentType === agentType);
  }

  public getIntegrationsForFeature(pipelineFeature: string): PipelineIntegration[] {
    return Array.from(this.integrations.values())
      .flat()
      .filter(integration => integration.pipelineFeature === pipelineFeature);
  }
}