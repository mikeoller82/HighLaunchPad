// Types-only exports for client-side usage
// This file only exports types and interfaces, no actual implementations

export type {
  AIAgent,
  Event,
  Action,
  ExecutionResult,
  Feedback,
  AgentContext,
  AgentMetrics,
  DecisionContext,
  AgentConfiguration,
  AgentCapability
} from './types';

export {
  AgentType,
  AgentStatus,
  EventType,
  ActionType
} from './types';

export type {
  AgentRegistryEntry
} from './agent-registry';

export type {
  OrchestrationRule,
  OrchestrationResult
} from './orchestrator';

// Client-side stub for BaseAgent that doesn't import genkit
export class BaseAgent {
  public id: string;
  public status: string;
  
  constructor(config: any) {
    this.id = config.id || 'stub-agent';
    this.status = 'idle';
  }
  
  async start() {
    console.log('BaseAgent stub - start called');
  }
  
  async stop() {
    console.log('BaseAgent stub - stop called');
  }
}

// Client-side stub for AgentRegistry
export class AgentRegistry {
  static getInstance() {
    return new AgentRegistry();
  }
  
  async registerAgent(_agent: any) {
    console.log('AgentRegistry stub - registerAgent called');
  }
}