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
  AgentConfiguration
} from './types';

export class DataIntegrationAgent extends BaseAgent {
  protected async processEvents(events: Event[]): Promise<void> {
    console.log(`DataIntegrationAgent ${this.id} processing ${events.length} events`);
    
    for (const event of events) {
      if (event.type === EventType.DATA_UPDATED) {
        this.context.conversationHistory.push({
          type: 'data_sync',
          timestamp: event.timestamp,
          data: event.data
        });
      }
    }
  }

  protected async makeDecisions(context: DecisionContext): Promise<Action[]> {
    const actions: Action[] = [];
    
    for (const event of context.events) {
      if (event.type === EventType.DATA_UPDATED) {
        const syncActions = await this.planDataSync(event);
        actions.push(...syncActions);
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
          case ActionType.UPDATE_RECORD:
            result = await this.syncData(action.parameters);
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
    console.log(`DataIntegrationAgent ${this.id} processing ${feedback.length} feedback items`);
  }

  private async planDataSync(event: Event): Promise<Action[]> {
    const actions: Action[] = [];
    
    // Sync data across platforms
    actions.push({
      id: `sync_${event.id}_${Date.now()}`,
      type: ActionType.UPDATE_RECORD,
      agentId: this.id,
      timestamp: new Date(),
      parameters: {
        syncType: 'cross_platform',
        sourceData: event.data,
        targetSystems: ['crm', 'email', 'analytics']
      },
      priority: 6
    });

    return actions;
  }

  private async syncData(parameters: any): Promise<any> {
    console.log(`Syncing data across ${parameters.targetSystems.join(', ')}`);
    return {
      syncId: `sync_${Date.now()}`,
      systems: parameters.targetSystems,
      recordsUpdated: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date()
    };
  }
}

export function createDataIntegrationAgent(id: string): DataIntegrationAgent {
  const config: AgentConfiguration = {
    id,
    type: AgentType.DATA_INTEGRATION,
    name: `Data Integration Agent ${id}`,
    description: 'Syncs and integrates data across platforms',
    capabilities: [
      {
        name: 'Data Synchronization',
        description: 'Syncs data across multiple platforms',
        requiredPermissions: ['read_data', 'write_data', 'api_access'],
        supportedEventTypes: [EventType.DATA_UPDATED],
        supportedActionTypes: [ActionType.UPDATE_RECORD]
      }
    ],
    enabled: true,
    priority: 4,
    maxConcurrentActions: 15,
    learningEnabled: true,
    configuration: {
      syncFrequency: 'real_time',
      conflictResolution: 'latest_wins',
      dataValidation: true
    }
  };

  return new DataIntegrationAgent(config);
}