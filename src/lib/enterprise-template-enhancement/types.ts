/**
 * Enterprise Template Enhancement System Types
 * 
 * This module defines the core types and interfaces for the enterprise template
 * enhancement system that transforms basic templates into professional, interactive,
 * and conversion-optimized experiences.
 */

import type { Component, FunnelTemplate as BaseFunnelTemplate } from '../types';
import type { Template as BaseTemplate } from '../website-templates';

// ============================================================================
// CORE ENHANCEMENT INTERFACES
// ============================================================================

/**
 * Enhanced Template - extends base template with enterprise features
 */
export interface EnhancedTemplate extends BaseTemplate {
  isEnhanced: boolean;
  category: string;
  enhancementConfig: TemplateEnhancementConfig;
  enterpriseFeatures: EnterpriseFeatures;
  gamificationElements: GamificationElements;
  interactiveComponents: InteractiveComponents;
  functionalFeatures: FunctionalFeatures;
  personalization: PersonalizationConfig;
  analytics: AnalyticsConfig;
  version: string;
}

/**
 * Enhanced Funnel Template - extends base funnel template with enterprise features
 */
export interface EnhancedFunnelTemplate extends BaseFunnelTemplate {
  enhancementConfig: TemplateEnhancementConfig;
  enterpriseFeatures: EnterpriseFeatures;
  gamificationElements: GamificationElements;
  interactiveComponents: InteractiveComponents;
  functionalFeatures: FunctionalFeatures;
  personalization: PersonalizationConfig;
  analytics: AnalyticsConfig;
}

/**
 * Enhancement Level Type
 */
export type EnhancementLevel = 'basic' | 'professional' | 'enterprise';

/**
 * Template Enhancement Configuration
 */
export interface TemplateEnhancementConfig {
  personalization: boolean;
  analytics: boolean;
  id: string;
  templateId: string;
  templateType: 'website' | 'funnel';
  enhancementLevel: EnhancementLevel;
  industry?: string;
  targetAudience?: string;
  conversionGoals: string[];
  enabledFeatures: {
    enterpriseDesign: boolean;
    gamification: boolean;
    interactivity: boolean;
    personalization: boolean;
    analytics: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ENTERPRISE DESIGN FEATURES
// ============================================================================

/**
 * Enterprise Features Configuration
 */
export interface EnterpriseFeatures {
  trustSignals: TrustSignal[];
  professionalAssets: ProfessionalAsset[];
  brandElements: BrandElement[];
  designEnhancements: DesignEnhancement[];
}

/**
 * Trust Signal Types
 */
export interface TrustSignal {
  id: string;
  type: 'security_badge' | 'certification' | 'testimonial_verification' | 'social_proof' | 'guarantee' | 'uptime' | 'compliance';
  title: string;
  description?: string;
  icon?: string;
  image?: string;
  url?: string;
  verified: boolean;
  displayPosition: 'header' | 'footer' | 'pricing' | 'hero' | 'testimonials' | 'inline';
  industry?: string[];
}

/**
 * Professional Asset Types
 */
export interface ProfessionalAsset {
  id: string;
  type: 'image' | 'icon' | 'logo' | 'graphic' | 'video' | 'animation';
  category: 'hero' | 'feature' | 'testimonial' | 'brand' | 'background' | 'decoration';
  url: string;
  alt?: string;
  title?: string;
  quality: 'standard' | 'premium' | 'enterprise';
  license: 'free' | 'premium' | 'custom';
}

/**
 * Brand Element Configuration
 */
export interface BrandElement {
  id: string;
  type: 'logo' | 'color_scheme' | 'typography' | 'pattern' | 'texture';
  name: string;
  value: string | object;
  category: 'primary' | 'secondary' | 'accent';
  usage: string[];
}

/**
 * Design Enhancement Configuration
 */
export interface DesignEnhancement {
  id: string;
  type: 'typography' | 'color_palette' | 'spacing' | 'layout' | 'visual_hierarchy';
  name: string;
  description: string;
  cssProperties: Record<string, string>;
  applicableComponents: string[];
  priority: number;
}

// ============================================================================
// GAMIFICATION ELEMENTS
// ============================================================================

/**
 * Gamification Elements Configuration
 */
export interface GamificationElements {
  progressTrackers: ProgressTracker[];
  achievements: Achievement[];
  rewards: Reward[];
  engagementFeatures: EngagementFeature[];
}

/**
 * Progress Tracker Configuration
 */
export interface ProgressTracker {
  id: string;
  type: 'linear' | 'circular' | 'step' | 'milestone';
  name: string;
  description: string;
  steps: ProgressStep[];
  visualStyle: ProgressVisualStyle;
  triggers: ProgressTrigger[];
  completionReward?: string;
}

/**
 * Progress Step Definition
 */
export interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  required: boolean;
  completionCriteria: CompletionCriteria;
  reward?: Reward;
}

/**
 * Progress Visual Style
 */
export interface ProgressVisualStyle {
  theme: 'minimal' | 'modern' | 'playful' | 'professional';
  colors: {
    incomplete: string;
    complete: string;
    current: string;
  };
  animation: 'none' | 'fade' | 'slide' | 'bounce' | 'pulse';
  showPercentage: boolean;
  showLabels: boolean;
}

/**
 * Progress Trigger Configuration
 */
export interface ProgressTrigger {
  event: 'form_submit' | 'page_view' | 'click' | 'scroll' | 'time_spent' | 'video_watch';
  condition?: string;
  value?: string | number;
}

/**
 * Completion Criteria
 */
export interface CompletionCriteria {
  type: 'action' | 'time' | 'interaction' | 'form_completion' | 'page_visit';
  target: string;
  value?: string | number;
  operator?: 'equals' | 'greater_than' | 'less_than' | 'contains';
}

/**
 * Achievement Configuration
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'engagement' | 'completion' | 'social' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockCriteria: CompletionCriteria[];
  displayRules: AchievementDisplayRule[];
}

/**
 * Achievement Display Rules
 */
export interface AchievementDisplayRule {
  trigger: 'immediate' | 'delayed' | 'page_load' | 'hover';
  duration?: number;
  position: 'top' | 'center' | 'bottom' | 'corner';
  animation: 'fade' | 'slide' | 'bounce' | 'confetti';
}

/**
 * Reward Configuration
 */
export interface Reward {
  id: string;
  type: 'badge' | 'points' | 'discount' | 'content' | 'access' | 'recognition';
  title: string;
  description: string;
  value?: string | number;
  icon?: string;
  image?: string;
  expiresAt?: Date;
  redeemable: boolean;
}

/**
 * Engagement Feature Configuration
 */
export interface EngagementFeature {
  id: string;
  type: 'quiz' | 'poll' | 'survey' | 'assessment' | 'calculator' | 'game';
  name: string;
  description: string;
  config: Record<string, any>;
  scoringSystem?: ScoringSystem;
  resultTypes?: ResultType[];
}

/**
 * Scoring System Configuration
 */
export interface ScoringSystem {
  type: 'points' | 'percentage' | 'category' | 'personality';
  maxScore?: number;
  passingScore?: number;
  weightings?: Record<string, number>;
}

/**
 * Result Type Configuration
 */
export interface ResultType {
  id: string;
  title: string;
  description: string;
  minScore?: number;
  maxScore?: number;
  category?: string;
  recommendations?: string[];
}

// ============================================================================
// INTERACTIVE COMPONENTS
// ============================================================================

/**
 * Interactive Components Configuration
 */
export interface InteractiveComponents {
  animations: AnimationConfig[];
  dynamicContent: DynamicContentConfig[];
  interactions: InteractionConfig[];
  mediaEnhancements: MediaEnhancement[];
}

/**
 * Animation Configuration
 */
export interface AnimationConfig {
  id: string;
  type: 'scroll' | 'hover' | 'click' | 'focus' | 'load' | 'timed';
  name: string;
  description: string;
  targetSelector: string;
  animationType: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'pulse' | 'shake' | 'flip' | 'blur';
  duration: number;
  delay?: number;
  easing: string;
  trigger: AnimationTrigger;
  responsive: boolean;
}

/**
 * Animation Trigger Configuration
 */
export interface AnimationTrigger {
  event: string;
  threshold?: number;
  offset?: number;
  once?: boolean;
  condition?: string;
}

/**
 * Dynamic Content Configuration
 */
export interface DynamicContentConfig {
  id: string;
  type: 'text' | 'image' | 'component' | 'layout';
  name: string;
  targetSelector: string;
  contentRules: ContentRule[];
  fallbackContent: string;
  updateFrequency: 'real_time' | 'on_load' | 'on_interaction' | 'scheduled';
}

/**
 * Content Rule Configuration
 */
export interface ContentRule {
  id: string;
  condition: string;
  content: string | object;
  priority: number;
  active: boolean;
}

/**
 * Interaction Configuration
 */
export interface InteractionConfig {
  id: string;
  type: 'hover' | 'click' | 'scroll' | 'form' | 'media';
  name: string;
  targetSelector: string;
  behavior: InteractionBehavior;
  feedback: InteractionFeedback;
  analytics?: InteractionAnalytics;
}

/**
 * Interaction Behavior Configuration
 */
export interface InteractionBehavior {
  action: string;
  parameters: Record<string, any>;
  conditions?: string[];
  cooldown?: number;
}

/**
 * Interaction Feedback Configuration
 */
export interface InteractionFeedback {
  visual?: {
    type: 'highlight' | 'glow' | 'shake' | 'scale' | 'color_change';
    duration: number;
    intensity: number;
  };
  audio?: {
    type: 'click' | 'success' | 'error' | 'notification';
    volume: number;
  };
  haptic?: {
    type: 'light' | 'medium' | 'heavy';
    duration: number;
  };
}

/**
 * Interaction Analytics Configuration
 */
export interface InteractionAnalytics {
  trackClicks: boolean;
  trackHovers: boolean;
  trackScrollDepth: boolean;
  customEvents: string[];
}

/**
 * Media Enhancement Configuration
 */
export interface MediaEnhancement {
  id: string;
  type: 'video' | 'image' | 'audio' | 'gallery';
  name: string;
  targetSelector: string;
  enhancements: MediaEnhancementFeature[];
}

/**
 * Media Enhancement Feature
 */
export interface MediaEnhancementFeature {
  type: 'lazy_load' | 'progressive_load' | 'interactive_controls' | 'zoom' | 'gallery' | 'autoplay' | 'captions';
  config: Record<string, any>;
  enabled: boolean;
}

// ============================================================================
// FUNCTIONAL FEATURES
// ============================================================================

/**
 * Functional Features Configuration
 */
export interface FunctionalFeatures {
  conversionElements: ConversionElement[];
  testingConfig: ABTestConfig;
  leadMagnets: LeadMagnet[];
  automationTriggers: AutomationTrigger[];
}

/**
 * Conversion Element Configuration
 */
export interface ConversionElement {
  id: string;
  type: 'scarcity' | 'urgency' | 'social_proof' | 'authority' | 'reciprocity' | 'commitment';
  name: string;
  description: string;
  targetSelector: string;
  config: ConversionElementConfig;
  active: boolean;
}

/**
 * Conversion Element Configuration Details
 */
export interface ConversionElementConfig {
  trigger?: string;
  duration?: number;
  message?: string;
  style?: Record<string, string>;
  conditions?: string[];
  fallback?: string;
}

/**
 * A/B Testing Configuration
 */
export interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: TestVariant[];
  trafficSplit: Record<string, number>;
  conversionGoal: ConversionGoal;
  startDate?: Date;
  endDate?: Date;
  minSampleSize: number;
  confidenceLevel: number;
}

/**
 * Test Variant Configuration
 */
export interface TestVariant {
  id: string;
  name: string;
  description: string;
  changes: ComponentChange[];
  trafficPercentage: number;
  isControl: boolean;
}

/**
 * Component Change Configuration
 */
export interface ComponentChange {
  componentId: string;
  changeType: 'content' | 'design' | 'behavior';
  property: string;
  value: any;
  originalValue?: any;
}

/**
 * Conversion Goal Configuration
 */
export interface ConversionGoal {
  id: string;
  name: string;
  type: 'click' | 'form_submit' | 'page_view' | 'time_on_page' | 'scroll_depth' | 'custom';
  target: string;
  value?: number;
  operator?: 'equals' | 'greater_than' | 'less_than';
}

/**
 * Lead Magnet Configuration
 */
export interface LeadMagnet {
  id: string;
  type: 'ebook' | 'checklist' | 'template' | 'course' | 'webinar' | 'consultation';
  title: string;
  description: string;
  deliveryMethod: 'email' | 'download' | 'redirect';
  formFields: FormField[];
  automationSequence?: string;
  trackingPixels?: string[];
}

/**
 * Form Field Configuration
 */
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'radio' | 'textarea';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule[];
  options?: string[];
}

/**
 * Validation Rule Configuration
 */
export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'phone' | 'min_length' | 'max_length' | 'pattern' | 'step_complete';
  value?: string | number;
  message: string;
}

/**
 * Automation Trigger Configuration
 */
export interface AutomationTrigger {
  id: string;
  name: string;
  event: 'form_submit' | 'page_view' | 'button_click' | 'time_delay' | 'scroll_depth';
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  active: boolean;
}

/**
 * Trigger Condition Configuration
 */
export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string | number | boolean;
}

/**
 * Trigger Action Configuration
 */
export interface TriggerAction {
  type: 'email' | 'webhook' | 'redirect' | 'tag' | 'score_update' | 'notification';
  config: Record<string, any>;
  delay?: number;
}

// ============================================================================
// PERSONALIZATION & ANALYTICS
// ============================================================================

/**
 * Personalization Configuration
 */
export interface PersonalizationConfig {
  rules: PersonalizationRule[];
  segments: UserSegment[];
  dynamicContent: DynamicContentRule[];
  behaviorTracking: BehaviorTrackingConfig;
}

/**
 * Personalization Rule Configuration
 */
export interface PersonalizationRule {
  targetComponents: any;
  id: string;
  name: string;
  description: string;
  conditions: PersonalizationCondition[];
  actions: PersonalizationAction[];
  priority: number;
  active: boolean;
}

/**
 * Personalization Condition Configuration
 */
export interface PersonalizationCondition {
  type: 'traffic_source' | 'location' | 'device' | 'time' | 'previous_visit' | 'user_segment';
  operator: 'equals' | 'contains' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: string | string[] | number;
}

/**
 * Personalization Action Configuration
 */
export interface PersonalizationAction {
  type: 'show_content' | 'hide_content' | 'replace_content' | 'modify_style' | 'redirect';
  target: string;
  value: any;
}

/**
 * User Segment Configuration
 */
export interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  size?: number;
  lastUpdated: Date;
}

/**
 * Segment Criteria Configuration
 */
export interface SegmentCriteria {
  field: string;
  operator: string;
  value: any;
  logic?: 'and' | 'or';
}

/**
 * Dynamic Content Rule Configuration
 */
export interface DynamicContentRule {
  componentId: number;
  componentType: string;
  id: string;
  name: string;
  targetSelector: string;
  contentVariations: ContentVariation[];
  defaultContent: string;
  testingEnabled: boolean;
}

/**
 * Content Variation Configuration
 */
export interface ContentVariation {
  id: string;
  name: string;
  content: string;
  conditions: PersonalizationCondition[];
  weight: number;
}

/**
 * Behavior Tracking Configuration
 */
export interface BehaviorTrackingConfig {
  trackPageViews: boolean;
  trackClicks: boolean;
  trackScrollDepth: boolean;
  trackTimeOnPage: boolean;
  trackFormInteractions: boolean;
  customEvents: CustomEvent[];
}

/**
 * Custom Event Configuration
 */
export interface CustomEvent {
  type: string;
  data?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Analytics Configuration
 */
export interface AnalyticsConfig {
  conversionGoals: any;
  enabled: boolean;
  providers: string[];
  trackingId: string;
  batchSize: number;
  autoTrack: {
    pageViews: boolean;
    clicks: boolean;
    formSubmissions: boolean;
  };
  goals?: ConversionGoal[];
  dashboards?: AnalyticsDashboard[];
  reports?: AnalyticsReport[];
  realTimeTracking?: boolean;
}

/**
 * Optimization Recommendation
 */
export interface OptimizationRecommendation {
  id: string;
  type: 'conversion' | 'engagement' | 'performance' | 'user_experience';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  recommendation: string;
  expectedImprovement: string;
  implementationSteps: string[];
  relatedMetrics: string[];
  confidence: number;
}

/**
 * Analytics Provider Configuration
 */
export interface AnalyticsProvider {
  name: string;
  type: 'google_analytics' | 'facebook_pixel' | 'custom';
  config: Record<string, string>;
  enabled: boolean;
}

/**
 * Analytics Dashboard Configuration
 */
export interface AnalyticsDashboard {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  refreshInterval: number;
}

/**
 * Dashboard Widget Configuration
 */
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'heatmap';
  title: string;
  config: Record<string, any>;
  position: { x: number; y: number; width: number; height: number };
}

/**
 * Analytics Report Configuration
 */
export interface AnalyticsReport {
  id: string;
  name: string;
  type: 'conversion' | 'engagement' | 'performance' | 'custom';
  schedule: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  config: Record<string, any>;
}

// ============================================================================
// PROCESSING PIPELINE TYPES
// ============================================================================

/**
 * Template Processing Context
 */
export interface TemplateProcessingContext {
  originalTemplate: BaseTemplate | BaseFunnelTemplate;
  enhancementConfig: TemplateEnhancementConfig;
  processingStage: ProcessingStage;
  metadata: ProcessingMetadata;
  errors: ProcessingError[];
  warnings: ProcessingWarning[];
}

/**
 * Processing Stage Enumeration
 */
export type ProcessingStage =
  | 'initialization'
  | 'enterprise_design'
  | 'gamification'
  | 'interactivity'
  | 'functionality'
  | 'personalization'
  | 'analytics'
  | 'optimization'
  | 'finalization'
  | 'complete'
  | 'error';

/**
 * Processing Metadata
 */
export interface ProcessingMetadata {
  startTime: Date;
  endTime?: Date;
  duration?: number;
  processedComponents: number;
  totalComponents: number;
  enhancementsApplied: string[];
  performanceMetrics: PerformanceMetrics;
}

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  interactivityScore: number;
}

/**
 * Processing Error
 */
export interface ProcessingError {
  stage: ProcessingStage;
  code: string;
  message: string;
  componentId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

/**
 * Processing Warning
 */
export interface ProcessingWarning {
  stage: ProcessingStage;
  code: string;
  message: string;
  componentId?: string;
  recommendation?: string;
  timestamp: Date;
}

// ============================================================================
// ENHANCEMENT ENGINE RESULT TYPES
// ============================================================================

/**
 * Enhancement Result
 */
export interface EnhancementResult<T = any> {
  success: boolean;
  data?: T;
  errors: ProcessingError[];
  warnings: ProcessingWarning[];
  metadata: {
    processingTime: number;
    enhancementsApplied: string[];
    performanceImpact: PerformanceImpact;
  };
}

/**
 * Performance Impact Assessment
 */
export interface PerformanceImpact {
  loadTimeIncrease: number;
  bundleSizeIncrease: number;
  memoryUsageIncrease: number;
  renderingComplexity: 'low' | 'medium' | 'high';
  recommendations: string[];
}

// ============================================================================
// ADDITIONAL INTERFACE TYPES (from interfaces.ts)
// ============================================================================

/**
 * Accessibility Report
 */
export interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  recommendations: string[];
  wcagLevel: 'A' | 'AA' | 'AAA';
}

/**
 * Accessibility Issue
 */
export interface AccessibilityIssue {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  element?: string;
  fix?: string;
}

/**
 * Gamified Element
 */
export interface GamifiedElement extends Component {
  gamification: {
    progressTracker?: ProgressTracker;
    achievements?: Achievement[];
    rewards?: any[];
  };
  styles?: Record<string, any>;
}

/**
 * Feedback Response
 */
export interface FeedbackResponse {
  type: 'visual' | 'audio' | 'haptic' | 'combined';
  config: Record<string, any>;
  duration: number;
  trigger: string;
}

/**
 * Gamified Quiz
 */
export interface GamifiedQuiz extends Component {
  scoring: ScoringSystem;
  achievements: Achievement[];
  leaderboard?: boolean;
  timer?: number;
}

/**
 * Interactive Form
 */
export interface InteractiveForm extends Component {
  validation: {
    realTime: boolean;
    rules: ValidationRule[];
  };
  progressIndicator: boolean;
  smartSuggestions: boolean;
}

/**
 * Interactive Media
 */
export interface InteractiveMedia extends Component {
  interactions: {
    zoom: boolean;
    gallery: boolean;
    controls: boolean;
    autoplay: boolean;
  };
}