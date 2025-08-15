/**
 * Click Tracking System
 * Detailed click tracking and interaction analysis
 */

export interface ClickTrackingConfig {
  enabled: boolean;
  trackElementAttributes: string[]; // e.g., ['data-tracking-id', 'id', 'class']
  trackClickPosition: boolean;
  trackClickContext: boolean;
  excludeElements: string[]; // CSS selectors to exclude
  samplingRate: number; // 0-1, percentage of clicks to track
}

export interface ClickData {
  elementId: string;
  elementType: string;
  elementText: string;
  elementAttributes: Record<string, string>;
  x: number;
  y: number;
  pageX: number;
  pageY: number;
  timestamp: number;
  viewportWidth: number;
  viewportHeight: number;
  scrollX: number;
  scrollY: number;
  context: ClickContext;
}

export interface ClickContext {
  pageTitle: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  sessionId: string;
}

export class ClickTrackingSystem {
  private config: ClickTrackingConfig;
  private isTracking: boolean = false;
  private sessionId: string;
  
  constructor(config: ClickTrackingConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
  }
  
  startTracking(): void {
    if (!this.config.enabled || this.isTracking) return;
    
    this.isTracking = true;
    
    // Add click event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this.handleClick.bind(this), true);
    }
  }
  
  stopTracking(): void {
    this.isTracking = false;
    
    // Remove click event listener
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', this.handleClick.bind(this), true);
    }
  }
  
  getConfig(): ClickTrackingConfig {
    return { ...this.config };
  }
  
  updateConfig(config: Partial<ClickTrackingConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  async trackClick(clickData: ClickData): Promise<void> {
    // Apply sampling rate
    if (Math.random() > this.config.samplingRate) return;
    
    // In a real implementation, this would send to analytics service
    // For now, we'll just log to console in development
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[ClickTracking] Tracking click:', clickData);
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  private handleClick(event: MouseEvent): void {
    if (!this.isTracking) return;
    
    // Check if element should be excluded
    if (this.shouldExcludeElement(event.target as Element)) return;
    
    // Apply sampling rate
    if (Math.random() > this.config.samplingRate) return;
    
    const element = event.target as Element;
    const clickData: ClickData = {
      elementId: element.id || '',
      elementType: element.tagName.toLowerCase(),
      elementText: this.getElementText(element),
      elementAttributes: this.getElementAttributes(element),
      x: event.clientX,
      y: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      timestamp: Date.now(),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      context: {
        pageTitle: document.title,
        pageUrl: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      }
    };
    
    // Track the click
    this.trackClick(clickData);
  }
  
  private shouldExcludeElement(element: Element): boolean {
    if (!element) return true;
    
    // Check against excluded selectors
    for (const selector of this.config.excludeElements) {
      if (element.matches && element.matches(selector)) {
        return true;
      }
    }
    
    // Check parent elements
    let parent = element.parentElement;
    while (parent) {
      for (const selector of this.config.excludeElements) {
        if (parent.matches && parent.matches(selector)) {
          return true;
        }
      }
      parent = parent.parentElement;
    }
    
    return false;
  }
  
  private getElementText(element: Element): string {
    let text = '';
    
    if (element instanceof HTMLElement) {
      if (element instanceof HTMLInputElement) {
        text = element.value || element.placeholder || '';
      } else if (element instanceof HTMLTextAreaElement) {
        text = element.value || '';
      } else if (element instanceof HTMLSelectElement) {
        text = element.options[element.selectedIndex]?.text || '';
      } else {
        text = element.textContent || element.innerText || '';
      }
    }
    
    // Trim and limit text length
    return text.trim().substring(0, 100);
  }
  
  private getElementAttributes(element: Element): Record<string, string> {
    const attributes: Record<string, string> = {};
    
    if (element instanceof HTMLElement) {
      for (const attrName of this.config.trackElementAttributes) {
        const attrValue = element.getAttribute(attrName);
        if (attrValue !== null) {
          attributes[attrName] = attrValue;
        }
      }
    }
    
    return attributes;
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }
}

export function createClickTrackingSystem(config: ClickTrackingConfig): ClickTrackingSystem {
  return new ClickTrackingSystem(config);
}

export const clickTrackingSystem = createClickTrackingSystem({
  enabled: true,
  trackElementAttributes: ['data-tracking-id', 'id', 'class', 'href', 'type'],
  trackClickPosition: true,
  trackClickContext: true,
  excludeElements: ['.no-track', '[data-no-track]', '.privacy-sensitive'],
  samplingRate: 1.0 // Track all clicks
});