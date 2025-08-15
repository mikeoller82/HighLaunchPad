/**
 * Functional Funnel Architecture
 * Main integration system for conversion psychology, A/B testing, lead magnets, 
 * dynamic pricing, and follow-up sequences
 */

import ConversionPsychologyEngine, { ConversionTrigger, ConversionMetrics } from './conversion-psychology-engine';
import ABTestingFramework, { ABTest, TestResult, StatisticalAnalysis } from './ab-testing-framework';
import LeadMagnetIntegration, { LeadMagnet, OptInForm, LeadData } from './lead-magnet-integration';
import DynamicPricingSystem, { Product, PriceCalculation, PricingRule } from './dynamic-pricing-system';
import FollowUpSequenceSystem, { FollowUpSequence, SequenceEnrollment } from './follow-up-sequence-system';

export interface FunnelConfig {
  id: string;
  name: string;
  type: 'lead_generation' | 'sales' | 'webinar' | 'course' | 'consultation';
  pages: FunnelPage[];
  conversionGoals: ConversionGoal[];
  settings: FunnelSettings;
  active: boolean;
}

export interface FunnelPage {
  id: string;
  name: string;
  type: 'landing' | 'opt_in' | 'sales' | 'checkout' | 'thank_you' | 'upsell';
  templateId: string;
  url: string;
  conversionTriggers: string[]; // ConversionTrigger IDs
  abTests: string[]; // ABTest IDs
  leadMagnets: string[]; // LeadMagnet IDs
  products: string[]; // Product IDs for pricing
  followUpSequences: string[]; // FollowUpSequence IDs
  analytics: PageAnalytics;
}

export interface ConversionGoal {
  id: string;
  name: string;
  type: 'form_submission' | 'purchase' | 'email_signup' | 'download' | 'custom';
  value: number; // Monetary value
  trackingEvent: string;
}

export interface FunnelSettings {
  domain?: string;
  seoSettings: {
    title: string;
    description: string;
    keywords: string[];
  };
  integrations: {
    emailProvider?: string;
    paymentProcessor?: string;
    analytics?: string[];
    webhooks?: string[];
  };
  personalization: {
    enabled: boolean;
    segments: string[];
    rules: PersonalizationRule[];
  };
}

export interface PersonalizationRule {
  id: string;
  name: string;
  conditions: {
    trafficSource?: string[];
    location?: string[];
    deviceType?: string[];
    userSegment?: string[];
    previousVisit?: boolean;
  };
  actions: {
    showElements?: string[];
    hideElements?: string[];
    replaceContent?: Record<string, string>;
    applyPricing?: string; // PricingRule ID
    triggerSequence?: string; // FollowUpSequence ID
  };
}

export interface PageAnalytics {
  visitors: number;
  uniqueVisitors: number;
  conversions: number;
  conversionRate: number;
  averageTimeOnPage: number;
  bounceRate: number;
  trafficSources: Record<string, number>;
  lastUpdated: Date;
}

export interface FunnelPerformance {
  funnelId: string;
  totalVisitors: number;
  totalConversions: number;
  overallConversionRate: number;
  revenue: number;
  averageOrderValue: number;
  pagePerformance: Map<string, PageAnalytics>;
  conversionPath: ConversionPathStep[];
  dropOffPoints: DropOffPoint[];
  topPerformingVariants: TestResult[];
  revenueBySource: Record<string, number>;
}

export interface ConversionPathStep {
  pageId: string;
  pageName: string;
  visitors: number;
  conversions: number;
  dropOffRate: number;
  averageTimeSpent: number;
}

export interface DropOffPoint {
  pageId: string;
  pageName: string;
  dropOffRate: number;
  commonExitActions: string[];
  recommendations: string[];
}

export class FunctionalFunnelArchitecture {
  private conversionEngine: ConversionPsychologyEngine;
  private abTestingFramework: ABTestingFramework;
  private leadMagnetSystem: LeadMagnetIntegration;
  private pricingSystem: DynamicPricingSystem;
  private sequenceSystem: FollowUpSequenceSystem;
  
  private funnels: Map<string, FunnelConfig> = new Map();
  private performance: Map<string, FunnelPerformance> = new Map();

  constructor() {
    this.conversionEngine = new ConversionPsychologyEngine();
    this.abTestingFramework = new ABTestingFramework();
    this.leadMagnetSystem = new LeadMagnetIntegration();
    this.pricingSystem = new DynamicPricingSystem();
    this.sequenceSystem = new FollowUpSequenceSystem();
  }

  /**
   * Create a complete funnel with all optimization features
   */
  createOptimizedFunnel(config: {
    name: string;
    type: FunnelConfig['type'];
    pages: {
      name: string;
      type: FunnelPage['type'];
      templateId: string;
    }[];
    leadMagnet?: {
      name: string;
      title: string;
      description: string;
      type: LeadMagnet['type'];
      value: string;
    };
    products?: {
      name: string;
      basePrice: number;
      currency: string;
    }[];
    conversionGoals: Omit<ConversionGoal, 'id'>[];
  }): FunnelConfig {
    const funnelId = this.generateId();
    
    // Create lead magnet if provided
    let leadMagnet: LeadMagnet | undefined;
    let optInForm: OptInForm | undefined;
    
    if (config.leadMagnet) {
      const result = this.leadMagnetSystem.createQuickLeadMagnet({
        name: config.leadMagnet.name,
        title: config.leadMagnet.title,
        description: config.leadMagnet.description,
        type: config.leadMagnet.type,
        value: config.leadMagnet.value
      });
      leadMagnet = result.leadMagnet;
      optInForm = result.form;
    }

    // Create products if provided
    const products: Product[] = [];
    if (config.products) {
      for (const productConfig of config.products) {
        const product: Product = {
          id: this.generateId(),
          name: productConfig.name,
          basePrice: productConfig.basePrice,
          currency: productConfig.currency,
          metadata: { funnelId }
        };
        this.pricingSystem.addProduct(product);
        products.push(product);
      }
    }

    // Create funnel pages with optimization features
    const pages: FunnelPage[] = config.pages.map((pageConfig, index) => {
      const pageId = this.generateId();
      
      // Create conversion triggers for each page
      const conversionTriggers: string[] = [];
      
      // Add scarcity trigger for sales pages
      if (pageConfig.type === 'sales' || pageConfig.type === 'checkout') {
        const scarcityTrigger = this.conversionEngine.createScarcityTrigger({
          id: `${pageId}_scarcity`,
          name: `${pageConfig.name} Scarcity`,
          type: 'limited_time',
          value: '24 hours',
          placement: 'pricing'
        });
        this.conversionEngine.addTrigger(scarcityTrigger);
        conversionTriggers.push(scarcityTrigger.id);
      }

      // Add social proof for all pages
      const socialProofTrigger = this.conversionEngine.createSocialProofTrigger({
        id: `${pageId}_social_proof`,
        name: `${pageConfig.name} Social Proof`,
        type: 'recent_activity',
        data: this.conversionEngine.generateDynamicSocialProof('recent_activity'),
        placement: 'hero'
      });
      this.conversionEngine.addTrigger(socialProofTrigger);
      conversionTriggers.push(socialProofTrigger.id);

      // Create A/B tests for key elements
      const abTests: string[] = [];
      
      if (pageConfig.type === 'landing' || pageConfig.type === 'sales') {
        const headlineTest = this.abTestingFramework.createSimpleContentTest({
          id: `${pageId}_headline_test`,
          name: `${pageConfig.name} Headline Test`,
          targetElement: '.hero-headline',
          variants: [
            { name: 'Original', content: 'Transform Your Business Today' },
            { name: 'Benefit-Focused', content: 'Double Your Revenue in 90 Days' },
            { name: 'Question-Based', content: 'Ready to Scale Your Business?' }
          ],
          conversionGoal: 'form_submission'
        });
        abTests.push(headlineTest.id);
      }

      return {
        id: pageId,
        name: pageConfig.name,
        type: pageConfig.type,
        templateId: pageConfig.templateId,
        url: `/${pageConfig.name.toLowerCase().replace(/\s+/g, '-')}`,
        conversionTriggers,
        abTests,
        leadMagnets: leadMagnet ? [leadMagnet.id] : [],
        products: products.map(p => p.id),
        followUpSequences: [],
        analytics: {
          visitors: 0,
          uniqueVisitors: 0,
          conversions: 0,
          conversionRate: 0,
          averageTimeOnPage: 0,
          bounceRate: 0,
          trafficSources: {},
          lastUpdated: new Date()
        }
      };
    });

    // Create follow-up sequences
    if (leadMagnet) {
      const welcomeSequence = this.sequenceSystem.createWelcomeSequence({
        name: `${config.name} Welcome Series`,
        triggerFormId: optInForm!.id,
        emails: [
          {
            subject: 'Welcome! Here\'s your free resource',
            content: 'Thank you for joining! Here\'s your promised resource...',
            delay: 0
          },
          {
            subject: 'Quick question about your goals',
            content: 'I\'d love to learn more about what you\'re trying to achieve...',
            delay: 24
          },
          {
            subject: 'The #1 mistake I see people make',
            content: 'After working with thousands of people, I\'ve noticed...',
            delay: 72
          }
        ]
      });
      
      this.sequenceSystem.activateSequence(welcomeSequence.id);
      
      // Add sequence to relevant pages
      pages.forEach(page => {
        if (page.type === 'opt_in' || page.type === 'thank_you') {
          page.followUpSequences.push(welcomeSequence.id);
        }
      });
    }

    // Create abandoned cart sequence for sales funnels
    if (config.type === 'sales' && products.length > 0) {
      const abandonedCartSequence = this.sequenceSystem.createAbandonedCartSequence({
        name: `${config.name} Cart Recovery`,
        productIds: products.map(p => p.id),
        emails: [
          {
            subject: 'You left something behind...',
            content: 'I noticed you were interested in our offer...',
            delay: 1
          },
          {
            subject: 'Last chance - 20% off expires soon',
            content: 'Don\'t miss out on this limited-time discount...',
            delay: 24,
            incentive: { type: 'discount', value: 20 }
          }
        ]
      });
      
      this.sequenceSystem.activateSequence(abandonedCartSequence.id);
    }

    // Create pricing rules for products
    if (products.length > 0) {
      // Early bird discount
      const earlyBirdRule = this.pricingSystem.createTimeBasedPricingRule({
        name: `${config.name} Early Bird`,
        discountPercentage: 30,
        startTime: new Date(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        products: products.map(p => p.id)
      });

      // Bulk discount
      const bulkRules = this.pricingSystem.createQuantityBasedRule({
        name: `${config.name} Bulk Discount`,
        tiers: [
          { minQuantity: 2, discountPercentage: 10 },
          { minQuantity: 5, discountPercentage: 20 }
        ],
        products: products.map(p => p.id)
      });
    }

    const funnel: FunnelConfig = {
      id: funnelId,
      name: config.name,
      type: config.type,
      pages,
      conversionGoals: config.conversionGoals.map(goal => ({
        ...goal,
        id: this.generateId()
      })),
      settings: {
        seoSettings: {
          title: config.name,
          description: `High-converting ${config.type} funnel`,
          keywords: [config.type, 'conversion', 'funnel']
        },
        integrations: {},
        personalization: {
          enabled: true,
          segments: ['new_visitor', 'returning_visitor', 'mobile', 'desktop'],
          rules: []
        }
      },
      active: true
    };

    this.funnels.set(funnelId, funnel);
    
    // Initialize performance tracking
    this.initializePerformanceTracking(funnel);

    return funnel;
  }

  /**
   * Process visitor interaction with funnel
   */
  processVisitorInteraction(interaction: {
    funnelId: string;
    pageId: string;
    userId: string;
    event: string;
    data?: any;
    context: {
      trafficSource?: string;
      location?: string;
      deviceType?: string;
      userSegment?: string;
      timeOnPage?: number;
      scrollDepth?: number;
    };
  }): {
    conversionTriggers: ConversionTrigger[];
    abTestVariants: Record<string, string>;
    pricing: PriceCalculation[];
    personalizedContent: Record<string, any>;
  } {
    const funnel = this.funnels.get(interaction.funnelId);
    const page = funnel?.pages.find(p => p.id === interaction.pageId);
    
    if (!funnel || !page) {
      return { conversionTriggers: [], abTestVariants: {}, pricing: [], personalizedContent: {} };
    }

    // Get conversion triggers for this page
    const conversionTriggers = page.conversionTriggers
      .map(triggerId => this.conversionEngine.getTriggersForPlacement('hero', interaction.context))
      .flat();

    // Get A/B test variants
    const abTestVariants: Record<string, string> = {};
    for (const testId of page.abTests) {
      const variant = this.abTestingFramework.assignUserToVariant(interaction.userId, testId);
      if (variant) {
        abTestVariants[testId] = variant;
      }
    }

    // Get dynamic pricing
    const pricing: PriceCalculation[] = [];
    for (const productId of page.products) {
      const priceCalc = this.pricingSystem.calculatePrice(productId, {
        quantity: interaction.data?.quantity || 1,
        userSegment: interaction.context.userSegment,
        trafficSource: interaction.context.trafficSource,
        location: interaction.context.location,
        deviceType: interaction.context.deviceType
      });
      if (priceCalc) {
        pricing.push(priceCalc);
      }
    }

    // Apply personalization rules
    const personalizedContent = this.applyPersonalizationRules(funnel, page, interaction.context);

    // Track analytics
    this.trackPageVisit(interaction);

    // Process events (form submissions, purchases, etc.)
    if (interaction.event === 'form_submission') {
      this.processFormSubmission(interaction);
    } else if (interaction.event === 'purchase') {
      this.processPurchase(interaction);
    }

    return {
      conversionTriggers,
      abTestVariants,
      pricing,
      personalizedContent
    };
  }

  /**
   * Get funnel performance analytics
   */
  getFunnelPerformance(funnelId: string): FunnelPerformance | null {
    return this.performance.get(funnelId) || null;
  }

  /**
   * Optimize funnel based on performance data
   */
  optimizeFunnel(funnelId: string): {
    recommendations: OptimizationRecommendation[];
    autoAppliedChanges: string[];
  } {
    const funnel = this.funnels.get(funnelId);
    const performance = this.performance.get(funnelId);
    
    if (!funnel || !performance) {
      return { recommendations: [], autoAppliedChanges: [] };
    }

    const recommendations: OptimizationRecommendation[] = [];
    const autoAppliedChanges: string[] = [];

    // Analyze A/B test results
    for (const page of funnel.pages) {
      for (const testId of page.abTests) {
        const analysis = this.abTestingFramework.analyzeTest(testId);
        if (analysis?.isSignificant && analysis.recommendedAction === 'declare_winner') {
          recommendations.push({
            type: 'ab_test_winner',
            priority: 'high',
            description: `Declare winner for test ${testId}`,
            impact: 'conversion_rate',
            estimatedLift: analysis.pValue * 100
          });
        }
      }
    }

    // Analyze conversion triggers
    const triggerMetrics = this.conversionEngine.getAllMetrics();
    const lowPerformingTriggers = triggerMetrics.filter(m => m.conversionRate < 2);
    
    for (const trigger of lowPerformingTriggers) {
      recommendations.push({
        type: 'conversion_trigger',
        priority: 'medium',
        description: `Optimize or replace low-performing trigger: ${trigger.triggerId}`,
        impact: 'conversion_rate',
        estimatedLift: 5
      });
    }

    // Analyze drop-off points
    const highDropOffPages = performance.dropOffPoints.filter(p => p.dropOffRate > 50);
    for (const dropOff of highDropOffPages) {
      recommendations.push({
        type: 'page_optimization',
        priority: 'high',
        description: `High drop-off rate on ${dropOff.pageName} (${dropOff.dropOffRate}%)`,
        impact: 'conversion_rate',
        estimatedLift: dropOff.dropOffRate * 0.3
      });
    }

    return { recommendations, autoAppliedChanges };
  }

  private initializePerformanceTracking(funnel: FunnelConfig): void {
    const performance: FunnelPerformance = {
      funnelId: funnel.id,
      totalVisitors: 0,
      totalConversions: 0,
      overallConversionRate: 0,
      revenue: 0,
      averageOrderValue: 0,
      pagePerformance: new Map(),
      conversionPath: [],
      dropOffPoints: [],
      topPerformingVariants: [],
      revenueBySource: {}
    };

    this.performance.set(funnel.id, performance);
  }

  private applyPersonalizationRules(funnel: FunnelConfig, page: FunnelPage, context: any): Record<string, any> {
    const personalizedContent: Record<string, any> = {};

    for (const rule of funnel.settings.personalization.rules) {
      if (this.evaluatePersonalizationConditions(rule.conditions, context)) {
        Object.assign(personalizedContent, rule.actions.replaceContent || {});
      }
    }

    return personalizedContent;
  }

  private evaluatePersonalizationConditions(conditions: PersonalizationRule['conditions'], context: any): boolean {
    if (conditions.trafficSource && !conditions.trafficSource.includes(context.trafficSource)) {
      return false;
    }
    if (conditions.location && !conditions.location.includes(context.location)) {
      return false;
    }
    if (conditions.deviceType && !conditions.deviceType.includes(context.deviceType)) {
      return false;
    }
    if (conditions.userSegment && !conditions.userSegment.includes(context.userSegment)) {
      return false;
    }
    return true;
  }

  private trackPageVisit(interaction: any): void {
    const performance = this.performance.get(interaction.funnelId);
    if (!performance) return;

    performance.totalVisitors++;
    
    const pagePerf = performance.pagePerformance.get(interaction.pageId) || {
      visitors: 0,
      uniqueVisitors: 0,
      conversions: 0,
      conversionRate: 0,
      averageTimeOnPage: 0,
      bounceRate: 0,
      trafficSources: {},
      lastUpdated: new Date()
    };

    pagePerf.visitors++;
    if (interaction.context.trafficSource) {
      pagePerf.trafficSources[interaction.context.trafficSource] = 
        (pagePerf.trafficSources[interaction.context.trafficSource] || 0) + 1;
    }

    performance.pagePerformance.set(interaction.pageId, pagePerf);
  }

  private processFormSubmission(interaction: any): void {
    // Track conversion
    const performance = this.performance.get(interaction.funnelId);
    if (performance) {
      performance.totalConversions++;
      performance.overallConversionRate = (performance.totalConversions / performance.totalVisitors) * 100;
    }

    // Trigger follow-up sequences
    this.sequenceSystem.processTriggerEvent({
      type: 'form_submission',
      contactId: interaction.userId,
      data: interaction.data
    });
  }

  private processPurchase(interaction: any): void {
    const performance = this.performance.get(interaction.funnelId);
    if (performance && interaction.data?.amount) {
      performance.revenue += interaction.data.amount;
      performance.averageOrderValue = performance.revenue / performance.totalConversions;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export interface OptimizationRecommendation {
  type: 'ab_test_winner' | 'conversion_trigger' | 'page_optimization' | 'pricing_rule' | 'sequence_optimization';
  priority: 'low' | 'medium' | 'high';
  description: string;
  impact: 'conversion_rate' | 'revenue' | 'engagement' | 'retention';
  estimatedLift: number; // Percentage improvement
}

export default FunctionalFunnelArchitecture;