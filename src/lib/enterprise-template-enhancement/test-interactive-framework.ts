/**
 * Interactive Framework Test Suite
 * 
 * Tests the interactive component framework implementation including:
 * - Animation controller functionality
 * - Dynamic content management
 * - Form enhancement features
 * - Media interaction handling
 * - Hover/click effect management
 */

import type { Component } from '../types';
import type { Template } from '../website-templates';
import type {
  InteractiveFramework,
  ScrollAnimationConfig,
  DynamicContentConfiguration,
  InteractiveFormConfig,
  MediaInteractionConfig,
  HoverClickConfig,
  MicroInteractionConfig,
  RealTimeConfig,
  GalleryConfig
} from './types';

import { InteractiveFrameworkImpl } from './interactive-framework';

/**
 * Test Interactive Framework Implementation
 */
export async function testInteractiveFramework(): Promise<void> {
  console.log('🧪 Testing Interactive Framework Implementation...');

  const framework = new InteractiveFrameworkImpl();
  
  // Test data
  const testComponents = createTestComponents();
  const testTemplate = createTestTemplate();

  try {
    // Test 1: Animation Controller
    await testAnimationController(framework, testComponents);
    
    // Test 2: Dynamic Content Manager
    await testDynamicContentManager(framework, testComponents[0]);
    
    // Test 3: Form Enhancer
    await testFormEnhancer(framework, testComponents[1]);
    
    // Test 4: Media Interaction Handler
    await testMediaInteractionHandler(framework, testComponents[2]);
    
    // Test 5: Hover/Click Effect Manager
    await testHoverClickEffectManager(framework, testComponents);
    
    // Test 6: Micro-interactions
    await testMicroInteractions(framework, testTemplate);
    
    // Test 7: Real-time Updates
    await testRealTimeUpdates(framework, testTemplate);
    
    // Test 8: Interactive Gallery
    await testInteractiveGallery(framework, testComponents.slice(2, 5));

    console.log('✅ All Interactive Framework tests passed!');
    
  } catch (error) {
    console.error('❌ Interactive Framework test failed:', error);
    throw error;
  }
}

/**
 * Test Animation Controller
 */
async function testAnimationController(
  framework: InteractiveFramework,
  components: Component[]
): Promise<void> {
  console.log('  Testing Animation Controller...');

  const config: ScrollAnimationConfig = {
    trigger: 'viewport',
    threshold: 0.1,
    once: true,
    stagger: true
  };

  const result = await framework.createScrollAnimations(components, config);
  
  if (!result.success || !result.data) {
    throw new Error('Animation controller test failed');
  }

  const animations = result.data;
  
  // Verify animations were created
  if (animations.length !== components.length) {
    throw new Error(`Expected ${components.length} animations, got ${animations.length}`);
  }

  // Verify animation properties
  animations.forEach((animation, index) => {
    if (!animation.id || !animation.targetSelector) {
      throw new Error(`Animation ${index} missing required properties`);
    }
    
    if (animation.type !== 'scroll') {
      throw new Error(`Expected scroll animation, got ${animation.type}`);
    }
    
    if (config.stagger && animation.delay !== (index + 1) * 100) {
      throw new Error(`Expected staggered delay of ${(index + 1) * 100}ms, got ${animation.delay}ms`);
    }
  });

  console.log('    ✅ Animation Controller tests passed');
}

/**
 * Test Dynamic Content Manager
 */
async function testDynamicContentManager(
  framework: InteractiveFramework,
  component: Component
): Promise<void> {
  console.log('  Testing Dynamic Content Manager...');

  const config: DynamicContentConfiguration = {
    updateTrigger: 'real_time',
    fallbackContent: 'Loading...',
    caching: true,
    personalization: true
  };

  const result = await framework.implementDynamicContent(component, config);
  
  if (!result.success || !result.data) {
    throw new Error('Dynamic content manager test failed');
  }

  const dynamicConfig = result.data;
  
  // Verify dynamic content configuration
  if (!dynamicConfig.id || !dynamicConfig.targetSelector) {
    throw new Error('Dynamic content config missing required properties');
  }
  
  if (dynamicConfig.updateFrequency !== config.updateTrigger) {
    throw new Error(`Expected update frequency ${config.updateTrigger}, got ${dynamicConfig.updateFrequency}`);
  }
  
  if (dynamicConfig.fallbackContent !== config.fallbackContent) {
    throw new Error(`Expected fallback content "${config.fallbackContent}", got "${dynamicConfig.fallbackContent}"`);
  }

  // Verify content rules were created
  if (!dynamicConfig.contentRules || dynamicConfig.contentRules.length === 0) {
    throw new Error('No content rules were created');
  }

  console.log('    ✅ Dynamic Content Manager tests passed');
}

/**
 * Test Form Enhancer
 */
async function testFormEnhancer(
  framework: InteractiveFramework,
  formComponent: Component
): Promise<void> {
  console.log('  Testing Form Enhancer...');

  const config: InteractiveFormConfig = {
    realTimeValidation: true,
    progressIndicator: true,
    smartSuggestions: true,
    conditionalFields: true
  };

  const result = await framework.enhanceFormInteractivity(formComponent, config);
  
  if (!result.success || !result.data) {
    throw new Error('Form enhancer test failed');
  }

  const interactiveForm = result.data;
  
  // Verify form enhancement
  if (!interactiveForm.id) {
    throw new Error('Interactive form missing ID');
  }
  
  if (!interactiveForm.validation || !interactiveForm.validation.realTime) {
    throw new Error('Real-time validation not enabled');
  }
  
  if (!interactiveForm.progressIndicator) {
    throw new Error('Progress indicator not enabled');
  }
  
  if (!interactiveForm.smartSuggestions) {
    throw new Error('Smart suggestions not enabled');
  }

  // Verify validation rules were created
  if (!interactiveForm.validation.rules || interactiveForm.validation.rules.length === 0) {
    throw new Error('No validation rules were created');
  }

  console.log('    ✅ Form Enhancer tests passed');
}

/**
 * Test Media Interaction Handler
 */
async function testMediaInteractionHandler(
  framework: InteractiveFramework,
  mediaComponent: Component
): Promise<void> {
  console.log('  Testing Media Interaction Handler...');

  const config: MediaInteractionConfig = {
    controls: true,
    zoom: true,
    gallery: true,
    autoplay: false,
    captions: true
  };

  const result = await framework.addMediaInteractions(mediaComponent, config);
  
  if (!result.success) {
    throw new Error(`Media interaction handler test failed: ${result.errors.map(e => e.message).join(', ')}`);
  }
  
  if (!result.data) {
    throw new Error('Media interaction handler test failed: No data returned');
  }

  const interactiveMedia = result.data;
  
  // Verify media interactions
  if (!interactiveMedia.id) {
    throw new Error('Interactive media missing ID');
  }
  
  if (!interactiveMedia.interactions) {
    throw new Error('Media interactions not configured');
  }
  
  const interactions = interactiveMedia.interactions;
  
  if (interactions.controls !== config.controls) {
    throw new Error(`Expected controls ${config.controls}, got ${interactions.controls}`);
  }
  
  if (interactions.zoom !== config.zoom) {
    throw new Error(`Expected zoom ${config.zoom}, got ${interactions.zoom}`);
  }
  
  if (interactions.gallery !== config.gallery) {
    throw new Error(`Expected gallery ${config.gallery}, got ${interactions.gallery}`);
  }
  
  if (interactions.autoplay !== config.autoplay) {
    throw new Error(`Expected autoplay ${config.autoplay}, got ${interactions.autoplay}`);
  }

  console.log('    ✅ Media Interaction Handler tests passed');
}

/**
 * Test Hover/Click Effect Manager
 */
async function testHoverClickEffectManager(
  framework: InteractiveFramework,
  components: Component[]
): Promise<void> {
  console.log('  Testing Hover/Click Effect Manager...');

  const config: HoverClickConfig = {
    hoverEffects: ['scale', 'glow'],
    clickEffects: ['ripple', 'bounce'],
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const result = await framework.createHoverClickEffects(components, config);
  
  if (!result.success || !result.data) {
    throw new Error('Hover/click effect manager test failed');
  }

  const interactions = result.data;
  
  // Verify interactions were created
  if (interactions.length !== components.length) {
    throw new Error(`Expected ${components.length} interactions, got ${interactions.length}`);
  }

  // Verify interaction properties
  interactions.forEach((interaction, index) => {
    if (!interaction.id || !interaction.targetSelector) {
      throw new Error(`Interaction ${index} missing required properties`);
    }
    
    if (!interaction.behavior || !interaction.feedback) {
      throw new Error(`Interaction ${index} missing behavior or feedback`);
    }
    
    const behavior = interaction.behavior;
    if (behavior.parameters.duration !== config.duration) {
      throw new Error(`Expected duration ${config.duration}, got ${behavior.parameters.duration}`);
    }
    
    if (behavior.parameters.easing !== config.easing) {
      throw new Error(`Expected easing ${config.easing}, got ${behavior.parameters.easing}`);
    }
  });

  console.log('    ✅ Hover/Click Effect Manager tests passed');
}

/**
 * Test Micro-interactions
 */
async function testMicroInteractions(
  framework: InteractiveFramework,
  template: Template
): Promise<void> {
  console.log('  Testing Micro-interactions...');

  const config: MicroInteractionConfig = {
    buttons: true,
    forms: true,
    navigation: true,
    feedback: true
  };

  const result = await framework.implementMicroInteractions(template, config);
  
  if (!result.success || !result.data) {
    throw new Error('Micro-interactions test failed');
  }

  const enhancedTemplate = result.data;
  
  // Verify template was enhanced
  if (!enhancedTemplate.metadata || !enhancedTemplate.metadata.microInteractions) {
    throw new Error('Micro-interactions metadata not added to template');
  }
  
  const microInteractions = enhancedTemplate.metadata.microInteractions;
  
  if (!microInteractions.enabled) {
    throw new Error('Micro-interactions not enabled');
  }
  
  if (microInteractions.buttons !== config.buttons) {
    throw new Error(`Expected buttons ${config.buttons}, got ${microInteractions.buttons}`);
  }
  
  if (microInteractions.forms !== config.forms) {
    throw new Error(`Expected forms ${config.forms}, got ${microInteractions.forms}`);
  }
  
  if (!microInteractions.script) {
    throw new Error('Micro-interactions script not generated');
  }

  console.log('    ✅ Micro-interactions tests passed');
}

/**
 * Test Real-time Updates
 */
async function testRealTimeUpdates(
  framework: InteractiveFramework,
  template: Template
): Promise<void> {
  console.log('  Testing Real-time Updates...');

  const config: RealTimeConfig = {
    websocket: true,
    polling: true,
    interval: 30000,
    fallback: true
  };

  const result = await framework.addRealTimeUpdates(template, config);
  
  if (!result.success || !result.data) {
    throw new Error('Real-time updates test failed');
  }

  const enhancedTemplate = result.data;
  
  // Verify real-time configuration was added
  if (!enhancedTemplate.metadata || !enhancedTemplate.metadata.realTimeConfig) {
    throw new Error('Real-time config not added to template');
  }
  
  const realTimeConfig = enhancedTemplate.metadata.realTimeConfig;
  
  if (!realTimeConfig.enabled) {
    throw new Error('Real-time updates not enabled');
  }
  
  if (realTimeConfig.websocket !== config.websocket) {
    throw new Error(`Expected websocket ${config.websocket}, got ${realTimeConfig.websocket}`);
  }
  
  if (realTimeConfig.polling !== config.polling) {
    throw new Error(`Expected polling ${config.polling}, got ${realTimeConfig.polling}`);
  }
  
  if (realTimeConfig.interval !== config.interval) {
    throw new Error(`Expected interval ${config.interval}, got ${realTimeConfig.interval}`);
  }

  console.log('    ✅ Real-time Updates tests passed');
}

/**
 * Test Interactive Gallery
 */
async function testInteractiveGallery(
  framework: InteractiveFramework,
  mediaElements: Component[]
): Promise<void> {
  console.log('  Testing Interactive Gallery...');

  const config: GalleryConfig = {
    layout: 'grid',
    navigation: true,
    thumbnails: true,
    fullscreen: true
  };

  const result = await framework.createInteractiveGallery(mediaElements, config);
  
  if (!result.success || !result.data) {
    throw new Error('Interactive gallery test failed');
  }

  const gallery = result.data;
  
  // Verify gallery was created
  if (!gallery.id || gallery.type !== 'gallery') {
    throw new Error('Gallery not properly created');
  }
  
  if (!gallery.content) {
    throw new Error('Gallery content not configured');
  }
  
  const content = gallery.content as any;
  
  if (content.layout !== config.layout) {
    throw new Error(`Expected layout ${config.layout}, got ${content.layout}`);
  }
  
  if (content.navigation !== config.navigation) {
    throw new Error(`Expected navigation ${config.navigation}, got ${content.navigation}`);
  }
  
  if (content.thumbnails !== config.thumbnails) {
    throw new Error(`Expected thumbnails ${config.thumbnails}, got ${content.thumbnails}`);
  }
  
  if (!content.items || content.items.length !== mediaElements.length) {
    throw new Error(`Expected ${mediaElements.length} gallery items, got ${content.items?.length || 0}`);
  }

  console.log('    ✅ Interactive Gallery tests passed');
}

/**
 * Create test components for testing
 */
function createTestComponents(): Component[] {
  return [
    {
      id: 'test-hero',
      type: 'hero',
      className: 'hero-section',
      content: {
        title: 'Test Hero Section',
        subtitle: 'This is a test hero component',
        cta: 'Get Started'
      }
    },
    {
      id: 'test-form',
      type: 'contact',
      className: 'contact-form',
      content: {
        title: 'Contact Us',
        fields: ['name', 'email', 'message']
      }
    },
    {
      id: 'test-image',
      type: 'image',
      className: 'feature-image',
      content: {
        src: '/test-image.jpg',
        alt: 'Test Image'
      }
    },
    {
      id: 'test-video',
      type: 'video',
      className: 'feature-video',
      content: {
        src: '/test-video.mp4',
        poster: '/test-poster.jpg'
      }
    },
    {
      id: 'test-gallery-image',
      type: 'image',
      className: 'gallery-image',
      content: {
        src: '/gallery-image.jpg',
        alt: 'Gallery Image'
      }
    }
  ];
}

/**
 * Create test template for testing
 */
function createTestTemplate(): Template {
  return {
    id: 'test-template',
    title: 'Test Template',
    description: 'A test template for interactive framework testing',
    category: 'business',
    components: createTestComponents(),
    metadata: {
      version: '1.0.0',
      author: 'Test Suite'
    }
  };
}

/**
 * Run performance tests
 */
export async function testInteractiveFrameworkPerformance(): Promise<void> {
  console.log('🚀 Testing Interactive Framework Performance...');

  const framework = new InteractiveFrameworkImpl();
  const components = Array.from({ length: 100 }, (_, i) => ({
    id: `perf-test-${i}`,
    type: 'card',
    className: 'performance-test-card',
    content: { title: `Performance Test Card ${i}` }
  }));

  const startTime = performance.now();

  try {
    // Test bulk animation creation
    const animationResult = await framework.createScrollAnimations(components);
    if (!animationResult.success) {
      throw new Error('Bulk animation creation failed');
    }

    // Test bulk hover effects
    const hoverResult = await framework.createHoverClickEffects(components);
    if (!hoverResult.success) {
      throw new Error('Bulk hover effects creation failed');
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`  ✅ Performance test completed in ${duration.toFixed(2)}ms`);
    console.log(`  📊 Average time per component: ${(duration / components.length).toFixed(2)}ms`);

    // Performance thresholds
    const maxTimePerComponent = 10; // 10ms per component
    const avgTimePerComponent = duration / components.length;

    if (avgTimePerComponent > maxTimePerComponent) {
      console.warn(`  ⚠️  Performance warning: ${avgTimePerComponent.toFixed(2)}ms per component exceeds ${maxTimePerComponent}ms threshold`);
    } else {
      console.log(`  🎯 Performance excellent: ${avgTimePerComponent.toFixed(2)}ms per component`);
    }

  } catch (error) {
    console.error('❌ Performance test failed:', error);
    throw error;
  }
}

/**
 * Run all interactive framework tests
 */
export async function runInteractiveFrameworkTests(): Promise<void> {
  console.log('🧪 Running Interactive Framework Test Suite...\n');

  try {
    await testInteractiveFramework();
    await testInteractiveFrameworkPerformance();
    
    console.log('\n🎉 All Interactive Framework tests completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Interactive Framework tests failed:', error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runInteractiveFrameworkTests();
}