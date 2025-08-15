/**
 * Advanced Animation and Visual Effects System
 * 
 * Provides comprehensive animation capabilities including:
 * - Modern CSS animations and micro-interactions
 * - Scroll-based animation triggers and reveal effects
 * - WebGL-based 3D graphics system
 * - Video backgrounds and parallax effects
 * - Immediate visual feedback system
 */

import type { Component } from '../types';
import type {
  AnimationConfig,
  AnimationTrigger,
  InteractionFeedback,
  MediaEnhancement
} from './types';
import type {
  ModernAnimationType,
  ModernAnimationOptions,
  ScrollRevealOptions,
  WebGL3DConfig,
  WebGL3DSystem,
  Scene3D,
  Renderer3D,
  Camera3D,
  Controls3D,
  Object3D,
  Light3D,
  LightingConfig,
  VideoBackgroundConfig,
  VideoBackgroundSystem,
  VideoControls,
  VideoEffects,
  VisualFeedbackConfig,
  VisualFeedbackSystem,
  FeedbackType,
  FeedbackTrigger,
  FeedbackAnimation,
  ParallaxConfig,
  ParallaxElement,
  ParallaxEffect,
  ParallaxSystem,
  ElementBounds,
  AnimationSystem
} from './advanced-animation-types';

/**
 * Advanced Animation System Class
 * 
 * Orchestrates all animation and visual effects for enhanced templates
 */
export class AdvancedAnimationSystem {
  private animationId = 0;
  private webglContext: WebGLRenderingContext | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private parallaxElements: Map<string, ParallaxElement> = new Map();
  private activeAnimations: Map<string, Animation> = new Map();

  constructor() {
    this.initializeSystem();
  }

  /**
   * Initialize the animation system
   */
  private initializeSystem(): void {
    if (typeof window !== 'undefined') {
      this.setupIntersectionObserver();
      this.setupParallaxSystem();
      this.setupPerformanceMonitoring();
    }
  }

  /**
   * Create modern CSS animation with micro-interactions
   */
  async createModernAnimation(
    element: Component,
    animationType: ModernAnimationType,
    options?: ModernAnimationOptions
  ): Promise<AnimationConfig> {
    const animationConfig: AnimationConfig = {
      id: `modern-animation-${++this.animationId}`,
      type: 'hover',
      name: `Modern ${animationType} Animation`,
      description: `Advanced ${animationType} animation with micro-interactions`,
      targetSelector: this.generateSelector(element),
      animationType: animationType as any,
      duration: options?.duration || this.getOptimalDuration(animationType),
      delay: options?.delay || 0,
      easing: options?.easing || this.getModernEasing(animationType),
      trigger: {
        event: options?.trigger || 'hover',
        threshold: options?.threshold || 0.1,
        once: options?.once || false
      },
      responsive: true
    };

    return animationConfig;
  }

  /**
   * Create scroll-based animation with reveal effects
   */
  async createScrollRevealAnimation(
    elements: Component[],
    options?: ScrollRevealOptions
  ): Promise<AnimationConfig[]> {
    const animations: AnimationConfig[] = [];
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const animation: AnimationConfig = {
        id: `scroll-reveal-${++this.animationId}`,
        type: 'scroll',
        name: `Scroll Reveal Animation`,
        description: `Scroll-triggered reveal effect for ${element.type}`,
        targetSelector: this.generateSelector(element),
        animationType: options?.animationType || this.getScrollAnimationType(element),
        duration: options?.duration || 800,
        delay: options?.stagger ? i * (options.staggerDelay || 100) : 0,
        easing: options?.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        trigger: {
          event: 'scroll',
          threshold: options?.threshold || 0.15,
          offset: options?.offset || 0,
          once: options?.once !== false
        },
        responsive: true
      };
      
      animations.push(animation);
    }

    return animations;
  }

  /**
   * Create WebGL-based 3D graphics system
   */
  async create3DGraphicsSystem(
    container: HTMLElement,
    config: WebGL3DConfig
  ): Promise<WebGL3DSystem> {
    const canvas = document.createElement('canvas');
    canvas.width = config.width || container.clientWidth;
    canvas.height = config.height || container.clientHeight;
    
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      throw new Error('WebGL not supported');
    }

    this.webglContext = gl as WebGLRenderingContext;
    
    const system: WebGL3DSystem = {
      canvas,
      gl: this.webglContext,
      scene: this.createScene(config),
      renderer: this.createRenderer(this.webglContext, config),
      camera: this.createCamera(config),
      controls: this.create3DControls(config),
      objects: [],
      animations: []
    };

    container.appendChild(canvas);
    this.start3DRenderLoop(system);

    return system;
  }

  /**
   * Create video background with parallax effects
   */
  async createVideoBackground(
    element: Component,
    videoConfig: VideoBackgroundConfig
  ): Promise<VideoBackgroundSystem> {
    const videoElement = document.createElement('video');
    videoElement.src = videoConfig.src;
    videoElement.autoplay = videoConfig.autoplay !== false;
    videoElement.loop = videoConfig.loop !== false;
    videoElement.muted = videoConfig.muted !== false;
    videoElement.playsInline = true;

    const system: VideoBackgroundSystem = {
      video: videoElement,
      overlay: this.createVideoOverlay(videoConfig),
      parallax: videoConfig.parallax ? this.createParallaxEffect(element, videoConfig.parallax) : null,
      controls: this.createVideoControls(videoConfig),
      effects: this.createVideoEffects(videoConfig)
    };

    return system;
  }

  /**
   * Create immediate visual feedback system
   */
  async createVisualFeedbackSystem(
    element: Component,
    feedbackConfig: VisualFeedbackConfig
  ): Promise<VisualFeedbackSystem> {
    const system: VisualFeedbackSystem = {
      element: this.getElementBySelector(this.generateSelector(element)),
      feedbackTypes: this.createFeedbackTypes(feedbackConfig),
      triggers: this.createFeedbackTriggers(feedbackConfig),
      animations: this.createFeedbackAnimations(feedbackConfig),
      cleanup: () => this.cleanupFeedbackSystem(element)
    };

    this.attachFeedbackListeners(system);
    return system;
  }

  /**
   * Create parallax effect system
   */
  async createParallaxSystem(
    elements: Component[],
    config?: ParallaxConfig
  ): Promise<ParallaxSystem> {
    const parallaxElements: ParallaxElement[] = elements.map((element, index) => ({
      element: this.getElementBySelector(this.generateSelector(element)),
      speed: config?.speeds?.[index] || this.calculateParallaxSpeed(element),
      direction: config?.direction || 'vertical',
      offset: 0,
      bounds: this.calculateElementBounds(element)
    }));

    const system: ParallaxSystem = {
      elements: parallaxElements,
      config: config || this.getDefaultParallaxConfig(),
      isActive: true,
      performance: {
        fps: 60,
        lastFrame: 0,
        frameCount: 0
      }
    };

    this.startParallaxLoop(system);
    return system;
  }

  /**
   * Generate comprehensive CSS for all animations
   */
  generateAdvancedCSS(animations: AnimationConfig[]): string {
    const css = [
      this.generateModernAnimationCSS(),
      this.generateMicroInteractionCSS(),
      this.generateScrollRevealCSS(),
      this.generateParallaxCSS(),
      this.generateFeedbackCSS(),
      ...animations.map(animation => this.generateAnimationCSS(animation))
    ].join('\n\n');

    return css;
  }

  /**
   * Generate JavaScript for animation control
   */
  generateAdvancedJS(systems: AnimationSystem[]): string {
    return `
      // Advanced Animation System Controller
      class AdvancedAnimationController {
        constructor() {
          this.systems = new Map();
          this.observers = new Map();
          this.performance = { fps: 60, budget: 16.67 };
          this.init();
        }

        init() {
          this.setupIntersectionObserver();
          this.setupPerformanceMonitoring();
          this.setupScrollHandler();
          this.setupResizeHandler();
        }

        ${this.generateScrollObserverJS()}
        ${this.generateParallaxJS()}
        ${this.generateFeedbackJS()}
        ${this.generatePerformanceJS()}
      }

      // Initialize on DOM ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          window.advancedAnimationController = new AdvancedAnimationController();
        });
      } else {
        window.advancedAnimationController = new AdvancedAnimationController();
      }
    `;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Generate CSS selector for component
   */
  private generateSelector(element: Component): string {
    if (element.id) {
      return `#${element.id}`;
    }
    return `[data-component="${element.type}"]`;
  }

  /**
   * Get optimal duration for animation type
   */
  private getOptimalDuration(animationType: ModernAnimationType): number {
    const durations: Record<string, number> = {
      'morphing': 800,
      'elastic': 600,
      'magnetic': 400,
      'liquid': 1000,
      'particle': 1200,
      'glitch': 300,
      'neon': 500,
      'glass': 400,
      'gradient-shift': 2000,
      'text-reveal': 800,
      'image-distortion': 600,
      'floating': 3000,
      'breathing': 2000,
      'pulse-glow': 1500
    };
    return durations[animationType] || 600;
  }

  /**
   * Get modern easing function
   */
  private getModernEasing(animationType: ModernAnimationType): string {
    const easings: Record<string, string> = {
      'morphing': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      'elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      'magnetic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      'liquid': 'cubic-bezier(0.23, 1, 0.32, 1)',
      'particle': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
      'glitch': 'steps(10, end)',
      'neon': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'glass': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      'gradient-shift': 'linear',
      'text-reveal': 'cubic-bezier(0.77, 0, 0.175, 1)',
      'image-distortion': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
      'floating': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
      'breathing': 'cubic-bezier(0.4, 0, 0.6, 1)',
      'pulse-glow': 'cubic-bezier(0.4, 0, 0.2, 1)'
    };
    return easings[animationType] || 'cubic-bezier(0.4, 0, 0.2, 1)';
  }

  /**
   * Get scroll animation type based on element
   */
  private getScrollAnimationType(element: Component): 'fade' | 'slide' | 'scale' | 'rotate' | 'flip' | 'blur' {
    const typeMap: Record<string, any> = {
      'hero': 'fade',
      'heading': 'slide',
      'text': 'fade',
      'image': 'scale',
      'button': 'scale',
      'card': 'slide',
      'testimonial': 'fade',
      'feature': 'slide',
      'pricing': 'scale'
    };
    return typeMap[element.type] || 'fade';
  }

  /**
   * Setup intersection observer for scroll animations
   */
  private setupIntersectionObserver(): void {
    const options = {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      rootMargin: '0px 0px -50px 0px'
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          if (entry.target.getAttribute('data-animate-once') === 'true') {
            this.intersectionObserver?.unobserve(entry.target);
          }
        } else {
          if (entry.target.getAttribute('data-animate-once') !== 'true') {
            entry.target.classList.remove('animate-in');
          }
        }
      });
    }, options);
  }

  /**
   * Setup parallax system
   */
  private setupParallaxSystem(): void {
    let ticking = false;
    
    const updateParallax = () => {
      this.parallaxElements.forEach((parallaxElement) => {
        if (parallaxElement.element) {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -parallaxElement.speed;
          parallaxElement.element.style.transform = `translateY(${rate}px)`;
        }
      });
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();

    const monitor = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Degrade quality if performance is poor
        if (fps < 30) {
          this.degradeAnimationQuality();
        } else if (fps > 55) {
          this.improveAnimationQuality();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitor);
    };

    requestAnimationFrame(monitor);
  }

  /**
   * Create WebGL scene
   */
  private createScene(config: WebGL3DConfig): Scene3D {
    return {
      background: config.scene?.background || '#000000',
      fog: config.scene?.fog,
      lights: this.createLights(config.scene?.lighting),
      objects: []
    };
  }

  /**
   * Create WebGL renderer
   */
  private createRenderer(gl: WebGLRenderingContext, config: WebGL3DConfig): Renderer3D {
    return {
      render: (scene: Scene3D, camera: Camera3D) => {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Render scene objects
        scene.objects.forEach(obj => this.renderObject(gl, obj, camera));
      },
      setSize: (width: number, height: number) => {
        gl.viewport(0, 0, width, height);
      },
      setClearColor: (color: string, alpha: number) => {
        const rgb = this.hexToRgb(color);
        gl.clearColor(rgb.r / 255, rgb.g / 255, rgb.b / 255, alpha);
      }
    };
  }

  /**
   * Create WebGL camera
   */
  private createCamera(config: WebGL3DConfig): Camera3D {
    return {
      type: config.camera?.type || 'perspective',
      position: config.camera?.position || [0, 0, 5],
      rotation: [0, 0, 0],
      fov: config.camera?.fov || 75,
      aspect: config.camera?.aspect || 1,
      near: config.camera?.near || 0.1,
      far: config.camera?.far || 1000,
      updateProjectionMatrix: () => {
        // Update projection matrix
      }
    };
  }

  /**
   * Create 3D controls
   */
  private create3DControls(config: WebGL3DConfig): Controls3D {
    return {
      enabled: config.controls?.enabled || false,
      autoRotate: config.controls?.autoRotate || false,
      enableZoom: config.controls?.enableZoom || true,
      enablePan: config.controls?.enablePan || true,
      update: () => {
        // Update controls
      }
    };
  }

  /**
   * Start 3D render loop
   */
  private start3DRenderLoop(system: WebGL3DSystem): void {
    const render = () => {
      system.renderer.render(system.scene, system.camera);
      system.controls.update();
      requestAnimationFrame(render);
    };
    render();
  }

  /**
   * Create video overlay
   */
  private createVideoOverlay(config: VideoBackgroundConfig): HTMLElement | null {
    if (!config.overlay) return null;
    
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    
    if (config.overlay.color) {
      overlay.style.backgroundColor = config.overlay.color;
      overlay.style.opacity = (config.overlay.opacity || 0.5).toString();
    }
    
    if (config.overlay.gradient) {
      overlay.style.background = config.overlay.gradient;
    }
    
    return overlay;
  }

  /**
   * Create parallax effect
   */
  private createParallaxEffect(element: Component, config: any): ParallaxEffect {
    return {
      speed: config.speed || 0.5,
      direction: config.direction || 'vertical',
      offset: 0,
      bounds: this.calculateElementBounds(element)
    };
  }

  /**
   * Create video controls
   */
  private createVideoControls(config: VideoBackgroundConfig): VideoControls {
    return {
      play: () => {},
      pause: () => {},
      mute: () => {},
      unmute: () => {},
      setVolume: (volume: number) => {},
      seek: (time: number) => {}
    };
  }

  /**
   * Create video effects
   */
  private createVideoEffects(config: VideoBackgroundConfig): VideoEffects {
    return {
      applyFilter: (filter: string) => {},
      removeFilter: () => {},
      setOpacity: (opacity: number) => {},
      setBlur: (blur: number) => {}
    };
  }

  /**
   * Get element by selector
   */
  private getElementBySelector(selector: string): HTMLElement | null {
    if (typeof document !== 'undefined') {
      return document.querySelector(selector);
    }
    return null;
  }

  /**
   * Create feedback types
   */
  private createFeedbackTypes(config: VisualFeedbackConfig): FeedbackType[] {
    const types: FeedbackType[] = [];
    
    if (config.hover) {
      types.push({
        name: 'hover',
        trigger: 'mouseenter',
        animation: 'hover-effect',
        duration: 200,
        easing: 'ease-out'
      });
    }
    
    if (config.click) {
      types.push({
        name: 'click',
        trigger: 'click',
        animation: 'click-effect',
        duration: 150,
        easing: 'ease-in-out'
      });
    }
    
    return types;
  }

  /**
   * Create feedback triggers
   */
  private createFeedbackTriggers(config: VisualFeedbackConfig): FeedbackTrigger[] {
    return [
      { event: 'mouseenter', debounce: 50 },
      { event: 'mouseleave', debounce: 50 },
      { event: 'click', throttle: 100 },
      { event: 'focus', debounce: 100 },
      { event: 'blur', debounce: 100 }
    ];
  } 
 /**
   * Create feedback animations
   */
  private createFeedbackAnimations(config: VisualFeedbackConfig): FeedbackAnimation[] {
    const animations: FeedbackAnimation[] = [];
    
    if (config.hover) {
      animations.push({
        name: 'hover-effect',
        keyframes: this.generateHoverKeyframes(config.hover),
        duration: 200,
        easing: 'ease-out',
        fillMode: 'forwards'
      });
    }
    
    if (config.click) {
      animations.push({
        name: 'click-effect',
        keyframes: this.generateClickKeyframes(config.click),
        duration: 150,
        easing: 'ease-in-out',
        fillMode: 'forwards'
      });
    }
    
    if (config.focus) {
      animations.push({
        name: 'focus-effect',
        keyframes: this.generateFocusKeyframes(config.focus),
        duration: 200,
        easing: 'ease-out',
        fillMode: 'forwards'
      });
    }
    
    return animations;
  }

  /**
   * Generate hover keyframes
   */
  private generateHoverKeyframes(hoverConfig: any): string {
    const scale = hoverConfig.scale || 1.05;
    const glow = hoverConfig.glow ? 'box-shadow: 0 0 20px rgba(0, 123, 255, 0.5);' : '';
    const colorShift = hoverConfig.colorShift ? `filter: hue-rotate(${hoverConfig.colorShift});` : '';
    const shadow = hoverConfig.shadow ? 'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);' : '';
    
    return `
      @keyframes hover-effect {
        0% { transform: scale(1); ${glow} ${colorShift} ${shadow} }
        100% { transform: scale(${scale}); ${glow} ${colorShift} ${shadow} }
      }
    `;
  }

  /**
   * Generate click keyframes
   */
  private generateClickKeyframes(clickConfig: any): string {
    let keyframes = '@keyframes click-effect { 0% { transform: scale(1); }';
    
    if (clickConfig.bounce) {
      keyframes += ' 50% { transform: scale(0.95); } 100% { transform: scale(1.02); }';
    } else if (clickConfig.ripple) {
      keyframes += ' 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; }';
    } else {
      keyframes += ' 50% { transform: scale(0.98); } 100% { transform: scale(1); }';
    }
    
    keyframes += ' }';
    return keyframes;
  }

  /**
   * Generate focus keyframes
   */
  private generateFocusKeyframes(focusConfig: any): string {
    const scale = focusConfig.scale || 1.02;
    const glow = focusConfig.glow ? 'box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);' : '';
    const outline = focusConfig.outline ? 'outline: 2px solid #007bff; outline-offset: 2px;' : '';
    
    return `
      @keyframes focus-effect {
        0% { transform: scale(1); ${glow} ${outline} }
        100% { transform: scale(${scale}); ${glow} ${outline} }
      }
    `;
  }

  /**
   * Attach feedback listeners
   */
  private attachFeedbackListeners(system: VisualFeedbackSystem): void {
    if (!system.element) return;
    
    system.triggers.forEach(trigger => {
      const handler = this.createFeedbackHandler(system, trigger);
      
      if (trigger.debounce) {
        const debouncedHandler = this.debounce(handler, trigger.debounce);
        system.element!.addEventListener(trigger.event, debouncedHandler);
      } else if (trigger.throttle) {
        const throttledHandler = this.throttle(handler, trigger.throttle);
        system.element!.addEventListener(trigger.event, throttledHandler);
      } else {
        system.element!.addEventListener(trigger.event, handler);
      }
    });
  }

  /**
   * Create feedback handler
   */
  private createFeedbackHandler(system: VisualFeedbackSystem, trigger: FeedbackTrigger): (event: Event) => void {
    return (event: Event) => {
      const feedbackType = system.feedbackTypes.find(type => type.trigger === trigger.event);
      if (!feedbackType || !system.element) return;
      
      const animation = system.animations.find(anim => anim.name === feedbackType.animation);
      if (!animation) return;
      
      // Apply animation
      system.element.style.animation = `${animation.name} ${animation.duration}ms ${animation.easing} ${animation.fillMode}`;
      
      // Clean up after animation
      setTimeout(() => {
        if (system.element) {
          system.element.style.animation = '';
        }
      }, animation.duration);
    };
  }

  /**
   * Cleanup feedback system
   */
  private cleanupFeedbackSystem(element: Component): void {
    const htmlElement = this.getElementBySelector(this.generateSelector(element));
    if (htmlElement) {
      htmlElement.style.animation = '';
      // Remove event listeners would require storing references
    }
  }

  /**
   * Calculate parallax speed based on element
   */
  private calculateParallaxSpeed(element: Component): number {
    const speedMap: Record<string, number> = {
      'hero': 0.5,
      'background': 0.3,
      'image': 0.7,
      'text': 0.9,
      'button': 1.0
    };
    return speedMap[element.type] || 0.5;
  }

  /**
   * Calculate element bounds
   */
  private calculateElementBounds(element: Component): ElementBounds {
    const htmlElement = this.getElementBySelector(this.generateSelector(element));
    if (!htmlElement) {
      return { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 };
    }
    
    const rect = htmlElement.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right
    };
  }

  /**
   * Get default parallax config
   */
  private getDefaultParallaxConfig(): ParallaxConfig {
    return {
      direction: 'vertical',
      threshold: 0.1,
      smooth: true,
      performance: {
        throttle: 16,
        useRAF: true,
        maxFPS: 60
      }
    };
  }

  /**
   * Start parallax loop
   */
  private startParallaxLoop(system: ParallaxSystem): void {
    let lastTime = 0;
    const targetFPS = system.config.performance?.maxFPS || 60;
    const frameTime = 1000 / targetFPS;
    
    const loop = (currentTime: number) => {
      if (currentTime - lastTime >= frameTime) {
        this.updateParallaxElements(system);
        lastTime = currentTime;
        system.performance.frameCount++;
      }
      
      if (system.isActive) {
        requestAnimationFrame(loop);
      }
    };
    
    requestAnimationFrame(loop);
  }

  /**
   * Update parallax elements
   */
  private updateParallaxElements(system: ParallaxSystem): void {
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;
    
    system.elements.forEach(parallaxElement => {
      if (!parallaxElement.element) return;
      
      let transform = '';
      
      if (system.config.direction === 'vertical' || system.config.direction === 'both') {
        const yOffset = scrollY * parallaxElement.speed;
        transform += `translateY(${yOffset}px) `;
      }
      
      if (system.config.direction === 'horizontal' || system.config.direction === 'both') {
        const xOffset = scrollX * parallaxElement.speed;
        transform += `translateX(${xOffset}px) `;
      }
      
      parallaxElement.element.style.transform = transform.trim();
    });
  }

  /**
   * Generate modern animation CSS
   */
  private generateModernAnimationCSS(): string {
    return `
      /* Modern Animation Base Styles */
      .modern-animation {
        will-change: transform, opacity;
        backface-visibility: hidden;
        perspective: 1000px;
      }

      /* Morphing Animation */
      @keyframes morphing {
        0% { border-radius: 0; transform: scale(1); }
        50% { border-radius: 50%; transform: scale(1.1); }
        100% { border-radius: 0; transform: scale(1); }
      }

      /* Elastic Animation */
      @keyframes elastic {
        0% { transform: scale(1); }
        30% { transform: scale(1.25); }
        40% { transform: scale(0.75); }
        60% { transform: scale(1.15); }
        80% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }

      /* Magnetic Animation */
      @keyframes magnetic {
        0% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0); }
      }

      /* Liquid Animation */
      @keyframes liquid {
        0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
        50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
        75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
      }

      /* Particle Animation */
      @keyframes particle {
        0% { opacity: 0; transform: scale(0) rotate(0deg); }
        50% { opacity: 1; transform: scale(1) rotate(180deg); }
        100% { opacity: 0; transform: scale(0) rotate(360deg); }
      }

      /* Glitch Animation */
      @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
      }

      /* Neon Glow Animation */
      @keyframes neon {
        0%, 100% { 
          text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
        }
        50% { 
          text-shadow: 0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor;
        }
      }

      /* Glass Morphism Animation */
      @keyframes glass {
        0% { 
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
        }
        50% { 
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.2);
        }
        100% { 
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
        }
      }

      /* Gradient Shift Animation */
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      /* Text Reveal Animation */
      @keyframes text-reveal {
        0% { 
          clip-path: polygon(0 0, 0 0, 0 100%, 0% 100%);
        }
        100% { 
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
      }

      /* Floating Animation */
      @keyframes floating {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }

      /* Breathing Animation */
      @keyframes breathing {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      /* Pulse Glow Animation */
      @keyframes pulse-glow {
        0%, 100% { 
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }
        50% { 
          box-shadow: 0 0 20px rgba(0, 123, 255, 0.8), 0 0 30px rgba(0, 123, 255, 0.6);
        }
      }
    `;
  }

  /**
   * Generate micro-interaction CSS
   */
  private generateMicroInteractionCSS(): string {
    return `
      /* Micro-Interaction Base Styles */
      .micro-interaction {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }

      .micro-interaction:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .micro-interaction:active {
        transform: translateY(0);
        transition-duration: 0.1s;
      }

      /* Button Micro-Interactions */
      .btn-micro {
        position: relative;
        overflow: hidden;
      }

      .btn-micro::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }

      .btn-micro:hover::before {
        width: 300px;
        height: 300px;
      }

      /* Card Micro-Interactions */
      .card-micro {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .card-micro:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }

      /* Input Micro-Interactions */
      .input-micro {
        position: relative;
        border: 2px solid transparent;
        transition: all 0.3s ease;
      }

      .input-micro:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        transform: scale(1.02);
      }

      /* Link Micro-Interactions */
      .link-micro {
        position: relative;
        text-decoration: none;
      }

      .link-micro::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: currentColor;
        transition: width 0.3s ease;
      }

      .link-micro:hover::after {
        width: 100%;
      }
    `;
  }

  /**
   * Generate scroll reveal CSS
   */
  private generateScrollRevealCSS(): string {
    return `
      /* Scroll Reveal Base Styles */
      .scroll-reveal {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      .scroll-reveal.animate-in {
        opacity: 1;
        transform: translateY(0);
      }

      /* Fade Animations */
      .fade-up {
        opacity: 0;
        transform: translateY(30px);
      }

      .fade-up.animate-in {
        opacity: 1;
        transform: translateY(0);
      }

      .fade-down {
        opacity: 0;
        transform: translateY(-30px);
      }

      .fade-down.animate-in {
        opacity: 1;
        transform: translateY(0);
      }

      .fade-left {
        opacity: 0;
        transform: translateX(-30px);
      }

      .fade-left.animate-in {
        opacity: 1;
        transform: translateX(0);
      }

      .fade-right {
        opacity: 0;
        transform: translateX(30px);
      }

      .fade-right.animate-in {
        opacity: 1;
        transform: translateX(0);
      }

      /* Scale Animations */
      .scale-up {
        opacity: 0;
        transform: scale(0.8);
      }

      .scale-up.animate-in {
        opacity: 1;
        transform: scale(1);
      }

      .scale-down {
        opacity: 0;
        transform: scale(1.2);
      }

      .scale-down.animate-in {
        opacity: 1;
        transform: scale(1);
      }

      /* Rotate Animations */
      .rotate-in {
        opacity: 0;
        transform: rotate(-10deg);
      }

      .rotate-in.animate-in {
        opacity: 1;
        transform: rotate(0deg);
      }

      /* Flip Animations */
      .flip-up {
        opacity: 0;
        transform: perspective(400px) rotateX(90deg);
      }

      .flip-up.animate-in {
        opacity: 1;
        transform: perspective(400px) rotateX(0deg);
      }

      /* Blur Animations */
      .blur-in {
        opacity: 0;
        filter: blur(5px);
      }

      .blur-in.animate-in {
        opacity: 1;
        filter: blur(0px);
      }
    `;
  }

  /**
   * Generate parallax CSS
   */
  private generateParallaxCSS(): string {
    return `
      /* Parallax Base Styles */
      .parallax-container {
        overflow-x: hidden;
        overflow-y: auto;
        perspective: 1px;
        height: 100vh;
      }

      .parallax-element {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        will-change: transform;
      }

      .parallax-back {
        transform: translateZ(-1px) scale(2);
      }

      .parallax-base {
        transform: translateZ(0);
      }

      .parallax-front {
        transform: translateZ(1px);
      }

      /* Parallax Performance Optimizations */
      .parallax-optimized {
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
    `;
  }

  /**
   * Generate feedback CSS
   */
  private generateFeedbackCSS(): string {
    return `
      /* Visual Feedback Base Styles */
      .feedback-element {
        transition: all 0.2s ease;
        position: relative;
      }

      /* Hover Feedback */
      .hover-feedback:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      /* Click Feedback */
      .click-feedback:active {
        transform: scale(0.95);
        transition-duration: 0.1s;
      }

      /* Focus Feedback */
      .focus-feedback:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        transform: scale(1.02);
      }

      /* Success Feedback */
      .success-feedback {
        background-color: #28a745;
        color: white;
        animation: success-pulse 0.6s ease;
      }

      @keyframes success-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      /* Error Feedback */
      .error-feedback {
        background-color: #dc3545;
        color: white;
        animation: error-shake 0.6s ease;
      }

      @keyframes error-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      /* Loading Feedback */
      .loading-feedback {
        position: relative;
        pointer-events: none;
      }

      .loading-feedback::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #007bff;
        border-radius: 50%;
        animation: loading-spin 1s linear infinite;
      }

      @keyframes loading-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
  }

  /**
   * Generate animation CSS for specific config
   */
  private generateAnimationCSS(animation: AnimationConfig): string {
    const selector = animation.targetSelector;
    const animationType = animation.animationType;
    const duration = animation.duration;
    const delay = animation.delay || 0;
    const easing = animation.easing;

    return `
      ${selector} {
        animation: ${animationType} ${duration}ms ${easing} ${delay}ms;
        animation-fill-mode: both;
      }
    `;
  }

  /**
   * Generate scroll observer JavaScript
   */
  private generateScrollObserverJS(): string {
    return `
      setupScrollObserver() {
        const options = {
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
          rootMargin: '0px 0px -50px 0px'
        };

        this.observers.set('scroll', new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
              if (entry.target.getAttribute('data-animate-once') === 'true') {
                this.observers.get('scroll')?.unobserve(entry.target);
              }
            } else {
              if (entry.target.getAttribute('data-animate-once') !== 'true') {
                entry.target.classList.remove('animate-in');
              }
            }
          });
        }, options));

        // Observe all scroll reveal elements
        document.querySelectorAll('.scroll-reveal').forEach(el => {
          this.observers.get('scroll')?.observe(el);
        });
      }
    `;
  }

  /**
   * Generate parallax JavaScript
   */
  private generateParallaxJS(): string {
    return `
      setupParallax() {
        let ticking = false;
        
        const updateParallax = () => {
          const scrolled = window.pageYOffset;
          
          document.querySelectorAll('.parallax-element').forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed') || '0.5');
            const yPos = -(scrolled * speed);
            element.style.transform = \`translateY(\${yPos}px)\`;
          });
          
          ticking = false;
        };

        const requestTick = () => {
          if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
          }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
      }
    `;
  }

  /**
   * Generate feedback JavaScript
   */
  private generateFeedbackJS(): string {
    return `
      setupFeedback() {
        document.querySelectorAll('.feedback-element').forEach(element => {
          // Hover feedback
          element.addEventListener('mouseenter', () => {
            element.classList.add('hover-feedback');
          });
          
          element.addEventListener('mouseleave', () => {
            element.classList.remove('hover-feedback');
          });
          
          // Click feedback
          element.addEventListener('mousedown', () => {
            element.classList.add('click-feedback');
          });
          
          element.addEventListener('mouseup', () => {
            element.classList.remove('click-feedback');
          });
          
          // Focus feedback
          element.addEventListener('focus', () => {
            element.classList.add('focus-feedback');
          });
          
          element.addEventListener('blur', () => {
            element.classList.remove('focus-feedback');
          });
        });
      }
    `;
  }

  /**
   * Generate performance JavaScript
   */
  private generatePerformanceJS(): string {
    return `
      setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();

        const monitor = () => {
          frameCount++;
          const currentTime = performance.now();
          
          if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            this.performance.fps = fps;
            
            // Degrade quality if performance is poor
            if (fps < 30) {
              this.degradeAnimationQuality();
            } else if (fps > 55) {
              this.improveAnimationQuality();
            }
            
            frameCount = 0;
            lastTime = currentTime;
          }
          
          requestAnimationFrame(monitor);
        };

        requestAnimationFrame(monitor);
      }

      degradeAnimationQuality() {
        document.documentElement.style.setProperty('--animation-duration-multiplier', '0.5');
        document.querySelectorAll('.complex-animation').forEach(el => {
          el.classList.add('reduced-motion');
        });
      }

      improveAnimationQuality() {
        document.documentElement.style.setProperty('--animation-duration-multiplier', '1');
        document.querySelectorAll('.complex-animation').forEach(el => {
          el.classList.remove('reduced-motion');
        });
      }
    `;
  }

  /**
   * Degrade animation quality for performance
   */
  private degradeAnimationQuality(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--animation-duration-multiplier', '0.5');
      document.querySelectorAll('.complex-animation').forEach(el => {
        el.classList.add('reduced-motion');
      });
    }
  }

  /**
   * Improve animation quality when performance allows
   */
  private improveAnimationQuality(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--animation-duration-multiplier', '1');
      document.querySelectorAll('.complex-animation').forEach(el => {
        el.classList.remove('reduced-motion');
      });
    }
  }

  /**
   * Create lights for 3D scene
   */
  private createLights(lightingConfig?: LightingConfig): Light3D[] {
    const lights: Light3D[] = [];
    
    if (lightingConfig?.ambient) {
      lights.push({
        type: 'ambient',
        color: lightingConfig.ambient.color,
        intensity: lightingConfig.ambient.intensity
      });
    }
    
    if (lightingConfig?.directional) {
      lights.push({
        type: 'directional',
        color: lightingConfig.directional.color,
        intensity: lightingConfig.directional.intensity,
        position: lightingConfig.directional.position
      });
    }
    
    if (lightingConfig?.point) {
      lightingConfig.point.forEach(pointLight => {
        lights.push({
          type: 'point',
          color: pointLight.color,
          intensity: pointLight.intensity,
          position: pointLight.position
        });
      });
    }
    
    return lights;
  }

  /**
   * Render 3D object
   */
  private renderObject(gl: WebGLRenderingContext, object: Object3D, camera: Camera3D): void {
    // Basic WebGL rendering implementation
    // This would be expanded with proper shader programs and rendering pipeline
    gl.useProgram(null); // Placeholder - would use actual shader program
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  /**
   * Debounce function
   */
  private debounce(func: Function, wait: number): (...args: any[]) => void {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Throttle function
   */
  private throttle(func: Function, limit: number): (...args: any[]) => void {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Export the advanced animation system
export default AdvancedAnimationSystem;