/**
 * Test Suite for Functional Funnel Architecture
 * Comprehensive testing of all integrated systems
 */

import FunctionalFunnelArchitecture from './functional-funnel-architecture';
import ConversionPsychologyEngine from './conversion-psychology-engine';
import ABTestingFramework from './ab-testing-framework';
import LeadMagnetIntegration from './lead-magnet-integration';
import DynamicPricingSystem from './dynamic-pricing-system';
import FollowUpSequenceSystem from './follow-up-sequence-system';

export class FunctionalFunnelArchitectureTest {
  private architecture: FunctionalFunnelArchitecture;

  constructor() {
    this.architecture = new FunctionalFunnelArchitecture();
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<{
    passed: number;
    failed: number;
    results: TestResult[];
  }> {
    console.log('🚀 Starting Functional Funnel Architecture Tests...\n');

    const tests = [
      { name: 'Conversion Psychology Engine', test: () => this.testConversionPsychology() },
      { name: 'A/B Testing Framework', test: () => this.testABTesting() },
      { name: 'Lead Magnet Integration', test: () => this.testLeadMagnetIntegration() },
      { name: 'Dynamic Pricing System', test: () => this.testDynamicPricing() },
      { name: 'Follow-up Sequence System', test: () => this.testFollowUpSequences() },
      { name: 'Complete Funnel Creation', test: () => this.testCompleteFunnelCreation() },
      { name: 'Visitor Interaction Processing', test: () => this.testVisitorInteractionProcessing() },
      { name: 'Funnel Performance Analytics', test: () => this.testFunnelPerformanceAnalytics() },
      { name: 'Funnel Optimization', test: () => this.testFunnelOptimization() }
    ];

    const results: TestResult[] = [];
    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        console.log(`Testing ${test.name}...`);
        const result = await test.test();
        results.push({ name: test.name, passed: true, message: result });
        passed++;
        console.log(`✅ ${test.name}: ${result}\n`);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        results.push({ name: test.name, passed: false, message });
        failed++;
        console.log(`❌ ${test.name}: ${message}\n`);
      }
    }

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    return { passed, failed, results };
  }

  /**
   * Test Conversion Psychology Engine
   */
  private testConversionPsychology(): string {
    const engine = new ConversionPsychologyEngine();

    // Test scarcity trigger
    const scarcityTrigger = engine.createScarcityTrigger({
      id: 'test_scarcity',
      name: 'Test Scarcity',
      type: 'limited_quantity',
      value: 10,
      placement: 'pricing'
    });

    engine.addTrigger(scarcityTrigger);

    // Test urgency trigger
    const urgencyTrigger = engine.createUrgencyTrigger({
      id: 'test_urgency',
      name: 'Test Urgency',
      type: 'countdown_timer',
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      message: 'Offer expires in 24 hours!',
      placement: 'header'
    });

    engine.addTrigger(urgencyTrigger);

    // Test social proof trigger
    const socialProofTrigger = engine.createSocialProofTrigger({
      id: 'test_social_proof',
      name: 'Test Social Proof',
      type: 'recent_activity',
      data: engine.generateDynamicSocialProof('recent_activity'),
      placement: 'hero'
    });

    engine.addTrigger(socialProofTrigger);

    // Test trigger retrieval
    const triggers = engine.getTriggersForPlacement('pricing');
    if (triggers.length === 0) {
      throw new Error('No triggers found for pricing placement');
    }

    // Test metrics tracking
    engine.trackImpression('test_scarcity');
    engine.trackInteraction('test_scarcity');
    engine.trackConversion('test_scarcity');

    const metrics = engine.getMetrics('test_scarcity');
    if (!metrics || metrics.impressions !== 1 || metrics.conversions !== 1) {
      throw new Error('Metrics tracking failed');
    }

    return 'All conversion psychology features working correctly';
  }

  /**
   * Test A/B Testing Framework
   */
  private testABTesting(): string {
    const framework = new ABTestingFramework();

    // Create A/B test
    const test = framework.createTest({
      id: 'test_headline',
      name: 'Headline Test',
      description: 'Testing different headlines',
      variants: [
        { name: 'Control', weight: 50, config: { text: 'Original Headline' }, active: true },
        { name: 'Variant A', weight: 50, config: { text: 'New Headline' }, active: true }
      ],
      targetElement: '.headline',
      conversionGoal: 'form_submission'
    });

    // Start test
    if (!framework.startTest(test.id)) {
      throw new Error('Failed to start A/B test');
    }

    // Assign users to variants
    const userId1 = 'user_1';
    const userId2 = 'user_2';
    
    const variant1 = framework.assignUserToVariant(userId1, test.id);
    const variant2 = framework.assignUserToVariant(userId2, test.id);

    if (!variant1 || !variant2) {
      throw new Error('Failed to assign users to variants');
    }

    // Track impressions and conversions
    framework.trackImpression(test.id, variant1);
    framework.trackConversion(test.id, variant1);
    framework.trackImpression(test.id, variant2);

    // Get results
    const results = framework.getTestResults(test.id);
    if (results.length !== 2) {
      throw new Error('Incorrect number of test results');
    }

    // Test statistical analysis
    const analysis = framework.analyzeTest(test.id);
    if (!analysis) {
      throw new Error('Statistical analysis failed');
    }

    return 'A/B testing framework working correctly';
  }

  /**
   * Test Lead Magnet Integration
   */
  private async testLeadMagnetIntegration(): Promise<string> {
    const integration = new LeadMagnetIntegration();

    // Create lead magnet with form
    const { leadMagnet, form } = integration.createQuickLeadMagnet({
      name: 'Test Lead Magnet',
      title: 'Free Marketing Guide',
      description: 'Learn the secrets of successful marketing',
      type: 'ebook',
      value: '$97 Value',
      buttonText: 'Get Free Guide'
    });

    if (!leadMagnet || !form) {
      throw new Error('Failed to create lead magnet and form');
    }

    // Test form submission
    const submissionResult = await integration.submitForm(form.id, {
      email: 'test@example.com',
      firstName: 'John'
    }, {
      source: 'test',
      ipAddress: '127.0.0.1'
    });

    if (!submissionResult.success || !submissionResult.leadId) {
      throw new Error('Form submission failed');
    }

    // Create automation trigger
    const automation = integration.createAutomationTrigger({
      name: 'Welcome Email',
      event: 'form_submission',
      conditions: {
        formId: form.id
      },
      actions: [
        {
          type: 'send_email',
          config: {
            subject: 'Welcome!',
            content: 'Thanks for subscribing!'
          }
        }
      ],
      active: true
    });

    if (!automation) {
      throw new Error('Failed to create automation trigger');
    }

    // Test conversion stats
    const stats = integration.getConversionStats(leadMagnet.id);
    if (stats.totalLeads !== 1) {
      throw new Error('Conversion stats incorrect');
    }

    return 'Lead magnet integration working correctly';
  }

  /**
   * Test Dynamic Pricing System
   */
  private testDynamicPricing(): string {
    const pricing = new DynamicPricingSystem();

    // Add product
    const product = {
      id: 'test_product',
      name: 'Test Product',
      basePrice: 100,
      currency: 'USD',
      inventory: {
        total: 100,
        available: 50,
        reserved: 0,
        lowStockThreshold: 10
      },
      metadata: {}
    };

    pricing.addProduct(product);

    // Create pricing rules
    const discountRule = pricing.createTimeBasedPricingRule({
      name: 'Flash Sale',
      discountPercentage: 20,
      startTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      endTime: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    });

    const bulkRules = pricing.createQuantityBasedRule({
      name: 'Bulk Discount',
      tiers: [
        { minQuantity: 2, discountPercentage: 10 },
        { minQuantity: 5, discountPercentage: 20 }
      ]
    });

    // Test price calculation
    const priceCalc = pricing.calculatePrice('test_product', {
      quantity: 1,
      userSegment: 'premium',
      trafficSource: 'google'
    });

    if (!priceCalc) {
      throw new Error('Price calculation failed');
    }

    if (priceCalc.basePrice !== 100) {
      throw new Error('Base price incorrect');
    }

    // Test inventory management
    const reserveResult = pricing.reserveInventory('test_product', 5);
    if (!reserveResult) {
      throw new Error('Inventory reservation failed');
    }

    const inventoryStatus = pricing.getInventoryStatus('test_product');
    if (!inventoryStatus || inventoryStatus.available !== 45) {
      throw new Error('Inventory status incorrect after reservation');
    }

    // Test inventory release
    pricing.releaseReservation('test_product', 5);
    const updatedStatus = pricing.getInventoryStatus('test_product');
    if (!updatedStatus || updatedStatus.available !== 50) {
      throw new Error('Inventory status incorrect after release');
    }

    return 'Dynamic pricing system working correctly';
  }

  /**
   * Test Follow-up Sequence System
   */
  private async testFollowUpSequences(): Promise<string> {
    const sequences = new FollowUpSequenceSystem();

    // Add test contact
    const contact = {
      id: 'test_contact',
      email: 'test@example.com',
      firstName: 'John',
      tags: ['subscriber'],
      customFields: { segment: 'premium' },
      status: 'active' as const
    };

    sequences.addContact(contact);

    // Create welcome sequence
    const welcomeSequence = sequences.createWelcomeSequence({
      name: 'Test Welcome Sequence',
      triggerFormId: 'test_form',
      emails: [
        {
          subject: 'Welcome!',
          content: 'Thanks for joining!',
          delay: 0
        },
        {
          subject: 'Getting Started',
          content: 'Here are your next steps...',
          delay: 24
        }
      ]
    });

    if (!welcomeSequence) {
      throw new Error('Failed to create welcome sequence');
    }

    // Activate sequence
    if (!sequences.activateSequence(welcomeSequence.id)) {
      throw new Error('Failed to activate sequence');
    }

    // Enroll contact
    const enrollment = sequences.enrollContact(welcomeSequence.id, contact.id);
    if (!enrollment) {
      throw new Error('Failed to enroll contact in sequence');
    }

    // Test trigger event processing
    sequences.processTriggerEvent({
      type: 'form_submission',
      contactId: contact.id,
      data: { formId: 'test_form' }
    });

    // Create abandoned cart sequence
    const cartSequence = sequences.createAbandonedCartSequence({
      name: 'Test Cart Recovery',
      emails: [
        {
          subject: 'You left something behind',
          content: 'Complete your purchase...',
          delay: 1
        }
      ]
    });

    if (!cartSequence) {
      throw new Error('Failed to create abandoned cart sequence');
    }

    // Test sequence stats
    const stats = sequences.getSequenceStats(welcomeSequence.id);
    if (!stats || stats.totalEnrollments === 0) {
      throw new Error('Sequence stats incorrect');
    }

    return 'Follow-up sequence system working correctly';
  }

  /**
   * Test Complete Funnel Creation
   */
  private testCompleteFunnelCreation(): string {
    // Create a complete optimized funnel
    const funnel = this.architecture.createOptimizedFunnel({
      name: 'Test Marketing Funnel',
      type: 'lead_generation',
      pages: [
        { name: 'Landing Page', type: 'landing', templateId: 'landing_template_1' },
        { name: 'Opt-in Page', type: 'opt_in', templateId: 'optin_template_1' },
        { name: 'Thank You Page', type: 'thank_you', templateId: 'thankyou_template_1' }
      ],
      leadMagnet: {
        name: 'Marketing Secrets',
        title: 'Free Marketing Secrets Guide',
        description: 'Learn the top 10 marketing secrets',
        type: 'ebook',
        value: '$47 Value'
      },
      products: [
        {
          name: 'Marketing Course',
          basePrice: 297,
          currency: 'USD'
        }
      ],
      conversionGoals: [
        {
          name: 'Email Signup',
          type: 'email_signup',
          value: 10,
          trackingEvent: 'email_signup'
        },
        {
          name: 'Course Purchase',
          type: 'purchase',
          value: 297,
          trackingEvent: 'purchase'
        }
      ]
    });

    if (!funnel) {
      throw new Error('Failed to create funnel');
    }

    if (funnel.pages.length !== 3) {
      throw new Error('Incorrect number of pages created');
    }

    if (funnel.conversionGoals.length !== 2) {
      throw new Error('Incorrect number of conversion goals');
    }

    // Verify each page has optimization features
    for (const page of funnel.pages) {
      if (page.conversionTriggers.length === 0) {
        throw new Error(`Page ${page.name} has no conversion triggers`);
      }
    }

    return 'Complete funnel creation working correctly';
  }

  /**
   * Test Visitor Interaction Processing
   */
  private testVisitorInteractionProcessing(): string {
    // First create a funnel
    const funnel = this.architecture.createOptimizedFunnel({
      name: 'Test Interaction Funnel',
      type: 'sales',
      pages: [
        { name: 'Sales Page', type: 'sales', templateId: 'sales_template_1' }
      ],
      products: [
        {
          name: 'Test Product',
          basePrice: 99,
          currency: 'USD'
        }
      ],
      conversionGoals: [
        {
          name: 'Purchase',
          type: 'purchase',
          value: 99,
          trackingEvent: 'purchase'
        }
      ]
    });

    // Process visitor interaction
    const result = this.architecture.processVisitorInteraction({
      funnelId: funnel.id,
      pageId: funnel.pages[0].id,
      userId: 'test_user_123',
      event: 'page_view',
      context: {
        trafficSource: 'google',
        location: 'US',
        deviceType: 'desktop',
        userSegment: 'premium',
        timeOnPage: 120,
        scrollDepth: 75
      }
    });

    if (!result) {
      throw new Error('Failed to process visitor interaction');
    }

    if (result.conversionTriggers.length === 0) {
      throw new Error('No conversion triggers returned');
    }

    if (result.pricing.length === 0) {
      throw new Error('No pricing information returned');
    }

    return 'Visitor interaction processing working correctly';
  }

  /**
   * Test Funnel Performance Analytics
   */
  private testFunnelPerformanceAnalytics(): string {
    // Create funnel and simulate some traffic
    const funnel = this.architecture.createOptimizedFunnel({
      name: 'Analytics Test Funnel',
      type: 'lead_generation',
      pages: [
        { name: 'Landing Page', type: 'landing', templateId: 'landing_template_1' }
      ],
      conversionGoals: [
        {
          name: 'Email Signup',
          type: 'email_signup',
          value: 10,
          trackingEvent: 'email_signup'
        }
      ]
    });

    // Simulate visitor interactions
    for (let i = 0; i < 10; i++) {
      this.architecture.processVisitorInteraction({
        funnelId: funnel.id,
        pageId: funnel.pages[0].id,
        userId: `user_${i}`,
        event: 'page_view',
        context: {
          trafficSource: i % 2 === 0 ? 'google' : 'facebook',
          deviceType: 'desktop'
        }
      });
    }

    // Get performance data
    const performance = this.architecture.getFunnelPerformance(funnel.id);
    if (!performance) {
      throw new Error('Failed to get funnel performance');
    }

    if (performance.totalVisitors !== 10) {
      throw new Error('Incorrect visitor count in performance data');
    }

    return 'Funnel performance analytics working correctly';
  }

  /**
   * Test Funnel Optimization
   */
  private testFunnelOptimization(): string {
    // Create funnel
    const funnel = this.architecture.createOptimizedFunnel({
      name: 'Optimization Test Funnel',
      type: 'sales',
      pages: [
        { name: 'Sales Page', type: 'sales', templateId: 'sales_template_1' }
      ],
      conversionGoals: [
        {
          name: 'Purchase',
          type: 'purchase',
          value: 99,
          trackingEvent: 'purchase'
        }
      ]
    });

    // Get optimization recommendations
    const optimization = this.architecture.optimizeFunnel(funnel.id);
    if (!optimization) {
      throw new Error('Failed to get optimization recommendations');
    }

    // Should have some recommendations (even if empty initially)
    if (!Array.isArray(optimization.recommendations)) {
      throw new Error('Recommendations should be an array');
    }

    if (!Array.isArray(optimization.autoAppliedChanges)) {
      throw new Error('Auto-applied changes should be an array');
    }

    return 'Funnel optimization working correctly';
  }
}

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

// Export test runner function
export async function runFunctionalFunnelArchitectureTests(): Promise<void> {
  const tester = new FunctionalFunnelArchitectureTest();
  const results = await tester.runAllTests();
  
  if (results.failed > 0) {
    console.error(`\n❌ ${results.failed} tests failed!`);
    process.exit(1);
  } else {
    console.log(`\n✅ All ${results.passed} tests passed!`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runFunctionalFunnelArchitectureTests().catch(console.error);
}

export default FunctionalFunnelArchitectureTest;