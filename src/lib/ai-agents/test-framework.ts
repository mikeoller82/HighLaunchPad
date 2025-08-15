import {
  AIAgent,
  AgentType,
  AgentStatus,
  EventType,
  ActionType,
  Event,
  Action,
  ExecutionResult,
  Feedback,
  DecisionContext,
  AgentConfiguration,
  AgentCapability,
  BaseAgent
} from './index';

// Test utilities for AI Agent Framework
export class TestFramework {
  // Create a mock event for testing
  static createMockEvent(overrides: Partial<Event> = {}): Event {
    return {
      id: `test_event_${Date.now()}`,
      type: EventType.CUSTOMER_INTERACTION,
      timestamp: new Date(),
      source: 'test',
      data: { message: 'Test event data' },
      priority: 5,
      ...overrides
    };
  }

  // Create a mock action for testing
  static createMockAction(agentId: string, overrides: Partial<Action> = {}): Action {
    return {
      id: `test_action_${Date.now()}`,
      type: ActionType.CREATE_TASK,
      agentId,
      timestamp: new Date(),
      parameters: { test: true },
      priority: 5,
      ...overrides
    };
  }

  // Create a mock feedback for testing
  static createMockFeedback(actionId: string, overrides: Partial<Feedback> = {}): Feedback {
    return {
      actionId,
      outcome: 'success',
      score: 0.8,
      details: 'Test feedback',
      timestamp: new Date(),
      source: 'system',
      ...overrides
    };
  }

  // Create a test agent configuration
  static createTestAgentConfig(id: string, type: AgentType = AgentType.LEAD_MANAGEMENT): AgentConfiguration {
    const capability: AgentCapability = {
      name: 'Test Capability',
      description: 'Test capability for framework testing',
      requiredPermissions: [],
      supportedEventTypes: [EventType.CUSTOMER_INTERACTION, EventType.LEAD_CAPTURED],
      supportedActionTypes: [ActionType.CREATE_TASK, ActionType.SEND_MESSAGE]
    };

    return {
      id,
      type,
      name: `Test Agent ${id}`,
      description: 'Agent for testing framework functionality',
      capabilities: [capability],
      enabled: true,
      priority: 5,
      maxConcurrentActions: 10,
      learningEnabled: true,
      configuration: {}
    };
  }

  // Validate agent state
  static validateAgentState(agent: AIAgent): {
    valid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    if (!agent.id || agent.id.trim() === '') {
      issues.push('Agent ID is required');
    }

    if (!agent.type) {
      issues.push('Agent type is required');
    }

    if (!agent.capabilities || agent.capabilities.length === 0) {
      issues.push('Agent must have at least one capability');
    }

    if (!agent.configuration) {
      issues.push('Agent configuration is required');
    }

    if (!agent.context) {
      issues.push('Agent context is required');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  // Simulate agent lifecycle
  static async simulateAgentLifecycle(agent: AIAgent): Promise<{
    success: boolean;
    phases: Record<string, boolean>;
    errors: string[];
  }> {
    const phases: Record<string, boolean> = {};
    const errors: string[] = [];

    try {
      // Phase 1: Start agent
      await agent.start();
      phases.start = agent.getStatus() !== AgentStatus.ERROR;

      // Phase 2: Perception
      const testEvent = this.createMockEvent();
      await agent.perceive([testEvent]);
      phases.perceive = agent.getStatus() !== AgentStatus.ERROR;

      // Phase 3: Decision making
      const context: DecisionContext = {
        events: [testEvent],
        currentContext: agent.getContext(),
        availableActions: agent.capabilities.flatMap(cap => cap.supportedActionTypes),
        businessConstraints: {}
      };
      const actions = await agent.decide(context);
      phases.decide = agent.getStatus() !== AgentStatus.ERROR && Array.isArray(actions);

      // Phase 4: Action execution
      if (actions.length > 0) {
        const results = await agent.execute(actions);
        phases.execute = agent.getStatus() !== AgentStatus.ERROR && Array.isArray(results);
      } else {
        phases.execute = true; // No actions to execute is valid
      }

      // Phase 5: Learning
      const feedback = this.createMockFeedback(actions[0]?.id || 'test_action');
      await agent.learn([feedback]);
      phases.learn = agent.getStatus() !== AgentStatus.ERROR;

      // Phase 6: Stop agent
      await agent.stop();
      phases.stop = agent.getStatus() === AgentStatus.DISABLED;

    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }

    return {
      success: errors.length === 0 && Object.values(phases).every(Boolean),
      phases,
      errors
    };
  }

  // Performance testing
  static async performanceTest(agent: AIAgent, eventCount: number = 100): Promise<{
    totalTime: number;
    averageTime: number;
    eventsPerSecond: number;
    errors: number;
  }> {
    const startTime = Date.now();
    let errors = 0;

    const events = Array.from({ length: eventCount }, (_, i) => 
      this.createMockEvent({ id: `perf_test_${i}` })
    );

    try {
      await agent.start();
      
      for (const event of events) {
        try {
          await agent.perceive([event]);
        } catch (error) {
          errors++;
        }
      }

      await agent.stop();
    } catch (error) {
      errors++;
    }

    const totalTime = Date.now() - startTime;
    const averageTime = totalTime / eventCount;
    const eventsPerSecond = (eventCount / totalTime) * 1000;

    return {
      totalTime,
      averageTime,
      eventsPerSecond,
      errors
    };
  }
}

// Mock Agent for testing
export class MockAgent extends BaseAgent {
  private mockResponses: {
    processEvents?: (events: Event[]) => Promise<void>;
    makeDecisions?: (context: DecisionContext) => Promise<Action[]>;
    executeActions?: (actions: Action[]) => Promise<ExecutionResult[]>;
    processFeedback?: (feedback: Feedback[]) => Promise<void>;
  } = {};

  constructor(config: AgentConfiguration, mockResponses: Partial<MockAgent['mockResponses']> = {}) {
    super(config);
    this.mockResponses = { ...this.mockResponses, ...mockResponses };
  }

  protected async processEvents(events: Event[]): Promise<void> {
    if (this.mockResponses.processEvents) {
      return this.mockResponses.processEvents(events);
    }
    // Default mock behavior
    console.log(`MockAgent ${this.id} processed ${events.length} events`);
  }

  protected async makeDecisions(context: DecisionContext): Promise<Action[]> {
    if (this.mockResponses.makeDecisions) {
      return this.mockResponses.makeDecisions(context);
    }
    // Default mock behavior - create one action per event
    return context.events.map(event => TestFramework.createMockAction(this.id, {
      parameters: { eventId: event.id }
    }));
  }

  protected async executeActions(actions: Action[]): Promise<ExecutionResult[]> {
    if (this.mockResponses.executeActions) {
      return this.mockResponses.executeActions(actions);
    }
    // Default mock behavior - all actions succeed
    return actions.map(action => ({
      actionId: action.id,
      success: true,
      result: { message: 'Mock execution successful' },
      timestamp: new Date()
    }));
  }

  protected async processFeedback(feedback: Feedback[]): Promise<void> {
    if (this.mockResponses.processFeedback) {
      return this.mockResponses.processFeedback(feedback);
    }
    // Default mock behavior
    console.log(`MockAgent ${this.id} processed ${feedback.length} feedback items`);
  }

  // Helper method to update mock responses
  public updateMockResponses(responses: Partial<MockAgent['mockResponses']>): void {
    this.mockResponses = { ...this.mockResponses, ...responses };
  }
}

// Factory function for creating mock agents
export function createMockAgent(id: string, type: AgentType = AgentType.LEAD_MANAGEMENT): MockAgent {
  const config = TestFramework.createTestAgentConfig(id, type);
  return new MockAgent(config);
}