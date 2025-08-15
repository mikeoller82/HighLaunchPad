/**
 * Animation Controller
 * 
 * Handles scroll-based and interaction-triggered animations for enhanced user experiences.
 * Provides smooth, performant animations that respond to user interactions and viewport changes.
 */

import type { Component } from '../types';
import type {
  AnimationConfig,
  AnimationTrigger
} from './types';
import type {
  ScrollAnimationConfig
} from './interfaces';

/**
 * Animation Controller Class
 * 
 * Creates and manages animations for template components including:
 * - Scroll-based animations (fade in, slide in, etc.)
 * - Interaction-triggered animations (hover, click, focus)
 * - Performance-optimized animation configurations
 */
export class AnimationController {
  private animationId = 0;

  /**
   * Create scroll-based animation for a component
   */
  async createScrollAnimation(
    element: Component,
    config?: ScrollAnimationConfig
  ): Promise<AnimationConfig> {
    const animationConfig: AnimationConfig = {
      id: `scroll-animation-${++this.animationId}`,
      type: 'scroll',
      name: `Scroll Animation for ${element.type}`,
      description: `Scroll-triggered animation for ${element.type} component`,
      targetSelector: this.generateSelector(element),
      animationType: this.determineAnimationType(element, config),
      duration: config?.threshold ? Math.max(300, config.threshold * 100) : 600,
      delay: config?.stagger ? this.animationId * 100 : 0,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design easing
      trigger: this.createScrollTrigger(config),
      responsive: true
    };

    return animationConfig;
  }

  /**
   * Create interaction-triggered animation
   */
  async createInteractionAnimation(
    element: Component,
    interactionType: 'hover' | 'click' | 'focus'
  ): Promise<AnimationConfig> {
    const animationConfig: AnimationConfig = {
      id: `${interactionType}-animation-${++this.animationId}`,
      type: interactionType,
      name: `${interactionType} Animation for ${element.type}`,
      description: `${interactionType}-triggered animation for ${element.type} component`,
      targetSelector: this.generateSelector(element),
      animationType: this.getInteractionAnimationType(interactionType),
      duration: this.getInteractionDuration(interactionType),
      delay: 0,
      easing: this.getInteractionEasing(interactionType),
      trigger: {
        event: interactionType,
        threshold: 0,
        once: false
      },
      responsive: true
    };

    return animationConfig;
  }

  /**
   * Create staggered animations for multiple elements
   */
  async createStaggeredAnimations(
    elements: Component[],
    config?: ScrollAnimationConfig
  ): Promise<AnimationConfig[]> {
    const animations: AnimationConfig[] = [];

    // Provide default values for required ScrollAnimationConfig properties
    const defaultConfig: ScrollAnimationConfig = {
      trigger: 'viewport',
      threshold: 0.1,
      once: true,
      stagger: true
    };

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const staggerConfig: ScrollAnimationConfig = {
        ...defaultConfig,
        ...config,
        stagger: true
      };

      const animation = await this.createScrollAnimation(element, staggerConfig);
      animation.delay = (i + 1) * 100; // 100ms stagger delay starting from 100
      animations.push(animation);
    }

    return animations;
  }

  /**
   * Generate CSS selector for component
   */
  private generateSelector(element: Component): string {
    // Use component ID if available
    if (element.id) {
      return `[data-component-id="${element.id}"]`;
    }

    // Use component name if available
    if (element.name) {
      return `[data-component-name="${element.name}"]`;
    }

    // Fall back to component type
    return `[data-component-type="${element.type}"]`;
  }

  /**
   * Determine appropriate animation type based on element and config
   */
  private determineAnimationType(
    element: Component,
    config?: ScrollAnimationConfig
  ): AnimationConfig['animationType'] {
    // Default animations based on component type
    const typeAnimations: Record<string, AnimationConfig['animationType']> = {
      'hero': 'fade',
      'heading': 'slide',
      'text': 'fade',
      'image': 'scale',
      'button': 'bounce',
      'card': 'slide',
      'testimonial': 'fade',
      'feature': 'slide',
      'pricing': 'scale',
      'form': 'slide'
    };

    // Use element-specific animation or default to fade
    return typeAnimations[element.type] || 'fade';
  }

  /**
   * Create scroll trigger configuration
   */
  private createScrollTrigger(config?: ScrollAnimationConfig): AnimationTrigger {
    return {
      event: 'scroll',
      threshold: config?.threshold || 0.1, // 10% of element visible
      offset: 0,
      once: config?.once !== false, // Default to true
      condition: config?.trigger === 'scroll_depth' ? 'scrollDepth > 50' : undefined
    };
  }

  /**
   * Get animation type for interaction
   */
  private getInteractionAnimationType(
    interactionType: 'hover' | 'click' | 'focus'
  ): AnimationConfig['animationType'] {
    const interactionAnimations: Record<'hover' | 'click' | 'focus', AnimationConfig['animationType']> = {
      hover: 'scale',
      click: 'pulse',
      focus: 'fade' // Changed from 'glow' to 'fade' as 'glow' is not in the union type
    };

    return interactionAnimations[interactionType];
  }

  /**
   * Get duration for interaction animation
   */
  private getInteractionDuration(interactionType: 'hover' | 'click' | 'focus'): number {
    const durations = {
      hover: 200,
      click: 150,
      focus: 300
    };

    return durations[interactionType];
  }

  /**
   * Get easing for interaction animation
   */
  private getInteractionEasing(interactionType: 'hover' | 'click' | 'focus'): string {
    const easings = {
      hover: 'cubic-bezier(0.4, 0, 0.2, 1)',
      click: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Back easing
      focus: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' // Ease out
    };

    return easings[interactionType];
  }

  /**
   * Generate CSS keyframes for animation
   */
  generateKeyframes(animation: AnimationConfig): string {
    const keyframes = this.getKeyframesForAnimationType(animation.animationType);

    return `
      @keyframes ${animation.id} {
        ${keyframes}
      }
      
      ${animation.targetSelector} {
        animation: ${animation.id} ${animation.duration}ms ${animation.easing} ${animation.delay}ms;
      }
    `;
  }

  /**
   * Get keyframes for specific animation type
   */
  private getKeyframesForAnimationType(animationType: AnimationConfig['animationType']): string {
    const keyframeMap: Record<AnimationConfig['animationType'], string> = {
      fade: `
        0% { opacity: 0; }
        100% { opacity: 1; }
      `,
      slide: `
        0% { transform: translateY(30px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      `,
      scale: `
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      `,
      rotate: `
        0% { transform: rotate(-5deg) scale(0.8); opacity: 0; }
        100% { transform: rotate(0deg) scale(1); opacity: 1; }
      `,
      bounce: `
        0% { transform: translateY(-10px); opacity: 0; }
        50% { transform: translateY(5px); opacity: 0.8; }
        100% { transform: translateY(0); opacity: 1; }
      `,
      pulse: `
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      `,
      shake: `
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      `,
      flip: `
        0% { transform: perspective(400px) rotateY(-90deg); opacity: 0; }
        100% { transform: perspective(400px) rotateY(0deg); opacity: 1; }
      `,
      blur: `
        0% { filter: blur(5px); opacity: 0; }
        100% { filter: blur(0px); opacity: 1; }
      `
    };

    return keyframeMap[animationType];
  }

  /**
   * Create intersection observer for scroll animations
   */
  createIntersectionObserver(animations: AnimationConfig[]): string {
    return `
      // Intersection Observer for scroll animations
      const observerOptions = {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: '0px 0px -50px 0px'
      };

      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Only observe once for one-time animations
            if (entry.target.dataset.animateOnce === 'true') {
              animationObserver.unobserve(entry.target);
            }
          } else {
            // Remove animation class for repeatable animations
            if (entry.target.dataset.animateOnce !== 'true') {
              entry.target.classList.remove('animate-in');
            }
          }
        });
      }, observerOptions);

      // Observe all animated elements
      ${animations.map(animation => `
        document.querySelectorAll('${animation.targetSelector}').forEach(el => {
          el.dataset.animateOnce = '${animation.trigger.once}';
          animationObserver.observe(el);
        });
      `).join('\n')}
    `;
  }
}