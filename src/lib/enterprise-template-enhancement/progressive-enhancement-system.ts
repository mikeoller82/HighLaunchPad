/**
 * Progressive Enhancement System
 * 
 * This module ensures that templates work without JavaScript and progressively
 * enhance with additional features when JavaScript is available. It provides
 * graceful degradation and accessibility compliance.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ProgressiveEnhancementConfig {
  /** Enable progressive enhancement */
  enabled: boolean;
  /** Core functionality that works without JavaScript */
  coreFeatures: CoreFeature[];
  /** Enhanced features that require JavaScript */
  enhancedFeatures: EnhancedFeature[];
  /** Feature detection configuration */
  featureDetection: FeatureDetectionConfig;
  /** Graceful degradation rules */
  degradationRules: DegradationRule[];
  /** Accessibility requirements */
  accessibility: AccessibilityConfig;
}

export interface CoreFeature {
  /** Feature identifier */
  id: string;
  /** Feature name */
  name: string;
  /** Feature description */
  description: string;
  /** Required HTML elements */
  requiredElements: string[];
  /** Required CSS classes */
  requiredCSS: string[];
  /** Fallback behavior */
  fallback: string;
  /** Priority level */
  priority: 'critical' | 'important' | 'optional';
}

export interface EnhancedFeature {
  /** Feature identifier */
  id: string;
  /** Feature name */
  name: string;
  /** Feature description */
  description: string;
  /** Dependencies */
  dependencies: string[];
  /** Fallback feature ID */
  fallbackFeature?: string;
  /** Enhancement level */
  level: 'basic' | 'advanced' | 'premium';
  /** Performance impact */
  performanceImpact: 'low' | 'medium' | 'high';
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
    touchEvents: boolean;
    geolocation: boolean;
    notifications: boolean;
    serviceWorker: boolean;
  };
  /** Detection methods */
  detectionMethods: Record<string, () => boolean>;
  /** Fallback strategies */
  fallbackStrategies: Record<string, string>;
  /** Feature support cache */
  cacheResults: boolean;
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
  /** Custom handler function */
  handler?: (element: HTMLElement) => void;
}

export interface AccessibilityConfig {
  /** WCAG compliance level */
  wcagLevel: 'A' | 'AA' | 'AAA';
  /** Enable keyboard navigation */
  enableKeyboardNavigation: boolean;
  /** Enable screen reader support */
  enableScreenReaderSupport: boolean;
  /** Enable high contrast mode */
  enableHighContrastMode: boolean;
  /** Enable reduced motion support */
  enableReducedMotionSupport: boolean;
  /** ARIA label configuration */
  ariaLabels: Record<string, string>;
  /** Focus management */
  focusManagement: FocusManagementConfig;
}

export interface FocusManagementConfig {
  /** Enable focus trapping */
  enableFocusTrapping: boolean;
  /** Focus outline style */
  focusOutlineStyle: string;
  /** Skip links configuration */
  skipLinks: SkipLinkConfig[];
  /** Focus restoration */
  enableFocusRestoration: boolean;
}

export interface SkipLinkConfig {
  /** Link text */
  text: string;
  /** Target element selector */
  target: string;
  /** Position in tab order */
  tabIndex: number;
}

export interface FeatureSupportResult {
  /** Feature identifier */
  feature: string;
  /** Whether feature is supported */
  supported: boolean;
  /** Fallback strategy if not supported */
  fallback?: string;
  /** Detection method used */
  detectionMethod: string;
  /** Detection timestamp */
  timestamp: Date;
}

export interface EnhancementResult {
  /** Whether enhancement was successful */
  success: boolean;
  /** Applied enhancements */
  appliedEnhancements: string[];
  /** Fallbacks used */
  fallbacksUsed: string[];
  /** Accessibility features enabled */
  accessibilityFeatures: string[];
  /** Warnings */
  warnings: string[];
  /** Errors */
  errors: string[];
}

// ============================================================================
// PROGRESSIVE ENHANCEMENT SYSTEM
// ============================================================================

export class ProgressiveEnhancementSystem {
  private config: ProgressiveEnhancementConfig;
  private featureSupport: Map<string, FeatureSupportResult> = new Map();
  private enhancementCache: Map<string, EnhancementResult> = new Map();

  constructor(config: ProgressiveEnhancementConfig) {
    this.config = config;
    this.initializeFeatureDetection();
    this.setupAccessibilityListeners();
  }

  /**
   * Initialize feature detection
   */
  private initializeFeatureDetection(): void {
    if (typeof window === 'undefined') return;

    // Detect all configured features
    Object.entries(this.config.featureDetection.features).forEach(([feature, enabled]) => {
      if (enabled) {
        this.detectFeature(feature);
      }
    });

    // Setup media query listeners for responsive features
    this.setupMediaQueryListeners();

    // Setup accessibility preference listeners
    this.setupAccessibilityListeners();
  }

  /**
   * Detect individual feature support
   */
  private detectFeature(feature: string): void {
    const detectionMethod = this.config.featureDetection.detectionMethods[feature];
    let supported = false;
    let detectionMethodName = 'default';

    try {
      if (detectionMethod) {
        supported = detectionMethod();
        detectionMethodName = 'custom';
      } else {
        // Default detection methods
        switch (feature) {
          case 'javascript':
            supported = true; // If this code runs, JS is supported
            detectionMethodName = 'execution';
            break;

          case 'css3':
            supported = this.detectCSS3Support();
            detectionMethodName = 'css_property_test';
            break;

          case 'webgl':
            supported = this.detectWebGLSupport();
            detectionMethodName = 'canvas_context_test';
            break;

          case 'intersectionObserver':
            supported = 'IntersectionObserver' in window;
            detectionMethodName = 'api_availability';
            break;

          case 'requestAnimationFrame':
            supported = 'requestAnimationFrame' in window;
            detectionMethodName = 'api_availability';
            break;

          case 'localStorage':
            supported = this.detectLocalStorageSupport();
            detectionMethodName = 'storage_test';
            break;

          case 'sessionStorage':
            supported = this.detectSessionStorageSupport();
            detectionMethodName = 'storage_test';
            break;

          case 'webWorkers':
            supported = 'Worker' in window;
            detectionMethodName = 'api_availability';
            break;

          case 'touchEvents':
            supported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            detectionMethodName = 'event_availability';
            break;

          case 'geolocation':
            supported = 'geolocation' in navigator;
            detectionMethodName = 'api_availability';
            break;

          case 'notifications':
            supported = 'Notification' in window;
            detectionMethodName = 'api_availability';
            break;

          case 'serviceWorker':
            supported = 'serviceWorker' in navigator;
            detectionMethodName = 'api_availability';
            break;

          default:
            supported = false;
            detectionMethodName = 'unknown';
        }
      }
    } catch (error) {
      supported = false;
      detectionMethodName = 'error';
    }

    const result: FeatureSupportResult = {
      feature,
      supported,
      fallback: supported ? undefined : this.config.featureDetection.fallbackStrategies[feature],
      detectionMethod: detectionMethodName,
      timestamp: new Date()
    };

    this.featureSupport.set(feature, result);

    // Cache results if enabled
    if (this.config.featureDetection.cacheResults) {
      this.cacheFeatureSupport(feature, result);
    }
  }

  /**
   * Detect CSS3 support
   */
  private detectCSS3Support(): boolean {
    const testElement = document.createElement('div');
    const css3Properties = [
      'transform',
      'transition',
      'animation',
      'borderRadius',
      'boxShadow',
      'textShadow',
      'gradient'
    ];

    return css3Properties.some(property => {
      const prefixes = ['', '-webkit-', '-moz-', '-ms-', '-o-'];
      return prefixes.some(prefix => {
        const fullProperty = prefix + property;
        return fullProperty in testElement.style;
      });
    });
  }

  /**
   * Detect WebGL support
   */
  private detectWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!context;
    } catch (error) {
      return false;
    }
  }

  /**
   * Detect localStorage support
   */
  private detectLocalStorageSupport(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Detect sessionStorage support
   */
  private detectSessionStorageSupport(): boolean {
    try {
      const testKey = '__test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Setup media query listeners
   */
  private setupMediaQueryListeners(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    // Reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addListener((e) => {
      this.handleReducedMotionChange(e.matches);
    });
    this.handleReducedMotionChange(reducedMotionQuery.matches);

    // High contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    highContrastQuery.addListener((e) => {
      this.handleHighContrastChange(e.matches);
    });
    this.handleHighContrastChange(highContrastQuery.matches);

    // Color scheme preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addListener((e) => {
      this.handleColorSchemeChange(e.matches ? 'dark' : 'light');
    });
    this.handleColorSchemeChange(darkModeQuery.matches ? 'dark' : 'light');
  }

  /**
   * Setup accessibility listeners
   */
  private setupAccessibilityListeners(): void {
    if (typeof window === 'undefined') return;

    // Keyboard navigation
    if (this.config.accessibility.enableKeyboardNavigation) {
      this.setupKeyboardNavigation();
    }

    // Focus management
    if (this.config.accessibility.focusManagement.enableFocusTrapping) {
      this.setupFocusTrapping();
    }

    // Skip links
    this.setupSkipLinks();
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (event) => {
      // Handle common keyboard shortcuts
      switch (event.key) {
        case 'Tab':
          this.handleTabNavigation(event);
          break;
        case 'Enter':
        case ' ':
          this.handleActivation(event);
          break;
        case 'Escape':
          this.handleEscape(event);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          this.handleArrowNavigation(event);
          break;
      }
    });
  }

  /**
   * Handle tab navigation
   */
  private handleTabNavigation(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

    if (event.shiftKey) {
      // Shift+Tab (backward)
      if (currentIndex <= 0) {
        event.preventDefault();
        focusableElements[focusableElements.length - 1]?.focus();
      }
    } else {
      // Tab (forward)
      if (currentIndex >= focusableElements.length - 1) {
        event.preventDefault();
        focusableElements[0]?.focus();
      }
    }
  }

  /**
   * Get focusable elements
   */
  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
  }

  /**
   * Handle activation (Enter/Space)
   */
  private handleActivation(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    
    if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
      target.click();
    }
  }

  /**
   * Handle escape key
   */
  private handleEscape(event: KeyboardEvent): void {
    // Close modals, dropdowns, etc.
    const modals = document.querySelectorAll('[role="dialog"], .modal, .dropdown-menu');
    modals.forEach(modal => {
      if (modal.classList.contains('show') || modal.hasAttribute('open')) {
        (modal as HTMLElement).style.display = 'none';
        modal.removeAttribute('open');
        modal.classList.remove('show');
      }
    });
  }

  /**
   * Handle arrow navigation
   */
  private handleArrowNavigation(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const role = target.getAttribute('role');

    if (role === 'menuitem' || role === 'tab' || role === 'option') {
      event.preventDefault();
      this.navigateWithArrows(target, event.key);
    }
  }

  /**
   * Navigate with arrow keys
   */
  private navigateWithArrows(element: HTMLElement, key: string): void {
    const parent = element.closest('[role="menu"], [role="tablist"], [role="listbox"]');
    if (!parent) return;

    const items = Array.from(parent.querySelectorAll('[role="menuitem"], [role="tab"], [role="option"]')) as HTMLElement[];
    const currentIndex = items.indexOf(element);

    let nextIndex = currentIndex;

    switch (key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
    }

    items[nextIndex]?.focus();
  }

  /**
   * Setup focus trapping
   */
  private setupFocusTrapping(): void {
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement;
      const modal = target.closest('[role="dialog"], .modal');
      
      if (modal) {
        const focusableElements = this.getFocusableElementsInContainer(modal as HTMLElement);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!modal.contains(target)) {
          firstElement.focus();
        }
      }
    });
  }

  /**
   * Get focusable elements in container
   */
  private getFocusableElementsInContainer(container: HTMLElement): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  }

  /**
   * Setup skip links
   */
  private setupSkipLinks(): void {
    this.config.accessibility.focusManagement.skipLinks.forEach(skipLink => {
      const link = document.createElement('a');
      link.href = `#${skipLink.target}`;
      link.textContent = skipLink.text;
      link.className = 'skip-link';
      link.tabIndex = skipLink.tabIndex;
      
      // Style skip link
      Object.assign(link.style, {
        position: 'absolute',
        top: '-40px',
        left: '6px',
        background: '#000',
        color: '#fff',
        padding: '8px',
        textDecoration: 'none',
        zIndex: '100000',
        borderRadius: '4px'
      });

      // Show on focus
      link.addEventListener('focus', () => {
        link.style.top = '6px';
      });

      link.addEventListener('blur', () => {
        link.style.top = '-40px';
      });

      document.body.insertBefore(link, document.body.firstChild);
    });
  }

  /**
   * Handle reduced motion preference change
   */
  private handleReducedMotionChange(reducedMotion: boolean): void {
    if (reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
      document.body.classList.add('reduce-motion');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
      document.documentElement.style.removeProperty('--transition-duration');
      document.body.classList.remove('reduce-motion');
    }
  }

  /**
   * Handle high contrast preference change
   */
  private handleHighContrastChange(highContrast: boolean): void {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }

  /**
   * Handle color scheme preference change
   */
  private handleColorSchemeChange(scheme: 'light' | 'dark'): void {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${scheme}-theme`);
  }

  /**
   * Cache feature support result
   */
  private cacheFeatureSupport(feature: string, result: FeatureSupportResult): void {
    try {
      const cacheKey = `feature_support_${feature}`;
      const cacheData = {
        ...result,
        timestamp: result.timestamp.toISOString()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      // Silent failure for caching
    }
  }

  /**
   * Get cached feature support
   */
  private getCachedFeatureSupport(feature: string): FeatureSupportResult | null {
    try {
      const cacheKey = `feature_support_${feature}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        return {
          ...data,
          timestamp: new Date(data.timestamp)
        };
      }
    } catch (error) {
      // Silent failure for cache retrieval
    }
    return null;
  }

  /**
   * Enhance template with progressive enhancement
   */
  public enhanceTemplate(template: any): EnhancementResult {
    const appliedEnhancements: string[] = [];
    const fallbacksUsed: string[] = [];
    const accessibilityFeatures: string[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      // Apply core features (always available)
      this.config.coreFeatures.forEach(feature => {
        try {
          this.applyCoreFeature(template, feature);
          appliedEnhancements.push(feature.id);
        } catch (error) {
          errors.push(`Failed to apply core feature ${feature.id}: ${error}`);
        }
      });

      // Apply enhanced features (based on support)
      this.config.enhancedFeatures.forEach(feature => {
        const canApply = this.canApplyEnhancedFeature(feature);
        
        if (canApply) {
          try {
            this.applyEnhancedFeature(template, feature);
            appliedEnhancements.push(feature.id);
          } catch (error) {
            errors.push(`Failed to apply enhanced feature ${feature.id}: ${error}`);
            
            // Apply fallback if available
            if (feature.fallbackFeature) {
              const fallbackFeature = this.config.coreFeatures.find(f => f.id === feature.fallbackFeature);
              if (fallbackFeature) {
                this.applyCoreFeature(template, fallbackFeature);
                fallbacksUsed.push(feature.fallbackFeature);
              }
            }
          }
        } else {
          // Feature not supported, use fallback
          if (feature.fallbackFeature) {
            const fallbackFeature = this.config.coreFeatures.find(f => f.id === feature.fallbackFeature);
            if (fallbackFeature) {
              this.applyCoreFeature(template, fallbackFeature);
              fallbacksUsed.push(feature.fallbackFeature);
            }
          }
          warnings.push(`Enhanced feature ${feature.id} not supported, using fallback`);
        }
      });

      // Apply accessibility features
      if (this.config.accessibility.enableKeyboardNavigation) {
        this.applyKeyboardNavigation(template);
        accessibilityFeatures.push('keyboard_navigation');
      }

      if (this.config.accessibility.enableScreenReaderSupport) {
        this.applyScreenReaderSupport(template);
        accessibilityFeatures.push('screen_reader_support');
      }

      if (this.config.accessibility.enableHighContrastMode) {
        this.applyHighContrastMode(template);
        accessibilityFeatures.push('high_contrast_mode');
      }

      if (this.config.accessibility.enableReducedMotionSupport) {
        this.applyReducedMotionSupport(template);
        accessibilityFeatures.push('reduced_motion_support');
      }

      // Apply degradation rules
      this.config.degradationRules.forEach(rule => {
        if (this.shouldApplyDegradationRule(rule)) {
          this.applyDegradationRule(template, rule);
          fallbacksUsed.push(rule.fallback);
        }
      });

      return {
        success: errors.length === 0,
        appliedEnhancements,
        fallbacksUsed,
        accessibilityFeatures,
        warnings,
        errors
      };
    } catch (error) {
      return {
        success: false,
        appliedEnhancements,
        fallbacksUsed,
        accessibilityFeatures,
        warnings,
        errors: [error instanceof Error ? error.message : 'Unknown enhancement error']
      };
    }
  }

  /**
   * Apply core feature to template
   */
  private applyCoreFeature(template: any, feature: CoreFeature): void {
    // Implementation would depend on the specific feature
    // This is a placeholder for the actual feature application logic
    
    switch (feature.id) {
      case 'navigation':
        this.applyCoreNavigation(template);
        break;
      case 'content':
        this.applyCoreContent(template);
        break;
      case 'forms':
        this.applyCoreForms(template);
        break;
      case 'basic_styling':
        this.applyCoreBasicStyling(template);
        break;
      default:
        console.warn(`Unknown core feature: ${feature.id}`);
    }
  }

  /**
   * Apply enhanced feature to template
   */
  private applyEnhancedFeature(template: any, feature: EnhancedFeature): void {
    // Implementation would depend on the specific feature
    // This is a placeholder for the actual feature application logic
    
    switch (feature.id) {
      case 'animations':
        this.applyAnimations(template);
        break;
      case 'gamification':
        this.applyGamification(template);
        break;
      case 'interactive_elements':
        this.applyInteractiveElements(template);
        break;
      case 'analytics':
        this.applyAnalytics(template);
        break;
      default:
        console.warn(`Unknown enhanced feature: ${feature.id}`);
    }
  }

  /**
   * Check if enhanced feature can be applied
   */
  private canApplyEnhancedFeature(feature: EnhancedFeature): boolean {
    return feature.dependencies.every(dependency => {
      const support = this.featureSupport.get(dependency);
      return support?.supported === true;
    });
  }

  /**
   * Apply core navigation
   */
  private applyCoreNavigation(template: any): void {
    // Ensure navigation works without JavaScript
    if (template.components) {
      template.components.forEach((component: any) => {
        if (component.type === 'navigation') {
          // Add proper HTML structure for navigation
          component.enhancedHTML = this.generateAccessibleNavigation(component);
        }
      });
    }
  }

  /**
   * Apply core content
   */
  private applyCoreContent(template: any): void {
    // Ensure content is accessible and semantic
    if (template.components) {
      template.components.forEach((component: any) => {
        if (component.content) {
          component.enhancedHTML = this.generateSemanticContent(component);
        }
      });
    }
  }

  /**
   * Apply core forms
   */
  private applyCoreForms(template: any): void {
    // Ensure forms work without JavaScript
    if (template.components) {
      template.components.forEach((component: any) => {
        if (component.type === 'contact' || component.type === 'newsletter') {
          component.enhancedHTML = this.generateAccessibleForm(component);
        }
      });
    }
  }

  /**
   * Apply core basic styling
   */
  private applyCoreBasicStyling(template: any): void {
    // Apply basic CSS that works everywhere
    template.fallbackCSS = this.generateFallbackCSS();
  }

  /**
   * Apply animations
   */
  private applyAnimations(template: any): void {
    // Add CSS animations and transitions
    if (template.interactiveComponents?.animations) {
      template.interactiveComponents.animations.forEach((animation: any) => {
        animation.progressiveEnhancement = true;
        animation.fallback = 'static';
      });
    }
  }

  /**
   * Apply gamification
   */
  private applyGamification(template: any): void {
    // Add gamification elements with fallbacks
    if (template.gamificationElements) {
      template.gamificationElements.progressiveEnhancement = true;
      template.gamificationElements.fallback = 'static_content';
    }
  }

  /**
   * Apply interactive elements
   */
  private applyInteractiveElements(template: any): void {
    // Add interactive features with fallbacks
    if (template.interactiveComponents) {
      template.interactiveComponents.progressiveEnhancement = true;
      template.interactiveComponents.fallback = 'static_elements';
    }
  }

  /**
   * Apply analytics
   */
  private applyAnalytics(template: any): void {
    // Add analytics with privacy considerations
    if (template.functionalFeatures?.analyticsConfig) {
      template.functionalFeatures.analyticsConfig.progressiveEnhancement = true;
      template.functionalFeatures.analyticsConfig.fallback = 'local_tracking';
    }
  }

  /**
   * Apply keyboard navigation
   */
  private applyKeyboardNavigation(template: any): void {
    // Add keyboard navigation support
    template.accessibility = template.accessibility || {};
    template.accessibility.keyboardNavigation = true;
    template.accessibility.tabIndex = this.generateTabIndexes(template);
  }

  /**
   * Apply screen reader support
   */
  private applyScreenReaderSupport(template: any): void {
    // Add ARIA labels and screen reader support
    template.accessibility = template.accessibility || {};
    template.accessibility.screenReaderSupport = true;
    template.accessibility.ariaLabels = this.config.accessibility.ariaLabels;
  }

  /**
   * Apply high contrast mode
   */
  private applyHighContrastMode(template: any): void {
    // Add high contrast styles
    template.accessibility = template.accessibility || {};
    template.accessibility.highContrastMode = true;
    template.accessibility.contrastCSS = this.generateHighContrastCSS();
  }

  /**
   * Apply reduced motion support
   */
  private applyReducedMotionSupport(template: any): void {
    // Add reduced motion styles
    template.accessibility = template.accessibility || {};
    template.accessibility.reducedMotionSupport = true;
    template.accessibility.reducedMotionCSS = this.generateReducedMotionCSS();
  }

  /**
   * Check if degradation rule should be applied
   */
  private shouldApplyDegradationRule(rule: DegradationRule): boolean {
    // Implementation would depend on the specific condition
    switch (rule.condition) {
      case 'low_performance':
        return this.isLowPerformanceDevice();
      case 'javascript_disabled':
        return !this.featureSupport.get('javascript')?.supported;
      case 'touch_device':
        return this.featureSupport.get('touchEvents')?.supported === true;
      case 'privacy_mode':
        return !this.featureSupport.get('localStorage')?.supported;
      default:
        return false;
    }
  }

  /**
   * Apply degradation rule
   */
  private applyDegradationRule(template: any, rule: DegradationRule): void {
    if (rule.handler) {
      // Use custom handler if provided
      const elements = document.querySelectorAll(`[data-feature="${rule.feature}"]`);
      elements.forEach(element => rule.handler!(element as HTMLElement));
    } else {
      // Apply default fallback behavior
      this.applyDefaultFallback(template, rule);
    }
  }

  /**
   * Apply default fallback behavior
   */
  private applyDefaultFallback(template: any, rule: DegradationRule): void {
    switch (rule.fallback) {
      case 'static':
        this.makeFeatureStatic(template, rule.feature);
        break;
      case 'static_content':
        this.convertToStaticContent(template, rule.feature);
        break;
      case 'simplified_interactions':
        this.simplifyInteractions(template, rule.feature);
        break;
      case 'local_tracking':
        this.enableLocalTracking(template, rule.feature);
        break;
      default:
        console.warn(`Unknown fallback behavior: ${rule.fallback}`);
    }
  }

  /**
   * Make feature static
   */
  private makeFeatureStatic(template: any, feature: string): void {
    // Remove dynamic behavior from feature
    if (template[feature]) {
      template[feature].static = true;
      template[feature].interactive = false;
    }
  }

  /**
   * Convert to static content
   */
  private convertToStaticContent(template: any, feature: string): void {
    // Convert dynamic content to static HTML
    if (template[feature]) {
      template[feature].contentType = 'static';
      template[feature].dynamicContent = false;
    }
  }

  /**
   * Simplify interactions
   */
  private simplifyInteractions(template: any, feature: string): void {
    // Reduce complexity of interactions
    if (template[feature]) {
      template[feature].simplified = true;
      template[feature].complexInteractions = false;
    }
  }

  /**
   * Enable local tracking
   */
  private enableLocalTracking(template: any, feature: string): void {
    // Use local storage instead of external analytics
    if (template[feature] && typeof template[feature] === 'object') {
      template[feature].trackingMode = 'local';
      template[feature].externalTracking = false;
    }
  }

  /**
   * Check if device is low performance
   */
  private isLowPerformanceDevice(): boolean {
    // Simple heuristic for low performance detection
    if (typeof navigator === 'undefined') return false;
    
    const connection = (navigator as any).connection;
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;

    return (
      (connection && connection.effectiveType === 'slow-2g') ||
      (memory && memory < 2) ||
      (cores && cores < 2)
    );
  }

  /**
   * Generate accessible navigation HTML
   */
  private generateAccessibleNavigation(component: any): string {
    // Generate semantic navigation HTML
    return `
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          ${component.items?.map((item: any) => `
            <li><a href="${item.href}" ${item.current ? 'aria-current="page"' : ''}>${item.text}</a></li>
          `).join('') || ''}
        </ul>
      </nav>
    `;
  }

  /**
   * Generate semantic content HTML
   */
  private generateSemanticContent(component: any): string {
    // Generate semantic HTML structure
    const tag = component.semantic?.tag || 'div';
    const role = component.semantic?.role ? ` role="${component.semantic.role}"` : '';
    const ariaLabel = component.semantic?.ariaLabel ? ` aria-label="${component.semantic.ariaLabel}"` : '';
    
    return `<${tag}${role}${ariaLabel}>${component.content.text || ''}</${tag}>`;
  }

  /**
   * Generate accessible form HTML
   */
  private generateAccessibleForm(component: any): string {
    // Generate accessible form HTML
    return `
      <form method="post" action="${component.action || '#'}" novalidate>
        ${component.fields?.map((field: any) => `
          <div class="form-group">
            <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
            <input 
              type="${field.type}" 
              id="${field.id}" 
              name="${field.name}" 
              ${field.required ? 'required' : ''}
              ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
              aria-describedby="${field.id}-help"
            />
            ${field.help ? `<div id="${field.id}-help" class="form-help">${field.help}</div>` : ''}
          </div>
        `).join('') || ''}
        <button type="submit">Submit</button>
      </form>
    `;
  }

  /**
   * Generate fallback CSS
   */
  private generateFallbackCSS(): string {
    return `
      /* Progressive Enhancement Fallback Styles */
      * { box-sizing: border-box; }
      body { 
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
      }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      .btn { 
        display: inline-block;
        padding: 0.5rem 1rem;
        background: #007bff;
        color: white;
        text-decoration: none;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn:hover, .btn:focus { background: #0056b3; }
      .form-group { margin-bottom: 1rem; }
      .form-group label { display: block; margin-bottom: 0.25rem; font-weight: bold; }
      .form-group input, .form-group textarea, .form-group select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .form-help { font-size: 0.875rem; color: #666; margin-top: 0.25rem; }
      .skip-link:focus { position: absolute; top: 6px; left: 6px; z-index: 100000; }
      
      /* Accessibility styles */
      .sr-only { 
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      /* Focus styles */
      *:focus {
        outline: 2px solid #007bff;
        outline-offset: 2px;
      }
      
      /* High contrast mode */
      .high-contrast {
        filter: contrast(150%);
      }
      
      /* Reduced motion */
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
  }

  /**
   * Generate tab indexes for template
   */
  private generateTabIndexes(template: any): Record<string, number> {
    const tabIndexes: Record<string, number> = {};
    let currentIndex = 1;

    if (template.components) {
      template.components.forEach((component: any) => {
        if (component.interactive) {
          tabIndexes[component.id] = currentIndex++;
        }
      });
    }

    return tabIndexes;
  }

  /**
   * Generate high contrast CSS
   */
  private generateHighContrastCSS(): string {
    return `
      .high-contrast {
        background: white !important;
        color: black !important;
      }
      .high-contrast a {
        color: blue !important;
      }
      .high-contrast button {
        background: black !important;
        color: white !important;
        border: 2px solid black !important;
      }
    `;
  }

  /**
   * Generate reduced motion CSS
   */
  private generateReducedMotionCSS(): string {
    return `
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `;
  }

  /**
   * Get feature support status
   */
  public getFeatureSupport(feature: string): FeatureSupportResult | undefined {
    return this.featureSupport.get(feature);
  }

  /**
   * Get all feature support results
   */
  public getAllFeatureSupport(): Map<string, FeatureSupportResult> {
    return new Map(this.featureSupport);
  }

  /**
   * Refresh feature detection
   */
  public refreshFeatureDetection(): void {
    this.featureSupport.clear();
    this.initializeFeatureDetection();
  }
}

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_PROGRESSIVE_ENHANCEMENT_CONFIG: ProgressiveEnhancementConfig = {
  enabled: true,
  coreFeatures: [
    {
      id: 'navigation',
      name: 'Navigation',
      description: 'Basic navigation functionality',
      requiredElements: ['nav', 'ul', 'li', 'a'],
      requiredCSS: ['nav', 'nav ul', 'nav li', 'nav a'],
      fallback: 'static_navigation',
      priority: 'critical'
    },
    {
      id: 'content',
      name: 'Content',
      description: 'Basic content display',
      requiredElements: ['main', 'section', 'article', 'h1', 'h2', 'h3', 'p'],
      requiredCSS: ['main', 'section', 'article', 'h1', 'h2', 'h3', 'p'],
      fallback: 'static_content',
      priority: 'critical'
    },
    {
      id: 'forms',
      name: 'Forms',
      description: 'Basic form functionality',
      requiredElements: ['form', 'input', 'label', 'button'],
      requiredCSS: ['form', 'input', 'label', 'button'],
      fallback: 'static_forms',
      priority: 'important'
    },
    {
      id: 'basic_styling',
      name: 'Basic Styling',
      description: 'Essential CSS styling',
      requiredElements: [],
      requiredCSS: ['body', 'container', 'btn'],
      fallback: 'minimal_styles',
      priority: 'important'
    }
  ],
  enhancedFeatures: [
    {
      id: 'animations',
      name: 'Animations',
      description: 'CSS animations and transitions',
      dependencies: ['css3', 'requestAnimationFrame'],
      fallbackFeature: 'basic_styling',
      level: 'basic',
      performanceImpact: 'medium'
    },
    {
      id: 'gamification',
      name: 'Gamification',
      description: 'Interactive gamification elements',
      dependencies: ['javascript', 'localStorage'],
      fallbackFeature: 'content',
      level: 'advanced',
      performanceImpact: 'high'
    },
    {
      id: 'interactive_elements',
      name: 'Interactive Elements',
      description: 'Advanced interactive components',
      dependencies: ['javascript', 'intersectionObserver'],
      fallbackFeature: 'basic_styling',
      level: 'advanced',
      performanceImpact: 'medium'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'User behavior tracking',
      dependencies: ['javascript', 'localStorage'],
      level: 'basic',
      performanceImpact: 'low'
    }
  ],
  featureDetection: {
    features: {
      javascript: true,
      css3: true,
      webgl: true,
      intersectionObserver: true,
      requestAnimationFrame: true,
      localStorage: true,
      sessionStorage: true,
      webWorkers: true,
      touchEvents: true,
      geolocation: false,
      notifications: false,
      serviceWorker: false
    },
    detectionMethods: {},
    fallbackStrategies: {
      javascript: 'static_content',
      css3: 'basic_styles',
      webgl: 'canvas_fallback',
      intersectionObserver: 'scroll_events',
      requestAnimationFrame: 'set_timeout',
      localStorage: 'session_storage',
      sessionStorage: 'memory_storage',
      webWorkers: 'main_thread',
      touchEvents: 'mouse_events'
    },
    cacheResults: true
  },
  degradationRules: [
    {
      feature: 'animations',
      condition: 'low_performance',
      fallback: 'static',
      priority: 'medium'
    },
    {
      feature: 'gamification',
      condition: 'javascript_disabled',
      fallback: 'static_content',
      priority: 'low'
    },
    {
      feature: 'interactive_elements',
      condition: 'touch_device',
      fallback: 'simplified_interactions',
      priority: 'high'
    },
    {
      feature: 'analytics',
      condition: 'privacy_mode',
      fallback: 'local_tracking',
      priority: 'low'
    }
  ],
  accessibility: {
    wcagLevel: 'AA',
    enableKeyboardNavigation: true,
    enableScreenReaderSupport: true,
    enableHighContrastMode: true,
    enableReducedMotionSupport: true,
    ariaLabels: {
      navigation: 'Main navigation',
      search: 'Search',
      menu: 'Menu',
      close: 'Close',
      submit: 'Submit form',
      loading: 'Loading content'
    },
    focusManagement: {
      enableFocusTrapping: true,
      focusOutlineStyle: '2px solid #007bff',
      skipLinks: [
        { text: 'Skip to main content', target: 'main', tabIndex: 1 },
        { text: 'Skip to navigation', target: 'navigation', tabIndex: 2 }
      ],
      enableFocusRestoration: true
    }
  }
};

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Create a progressive enhancement system with default or custom configuration
 */
export function createProgressiveEnhancementSystem(
  config: Partial<ProgressiveEnhancementConfig> = {}
): ProgressiveEnhancementSystem {
  const mergedConfig = {
    ...DEFAULT_PROGRESSIVE_ENHANCEMENT_CONFIG,
    ...config,
    coreFeatures: config.coreFeatures || DEFAULT_PROGRESSIVE_ENHANCEMENT_CONFIG.coreFeatures,
    enhancedFeatures: config.enhancedFeatures || DEFAULT_PROGRESSIVE_ENHANCEMENT_CONFIG.enhancedFeatures,
    featureDetection: { ...DEFAULT_PROGRESSIVE_ENHANCEMENT_CONFIG.featureDetection, ...config.featureDetection },
    degradationRules: config.degradationRules || DEFAULT_PROGRESSIVE_ENHANCEMENT_CONFIG.degradationRules,
    accessibility: { ...DEFAULT_PROGRESSIVE_ENHANCEMENT_CONFIG.accessibility, ...config.accessibility }
  };

  return new ProgressiveEnhancementSystem(mergedConfig);
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const progressiveEnhancementSystem = createProgressiveEnhancementSystem();