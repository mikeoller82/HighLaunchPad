import {
  BaseAgent,
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
} from './index';

// Example Lead Management Agent
export class LeadManagementAgent extends BaseAgent {
  protected async processEvents(events: Event[]): Promise<void> {
    console.log(`LeadManagementAgent ${this.id} processing ${events.length} events`);
    
    // Process each event and update context
    for (const event of events) {
      if (event.type === EventType.LEAD_CAPTURED) {
        this.context.conversationHistory.push({
          type: 'lead_captured',
          timestamp: event.timestamp,
          data: event.data
        });
      }
    }
  }

  protected async makeDecisions(context: DecisionContext): Promise<Action[]> {
    const actions: Action[] = [];
    
    for (const event of context.events) {
      if (event.type === EventType.LEAD_CAPTURED) {
        // Create task to follow up with lead
        actions.push({
          id: `followup_${event.id}_${Date.now()}`,
          type: ActionType.SCHEDULE_FOLLOWUP,
          agentId: this.id,
          timestamp: new Date(),
          parameters: {
            leadId: event.leadId,
            followupType: 'initial_contact',
            scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
          },
          priority: 8
        });

        // Update lead record
        actions.push({
          id: `update_${event.id}_${Date.now()}`,
          type: ActionType.UPDATE_RECORD,
          agentId: this.id,
          timestamp: new Date(),
          parameters: {
            recordType: 'lead',
            recordId: event.leadId,
            updates: {
              status: 'new',
              assignedAgent: this.id,
              lastActivity: new Date()
            }
          },
          priority: 7
        });
      }
    }

    return actions;
  }

  protected async executeActions(actions: Action[]): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];

    for (const action of actions) {
      try {
        let result: any = {};

        switch (action.type) {
          case ActionType.SCHEDULE_FOLLOWUP:
            result = await this.scheduleFollowup(action.parameters);
            break;
          case ActionType.UPDATE_RECORD:
            result = await this.updateRecord(action.parameters);
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
    console.log(`LeadManagementAgent ${this.id} processing ${feedback.length} feedback items`);
    
    // Simple learning: adjust priorities based on feedback
    for (const fb of feedback) {
      if (fb.outcome === 'success' && fb.score && fb.score > 0.8) {
        // Successful actions with high scores increase confidence
        console.log(`High-performing action detected: ${fb.actionId}`);
      } else if (fb.outcome === 'failure') {
        // Failed actions need attention
        console.log(`Failed action detected: ${fb.actionId} - ${fb.details}`);
      }
    }
  }

  // Helper methods for action execution
  private async scheduleFollowup(parameters: any): Promise<any> {
    // Simulate scheduling a followup task
    console.log(`Scheduling followup for lead ${parameters.leadId} at ${parameters.scheduledFor}`);
    return {
      taskId: `task_${Date.now()}`,
      leadId: parameters.leadId,
      scheduledFor: parameters.scheduledFor,
      type: parameters.followupType
    };
  }

  private async updateRecord(parameters: any): Promise<any> {
    // Simulate updating a record
    console.log(`Updating ${parameters.recordType} record ${parameters.recordId}`);
    return {
      recordId: parameters.recordId,
      recordType: parameters.recordType,
      updatedFields: Object.keys(parameters.updates),
      timestamp: new Date()
    };
  }
}

// Factory function to create a configured Lead Management Agent
export function createLeadManagementAgent(id: string): LeadManagementAgent {
  const capability: AgentCapability = {
    name: 'Lead Management',
    description: 'Handles lead capture, qualification, and initial follow-up',
    requiredPermissions: ['read_leads', 'write_leads', 'schedule_tasks'],
    supportedEventTypes: [EventType.LEAD_CAPTURED, EventType.CUSTOMER_INTERACTION],
    supportedActionTypes: [
      ActionType.SCHEDULE_FOLLOWUP,
      ActionType.UPDATE_RECORD,
      ActionType.CREATE_TASK,
      ActionType.SEND_MESSAGE
    ]
  };

  const config: AgentConfiguration = {
    id,
    type: AgentType.LEAD_MANAGEMENT,
    name: `Lead Management Agent ${id}`,
    description: 'Automated lead management and follow-up agent',
    capabilities: [capability],
    enabled: true,
    priority: 8,
    maxConcurrentActions: 5,
    learningEnabled: true,
    configuration: {
      followupDelay: 24 * 60 * 60 * 1000, // 24 hours
      maxLeadsPerHour: 10
    }
  };

  return new LeadManagementAgent(config);
}

// Demonstration function
export async function demonstrateFramework(): Promise<void> {
  console.log('🚀 Starting AI Agent Framework Demonstration');

  // Import framework components
  const { AgentRegistry, AgentOrchestrator } = await import('./index');

  // Get singleton instances
  const registry = AgentRegistry.getInstance();
  const orchestrator = AgentOrchestrator.getInstance();

  try {
    // Create and register a lead management agent
    const leadAgent = createLeadManagementAgent('lead_agent_demo');
    await registry.registerAgent(leadAgent);
    console.log('✅ Lead management agent registered');

    // Create a sample lead capture event
    const leadEvent: Event = {
      id: 'demo_lead_001',
      type: EventType.LEAD_CAPTURED,
      timestamp: new Date(),
      source: 'website_form',
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        source: 'landing_page',
        interests: ['product_demo', 'pricing']
      },
      priority: 8,
      leadId: 'lead_001'
    };

    // Process the event through the orchestrator
    console.log('📨 Processing lead capture event...');
    const result = await orchestrator.processEvent(leadEvent);

    console.log('📊 Orchestration Result:', {
      success: result.success,
      agentsInvolved: result.agentsInvolved,
      actionsGenerated: result.actionsGenerated,
      processingTime: `${result.processingTime}ms`
    });

    // Display registry statistics
    const stats = registry.getRegistryStats();
    console.log('📈 Registry Statistics:', stats);

    // Display orchestration statistics
    const orchStats = orchestrator.getOrchestrationStats();
    console.log('🎯 Orchestration Statistics:', orchStats);

    console.log('✨ Framework demonstration completed successfully!');

  } catch (error) {
    console.error('❌ Framework demonstration failed:', error);
  }
}