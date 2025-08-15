/**
 * Performance Optimization and Error Handling System
 * 
 * This module provides comprehensive performance optimization and error handling
 * for the enterprise template enhancement system, ensuring graceful degradation
 * and optimal user experience across all devices and network conditions.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface PerformanceOptimizationConfig {
  /** Enable automatic performance monitoring */
  enableMonitoring: boolean;
  /** Performance budget thresholds */
  performanceBudget: PerformanceBudget;
  /** Device-specific optimization settings */
  deviceOptimization: DeviceOptimizationConfig;
  /** Asset loading optimization */
  assetOptimization: AssetOptimizationConfig;
  /** Error handling configuration */
  errorHandling: ErrorHandlingConfig;
  /** Progressive enhancement settings */
  progressiveEnhancement: ProgressiveEnhancementConfig;
}

export interface PerformanceBudget {
  /** Maximum load time in milliseconds */
  maxLoadTime: number;
  /** Maximum First Contentful Paint in milliseconds */
  maxFCP: number;
  /** Maximum Largest Contentful Paint in milliseconds */
  maxLCP: number;
  /** Maximum First Input Delay in milliseconds */
  maxFID: number;
  /** Maximum Cumulative Layout Shift score */
  maxCLS: number;
  /** Maximum bundle size in KB */
  maxBundleSize: number;
  /** Maximum image size in KB */
  maxImageSize: number;
}

export interface DeviceOptimizationConfig {
  /** Enable low-performance device detection */
  enableDeviceDetection: boolean;
  /** CPU performance thresholds */
  cpuThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  /** Memory thresholds in MB */
  memoryThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  /** Network speed thresholds */
  networkThresholds: {
    slow: number;
    fast: number;
  };
  /** Optimization strategies per device tier */
  optimizationStrategies: {
    lowEnd: OptimizationStrategy;
    midRange: OptimizationStrategy;
    highEnd: OptimizationStrategy;
  };
}

export interface OptimizationStrategy {
  /** Disable heavy animations */
  disableAnimations: boolean;
  /** Reduce image quality */
  reduceImageQuality: boolean;
  /** Disable gamification elements */
  disableGamification: boolean;
  /** Limit interactive features */
  limitInteractivity: boolean;
  /** Use simplified layouts */
  useSimplifiedLayouts: boolean;
  /** Defer non-critical resources */
  deferNonCritical: boolean;
}

export interface AssetOptimizationConfig {
  /** Enable lazy loading for images */
  enableLazyLoading: boolean;
  /** Enable image compression */
  enableImageCompression: boolean;
  /** Enable WebP/AVIF format conversion */
  enableModernFormats: boolean;
  /** Enable CSS minification */
  enableCSSMinification: boolean;
  /** Enable JavaScript minification */
  enableJSMinification: boolean;
  /** Enable resource preloading */
  enablePreloading: boolean;
  /** Fallback asset configuration */
  fallbackAssets: FallbackAssetConfig;
}

export interface FallbackAssetConfig {
  /** Default placeholder images */
  placeholderImages: {
    hero: string;
    thumbnail: string;
    avatar: string;
    logo: string;
  };
  /** Default fonts */
  fallbackFonts: string[];
  /** Default colors */
  fallbackColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  /** Simplified CSS for fallback */
  fallbackCSS: string;
}

export interface ErrorHandlingConfig {
  /** Enable silent error handling */
  enableSilentHandling: boolean;
  /** Enable local error tracking */
  enableLocalTracking: boolean;
  /** Error reporting configuration */
  errorReporting: ErrorReportingConfig;
  /** Fallback behavior configuration */
  fallbackBehavior: FallbackBehaviorConfig;
  /** Recovery strategies */
  recoveryStrategies: RecoveryStrategyConfig;
}

export interface ErrorReportingConfig {
  /** Enable error reporting to analytics */
  enableReporting: boolean;
  /** Maximum errors to store locally */
  maxLocalErrors: number;
  /** Error sampling rate (0-1) */
  samplingRate: number;
  /** Sensitive data filtering */
  filterSensitiveData: boolean;
}

export interface FallbackBehaviorConfig {
  /** Asset loading failure behavior */
  assetLoadingFailure: 'hide' | 'placeholder' | 'retry';
  /** Animation failure behavior */
  animationFailure: 'disable' | 'fallback' | 'static';
  /** Gamification failure behavior */
  gamificationFailure: 'disable' | 'simplified' | 'static';
  /** Analytics failure behavior */
  analyticsFailure: 'silent' | 'local' | 'disable';
  /** Interactive element failure behavior */
  interactiveFailure: 'static' | 'simplified' | 'hide';
}

export interface RecoveryStrategyConfig {
  /** Enable automatic retry for failed requests */
  enableAutoRetry: boolean;
  /** Maximum retry attempts */
  maxRetryAttempts: number;
  /** Retry delay in milliseconds */
  retryDelay: number;
  /** Enable exponential backoff */
  enableExponentialBackoff: boolean;
  /** Enable circuit breaker pattern */
  enableCircuitBreaker: boolean;
}

export interface ProgressiveEnhancementConfig {
  /** Enable progressive enhancement */
  enabled: boolean;
  /** Core functionality without JavaScript */
  coreFeatures: string[];
  /** Enhanced features requiring JavaScript */
  enhancedFeatures: string[];
  /** Feature detection configuration */
  featureDetection: FeatureDetectionConfig;
  /** Graceful degradation rules */
  degradationRules: DegradationRule[];
}

export interface FeatureDetectionConfig {
  /** Features to detect */
  features: {
    javascript: boolean;
    css3: boolean;
    webgl: boolean;
    intersectionObserver: boolean;
    requestAnimationFrame: boolean;
    localStorage: boolean;
    sessionStorage: boolean;
    webWorkers: boolean;
  };
  /** Fallback strategies per feature */
  fallbackStrategies: Record<string, string>;
}

export interface DegradationRule {
  /** Feature identifier */
  feature: string;
  /** Condition for degradation */
  condition: string;
  /** Fallback behavior */
  fallback: string;
  /** Priority level */
  priority: 'low' | 'medium' | 'high';
}

export interface PerformanceMetrics {
  /** Load time metrics */
  loadTime: {
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
  };
  /** Resource metrics */
  resources: {
    totalSize: number;
    imageSize: number;
    cssSize: number;
    jsSize: number;
    fontSize: number;
  };
  /** Device metrics */
  device: {
    cpuScore: number;
    memoryUsage: number;
    networkSpeed: number;
    deviceType: 'mobile' | 'tablet' | 'desktop';
  };
  /** Error metrics */
  errors: {
    totalErrors: number;
    assetErrors: number;
    jsErrors: number;
    networkErrors: number;
  };
}

export interface OptimizationResult {
  /** Whether optimization was successful */
  success: boolean;
  /** Applied optimizations */
  appliedOptimizations: string[];
  /** Performance improvement metrics */
  improvements: {
    loadTimeReduction: number;
    bundleSizeReduction: number;
    errorReduction: number;
  };
  /** Warnings and recommendations */
  warnings: string[];
  /** Error details if optimization failed */
  errors?: string[];
}

// ============================================================================
// PERFORMANCE OPTIMIZATION SYSTEM
// ============================================================================

export class PerformanceOptimizationSystem {
  private config: PerformanceOptimizationConfig;
  private metrics: PerformanceMetrics | null = null;
  private errorLog: Array<{ timestamp: Date; error: string; context: string }> = [];
  private circuitBreakers: Map<string, { failures: number; lastFailure: Date; isOpen: boolean }> = new Map();

  constructor(config: PerformanceOptimizationConfig) {
    this.config = config;
    this.initializePerformanceMonitoring();
    this.setupErrorHandling();
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (!this.config.enableMonitoring) return;

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
    
    // Monitor resource loading
    this.monitorResourceLoading();
    
    // Monitor device performance
    this.monitorDevicePerformance();
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    this.observePerformanceEntry('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') {
        this.updateMetrics('loadTime', 'fcp', entry.startTime);
      }
    });

    // Largest Contentful Paint
    this.observePerformanceEntry('largest-contentful-paint', (entry) => {
      this.updateMetrics('loadTime', 'lcp', entry.startTime);
    });

    // First Input Delay
    this.observePerformanceEntry('first-input', (entry) => {
      this.updateMetrics('loadTime', 'fid', entry.processingStart - entry.startTime);
    });

    // Cumulative Layout Shift
    this.observePerformanceEntry('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        this.updateMetrics('loadTime', 'cls', (this.metrics?.loadTime.cls || 0) + entry.value);
      }
    });
  }

  /**
   * Monitor resource loading
   */
  private monitorResourceLoading(): void {
    if (typeof window === 'undefined') return;

    this.observePerformanceEntry('resource', (entry) => {
      const size = entry.transferSize || 0;
      
      if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
        this.updateMetrics('resources', 'imageSize', (this.metrics?.resources.imageSize || 0) + size);
      } else if (entry.name.match(/\.css$/i)) {
        this.updateMetrics('resources', 'cssSize', (this.metrics?.resources.cssSize || 0) + size);
      } else if (entry.name.match(/\.js$/i)) {
        this.updateMetrics('resources', 'jsSize', (this.metrics?.resources.jsSize || 0) + size);
      } else if (entry.name.match(/\.(woff|woff2|ttf|otf)$/i)) {
        this.updateMetrics('resources', 'fontSize', (this.metrics?.resources.fontSize || 0) + size);
      }

      this.updateMetrics('resources', 'totalSize', (this.metrics?.resources.totalSize || 0) + size);
    });
  }

  /**
   * Monitor device performance
   */
  private monitorDevicePerformance(): void {
    if (typeof window === 'undefined') return;

    // CPU performance estimation
    const startTime = performance.now();
    const iterations = 100000;
    
    for (let i = 0; i < iterations; i++) {
      Math.random();
    }
    
    const endTime = performance.now();
    const cpuScore = iterations / (endTime - startTime);
    
    this.updateMetrics('device', 'cpuScore', cpuScore);

    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.updateMetrics('device', 'memoryUsage', memory.usedJSHeapSize / 1024 / 1024);
    }

    // Network speed estimation
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.updateMetrics('device', 'networkSpeed', connection.downlink || 1);
    }

    // Device type detection
    const deviceType = this.detectDeviceType();
    this.updateMetrics('device', 'deviceType', deviceType);
  }

  /**
   * Detect device type
   */
  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;
    const userAgent = navigator.userAgent;

    if (width < 768 || /Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return width < 480 ? 'mobile' : 'tablet';
    }

    return 'desktop';
  }

  /**
   * Setup error handling
   */
  private setupErrorHandling(): void {
    if (typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError('javascript', event.error?.message || 'Unknown error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('promise', event.reason?.message || 'Unhandled promise rejection', {
        reason: event.reason
      });
    });

    // Resource loading error handler
    window.addEventListener('error', (event) => {
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        this.handleAssetLoadingError(target);
      }
    }, true);
  }

  /**
   * Handle asset loading errors
   */
  private handleAssetLoadingError(element: HTMLElement): void {
    const tagName = element.tagName.toLowerCase();
    const src = element.getAttribute('src') || element.getAttribute('href') || '';

    this.handleError('asset', `Failed to load ${tagName}: ${src}`, { element: tagName, src });

    // Apply fallback based on configuration
    switch (this.config.errorHandling.fallbackBehavior.assetLoadingFailure) {
      case 'placeholder':
        this.applyAssetFallback(element);
        break;
      case 'hide':
        element.style.display = 'none';
        break;
      case 'retry':
        this.retryAssetLoading(element);
        break;
    }
  }

  /**
   * Apply asset fallback
   */
  private applyAssetFallback(element: HTMLElement): void {
    const tagName = element.tagName.toLowerCase();
    const fallbackAssets = this.config.assetOptimization.fallbackAssets;

    switch (tagName) {
      case 'img':
        const img = element as HTMLImageElement;
        const classList = img.className.toLowerCase();
        
        if (classList.includes('hero')) {
          img.src = fallbackAssets.placeholderImages.hero;
        } else if (classList.includes('avatar')) {
          img.src = fallbackAssets.placeholderImages.avatar;
        } else if (classList.includes('logo')) {
          img.src = fallbackAssets.placeholderImages.logo;
        } else {
          img.src = fallbackAssets.placeholderImages.thumbnail;
        }
        break;

      case 'link':
        const link = element as HTMLLinkElement;
        if (link.rel === 'stylesheet') {
          // Apply fallback CSS
          const style = document.createElement('style');
          style.textContent = fallbackAssets.fallbackCSS;
          document.head.appendChild(style);
        }
        break;
    }
  }

  /**
   * Retry asset loading with exponential backoff
   */
  private retryAssetLoading(element: HTMLElement): void {
    const src = element.getAttribute('src') || element.getAttribute('href') || '';
    const circuitBreaker = this.circuitBreakers.get(src) || { failures: 0, lastFailure: new Date(), isOpen: false };

    if (circuitBreaker.isOpen) {
      // Circuit breaker is open, apply fallback
      this.applyAssetFallback(element);
      return;
    }

    if (circuitBreaker.failures >= this.config.errorHandling.recoveryStrategies.maxRetryAttempts) {
      // Max retries reached, open circuit breaker
      circuitBreaker.isOpen = true;
      this.circuitBreakers.set(src, circuitBreaker);
      this.applyAssetFallback(element);
      return;
    }

    // Calculate retry delay with exponential backoff
    const baseDelay = this.config.errorHandling.recoveryStrategies.retryDelay;
    const delay = this.config.errorHandling.recoveryStrategies.enableExponentialBackoff
      ? baseDelay * Math.pow(2, circuitBreaker.failures)
      : baseDelay;

    setTimeout(() => {
      const tagName = element.tagName.toLowerCase();
      
      if (tagName === 'img') {
        const img = element as HTMLImageElement;
        const originalSrc = img.src;
        img.src = '';
        img.src = originalSrc;
      } else if (tagName === 'link') {
        const link = element as HTMLLinkElement;
        const originalHref = link.href;
        link.href = '';
        link.href = originalHref;
      }

      circuitBreaker.failures++;
      circuitBreaker.lastFailure = new Date();
      this.circuitBreakers.set(src, circuitBreaker);
    }, delay);
  }

  /**
   * Handle general errors
   */
  private handleError(type: string, message: string, context: any): void {
    const error = {
      timestamp: new Date(),
      error: `[${type}] ${message}`,
      context: JSON.stringify(context)
    };

    // Add to local error log
    this.errorLog.push(error);

    // Limit error log size
    if (this.errorLog.length > this.config.errorHandling.errorReporting.maxLocalErrors) {
      this.errorLog.shift();
    }

    // Update error metrics
    this.updateMetrics('errors', 'totalErrors', (this.metrics?.errors.totalErrors || 0) + 1);

    switch (type) {
      case 'asset':
        this.updateMetrics('errors', 'assetErrors', (this.metrics?.errors.assetErrors || 0) + 1);
        break;
      case 'javascript':
        this.updateMetrics('errors', 'jsErrors', (this.metrics?.errors.jsErrors || 0) + 1);
        break;
      case 'network':
        this.updateMetrics('errors', 'networkErrors', (this.metrics?.errors.networkErrors || 0) + 1);
        break;
    }

    // Report error if enabled and within sampling rate
    if (this.config.errorHandling.errorReporting.enableReporting &&
        Math.random() < this.config.errorHandling.errorReporting.samplingRate) {
      this.reportError(error);
    }
  }

  /**
   * Report error to analytics (silent failure)
   */
  private reportError(error: { timestamp: Date; error: string; context: string }): void {
    try {
      // Filter sensitive data if enabled
      let errorData = error;
      if (this.config.errorHandling.errorReporting.filterSensitiveData) {
        errorData = this.filterSensitiveData(error);
      }

      // Send to analytics (implementation would depend on analytics provider)
      // This is a placeholder for the actual analytics integration
      console.warn('Error reported:', errorData);
    } catch (reportingError) {
      // Silent failure for error reporting
      console.warn('Failed to report error:', reportingError);
    }
  }

  /**
   * Filter sensitive data from error reports
   */
  private filterSensitiveData(error: { timestamp: Date; error: string; context: string }): typeof error {
    const sensitivePatterns = [
      /password/gi,
      /token/gi,
      /key/gi,
      /secret/gi,
      /auth/gi,
      /session/gi
    ];

    let filteredError = error.error;
    let filteredContext = error.context;

    sensitivePatterns.forEach(pattern => {
      filteredError = filteredError.replace(pattern, '[FILTERED]');
      filteredContext = filteredContext.replace(pattern, '[FILTERED]');
    });

    return {
      ...error,
      error: filteredError,
      context: filteredContext
    };
  }

  /**
   * Optimize template based on device performance
   */
  public optimizeForDevice(template: any): OptimizationResult {
    const deviceTier = this.getDeviceTier();
    const strategy = this.config.deviceOptimization.optimizationStrategies[deviceTier];
    const appliedOptimizations: string[] = [];

    try {
      // Apply device-specific optimizations
      if (strategy.disableAnimations) {
        this.disableAnimations(template);
        appliedOptimizations.push('disabled_animations');
      }

      if (strategy.reduceImageQuality) {
        this.reduceImageQuality(template);
        appliedOptimizations.push('reduced_image_quality');
      }

      if (strategy.disableGamification) {
        this.disableGamification(template);
        appliedOptimizations.push('disabled_gamification');
      }

      if (strategy.limitInteractivity) {
        this.limitInteractivity(template);
        appliedOptimizations.push('limited_interactivity');
      }

      if (strategy.useSimplifiedLayouts) {
        this.useSimplifiedLayouts(template);
        appliedOptimizations.push('simplified_layouts');
      }

      if (strategy.deferNonCritical) {
        this.deferNonCriticalResources(template);
        appliedOptimizations.push('deferred_non_critical');
      }

      return {
        success: true,
        appliedOptimizations,
        improvements: this.calculateImprovements(appliedOptimizations),
        warnings: []
      };
    } catch (error) {
      return {
        success: false,
        appliedOptimizations,
        improvements: { loadTimeReduction: 0, bundleSizeReduction: 0, errorReduction: 0 },
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Unknown optimization error']
      };
    }
  }

  /**
   * Get device performance tier
   */
  private getDeviceTier(): 'lowEnd' | 'midRange' | 'highEnd' {
    if (!this.metrics) return 'midRange';

    const { cpuScore, memoryUsage, networkSpeed } = this.metrics.device;
    const { cpuThresholds, memoryThresholds, networkThresholds } = this.config.deviceOptimization;

    const isLowCPU = cpuScore < cpuThresholds.low;
    const isLowMemory = memoryUsage > memoryThresholds.low;
    const isSlowNetwork = networkSpeed < networkThresholds.slow;

    if (isLowCPU || isLowMemory || isSlowNetwork) {
      return 'lowEnd';
    }

    const isHighCPU = cpuScore > cpuThresholds.high;
    const isHighMemory = memoryUsage < memoryThresholds.high;
    const isFastNetwork = networkSpeed > networkThresholds.fast;

    if (isHighCPU && isHighMemory && isFastNetwork) {
      return 'highEnd';
    }

    return 'midRange';
  }

  /**
   * Disable animations for low-performance devices
   */
  private disableAnimations(template: any): void {
    if (template.interactiveComponents?.animations) {
      template.interactiveComponents.animations = template.interactiveComponents.animations.map((animation: any) => ({
        ...animation,
        enabled: false,
        fallback: 'static'
      }));
    }
  }

  /**
   * Reduce image quality for low-performance devices
   */
  private reduceImageQuality(template: any): void {
    if (template.enterpriseFeatures?.professionalAssets) {
      template.enterpriseFeatures.professionalAssets = template.enterpriseFeatures.professionalAssets.map((asset: any) => {
        if (asset.type === 'image') {
          return {
            ...asset,
            quality: Math.min(asset.quality || 80, 60),
            format: 'webp'
          };
        }
        return asset;
      });
    }
  }

  /**
   * Disable gamification for low-performance devices
   */
  private disableGamification(template: any): void {
    if (template.gamificationElements) {
      template.gamificationElements = {
        ...template.gamificationElements,
        enabled: false,
        fallbackMode: 'static'
      };
    }
  }

  /**
   * Limit interactivity for low-performance devices
   */
  private limitInteractivity(template: any): void {
    if (template.interactiveComponents) {
      template.interactiveComponents = {
        ...template.interactiveComponents,
        maxConcurrentAnimations: 2,
        disableParallax: true,
        simplifyTransitions: true
      };
    }
  }

  /**
   * Use simplified layouts for low-performance devices
   */
  private useSimplifiedLayouts(template: any): void {
    if (template.components) {
      template.components = template.components.map((component: any) => ({
        ...component,
        layout: 'simple',
        removeComplexElements: true
      }));
    }
  }

  /**
   * Defer non-critical resources
   */
  private deferNonCriticalResources(template: any): void {
    if (template.enterpriseFeatures?.professionalAssets) {
      template.enterpriseFeatures.professionalAssets = template.enterpriseFeatures.professionalAssets.map((asset: any) => ({
        ...asset,
        loading: asset.critical ? 'eager' : 'lazy',
        defer: !asset.critical
      }));
    }
  }

  /**
   * Calculate performance improvements
   */
  private calculateImprovements(optimizations: string[]): { loadTimeReduction: number; bundleSizeReduction: number; errorReduction: number } {
    let loadTimeReduction = 0;
    let bundleSizeReduction = 0;
    let errorReduction = 0;

    optimizations.forEach(optimization => {
      switch (optimization) {
        case 'disabled_animations':
          loadTimeReduction += 15;
          bundleSizeReduction += 10;
          break;
        case 'reduced_image_quality':
          loadTimeReduction += 25;
          bundleSizeReduction += 40;
          break;
        case 'disabled_gamification':
          loadTimeReduction += 10;
          bundleSizeReduction += 15;
          errorReduction += 20;
          break;
        case 'limited_interactivity':
          loadTimeReduction += 12;
          bundleSizeReduction += 8;
          errorReduction += 15;
          break;
        case 'simplified_layouts':
          loadTimeReduction += 8;
          bundleSizeReduction += 5;
          break;
        case 'deferred_non_critical':
          loadTimeReduction += 20;
          break;
      }
    });

    return { loadTimeReduction, bundleSizeReduction, errorReduction };
  }

  /**
   * Observe performance entries
   */
  private observePerformanceEntry(entryType: string, callback: (entry: any) => void): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      observer.observe({ entryTypes: [entryType] });
    } catch (error) {
      // Silent failure for performance observation
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  /**
   * Update performance metrics
   */
  private updateMetrics(category: keyof PerformanceMetrics, metric: string, value: any): void {
    if (!this.metrics) {
      this.metrics = {
        loadTime: { fcp: 0, lcp: 0, fid: 0, cls: 0, ttfb: 0 },
        resources: { totalSize: 0, imageSize: 0, cssSize: 0, jsSize: 0, fontSize: 0 },
        device: { cpuScore: 0, memoryUsage: 0, networkSpeed: 0, deviceType: 'desktop' },
        errors: { totalErrors: 0, assetErrors: 0, jsErrors: 0, networkErrors: 0 }
      };
    }

    (this.metrics[category] as any)[metric] = value;
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  /**
   * Get error log
   */
  public getErrorLog(): Array<{ timestamp: Date; error: string; context: string }> {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Check if performance budget is exceeded
   */
  public checkPerformanceBudget(): { exceeded: boolean; violations: string[] } {
    if (!this.metrics) {
      return { exceeded: false, violations: [] };
    }

    const violations: string[] = [];
    const budget = this.config.performanceBudget;

    if (this.metrics.loadTime.fcp > budget.maxFCP) {
      violations.push(`First Contentful Paint: ${this.metrics.loadTime.fcp}ms > ${budget.maxFCP}ms`);
    }

    if (this.metrics.loadTime.lcp > budget.maxLCP) {
      violations.push(`Largest Contentful Paint: ${this.metrics.loadTime.lcp}ms > ${budget.maxLCP}ms`);
    }

    if (this.metrics.loadTime.fid > budget.maxFID) {
      violations.push(`First Input Delay: ${this.metrics.loadTime.fid}ms > ${budget.maxFID}ms`);
    }

    if (this.metrics.loadTime.cls > budget.maxCLS) {
      violations.push(`Cumulative Layout Shift: ${this.metrics.loadTime.cls} > ${budget.maxCLS}`);
    }

    if (this.metrics.resources.totalSize > budget.maxBundleSize * 1024) {
      violations.push(`Bundle size: ${Math.round(this.metrics.resources.totalSize / 1024)}KB > ${budget.maxBundleSize}KB`);
    }

    return {
      exceeded: violations.length > 0,
      violations
    };
  }
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_PERFORMANCE_CONFIG: PerformanceOptimizationConfig = {
  enableMonitoring: true,
  performanceBudget: {
    maxLoadTime: 3000,
    maxFCP: 1800,
    maxLCP: 2500,
    maxFID: 100,
    maxCLS: 0.1,
    maxBundleSize: 500,
    maxImageSize: 200
  },
  deviceOptimization: {
    enableDeviceDetection: true,
    cpuThresholds: { low: 50, medium: 100, high: 200 },
    memoryThresholds: { low: 512, medium: 1024, high: 2048 },
    networkThresholds: { slow: 1, fast: 10 },
    optimizationStrategies: {
      lowEnd: {
        disableAnimations: true,
        reduceImageQuality: true,
        disableGamification: true,
        limitInteractivity: true,
        useSimplifiedLayouts: true,
        deferNonCritical: true
      },
      midRange: {
        disableAnimations: false,
        reduceImageQuality: true,
        disableGamification: false,
        limitInteractivity: false,
        useSimplifiedLayouts: false,
        deferNonCritical: true
      },
      highEnd: {
        disableAnimations: false,
        reduceImageQuality: false,
        disableGamification: false,
        limitInteractivity: false,
        useSimplifiedLayouts: false,
        deferNonCritical: false
      }
    }
  },
  assetOptimization: {
    enableLazyLoading: true,
    enableImageCompression: true,
    enableModernFormats: true,
    enableCSSMinification: true,
    enableJSMinification: true,
    enablePreloading: true,
    fallbackAssets: {
      placeholderImages: {
        hero: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlcm8gSW1hZ2U8L3RleHQ+PC9zdmc+',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==',
        avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BdmF0YXI8L3RleHQ+PC9zdmc+',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvZ288L3RleHQ+PC9zdmc+'
      },
      fallbackFonts: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      fallbackColors: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#28a745',
        background: '#ffffff',
        text: '#212529'
      },
      fallbackCSS: `
        * { box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; margin: 0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .btn { display: inline-block; padding: 0.5rem 1rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
        .btn:hover { background: #0056b3; }
      `
    }
  },
  errorHandling: {
    enableSilentHandling: true,
    enableLocalTracking: true,
    errorReporting: {
      enableReporting: true,
      maxLocalErrors: 100,
      samplingRate: 0.1,
      filterSensitiveData: true
    },
    fallbackBehavior: {
      assetLoadingFailure: 'placeholder',
      animationFailure: 'static',
      gamificationFailure: 'disable',
      analyticsFailure: 'local',
      interactiveFailure: 'static'
    },
    recoveryStrategies: {
      enableAutoRetry: true,
      maxRetryAttempts: 3,
      retryDelay: 1000,
      enableExponentialBackoff: true,
      enableCircuitBreaker: true
    }
  },
  progressiveEnhancement: {
    enabled: true,
    coreFeatures: ['navigation', 'content', 'forms', 'basic_styling'],
    enhancedFeatures: ['animations', 'gamification', 'interactive_elements', 'analytics'],
    featureDetection: {
      features: {
        javascript: true,
        css3: true,
        webgl: true,
        intersectionObserver: true,
        requestAnimationFrame: true,
        localStorage: true,
        sessionStorage: true,
        webWorkers: true
      },
      fallbackStrategies: {
        javascript: 'static_content',
        css3: 'basic_styles',
        webgl: 'canvas_fallback',
        intersectionObserver: 'scroll_events',
        requestAnimationFrame: 'set_timeout',
        localStorage: 'session_storage',
        sessionStorage: 'memory_storage',
        webWorkers: 'main_thread'
      }
    },
    degradationRules: [
      { feature: 'animations', condition: 'low_performance', fallback: 'static', priority: 'medium' },
      { feature: 'gamification', condition: 'javascript_disabled', fallback: 'static_content', priority: 'low' },
      { feature: 'interactive_elements', condition: 'touch_device', fallback: 'simplified_interactions', priority: 'high' },
      { feature: 'analytics', condition: 'privacy_mode', fallback: 'local_tracking', priority: 'low' }
    ]
  }
};

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Create a performance optimization system with default or custom configuration
 */
export function createPerformanceOptimizationSystem(
  config: Partial<PerformanceOptimizationConfig> = {}
): PerformanceOptimizationSystem {
  const mergedConfig = {
    ...DEFAULT_PERFORMANCE_CONFIG,
    ...config,
    performanceBudget: { ...DEFAULT_PERFORMANCE_CONFIG.performanceBudget, ...config.performanceBudget },
    deviceOptimization: { ...DEFAULT_PERFORMANCE_CONFIG.deviceOptimization, ...config.deviceOptimization },
    assetOptimization: { ...DEFAULT_PERFORMANCE_CONFIG.assetOptimization, ...config.assetOptimization },
    errorHandling: { ...DEFAULT_PERFORMANCE_CONFIG.errorHandling, ...config.errorHandling },
    progressiveEnhancement: { ...DEFAULT_PERFORMANCE_CONFIG.progressiveEnhancement, ...config.progressiveEnhancement }
  };

  return new PerformanceOptimizationSystem(mergedConfig);
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const performanceOptimizationSystem = createPerformanceOptimizationSystem();