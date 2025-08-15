/**
 * Conversion Psychology Engine
 * Implements proven psychological triggers for funnel optimization
 */

export interface ScarcityConfig {
  type: 'limited_quantity' | 'limited_time' | 'exclusive_access';
  value: number | string;
  displayText: string;
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface UrgencyConfig {
  type: 'countdown_timer' | 'deadline' | 'fast_action_bonus';
  endTime?: Date;
  duration?: number; // in minutes
  message: string;
  visualStyle: 'banner' | 'popup' | 'inline' | 'floating';
}

export interface SocialProofConfig {
  type: 'testimonials' | 'user_count' | 'recent_activity' | 'expert_endorsement';
  data: any[];
  displayFormat: 'carousel' | 'grid' | 'ticker' | 'popup';
  updateFrequency?: number; // in seconds for dynamic updates
}

export interface ConversionTrigger {
  id: string;
  name: string;
  type: 'scarcity' | 'urgency' | 'social_proof' | 'authority' | 'reciprocity';
  config: ScarcityConfig | UrgencyConfig | SocialProofConfig;
  placement: 'header' | 'hero' | 'pricing' | 'checkout' | 'exit_intent';
  conditions?: {
    userSegment?: string[];
    timeOnPage?: number;
    scrollDepth?: number;
    visitCount?: number;
  };
  active: boolean;
}

export interface ConversionMetrics {
  triggerId: string;
  impressions: number;
  interactions: number;
  conversions: number;
  conversionRate: number;
  lastUpdated: Date;
}

export class ConversionPsychologyEngine {
  private triggers: Map<string, ConversionTrigger> = new Map();
  private metrics: Map<string, ConversionMetrics> = new Map();
  private activeTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Add a conversion trigger to the funnel
   */
  addTrigger(trigger: ConversionTrigger): void {
    this.triggers.set(trigger.id, trigger);
    
    // Initialize metrics
    this.metrics.set(trigger.id, {
      triggerId: trigger.id,
      impressions: 0,
      interactions: 0,
      conversions: 0,
      conversionRate: 0,
      lastUpdated: new Date()
    });

    // Set up dynamic updates for time-based triggers
    if (trigger.type === 'urgency' && trigger.config.type === 'countdown_timer') {
      this.setupCountdownTimer(trigger);
    }
  }

  /**
   * Get active triggers for a specific placement
   */
  getTriggersForPlacement(placement: string, userContext?: any): ConversionTrigger[] {
    return Array.from(this.triggers.values())
      .filter(trigger => 
        trigger.active && 
        trigger.placement === placement &&
        this.evaluateConditions(trigger, userContext)
      );
  }

  /**
   * Create scarcity trigger
   */
  createScarcityTrigger(config: {
    id: string;
    name: string;
    type: ScarcityConfig['type'];
    value: number | string;
    placement: ConversionTrigger['placement'];
    urgencyLevel?: ScarcityConfig['urgencyLevel'];
  }): ConversionTrigger {
    const displayTexts = {
      limited_quantity: `Only ${config.value} left in stock!`,
      limited_time: `Offer expires in ${config.value}`,
      exclusive_access: `Exclusive access for ${config.value} members only`
    };

    return {
      id: config.id,
      name: config.name,
      type: 'scarcity',
      config: {
        type: config.type,
        value: config.value,
        displayText: displayTexts[config.type],
        urgencyLevel: config.urgencyLevel || 'medium'
      },
      placement: config.placement,
      active: true
    };
  }

  /**
   * Create urgency trigger with countdown
   */
  createUrgencyTrigger(config: {
    id: string;
    name: string;
    type: UrgencyConfig['type'];
    endTime?: Date;
    duration?: number;
    message: string;
    placement: ConversionTrigger['placement'];
    visualStyle?: UrgencyConfig['visualStyle'];
  }): ConversionTrigger {
    return {
      id: config.id,
      name: config.name,
      type: 'urgency',
      config: {
        type: config.type,
        endTime: config.endTime,
        duration: config.duration,
        message: config.message,
        visualStyle: config.visualStyle || 'banner'
      },
      placement: config.placement,
      active: true
    };
  }

  /**
   * Create social proof trigger
   */
  createSocialProofTrigger(config: {
    id: string;
    name: string;
    type: SocialProofConfig['type'];
    data: any[];
    placement: ConversionTrigger['placement'];
    displayFormat?: SocialProofConfig['displayFormat'];
    updateFrequency?: number;
  }): ConversionTrigger {
    return {
      id: config.id,
      name: config.name,
      type: 'social_proof',
      config: {
        type: config.type,
        data: config.data,
        displayFormat: config.displayFormat || 'carousel',
        updateFrequency: config.updateFrequency
      },
      placement: config.placement,
      active: true
    };
  }

  /**
   * Track trigger impression
   */
  trackImpression(triggerId: string): void {
    const metrics = this.metrics.get(triggerId);
    if (metrics) {
      metrics.impressions++;
      metrics.lastUpdated = new Date();
      this.updateConversionRate(triggerId);
    }
  }

  /**
   * Track trigger interaction
   */
  trackInteraction(triggerId: string): void {
    const metrics = this.metrics.get(triggerId);
    if (metrics) {
      metrics.interactions++;
      metrics.lastUpdated = new Date();
      this.updateConversionRate(triggerId);
    }
  }

  /**
   * Track conversion from trigger
   */
  trackConversion(triggerId: string): void {
    const metrics = this.metrics.get(triggerId);
    if (metrics) {
      metrics.conversions++;
      metrics.lastUpdated = new Date();
      this.updateConversionRate(triggerId);
    }
  }

  /**
   * Get performance metrics for a trigger
   */
  getMetrics(triggerId: string): ConversionMetrics | undefined {
    return this.metrics.get(triggerId);
  }

  /**
   * Get all performance metrics
   */
  getAllMetrics(): ConversionMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Generate dynamic social proof content
   */
  generateDynamicSocialProof(type: SocialProofConfig['type']): any[] {
    const generators = {
      user_count: () => [
        { count: Math.floor(Math.random() * 1000) + 5000, action: 'joined this month' },
        { count: Math.floor(Math.random() * 100) + 200, action: 'active right now' }
      ],
      recent_activity: () => [
        { name: 'Sarah M.', action: 'just purchased', time: '2 minutes ago', location: 'New York' },
        { name: 'Mike R.', action: 'completed course', time: '5 minutes ago', location: 'California' },
        { name: 'Emma L.', action: 'left 5-star review', time: '8 minutes ago', location: 'Texas' }
      ],
      testimonials: () => [
        { name: 'John D.', text: 'This completely transformed my business!', rating: 5, verified: true },
        { name: 'Lisa K.', text: 'Best investment I\'ve made this year.', rating: 5, verified: true }
      ],
      expert_endorsement: () => [
        { name: 'Industry Expert', title: 'CEO at TechCorp', quote: 'Highly recommended solution' }
      ]
    };

    return generators[type]?.() || [];
  }

  private setupCountdownTimer(trigger: ConversionTrigger): void {
    const config = trigger.config as UrgencyConfig;
    if (config.endTime) {
      const updateInterval = setInterval(() => {
        const now = new Date();
        if (now >= config.endTime!) {
          trigger.active = false;
          clearInterval(updateInterval);
          this.activeTimers.delete(trigger.id);
        }
      }, 1000);
      
      this.activeTimers.set(trigger.id, updateInterval);
    }
  }

  private evaluateConditions(trigger: ConversionTrigger, userContext?: any): boolean {
    if (!trigger.conditions || !userContext) return true;

    const { conditions } = trigger;
    
    // Check user segment
    if (conditions.userSegment && userContext.segment) {
      if (!conditions.userSegment.includes(userContext.segment)) return false;
    }

    // Check time on page
    if (conditions.timeOnPage && userContext.timeOnPage < conditions.timeOnPage) {
      return false;
    }

    // Check scroll depth
    if (conditions.scrollDepth && userContext.scrollDepth < conditions.scrollDepth) {
      return false;
    }

    // Check visit count
    if (conditions.visitCount && userContext.visitCount < conditions.visitCount) {
      return false;
    }

    return true;
  }

  private updateConversionRate(triggerId: string): void {
    const metrics = this.metrics.get(triggerId);
    if (metrics && metrics.impressions > 0) {
      metrics.conversionRate = (metrics.conversions / metrics.impressions) * 100;
    }
  }

  /**
   * Clean up timers
   */
  destroy(): void {
    this.activeTimers.forEach(timer => clearInterval(timer));
    this.activeTimers.clear();
  }
}

export default ConversionPsychologyEngine;