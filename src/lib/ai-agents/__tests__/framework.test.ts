import {
  BaseAgent,
  AgentRegistry,
  AgentOrchestrator,
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
  AgentCapability
} from '../index';

// Test Agent Implementation
class TestAgent extends BaseAgent {
  protected async processEvents(events: Event[]): Promise<void> {
    // Simple event processing for testing
    console.log(`TestAgent ${this.id} processed ${events.length} events`);
  }

  protected async makeDecisions(context: DecisionContext): Promise<Action[]> {
    // Simple decision making for testing
    return context.events.map(event => ({
      id: `action_${event.id}_${Date.now()}`,
      type: ActionType.CREATE_TASK,
      agentId: this.id,
      timestamp: new Date(),
      parameters: { eventId: event.id },
      priority: 5
    }));
  }

  protected async executeActions(actions: Action[]): Promise<ExecutionResult[]> {
    // Simple action execution for testing
    return actions.map(action => ({
      actionId: action.id,
      success: true,
      result: { message: 'Action executed successfully' },
      timestamp: new Date()
    }));
  }

  protected async processFeedback(feedback: Feedback[]): Promise<void> {
    // Simple feedback processing for testing
    console.log(`TestAgent ${this.id} processed ${feedback.length} feedback items`);
  }
}

describe('AI Agent Framework', () => {
  let registry: AgentRegistry;
  let orchestrator: AgentOrchestrator;
  let testAgent: TestAgent;

  beforeEach(() => {
    registry = AgentRegistry.getInstance();
    orchestrator = AgentOrchestrator.getInstance();

    // Create test agent configuration
    const capability: AgentCapability = {
      name: 'Test Capability',
      description: 'Test capability for framework testing',
      requiredPermissions: [],
      supportedEventTypes: [EventType.CUSTOMER_INTERACTION, EventType.LEAD_CAPTURED],
      supportedActionTypes: [ActionType.CREATE_TASK, ActionType.SEND_MESSAGE]
    };

    const config: AgentConfiguration = {
      id: 'test_agent_1',
      type: AgentType.LEAD_MANAGEMENT,
      name: 'Test Agent',
      description: 'Agent for testing framework functionality',
      capabilities: [capability],
      enabled: true,
      priority: 5,
      maxConcurrentActions: 10,
      learningEnabled: true,
      configuration: {}
    };

    testAgent = new TestAgent(config);
  });

  afterEach(async () => {
    // Clean up
    try {
      await registry.unregisterAgent(testAgent.id);
    } catch (error) {
      // Agent might not be registered
    }
  });

  describe('BaseAgent', () => {
    test('should initialize with correct configuration', () => {
      expect(testAgent.id).toBe('test_agent_1');
      expect(testAgent.type).toBe(AgentType.LEAD_MANAGEMENT);
      expect(testAgent.getStatus()).toBe(AgentStatus.IDLE);
      expect(testAgent.capabilities).toHaveLength(1);
    });

    test('should start and stop correctly', async () => {
      await testAgent.start();
      expect(testAgent.getStatus()).toBe(AgentStatus.IDLE);

      await testAgent.stop();
      expect(testAgent.getStatus()).toBe(AgentStatus.DISABLED);
    });

    test('should process events through perception', async () => {
      const testEvent: Event = {
        id: 'test_event_1',
        type: EventType.CUSTOMER_INTERACTION,
        timestamp: new Date(),
        source: 'test',
        data: { message: 'Test customer interaction' },
        priority: 5,
        customerId: 'customer_1'
      };

      await testAgent.perceive([testEvent]);
      expect(testAgent.getStatus()).toBe(AgentStatus.IDLE);
    });

    test('should make decisions based on context', async () => {
      const testEvent: Event = {
        id: 'test_event_2',
        type: EventType.LEAD_CAPTURED,
        timestamp: new Date(),
        source: 'test',
        data: { leadData: 'Test lead data' },
        priority: 7,
        leadId: 'lead_1'
      };

      const context: DecisionContext = {
        events: [testEvent],
        currentContext: testAgent.getContext(),
        availableActions: [ActionType.CREATE_TASK],
        businessConstraints: {}
      };

      const actions = await testAgent.decide(context);
      expect(actions).toHaveLength(1);
      expect(actions[0].type).toBe(ActionType.CREATE_TASK);
      expect(actions[0].agentId).toBe(testAgent.id);
    });

    test('should execute actions and return results', async () => {
      const testAction: Action = {
        id: 'test_action_1',
        type: ActionType.CREATE_TASK,
        agentId: testAgent.id,
        timestamp: new Date(),
        parameters: { taskName: 'Test task' },
        priority: 5
      };

      const results = await testAgent.execute([testAction]);
      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].actionId).toBe(testAction.id);
    });

    test('should process feedback for learning', async () => {
      const feedback: Feedback = {
        actionId: 'test_action_1',
        outcome: 'success',
        score: 0.8,
        details: 'Action completed successfully',
        timestamp: new Date(),
        source: 'system'
      };

      await testAgent.learn([feedback]);
      const metrics = testAgent.getMetrics();
      expect(metrics.learningScore).toBeGreaterThan(0);
    });
  });

  describe('AgentRegistry', () => {
    test('should register and unregister agents', async () => {
      await registry.registerAgent(testAgent);
      
      const retrievedAgent = registry.getAgent(testAgent.id);
      expect(retrievedAgent).toBe(testAgent);

      const agentsByType = registry.getAgentsByType(AgentType.LEAD_MANAGEMENT);
      expect(agentsByType).toContain(testAgent);

      await registry.unregisterAgent(testAgent.id);
      
      const removedAgent = registry.getAgent(testAgent.id);
      expect(removedAgent).toBeUndefined();
    });

    test('should provide registry statistics', async () => {
      await registry.registerAgent(testAgent);
      
      const stats = registry.getRegistryStats();
      expect(stats.totalAgents).toBeGreaterThan(0);
      expect(stats.agentsByType[AgentType.LEAD_MANAGEMENT]).toBeGreaterThan(0);
      expect(stats.agentsByStatus[AgentStatus.IDLE]).toBeGreaterThan(0);
    });

    test('should perform health checks', async () => {
      await registry.registerAgent(testAgent);
      
      const healthCheck = await registry.performHealthCheck();
      expect(healthCheck.healthy).toBe(true);
      expect(healthCheck.agentStatuses[testAgent.id]).toBe(AgentStatus.IDLE);
    });
  });

  describe('AgentOrchestrator', () => {
    beforeEach(async () => {
      await registry.registerAgent(testAgent);
    });

    test('should process single event', async () => {
      const testEvent: Event = {
        id: 'orchestration_test_event_1',
        type: EventType.CUSTOMER_INTERACTION,
        timestamp: new Date(),
        source: 'test',
        data: { message: 'Test orchestration event' },
        priority: 5,
        customerId: 'customer_1'
      };

      const result = await orchestrator.processEvent(testEvent);
      
      expect(result.success).toBe(true);
      expect(result.eventId).toBe(testEvent.id);
      expect(result.agentsInvolved).toContain(testAgent.id);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    test('should process multiple events', async () => {
      const events: Event[] = [
        {
          id: 'orchestration_test_event_2',
          type: EventType.LEAD_CAPTURED,
          timestamp: new Date(),
          source: 'test',
          data: { leadData: 'Test lead 1' },
          priority: 8,
          leadId: 'lead_1'
        },
        {
          id: 'orchestration_test_event_3',
          type: EventType.CUSTOMER_INTERACTION,
          timestamp: new Date(),
          source: 'test',
          data: { message: 'Test interaction' },
          priority: 6,
          customerId: 'customer_2'
        }
      ];

      const results = await orchestrator.processEvents(events);
      
      expect(results).toHaveLength(2);
      expect(results.every(r => r.success)).toBe(true);
    });

    test('should provide orchestration statistics', () => {
      const stats = orchestrator.getOrchestrationStats();
      
      expect(stats).toHaveProperty('queueSize');
      expect(stats).toHaveProperty('isProcessing');
      expect(stats).toHaveProperty('totalRules');
      expect(stats).toHaveProperty('activeRules');
      expect(stats.totalRules).toBeGreaterThan(0);
    });
  });
});