/**
 * Dynamic Content Manager
 * 
 * Handles real-time content updates, personalization, and dynamic content switching
 * based on user behavior, preferences, and external data sources.
 */

import type { Component } from '../types';
import type { Template } from '../website-templates';
import type { FunnelTemplate } from '../types';
import type {
  DynamicContentConfig,
  ContentRule
} from './types';
import type {
  DynamicContentConfiguration,
  RealTimeConfig
} from './interfaces';

/**
 * Dynamic Content Manager Class
 * 
 * Provides comprehensive dynamic content functionality including:
 * - Real-time content updates
 * - Personalized content delivery
 * - Conditional content display
 * - Content A/B testing
 */
export class DynamicContentManager {
  private contentId = 0;
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private websocketConnections: Map<string, WebSocket> = new Map();

  /**
   * Create dynamic content configuration for a component
   */
  async createDynamicContent(
    content: Component,
    config?: DynamicContentConfiguration
  ): Promise<DynamicContentConfig> {
    const dynamicConfig: DynamicContentConfig = {
      id: `dynamic-content-${++this.contentId}`,
      type: this.determineDynamicContentType(content),
      name: `Dynamic Content for ${content.type}`,
      targetSelector: this.generateSelector(content),
      contentRules: await this.createContentRules(content, config),
      fallbackContent: config?.fallbackContent || this.generateFallbackContent(content),
      updateFrequency: config?.updateTrigger || 'on_load'
    };

    return dynamicConfig;
  }

  /**
   * Add real-time updates to a template
   */
  async addRealTimeUpdates(
    template: Template | FunnelTemplate,
    config?: RealTimeConfig
  ): Promise<Template | FunnelTemplate & { realTimeConfig?: any; realTimeScript?: string }> {
    const enhancedTemplate = {
      ...template,
      // Add real-time configuration as additional properties
      realTimeConfig: {
        enabled: true,
        websocket: config?.websocket || false,
        polling: config?.polling || true,
        interval: config?.interval || 30000, // 30 seconds default
        fallback: config?.fallback !== false,
        endpoints: this.generateUpdateEndpoints(template)
      },
      // Add real-time update script
      realTimeScript: this.generateRealTimeScript(config)
    };

    return enhancedTemplate;
  }

  /**
   * Create personalized content variations
   */
  async createPersonalizedContent(
    content: Component,
    segments: string[]
  ): Promise<DynamicContentConfig> {
    const personalizedConfig: DynamicContentConfig = {
      id: `personalized-content-${++this.contentId}`,
      type: 'component',
      name: `Personalized ${content.type}`,
      targetSelector: this.generateSelector(content),
      contentRules: await this.createPersonalizationRules(content, segments),
      fallbackContent: this.generateFallbackContent(content),
      updateFrequency: 'on_load'
    };

    return personalizedConfig;
  }

  /**
   * Add a conditional rule to a dynamic content configuration.
   */
  async addConditionalRule(
    config: DynamicContentConfig,
    condition: string,
    content: string,
    priority = 100
  ): Promise<DynamicContentConfig> {
    const newRule: ContentRule = {
      id: `rule-custom-${this.contentId++}`,
      condition,
      content,
      priority,
      active: true,
    };

    config.contentRules.push(newRule);
    return config;
  }

  /**
   * Generate content rules based on configuration
   */
  private async createContentRules(
    content: Component,
    config?: DynamicContentConfiguration
  ): Promise<ContentRule[]> {
    const rules: ContentRule[] = [];

    // Default rule for all users
    rules.push({
      id: `rule-default-${this.contentId}`,
      condition: 'true',
      content: this.extractContentFromComponent(content),
      priority: 0,
      active: true
    });

    // Time-based rules
    rules.push({
      id: `rule-time-${this.contentId}`,
      condition: 'new Date().getHours() >= 9 && new Date().getHours() <= 17',
      content: this.createBusinessHoursContent(content),
      priority: 1,
      active: true
    });

    // Location-based rules (if geolocation is available)
    rules.push({
      id: `rule-location-${this.contentId}`,
      condition: 'navigator.geolocation && userLocation.country === "US"',
      content: this.createLocationSpecificContent(content, 'US'),
      priority: 2,
      active: true
    });

    // Device-based rules
    rules.push({
      id: `rule-mobile-${this.contentId}`,
      condition: 'window.innerWidth <= 768',
      content: this.createMobileOptimizedContent(content),
      priority: 3,
      active: true
    });

    // Returning visitor rules
    rules.push({
      id: `rule-returning-${this.contentId}`,
      condition: 'localStorage.getItem("returning_visitor") === "true"',
      content: this.createReturningVisitorContent(content),
      priority: 4,
      active: true
    });

    return rules;
  }

  /**
   * Create personalization rules for different user segments
   */
  private async createPersonalizationRules(
    content: Component,
    segments: string[]
  ): Promise<ContentRule[]> {
    const rules: ContentRule[] = [];

    segments.forEach((segment, index) => {
      rules.push({
        id: `rule-segment-${segment}-${this.contentId}`,
        condition: `userSegment === "${segment}"`,
        content: this.createSegmentSpecificContent(content, segment),
        priority: index + 10, // Higher priority than default rules
        active: true
      });
    });

    return rules;
  }

  /**
   * Generate selector for component
   */
  private generateSelector(component: Component): string {
    // Use component ID if available
    if (component.id) {
      return `[data-component-id="${component.id}"]`;
    }

    // Use component name if available
    if (component.name) {
      return `[data-component-name="${component.name}"]`;
    }

    // Fall back to component type
    return `[data-component-type="${component.type}"]`;
  }

  /**
   * Determine dynamic content type based on component
   */
  private determineDynamicContentType(component: Component): DynamicContentConfig['type'] {
    const typeMap: Record<string, DynamicContentConfig['type']> = {
      'text': 'text',
      'heading': 'text',
      'paragraph': 'text',
      'image': 'image',
      'hero': 'component',
      'card': 'component',
      'testimonial': 'component',
      'pricing': 'component'
    };

    return typeMap[component.type] || 'component';
  }

  /**
   * Extract content from component
   */
  private extractContentFromComponent(component: Component): string {
    if (component.content) {
      return typeof component.content === 'string' ? component.content : JSON.stringify(component.content);
    }

    return `Default content for ${component.type}`;
  }

  /**
   * Generate fallback content
   */
  private generateFallbackContent(component: Component): string {
    const fallbackMap: Record<string, string> = {
      'text': 'Loading content...',
      'heading': 'Welcome',
      'image': '/placeholder-image.jpg',
      'button': 'Click Here',
      'testimonial': 'Great service!',
      'pricing': '$99/month'
    };

    return fallbackMap[component.type] || 'Content loading...';
  }

  /**
   * Create business hours specific content
   */
  private createBusinessHoursContent(component: Component): string {
    const businessHoursContent: Record<string, string> = {
      'text': 'We\'re currently online! Chat with us now.',
      'button': 'Chat Now',
      'testimonial': 'Excellent customer service during business hours!',
      'heading': 'We\'re Here to Help'
    };

    return businessHoursContent[component.type] || this.extractContentFromComponent(component);
  }

  /**
   * Create location-specific content
   */
  private createLocationSpecificContent(component: Component, country: string): string {
    const locationContent: Record<string, Record<string, string>> = {
      'US': {
        'text': 'Free shipping across the United States!',
        'button': 'Order Now - Free US Shipping',
        'pricing': '$99/month (USD)',
        'testimonial': 'Amazing service here in the US!'
      },
      'UK': {
        'text': 'Free delivery throughout the UK!',
        'button': 'Order Now - Free UK Delivery',
        'pricing': '£79/month (GBP)',
        'testimonial': 'Brilliant service here in the UK!'
      }
    };

    return locationContent[country]?.[component.type] || this.extractContentFromComponent(component);
  }

  /**
   * Create mobile-optimized content
   */
  private createMobileOptimizedContent(component: Component): string {
    const mobileContent: Record<string, string> = {
      'text': 'Tap to learn more',
      'button': 'Tap Here',
      'heading': 'Mobile-Friendly Service',
      'testimonial': 'Perfect on mobile!'
    };

    return mobileContent[component.type] || this.extractContentFromComponent(component);
  }

  /**
   * Create returning visitor content
   */
  private createReturningVisitorContent(component: Component): string {
    const returningVisitorContent: Record<string, string> = {
      'text': 'Welcome back! Here\'s what\'s new.',
      'button': 'Continue Where You Left Off',
      'heading': 'Welcome Back!',
      'testimonial': 'I keep coming back because the service is excellent!'
    };

    return returningVisitorContent[component.type] || this.extractContentFromComponent(component);
  }

  /**
   * Create segment-specific content
   */
  private createSegmentSpecificContent(component: Component, segment: string): string {
    const segmentContent: Record<string, Record<string, string>> = {
      'enterprise': {
        'text': 'Enterprise-grade solutions for your business',
        'button': 'Request Enterprise Demo',
        'pricing': 'Custom Enterprise Pricing',
        'testimonial': 'Scaled our business operations perfectly!'
      },
      'startup': {
        'text': 'Perfect for growing startups',
        'button': 'Start Your Free Trial',
        'pricing': '$29/month - Startup Special',
        'testimonial': 'Helped us launch faster than expected!'
      },
      'freelancer': {
        'text': 'Built for independent professionals',
        'button': 'Try Free for 30 Days',
        'pricing': '$19/month - Freelancer Plan',
        'testimonial': 'Perfect for my freelance business!'
      }
    };

    return segmentContent[segment]?.[component.type] || this.extractContentFromComponent(component);
  }

  /**
   * Generate update endpoints for real-time content
   */
  private generateUpdateEndpoints(template: Template | FunnelTemplate): string[] {
    const endpoints = [
      '/api/content/dynamic',
      '/api/content/personalized',
      '/api/content/real-time'
    ];

    // Add template-specific endpoints - check if it's a FunnelTemplate by checking for unique properties
    if ('purpose' in template && 'targetAudience' in template && 'conversionStrategy' in template) {
      endpoints.push('/api/funnel/conversion-data');
    }

    return endpoints;
  }

  /**
   * Generate real-time update script
   */
  private generateRealTimeScript(config?: RealTimeConfig): string {
    return `
      // Real-time content update system
      class RealTimeContentManager {
        constructor() {
          this.config = ${JSON.stringify(config || {})};
          this.updateInterval = null;
          this.websocket = null;
          this.init();
        }

        init() {
          if (this.config.websocket) {
            this.initWebSocket();
          } else if (this.config.polling) {
            this.initPolling();
          }
        }

        initWebSocket() {
          try {
            this.websocket = new WebSocket('wss://your-domain.com/ws/content');
            
            this.websocket.onmessage = (event) => {
              const data = JSON.parse(event.data);
              this.updateContent(data);
            };

            this.websocket.onerror = () => {
              if (this.config.fallback) {
                this.initPolling();
              }
            };
          } catch (error) {
            if (this.config.fallback) {
              this.initPolling();
            }
          }
        }

        initPolling() {
          this.updateInterval = setInterval(() => {
            this.fetchUpdates();
          }, this.config.interval || 30000);
        }

        async fetchUpdates() {
          try {
            const response = await fetch('/api/content/updates');
            const data = await response.json();
            this.updateContent(data);
          } catch (error) {
            console.warn('Failed to fetch content updates:', error);
          }
        }

        updateContent(data) {
          data.updates?.forEach(update => {
            const elements = document.querySelectorAll(update.selector);
            elements.forEach(element => {
              if (update.type === 'text') {
                element.textContent = update.content;
              } else if (update.type === 'html') {
                element.innerHTML = update.content;
              } else if (update.type === 'attribute') {
                element.setAttribute(update.attribute, update.content);
              }
            });
          });
        }

        destroy() {
          if (this.updateInterval) {
            clearInterval(this.updateInterval);
          }
          if (this.websocket) {
            this.websocket.close();
          }
        }
      }

      // Initialize real-time content manager
      const realTimeManager = new RealTimeContentManager();

      // Cleanup on page unload
      window.addEventListener('beforeunload', () => {
        realTimeManager.destroy();
      });
    `;
  }

  /**
   * Generate content evaluation script
   */
  generateContentEvaluationScript(configs: DynamicContentConfig[]): string {
    return `
      // Dynamic content evaluation system
      class DynamicContentEvaluator {
        constructor() {
          this.configs = ${JSON.stringify(configs)};
          this.userSegment = this.detectUserSegment();
          this.userLocation = this.detectUserLocation();
          this.init();
        }

        init() {
          this.configs.forEach(config => {
            this.evaluateContent(config);
          });
        }

        evaluateContent(config) {
          const elements = document.querySelectorAll(config.targetSelector);
          
          elements.forEach(element => {
            const applicableRule = this.findApplicableRule(config.contentRules);
            
            if (applicableRule) {
              this.applyContent(element, applicableRule.content, config.type);
            } else {
              this.applyContent(element, config.fallbackContent, config.type);
            }
          });
        }

        findApplicableRule(rules) {
          // Sort rules by priority (highest first)
          const sortedRules = rules
            .filter(rule => rule.active)
            .sort((a, b) => b.priority - a.priority);

          for (const rule of sortedRules) {
            try {
              if (this.evaluateCondition(rule.condition)) {
                return rule;
              }
            } catch (error) {
              console.warn('Error evaluating rule condition:', rule.condition, error);
            }
          }

          return null;
        }

        evaluateCondition(condition) {
          // Create a safe evaluation context
          const context = {
            userSegment: this.userSegment,
            userLocation: this.userLocation,
            Date: Date,
            navigator: navigator,
            window: window,
            localStorage: localStorage,
            sessionStorage: sessionStorage
          };

          // Use Function constructor for safer evaluation
          const func = new Function(...Object.keys(context), \`return \${condition};\`);
          return func(...Object.values(context));
        }

        applyContent(element, content, type) {
          switch (type) {
            case 'text':
              element.textContent = content;
              break;
            case 'image':
              if (element.tagName === 'IMG') {
                element.src = content;
              }
              break;
            case 'component':
              if (typeof content === 'object') {
                this.applyComponentContent(element, content);
              } else {
                element.innerHTML = content;
              }
              break;
            default:
              element.innerHTML = content;
          }
        }

        applyComponentContent(element, content) {
          // Apply structured content to component
          Object.keys(content).forEach(key => {
            const childElement = element.querySelector(\`[data-content="\${key}"]\`);
            if (childElement) {
              childElement.textContent = content[key];
            }
          });
        }

        detectUserSegment() {
          // Simple segment detection logic
          const params = new URLSearchParams(window.location.search);
          const utmSource = params.get('utm_source');
          const referrer = document.referrer;

          if (utmSource === 'enterprise' || referrer.includes('enterprise')) {
            return 'enterprise';
          } else if (utmSource === 'startup' || referrer.includes('startup')) {
            return 'startup';
          } else if (utmSource === 'freelancer' || referrer.includes('freelancer')) {
            return 'freelancer';
          }

          return 'general';
        }

        detectUserLocation() {
          // Simple location detection (in real implementation, use proper geolocation)
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const country = timezone.includes('America') ? 'US' : 
                         timezone.includes('Europe/London') ? 'UK' : 'Other';
          
          return { country, timezone };
        }
      }

      // Initialize dynamic content evaluator
      document.addEventListener('DOMContentLoaded', () => {
        new DynamicContentEvaluator();
      });
    `;
  }
}
