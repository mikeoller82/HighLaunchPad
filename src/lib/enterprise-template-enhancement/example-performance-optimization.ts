/**
 * Example Usage of Performance Optimization and Error Handling System
 * 
 * This example demonstrates how to integrate the performance optimization
 * and error handling system into the enterprise template enhancement workflow.
 */

import {
  PerformanceOptimizationSystem,
  createPerformanceOptimizationSystem,
  ProgressiveEnhancementSystem,
  createProgressiveEnhancementSystem,
  type PerformanceOptimizationConfig,
  type ProgressiveEnhancementConfig,
  type OptimizationResult,
  type EnhancementResult
} from './index';

// ============================================================================
// EXAMPLE TEMPLATE DATA
// ============================================================================

const exampleTemplate = {
  id: 'saas-landing-template',
  title: 'SaaS Product Landing Page',
  description: 'Professional landing page for SaaS products',
  category: 'business',
  components: [
    {
      id: 'hero-section',
      type: 'hero',
      content: {
        title: 'Transform Your Business with Our SaaS Solution',
        subtitle: 'Streamline operations, boost productivity, and scale faster',
        ctaText: 'Start Free Trial',
        backgroundImage: '/images/hero-bg.jpg'
      },
      interactive: true
    },
    {
      id: 'features-section',
      type: 'features',
      content: {
        title: 'Powerful Features',
        features: [
          { title: 'Analytics Dashboard', description: 'Real-time insights' },
          { title: 'Team Collaboration', description: 'Work together seamlessly' },
          { title: 'API Integration', description: 'Connect with your tools' }
        ]
      }
    },
    {
      id: 'pricing-section',
      type: 'pricing',
      content: {
        title: 'Simple, Transparent Pricing',
        plans: [
          { name: 'Starter', price: '$29/month', features: ['Basic features', '5 users'] },
          { name: 'Professional', price: '$99/month', features: ['Advanced features', '25 users'] },
          { name: 'Enterprise', price: 'Custom', features: ['All features', 'Unlimited users'] }
        ]
      }
    },
    {
      id: 'testimonials-section',
      type: 'testimonials',
      content: {
        title: 'What Our Customers Say',
        testimonials: [
          { name: 'John Doe', company: 'Tech Corp', text: 'Amazing product!' },
          { name: 'Jane Smith', company: 'StartupXYZ', text: 'Increased our productivity by 300%' }
        ]
      }
    },
    {
      id: 'contact-form',
      type: 'contact',
      content: {
        title: 'Get Started Today',
        fields: [
          { name: 'name', type: 'text', label: 'Full Name', required: true },
          { name: 'email', type: 'email', label: 'Email Address', required: true },
          { name: 'company', type: 'text', label: 'Company Name' },
          { name: 'message', type: 'textarea', label: 'Message' }
        ]
      },
      interactive: true
    }
  ],
  enterpriseFeatures: {
    professionalAssets: [
      { id: 'hero-bg', type: 'image', src: '/images/hero-bg.jpg', quality: 90, critical: true },
      { id: 'feature-icon-1', type: 'image', src: '/images/analytics-icon.svg', quality: 80, critical: false },
      { id: 'feature-icon-2', type: 'image', src: '/images/collaboration-icon.svg', quality: 80, critical: false },
      { id: 'feature-icon-3', type: 'image', src: '/images/api-icon.svg', quality: 80, critical: false },
      { id: 'testimonial-avatar-1', type: 'image', src: '/images/john-doe.jpg', quality: 70, critical: false },
      { id: 'testimonial-avatar-2', type: 'image', src: '/images/jane-smith.jpg', quality: 70, critical: false }
    ],
    trustSignals: [
      { type: 'security_badge', content: 'SOC 2 Compliant' },
      { type: 'certification', content: 'ISO 27001 Certified' },
      { type: 'testimonial_verification', content: 'Verified Customer Reviews' }
    ]
  },
  gamificationElements: {
    enabled: true,
    progressTrackers: [
      { id: 'signup-progress', steps: ['Email', 'Company Info', 'Preferences', 'Complete'] }
    ],
    achievements: [
      { id: 'form-completion', title: 'Getting Started', description: 'Complete the signup form' }
    ]
  },
  interactiveComponents: {
    animations: [
      { id: 'hero-fade-in', type: 'fadeIn', target: '#hero-section', trigger: 'viewport' },
      { id: 'features-slide-up', type: 'slideUp', target: '.feature-card', trigger: 'scroll' },
      { id: 'pricing-scale', type: 'scale', target: '.pricing-card', trigger: 'hover' }
    ],
    dynamicContent: [
      { id: 'personalized-cta', target: '.cta-button', rules: [{ condition: 'returning_visitor', content: 'Welcome Back!' }] }
    ]
  }
};

// ============================================================================
// PERFORMANCE OPTIMIZATION CONFIGURATION
// ============================================================================

const performanceConfig: PerformanceOptimizationConfig = {
  enableMonitoring: true,
  performanceBudget: {
    maxLoadTime: 3000,
    maxFCP: 1800,
    maxLCP: 2500,
    maxFID: 100,
    maxCLS: 0.1,
    maxBundleSize: 500, // KB
    maxImageSize: 200   // KB
  },
  deviceOptimization: {
    enableDeviceDetection: true,
    cpuThresholds: { low: 50, medium: 100, high: 200 },
    memoryThresholds: { low: 512, medium: 1024, high: 2048 }, // MB
    networkThresholds: { slow: 1, fast: 10 }, // Mbps
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
        hero: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik01ODUgMjcwSDYxNVYzMDBINTg1VjI3MFoiIGZpbGw9IiNEREREREQiLz4KPHN2Zz4K',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNDAgOTBIMTYwVjExMEgxNDBWOTBaIiBmaWxsPSIjREREREREIi8+Cjwvc3ZnPgo=',
        avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjREREREREIi8+CjxwYXRoIGQ9Ik0yMCA4MEM0MCA2MCA2MCA2MCA4MCA4MEgyMFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+Cg==',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI0RERERERCIvPgo8L3N2Zz4K'
      },
      fallbackFonts: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      fallbackColors: {
        primary: '#007bff',
        secondary: '#6c757d',
        accent: '#28a745',
        background: '#ffffff',
        text: '#212529'
      },
      fallbackCSS: `
        /* SaaS Landing Page Fallback Styles */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: system-ui, -apple-system, sans-serif; 
          line-height: 1.6; 
          color: #212529; 
          background: #ffffff;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .hero { padding: 4rem 0; text-align: center; background: #f8f9fa; }
        .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.25rem; margin-bottom: 2rem; color: #6c757d; }
        .btn { 
          display: inline-block; 
          padding: 0.75rem 1.5rem; 
          background: #007bff; 
          color: white; 
          text-decoration: none; 
          border-radius: 0.375rem; 
          font-weight: 500;
        }
        .btn:hover { background: #0056b3; }
        .section { padding: 3rem 0; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .feature { padding: 1.5rem; border: 1px solid #dee2e6; border-radius: 0.5rem; }
        .pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
        .plan { padding: 2rem; border: 2px solid #dee2e6; border-radius: 0.5rem; text-align: center; }
        .plan.featured { border-color: #007bff; }
        .testimonials { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .testimonial { padding: 1.5rem; background: #f8f9fa; border-radius: 0.5rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        .form-group input, .form-group textarea { 
          width: 100%; 
          padding: 0.75rem; 
          border: 1px solid #ced4da; 
          border-radius: 0.375rem; 
        }
        .form-group input:focus, .form-group textarea:focus { 
          outline: none; 
          border-color: #007bff; 
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); 
        }
        @media (max-width: 768px) {
          .hero h1 { font-size: 2rem; }
          .features, .pricing, .testimonials { grid-template-columns: 1fr; }
        }
      `
    }
  },
  errorHandling: {
    enableSilentHandling: true,
    enableLocalTracking: true,
    errorReporting: {
      enableReporting: true,
      maxLocalErrors: 50,
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
        webgl: false, // Not needed for this template
        intersectionObserver: true,
        requestAnimationFrame: true,
        localStorage: true,
        sessionStorage: true,
        webWorkers: false,
        touchEvents: true,
        geolocation: false,
        notifications: false,
        serviceWorker: false
      },
      fallbackStrategies: {
        javascript: 'static_content',
        css3: 'basic_styles',
        intersectionObserver: 'scroll_events',
        requestAnimationFrame: 'set_timeout',
        localStorage: 'session_storage',
        sessionStorage: 'memory_storage',
        touchEvents: 'mouse_events'
      },
      cacheResults: true
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
// PROGRESSIVE ENHANCEMENT CONFIGURATION
// ============================================================================

const enhancementConfig: ProgressiveEnhancementConfig = {
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
      name: 'Content Display',
      description: 'Semantic content structure',
      requiredElements: ['main', 'section', 'article', 'h1', 'h2', 'h3', 'p'],
      requiredCSS: ['main', 'section', 'article', 'h1', 'h2', 'h3', 'p'],
      fallback: 'static_content',
      priority: 'critical'
    },
    {
      id: 'forms',
      name: 'Form Functionality',
      description: 'Accessible form handling',
      requiredElements: ['form', 'input', 'label', 'button', 'textarea'],
      requiredCSS: ['form', 'input', 'label', 'button', 'textarea'],
      fallback: 'static_forms',
      priority: 'important'
    },
    {
      id: 'basic_styling',
      name: 'Basic Styling',
      description: 'Essential visual presentation',
      requiredElements: [],
      requiredCSS: ['body', 'container', 'btn', 'section'],
      fallback: 'minimal_styles',
      priority: 'important'
    }
  ],
  enhancedFeatures: [
    {
      id: 'animations',
      name: 'CSS Animations',
      description: 'Smooth transitions and animations',
      dependencies: ['css3', 'requestAnimationFrame'],
      fallbackFeature: 'basic_styling',
      level: 'basic',
      performanceImpact: 'medium'
    },
    {
      id: 'gamification',
      name: 'Gamification Elements',
      description: 'Progress tracking and achievements',
      dependencies: ['javascript', 'localStorage'],
      fallbackFeature: 'content',
      level: 'advanced',
      performanceImpact: 'high'
    },
    {
      id: 'interactive_elements',
      name: 'Interactive Components',
      description: 'Dynamic user interactions',
      dependencies: ['javascript', 'intersectionObserver'],
      fallbackFeature: 'basic_styling',
      level: 'advanced',
      performanceImpact: 'medium'
    },
    {
      id: 'analytics',
      name: 'User Analytics',
      description: 'Behavior tracking and insights',
      dependencies: ['javascript', 'localStorage'],
      level: 'basic',
      performanceImpact: 'low'
    }
  ],
  featureDetection: {
    features: {
      javascript: true,
      css3: true,
      webgl: false,
      intersectionObserver: true,
      requestAnimationFrame: true,
      localStorage: true,
      sessionStorage: true,
      webWorkers: false,
      touchEvents: true,
      geolocation: false,
      notifications: false,
      serviceWorker: false
    },
    detectionMethods: {},
    fallbackStrategies: {
      javascript: 'static_content',
      css3: 'basic_styles',
      intersectionObserver: 'scroll_events',
      requestAnimationFrame: 'set_timeout',
      localStorage: 'session_storage',
      sessionStorage: 'memory_storage',
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
      search: 'Search products',
      menu: 'Menu',
      close: 'Close dialog',
      submit: 'Submit form',
      loading: 'Loading content',
      hero: 'Hero section',
      features: 'Product features',
      pricing: 'Pricing plans',
      testimonials: 'Customer testimonials',
      contact: 'Contact form'
    },
    focusManagement: {
      enableFocusTrapping: true,
      focusOutlineStyle: '2px solid #007bff',
      skipLinks: [
        { text: 'Skip to main content', target: 'main', tabIndex: 1 },
        { text: 'Skip to navigation', target: 'navigation', tabIndex: 2 },
        { text: 'Skip to contact form', target: 'contact-form', tabIndex: 3 }
      ],
      enableFocusRestoration: true
    }
  }
};

// ============================================================================
// MAIN OPTIMIZATION WORKFLOW
// ============================================================================

/**
 * Complete workflow for optimizing a template with performance and accessibility
 */
export async function optimizeTemplateWorkflow(template: any): Promise<{
  optimizedTemplate: any;
  performanceResult: OptimizationResult;
  enhancementResult: EnhancementResult;
  metrics: {
    performanceScore: number;
    accessibilityScore: number;
    optimizationsSummary: string[];
  };
}> {
  console.log('🚀 Starting template optimization workflow...');

  // Step 1: Create optimization systems
  const performanceSystem = createPerformanceOptimizationSystem(performanceConfig);
  const enhancementSystem = createProgressiveEnhancementSystem(enhancementConfig);

  // Step 2: Clone template to avoid mutations
  const workingTemplate = JSON.parse(JSON.stringify(template));

  // Step 3: Apply performance optimizations
  console.log('⚡ Applying performance optimizations...');
  const performanceResult = performanceSystem.optimizeForDevice(workingTemplate);
  
  if (!performanceResult.success) {
    console.error('❌ Performance optimization failed:', performanceResult.errors);
    throw new Error('Performance optimization failed');
  }

  console.log('✅ Performance optimizations applied:', performanceResult.appliedOptimizations);

  // Step 4: Apply progressive enhancement
  console.log('🎯 Applying progressive enhancement...');
  const enhancementResult = enhancementSystem.enhanceTemplate(workingTemplate);

  if (!enhancementResult.success && enhancementResult.errors.length > 0) {
    console.error('❌ Progressive enhancement failed:', enhancementResult.errors);
    throw new Error('Progressive enhancement failed');
  }

  console.log('✅ Progressive enhancements applied:', enhancementResult.appliedEnhancements);

  // Step 5: Calculate performance metrics
  const performanceMetrics = performanceSystem.getMetrics();
  const budgetCheck = performanceSystem.checkPerformanceBudget();

  // Step 6: Generate optimization summary
  const optimizationsSummary = [
    ...performanceResult.appliedOptimizations.map(opt => `Performance: ${opt}`),
    ...enhancementResult.appliedEnhancements.map(enh => `Enhancement: ${enh}`),
    ...enhancementResult.accessibilityFeatures.map(acc => `Accessibility: ${acc}`)
  ];

  // Step 7: Calculate scores
  const performanceScore = calculatePerformanceScore(performanceResult, budgetCheck);
  const accessibilityScore = calculateAccessibilityScore(enhancementResult);

  console.log('📊 Optimization complete!');
  console.log(`   Performance Score: ${performanceScore}/100`);
  console.log(`   Accessibility Score: ${accessibilityScore}/100`);
  console.log(`   Total Optimizations: ${optimizationsSummary.length}`);

  return {
    optimizedTemplate: workingTemplate,
    performanceResult,
    enhancementResult,
    metrics: {
      performanceScore,
      accessibilityScore,
      optimizationsSummary
    }
  };
}

/**
 * Calculate performance score based on optimizations and budget compliance
 */
function calculatePerformanceScore(result: OptimizationResult, budgetCheck: { exceeded: boolean; violations: string[] }): number {
  let score = 50; // Base score

  // Add points for applied optimizations
  score += result.appliedOptimizations.length * 5;

  // Add points for improvements
  score += Math.min(result.improvements.loadTimeReduction / 2, 20);
  score += Math.min(result.improvements.bundleSizeReduction / 2, 15);
  score += Math.min(result.improvements.errorReduction / 2, 10);

  // Deduct points for budget violations
  score -= budgetCheck.violations.length * 5;

  // Deduct points for warnings
  score -= result.warnings.length * 2;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate accessibility score based on applied features
 */
function calculateAccessibilityScore(result: EnhancementResult): number {
  let score = 40; // Base score

  // Add points for applied enhancements
  score += result.appliedEnhancements.length * 8;

  // Add points for accessibility features
  score += result.accessibilityFeatures.length * 10;

  // Deduct points for fallbacks used (indicates missing features)
  score -= result.fallbacksUsed.length * 3;

  // Deduct points for warnings
  score -= result.warnings.length * 2;

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ============================================================================
// MONITORING AND REPORTING
// ============================================================================

/**
 * Monitor template performance in real-time
 */
export function monitorTemplatePerformance(templateId: string): {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  getReport: () => any;
} {
  const performanceSystem = createPerformanceOptimizationSystem(performanceConfig);
  let monitoringInterval: NodeJS.Timeout | null = null;
  const performanceLog: any[] = [];

  return {
    startMonitoring: () => {
      console.log(`📈 Starting performance monitoring for template: ${templateId}`);
      
      monitoringInterval = setInterval(() => {
        const metrics = performanceSystem.getMetrics();
        const budgetCheck = performanceSystem.checkPerformanceBudget();
        const errorLog = performanceSystem.getErrorLog();

        const logEntry = {
          timestamp: new Date(),
          templateId,
          metrics,
          budgetViolations: budgetCheck.violations,
          errorCount: errorLog.length,
          recentErrors: errorLog.slice(-5) // Last 5 errors
        };

        performanceLog.push(logEntry);

        // Alert on budget violations
        if (budgetCheck.exceeded) {
          console.warn(`⚠️ Performance budget exceeded for ${templateId}:`, budgetCheck.violations);
        }

        // Alert on error spikes
        if (errorLog.length > 10) {
          console.warn(`⚠️ High error count (${errorLog.length}) for ${templateId}`);
        }
      }, 5000); // Monitor every 5 seconds
    },

    stopMonitoring: () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
        console.log(`📊 Stopped performance monitoring for template: ${templateId}`);
      }
    },

    getReport: () => {
      return {
        templateId,
        monitoringDuration: performanceLog.length * 5, // seconds
        totalDataPoints: performanceLog.length,
        averagePerformance: calculateAveragePerformance(performanceLog),
        errorSummary: summarizeErrors(performanceLog),
        recommendations: generateRecommendations(performanceLog)
      };
    }
  };
}

/**
 * Calculate average performance metrics
 */
function calculateAveragePerformance(log: any[]): any {
  if (log.length === 0) return null;

  const validEntries = log.filter(entry => entry.metrics);
  if (validEntries.length === 0) return null;

  const totals = validEntries.reduce((acc, entry) => {
    const metrics = entry.metrics;
    return {
      loadTime: acc.loadTime + (metrics.loadTime?.fcp || 0),
      bundleSize: acc.bundleSize + (metrics.resources?.totalSize || 0),
      errorCount: acc.errorCount + (metrics.errors?.totalErrors || 0)
    };
  }, { loadTime: 0, bundleSize: 0, errorCount: 0 });

  return {
    averageLoadTime: Math.round(totals.loadTime / validEntries.length),
    averageBundleSize: Math.round(totals.bundleSize / validEntries.length),
    averageErrorCount: Math.round(totals.errorCount / validEntries.length)
  };
}

/**
 * Summarize errors from monitoring log
 */
function summarizeErrors(log: any[]): any {
  const allErrors = log.flatMap(entry => entry.recentErrors || []);
  const errorTypes = allErrors.reduce((acc, error) => {
    const type = error.error.split(']')[0].replace('[', '') || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalErrors: allErrors.length,
    errorTypes,
    mostCommonError: Object.entries(errorTypes).sort(([,a], [,b]) => b - a)[0]?.[0] || 'none'
  };
}

/**
 * Generate performance recommendations
 */
function generateRecommendations(log: any[]): string[] {
  const recommendations: string[] = [];
  const latest = log[log.length - 1];

  if (!latest) return recommendations;

  // Check for consistent budget violations
  const violationCount = log.filter(entry => entry.budgetViolations.length > 0).length;
  if (violationCount > log.length * 0.5) {
    recommendations.push('Consider reducing image sizes or enabling more aggressive optimization');
  }

  // Check for high error rates
  const avgErrors = log.reduce((sum, entry) => sum + entry.errorCount, 0) / log.length;
  if (avgErrors > 5) {
    recommendations.push('Investigate and fix recurring errors to improve stability');
  }

  // Check for performance degradation
  if (log.length > 10) {
    const recentAvg = log.slice(-5).reduce((sum, entry) => sum + (entry.metrics?.loadTime?.fcp || 0), 0) / 5;
    const olderAvg = log.slice(0, 5).reduce((sum, entry) => sum + (entry.metrics?.loadTime?.fcp || 0), 0) / 5;
    
    if (recentAvg > olderAvg * 1.2) {
      recommendations.push('Performance has degraded over time - review recent changes');
    }
  }

  return recommendations;
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * Example of complete template optimization workflow
 */
export async function runOptimizationExample(): Promise<void> {
  console.log('🎯 Running Complete Template Optimization Example\n');

  try {
    // Step 1: Optimize the template
    const result = await optimizeTemplateWorkflow(exampleTemplate);

    console.log('\n📋 Optimization Results:');
    console.log('========================');
    console.log(`Template ID: ${result.optimizedTemplate.id}`);
    console.log(`Performance Score: ${result.metrics.performanceScore}/100`);
    console.log(`Accessibility Score: ${result.metrics.accessibilityScore}/100`);
    console.log(`Total Optimizations: ${result.metrics.optimizationsSummary.length}`);

    console.log('\n⚡ Performance Optimizations:');
    result.performanceResult.appliedOptimizations.forEach(opt => {
      console.log(`  ✓ ${opt}`);
    });

    console.log('\n🎯 Progressive Enhancements:');
    result.enhancementResult.appliedEnhancements.forEach(enh => {
      console.log(`  ✓ ${enh}`);
    });

    console.log('\n♿ Accessibility Features:');
    result.enhancementResult.accessibilityFeatures.forEach(acc => {
      console.log(`  ✓ ${acc}`);
    });

    if (result.enhancementResult.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      result.enhancementResult.warnings.forEach(warning => {
        console.log(`  ! ${warning}`);
      });
    }

    // Step 2: Start monitoring (example)
    console.log('\n📈 Starting Performance Monitoring...');
    const monitor = monitorTemplatePerformance(result.optimizedTemplate.id);
    
    monitor.startMonitoring();
    
    // Simulate some monitoring time
    await new Promise(resolve => setTimeout(resolve, 15000)); // 15 seconds
    
    monitor.stopMonitoring();
    
    const monitoringReport = monitor.getReport();
    console.log('\n📊 Monitoring Report:');
    console.log(`  Duration: ${monitoringReport.monitoringDuration} seconds`);
    console.log(`  Data Points: ${monitoringReport.totalDataPoints}`);
    console.log(`  Average Performance:`, monitoringReport.averagePerformance);
    console.log(`  Error Summary:`, monitoringReport.errorSummary);
    
    if (monitoringReport.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      monitoringReport.recommendations.forEach(rec => {
        console.log(`  • ${rec}`);
      });
    }

    console.log('\n✅ Optimization example completed successfully!');

  } catch (error) {
    console.error('❌ Optimization example failed:', error);
    throw error;
  }
}

// Run the example if this file is executed directly
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runOptimizationExample().catch(console.error);
}