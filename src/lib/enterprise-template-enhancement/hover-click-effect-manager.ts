/**
 * Hover Click Effect Manager
 * 
 * Manages micro-interactions, hover effects, and click feedback for enhanced user experience.
 * Provides smooth, performant effects that respond to user interactions.
 */

import type { Component } from '../types';
import type { Template } from '../website-templates';
import type { FunnelTemplate } from '../types';
import type {
  InteractionBehavior,
  InteractionFeedback,
  InteractionConfig
} from './types';
import type {
  HoverClickConfig,
  MicroInteractionConfig
} from './interfaces';

/**
 * Hover Click Effect Manager Class
 * 
 * Provides comprehensive interaction effect functionality including:
 * - Hover effects with smooth transitions
 * - Click feedback and micro-interactions
 * - State management for interactive elements
 * - Performance-optimized animations
 */
export class HoverClickEffectManager {
  private effectId = 0;
  private activeEffects: Map<string, any> = new Map();

  /**
   * Create hover and click effect for a component
   */
  async createHoverClickEffect(
    element: Component,
    config?: HoverClickConfig
  ): Promise<InteractionConfig> {
    const interactionConfig: InteractionConfig = {
      id: `interaction-${++this.effectId}`,
      type: 'hover',
      name: `Hover/Click Effect for ${element.type}`,
      targetSelector: this.generateSelector(element),
      behavior: this.createInteractionBehavior(element, config),
      feedback: this.createInteractionFeedback(element, config),
      analytics: {
        trackClicks: true,
        trackHovers: true,
        trackScrollDepth: false,
        customEvents: ['hover_start', 'hover_end', 'click_effect']
      }
    };

    return interactionConfig;
  }

  /**
   * Add micro-interactions to a template
   */
  async addMicroInteractions(
    template: Template | FunnelTemplate,
    config?: MicroInteractionConfig
  ): Promise<Template | FunnelTemplate> {
    const enhancedTemplate = { ...template };

    // Add micro-interaction metadata
    if (!enhancedTemplate.metadata) {
      enhancedTemplate.metadata = {};
    }

    enhancedTemplate.metadata.microInteractions = {
      enabled: true,
      buttons: config?.buttons !== false,
      forms: config?.forms !== false,
      navigation: config?.navigation !== false,
      feedback: config?.feedback !== false,
      script: this.generateMicroInteractionScript(config)
    };

    return enhancedTemplate;
  }

  /**
   * Create button-specific hover effects
   */
  async createButtonEffects(
    button: Component,
    effectType: 'glow' | 'scale' | 'slide' | 'ripple' | 'bounce' = 'scale'
  ): Promise<InteractionConfig> {
    const buttonEffect: InteractionConfig = {
      id: `button-effect-${++this.effectId}`,
      type: 'hover',
      name: `Button ${effectType} Effect`,
      targetSelector: this.generateSelector(button),
      behavior: {
        action: effectType,
        parameters: this.getButtonEffectParameters(effectType),
        conditions: ['element.tagName === "BUTTON" || element.classList.contains("btn")'],
        cooldown: 100
      },
      feedback: {
        visual: {
          type: effectType as any,
          duration: 200,
          intensity: 1
        }
      }
    };

    return buttonEffect;
  }

  /**
   * Create card hover effects
   */
  async createCardEffects(
    card: Component,
    effectType: 'lift' | 'tilt' | 'glow' | 'border' = 'lift'
  ): Promise<InteractionConfig> {
    const cardEffect: InteractionConfig = {
      id: `card-effect-${++this.effectId}`,
      type: 'hover',
      name: `Card ${effectType} Effect`,
      targetSelector: this.generateSelector(card),
      behavior: {
        action: effectType,
        parameters: this.getCardEffectParameters(effectType),
        conditions: ['element.classList.contains("card") || element.dataset.component === "card"'],
        cooldown: 0
      },
      feedback: {
        visual: {
          type: effectType as any,
          duration: 300,
          intensity: 1
        }
      }
    };

    return cardEffect;
  }

  /**
   * Create form field focus effects
   */
  async createFormFieldEffects(
    field: Component
  ): Promise<InteractionConfig> {
    const fieldEffect: InteractionConfig = {
      id: `field-effect-${++this.effectId}`,
      type: 'form',
      name: 'Form Field Focus Effect',
      targetSelector: this.generateSelector(field),
      behavior: {
        action: 'focus_highlight',
        parameters: {
          borderColor: '#4299e1',
          shadowColor: 'rgba(66, 153, 225, 0.3)',
          labelAnimation: 'float'
        },
        conditions: ['element.tagName === "INPUT" || element.tagName === "TEXTAREA"']
      },
      feedback: {
        visual: {
          type: 'highlight',
          duration: 200,
          intensity: 1
        }
      }
    };

    return fieldEffect;
  }

  /**
   * Generate selector for component
   */
  private generateSelector(component: Component): string {
    if (component.id) {
      return `#${component.id}`;
    }
    
    if (component.design?.customClasses) {
      return `.${component.design.customClasses.split(' ')[0]}`;
    }
    
    return `[data-component="${component.type}"]`;
  }

  /**
   * Create interaction behavior configuration
   */
  private createInteractionBehavior(
    element: Component,
    config?: HoverClickConfig
  ): InteractionBehavior {
    const defaultEffects = this.getDefaultEffectsForElement(element);
    
    return {
      action: 'multi_effect',
      parameters: {
        hoverEffects: config?.hoverEffects || defaultEffects.hover,
        clickEffects: config?.clickEffects || defaultEffects.click,
        duration: config?.duration || 200,
        easing: config?.easing || 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      conditions: [`element.matches('${this.generateSelector(element)}')`],
      cooldown: 50
    };
  }

  /**
   * Create interaction feedback configuration
   */
  private createInteractionFeedback(
    element: Component,
    config?: HoverClickConfig
  ): InteractionFeedback {
    return {
      visual: {
        type: 'scale',
        duration: config?.duration || 200,
        intensity: 1
      },
      haptic: {
        type: 'light',
        duration: 50
      }
    };
  }

  /**
   * Get default effects for element type
   */
  private getDefaultEffectsForElement(element: Component): { hover: string[], click: string[] } {
    const effectMap: Record<string, { hover: string[], click: string[] }> = {
      'button': {
        hover: ['scale', 'glow'],
        click: ['ripple', 'bounce']
      },
      'card': {
        hover: ['lift', 'glow'],
        click: ['scale']
      },
      'image': {
        hover: ['scale', 'overlay'],
        click: ['zoom']
      },
      'link': {
        hover: ['underline', 'color_change'],
        click: ['pulse']
      },
      'testimonial': {
        hover: ['lift', 'border_glow'],
        click: ['highlight']
      },
      'pricing': {
        hover: ['lift', 'border_highlight'],
        click: ['pulse']
      },
      'feature': {
        hover: ['icon_bounce', 'text_highlight'],
        click: ['expand']
      }
    };

    return effectMap[element.type] || {
      hover: ['scale'],
      click: ['pulse']
    };
  }

  /**
   * Get button effect parameters
   */
  private getButtonEffectParameters(effectType: string): Record<string, any> {
    const parameterMap: Record<string, Record<string, any>> = {
      'glow': {
        boxShadow: '0 0 20px rgba(66, 153, 225, 0.6)',
        transform: 'translateY(-2px)'
      },
      'scale': {
        transform: 'scale(1.05)',
        transition: 'transform 0.2s ease'
      },
      'slide': {
        transform: 'translateX(5px)',
        transition: 'transform 0.2s ease'
      },
      'ripple': {
        position: 'relative',
        overflow: 'hidden',
        rippleColor: 'rgba(255, 255, 255, 0.3)'
      },
      'bounce': {
        animation: 'bounce 0.3s ease',
        transformOrigin: 'center'
      }
    };

    return parameterMap[effectType] || {};
  }

  /**
   * Get card effect parameters
   */
  private getCardEffectParameters(effectType: string): Record<string, any> {
    const parameterMap: Record<string, Record<string, any>> = {
      'lift': {
        transform: 'translateY(-8px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease'
      },
      'tilt': {
        transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg)',
        transition: 'transform 0.3s ease'
      },
      'glow': {
        boxShadow: '0 0 30px rgba(66, 153, 225, 0.3)',
        borderColor: '#4299e1',
        transition: 'all 0.3s ease'
      },
      'border': {
        borderColor: '#4299e1',
        borderWidth: '2px',
        transition: 'border 0.3s ease'
      }
    };

    return parameterMap[effectType] || {};
  }

  /**
   * Generate micro-interaction script
   */
  private generateMicroInteractionScript(config?: MicroInteractionConfig): string {
    return `
      // Micro-Interactions Manager
      class MicroInteractionsManager {
        constructor() {
          this.config = ${JSON.stringify(config || {})};
          this.activeAnimations = new Map();
          this.init();
        }

        init() {
          this.setupGlobalStyles();
          
          if (this.config.buttons !== false) {
            this.initButtonInteractions();
          }
          
          if (this.config.forms !== false) {
            this.initFormInteractions();
          }
          
          if (this.config.navigation !== false) {
            this.initNavigationInteractions();
          }
          
          if (this.config.feedback !== false) {
            this.initFeedbackInteractions();
          }
        }

        setupGlobalStyles() {
          const styles = document.createElement('style');
          styles.textContent = \`
            /* Micro-interaction base styles */
            .micro-hover {
              transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .micro-scale:hover {
              transform: scale(1.05);
            }

            .micro-lift:hover {
              transform: translateY(-4px);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }

            .micro-glow:hover {
              box-shadow: 0 0 20px rgba(66, 153, 225, 0.4);
            }

            .micro-bounce {
              animation: micro-bounce 0.3s ease;
            }

            .micro-pulse {
              animation: micro-pulse 0.4s ease;
            }

            .micro-ripple {
              position: relative;
              overflow: hidden;
            }

            .micro-ripple::after {
              content: '';
              position: absolute;
              top: 50%;
              left: 50%;
              width: 0;
              height: 0;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.3);
              transform: translate(-50%, -50%);
              transition: width 0.3s, height 0.3s;
            }

            .micro-ripple:active::after {
              width: 200px;
              height: 200px;
            }

            @keyframes micro-bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }

            @keyframes micro-pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }

            @keyframes micro-shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-5px); }
              75% { transform: translateX(5px); }
            }

            /* Form field focus effects */
            .form-field {
              position: relative;
              transition: all 0.2s ease;
            }

            .form-field input:focus,
            .form-field textarea:focus {
              border-color: #4299e1;
              box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
              outline: none;
            }

            .form-field label {
              transition: all 0.2s ease;
            }

            .form-field input:focus + label,
            .form-field textarea:focus + label {
              color: #4299e1;
              transform: translateY(-2px);
            }

            /* Navigation hover effects */
            .nav-item {
              position: relative;
              transition: color 0.2s ease;
            }

            .nav-item::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 2px;
              background: #4299e1;
              transition: width 0.3s ease;
            }

            .nav-item:hover::after {
              width: 100%;
            }
          \`;
          
          document.head.appendChild(styles);
        }

        initButtonInteractions() {
          const buttons = document.querySelectorAll('button, .btn, [role="button"]');
          
          buttons.forEach(button => {
            this.addButtonEffects(button);
          });
        }

        addButtonEffects(button) {
          // Add base classes
          button.classList.add('micro-hover');
          
          // Determine effect type based on button type
          const effectType = this.getButtonEffectType(button);
          button.classList.add(\`micro-\${effectType}\`);

          // Add click effect
          button.addEventListener('click', (e) => {
            this.triggerClickEffect(button, e);
          });

          // Add ripple effect for material design buttons
          if (button.classList.contains('btn-material') || button.dataset.ripple === 'true') {
            button.classList.add('micro-ripple');
          }
        }

        getButtonEffectType(button) {
          if (button.classList.contains('btn-primary')) return 'glow';
          if (button.classList.contains('btn-secondary')) return 'lift';
          if (button.classList.contains('btn-outline')) return 'scale';
          return 'scale'; // default
        }

        triggerClickEffect(element, event) {
          // Prevent multiple simultaneous animations
          if (this.activeAnimations.has(element)) return;

          // Add click animation class
          element.classList.add('micro-pulse');
          this.activeAnimations.set(element, true);

          // Create ripple effect at click position
          if (element.classList.contains('micro-ripple')) {
            this.createRippleEffect(element, event);
          }

          // Remove animation class after completion
          setTimeout(() => {
            element.classList.remove('micro-pulse');
            this.activeAnimations.delete(element);
          }, 400);

          // Track interaction
          this.trackInteraction('button_click', {
            elementType: element.tagName,
            className: element.className,
            text: element.textContent?.trim()
          });
        }

        createRippleEffect(element, event) {
          const rect = element.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = event.clientX - rect.left - size / 2;
          const y = event.clientY - rect.top - size / 2;

          const ripple = document.createElement('span');
          ripple.style.cssText = \`
            position: absolute;
            width: \${size}px;
            height: \${size}px;
            left: \${x}px;
            top: \${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
          \`;

          // Add ripple animation keyframes if not exists
          if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = \`
              @keyframes ripple-animation {
                to {
                  transform: scale(4);
                  opacity: 0;
                }
              }
            \`;
            document.head.appendChild(style);
          }

          element.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);
        }

        initFormInteractions() {
          const formFields = document.querySelectorAll('input, textarea, select');
          
          formFields.forEach(field => {
            this.addFormFieldEffects(field);
          });
        }

        addFormFieldEffects(field) {
          const container = field.closest('.form-field') || field.parentNode;
          container.classList.add('form-field');

          // Focus effects
          field.addEventListener('focus', () => {
            container.classList.add('focused');
            this.trackInteraction('field_focus', {
              fieldType: field.type,
              fieldName: field.name
            });
          });

          field.addEventListener('blur', () => {
            container.classList.remove('focused');
          });

          // Validation feedback effects
          field.addEventListener('invalid', () => {
            this.addValidationEffect(field, 'error');
          });

          field.addEventListener('input', () => {
            if (field.validity.valid) {
              this.addValidationEffect(field, 'success');
            }
          });
        }

        addValidationEffect(field, type) {
          const container = field.closest('.form-field') || field.parentNode;
          
          // Remove existing validation classes
          container.classList.remove('field-error', 'field-success');
          
          // Add new validation class
          container.classList.add(\`field-\${type}\`);

          // Add shake effect for errors
          if (type === 'error') {
            field.style.animation = 'micro-shake 0.5s ease';
            setTimeout(() => {
              field.style.animation = '';
            }, 500);
          }
        }

        initNavigationInteractions() {
          const navItems = document.querySelectorAll('nav a, .nav-item, [role="menuitem"]');
          
          navItems.forEach(item => {
            this.addNavigationEffects(item);
          });
        }

        addNavigationEffects(item) {
          item.classList.add('nav-item');

          // Hover tracking
          item.addEventListener('mouseenter', () => {
            this.trackInteraction('nav_hover', {
              text: item.textContent?.trim(),
              href: item.href
            });
          });
        }

        initFeedbackInteractions() {
          // Add success/error message animations
          this.observeMessageElements();
          
          // Add loading state animations
          this.observeLoadingElements();
        }

        observeMessageElements() {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
              mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node;
                  
                  if (element.classList.contains('success-message')) {
                    this.animateMessage(element, 'success');
                  } else if (element.classList.contains('error-message')) {
                    this.animateMessage(element, 'error');
                  }
                }
              });
            });
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        }

        animateMessage(element, type) {
          element.style.cssText += \`
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
          \`;

          // Trigger animation
          requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          });

          // Add type-specific styling
          if (type === 'success') {
            element.style.borderLeft = '4px solid #38a169';
          } else if (type === 'error') {
            element.style.borderLeft = '4px solid #e53e3e';
          }
        }

        observeLoadingElements() {
          const loadingElements = document.querySelectorAll('.loading, [data-loading]');
          
          loadingElements.forEach(element => {
            this.addLoadingAnimation(element);
          });
        }

        addLoadingAnimation(element) {
          if (!element.querySelector('.loading-spinner')) {
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.style.cssText = \`
              display: inline-block;
              width: 20px;
              height: 20px;
              border: 2px solid #e2e8f0;
              border-top: 2px solid #4299e1;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-right: 0.5rem;
            \`;

            // Add spin animation if not exists
            if (!document.querySelector('#spin-keyframes')) {
              const style = document.createElement('style');
              style.id = 'spin-keyframes';
              style.textContent = \`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              \`;
              document.head.appendChild(style);
            }

            element.insertBefore(spinner, element.firstChild);
          }
        }

        trackInteraction(eventName, data) {
          // Track micro-interactions for analytics
          console.log('Micro-interaction:', eventName, data);
          
          // Send to analytics if available
          if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
              event_category: 'micro_interactions',
              ...data
            });
          }
        }

        // Public methods for external control
        addHoverEffect(selector, effectType) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            element.classList.add('micro-hover', \`micro-\${effectType}\`);
          });
        }

        removeHoverEffect(selector, effectType) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            element.classList.remove('micro-hover', \`micro-\${effectType}\`);
          });
        }

        triggerEffect(selector, effectType) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            element.classList.add(\`micro-\${effectType}\`);
            setTimeout(() => {
              element.classList.remove(\`micro-\${effectType}\`);
            }, 400);
          });
        }
      }

      // Initialize micro-interactions manager
      document.addEventListener('DOMContentLoaded', () => {
        window.microInteractions = new MicroInteractionsManager();
      });

      // Export for external use
      window.MicroInteractionsManager = MicroInteractionsManager;
    `;
  }

  /**
   * Generate hover/click effect CSS
   */
  generateEffectCSS(interactions: InteractionConfig[]): string {
    let css = `
      /* Interactive Component Effects */
      .interactive-element {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }
    `;

    interactions.forEach(interaction => {
      const selector = interaction.targetSelector;
      const behavior = interaction.behavior;

      // Generate hover effects
      if (behavior.parameters.hoverEffects) {
        behavior.parameters.hoverEffects.forEach((effect: string) => {
          css += this.generateEffectCSS_Single(selector, effect, 'hover');
        });
      }

      // Generate click effects
      if (behavior.parameters.clickEffects) {
        behavior.parameters.clickEffects.forEach((effect: string) => {
          css += this.generateEffectCSS_Single(selector, effect, 'active');
        });
      }
    });

    return css;
  }

  /**
   * Generate CSS for a single effect
   */
  private generateEffectCSS_Single(selector: string, effect: string, state: 'hover' | 'active'): string {
    const effectStyles: Record<string, Record<string, string>> = {
      'scale': {
        'hover': 'transform: scale(1.05);',
        'active': 'transform: scale(0.95);'
      },
      'glow': {
        'hover': 'box-shadow: 0 0 20px rgba(66, 153, 225, 0.4);',
        'active': 'box-shadow: 0 0 30px rgba(66, 153, 225, 0.6);'
      },
      'lift': {
        'hover': 'transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);',
        'active': 'transform: translateY(-2px);'
      },
      'color_change': {
        'hover': 'color: #4299e1;',
        'active': 'color: #2b6cb0;'
      },
      'underline': {
        'hover': 'text-decoration: underline; text-decoration-color: #4299e1;',
        'active': 'text-decoration: underline; text-decoration-color: #2b6cb0;'
      },
      'border_glow': {
        'hover': 'border-color: #4299e1; box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);',
        'active': 'border-color: #2b6cb0;'
      }
    };

    const style = effectStyles[effect]?.[state];
    if (!style) return '';

    return `
      ${selector}:${state} {
        ${style}
      }
    `;
  }
}