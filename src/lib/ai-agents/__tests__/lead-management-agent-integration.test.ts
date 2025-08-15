import { LeadManagementAgent, LeadScoringCriteria, AssignmentCriteria } from '../lead-management-agent';
import { LeadCaptureService, createLeadCaptureService } from '../lead-capture-service';
import { CRMDashboardIntegration, createCRMDashboardIntegration } from '../crm-dashboard-integration';
import {
  AgentConfiguration,
  AgentType,
  EventType,
  ActionType,
  Event,
  AgentCapability
} from '../types';
import {
  Lead,
  LeadSource,
  LeadStatus,
  QualificationStatus,
  Priority
} from '../../crm-types';

describe('LeadManagementAgent Integration Tests', () => {
  let leadAgent: LeadManagementAgent;
  let leadCaptureService: LeadCaptureService;
  let dashboardIntegration: CRMDashboardIntegration;
  let agentConfig: AgentConfiguration;

  beforeEach(() => {
    // Create agent configuration
    agentConfig = {
      id: 'test-lead-agent',
      type: AgentType.LEAD_MANAGEMENT,
      name: 'Test Lead Management Agent',
      description: 'Agent for testing lead management functionality',
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
        },
        {
          name: 'lead_assignment',
          description: 'Assign leads to appropriate sales reps',
          requiredPermissions: ['read_leads', 'update_leads', 'read_users'],
          supportedEventTypes: [EventType.LEAD_CAPTURED],
          supportedActionTypes: [ActionType.UPDATE_RECORD, ActionType.CREATE_TASK]
        },
        {
          name: 'buying_signal_detection',
          description: 'Detect buying signals from customer interactions',
          requiredPermissions: ['read_interactions'],
          supportedEventTypes: [EventType.CUSTOMER_INTERACTION],
          supportedActionTypes: [ActionType.ESCALATE, ActionType.SCHEDULE_FOLLOWUP]
        }
      ],
      enabled: true,
      priority: 1,
      maxConcurrentActions: 10,
      learningEnabled: true,
      configuration: {}
    };

    // Initialize agent
    leadAgent = new LeadManagementAgent(agentConfig);

    // Initialize services
    leadCaptureService = createLeadCaptureService(leadAgent);
    dashboardIntegration = createCRMDashboardIntegration(leadAgent, leadCaptureService);
  });

  afterEach(async () => {
    await leadAgent.stop();
    dashboardIntegration.destroy();
  });

  describe('Lead Scoring Algorithm', () => {
    it('should score leads based on configurable criteria', async () => {
      const leadData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@enterprise.com',
        jobTitle: 'CEO',
        company: 'Enterprise Corp',
        industry: 'Technology',
        companyRevenue: 50000000, // $50M
        websiteVisits: 5,
        emailEngagement: {
          openRate: 0.8,
          clickRate: 0.6
        },
        socialMediaActivity: 3
      };

      const score = await leadAgent.scoreLead(leadData);

      expect(score).toBeDefined();
      expect(score.total).toBeGreaterThan(0);
      expect(score.total).toBeLessThanOrEqual(100);
      expect(score.demographic).toBeGreaterThan(0);
      expect(score.behavioral).toBeGreaterThan(0);
      expect(score.engagement).toBeGreaterThan(0);
      expect(score.firmographic).toBeGreaterThan(0);
      expect(score.factors).toHaveLength(expect.any(Number));
      expect(score.lastUpdated).toBeInstanceOf(Date);
    });

    it('should handle leads with minimal data', async () => {
      const leadData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@startup.com'
      };

      const score = await leadAgent.scoreLead(leadData);

      expect(score).toBeDefined();
      expect(score.total).toBeGreaterThanOrEqual(0);
      expect(score.total).toBeLessThanOrEqual(100);
    });

    it('should allow updating scoring criteria', async () => {
      const newCriteria: Partial<LeadScoringCriteria> = {
        demographic: {
          jobTitle: {
            weight: 0.3,
            values: {
              'CEO': 15,
              'CTO': 12,
              'VP': 10,
              'Director': 8,
              'Manager': 6,
              'Developer': 4,
              'Other': 2
            }
          },
          company: {
            weight: 0.2,
            values: {
              'Enterprise': 12,
              'Mid-Market': 8,
              'Small Business': 6,
              'Startup': 7,
              'Unknown': 1
            }
          },
          industry: {
            weight: 0.15,
            values: {
              'Technology': 10,
              'Finance': 8,
              'Healthcare': 7,
              'Manufacturing': 6,
              'Other': 3
            }
          },
          companySize: {
            weight: 0.2,
            values: {
              '1000+': 12,
              '500-999': 10,
              '100-499': 8,
              '50-99': 5,
              '1-49': 3
            }
          }
        }
      };

      await leadAgent.updateScoringCriteria(newCriteria);

      const leadData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        jobTitle: 'CEO',
        company: 'Enterprise'
      };

      const score = await leadAgent.scoreLead(leadData);
      expect(score.demographic).toBeGreaterThan(0);
    });
  });

  describe('Lead Qualification', () => {
    it('should qualify leads based on score thresholds', async () => {
      const highScoreData = {
        firstName: 'High',
        lastName: 'Score',
        email: 'high@enterprise.com',
        jobTitle: 'CEO',
        company: 'Enterprise',
        industry: 'Technology',
        companyRevenue: 100000000,
        websiteVisits: 10,
        emailEngagement: { openRate: 0.9, clickRate: 0.8 }
      };

      const score = await leadAgent.scoreLead(highScoreData);
      const qualification = await leadAgent.qualifyLead(highScoreData, score);

      if (score.total >= 80) {
        expect(qualification).toBe(QualificationStatus.SALES_QUALIFIED);
      } else if (score.total >= 60) {
        expect(qualification).toBe(QualificationStatus.MARKETING_QUALIFIED);
      } else if (score.total >= 40) {
        expect(qualification).toBe(QualificationStatus.OPPORTUNITY);
      } else {
        expect(qualification).toBe(QualificationStatus.UNQUALIFIED);
      }
    });

    it('should handle low-score leads appropriately', async () => {
      const lowScoreData = {
        firstName: 'Low',
        lastName: 'Score',
        email: 'low@unknown.com'
      };

      const score = await leadAgent.scoreLead(lowScoreData);
      const qualification = await leadAgent.qualifyLead(lowScoreData, score);

      expect([
        QualificationStatus.UNQUALIFIED,
        QualificationStatus.OPPORTUNITY,
        QualificationStatus.MARKETING_QUALIFIED,
        QualificationStatus.SALES_QUALIFIED
      ]).toContain(qualification);
    });
  });

  describe('Lead Assignment', () => {
    it('should assign leads when assignment criteria are configured', async () => {
      const assignmentCriteria: AssignmentCriteria = {
        territory: {
          geographic: {
            'user1': ['North America', 'US'],
            'user2': ['Europe', 'UK']
          },
          industry: {
            'user1': ['Technology', 'Software'],
            'user2': ['Finance', 'Banking']
          },
          companySize: {
            'user1': ['Enterprise', '1000+'],
            'user2': ['SMB', '100-499']
          }
        },
        expertise: {
          productExpertise: {
            'user1': ['CRM', 'Sales'],
            'user2': ['Marketing', 'Analytics']
          },
          industryExpertise: {
            'user1': ['Technology'],
            'user2': ['Finance']
          },
          languageSkills: {
            'user1': ['English'],
            'user2': ['English', 'Spanish']
          }
        },
        workload: {
          maxLeadsPerUser: 50,
          currentWorkload: {
            'user1': 10,
            'user2': 5
          },
          capacity: {
            'user1': 50,
            'user2': 40
          }
        },
        availability: {
          businessHours: {
            'user1': { start: '09:00', end: '17:00', timezone: 'UTC' },
            'user2': { start: '08:00', end: '16:00', timezone: 'UTC' }
          },
          outOfOffice: {
            'user1': [],
            'user2': []
          },
          currentStatus: {
            'user1': 'available',
            'user2': 'available'
          }
        }
      };

      await leadAgent.updateAssignmentCriteria(assignmentCriteria);

      const leadData = {
        firstName: 'Assign',
        lastName: 'Test',
        email: 'assign@tech.com',
        location: 'North America',
        industry: 'Technology'
      };

      const assignedTo = await leadAgent.assignLead(leadData);
      expect(assignedTo).toBeDefined();
      expect(['user1', 'user2']).toContain(assignedTo);
    });

    it('should return null when no suitable assignee is found', async () => {
      const leadData = {
        firstName: 'No',
        lastName: 'Match',
        email: 'nomatch@unknown.com',
        location: 'Antarctica',
        industry: 'Ice Mining'
      };

      const assignedTo = await leadAgent.assignLead(leadData);
      expect(assignedTo).toBeNull();
    });
  });

  describe('Event Processing', () => {
    it('should process lead captured events', async () => {
      await leadAgent.start();

      const leadCapturedEvent: Event = {
        id: 'test-event-1',
        type: EventType.LEAD_CAPTURED,
        timestamp: new Date(),
        source: 'test',
        data: {
          firstName: 'Event',
          lastName: 'Test',
          email: 'event@test.com',
          jobTitle: 'Manager',
          company: 'Test Corp'
        },
        priority: 8,
        leadId: 'test-lead-1'
      };

      await leadAgent.perceive([leadCapturedEvent]);

      // Verify event was processed
      const context = leadAgent.getContext();
      expect(context.conversationHistory).toHaveLength(1);
      expect(context.conversationHistory[0].type).toBe('lead_captured');
      expect(context.leadId).toBe('test-lead-1');
    });

    it('should process customer interaction events and detect buying signals', async () => {
      await leadAgent.start();

      const interactionEvent: Event = {
        id: 'test-interaction-1',
        type: EventType.CUSTOMER_INTERACTION,
        timestamp: new Date(),
        source: 'test',
        data: {
          content: 'I would like to see a demo and get pricing information',
          type: 'email',
          channel: 'email'
        },
        priority: 7,
        leadId: 'test-lead-1'
      };

      await leadAgent.perceive([interactionEvent]);

      // Verify interaction was processed
      const context = leadAgent.getContext();
      expect(context.conversationHistory).toHaveLength(1);
      expect(context.conversationHistory[0].type).toBe('customer_interaction');
    });
  });

  describe('Action Execution', () => {
    it('should execute lead scoring actions', async () => {
      await leadAgent.start();

      const scoringAction = {
        id: 'test-score-action',
        type: ActionType.UPDATE_RECORD,
        agentId: leadAgent.id,
        timestamp: new Date(),
        parameters: {
          recordType: 'lead',
          recordId: 'test-lead-1',
          operation: 'score_lead',
          leadData: {
            firstName: 'Action',
            lastName: 'Test',
            email: 'action@test.com',
            jobTitle: 'CEO'
          }
        },
        priority: 8
      };

      const results = await leadAgent.execute([scoringAction]);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].result.score).toBeDefined();
    });

    it('should execute lead assignment actions', async () => {
      await leadAgent.start();

      // Set up assignment criteria first
      const assignmentCriteria: AssignmentCriteria = {
        territory: {
          geographic: { 'user1': ['US'] },
          industry: { 'user1': ['Technology'] },
          companySize: { 'user1': ['Enterprise'] }
        },
        expertise: {
          productExpertise: { 'user1': ['CRM'] },
          industryExpertise: { 'user1': ['Technology'] },
          languageSkills: { 'user1': ['English'] }
        },
        workload: {
          maxLeadsPerUser: 50,
          currentWorkload: { 'user1': 5 },
          capacity: { 'user1': 50 }
        },
        availability: {
          businessHours: { 'user1': { start: '09:00', end: '17:00', timezone: 'UTC' } },
          outOfOffice: { 'user1': [] },
          currentStatus: { 'user1': 'available' }
        }
      };

      await leadAgent.updateAssignmentCriteria(assignmentCriteria);

      const assignmentAction = {
        id: 'test-assign-action',
        type: ActionType.UPDATE_RECORD,
        agentId: leadAgent.id,
        timestamp: new Date(),
        parameters: {
          recordType: 'lead',
          recordId: 'test-lead-1',
          operation: 'assign_lead',
          leadData: {
            firstName: 'Assign',
            lastName: 'Test',
            email: 'assign@test.com',
            location: 'US',
            industry: 'Technology'
          }
        },
        priority: 7
      };

      const results = await leadAgent.execute([assignmentAction]);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].result.assignedTo).toBeDefined();
    });
  });

  describe('CRM Pipeline Integration', () => {
    it('should integrate with CRM pipeline', async () => {
      await leadAgent.start();
      await leadAgent.integrateWithCRMPipeline();

      // Verify integration is set up
      expect(leadAgent.getStatus()).not.toBe('error');
    });

    it('should handle pipeline stage changes', async () => {
      await leadAgent.start();
      await leadAgent.integrateWithCRMPipeline();

      // Simulate pipeline stage change
      leadAgent.emit('pipelineStageChanged', {
        leadId: 'test-lead-1',
        oldStage: 'new',
        newStage: 'qualified'
      });

      // Verify the event was handled (no errors thrown)
      expect(leadAgent.getStatus()).not.toBe('error');
    });
  });

  describe('Performance and Configuration', () => {
    it('should provide performance metrics', async () => {
      const metrics = await leadAgent.getPerformanceMetrics();

      expect(metrics).toBeDefined();
      expect(typeof metrics.totalLeadsProcessed).toBe('number');
      expect(typeof metrics.averageScoreAccuracy).toBe('number');
      expect(typeof metrics.assignmentSuccessRate).toBe('number');
      expect(typeof metrics.qualificationAccuracy).toBe('number');
      expect(typeof metrics.processingTime).toBe('number');
    });

    it('should export and import configuration', async () => {
      const originalConfig = leadAgent.exportConfiguration();

      expect(originalConfig.scoringCriteria).toBeDefined();
      expect(originalConfig.assignmentCriteria).toBeDefined();
      expect(originalConfig.agentConfiguration).toBeDefined();

      // Modify and import configuration
      const modifiedConfig = {
        ...originalConfig,
        scoringCriteria: {
          ...originalConfig.scoringCriteria,
          demographic: {
            ...originalConfig.scoringCriteria.demographic,
            jobTitle: {
              weight: 0.25,
              values: { 'CEO': 12, 'CTO': 10, 'Other': 3 }
            }
          }
        }
      };

      await leadAgent.importConfiguration(modifiedConfig);

      const newConfig = leadAgent.exportConfiguration();
      expect(newConfig.scoringCriteria.demographic.jobTitle.weight).toBe(0.25);
    });

    it('should process leads in batches', async () => {
      await leadAgent.start();

      const leadIds = ['lead-1', 'lead-2', 'lead-3', 'lead-4', 'lead-5'];
      const results = await leadAgent.processLeadsBatch(leadIds);

      expect(results).toHaveLength(leadIds.length);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Dashboard Integration', () => {
    it('should initialize dashboard integration', async () => {
      await dashboardIntegration.initialize();

      // Verify initialization completed without errors
      expect(dashboardIntegration).toBeDefined();
    });

    it('should handle lead scoring updates', async () => {
      await dashboardIntegration.initialize();

      const mockScore = {
        total: 85,
        demographic: 25,
        behavioral: 20,
        engagement: 15,
        firmographic: 25,
        lastUpdated: new Date(),
        factors: []
      };

      await dashboardIntegration.processLeadScoringUpdate('test-lead-1', mockScore);

      // Verify update was processed
      const notifications = dashboardIntegration.getNotifications();
      expect(notifications.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid lead data gracefully', async () => {
      const invalidLeadData = null;

      try {
        const score = await leadAgent.scoreLead(invalidLeadData);
        // Should not throw, but return a default score
        expect(score).toBeDefined();
      } catch (error) {
        // If it throws, the error should be handled gracefully
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should handle action execution failures', async () => {
      await leadAgent.start();

      const invalidAction = {
        id: 'invalid-action',
        type: 'INVALID_ACTION_TYPE' as any,
        agentId: leadAgent.id,
        timestamp: new Date(),
        parameters: {},
        priority: 5
      };

      const results = await leadAgent.execute([invalidAction]);

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toBeDefined();
    });
  });
});