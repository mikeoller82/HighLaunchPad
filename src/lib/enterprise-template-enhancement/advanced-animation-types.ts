/**
 * Advanced Animation System Types
 * 
 * Type definitions for the advanced animation and visual effects system
 */

/**
 * Modern Animation Types
 */
export type ModernAnimationType = 
  | 'morphing'
  | 'elastic'
  | 'magnetic'
  | 'liquid'
  | 'particle'
  | 'glitch'
  | 'neon'
  | 'glass'
  | 'gradient-shift'
  | 'text-reveal'
  | 'image-distortion'
  | 'floating'
  | 'breathing'
  | 'pulse-glow';

/**
 * Modern Animation Options
 */
export interface ModernAnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  trigger?: 'hover' | 'click' | 'scroll' | 'load';
  threshold?: number;
  once?: boolean;
  intensity?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'center';
}

/**
 * Scroll Reveal Options
 */
export interface ScrollRevealOptions {
  animationType?: 'fade' | 'slide' | 'scale' | 'rotate' | 'flip' | 'blur';
  duration?: number;
  delay?: number;
  stagger?: boolean;
  staggerDelay?: number;
  easing?: string;
  threshold?: number;
  offset?: number;
  once?: boolean;
  distance?: string;
  origin?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * WebGL 3D Configuration
 */
export interface WebGL3DConfig {
  width?: number;
  height?: number;
  antialias?: boolean;
  alpha?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
  scene?: {
    background?: string;
    fog?: { color: string; near: number; far: number };
    lighting?: LightingConfig;
  };
  camera?: {
    type: 'perspective' | 'orthographic';
    fov?: number;
    aspect?: number;
    near?: number;
    far?: number;
    position?: [number, number, number];
  };
  controls?: {
    enabled: boolean;
    autoRotate?: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
    minDistance?: number;
    maxDistance?: number;
  };
}

/**
 * Lighting Configuration
 */
export interface LightingConfig {
  ambient?: {
    color: string;
    intensity: number;
  };
  directional?: {
    color: string;
    intensity: number;
    position: [number, number, number];
  };
  point?: Array<{
    color: string;
    intensity: number;
    position: [number, number, number];
    distance?: number;
  }>;
}/**

 * WebGL 3D System
 */
export interface WebGL3DSystem {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  scene: Scene3D;
  renderer: Renderer3D;
  camera: Camera3D;
  controls: Controls3D;
  objects: Object3D[];
  animations: Animation3D[];
}

/**
 * 3D Scene
 */
export interface Scene3D {
  background: string;
  fog?: { color: string; near: number; far: number };
  lights: Light3D[];
  objects: Object3D[];
}

/**
 * 3D Renderer
 */
export interface Renderer3D {
  render: (scene: Scene3D, camera: Camera3D) => void;
  setSize: (width: number, height: number) => void;
  setClearColor: (color: string, alpha: number) => void;
}

/**
 * 3D Camera
 */
export interface Camera3D {
  type: 'perspective' | 'orthographic';
  position: [number, number, number];
  rotation: [number, number, number];
  fov?: number;
  aspect?: number;
  near: number;
  far: number;
  updateProjectionMatrix: () => void;
}

/**
 * 3D Controls
 */
export interface Controls3D {
  enabled: boolean;
  autoRotate: boolean;
  enableZoom: boolean;
  enablePan: boolean;
  update: () => void;
}

/**
 * 3D Object
 */
export interface Object3D {
  id: string;
  geometry: Geometry3D;
  material: Material3D;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  visible: boolean;
}

/**
 * 3D Geometry
 */
export interface Geometry3D {
  type: 'box' | 'sphere' | 'plane' | 'cylinder' | 'custom';
  vertices: Float32Array;
  indices?: Uint16Array;
  normals?: Float32Array;
  uvs?: Float32Array;
}

/**
 * 3D Material
 */
export interface Material3D {
  type: 'basic' | 'phong' | 'pbr' | 'shader';
  color: string;
  opacity?: number;
  transparent?: boolean;
  texture?: Texture3D;
  normalMap?: Texture3D;
  roughness?: number;
  metalness?: number;
}

/**
 * 3D Texture
 */
export interface Texture3D {
  image: HTMLImageElement | HTMLCanvasElement;
  wrapS: number;
  wrapT: number;
  magFilter: number;
  minFilter: number;
}

/**
 * 3D Light
 */
export interface Light3D {
  type: 'ambient' | 'directional' | 'point' | 'spot';
  color: string;
  intensity: number;
  position?: [number, number, number];
  direction?: [number, number, number];
}

/**
 * 3D Animation
 */
export interface Animation3D {
  id: string;
  target: Object3D;
  property: 'position' | 'rotation' | 'scale';
  from: [number, number, number];
  to: [number, number, number];
  duration: number;
  easing: string;
  loop: boolean;
  autoStart: boolean;
}/**

 * Video Background Configuration
 */
export interface VideoBackgroundConfig {
  src: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  overlay?: {
    color?: string;
    opacity?: number;
    gradient?: string;
  };
  parallax?: {
    speed: number;
    direction: 'vertical' | 'horizontal';
  };
  effects?: {
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturate?: number;
    sepia?: number;
  };
  responsive?: {
    mobile?: string;
    tablet?: string;
  };
}

/**
 * Video Background System
 */
export interface VideoBackgroundSystem {
  video: HTMLVideoElement;
  overlay: HTMLElement | null;
  parallax: ParallaxEffect | null;
  controls: VideoControls;
  effects: VideoEffects;
}

/**
 * Video Controls
 */
export interface VideoControls {
  play: () => void;
  pause: () => void;
  mute: () => void;
  unmute: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

/**
 * Video Effects
 */
export interface VideoEffects {
  applyFilter: (filter: string) => void;
  removeFilter: () => void;
  setOpacity: (opacity: number) => void;
  setBlur: (blur: number) => void;
}

/**
 * Visual Feedback Configuration
 */
export interface VisualFeedbackConfig {
  hover?: {
    scale?: number;
    glow?: boolean;
    colorShift?: string;
    shadow?: boolean;
    transform?: string;
  };
  click?: {
    ripple?: boolean;
    bounce?: boolean;
    flash?: boolean;
    shake?: boolean;
  };
  focus?: {
    outline?: boolean;
    glow?: boolean;
    scale?: number;
  };
  loading?: {
    spinner?: boolean;
    pulse?: boolean;
    skeleton?: boolean;
  };
  success?: {
    checkmark?: boolean;
    glow?: boolean;
    bounce?: boolean;
  };
  error?: {
    shake?: boolean;
    flash?: boolean;
    border?: boolean;
  };
}

/**
 * Visual Feedback System
 */
export interface VisualFeedbackSystem {
  element: HTMLElement | null;
  feedbackTypes: FeedbackType[];
  triggers: FeedbackTrigger[];
  animations: FeedbackAnimation[];
  cleanup: () => void;
}

/**
 * Feedback Type
 */
export interface FeedbackType {
  name: string;
  trigger: string;
  animation: string;
  duration: number;
  easing: string;
}

/**
 * Feedback Trigger
 */
export interface FeedbackTrigger {
  event: string;
  condition?: string;
  debounce?: number;
  throttle?: number;
}

/**
 * Feedback Animation
 */
export interface FeedbackAnimation {
  name: string;
  keyframes: string;
  duration: number;
  easing: string;
  fillMode: string;
}

/**
 * Parallax Configuration
 */
export interface ParallaxConfig {
  speeds?: number[];
  direction?: 'vertical' | 'horizontal' | 'both';
  threshold?: number;
  smooth?: boolean;
  performance?: {
    throttle?: number;
    useRAF?: boolean;
    maxFPS?: number;
  };
}

/**
 * Parallax Element
 */
export interface ParallaxElement {
  element: HTMLElement | null;
  speed: number;
  direction: 'vertical' | 'horizontal' | 'both';
  offset: number;
  bounds: ElementBounds;
}

/**
 * Parallax Effect
 */
export interface ParallaxEffect {
  speed: number;
  direction: 'vertical' | 'horizontal';
  offset: number;
  bounds: ElementBounds;
}

/**
 * Parallax System
 */
export interface ParallaxSystem {
  elements: ParallaxElement[];
  config: ParallaxConfig;
  isActive: boolean;
  performance: {
    fps: number;
    lastFrame: number;
    frameCount: number;
  };
}

/**
 * Element Bounds
 */
export interface ElementBounds {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

/**
 * Animation System
 */
export interface AnimationSystem {
  type: 'modern' | 'scroll' | '3d' | 'video' | 'feedback' | 'parallax';
  config: any;
  isActive: boolean;
  performance: PerformanceMetrics;
}

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  cpuUsage: number;
  renderTime: number;
}

/**
 * Animation Performance Budget
 */
export interface AnimationPerformanceBudget {
  maxAnimations: number;
  maxFPS: number;
  maxMemoryMB: number;
  maxCPUPercent: number;
  degradationThreshold: number;
}

/**
 * Animation Quality Settings
 */
export interface AnimationQualitySettings {
  level: 'low' | 'medium' | 'high' | 'ultra';
  reducedMotion: boolean;
  prefersReducedMotion: boolean;
  hardwareAcceleration: boolean;
  webglSupported: boolean;
}

/**
 * Animation Optimization Config
 */
export interface AnimationOptimizationConfig {
  enableGPUAcceleration: boolean;
  useCompositorLayers: boolean;
  batchAnimations: boolean;
  cullOffscreenAnimations: boolean;
  adaptiveQuality: boolean;
  performanceBudget: AnimationPerformanceBudget;
}