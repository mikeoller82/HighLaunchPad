import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LeadManagementAgent, createLeadManagementAgent } from '../lead-management-agent';
import {
  EventType,
  ActionType,
  Event,
  AgentConfiguration,
  AgentType,
  DecisionContext
} from '../types';
import {
  LeadSource,
  LeadStatus,
  QualificationStatus,
  Priority,
  InteractionType,
  CommunicationChannel
} from '../../crm-types';

describe('LeadManagementAgent', () => {
  let agent: LeadManagementAgent;
  let mockConfig: AgentConfiguration;

  beforeEach(() => {
    mockConfig = {
      id: 'test-lead-agent',
      type: AgentType.LEAD_MANAGEMENT,
      name: 'Test Lead Management Agent',
      description: 'Test agent for lead management',
      capabilities: [],
      enabled: true,
      priority: 8,
      maxConcurrentActions: 10,
      learningEnabled: true,
      configuration: {}
    };

    agent = new LeadManagementAgent(mockConfig);
  });

  describe('Lead Scoring', () => {
    it('should score a lead based on demographic factors', async () => {
      const leadData = {
        jobTitle: 'CEO',
        company: 'Enterprise',
        industry: 'Technology',
        companySize: '1000+',
        websiteVisits: 5,
        emailEngagement: {
          openRate: 0.8,
          clickRate: 0.6
        },
        socialMediaActivity: 3,
        companyRevenue: 150000000 // $150M
      };

      const score = await agent.scoreLead(leadData);

      expect(score).toBeDefined();
      expect(score.total).toBeGreaterThan(0);
      expect(score.demographic).toBeGreaterThan(0);
      expect(score.behavioral).toBeGreaterThan(0);
      expect(score.engagement).toBeGreaterThan(0);
      expect(score.firmographic).toBeGreaterThan(0);
      expect(score.factors).toHaveLength.greaterThan(0);
      expect(score.lastUpdated).toBeInstanceOf(Date);
    });

    it('should handle missing lead data gracefully', async () => {
      const leadData = {
        email: 'test@example.com'
      };

      const score = await agent.scoreLead(leadData);

      expect(score).toBeDefined();
      expect(score.total).toBeGreaterThanOrEqual(0);
      expect(score.total).toBeLessThanOrEqual(100);
    });

    it('should cap scores at 100', async () => {
      const leadData = {
        jobTitle: 'CEO',
        company: 'Enterprise',
        industry: 'Technology',
        companySize: '1000+',
        websiteVisits: 100,
        emailEngagement: {
          openRate: 1.0,
          clickRate: 1.0
        },
        socialMediaActivity: 50,
        companyRevenue: 1000000000 // $1B
      };

      const score = await agent.scoreLead(leadData);

      expect(score.total).toBeLessThanOrEqual(100);
    });
  });

  describe('Lead Qualification', () => {
    it('should qualify high-scoring leads as sales qualified', async () => {
      const leadData = { score: 85 };
      const leadScore = { total: 85, demographic: 20, behavioral: 25, engagement: 20, firmographic: 20, lastUpdated: new Date(), factors: [] };

      const qualification = await agent.qualifyLead(leadData, leadScore);

      expect(qualification).toBe(QualificationStatus.SALES_QUALIFIED);
    });

    it('should qualify medium-scoring leads as marketing qualified', async () => {
      const leadData = { score: 65 };
      const leadScore = { total: 65, demographic: 15, behavioral: 20, engagement: 15, firmographic: 15, lastUpdated: new Date(), factors: [] };

      const qualification = await agent.qualifyLead(leadData, leadScore);

      expect(qualification).toBe(QualificationStatus.MARKETING_QUALIFIED);
    });

    it('should qualify low-scoring leads as unqualified', async () => {
      const leadData = { score: 25 };
      const leadScore = { total: 25, demographic: 5, behavioral: 10, engagement: 5, firmographic: 5, lastUpdated: new Date(), factors: [] };

      const qualification = await agent.qualifyLead(leadData, leadScore);

      expect(qualification).toBe(QualificationStatus.UNQUALIFIED);
    });
  });

  describe('Lead Assignment', () => {
    it('should assign leads based on territory and expertise', async () => {
      // Mock assignment criteria
      agent['assignmentCriteria'] = {
        territory: {
          geographic: {
            'user1': ['North America'],
            'user2': ['Europe']
          },
          industry: {
            'user1': ['Technology'],
            'user2': ['Finance']
          },
          companySize: {}
        },
        expertise: {
          productExpertise: {},
          industryExpertise: {
            'user1': ['Technology'],
            'user2': ['Finance']
          },
          languageSkills: {}
        },
        workload: {
          maxLeadsPerUser: 50,
          currentWorkload: {
            'user1': 10,
            'user2': 5
          },
          capacity: {
            'user1': 50,
            'user2': 50
          }
        },
        availability: {
          businessHours: {},
          outOfOffice: {},
          currentStatus: {
            'user1': 'available',
            'user2': 'available'
          }
        }
      };

      const leadData = {
        location: 'North America',
        industry: 'Technology'
      };

      const assignedTo = await agent.assignLead(leadData);

      expect(assignedTo).toBe('user1');
    });

    it('should return null when no suitable assignee is found', async () => {
      const leadData = {
        location: 'Antarctica',
        industry: 'Unknown'
      };

      const assignedTo = await agent.assignLead(leadData);

      expect(assignedTo).toBeNull();
    });
  });

  describe('Event Processing', () => {
    it('should process lead captured events', async () => {
      const event: Event = {
        id: 'test-event-1',
        type: EventType.LEAD_CAPTURED,
        timestamp: new Date(),
        source: 'website_form',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          company: 'Test Corp'
        },
        priority: 8,
        leadId: 'lead-123'
      };

      await agent.perceive([event]);

      expect(agent.getContext().conversationHistory).toHaveLength(1);
      expect(agent.getContext().conversationHistory[0].type).toBe('lead_captured');
      expect(agent.getContext().leadId).toBe('lead-123');
    });

    it('should process customer interaction events', async () => {
      const event: Event = {
        id: 'test-event-2',
        type: EventType.CUSTOMER_INTERACTION,
        timestamp: new Date(),
        source: 'email',
        data: {
          type: InteractionType.EMAIL,
          content: 'I would like to see a demo of your product',
          channel: CommunicationChannel.EMAIL
        },
        priority: 7,
        customerId: 'customer-123',
        leadId: 'lead-123'
      };

      await agent.perceive([event]);

      expect(agent.getContext().conversationHistory).toHaveLength(1);
      expect(agent.getContext().conversationHistory[0].type).toBe('customer_interaction');
    });
  });

  describe('Decision Making', () => {
    it('should generate appropriate actions for lead capture', async () => {
      const event: Event = {
        id: 'test-event-1',
        type: EventType.LEAD_CAPTURED,
        timestamp: new Date(),
        source: 'website_form',
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          company: 'Test Corp'
        },
        priority: 8,
        leadId: 'lead-123'
      };

      const context: DecisionContext = {
        events: [event],
        currentContext: agent.getContext(),
        availableActions: [ActionType.UPDATE_RECORD, ActionType.TRIGGER_WORKFLOW, ActionType.SCHEDULE_FOLLOWUP],
        businessConstraints: {}
      };

      const actions = await agent.decide(context);

      expect(actions).toHaveLength(4); // score, qualify, assign, nurturing
      expect(actions.some(action => action.type === ActionType.UPDATE_RECORD)).toBe(true);
      expect(actions.some(action => action.type === ActionType.TRIGGER_WORKFLOW)).toBe(true);
    });

    it('should generate escalation actions for strong buying signals', async () => {
      const event: Event = {
        id: 'test-event-2',
        type: EventType.CUSTOMER_INTERACTION,
        timestamp: new Date(),
        source: 'email',
        data: {
          type: InteractionType.EMAIL,
          content: 'I need pricing information urgently for a demo next week',
          channel: CommunicationChannel.EMAIL
        },
        priority: 7,
        customerId: 'customer-123',
        leadId: 'lead-123'
      };

      const context: DecisionContext = {
        events: [event],
        currentContext: agent.getContext(),
        availableActions: [ActionType.ESCALATE, ActionType.UPDATE_RECORD, ActionType.SCHEDULE_FOLLOWUP],
        businessConstraints: {}
      };

      const actions = await agent.decide(context);

      expect(actions.length).toBeGreaterThan(0);
      expect(actions.some(action => action.type === ActionType.ESCALATE)).toBe(true);
      expect(actions.some(action => action.type === ActionType.SCHEDULE_FOLLOWUP)).toBe(true);
    });
  });

  describe('Action Execution', () => {
    it('should execute lead scoring actions', async () => {
      const action = {
        id: 'test-action-1',
        type: ActionType.UPDATE_RECORD,
        agentId: agent.id,
        timestamp: new Date(),
        parameters: {
          recordType: 'lead',
          recordId: 'lead-123',
          operation: 'score_lead',
          leadData: {
            jobTitle: 'CEO',
            company: 'Enterprise'
          }
        },
        priority: 8
      };

      const results = await agent.execute([action]);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].result.score).toBeDefined();
    });

    it('should execute lead qualification actions', async () => {
      const action = {
        id: 'test-action-2',
        type: ActionType.UPDATE_RECORD,
        agentId: agent.id,
        timestamp: new Date(),
        parameters: {
          recordType: 'lead',
          recordId: 'lead-123',
          operation: 'qualify_lead',
          leadData: {
            jobTitle: 'CEO',
            company: 'Enterprise'
          }
        },
        priority: 8
      };

      const results = await agent.execute([action]);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].result.qualification).toBeDefined();
    });

    it('should execute lead assignment actions', async () => {
      const action = {
        id: 'test-action-3',
        type: ActionType.UPDATE_RECORD,
        agentId: agent.id,
        timestamp: new Date(),
        parameters: {
          recordType: 'lead',
          recordId: 'lead-123',
          operation: 'assign_lead',
          leadData: {
            location: 'North America',
            industry: 'Technology'
          }
        },
        priority: 8
      };

      const results = await agent.execute([action]);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
    });

    it('should execute escalation actions', async () => {
      const action = {
        id: 'test-action-4',
        type: ActionType.ESCALATE,
        agentId: agent.id,
        timestamp: new Date(),
        parameters: {
          leadId: 'lead-123',
          reason: 'strong_buying_signals',
          signals: [{
            type: 'pricing_inquiry',
            strength: 0.9,
            description: 'Customer inquired about pricing',
            detectedAt: new Date(),
            source: 'content_analysis'
          }],
          priority: Priority.HIGH
        },
        priority: 9
      };

      const results = await agent.execute([action]);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].result.escalationId).toBeDefined();
    });

    it('should handle unsupported action types gracefully', async () => {
      const action = {
        id: 'test-action-5',
        type: 'UNSUPPORTED_ACTION' as ActionType,
        agentId: agent.id,
        timestamp: new Date(),
        parameters: {},
        priority: 5
      };

      const results = await agent.execute([action]);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toContain('Unsupported action type');
    });
  });

  describe('Buying Signal Detection', () => {
    it('should detect pricing inquiry signals', async () => {
      const interactionData = {
        content: 'Can you send me pricing information for your enterprise plan?',
        type: InteractionType.EMAIL
      };

      const signals = await agent['detectBuyingSignals'](interactionData);

      expect(signals).toHaveLength(1);
      expect(signals[0].type).toBe('pricing_inquiry');
      expect(signals[0].strength).toBe(0.8);
    });

    it('should detect demo request signals', async () => {
      const interactionData = {
        content: 'I would like to schedule a demo of your product',
        type: InteractionType.EMAIL
      };

      const signals = await agent['detectBuyingSignals'](interactionData);

      expect(signals).toHaveLength(1);
      expect(signals[0].type).toBe('demo_request');
      expect(signals[0].strength).toBe(0.9);
    });

    it('should detect timeline urgency signals', async () => {
      const interactionData = {
        content: 'We need to make a decision urgently by next week',
        type: InteractionType.EMAIL
      };

      const signals = await agent['detectBuyingSignals'](interactionData);

      expect(signals).toHaveLength(1);
      expect(signals[0].type).toBe('timeline_urgency');
      expect(signals[0].strength).toBe(0.7);
    });

    it('should detect multiple signals in one interaction', async () => {
      const interactionData = {
        content: 'We urgently need pricing for a demo next week',
        type: InteractionType.EMAIL
      };

      const signals = await agent['detectBuyingSignals'](interactionData);

      expect(signals.length).toBeGreaterThanOrEqual(2);
      expect(signals.some(s => s.type === 'pricing_inquiry')).toBe(true);
      expect(signals.some(s => s.type === 'timeline_urgency')).toBe(true);
    });
  });

  describe('Learning and Feedback', () => {
    it('should process positive feedback', async () => {
      const feedback = [{
        actionId: 'test-action-1',
        outcome: 'success' as const,
        score: 0.9,
        details: 'Lead was successfully qualified',
        timestamp: new Date(),
        source: 'system' as const
      }];

      await agent.learn(feedback);

      // Verify that learning was processed (in a real implementation, this would update internal state)
      expect(agent.getMetrics().learningScore).toBeGreaterThan(0);
    });

    it('should process negative feedback', async () => {
      const feedback = [{
        actionId: 'test-action-2',
        outcome: 'failure' as const,
        score: 0.2,
        details: 'Lead assignment was incorrect',
        timestamp: new Date(),
        source: 'user' as const
      }];

      await agent.learn(feedback);

      // Verify that learning was processed
      expect(agent.getMetrics().learningScore).toBeDefined();
    });
  });

  describe('Factory Function', () => {
    it('should create a properly configured agent', () => {
      const agent = createLeadManagementAgent('test-agent');

      expect(agent).toBeInstanceOf(LeadManagementAgent);
      expect(agent.id).toBe('test-agent');
      expect(agent.type).toBe(AgentType.LEAD_MANAGEMENT);
      expect(agent.capabilities).toHaveLength(5);
    });

    it('should accept custom configuration', () => {
      const customConfig = {
        priority: 10,
        maxConcurrentActions: 20,
        configuration: {
          maxLeadsPerHour: 50
        }
      };

      const agent = createLeadManagementAgent('custom-agent', customConfig);

      expect(agent.configuration.priority).toBe(10);
      expect(agent.configuration.maxConcurrentActions).toBe(20);
      expect(agent.configuration.configuration.maxLeadsPerHour).toBe(50);
    });
  });

  describe('Integration with CRM Pipeline', () => {
    it('should integrate with existing lead status workflow', async () => {
      const leadData = {
        id: 'lead-123',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE_FORM
      };

      const score = await agent.scoreLead(leadData);
      const qualification = await agent.qualifyLead(leadData, score);

      expect(score).toBeDefined();
      expect(qualification).toBeDefined();
      expect(Object.values(QualificationStatus)).toContain(qualification);
    });

    it('should handle lead progression through pipeline stages', async () => {
      const event: Event = {
        id: 'pipeline-event-1',
        type: EventType.LEAD_CAPTURED,
        timestamp: new Date(),
        source: 'crm_pipeline',
        data: {
          leadId: 'lead-123',
          currentStage: 'new',
          targetStage: 'qualified'
        },
        priority: 8,
        leadId: 'lead-123'
      };

      const context: DecisionContext = {
        events: [event],
        currentContext: agent.getContext(),
        availableActions: [ActionType.UPDATE_RECORD],
        businessConstraints: {}
      };

      const actions = await agent.decide(context);

      expect(actions.length).toBeGreaterThan(0);
      expect(actions.some(action => 
        action.type === ActionType.UPDATE_RECORD && 
        action.parameters.operation === 'score_lead'
      )).toBe(true);
    });
  });
});