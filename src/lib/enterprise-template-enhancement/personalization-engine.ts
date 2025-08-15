/**
 * Personalization Engine
 * 
 * Comprehensive personalization system that creates dynamic, user-specific experiences
 * based on traffic source, location, previous interactions, and user behavior.
 * 
 * Features:
 * - Traffic source and location-based personalization
 * - Dynamic text replacement and conditional content blocks
 * - User preference memory and experience customization
 * - Relevant testimonial and case study display
 * - Call-to-action optimization with dynamic text, colors, and placement
 */

import { DynamicContentManager } from './dynamic-content-manager';
import { UserPreferenceManager } from './user-preference-manager';
import TestimonialManager from './testimonial-manager';
import CtaOptimizer from './cta-optimizer';
import type { Component } from '../types';
import type {
  DynamicContentConfig,
  PersonalizationConfig,
  PersonalizationRule,
  UserSegment,
  ContentVariation,
  PersonalizationCondition,
  PersonalizationAction
} from './types';

/**
 * User Context Interface
 */
export interface UserContext {
  trafficSource?: string;
  location?: {
    country: string;
    region?: string;
    city?: string;
    timezone?: string;
  };
  device?: {
    type: 'mobile' | 'tablet' | 'desktop';
    os?: string;
    browser?: string;
  };
  previousInteractions?: {
    visitCount: number;
    lastVisit?: Date;
    pagesViewed: string[];
    actionsCompleted: string[];
    timeSpent: number;
  };
  preferences?: Record<string, any>;
  segment?: string;
  customAttributes?: Record<string, any>;
}

/**
 * Personalization Result Interface
 */
export interface PersonalizationResult {
  success: boolean;
  appliedRules: string[];
  contentChanges: ContentChange[];
  errors: string[];
  metadata: {
    processingTime: number;
    userSegment: string;
    confidence: number;
  };
}

/**
 * Content Change Interface
 */
export interface ContentChange {
  componentId: string;
  changeType: 'text' | 'image' | 'style' | 'visibility' | 'cta';
  originalValue: any;
  newValue: any;
  reason: string;
}

/**
 * Enhanced Personalization Engine
 */
export class PersonalizationEngine {
  private dynamicContentManager: DynamicContentManager;
  private userPreferenceManager: UserPreferenceManager;
  private personalizationRules: PersonalizationRule[] = [];
  private userSegments: UserSegment[] = [];
  private contentVariations: Map<string, ContentVariation[]> = new Map();

  constructor() {
    this.dynamicContentManager = new DynamicContentManager();
    this.userPreferenceManager = new UserPreferenceManager();
    this.initializeDefaultRules();
    this.initializeUserSegments();
  }

  /**
   * Creates a comprehensive personalization system based on user context
   * Requirement 7.1: Personalize content based on traffic source, location, or previous interactions
   */
  async createPersonalizedSystem(
    component: Component,
    userContext: UserContext
  ): Promise<PersonalizationResult> {
    const startTime = Date.now();
    const result: PersonalizationResult = {
      success: true,
      appliedRules: [],
      contentChanges: [],
      errors: [],
      metadata: {
        processingTime: 0,
        userSegment: this.determineUserSegment(userContext),
        confidence: 0
      }
    };

    try {
      // Determine user segment
      const userSegment = this.determineUserSegment(userContext);
      result.metadata.userSegment = userSegment;

      // Apply personalization rules
      const applicableRules = this.findApplicableRules(userContext);

      for (const rule of applicableRules) {
        try {
          const changes = await this.applyPersonalizationRule(component, rule, userContext);
          result.contentChanges.push(...changes);
          result.appliedRules.push(rule.id);
        } catch (error) {
          result.errors.push(`Failed to apply rule ${rule.id}: ${error}`);
        }
      }

      // Calculate confidence based on available data
      result.metadata.confidence = this.calculatePersonalizationConfidence(userContext);

    } catch (error) {
      result.success = false;
      result.errors.push(`Personalization failed: ${error}`);
    }

    result.metadata.processingTime = Date.now() - startTime;
    return result;
  }

  /**
   * Builds dynamic text replacement and conditional content block system
   * Requirement 7.2: Support dynamic text replacement and conditional content blocks
   */
  async buildDynamicTextReplacementSystem(
    component: Component,
    userContext: UserContext
  ): Promise<DynamicContentConfig> {
    const dynamicConfig = await this.dynamicContentManager.createDynamicContent(component);

    // Add dynamic text replacement rules
    const textReplacements = this.generateTextReplacements(userContext);

    for (const [placeholder, replacement] of Array.from(textReplacements.entries())) {
      await this.dynamicContentManager.addConditionalRule(
        dynamicConfig,
        `true`, // Always apply text replacements
        this.replaceTextPlaceholders(JSON.stringify(component.content), placeholder, replacement),
        100
      );
    }

    // Add conditional content blocks
    const conditionalBlocks = this.generateConditionalContentBlocks(userContext);

    for (const block of conditionalBlocks) {
      await this.dynamicContentManager.addConditionalRule(
        dynamicConfig,
        block.condition,
        block.content,
        block.priority
      );
    }

    return dynamicConfig;
  }

  /**
   * Implements user preference memory and experience customization
   * Requirement 7.3: Remember preferences and customize experience accordingly
   */
  async implementUserPreferenceMemory(userContext: UserContext): Promise<void> {
    // Store user preferences
    if (userContext.preferences) {
      for (const [key, value] of Object.entries(userContext.preferences)) {
        this.userPreferenceManager.setPreference(key, value);
      }
    }

    // Store interaction history
    if (userContext.previousInteractions) {
      this.userPreferenceManager.setPreference('interaction_history', userContext.previousInteractions);
    }

    // Store user segment
    if (userContext.segment) {
      this.userPreferenceManager.setPreference('user_segment', userContext.segment);
    }

    // Apply experience customizations based on stored preferences
    await this.applyExperienceCustomizations();
  }

  /**
   * Creates relevant testimonial and case study display system
   * Requirement 7.4: Display relevant examples based on user characteristics
   */
  async createRelevantTestimonialSystem(
    component: Component,
    userContext: UserContext
  ): Promise<DynamicContentConfig> {
    const userCharacteristics = this.extractUserCharacteristics(userContext);

    // Get relevant testimonials
    const testimonials = TestimonialManager.getTestimonials(userCharacteristics);

    // Create dynamic content configuration for testimonials
    const testimonialConfig = await this.dynamicContentManager.createDynamicContent(component);

    if (testimonials.length > 0) {
      // Sort testimonials by relevance
      const sortedTestimonials = this.sortTestimonialsByRelevance(testimonials, userContext);

      // Create testimonial variations for different contexts
      const testimonialVariations = this.createTestimonialVariations(sortedTestimonials, userContext);

      for (const variation of testimonialVariations) {
        await this.dynamicContentManager.addConditionalRule(
          testimonialConfig,
          variation.condition,
          variation.content,
          variation.priority
        );
      }
    }

    return testimonialConfig;
  }

  /**
   * Builds call-to-action optimization system
   * Requirement 7.5: Optimize button text, colors, and placement based on user behavior
   */
  async buildCtaOptimizationSystem(
    component: Component,
    userContext: UserContext
  ): Promise<DynamicContentConfig> {
    const ctaConfig = await this.dynamicContentManager.createDynamicContent(component);

    // Generate CTA variations based on user context
    const ctaVariations = this.generateCtaVariations(userContext);

    for (const variation of ctaVariations) {
      await this.dynamicContentManager.addConditionalRule(
        ctaConfig,
        variation.condition,
        this.generateCtaHtml(variation),
        variation.priority
      );
    }

    return ctaConfig;
  }

  /**
   * Initialize default personalization rules
   */
  private initializeDefaultRules(): void {
    this.personalizationRules = [
      // Traffic source rules
      {
        id: 'traffic-google-ads',
        name: 'Google Ads Traffic',
        description: 'Personalization for Google Ads traffic',
        targetComponents: ['hero', 'cta', 'header'],
        conditions: [
          { type: 'traffic_source', operator: 'equals', value: 'google-ads' }
        ],
        actions: [
          { type: 'replace_content', target: 'headline', value: 'Special Offer for Google Visitors!' },
          { type: 'modify_style', target: 'cta-button', value: { backgroundColor: '#4285f4' } }
        ],
        priority: 10,
        active: true
      },
      {
        id: 'traffic-social-media',
        name: 'Social Media Traffic',
        description: 'Personalization for social media traffic',
        targetComponents: ['hero', 'testimonials', 'cta'],
        conditions: [
          { type: 'traffic_source', operator: 'in', value: ['facebook', 'twitter', 'linkedin', 'instagram'] }
        ],
        actions: [
          { type: 'replace_content', target: 'headline', value: 'Thanks for visiting from social media!' },
          { type: 'show_content', target: 'social-proof', value: 'social-testimonials' }
        ],
        priority: 8,
        active: true
      },
      // Location-based rules
      {
        id: 'location-us',
        name: 'US Visitors',
        description: 'Personalization for US visitors',
        targetComponents: ['pricing', 'footer', 'cta'],
        conditions: [
          { type: 'location', operator: 'equals', value: 'US' }
        ],
        actions: [
          { type: 'replace_content', target: 'pricing', value: 'Starting at $29/month' },
          { type: 'show_content', target: 'shipping-info', value: 'Free shipping across the US!' }
        ],
        priority: 5,
        active: true
      },
      // Returning visitor rules
      {
        id: 'returning-visitor',
        name: 'Returning Visitors',
        description: 'Personalization for returning visitors',
        targetComponents: ['hero', 'header', 'features'],
        conditions: [
          { type: 'previous_visit', operator: 'greater_than', value: 1 }
        ],
        actions: [
          { type: 'replace_content', target: 'headline', value: 'Welcome back! Here\'s what\'s new.' },
          { type: 'show_content', target: 'continue-section', value: 'continue-where-left-off' }
        ],
        priority: 15,
        active: true
      },
      // Device-based rules
      {
        id: 'mobile-optimization',
        name: 'Mobile Optimization',
        description: 'Personalization for mobile users',
        targetComponents: ['cta', 'hero', 'features'],
        conditions: [
          { type: 'device', operator: 'equals', value: 'mobile' }
        ],
        actions: [
          { type: 'modify_style', target: 'cta-button', value: { fontSize: '18px', padding: '15px 30px' } },
          { type: 'replace_content', target: 'cta-text', value: 'Tap to Get Started' }
        ],
        priority: 12,
        active: true
      }
    ];
  }

  /**
   * Initialize user segments
   */
  private initializeUserSegments(): void {
    this.userSegments = [
      {
        id: 'enterprise',
        name: 'Enterprise Users',
        description: 'Large business users',
        criteria: [
          { field: 'company_size', operator: 'greater_than', value: 100 },
          { field: 'traffic_source', operator: 'contains', value: 'enterprise' }
        ],
        size: 0,
        lastUpdated: new Date()
      },
      {
        id: 'startup',
        name: 'Startup Users',
        description: 'Early-stage startup users',
        criteria: [
          { field: 'company_size', operator: 'less_than', value: 50 },
          { field: 'traffic_source', operator: 'in', value: ['startup', 'ycombinator', 'producthunt'] }
        ],
        size: 0,
        lastUpdated: new Date()
      },
      {
        id: 'freelancer',
        name: 'Freelancers',
        description: 'Independent professionals',
        criteria: [
          { field: 'job_title', operator: 'contains', value: 'freelancer' },
          { field: 'company_size', operator: 'equals', value: 1 }
        ],
        size: 0,
        lastUpdated: new Date()
      }
    ];
  }

  /**
   * Determine user segment based on context
   */
  private determineUserSegment(userContext: UserContext): string {
    for (const segment of this.userSegments) {
      if (this.matchesSegmentCriteria(userContext, segment.criteria)) {
        return segment.id;
      }
    }
    return 'general';
  }

  /**
   * Check if user context matches segment criteria
   */
  private matchesSegmentCriteria(userContext: UserContext, criteria: any[]): boolean {
    return criteria.every(criterion => {
      const value = this.getContextValue(userContext, criterion.field);
      return this.evaluateCondition(value, criterion.operator, criterion.value);
    });
  }

  /**
   * Get value from user context by field path
   */
  private getContextValue(userContext: UserContext, field: string): any {
    const parts = field.split('.');
    let value: any = userContext;

    for (const part of parts) {
      value = value?.[part];
    }

    return value;
  }

  /**
   * Evaluate condition
   */
  private evaluateCondition(value: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals':
        return value === expected;
      case 'not_equals':
        return value !== expected;
      case 'contains':
        return typeof value === 'string' && value.includes(expected);
      case 'in':
        return Array.isArray(expected) && expected.includes(value);
      case 'not_in':
        return Array.isArray(expected) && !expected.includes(value);
      case 'greater_than':
        return typeof value === 'number' && value > expected;
      case 'less_than':
        return typeof value === 'number' && value < expected;
      default:
        return false;
    }
  }

  /**
   * Find applicable personalization rules
   */
  private findApplicableRules(userContext: UserContext): PersonalizationRule[] {
    return this.personalizationRules
      .filter(rule => rule.active)
      .filter(rule => this.ruleApplies(rule, userContext))
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Check if rule applies to user context
   */
  private ruleApplies(rule: PersonalizationRule, userContext: UserContext): boolean {
    return rule.conditions.every(condition => {
      const value = this.getPersonalizationValue(userContext, condition.type);
      return this.evaluateCondition(value, condition.operator, condition.value);
    });
  }

  /**
   * Get personalization value from user context
   */
  private getPersonalizationValue(userContext: UserContext, type: string): any {
    switch (type) {
      case 'traffic_source':
        return userContext.trafficSource;
      case 'location':
        return userContext.location?.country;
      case 'device':
        return userContext.device?.type;
      case 'previous_visit':
        return userContext.previousInteractions?.visitCount || 0;
      case 'user_segment':
        return userContext.segment;
      default:
        return userContext.customAttributes?.[type];
    }
  }

  /**
   * Apply personalization rule to component
   */
  private async applyPersonalizationRule(
    component: Component,
    rule: PersonalizationRule,
    userContext: UserContext
  ): Promise<ContentChange[]> {
    const changes: ContentChange[] = [];

    for (const action of rule.actions) {
      const change = await this.applyPersonalizationAction(component, action, userContext);
      if (change) {
        changes.push(change);
      }
    }

    return changes;
  }

  /**
   * Apply personalization action
   */
  private async applyPersonalizationAction(
    component: Component,
    action: PersonalizationAction,
    userContext: UserContext
  ): Promise<ContentChange | null> {
    const originalValue = this.getComponentValue(component, action.target);

    switch (action.type) {
      case 'replace_content':
        return {
          componentId: component.id ? component.id.toString() : 'unknown',
          changeType: 'text',
          originalValue,
          newValue: action.value,
          reason: 'Personalization rule applied'
        };
      case 'modify_style':
        return {
          componentId: component.id ? component.id.toString() : 'unknown',
          changeType: 'style',
          originalValue: component.styles || {},
          newValue: { ...component.styles, ...action.value },
          reason: 'Style personalization applied'
        };
      case 'show_content':
      case 'hide_content':
        return {
          componentId: component.id ? component.id.toString() : 'unknown',
          changeType: 'visibility',
          originalValue: true,
          newValue: action.type === 'show_content',
          reason: 'Visibility personalization applied'
        };
      default:
        return null;
    }
  }

  /**
   * Get component value by target
   */
  private getComponentValue(component: Component, target: string): any {
    switch (target) {
      case 'headline':
      case 'title':
        return component.content.title || component.content.text;
      case 'cta-text':
        return component.content.text;
      case 'pricing':
        return component.content.plans?.[0]?.price;
      default:
        return component.content[target as keyof typeof component.content];
    }
  }

  /**
   * Generate text replacements based on user context
   */
  private generateTextReplacements(userContext: UserContext): Map<string, string> {
    const replacements = new Map<string, string>();

    // Location-based replacements
    if (userContext.location?.country) {
      replacements.set('{{country}}', userContext.location.country);
      replacements.set('{{currency}}', this.getCurrencyForCountry(userContext.location.country));
    }

    // Traffic source replacements
    if (userContext.trafficSource) {
      replacements.set('{{traffic_source}}', userContext.trafficSource);
    }

    // Time-based replacements
    const now = new Date();
    replacements.set('{{current_year}}', now.getFullYear().toString());
    replacements.set('{{current_month}}', now.toLocaleString('default', { month: 'long' }));

    // User segment replacements
    const segment = this.determineUserSegment(userContext);
    replacements.set('{{user_segment}}', segment);

    return replacements;
  }

  /**
   * Generate conditional content blocks
   */
  private generateConditionalContentBlocks(userContext: UserContext): Array<{
    condition: string;
    content: string;
    priority: number;
  }> {
    const blocks = [];

    // Returning visitor block
    if (userContext.previousInteractions?.visitCount && userContext.previousInteractions.visitCount > 1) {
      blocks.push({
        condition: 'localStorage.getItem("returning_visitor") === "true"',
        content: '<div class="welcome-back-banner">Welcome back! Continue where you left off.</div>',
        priority: 20
      });
    }

    // Location-specific blocks
    if (userContext.location?.country === 'US') {
      blocks.push({
        condition: 'true',
        content: '<div class="us-shipping">🚚 Free shipping across the United States!</div>',
        priority: 10
      });
    }

    // Mobile-specific blocks
    blocks.push({
      condition: 'window.innerWidth <= 768',
      content: '<div class="mobile-optimized">📱 Optimized for mobile experience</div>',
      priority: 5
    });

    return blocks;
  }

  /**
   * Replace text placeholders
   */
  private replaceTextPlaceholders(text: string, placeholder: string, replacement: string): string {
    return text.replace(new RegExp(placeholder, 'g'), replacement);
  }

  /**
   * Apply experience customizations
   */
  private async applyExperienceCustomizations(): Promise<void> {
    const theme = this.userPreferenceManager.getPreference('theme');
    const language = this.userPreferenceManager.getPreference('language');
    const fontSize = this.userPreferenceManager.getPreference('fontSize');

    // Only apply DOM changes in browser environment
    if (typeof document !== 'undefined') {
      // Apply theme
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      }

      // Apply language
      if (language) {
        document.documentElement.setAttribute('lang', language);
      }

      // Apply font size
      if (fontSize) {
        document.documentElement.style.fontSize = fontSize;
      }
    }
  }

  /**
   * Extract user characteristics for testimonial matching
   */
  private extractUserCharacteristics(userContext: UserContext): Record<string, string> {
    const characteristics: Record<string, string> = {};

    // Map user segment to industry
    const segment = this.determineUserSegment(userContext);
    switch (segment) {
      case 'enterprise':
        characteristics.industry = 'tech';
        break;
      case 'startup':
        characteristics.industry = 'tech';
        break;
      case 'freelancer':
        characteristics.industry = 'freelance';
        break;
    }

    // Add location if available
    if (userContext.location?.country) {
      characteristics.location = userContext.location.country;
    }

    return characteristics;
  }

  /**
   * Sort testimonials by relevance
   */
  private sortTestimonialsByRelevance(testimonials: any[], userContext: UserContext): any[] {
    const userSegment = this.determineUserSegment(userContext);

    return testimonials.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Boost score for matching tags
      if (a.tags.includes(userSegment)) scoreA += 10;
      if (b.tags.includes(userSegment)) scoreB += 10;

      // Boost score for matching industry
      const userIndustry = this.extractUserCharacteristics(userContext).industry;
      if (a.industry === userIndustry) scoreA += 5;
      if (b.industry === userIndustry) scoreB += 5;

      return scoreB - scoreA;
    });
  }

  /**
   * Create testimonial variations
   */
  private createTestimonialVariations(testimonials: any[], userContext: UserContext): Array<{
    condition: string;
    content: string;
    priority: number;
  }> {
    const variations = [];
    const userSegment = this.determineUserSegment(userContext);

    // Create segment-specific variations
    const segmentTestimonials = testimonials.filter(t => t.tags.includes(userSegment));
    if (segmentTestimonials.length > 0) {
      variations.push({
        condition: `userSegment === "${userSegment}"`,
        content: this.formatTestimonialContent(segmentTestimonials.slice(0, 3)),
        priority: 20
      });
    }

    // Create general variations
    variations.push({
      condition: 'true',
      content: this.formatTestimonialContent(testimonials.slice(0, 3)),
      priority: 10
    });

    return variations;
  }

  /**
   * Format testimonial content
   */
  private formatTestimonialContent(testimonials: any[]): string {
    return testimonials.map(t => `
      <div class="testimonial">
        <blockquote>"${t.content}"</blockquote>
        <cite>— ${t.author}, ${t.company}</cite>
      </div>
    `).join('');
  }

  /**
   * Generate CTA variations
   */
  private generateCtaVariations(userContext: UserContext): Array<{
    condition: string;
    text: string;
    color: string;
    style: Record<string, string>;
    priority: number;
  }> {
    const variations = [];
    const userSegment = this.determineUserSegment(userContext);

    // Segment-specific CTA variations
    switch (userSegment) {
      case 'enterprise':
        variations.push({
          condition: `userSegment === "enterprise"`,
          text: 'Request Enterprise Demo',
          color: '#1a365d',
          style: { fontSize: '16px', fontWeight: 'bold', padding: '12px 24px' },
          priority: 20
        });
        break;
      case 'startup':
        variations.push({
          condition: `userSegment === "startup"`,
          text: 'Start Free Trial',
          color: '#38a169',
          style: { fontSize: '16px', fontWeight: 'bold', padding: '12px 24px' },
          priority: 20
        });
        break;
      case 'freelancer':
        variations.push({
          condition: `userSegment === "freelancer"`,
          text: 'Try Free for 30 Days',
          color: '#d69e2e',
          style: { fontSize: '16px', fontWeight: 'bold', padding: '12px 24px' },
          priority: 20
        });
        break;
    }

    // Device-specific variations
    if (userContext.device?.type === 'mobile') {
      variations.push({
        condition: 'window.innerWidth <= 768',
        text: 'Tap to Start',
        color: '#4299e1',
        style: { fontSize: '18px', padding: '15px 30px', width: '100%' },
        priority: 15
      });
    }

    // Traffic source variations
    if (userContext.trafficSource === 'google-ads') {
      variations.push({
        condition: `trafficSource === "google-ads"`,
        text: 'Claim Special Offer',
        color: '#e53e3e',
        style: { fontSize: '16px', fontWeight: 'bold', padding: '12px 24px', animation: 'pulse 2s infinite' },
        priority: 25
      });
    }

    // Default variation
    variations.push({
      condition: 'true',
      text: 'Get Started',
      color: '#4299e1',
      style: { fontSize: '16px', padding: '12px 24px' },
      priority: 5
    });

    return variations;
  }

  /**
   * Generate CTA HTML
   */
  private generateCtaHtml(variation: any): string {
    const styleString = Object.entries(variation.style)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');

    return `<button class="cta-button" style="background-color: ${variation.color}; ${styleString}">${variation.text}</button>`;
  }

  /**
   * Calculate personalization confidence
   */
  private calculatePersonalizationConfidence(userContext: UserContext): number {
    let confidence = 0;

    // Traffic source adds confidence
    if (userContext.trafficSource) confidence += 20;

    // Location adds confidence
    if (userContext.location?.country) confidence += 15;

    // Previous interactions add significant confidence
    if (userContext.previousInteractions?.visitCount && userContext.previousInteractions.visitCount > 1) {
      confidence += 30;
    }

    // Device info adds confidence
    if (userContext.device?.type) confidence += 10;

    // Preferences add confidence
    if (userContext.preferences && Object.keys(userContext.preferences).length > 0) {
      confidence += 25;
    }

    return Math.min(confidence, 100);
  }

  /**
   * Get currency for country
   */
  private getCurrencyForCountry(country: string): string {
    const currencyMap: Record<string, string> = {
      'US': 'USD',
      'UK': 'GBP',
      'CA': 'CAD',
      'AU': 'AUD',
      'DE': 'EUR',
      'FR': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR',
      'JP': 'JPY',
      'CN': 'CNY'
    };

    return currencyMap[country] || 'USD';
  }

  /**
   * Generate personalization script for client-side execution
   */
  generatePersonalizationScript(userContext: UserContext): string {
    return `
      // Personalization Engine Client Script
      class ClientPersonalizationEngine {
        constructor() {
          this.userContext = ${JSON.stringify(userContext)};
          this.init();
        }

        init() {
          this.detectUserContext();
          this.applyPersonalization();
          this.trackPersonalizationEvents();
        }

        detectUserContext() {
          // Enhance user context with client-side data
          this.userContext.device = {
            type: window.innerWidth <= 768 ? 'mobile' : window.innerWidth <= 1024 ? 'tablet' : 'desktop',
            os: this.detectOS(),
            browser: this.detectBrowser()
          };

          this.userContext.location = {
            ...this.userContext.location,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          };

          // Check for returning visitor
          const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
          localStorage.setItem('visit_count', visitCount.toString());
          
          this.userContext.previousInteractions = {
            visitCount,
            lastVisit: localStorage.getItem('last_visit') ? new Date(localStorage.getItem('last_visit')) : undefined,
            pagesViewed: JSON.parse(localStorage.getItem('pages_viewed') || '[]'),
            actionsCompleted: JSON.parse(localStorage.getItem('actions_completed') || '[]'),
            timeSpent: parseInt(localStorage.getItem('total_time_spent') || '0')
          };

          localStorage.setItem('last_visit', new Date().toISOString());
        }

        applyPersonalization() {
          // Apply dynamic text replacements
          this.applyTextReplacements();
          
          // Apply conditional content blocks
          this.applyConditionalContent();
          
          // Apply CTA optimizations
          this.applyCtaOptimizations();
          
          // Apply testimonial personalization
          this.applyTestimonialPersonalization();
        }

        applyTextReplacements() {
          const replacements = this.generateTextReplacements();
          
          document.querySelectorAll('[data-personalize="text"]').forEach(element => {
            let content = element.textContent;
            replacements.forEach((value, key) => {
              content = content.replace(new RegExp(key, 'g'), value);
            });
            element.textContent = content;
          });
        }

        applyConditionalContent() {
          document.querySelectorAll('[data-personalize="conditional"]').forEach(element => {
            const condition = element.getAttribute('data-condition');
            const content = element.getAttribute('data-content');
            
            if (this.evaluateCondition(condition)) {
              element.innerHTML = content;
              element.style.display = 'block';
            } else {
              element.style.display = 'none';
            }
          });
        }

        applyCtaOptimizations() {
          const ctaVariations = this.generateCtaVariations();
          
          document.querySelectorAll('[data-personalize="cta"]').forEach(element => {
            const applicableVariation = ctaVariations.find(v => this.evaluateCondition(v.condition));
            
            if (applicableVariation) {
              element.textContent = applicableVariation.text;
              element.style.backgroundColor = applicableVariation.color;
              Object.assign(element.style, applicableVariation.style);
            }
          });
        }

        applyTestimonialPersonalization() {
          const userSegment = this.determineUserSegment();
          
          document.querySelectorAll('[data-personalize="testimonial"]').forEach(element => {
            const testimonials = JSON.parse(element.getAttribute('data-testimonials') || '[]');
            const relevantTestimonials = testimonials.filter(t => t.tags.includes(userSegment));
            
            if (relevantTestimonials.length > 0) {
              element.innerHTML = this.formatTestimonials(relevantTestimonials.slice(0, 3));
            }
          });
        }

        generateTextReplacements() {
          const replacements = new Map();
          
          if (this.userContext.location?.country) {
            replacements.set('{{country}}', this.userContext.location.country);
          }
          
          if (this.userContext.trafficSource) {
            replacements.set('{{traffic_source}}', this.userContext.trafficSource);
          }
          
          replacements.set('{{current_year}}', new Date().getFullYear().toString());
          
          return replacements;
        }

        generateCtaVariations() {
          const userSegment = this.determineUserSegment();
          const variations = [];

          switch (userSegment) {
            case 'enterprise':
              variations.push({
                condition: 'true',
                text: 'Request Enterprise Demo',
                color: '#1a365d',
                style: { fontSize: '16px', fontWeight: 'bold' }
              });
              break;
            case 'startup':
              variations.push({
                condition: 'true',
                text: 'Start Free Trial',
                color: '#38a169',
                style: { fontSize: '16px', fontWeight: 'bold' }
              });
              break;
            default:
              variations.push({
                condition: 'true',
                text: 'Get Started',
                color: '#4299e1',
                style: { fontSize: '16px' }
              });
          }

          return variations;
        }

        determineUserSegment() {
          if (this.userContext.trafficSource?.includes('enterprise')) return 'enterprise';
          if (this.userContext.trafficSource?.includes('startup')) return 'startup';
          if (this.userContext.trafficSource?.includes('freelancer')) return 'freelancer';
          return 'general';
        }

        evaluateCondition(condition) {
          try {
            return new Function('userContext', 'window', 'document', 'localStorage', \`return \${condition}\`)(
              this.userContext, window, document, localStorage
            );
          } catch (error) {
            console.warn('Error evaluating personalization condition:', condition, error);
            return false;
          }
        }

        formatTestimonials(testimonials) {
          return testimonials.map(t => \`
            <div class="testimonial">
              <blockquote>"\${t.content}"</blockquote>
              <cite>— \${t.author}, \${t.company}</cite>
            </div>
          \`).join('');
        }

        trackPersonalizationEvents() {
          // Track personalization effectiveness
          const personalizedElements = document.querySelectorAll('[data-personalize]');
          
          personalizedElements.forEach(element => {
            element.addEventListener('click', () => {
              this.trackEvent('personalization_interaction', {
                element_type: element.getAttribute('data-personalize'),
                user_segment: this.determineUserSegment(),
                traffic_source: this.userContext.trafficSource
              });
            });
          });
        }

        trackEvent(eventName, properties) {
          // Send tracking event to analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
          }
          
          // Store in local storage for later sync
          const events = JSON.parse(localStorage.getItem('personalization_events') || '[]');
          events.push({ event: eventName, properties, timestamp: Date.now() });
          localStorage.setItem('personalization_events', JSON.stringify(events));
        }

        detectOS() {
          const userAgent = navigator.userAgent;
          if (userAgent.includes('Windows')) return 'Windows';
          if (userAgent.includes('Mac')) return 'macOS';
          if (userAgent.includes('Linux')) return 'Linux';
          if (userAgent.includes('Android')) return 'Android';
          if (userAgent.includes('iOS')) return 'iOS';
          return 'Unknown';
        }

        detectBrowser() {
          const userAgent = navigator.userAgent;
          if (userAgent.includes('Chrome')) return 'Chrome';
          if (userAgent.includes('Firefox')) return 'Firefox';
          if (userAgent.includes('Safari')) return 'Safari';
          if (userAgent.includes('Edge')) return 'Edge';
          return 'Unknown';
        }
      }

      // Initialize personalization engine
      document.addEventListener('DOMContentLoaded', () => {
        new ClientPersonalizationEngine();
      });
    `;
  }
}

export default PersonalizationEngine;
