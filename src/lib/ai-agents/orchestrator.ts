import {
  AIAgent,
  AgentType,
  Event,
  Action,
  ExecutionResult,
  Feedback,
  DecisionContext,
  EventType
} from './types';
import { AgentRegistry } from './agent-registry';

export interface OrchestrationRule {
  id: string;
  name: string;
  description: string;
  eventTypes: EventType[];
  agentTypes: AgentType[];
  priority: number;
  conditions: Record<string, any>;
  enabled: boolean;
}

export interface OrchestrationResult {
  eventId: string;
  agentsInvolved: string[];
  actionsGenerated: number;
  executionResults: ExecutionResult[];
  processingTime: number;
  success: boolean;
  errors?: string[];
}

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private registry: AgentRegistry;
  private orchestrationRules: Map<string, OrchestrationRule> = new Map();
  private eventQueue: Event[] = [];
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.registry = AgentRegistry.getInstance();
    this.initializeDefaultRules();
  }

  public static getInstance(): AgentOrchestrator {
    if (!AgentOrchestrator.instance) {
      AgentOrchestrator.instance = new AgentOrchestrator();
    }
    return AgentOrchestrator.instance;
  }

  // Event processing
  public async processEvent(event: Event): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const result: OrchestrationResult = {
      eventId: event.id,
      agentsInvolved: [],
      actionsGenerated: 0,
      executionResults: [],
      processingTime: 0,
      success: false,
      errors: []
    };

    try {
      // Find relevant agents based on event type and orchestration rules
      const relevantAgents = this.findRelevantAgents(event);
      result.agentsInvolved = relevantAgents.map(agent => agent.id);

      if (relevantAgents.length === 0) {
        console.log(`No agents found for event ${event.id} of type ${event.type}`);
        result.success = true;
        return result;
      }

      // Phase 1: Perception - Let agents perceive the event
      await this.executePerceptionPhase(relevantAgents, [event]);

      // Phase 2: Decision - Let agents make decisions
      const allActions = await this.executeDecisionPhase(relevantAgents, event);
      result.actionsGenerated = allActions.length;

      // Phase 3: Execution - Execute actions in priority order
      if (allActions.length > 0) {
        result.executionResults = await this.executeActionPhase(allActions);
      }

      // Phase 4: Learning - Provide feedback to agents
      await this.executeLearningPhase(relevantAgents, result.executionResults);

      result.success = true;
    } catch (error) {
      result.errors = [error instanceof Error ? error.message : String(error)];
      console.error(`Error processing event ${event.id}:`, error);
    } finally {
      result.processingTime = Date.now() - startTime;
    }

    return result;
  }

  public async processEvents(events: Event[]): Promise<OrchestrationResult[]> {
    // Sort events by priority and timestamp
    const sortedEvents = events.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return a.timestamp.getTime() - b.timestamp.getTime(); // Earlier timestamp first
    });

    const results: OrchestrationResult[] = [];
    for (const event of sortedEvents) {
      const result = await this.processEvent(event);
      results.push(result);
    }

    return results;
  }

  // Queue management
  public queueEvent(event: Event): void {
    this.eventQueue.push(event);
    if (!this.isProcessing) {
      this.startProcessing();
    }
  }

  public queueEvents(events: Event[]): void {
    this.eventQueue.push(...events);
    if (!this.isProcessing) {
      this.startProcessing();
    }
  }

  private async startProcessing(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.processingInterval = setInterval(async () => {
      if (this.eventQueue.length === 0) {
        this.stopProcessing();
        return;
      }

      const eventsToProcess = this.eventQueue.splice(0, 10); // Process up to 10 events at a time
      await this.processEvents(eventsToProcess);
    }, 100); // Process every 100ms
  }

  private stopProcessing(): void {
    this.isProcessing = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  // Orchestration phases
  private async executePerceptionPhase(agents: AIAgent[], events: Event[]): Promise<void> {
    const perceptionPromises = agents.map(agent => 
      agent.perceive(events).catch((error: any) => {
        console.error(`Perception error for agent ${agent.id}:`, error);
      })
    );
    await Promise.all(perceptionPromises);
  }

  private async executeDecisionPhase(agents: AIAgent[], event: Event): Promise<Action[]> {
    const allActions: Action[] = [];

    for (const agent of agents) {
      try {
        const context: DecisionContext = {
          events: [event],
          currentContext: agent.getContext(),
          availableActions: agent.capabilities.flatMap(cap => cap.supportedActionTypes),
          businessConstraints: {},
          historicalData: []
        };

        const actions = await agent.decide(context);
        allActions.push(...actions);
      } catch (error) {
        console.error(`Decision error for agent ${agent.id}:`, error);
      }
    }

    // Sort actions by priority
    return allActions.sort((a, b) => b.priority - a.priority);
  }

  private async executeActionPhase(actions: Action[]): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];

    // Group actions by agent for efficient execution
    const actionsByAgent = new Map<string, Action[]>();
    actions.forEach(action => {
      if (!actionsByAgent.has(action.agentId)) {
        actionsByAgent.set(action.agentId, []);
      }
      actionsByAgent.get(action.agentId)!.push(action);
    });

    // Execute actions for each agent
    for (const [agentId, agentActions] of Array.from(actionsByAgent.entries())) {
      const agent = this.registry.getAgent(agentId);
      if (!agent) {
        console.error(`Agent ${agentId} not found for action execution`);
        continue;
      }

      try {
        const agentResults = await agent.execute(agentActions);
        results.push(...agentResults);
      } catch (error) {
        console.error(`Execution error for agent ${agentId}:`, error);
        // Create error results for failed actions
        agentActions.forEach((action: Action) => {
          results.push({
            actionId: action.id,
            success: false,
            error: error instanceof Error ? error.message : String(error),
            timestamp: new Date()
          });
        });
      }
    }

    return results;
  }

  private async executeLearningPhase(agents: AIAgent[], results: ExecutionResult[]): Promise<void> {
    // Generate feedback from execution results
    const feedback: Feedback[] = results.map(result => ({
      actionId: result.actionId,
      outcome: result.success ? 'success' : 'failure',
      score: result.success ? 1 : 0,
      details: result.error || 'Action completed successfully',
      timestamp: new Date(),
      source: 'system'
    }));

    // Provide feedback to relevant agents
    const learningPromises = agents.map(agent =>
      agent.learn(feedback).catch((error: any) => {
        console.error(`Learning error for agent ${agent.id}:`, error);
      })
    );

    await Promise.all(learningPromises);
  }

  // Agent discovery
  private findRelevantAgents(event: Event): AIAgent[] {
    // Get agents that can handle this event type
    const capableAgents = this.registry.getAgentsByCapability(event.type as string);
    
    // Filter by orchestration rules
    const relevantAgents = capableAgents.filter(agent => {
      return this.isAgentRelevantForEvent(agent, event);
    });

    // Sort by priority (from agent configuration)
    return relevantAgents.sort((a, b) => b.configuration.priority - a.configuration.priority);
  }

  private isAgentRelevantForEvent(agent: AIAgent, event: Event): boolean {
    // Check if agent is active
    if (!agent.configuration.enabled || !this.registry.isActive(agent.id)) {
      return false;
    }

    // Check orchestration rules
    for (const rule of Array.from(this.orchestrationRules.values())) {
      if (!rule.enabled) continue;
      
      if (rule.eventTypes.includes(event.type) && rule.agentTypes.includes(agent.type)) {
        // Check additional conditions if any
        if (this.evaluateRuleConditions(rule, event, agent)) {
          return true;
        }
      }
    }

    // Default: agent is relevant if it can handle the event type
    return agent.capabilities.some(cap => cap.supportedEventTypes.includes(event.type));
  }

  private evaluateRuleConditions(rule: OrchestrationRule, event: Event, _agent: AIAgent): boolean {
    // Simple condition evaluation - can be extended for complex rules
    if (Object.keys(rule.conditions).length === 0) {
      return true;
    }

    // Example condition checks
    if (rule.conditions.priority && event.priority < rule.conditions.priority) {
      return false;
    }

    if (rule.conditions.customerId && event.customerId !== rule.conditions.customerId) {
      return false;
    }

    return true;
  }

  // Rule management
  public addOrchestrationRule(rule: OrchestrationRule): void {
    this.orchestrationRules.set(rule.id, rule);
    console.log(`Orchestration rule ${rule.id} added`);
  }

  public removeOrchestrationRule(ruleId: string): void {
    this.orchestrationRules.delete(ruleId);
    console.log(`Orchestration rule ${ruleId} removed`);
  }

  public getOrchestrationRules(): OrchestrationRule[] {
    return Array.from(this.orchestrationRules.values());
  }

  // Initialize default orchestration rules
  private initializeDefaultRules(): void {
    const defaultRules: OrchestrationRule[] = [
      {
        id: 'lead_capture_rule',
        name: 'Lead Capture Processing',
        description: 'Route lead capture events to lead management agents',
        eventTypes: [EventType.LEAD_CAPTURED],
        agentTypes: [AgentType.LEAD_MANAGEMENT],
        priority: 10,
        conditions: {},
        enabled: true
      },
      {
        id: 'customer_interaction_rule',
        name: 'Customer Interaction Processing',
        description: 'Route customer interactions to appropriate agents',
        eventTypes: [EventType.CUSTOMER_INTERACTION],
        agentTypes: [AgentType.CUSTOMER_INTERACTION, AgentType.CONVERSATIONAL_AI],
        priority: 8,
        conditions: {},
        enabled: true
      },
      {
        id: 'deal_update_rule',
        name: 'Deal Update Processing',
        description: 'Route deal updates to sales pipeline agents',
        eventTypes: [EventType.DEAL_UPDATED],
        agentTypes: [AgentType.SALES_PIPELINE],
        priority: 7,
        conditions: {},
        enabled: true
      },
      {
        id: 'workflow_trigger_rule',
        name: 'Workflow Trigger Processing',
        description: 'Route workflow triggers to workflow management agents',
        eventTypes: [EventType.WORKFLOW_TRIGGERED],
        agentTypes: [AgentType.WORKFLOW_MANAGEMENT, AgentType.JOURNEY_ORCHESTRATION],
        priority: 6,
        conditions: {},
        enabled: true
      }
    ];

    defaultRules.forEach(rule => this.addOrchestrationRule(rule));
  }

  // Monitoring and statistics
  public getOrchestrationStats(): {
    queueSize: number;
    isProcessing: boolean;
    totalRules: number;
    activeRules: number;
  } {
    return {
      queueSize: this.eventQueue.length,
      isProcessing: this.isProcessing,
      totalRules: this.orchestrationRules.size,
      activeRules: Array.from(this.orchestrationRules.values()).filter(rule => rule.enabled).length
    };
  }

  // Cleanup
  public async shutdown(): Promise<void> {
    this.stopProcessing();
    this.eventQueue = [];
    await this.registry.stopAllAgents();
    console.log('Agent orchestrator shutdown complete');
  }
}