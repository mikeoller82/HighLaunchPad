// Tests for CRM Data Models and Validation

import {
  Lead,
  Customer,
  Interaction,
  LeadSource,
  LeadStatus,
  QualificationStatus,
  CustomerSegment,
  InteractionType,
  CommunicationChannel,
  JourneyStage,
  Priority
} from '../crm-types';

import {
  LeadValidator,
  CustomerValidator,
  InteractionValidator,
  CRMValidationUtils,
  ValidationHelpers
} from '../crm-validation';

describe('CRM Data Models and Validation', () => {
  describe('ValidationHelpers', () => {
    test('should validate email addresses correctly', () => {
      expect(ValidationHelpers.isValidEmail('test@example.com')).toBe(true);
      expect(ValidationHelpers.isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(ValidationHelpers.isValidEmail('invalid-email')).toBe(false);
      expect(ValidationHelpers.isValidEmail('test@')).toBe(false);
      expect(ValidationHelpers.isValidEmail('@domain.com')).toBe(false);
    });

    test('should validate phone numbers correctly', () => {
      expect(ValidationHelpers.isValidPhone('+1234567890')).toBe(true);
      expect(ValidationHelpers.isValidPhone('(555) 123-4567')).toBe(true);
      expect(ValidationHelpers.isValidPhone('555-123-4567')).toBe(true);
      expect(ValidationHelpers.isValidPhone('123')).toBe(false);
      expect(ValidationHelpers.isValidPhone('abc-def-ghij')).toBe(false);
    });

    test('should validate scores correctly', () => {
      expect(ValidationHelpers.isValidScore(50)).toBe(true);
      expect(ValidationHelpers.isValidScore(0)).toBe(true);
      expect(ValidationHelpers.isValidScore(100)).toBe(true);
      expect(ValidationHelpers.isValidScore(-1)).toBe(false);
      expect(ValidationHelpers.isValidScore(101)).toBe(false);
      expect(ValidationHelpers.isValidScore(NaN)).toBe(false);
    });

    test('should validate probabilities correctly', () => {
      expect(ValidationHelpers.isValidProbability(0.5)).toBe(true);
      expect(ValidationHelpers.isValidProbability(0)).toBe(true);
      expect(ValidationHelpers.isValidProbability(1)).toBe(true);
      expect(ValidationHelpers.isValidProbability(-0.1)).toBe(false);
      expect(ValidationHelpers.isValidProbability(1.1)).toBe(false);
      expect(ValidationHelpers.isValidProbability(NaN)).toBe(false);
    });

    test('should validate enums correctly', () => {
      expect(ValidationHelpers.isValidEnum(LeadSource.WEBSITE_FORM, LeadSource)).toBe(true);
      expect(ValidationHelpers.isValidEnum('invalid_source', LeadSource)).toBe(false);
    });
  });

  describe('LeadValidator', () => {
    const validLead: Partial<Lead> = {
      id: 'lead_123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      company: 'Acme Corp',
      source: LeadSource.WEBSITE_FORM,
      status: LeadStatus.NEW,
      qualification: QualificationStatus.UNQUALIFIED,
      journeyStage: JourneyStage.AWARENESS,
      engagementScore: 75,
      conversionProbability: 0.3,
      createdAt: new Date(),
      updatedAt: new Date(),
      score: {
        total: 85,
        demographic: 20,
        behavioral: 25,
        engagement: 20,
        firmographic: 20,
        lastUpdated: new Date(),
        factors: []
      },
      dataQuality: {
        completeness: 0.8,
        accuracy: 0.9,
        freshness: new Date(),
        sources: ['website', 'enrichment_api']
      }
    };

    test('should validate a valid lead', () => {
      const result = LeadValidator.validate(validLead);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should require essential fields', () => {
      const invalidLead: Partial<Lead> = {
        id: '',
        firstName: '',
        lastName: '',
        email: 'invalid-email'
      };

      const result = LeadValidator.validate(invalidLead);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      const errorCodes = result.errors.map(e => e.code);
      expect(errorCodes).toContain('REQUIRED_FIELD');
      expect(errorCodes).toContain('INVALID_EMAIL');
    });

    test('should validate enum fields', () => {
      const leadWithInvalidEnums: Partial<Lead> = {
        ...validLead,
        source: 'invalid_source' as LeadSource,
        status: 'invalid_status' as LeadStatus,
        qualification: 'invalid_qualification' as QualificationStatus
      };

      const result = LeadValidator.validate(leadWithInvalidEnums);
      expect(result.isValid).toBe(false);
      
      const errorCodes = result.errors.map(e => e.code);
      expect(errorCodes.filter(code => code === 'INVALID_ENUM')).toHaveLength(3);
    });

    test('should validate score ranges', () => {
      const leadWithInvalidScores: Partial<Lead> = {
        ...validLead,
        engagementScore: 150,
        conversionProbability: 1.5,
        score: {
          total: -10,
          demographic: 200,
          behavioral: 25,
          engagement: 20,
          firmographic: 20,
          lastUpdated: new Date(),
          factors: []
        }
      };

      const result = LeadValidator.validate(leadWithInvalidScores);
      expect(result.isValid).toBe(false);
      
      const errorCodes = result.errors.map(e => e.code);
      expect(errorCodes).toContain('INVALID_SCORE');
      expect(errorCodes).toContain('INVALID_PROBABILITY');
    });
  });

  describe('CustomerValidator', () => {
    const validCustomer: Partial<Customer> = {
      id: 'customer_123',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      customerSince: new Date('2023-01-01'),
      segment: CustomerSegment.SMB,
      tier: 'gold',
      status: 'active',
      healthScore: 85,
      churnRisk: {
        probability: 0.2,
        factors: [],
        lastAssessed: new Date()
      },
      lifetimeValue: {
        current: 5000,
        predicted: 8000,
        currency: 'USD'
      },
      engagementMetrics: {
        emailEngagement: 0.7,
        websiteEngagement: 0.8,
        socialEngagement: 0.5,
        supportEngagement: 0.9,
        lastEngagement: new Date()
      }
    };

    test('should validate a valid customer', () => {
      const result = CustomerValidator.validate(validCustomer);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should require customer-specific fields', () => {
      const invalidCustomer: Partial<Customer> = {
        id: 'customer_123',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
        // Missing customerSince
      };

      const result = CustomerValidator.validate(invalidCustomer);
      expect(result.isValid).toBe(false);
      
      const errorFields = result.errors.map(e => e.field);
      expect(errorFields).toContain('customerSince');
    });

    test('should validate engagement metrics', () => {
      const customerWithInvalidMetrics: Partial<Customer> = {
        ...validCustomer,
        engagementMetrics: {
          emailEngagement: 1.5, // Invalid: > 1
          websiteEngagement: -0.1, // Invalid: < 0
          socialEngagement: 0.5,
          supportEngagement: 0.9,
          lastEngagement: new Date()
        }
      };

      const result = CustomerValidator.validate(customerWithInvalidMetrics);
      expect(result.isValid).toBe(false);
      
      const errorCodes = result.errors.map(e => e.code);
      expect(errorCodes).toContain('INVALID_PROBABILITY');
    });
  });

  describe('InteractionValidator', () => {
    const validInteraction: Partial<Interaction> = {
      id: 'interaction_123',
      type: InteractionType.EMAIL,
      channel: CommunicationChannel.EMAIL,
      direction: 'inbound',
      customerId: 'customer_123',
      content: 'Hello, I have a question about your product.',
      timestamp: new Date(),
      sentiment: 'neutral',
      sentimentScore: 0.1,
      engagementScore: 0.7,
      urgency: Priority.MEDIUM,
      isAutomated: false,
      aiGenerated: false,
      aiConfidence: 0.9,
      isValid: true,
      dataQuality: 0.95
    };

    test('should validate a valid interaction', () => {
      const result = InteractionValidator.validate(validInteraction);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should require essential interaction fields', () => {
      const invalidInteraction: Partial<Interaction> = {
        id: '',
        content: ''
        // Missing required fields
      };

      const result = InteractionValidator.validate(invalidInteraction);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      const errorCodes = result.errors.map(e => e.code);
      expect(errorCodes).toContain('REQUIRED_FIELD');
    });

    test('should require at least one participant', () => {
      const interactionWithoutParticipants: Partial<Interaction> = {
        ...validInteraction,
        customerId: undefined,
        leadId: undefined,
        contactId: undefined
      };

      const result = InteractionValidator.validate(interactionWithoutParticipants);
      expect(result.isValid).toBe(false);
      
      const errorCodes = result.errors.map(e => e.code);
      expect(errorCodes).toContain('MISSING_PARTICIPANT');
    });

    test('should validate sentiment scores', () => {
      const interactionWithInvalidSentiment: Partial<Interaction> = {
        ...validInteraction,
        sentiment: 'invalid_sentiment' as any,
        sentimentScore: 2.0 // Invalid: > 1
      };

      const result = InteractionValidator.validate(interactionWithInvalidSentiment);
      expect(result.isValid).toBe(false);
      
      const errorCodes = result.errors.map(e => e.code);
      expect(errorCodes).toContain('INVALID_ENUM');
      expect(errorCodes).toContain('INVALID_SCORE');
    });
  });

  describe('CRMValidationUtils', () => {
    test('should provide quick validation functions', () => {
      const validLead: Partial<Lead> = {
        id: 'lead_123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        source: LeadSource.WEBSITE_FORM,
        status: LeadStatus.NEW,
        qualification: QualificationStatus.UNQUALIFIED
      };

      const invalidLead: Partial<Lead> = {
        id: '',
        firstName: '',
        email: 'invalid-email'
      };

      expect(CRMValidationUtils.isValidLead(validLead)).toBe(true);
      expect(CRMValidationUtils.isValidLead(invalidLead)).toBe(false);
    });

    test('should calculate data completeness', () => {
      const completeLead: Partial<Lead> = {
        id: 'lead_123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        company: 'Acme Corp',
        jobTitle: 'Manager',
        source: LeadSource.WEBSITE_FORM,
        status: LeadStatus.NEW,
        assignedTo: 'agent_123'
      };

      const incompleteLead: Partial<Lead> = {
        id: 'lead_456',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        source: LeadSource.WEBSITE_FORM,
        status: LeadStatus.NEW
      };

      const completeScore = CRMValidationUtils.calculateLeadCompleteness(completeLead);
      const incompleteScore = CRMValidationUtils.calculateLeadCompleteness(incompleteLead);

      expect(completeScore).toBe(1.0); // 100% complete
      expect(incompleteScore).toBeLessThan(1.0);
      expect(incompleteScore).toBeGreaterThan(0.5); // Should be > 50% since required fields are filled
    });

    test('should sanitize data correctly', () => {
      expect(CRMValidationUtils.sanitizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
      expect(CRMValidationUtils.sanitizePhone('+1 (555) 123-4567 ext. 890')).toBe('+1 (555) 123-4567  890');
      expect(CRMValidationUtils.sanitizeName('  John   Doe  ')).toBe('John Doe');
    });
  });

  describe('Data Model Structure', () => {
    test('should have proper Lead interface structure', () => {
      const lead: Lead = {
        id: 'lead_123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        company: 'Acme Corp',
        jobTitle: 'Manager',
        source: LeadSource.WEBSITE_FORM,
        status: LeadStatus.NEW,
        qualification: QualificationStatus.UNQUALIFIED,
        assignedTo: 'agent_123',
        assignedAt: new Date(),
        score: {
          total: 85,
          demographic: 20,
          behavioral: 25,
          engagement: 20,
          firmographic: 20,
          lastUpdated: new Date(),
          factors: []
        },
        buyingSignals: [],
        aiInsights: {
          customerSegment: CustomerSegment.SMB,
          behaviorPatterns: [],
          predictedActions: [],
          riskFactors: [],
          opportunities: [],
          nextBestActions: [],
          lastUpdated: new Date(),
          confidence: 0.8
        },
        nurturingSequences: [],
        escalationTriggers: [],
        journeyStage: JourneyStage.AWARENESS,
        interactions: [],
        lastInteraction: new Date(),
        engagementScore: 75,
        enrichedData: {
          socialProfiles: {
            linkedin: 'https://linkedin.com/in/johndoe'
          },
          companyInfo: {
            industry: 'Technology',
            size: '100-500',
            website: 'https://acme.com'
          }
        },
        tags: ['qualified', 'enterprise'],
        customFields: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActivityAt: new Date(),
        conversionProbability: 0.3,
        expectedCloseDate: new Date(),
        estimatedValue: 10000,
        dataQuality: {
          completeness: 0.8,
          accuracy: 0.9,
          freshness: new Date(),
          sources: ['website', 'enrichment_api']
        }
      };

      // Test that the lead object has all expected properties
      expect(lead.id).toBeDefined();
      expect(lead.firstName).toBeDefined();
      expect(lead.score).toBeDefined();
      expect(lead.aiInsights).toBeDefined();
      expect(lead.dataQuality).toBeDefined();
    });

    test('should have proper Customer interface structure', () => {
      const customer: Customer = {
        id: 'customer_123',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567890',
        company: 'Tech Corp',
        jobTitle: 'Director',
        customerSince: new Date('2023-01-01'),
        segment: CustomerSegment.ENTERPRISE,
        tier: 'platinum',
        status: 'active',
        aiInsights: {
          customerSegment: CustomerSegment.ENTERPRISE,
          behaviorPatterns: [],
          predictedActions: [],
          riskFactors: [],
          opportunities: [],
          nextBestActions: [],
          lastUpdated: new Date(),
          confidence: 0.9
        },
        lifetimeValue: {
          current: 50000,
          predicted: 75000,
          currency: 'USD'
        },
        healthScore: 95,
        churnRisk: {
          probability: 0.1,
          factors: [],
          lastAssessed: new Date()
        },
        journey: {
          id: 'journey_123',
          customerId: 'customer_123',
          currentStage: JourneyStage.EXPANSION,
          stages: [],
          personalizedPath: [],
          triggers: [],
          metrics: {
            totalSteps: 10,
            completedSteps: 8,
            progressPercentage: 80,
            averageStageTime: {} as any,
            conversionRate: 0.8,
            dropoffPoints: [],
            engagementScore: 85
          },
          adaptations: [],
          isActive: true,
          startedAt: new Date(),
          lastUpdated: new Date()
        },
        interactions: [],
        touchpoints: [],
        relationships: [],
        preferences: {
          communicationChannels: [CommunicationChannel.EMAIL],
          frequency: 'weekly',
          contentTypes: ['newsletter', 'product_updates'],
          topics: ['technology', 'business'],
          timezone: 'UTC',
          language: 'en',
          optOuts: [],
          lastUpdated: new Date()
        },
        engagementMetrics: {
          emailEngagement: 0.8,
          websiteEngagement: 0.7,
          socialEngagement: 0.6,
          supportEngagement: 0.9,
          lastEngagement: new Date()
        },
        businessMetrics: {
          totalPurchases: 5,
          averageOrderValue: 10000,
          purchaseFrequency: 2,
          lastPurchaseDate: new Date(),
          preferredProducts: ['enterprise_plan'],
          paymentMethods: ['credit_card']
        },
        enrichedData: {
          companyInfo: {
            industry: 'Technology',
            size: '1000+',
            revenue: '$10M+',
            website: 'https://techcorp.com'
          }
        },
        tags: ['enterprise', 'high_value'],
        customFields: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActivityAt: new Date(),
        dataQuality: {
          completeness: 0.95,
          accuracy: 0.98,
          freshness: new Date(),
          sources: ['crm', 'enrichment_api', 'social_media']
        }
      };

      // Test that the customer object has all expected properties
      expect(customer.id).toBeDefined();
      expect(customer.customerSince).toBeDefined();
      expect(customer.journey).toBeDefined();
      expect(customer.aiInsights).toBeDefined();
      expect(customer.lifetimeValue).toBeDefined();
      expect(customer.healthScore).toBeDefined();
    });
  });
});