/**
 * Scroll Depth Analyzer
 * Scroll depth analysis for engagement metrics
 */

export interface ScrollDepthConfig {
  enabled: boolean;
  trackIntervals: number[]; // Percentage intervals to track (e.g., [25, 50, 75, 100])
  trackTimeSpent: boolean;
  trackScrollVelocity: boolean;
  samplingRate: number; // 0-1, percentage of users to track
}

export interface ScrollDepthData {
  pageUrl: string;
  maxScrollDepth: number; // Percentage
  scrollIntervalsReached: Record<number, number>; // interval -> timestamp
  timeSpent: number; // seconds
  averageScrollVelocity: number; // pixels per second
  timestamp: Date;
}

export interface ScrollEvent {
  scrollPosition: number;
  timestamp: number;
  viewportHeight: number;
  documentHeight: number;
}

export class ScrollDepthAnalyzer {
  private config: ScrollDepthConfig;
  private scrollEvents: ScrollEvent[] = [];
  private startTime: number = 0;
  private intervalsReached: Record<number, number> = {};
  private maxScrollDepth: number = 0;
  private scrollTimer: any = null;
  private isTracking: boolean = false;
  
  constructor(config: ScrollDepthConfig) {
    this.config = config;
  }
  
  startTracking(): void {
    if (!this.config.enabled || this.isTracking) return;
    
    // Apply sampling rate
    if (Math.random() > this.config.samplingRate) return;
    
    this.isTracking = true;
    this.startTime = Date.now();
    this.scrollEvents = [];
    this.intervalsReached = {};
    this.maxScrollDepth = 0;
    
    // Add scroll event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
    }
  }
  
  stopTracking(): void {
    this.isTracking = false;
    
    // Remove event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
      window.removeEventListener('beforeunload', this.handlePageUnload.bind(this));
    }
    
    // Clear scroll timer
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }
  }
  
  getScrollDepthData(): ScrollDepthData {
    const timeSpent = this.startTime > 0 ? (Date.now() - this.startTime) / 1000 : 0;
    const averageVelocity = this.calculateAverageScrollVelocity();
    
    return {
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      maxScrollDepth: this.maxScrollDepth,
      scrollIntervalsReached: { ...this.intervalsReached },
      timeSpent,
      averageScrollVelocity: averageVelocity,
      timestamp: new Date()
    };
  }
  
  getConfig(): ScrollDepthConfig {
    return { ...this.config };
  }
  
  updateConfig(config: Partial<ScrollDepthConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  async sendData(): Promise<void> {
    if (!this.isTracking || this.startTime === 0) return;
    
    const data = this.getScrollDepthData();
    
    // In a real implementation, this would send to analytics service
    // For now, we'll just log to console in development
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[ScrollDepth] Sending data:', data);
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  private handleScroll(): void {
    if (!this.isTracking) return;
    
    const scrollPosition = typeof window !== 'undefined' ? window.scrollY : 0;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
    const documentHeight = typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0;
    
    if (documentHeight === 0) return;
    
    const scrollPercentage = Math.min(100, Math.round((scrollPosition / (documentHeight - viewportHeight)) * 100));
    
    // Update max scroll depth
    if (scrollPercentage > this.maxScrollDepth) {
      this.maxScrollDepth = scrollPercentage;
    }
    
    // Track intervals reached
    for (const interval of this.config.trackIntervals) {
      if (scrollPercentage >= interval && !this.intervalsReached[interval]) {
        this.intervalsReached[interval] = Date.now();
      }
    }
    
    // Track scroll events for velocity calculation
    if (this.config.trackScrollVelocity) {
      this.scrollEvents.push({
        scrollPosition,
        timestamp: Date.now(),
        viewportHeight,
        documentHeight
      });
      
      // Keep only recent events (last 5 seconds) for velocity calculation
      const fiveSecondsAgo = Date.now() - 5000;
      this.scrollEvents = this.scrollEvents.filter(event => event.timestamp > fiveSecondsAgo);
    }
    
    // Debounce data sending
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    
    this.scrollTimer = setTimeout(() => {
      this.sendData();
    }, 1000); // Send data 1 second after last scroll
  }
  
  private handlePageUnload(): void {
    // Send final scroll data before page unload
    this.sendData();
  }
  
  private calculateAverageScrollVelocity(): number {
    if (this.scrollEvents.length < 2) return 0;
    
    const firstEvent = this.scrollEvents[0];
    const lastEvent = this.scrollEvents[this.scrollEvents.length - 1];
    
    const timeDiff = (lastEvent.timestamp - firstEvent.timestamp) / 1000; // seconds
    const scrollDiff = Math.abs(lastEvent.scrollPosition - firstEvent.scrollPosition); // pixels
    
    if (timeDiff === 0) return 0;
    
    return scrollDiff / timeDiff; // pixels per second
  }
}

export function createScrollDepthAnalyzer(config: ScrollDepthConfig): ScrollDepthAnalyzer {
  return new ScrollDepthAnalyzer(config);
}

export const scrollDepthAnalyzer = createScrollDepthAnalyzer({
  enabled: true,
  trackIntervals: [25, 50, 75, 100],
  trackTimeSpent: true,
  trackScrollVelocity: true,
  samplingRate: 1.0 // Track all users
});