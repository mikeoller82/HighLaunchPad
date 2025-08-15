/**
 * Heatmap Recording System
 * Heatmap recording, click tracking, and scroll depth analysis
 */

export interface HeatmapConfig {
  enabled: boolean;
  recordingInterval: number; // milliseconds
  maxDataPoints: number;
  privacySettings: {
    excludeElements: string[]; // CSS selectors to exclude
    maskText: boolean;
    maskInputs: boolean;
  };
  storage: {
    local: boolean;
    remote: boolean;
    batchSize: number;
  };
}

export interface HeatmapDataPoint {
  x: number;
  y: number;
  timestamp: number;
  type: 'click' | 'move' | 'scroll';
  element?: string;
  viewportWidth: number;
  viewportHeight: number;
  scrollX: number;
  scrollY: number;
}

export interface ClickData extends HeatmapDataPoint {
  type: 'click';
  button: number;
  target: string;
}

export interface MoveData extends HeatmapDataPoint {
  type: 'move';
}

export interface ScrollData extends HeatmapDataPoint {
  type: 'scroll';
  scrollTop: number;
  scrollHeight: number;
}

export class HeatmapRecordingSystem {
  private config: HeatmapConfig;
  private dataPoints: HeatmapDataPoint[] = [];
  private isRecording: boolean = false;
  private moveThrottleTimer: any = null;
  
  constructor(config: HeatmapConfig) {
    this.config = config;
  }
  
  startRecording(): void {
    if (!this.config.enabled || this.isRecording) return;
    
    this.isRecording = true;
    
    // Add event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this.handleClick.bind(this), true);
      window.addEventListener('mousemove', this.handleMouseMove.bind(this), true);
      window.addEventListener('scroll', this.handleScroll.bind(this), true);
    }
  }
  
  stopRecording(): void {
    this.isRecording = false;
    
    // Remove event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', this.handleClick.bind(this), true);
      window.removeEventListener('mousemove', this.handleMouseMove.bind(this), true);
      window.removeEventListener('scroll', this.handleScroll.bind(this), true);
    }
    
    // Clear throttle timer
    if (this.moveThrottleTimer) {
      clearTimeout(this.moveThrottleTimer);
      this.moveThrottleTimer = null;
    }
  }
  
  getDataPoints(): HeatmapDataPoint[] {
    return [...this.dataPoints];
  }
  
  clearData(): void {
    this.dataPoints = [];
  }
  
  getConfig(): HeatmapConfig {
    return { ...this.config };
  }
  
  updateConfig(config: Partial<HeatmapConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  async sendData(): Promise<void> {
    if (!this.config.storage.remote || this.dataPoints.length === 0) return;
    
    // Send data to server in batches
    const batchSize = this.config.storage.batchSize || 50;
    for (let i = 0; i < this.dataPoints.length; i += batchSize) {
      const batch = this.dataPoints.slice(i, i + batchSize);
      await this.sendBatch(batch);
    }
    
    // Clear data after successful send
    this.dataPoints = [];
  }
  
  private handleClick(event: MouseEvent): void {
    if (!this.isRecording) return;
    
    // Check if element should be excluded
    if (this.shouldExcludeElement(event.target as Element)) return;
    
    const dataPoint: ClickData = {
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
      type: 'click',
      button: event.button,
      target: this.getElementSelector(event.target as Element),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    
    this.addDataPoint(dataPoint);
  }
  
  private handleMouseMove(event: MouseEvent): void {
    if (!this.isRecording) return;
    
    // Throttle mouse moves to reduce data volume
    if (this.moveThrottleTimer) return;
    
    this.moveThrottleTimer = setTimeout(() => {
      this.moveThrottleTimer = null;
    }, this.config.recordingInterval || 100);
    
    // Check if element should be excluded
    if (this.shouldExcludeElement(event.target as Element)) return;
    
    const dataPoint: MoveData = {
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
      type: 'move',
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    
    this.addDataPoint(dataPoint);
  }
  
  private handleScroll(): void {
    if (!this.isRecording) return;
    
    const dataPoint: ScrollData = {
      x: 0, // Scroll is viewport-wide
      y: window.scrollY,
      timestamp: Date.now(),
      type: 'scroll',
      scrollTop: window.scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };
    
    this.addDataPoint(dataPoint);
  }
  
  private addDataPoint(dataPoint: HeatmapDataPoint): void {
    // Apply privacy settings
    const processedPoint = this.applyPrivacySettings(dataPoint);
    
    this.dataPoints.push(processedPoint);
    
    // Limit data points to prevent memory issues
    if (this.dataPoints.length > this.config.maxDataPoints) {
      this.dataPoints.shift();
    }
  }
  
  private applyPrivacySettings(dataPoint: HeatmapDataPoint): HeatmapDataPoint {
    // Create a copy to avoid modifying the original
    const processedPoint = { ...dataPoint };
    
    // Mask text if configured
    if (this.config.privacySettings.maskText && processedPoint.element) {
      processedPoint.element = '[MASKED]';
    }
    
    return processedPoint;
  }
  
  private shouldExcludeElement(element: Element): boolean {
    if (!element) return true;
    
    // Check against excluded selectors
    for (const selector of this.config.privacySettings.excludeElements) {
      if (element.matches && element.matches(selector)) {
        return true;
      }
    }
    
    // Check parent elements
    let parent = element.parentElement;
    while (parent) {
      for (const selector of this.config.privacySettings.excludeElements) {
        if (parent.matches && parent.matches(selector)) {
          return true;
        }
      }
      parent = parent.parentElement;
    }
    
    return false;
  }
  
  private getElementSelector(element: Element): string {
    if (!element) return '';
    
    // Generate a simple CSS selector for the element
    let selector = element.tagName.toLowerCase();
    
    if (element.id) {
      selector += `#${element.id}`;
    } else if (element.className && typeof element.className === 'string') {
      const classes = element.className.split(/\s+/).filter(c => c);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }
    
    return selector;
  }
  
  private async sendBatch(batch: HeatmapDataPoint[]): Promise<void> {
    // In a real implementation, this would send to a server
    // For now, we'll just log to console in development
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[Heatmap] Sending batch:', batch);
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

export function createHeatmapRecordingSystem(config: HeatmapConfig): HeatmapRecordingSystem {
  return new HeatmapRecordingSystem(config);
}

export const heatmapRecordingSystem = createHeatmapRecordingSystem({
  enabled: true,
  recordingInterval: 100,
  maxDataPoints: 1000,
  privacySettings: {
    excludeElements: ['.password', '[type="password"]', '.private'],
    maskText: true,
    maskInputs: true
  },
  storage: {
    local: true,
    remote: true,
    batchSize: 50
  }
});