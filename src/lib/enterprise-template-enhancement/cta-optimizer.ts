/**
 * Call-to-Action (CTA) Optimizer
 *
 * Advanced CTA optimization system that dynamically changes button text, colors, 
 * and placement based on user behavior, segment, and context.
 * 
 * Features:
 * - User segment-based CTA variations
 * - A/B testing for CTA performance
 * - Dynamic color and style optimization
 * - Placement optimization based on user behavior
 * - Performance tracking and analytics
 */

import type { Component } from '../types';

export interface CtaVariation {
  id: string;
  text: string;
  color: string;
  style?: { [key: string]: string };
  segment?: string;
  trafficSource?: string;
  device?: 'mobile' | 'tablet' | 'desktop';
  priority: number;
  conversionRate?: number;
  testResults?: CtaTestResult;
}

export interface CtaTestResult {
  impressions: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
  isWinner?: boolean;
}

export interface CtaOptimizationConfig {
  enableABTesting: boolean;
  testDuration: number; // in days
  minSampleSize: number;
  confidenceLevel: number;
  segments: string[];
  devices: string[];
  trafficSources: string[];
}

export interface CtaPlacement {
  position: 'above-fold' | 'below-fold' | 'sticky' | 'inline' | 'floating';
  alignment: 'left' | 'center' | 'right';
  size: 'small' | 'medium' | 'large';
  prominence: 'subtle' | 'normal' | 'prominent';
}

export interface OptimizedCta {
  variation: CtaVariation;
  placement: CtaPlacement;
  html: string;
  css: string;
  analytics: {
    trackingId: string;
    events: string[];
  };
}

class CtaOptimizer {
  private variations: CtaVariation[] = [];
  private config: CtaOptimizationConfig;
  private activeTests: Map<string, CtaVariation[]> = new Map();
  private performanceData: Map<string, CtaTestResult> = new Map();

  constructor(config?: Partial<CtaOptimizationConfig>) {
    this.config = {
      enableABTesting: true,
      testDuration: 14,
      minSampleSize: 100,
      confidenceLevel: 95,
      segments: ['enterprise', 'startup', 'freelancer', 'general'],
      devices: ['mobile', 'tablet', 'desktop'],
      trafficSources: ['organic', 'paid', 'social', 'email', 'direct'],
      ...config
    };
    
    this.initializeVariations();
  }

  /**
   * Get optimized CTA based on user context and performance data
   */
  getOptimizedCta(userContext?: {
    segment?: string;
    device?: 'mobile' | 'tablet' | 'desktop';
    trafficSource?: string;
    previousInteractions?: any;
  }): OptimizedCta {
    // Find the best performing variation for the user context
    const applicableVariations = this.getApplicableVariations(userContext);
    const bestVariation = this.selectBestVariation(applicableVariations, userContext);
    
    // Determine optimal placement
    const placement = this.optimizePlacement(bestVariation, userContext);
    
    // Generate HTML and CSS
    const html = this.generateCtaHtml(bestVariation, placement);
    const css = this.generateCtaCss(bestVariation, placement);
    
    // Setup analytics tracking
    const analytics = this.setupAnalytics(bestVariation);

    return {
      variation: bestVariation,
      placement,
      html,
      css,
      analytics
    };
  }

  /**
   * Create CTA variations for A/B testing
   */
  createCtaVariations(component: Component, userContext?: any): CtaVariation[] {
    const baseVariations = this.getBaseVariations();
    const contextualVariations = this.generateContextualVariations(userContext);
    
    return [...baseVariations, ...contextualVariations];
  }

  /**
   * Optimize CTA placement based on user behavior
   */
  optimizePlacement(variation: CtaVariation, userContext?: any): CtaPlacement {
    const defaultPlacement: CtaPlacement = {
      position: 'above-fold',
      alignment: 'center',
      size: 'medium',
      prominence: 'normal'
    };

    if (!userContext) return defaultPlacement;

    // Mobile optimization
    if (userContext.device === 'mobile') {
      return {
        position: 'sticky',
        alignment: 'center',
        size: 'large',
        prominence: 'prominent'
      };
    }

    // Enterprise users prefer subtle CTAs
    if (userContext.segment === 'enterprise') {
      return {
        position: 'inline',
        alignment: 'left',
        size: 'medium',
        prominence: 'subtle'
      };
    }

    // Startup users respond to prominent CTAs
    if (userContext.segment === 'startup') {
      return {
        position: 'above-fold',
        alignment: 'center',
        size: 'large',
        prominence: 'prominent'
      };
    }

    return defaultPlacement;
  }

  /**
   * Track CTA performance and update optimization
   */
  trackCtaPerformance(variationId: string, event: 'impression' | 'click' | 'conversion'): void {
    const result = this.performanceData.get(variationId) || {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      conversionRate: 0,
      confidence: 0
    };

    switch (event) {
      case 'impression':
        result.impressions++;
        break;
      case 'click':
        result.clicks++;
        break;
      case 'conversion':
        result.conversions++;
        break;
    }

    // Calculate conversion rate
    result.conversionRate = result.conversions / Math.max(result.impressions, 1);
    
    // Calculate statistical confidence
    result.confidence = this.calculateStatisticalConfidence(result);

    this.performanceData.set(variationId, result);

    // Update variation performance
    const variation = this.variations.find(v => v.id === variationId);
    if (variation) {
      variation.testResults = result;
      variation.conversionRate = result.conversionRate;
    }
  }

  /**
   * Get CTA performance analytics
   */
  getCtaAnalytics(variationId?: string): CtaTestResult | Map<string, CtaTestResult> {
    if (variationId) {
      return this.performanceData.get(variationId) || {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        conversionRate: 0,
        confidence: 0
      };
    }
    
    return this.performanceData;
  }

  /**
   * Initialize default CTA variations
   */
  private initializeVariations(): void {
    this.variations = [
      // General variations
      {
        id: 'general-get-started',
        text: 'Get Started',
        color: '#4299e1',
        style: { fontSize: '16px', padding: '12px 24px', fontWeight: 'bold' },
        priority: 5,
        conversionRate: 0.12
      },
      {
        id: 'general-try-free',
        text: 'Try for Free',
        color: '#38a169',
        style: { fontSize: '16px', padding: '12px 24px', fontWeight: 'bold' },
        priority: 6,
        conversionRate: 0.15
      },
      {
        id: 'general-sign-up',
        text: 'Sign Up Now',
        color: '#e53e3e',
        style: { fontSize: '16px', padding: '12px 24px', fontWeight: 'bold' },
        priority: 4,
        conversionRate: 0.10
      },

      // Enterprise variations
      {
        id: 'enterprise-demo',
        text: 'Request Enterprise Demo',
        color: '#1a365d',
        style: { fontSize: '15px', padding: '10px 20px', fontWeight: '600' },
        segment: 'enterprise',
        priority: 20,
        conversionRate: 0.25
      },
      {
        id: 'enterprise-contact',
        text: 'Contact Sales',
        color: '#2d3748',
        style: { fontSize: '15px', padding: '10px 20px', fontWeight: '600' },
        segment: 'enterprise',
        priority: 18,
        conversionRate: 0.22
      },

      // Startup variations
      {
        id: 'startup-trial',
        text: 'Start Free Trial',
        color: '#38a169',
        style: { fontSize: '17px', padding: '14px 28px', fontWeight: 'bold' },
        segment: 'startup',
        priority: 20,
        conversionRate: 0.28
      },
      {
        id: 'startup-launch',
        text: 'Launch Your Startup',
        color: '#d69e2e',
        style: { fontSize: '17px', padding: '14px 28px', fontWeight: 'bold' },
        segment: 'startup',
        priority: 19,
        conversionRate: 0.24
      },

      // Freelancer variations
      {
        id: 'freelancer-free',
        text: 'Try Free for 30 Days',
        color: '#d69e2e',
        style: { fontSize: '16px', padding: '12px 24px', fontWeight: 'bold' },
        segment: 'freelancer',
        priority: 20,
        conversionRate: 0.20
      },
      {
        id: 'freelancer-boost',
        text: 'Boost Your Business',
        color: '#9f7aea',
        style: { fontSize: '16px', padding: '12px 24px', fontWeight: 'bold' },
        segment: 'freelancer',
        priority: 18,
        conversionRate: 0.18
      },

      // Mobile-specific variations
      {
        id: 'mobile-tap',
        text: 'Tap to Start',
        color: '#4299e1',
        style: { fontSize: '18px', padding: '15px 30px', width: '100%', fontWeight: 'bold' },
        device: 'mobile',
        priority: 15,
        conversionRate: 0.16
      },
      {
        id: 'mobile-join',
        text: 'Join Now',
        color: '#38a169',
        style: { fontSize: '18px', padding: '15px 30px', width: '100%', fontWeight: 'bold' },
        device: 'mobile',
        priority: 14,
        conversionRate: 0.14
      },

      // Traffic source specific variations
      {
        id: 'paid-special-offer',
        text: 'Claim Special Offer',
        color: '#e53e3e',
        style: { 
          fontSize: '16px', 
          padding: '12px 24px', 
          fontWeight: 'bold',
          animation: 'pulse 2s infinite',
          boxShadow: '0 4px 15px rgba(229, 62, 62, 0.3)'
        },
        trafficSource: 'paid',
        priority: 25,
        conversionRate: 0.32
      },
      {
        id: 'social-join-community',
        text: 'Join the Community',
        color: '#4299e1',
        style: { fontSize: '16px', padding: '12px 24px', fontWeight: 'bold' },
        trafficSource: 'social',
        priority: 15,
        conversionRate: 0.18
      }
    ];
  }

  /**
   * Get applicable variations based on user context
   */
  private getApplicableVariations(userContext?: any): CtaVariation[] {
    if (!userContext) {
      return this.variations.filter(v => !v.segment && !v.device && !v.trafficSource);
    }

    return this.variations.filter(variation => {
      // Check segment match
      if (variation.segment && variation.segment !== userContext.segment) {
        return false;
      }

      // Check device match
      if (variation.device && variation.device !== userContext.device) {
        return false;
      }

      // Check traffic source match
      if (variation.trafficSource && variation.trafficSource !== userContext.trafficSource) {
        return false;
      }

      return true;
    });
  }

  /**
   * Select best performing variation
   */
  private selectBestVariation(variations: CtaVariation[], userContext?: any): CtaVariation {
    if (variations.length === 0) {
      return this.variations[0]; // Fallback to first variation
    }

    // If A/B testing is disabled, return highest priority variation
    if (!this.config.enableABTesting) {
      return variations.sort((a, b) => b.priority - a.priority)[0];
    }

    // Sort by conversion rate and confidence
    const sortedVariations = variations.sort((a, b) => {
      const aScore = (a.conversionRate || 0) * (a.testResults?.confidence || 0) / 100;
      const bScore = (b.conversionRate || 0) * (b.testResults?.confidence || 0) / 100;
      return bScore - aScore;
    });

    return sortedVariations[0];
  }

  /**
   * Generate contextual variations
   */
  private generateContextualVariations(userContext?: any): CtaVariation[] {
    const variations: CtaVariation[] = [];

    if (!userContext) return variations;

    // Time-based variations
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 17) {
      variations.push({
        id: 'business-hours-chat',
        text: 'Chat with Us Now',
        color: '#38a169',
        style: { fontSize: '16px', padding: '12px 24px', fontWeight: 'bold' },
        priority: 12,
        conversionRate: 0.19
      });
    }

    // Returning visitor variations
    if (userContext.previousInteractions?.visitCount > 1) {
      variations.push({
        id: 'returning-continue',
        text: 'Continue Where You Left Off',
        color: '#9f7aea',
        style: { fontSize: '16px', padding: '12px 24px', fontWeight: 'bold' },
        priority: 22,
        conversionRate: 0.35
      });
    }

    return variations;
  }

  /**
   * Get base variations
   */
  private getBaseVariations(): CtaVariation[] {
    return this.variations.filter(v => !v.segment && !v.device && !v.trafficSource);
  }

  /**
   * Generate CTA HTML
   */
  private generateCtaHtml(variation: CtaVariation, placement: CtaPlacement): string {
    const classes = [
      'cta-button',
      `cta-${placement.size}`,
      `cta-${placement.prominence}`,
      `cta-${placement.position}`
    ].join(' ');

    const dataAttributes = [
      `data-cta-id="${variation.id}"`,
      `data-cta-segment="${variation.segment || 'general'}"`,
      `data-cta-device="${variation.device || 'all'}"`,
      `data-cta-traffic="${variation.trafficSource || 'all'}"`
    ].join(' ');

    return `
      <button 
        class="${classes}" 
        ${dataAttributes}
        onclick="trackCtaClick('${variation.id}')"
      >
        ${variation.text}
      </button>
    `;
  }

  /**
   * Generate CTA CSS
   */
  private generateCtaCss(variation: CtaVariation, placement: CtaPlacement): string {
    const baseStyles = {
      backgroundColor: variation.color,
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center',
      ...variation.style
    };

    // Add placement-specific styles
    const placementStyles = this.getPlacementStyles(placement);
    const combinedStyles = { ...baseStyles, ...placementStyles };

    // Convert to CSS string
    const cssProperties = Object.entries(combinedStyles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');

    return `
      .cta-button[data-cta-id="${variation.id}"] {
        ${cssProperties};
      }
      
      .cta-button[data-cta-id="${variation.id}"]:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        opacity: 0.9;
      }
      
      .cta-button[data-cta-id="${variation.id}"]:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }
    `;
  }

  /**
   * Get placement-specific styles
   */
  private getPlacementStyles(placement: CtaPlacement): Record<string, string> {
    const styles: Record<string, string> = {};

    // Position styles
    switch (placement.position) {
      case 'sticky':
        styles.position = 'sticky';
        styles.bottom = '20px';
        styles.zIndex = '1000';
        break;
      case 'floating':
        styles.position = 'fixed';
        styles.bottom = '20px';
        styles.right = '20px';
        styles.zIndex = '1000';
        break;
    }

    // Size styles
    switch (placement.size) {
      case 'small':
        styles.fontSize = '14px';
        styles.padding = '8px 16px';
        break;
      case 'large':
        styles.fontSize = '18px';
        styles.padding = '16px 32px';
        break;
    }

    // Prominence styles
    switch (placement.prominence) {
      case 'subtle':
        styles.opacity = '0.8';
        styles.fontWeight = 'normal';
        break;
      case 'prominent':
        styles.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
        styles.fontWeight = 'bold';
        styles.transform = 'scale(1.05)';
        break;
    }

    return styles;
  }

  /**
   * Setup analytics tracking
   */
  private setupAnalytics(variation: CtaVariation): { trackingId: string; events: string[] } {
    return {
      trackingId: `cta_${variation.id}`,
      events: [
        'cta_impression',
        'cta_click',
        'cta_conversion'
      ]
    };
  }

  /**
   * Calculate statistical confidence
   */
  private calculateStatisticalConfidence(result: CtaTestResult): number {
    if (result.impressions < this.config.minSampleSize) {
      return 0;
    }

    // Simplified confidence calculation
    // In a real implementation, you'd use proper statistical methods
    const sampleSize = result.impressions;
    const conversionRate = result.conversionRate;
    
    // Basic confidence based on sample size and conversion rate
    const baseConfidence = Math.min(sampleSize / this.config.minSampleSize * 50, 50);
    const rateConfidence = conversionRate > 0 ? Math.min(conversionRate * 100, 50) : 0;
    
    return Math.min(baseConfidence + rateConfidence, 100);
  }

  /**
   * Generate client-side CTA optimization script
   */
  generateCtaOptimizationScript(): string {
    return `
      // CTA Optimization Client Script
      class CtaOptimizationClient {
        constructor() {
          this.init();
        }

        init() {
          this.trackCtaImpressions();
          this.setupCtaClickTracking();
          this.optimizeCtaPlacement();
        }

        trackCtaImpressions() {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const ctaId = entry.target.getAttribute('data-cta-id');
                this.trackEvent('cta_impression', { cta_id: ctaId });
              }
            });
          });

          document.querySelectorAll('.cta-button').forEach(cta => {
            observer.observe(cta);
          });
        }

        setupCtaClickTracking() {
          document.addEventListener('click', (event) => {
            if (event.target.classList.contains('cta-button')) {
              const ctaId = event.target.getAttribute('data-cta-id');
              this.trackEvent('cta_click', { cta_id: ctaId });
            }
          });
        }

        optimizeCtaPlacement() {
          // Dynamic placement optimization based on scroll behavior
          let scrollDepth = 0;
          window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            if (currentScroll > scrollDepth) {
              scrollDepth = currentScroll;
            }

            // Show sticky CTA if user scrolled past 50%
            if (scrollDepth > 0.5) {
              this.showStickyCta();
            }
          });
        }

        showStickyCta() {
          const stickyCta = document.querySelector('.cta-button[data-cta-position="sticky"]');
          if (stickyCta && !stickyCta.classList.contains('visible')) {
            stickyCta.classList.add('visible');
            stickyCta.style.display = 'block';
          }
        }

        trackEvent(eventName, properties) {
          // Send to analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
          }

          // Send to custom analytics endpoint
          fetch('/api/analytics/cta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: eventName, properties })
          }).catch(console.error);
        }
      }

      // Global function for CTA click tracking
      window.trackCtaClick = function(ctaId) {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'cta_click', { cta_id: ctaId });
        }
      };

      // Initialize CTA optimization
      document.addEventListener('DOMContentLoaded', () => {
        new CtaOptimizationClient();
      });
    `;
  }
}

// Create a singleton instance
const ctaOptimizer = new CtaOptimizer();

export default ctaOptimizer;
