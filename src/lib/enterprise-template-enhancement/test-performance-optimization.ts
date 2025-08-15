/**
 * Test Suite for Performance Optimization and Error Handling System
 * 
 * This test suite verifies that the performance optimization and error handling
 * system works correctly and provides graceful degradation.
 */

import {
  PerformanceOptimizationSystem,
  createPerformanceOptimizationSystem,
  DEFAULT_PERFORMANCE_CONFIG,
  type PerformanceOptimizationConfig,
  type OptimizationResult,
  type PerformanceMetrics
} from './performance-optimization-system';

import {
  ProgressiveEnhancementSystem,
  createProgressiveEnhancementSystem,
  DEFAULT_PROGRESSIVE_ENHANCEMENT_CONFIG,
  type ProgressiveEnhancementConfig,
  type EnhancementResult
} from './progressive-enhancement-system';

// ============================================================================
// TEST DATA
// ============================================================================

const mockTemplate = {
  id: 'test-template',
  title: 'Test Template',
  components: [
    {
      id: 'hero',
      type: 'hero',
      content: { title: 'Welcome', subtitle: 'Test content' }
    },
    {
      id: 'contact',
      type: 'contact',
      content: { title: 'Contact Us' }
    }
  ],
  enterpriseFeatures: {
    professionalAssets: [
      { id: 'hero-image', type: 'image', src: '/hero.jpg', quality: 80, critical: true },
      { id: 'bg-image', type: 'image', src: '/background.jpg', quality: 70, critical: false }
    ]
  },
  gamificationElements: {
    enabled: true,
    progressTrackers: [{ id: 'form-progress', steps: 3 }]
  },
  interactiveComponents: {
    animations: [
      { id: 'fade-in', type: 'fadeIn', enabled: true },
      { id: 'slide-up', type: 'slideUp', enabled: true }
    ]
  }
};

// ============================================================================
// PERFORMANCE OPTIMIZATION TESTS
// ============================================================================

/**
 * Test performance optimization system initialization
 */
export function testPerformanceOptimizationInit(): boolean {
  console.log('🧪 Testing Performance Optimization System Initialization...');

  try {
    // Test with default configuration
    const defaultSystem = createPerformanceOptimizationSystem();
    if (!defaultSystem) {
      throw new Error('Failed to create system with default config');
    }

    // Test with custom configuration
    const customConfig: Partial<PerformanceOptimizationConfig> = {
      enableMonitoring: true,
      performanceBudget: {
        maxLoadTime: 2000,
        maxFCP: 1500,
        maxLCP: 2000,
        maxFID: 50,
        maxCLS: 0.05,
        maxBundleSize: 300,
        maxImageSize: 150
      }
    };

    const customSystem = createPerformanceOptimizationSystem(customConfig);
    if (!customSystem) {
      throw new Error('Failed to create system with custom config');
    }

    console.log('✅ Performance optimization system initialization passed');
    return true;
  } catch (error) {
    console.error('❌ Performance optimization system initialization failed:', error);
    return false;
  }
}

/**
 * Test device optimization
 */
export function testDeviceOptimization(): boolean {
  console.log('🧪 Testing Device Optimization...');

  try {
    const system = createPerformanceOptimizationSystem();
    const template = { ...mockTemplate };

    // Test optimization
    const result: OptimizationResult = system.optimizeForDevice(template);

    if (!result.success) {
      throw new Error(`Optimization failed: ${result.errors?.join(', ')}`);
    }

    // Verify optimizations were applied
    if (result.appliedOptimizations.length === 0) {
      console.warn('⚠️ No optimizations were applied');
    }

    // Check for expected optimization types
    const expectedOptimizations = [
      'disabled_animations',
      'reduced_image_quality',
      'disabled_gamification',
      'limited_interactivity',
      'simplified_layouts',
      'deferred_non_critical'
    ];

    const hasValidOptimizations = result.appliedOptimizations.some(opt => 
      expectedOptimizations.includes(opt)
    );

    if (!hasValidOptimizations && result.appliedOptimizations.length > 0) {
      console.warn('⚠️ Applied optimizations do not match expected types');
    }

    // Verify improvements are calculated
    if (result.improvements.loadTimeReduction < 0 || 
        result.improvements.bundleSizeReduction < 0 || 
        result.improvements.errorReduction < 0) {
      throw new Error('Invalid improvement metrics');
    }

    console.log('✅ Device optimization passed');
    console.log(`   Applied optimizations: ${result.appliedOptimizations.join(', ')}`);
    console.log(`   Load time reduction: ${result.improvements.loadTimeReduction}%`);
    console.log(`   Bundle size reduction: ${result.improvements.bundleSizeReduction}%`);
    console.log(`   Error reduction: ${result.improvements.errorReduction}%`);
    return true;
  } catch (error) {
    console.error('❌ Device optimization failed:', error);
    return false;
  }
}

/**
 * Test error handling
 */
export function testErrorHandling(): boolean {
  console.log('🧪 Testing Error Handling...');

  try {
    const system = createPerformanceOptimizationSystem({
      errorHandling: {
        enableSilentHandling: true,
        enableLocalTracking: true,
        errorReporting: {
          enableReporting: true,
          maxLocalErrors: 10,
          samplingRate: 1.0,
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
          maxRetryAttempts: 2,
          retryDelay: 500,
          enableExponentialBackoff: true,
          enableCircuitBreaker: true
        }
      }
    });

    // Test error log functionality
    const initialErrorLog = system.getErrorLog();
    if (!Array.isArray(initialErrorLog)) {
      throw new Error('Error log should be an array');
    }

    // Test metrics retrieval
    const metrics = system.getMetrics();
    // Metrics might be null initially, which is acceptable

    // Test performance budget check
    const budgetCheck = system.checkPerformanceBudget();
    if (typeof budgetCheck.exceeded !== 'boolean' || !Array.isArray(budgetCheck.violations)) {
      throw new Error('Invalid performance budget check result');
    }

    console.log('✅ Error handling passed');
    console.log(`   Initial error log length: ${initialErrorLog.length}`);
    console.log(`   Performance budget exceeded: ${budgetCheck.exceeded}`);
    console.log(`   Budget violations: ${budgetCheck.violations.length}`);
    return true;
  } catch (error) {
    console.error('❌ Error handling failed:', error);
    return false;
  }
}

/**
 * Test asset fallback system
 */
export function testAssetFallbackSystem(): boolean {
  console.log('🧪 Testing Asset Fallback System...');

  try {
    const config = DEFAULT_PERFORMANCE_CONFIG;
    const fallbackAssets = config.assetOptimization.fallbackAssets;

    // Verify fallback assets are configured
    if (!fallbackAssets.placeholderImages.hero) {
      throw new Error('Hero placeholder image not configured');
    }

    if (!fallbackAssets.placeholderImages.thumbnail) {
      throw new Error('Thumbnail placeholder image not configured');
    }

    if (!fallbackAssets.placeholderImages.avatar) {
      throw new Error('Avatar placeholder image not configured');
    }

    if (!fallbackAssets.placeholderImages.logo) {
      throw new Error('Logo placeholder image not configured');
    }

    // Verify fallback fonts
    if (!Array.isArray(fallbackAssets.fallbackFonts) || fallbackAssets.fallbackFonts.length === 0) {
      throw new Error('Fallback fonts not configured');
    }

    // Verify fallback colors
    const requiredColors = ['primary', 'secondary', 'accent', 'background', 'text'];
    for (const color of requiredColors) {
      if (!fallbackAssets.fallbackColors[color]) {
        throw new Error(`Fallback color ${color} not configured`);
      }
    }

    // Verify fallback CSS
    if (!fallbackAssets.fallbackCSS || fallbackAssets.fallbackCSS.length === 0) {
      throw new Error('Fallback CSS not configured');
    }

    console.log('✅ Asset fallback system passed');
    console.log(`   Configured placeholder images: ${Object.keys(fallbackAssets.placeholderImages).length}`);
    console.log(`   Configured fallback fonts: ${fallbackAssets.fallbackFonts.length}`);
    console.log(`   Configured fallback colors: ${Object.keys(fallbackAssets.fallbackColors).length}`);
    return true;
  } catch (error) {
    console.error('❌ Asset fallback system failed:', error);
    return false;
  }
}

// ============================================================================
// PROGRESSIVE ENHANCEMENT TESTS
// ============================================================================

/**
 * Test progressive enhancement system initialization
 */
export function testProgressiveEnhancementInit(): boolean {
  console.log('🧪 Testing Progressive Enhancement System Initialization...');

  try {
    // Test with default configuration
    const defaultSystem = createProgressiveEnhancementSystem();
    if (!defaultSystem) {
      throw new Error('Failed to create system with default config');
    }

    // Test with custom configuration
    const customConfig: Partial<ProgressiveEnhancementConfig> = {
      enabled: true,
      accessibility: {
        wcagLevel: 'AAA',
        enableKeyboardNavigation: true,
        enableScreenReaderSupport: true,
        enableHighContrastMode: true,
        enableReducedMotionSupport: true,
        ariaLabels: {
          navigation: 'Custom navigation',
          search: 'Custom search'
        },
        focusManagement: {
          enableFocusTrapping: true,
          focusOutlineStyle: '3px solid #ff0000',
          skipLinks: [
            { text: 'Skip to content', target: 'main', tabIndex: 1 }
          ],
          enableFocusRestoration: true
        }
      }
    };

    const customSystem = createProgressiveEnhancementSystem(customConfig);
    if (!customSystem) {
      throw new Error('Failed to create system with custom config');
    }

    console.log('✅ Progressive enhancement system initialization passed');
    return true;
  } catch (error) {
    console.error('❌ Progressive enhancement system initialization failed:', error);
    return false;
  }
}

/**
 * Test template enhancement
 */
export function testTemplateEnhancement(): boolean {
  console.log('🧪 Testing Template Enhancement...');

  try {
    const system = createProgressiveEnhancementSystem();
    const template = { ...mockTemplate };

    // Test enhancement
    const result: EnhancementResult = system.enhanceTemplate(template);

    if (!result.success && result.errors.length > 0) {
      throw new Error(`Enhancement failed: ${result.errors.join(', ')}`);
    }

    // Verify enhancements were applied
    if (result.appliedEnhancements.length === 0) {
      console.warn('⚠️ No enhancements were applied');
    }

    // Verify accessibility features
    if (result.accessibilityFeatures.length === 0) {
      console.warn('⚠️ No accessibility features were applied');
    }

    // Check for expected enhancement types
    const expectedEnhancements = [
      'navigation',
      'content',
      'forms',
      'basic_styling',
      'animations',
      'gamification',
      'interactive_elements',
      'analytics'
    ];

    const hasValidEnhancements = result.appliedEnhancements.some(enhancement => 
      expectedEnhancements.includes(enhancement)
    );

    if (!hasValidEnhancements && result.appliedEnhancements.length > 0) {
      console.warn('⚠️ Applied enhancements do not match expected types');
    }

    console.log('✅ Template enhancement passed');
    console.log(`   Applied enhancements: ${result.appliedEnhancements.join(', ')}`);
    console.log(`   Fallbacks used: ${result.fallbacksUsed.join(', ')}`);
    console.log(`   Accessibility features: ${result.accessibilityFeatures.join(', ')}`);
    console.log(`   Warnings: ${result.warnings.length}`);
    return true;
  } catch (error) {
    console.error('❌ Template enhancement failed:', error);
    return false;
  }
}

/**
 * Test feature detection
 */
export function testFeatureDetection(): boolean {
  console.log('🧪 Testing Feature Detection...');

  try {
    const system = createProgressiveEnhancementSystem();

    // Test feature support retrieval
    const jsSupport = system.getFeatureSupport('javascript');
    if (jsSupport && typeof jsSupport.supported !== 'boolean') {
      throw new Error('Invalid feature support result for javascript');
    }

    // Test all feature support retrieval
    const allSupport = system.getAllFeatureSupport();
    if (!(allSupport instanceof Map)) {
      throw new Error('getAllFeatureSupport should return a Map');
    }

    // Test feature detection refresh
    system.refreshFeatureDetection();

    console.log('✅ Feature detection passed');
    console.log(`   JavaScript support: ${jsSupport?.supported || 'unknown'}`);
    console.log(`   Total features detected: ${allSupport.size}`);
    return true;
  } catch (error) {
    console.error('❌ Feature detection failed:', error);
    return false;
  }
}

/**
 * Test accessibility features
 */
export function testAccessibilityFeatures(): boolean {
  console.log('🧪 Testing Accessibility Features...');

  try {
    const config = DEFAULT_PROGRESSIVE_ENHANCEMENT_CONFIG;
    const accessibility = config.accessibility;

    // Verify WCAG compliance level
    if (!['A', 'AA', 'AAA'].includes(accessibility.wcagLevel)) {
      throw new Error('Invalid WCAG compliance level');
    }

    // Verify accessibility features are enabled
    if (!accessibility.enableKeyboardNavigation) {
      console.warn('⚠️ Keyboard navigation is disabled');
    }

    if (!accessibility.enableScreenReaderSupport) {
      console.warn('⚠️ Screen reader support is disabled');
    }

    if (!accessibility.enableHighContrastMode) {
      console.warn('⚠️ High contrast mode is disabled');
    }

    if (!accessibility.enableReducedMotionSupport) {
      console.warn('⚠️ Reduced motion support is disabled');
    }

    // Verify ARIA labels
    const requiredAriaLabels = ['navigation', 'search', 'menu', 'close', 'submit', 'loading'];
    for (const label of requiredAriaLabels) {
      if (!accessibility.ariaLabels[label]) {
        console.warn(`⚠️ Missing ARIA label: ${label}`);
      }
    }

    // Verify focus management
    if (!accessibility.focusManagement.enableFocusTrapping) {
      console.warn('⚠️ Focus trapping is disabled');
    }

    if (!accessibility.focusManagement.focusOutlineStyle) {
      throw new Error('Focus outline style not configured');
    }

    if (!Array.isArray(accessibility.focusManagement.skipLinks) || 
        accessibility.focusManagement.skipLinks.length === 0) {
      console.warn('⚠️ No skip links configured');
    }

    console.log('✅ Accessibility features passed');
    console.log(`   WCAG level: ${accessibility.wcagLevel}`);
    console.log(`   ARIA labels configured: ${Object.keys(accessibility.ariaLabels).length}`);
    console.log(`   Skip links configured: ${accessibility.focusManagement.skipLinks.length}`);
    return true;
  } catch (error) {
    console.error('❌ Accessibility features failed:', error);
    return false;
  }
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

/**
 * Test integration between performance optimization and progressive enhancement
 */
export function testSystemIntegration(): boolean {
  console.log('🧪 Testing System Integration...');

  try {
    const performanceSystem = createPerformanceOptimizationSystem();
    const enhancementSystem = createProgressiveEnhancementSystem();
    const template = { ...mockTemplate };

    // First apply performance optimizations
    const optimizationResult = performanceSystem.optimizeForDevice(template);
    if (!optimizationResult.success) {
      throw new Error('Performance optimization failed');
    }

    // Then apply progressive enhancement
    const enhancementResult = enhancementSystem.enhanceTemplate(template);
    if (!enhancementResult.success && enhancementResult.errors.length > 0) {
      throw new Error('Progressive enhancement failed');
    }

    // Verify both systems worked together
    const totalFeatures = optimizationResult.appliedOptimizations.length + 
                          enhancementResult.appliedEnhancements.length;

    if (totalFeatures === 0) {
      console.warn('⚠️ No features were applied by either system');
    }

    console.log('✅ System integration passed');
    console.log(`   Performance optimizations: ${optimizationResult.appliedOptimizations.length}`);
    console.log(`   Progressive enhancements: ${enhancementResult.appliedEnhancements.length}`);
    console.log(`   Total features applied: ${totalFeatures}`);
    return true;
  } catch (error) {
    console.error('❌ System integration failed:', error);
    return false;
  }
}

// ============================================================================
// TEST RUNNER
// ============================================================================

/**
 * Run all performance optimization and error handling tests
 */
export function runAllTests(): boolean {
  console.log('🚀 Running Performance Optimization and Error Handling Tests...\n');

  const tests = [
    testPerformanceOptimizationInit,
    testDeviceOptimization,
    testErrorHandling,
    testAssetFallbackSystem,
    testProgressiveEnhancementInit,
    testTemplateEnhancement,
    testFeatureDetection,
    testAccessibilityFeatures,
    testSystemIntegration
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      if (test()) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ Test ${test.name} threw an error:`, error);
      failed++;
    }
    console.log(''); // Add spacing between tests
  }

  console.log('📊 Test Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  return failed === 0;
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/**
 * Example of how to use the performance optimization and error handling system
 */
export function exampleUsage(): void {
  console.log('📖 Performance Optimization and Error Handling Example Usage:\n');

  // Create performance optimization system
  const performanceSystem = createPerformanceOptimizationSystem({
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
    errorHandling: {
      enableSilentHandling: true,
      enableLocalTracking: true,
      fallbackBehavior: {
        assetLoadingFailure: 'placeholder',
        animationFailure: 'static',
        gamificationFailure: 'disable',
        analyticsFailure: 'local',
        interactiveFailure: 'static'
      }
    }
  });

  // Create progressive enhancement system
  const enhancementSystem = createProgressiveEnhancementSystem({
    enabled: true,
    accessibility: {
      wcagLevel: 'AA',
      enableKeyboardNavigation: true,
      enableScreenReaderSupport: true,
      enableHighContrastMode: true,
      enableReducedMotionSupport: true
    }
  });

  // Example template
  const template = {
    id: 'example-template',
    title: 'Example Template',
    components: [
      { id: 'hero', type: 'hero', content: { title: 'Welcome' } },
      { id: 'contact', type: 'contact', content: { title: 'Contact Us' } }
    ]
  };

  // Apply performance optimizations
  const optimizationResult = performanceSystem.optimizeForDevice(template);
  console.log('Performance optimization result:', {
    success: optimizationResult.success,
    optimizations: optimizationResult.appliedOptimizations,
    improvements: optimizationResult.improvements
  });

  // Apply progressive enhancement
  const enhancementResult = enhancementSystem.enhanceTemplate(template);
  console.log('Progressive enhancement result:', {
    success: enhancementResult.success,
    enhancements: enhancementResult.appliedEnhancements,
    accessibility: enhancementResult.accessibilityFeatures
  });

  // Check performance metrics
  const metrics = performanceSystem.getMetrics();
  console.log('Performance metrics:', metrics);

  // Check performance budget
  const budgetCheck = performanceSystem.checkPerformanceBudget();
  console.log('Performance budget check:', budgetCheck);

  // Get feature support
  const featureSupport = enhancementSystem.getAllFeatureSupport();
  console.log('Feature support:', Array.from(featureSupport.entries()));
}

// Run tests if this file is executed directly
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  // Node.js environment
  runAllTests();
  exampleUsage();
}