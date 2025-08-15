/**
 * Analytics Tracker
 * Detailed analytics tracking for conversion rates, user behavior, and engagement metrics
 */

import { AnalyticsConfig, CustomEvent, BehaviorTrackingConfig } from './types';

export interface AnalyticsTracker {
  /**
   * Track a custom event
   */
  trackEvent(event: CustomEvent): Promise<void>;
  
  /**
   * Track page view
   */
  trackPageView(url: string, title: string): Promise<void>;
  
  /**
   * Track conversion event
   */
  trackConversion(conversionId: string, value?: number): Promise<void>;
  
  /**
   * Track user interaction
   */
  trackInteraction(elementId: string, action: string, category: string): Promise<void>;
  
  /**
   * Track form submission
   */
  trackFormSubmission(formId: string, fields: string[]): Promise<void>;
  
  /**
   * Track purchase event
   */
  trackPurchase(transactionId: string, amount: number, items: any[]): Promise<void>;
  
  /**
   * Get analytics configuration
   */
  getConfig(): AnalyticsConfig;
  
  /**
   * Update analytics configuration
   */
  updateConfig(config: Partial<AnalyticsConfig>): Promise<void>;
  
  /**
   * Initialize analytics tracking
   */
  initialize(): Promise<void>;
  
  /**
   * Flush pending events
   */
  flush(): Promise<void>;
}

export interface AnalyticsEvent {
  id: string;
  type: string;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  url: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface PageViewEvent extends AnalyticsEvent {
  type: 'page_view';
  title: string;
  referrer?: string;
  userAgent?: string;
}

export interface ConversionEvent extends AnalyticsEvent {
  type: 'conversion';
  conversionId: string;
  value?: number;
  source?: string;
}

export interface InteractionEvent extends AnalyticsEvent {
  type: 'interaction';
  elementId: string;
  action: string;
  category: string;
  label?: string;
}

export class AnalyticsTrackerImpl implements AnalyticsTracker {
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  
  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
  }
  
  async trackEvent(event: CustomEvent): Promise<void> {
    if (!this.config.enabled) return;
    
    const analyticsEvent: AnalyticsEvent = {
      id: this.generateId(),
      type: event.type,
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : '',
      data: event.data || {},
      metadata: event.metadata
    };
    
    this.events.push(analyticsEvent);
    
    // Send to configured providers
    for (const provider of this.config.providers || []) {
      await this.sendToProvider(provider, analyticsEvent);
    }
    
    // Flush if batch size reached
    if (this.events.length >= (this.config.batchSize || 10)) {
      await this.flush();
    }
  }
  
  async trackPageView(url: string, title: string): Promise<void> {
    if (!this.config.enabled) return;
    
    const pageViewEvent: PageViewEvent = {
      id: this.generateId(),
      type: 'page_view',
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId,
      url,
      title,
      data: {}
    };
    
    this.events.push(pageViewEvent);
    
    // Send to configured providers
    for (const provider of this.config.providers || []) {
      await this.sendToProvider(provider, pageViewEvent);
    }
  }
  
  async trackConversion(conversionId: string, value?: number): Promise<void> {
    if (!this.config.enabled) return;
    
    const conversionEvent: ConversionEvent = {
      id: this.generateId(),
      type: 'conversion',
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : '',
      conversionId,
      value,
      data: {}
    };
    
    this.events.push(conversionEvent);
    
    // Send to configured providers
    for (const provider of this.config.providers || []) {
      await this.sendToProvider(provider, conversionEvent);
    }
  }
  
  async trackInteraction(elementId: string, action: string, category: string): Promise<void> {
    if (!this.config.enabled) return;
    
    const interactionEvent: InteractionEvent = {
      id: this.generateId(),
      type: 'interaction',
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : '',
      elementId,
      action,
      category,
      data: {}
    };
    
    this.events.push(interactionEvent);
    
    // Send to configured providers
    for (const provider of this.config.providers || []) {
      await this.sendToProvider(provider, interactionEvent);
    }
  }
  
  async trackFormSubmission(formId: string, fields: string[]): Promise<void> {
    const event: CustomEvent = {
      type: 'form_submission',
      data: { formId, fields, timestamp: Date.now() }
    };
    await this.trackEvent(event);
  }
  
  async trackPurchase(transactionId: string, amount: number, items: any[]): Promise<void> {
    const event: CustomEvent = {
      type: 'purchase',
      data: { transactionId, amount, items, timestamp: Date.now() }
    };
    await this.trackEvent(event);
  }
  
  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }
  
  async updateConfig(config: Partial<AnalyticsConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
  }
  
  async initialize(): Promise<void> {
    if (!this.config.enabled) return;
    
    // Track initial page view
    if (typeof window !== 'undefined') {
      await this.trackPageView(window.location.href, document.title);
    }
  }
  
  async flush(): Promise<void> {
    if (!this.config.enabled || this.events.length === 0) return;
    
    // Send all pending events
    for (const event of this.events) {
      for (const provider of this.config.providers || []) {
        await this.sendToProvider(provider, event);
      }
    }
    
    // Clear events
    this.events = [];
  }
  
  setUserId(userId: string): void {
    this.userId = userId;
  }
  
  getSessionId(): string {
    return this.sessionId;
  }
  
  private async sendToProvider(provider: string, event: AnalyticsEvent): Promise<void> {
    // In a real implementation, this would send to actual analytics providers
    // For now, we'll just log to console in development
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Sending event to ${provider}:`, event);
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }
}

export function createAnalyticsTracker(config: AnalyticsConfig): AnalyticsTracker {
  return new AnalyticsTrackerImpl(config);
}

export const analyticsTracker = createAnalyticsTracker({
  conversionGoals: [],
  enabled: true,
  providers: ['internal'],
  trackingId: 'default',
  batchSize: 10,
  autoTrack: {
    pageViews: true,
    clicks: true,
    formSubmissions: true
  }
});