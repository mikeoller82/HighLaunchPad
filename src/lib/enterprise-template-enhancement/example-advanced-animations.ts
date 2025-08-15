/**
 * Advanced Animation System Usage Examples
 * 
 * Demonstrates how to use the advanced animation and visual effects system
 * in enterprise template enhancements
 */

import { AdvancedAnimationSystem } from './advanced-animation-system';
import type { Component } from '../types';
import type {
  ModernAnimationType,
  ModernAnimationOptions,
  ScrollRevealOptions,
  WebGL3DConfig,
  VideoBackgroundConfig,
  VisualFeedbackConfig,
  ParallaxConfig
} from './advanced-animation-types';

/**
 * Example: Creating Modern Animations
 */
export async function createModernAnimationExample() {
  const animationSystem = new AdvancedAnimationSystem();

  // Example button component
  const buttonComponent: Component = {
    id: 1,
    type: 'button' as Component['type'],
    content: { text: 'Get Started Now' },
    metadata: {},
    design: {
      typography: {},
      colors: { backgroundColor: '#007bff', color: 'white' },
      shadows: {},
      borders: { borderRadius: '8px' },
      interactions: {}
    }
  };

  // Create elastic animation for button
  const elasticOptions: ModernAnimationOptions = {
    duration: 600,
    trigger: 'hover',
    intensity: 1.2,
    direction: 'center'
  };

  const elasticAnimation = await animationSystem.createModernAnimation(
    buttonComponent,
    'elastic',
    elasticOptions
  );

  console.log('Elastic Animation Created:', elasticAnimation);

  // Create morphing animation for card
  const cardComponent: Component = {
    id: 2,
    type: 'features' as Component['type'],
    content: { title: 'Feature Card' },
    metadata: {},
    design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} }
  };

  const morphingAnimation = await animationSystem.createModernAnimation(
    cardComponent,
    'morphing',
    { duration: 800, trigger: 'hover' }
  );

  console.log('Morphing Animation Created:', morphingAnimation);

  return { elasticAnimation, morphingAnimation };
}

/**
 * Example: Creating Scroll Reveal Animations
 */
export async function createScrollRevealExample() {
  const animationSystem = new AdvancedAnimationSystem();

  // Example components for scroll reveal
  const components: Component[] = [
    { id: 3, type: 'text' as Component['type'], content: { title: 'Welcome to Our Platform' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 4, type: 'text' as Component['type'], content: { text: 'Transform your business with AI' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 5, type: 'button' as Component['type'], content: { text: 'Start Free Trial' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 6, type: 'features' as Component['type'], content: { title: 'Feature 1' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 7, type: 'features' as Component['type'], content: { title: 'Feature 2' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 8, type: 'features' as Component['type'], content: { title: 'Feature 3' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } }
  ];

  // Configure scroll reveal with stagger effect
  const scrollOptions: ScrollRevealOptions = {
    animationType: 'fade',
    duration: 800,
    stagger: true,
    staggerDelay: 150,
    threshold: 0.2,
    once: true,
    distance: '50px',
    origin: 'bottom'
  };

  const scrollAnimations = await animationSystem.createScrollRevealAnimation(
    components,
    scrollOptions
  );

  console.log(`Created ${scrollAnimations.length} scroll reveal animations`);
  return scrollAnimations;
}

/**
 * Example: Creating 3D Graphics System
 */
export async function create3DGraphicsExample() {
  const animationSystem = new AdvancedAnimationSystem();

  // This would work in a browser environment
  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.height = '600px';

  const config: WebGL3DConfig = {
    width: 800,
    height: 600,
    antialias: true,
    alpha: true,
    scene: {
      background: '#1a1a2e',
      fog: { color: '#1a1a2e', near: 1, far: 100 },
      lighting: {
        ambient: { color: '#404040', intensity: 0.4 },
        directional: { 
          color: '#ffffff', 
          intensity: 0.8, 
          position: [1, 1, 1] 
        },
        point: [{
          color: '#00ff88',
          intensity: 0.6,
          position: [0, 5, 0],
          distance: 20
        }]
      }
    },
    camera: {
      type: 'perspective',
      fov: 75,
      position: [0, 0, 10],
      near: 0.1,
      far: 1000
    },
    controls: {
      enabled: true,
      autoRotate: true,
      enableZoom: true,
      enablePan: false,
      minDistance: 5,
      maxDistance: 50
    }
  };

  try {
    const system3D = await animationSystem.create3DGraphicsSystem(container, config);
    console.log('3D Graphics System Created:', system3D);
    return system3D;
  } catch (error) {
    console.log('3D Graphics not supported in this environment:', error);
    return null;
  }
}

/**
 * Example: Creating Video Background
 */
export async function createVideoBackgroundExample() {
  const animationSystem = new AdvancedAnimationSystem();

  const heroComponent: Component = {
    id: 9,
    type: 'hero' as Component['type'],
    content: { title: 'Hero Section with Video Background' },
    metadata: {},
    design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} }
  };

  const videoConfig: VideoBackgroundConfig = {
    src: 'https://example.com/hero-video.mp4',
    poster: 'https://example.com/hero-poster.jpg',
    autoplay: true,
    loop: true,
    muted: true,
    overlay: {
      gradient: 'linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,123,255,0.2))',
      opacity: 0.6
    },
    parallax: {
      speed: 0.3,
      direction: 'vertical'
    },
    effects: {
      blur: 1,
      brightness: 0.9,
      contrast: 1.1
    },
    responsive: {
      mobile: 'https://example.com/hero-video-mobile.mp4',
      tablet: 'https://example.com/hero-video-tablet.mp4'
    }
  };

  try {
    const videoSystem = await animationSystem.createVideoBackground(heroComponent, videoConfig);
    console.log('Video Background System Created:', videoSystem);
    return videoSystem;
  } catch (error) {
    console.log('Video background not supported in this environment:', error);
    return null;
  }
}

/**
 * Example: Creating Visual Feedback System
 */
export async function createVisualFeedbackExample() {
  const animationSystem = new AdvancedAnimationSystem();

  const interactiveButton: Component = {
    id: 10,
    type: 'button' as Component['type'],
    content: { text: 'Interactive Button' },
    metadata: {},
    design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} }
  };

  const feedbackConfig: VisualFeedbackConfig = {
    hover: {
      scale: 1.05,
      glow: true,
      colorShift: '10deg',
      shadow: true,
      transform: 'translateY(-2px)'
    },
    click: {
      ripple: true,
      bounce: false,
      flash: false
    },
    focus: {
      outline: true,
      glow: true,
      scale: 1.02
    },
    loading: {
      spinner: true,
      pulse: false,
      skeleton: false
    },
    success: {
      checkmark: true,
      glow: true,
      bounce: true
    },
    error: {
      shake: true,
      flash: true,
      border: true
    }
  };

  const feedbackSystem = await animationSystem.createVisualFeedbackSystem(
    interactiveButton,
    feedbackConfig
  );

  console.log('Visual Feedback System Created:', feedbackSystem);
  return feedbackSystem;
}

/**
 * Example: Creating Parallax System
 */
export async function createParallaxExample() {
  const animationSystem = new AdvancedAnimationSystem();

  const parallaxComponents: Component[] = [
    { id: 11, type: 'text' as Component['type'], content: { title: 'Background Layer 1' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 12, type: 'text' as Component['type'], content: { title: 'Background Layer 2' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 13, type: 'text' as Component['type'], content: { title: 'Main Content' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
    { id: 14, type: 'image' as Component['type'], content: { image: 'Foreground Elements' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } }
  ];

  const parallaxConfig: ParallaxConfig = {
    speeds: [0.2, 0.4, 0.8, 1.2], // Different speeds for each layer
    direction: 'vertical',
    threshold: 0.1,
    smooth: true,
    performance: {
      throttle: 16, // 60fps
      useRAF: true,
      maxFPS: 60
    }
  };

  try {
    const parallaxSystem = await animationSystem.createParallaxSystem(
      parallaxComponents,
      parallaxConfig
    );

    console.log('Parallax System Created:', parallaxSystem);
    return parallaxSystem;
  } catch (error) {
    console.log('Parallax system not supported in this environment:', error);
    return null;
  }
}

/**
 * Example: Generating Complete Animation CSS and JS
 */
export async function generateCompleteAnimationCode() {
  const animationSystem = new AdvancedAnimationSystem();

  // Create various animations
  const buttonComponent: Component = {
    id: 15,
    type: 'button' as Component['type'],
    content: { text: 'Demo Button' },
    metadata: {},
    design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} }
  };

  const cardComponent: Component = {
    id: 16,
    type: 'features' as Component['type'],
    content: { title: 'Demo Card' },
    metadata: {},
    design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} }
  };

  // Create animation configurations
  const animations = [
    await animationSystem.createModernAnimation(buttonComponent, 'elastic'),
    await animationSystem.createModernAnimation(cardComponent, 'morphing')
  ];

  const scrollAnimations = await animationSystem.createScrollRevealAnimation([
    buttonComponent,
    cardComponent
  ]);

  const allAnimations = [...animations, ...scrollAnimations];

  // Generate CSS
  const css = animationSystem.generateAdvancedCSS(allAnimations);

  // Generate JavaScript
  const systems = [
    {
      type: 'modern' as const,
      config: {},
      isActive: true,
      performance: { fps: 60, frameTime: 16.67, memoryUsage: 50, cpuUsage: 30, renderTime: 10 }
    }
  ];

  const js = animationSystem.generateAdvancedJS(systems);

  console.log('Generated CSS length:', css.length);
  console.log('Generated JS length:', js.length);

  return { css, js, animations: allAnimations };
}

/**
 * Example: Complete Enterprise Template Enhancement
 */
export async function createEnterpriseTemplateExample() {
  console.log('🚀 Creating Enterprise Template with Advanced Animations...\n');

  const animationSystem = new AdvancedAnimationSystem();

  // Define template components
  const templateComponents = {
    hero: {
      id: 17,
      type: 'hero' as Component['type'],
      content: { title: 'Transform Your Business with AI' },
      metadata: {},
      design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} }
    },
    features: [
      { id: 18, type: 'features' as Component['type'], content: { title: 'AI-Powered Analytics' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
      { id: 19, type: 'features' as Component['type'], content: { title: 'Smart Automation' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
      { id: 20, type: 'features' as Component['type'], content: { title: 'Real-time Insights' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } }
    ],
    cta: {
      id: 21,
      type: 'button' as Component['type'],
      content: { text: 'Start Your Free Trial' },
      metadata: {},
      design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} }
    },
    testimonials: [
      { id: 22, type: 'testimonials' as Component['type'], content: { text: 'Great product!' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } },
      { id: 23, type: 'testimonials' as Component['type'], content: { text: 'Amazing results!' }, metadata: {}, design: { typography: {}, colors: {}, shadows: {}, borders: {}, interactions: {} } }
    ]
  };

  // Create hero animations
  const heroAnimations = await Promise.all([
    animationSystem.createModernAnimation(templateComponents.hero, 'floating', {
      duration: 3000,
      trigger: 'load'
    }),
    animationSystem.createModernAnimation(templateComponents.cta, 'pulse-glow', {
      duration: 2000,
      trigger: 'hover'
    })
  ]);

  // Create feature card animations
  const featureAnimations = await animationSystem.createScrollRevealAnimation(
    templateComponents.features,
    {
      animationType: 'scale',
      duration: 600,
      stagger: true,
      staggerDelay: 200,
      threshold: 0.3
    }
  );

  // Create testimonial animations
  const testimonialAnimations = await animationSystem.createScrollRevealAnimation(
    templateComponents.testimonials,
    {
      animationType: 'fade',
      duration: 800,
      stagger: true,
      staggerDelay: 300
    }
  );

  // Create visual feedback for interactive elements
  const ctaFeedback = await animationSystem.createVisualFeedbackSystem(
    templateComponents.cta,
    {
      hover: { scale: 1.05, glow: true, shadow: true },
      click: { ripple: true },
      focus: { outline: true, glow: true }
    }
  );

  // Combine all animations
  const allAnimations = [
    ...heroAnimations,
    ...featureAnimations,
    ...testimonialAnimations
  ];

  // Generate final CSS and JS
  const css = animationSystem.generateAdvancedCSS(allAnimations);
  const js = animationSystem.generateAdvancedJS([
    {
      type: 'modern',
      config: {},
      isActive: true,
      performance: { fps: 60, frameTime: 16.67, memoryUsage: 50, cpuUsage: 30, renderTime: 10 }
    }
  ]);

  console.log('✅ Enterprise template animations created successfully!');
  console.log(`📊 Total animations: ${allAnimations.length}`);
  console.log(`📝 Generated CSS: ${css.length} characters`);
  console.log(`⚡ Generated JS: ${js.length} characters`);

  return {
    animations: allAnimations,
    css,
    js,
    feedbackSystems: [ctaFeedback],
    components: templateComponents
  };
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🎬 Running Advanced Animation System Examples...\n');

  try {
    // Run each example
    await createModernAnimationExample();
    await createScrollRevealExample();
    await create3DGraphicsExample();
    await createVideoBackgroundExample();
    await createVisualFeedbackExample();
    await createParallaxExample();
    await generateCompleteAnimationCode();
    await createEnterpriseTemplateExample();

    console.log('\n🎉 All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}