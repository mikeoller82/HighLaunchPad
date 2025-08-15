/**
 * Enterprise Template Enhancement System
 * 
 * Main entry point for the enterprise template enhancement system that transforms
 * basic templates into professional, interactive, and conversion-optimized experiences.
 * 
 * This system provides:
 * - Enterprise-ready design enhancements with trust signals and professional assets
 * - Interactive components with animations, dynamic content, and user engagement
 * - Personalization and analytics integration
 * - Performance optimization and accessibility compliance
 */

// ============================================================================
// CORE WEBSITE TEMPLATE ENHANCEMENT EXPORTS
// ============================================================================

// Website Template Enhancement exports
export {
  WebsiteTemplateEnhancerImpl,
  createWebsiteTemplateEnhancer,
  websiteTemplateEnhancer
} from './website-template-enhancer';
export type { WebsiteTemplateEnhancer } from './website-template-enhancer';

export {
  TemplateEnhancementServiceImpl,
  createTemplateEnhancementService,
  templateEnhancementService
} from './template-enhancement-service';
export type { TemplateEnhancementService } from './template-enhancement-service';

// ============================================================================
// TRUST SIGNAL SYSTEM EXPORTS
// ============================================================================
// Trust Signal and Credibility System implementation
export {
  TrustSignalManager,
  SecurityBadgeSystem
} from './trust-signal-manager';

// Trust Signal types
export type {
  TrustSignalContext,
  SecurityBadge,
  ProfessionalCertification,
  TestimonialVerification,
  CredibilityIndicator
} from './trust-signal-manager';

// ============================================================================
// CORE TYPES AND INTERFACES
// ============================================================================

// Core types from types.ts
export type {
  EnhancedTemplate,
  EnhancedFunnelTemplate,
  TemplateEnhancementConfig,
  EnterpriseFeatures,
  InteractiveComponents,
  PersonalizationConfig,
  AnalyticsConfig,
  ConversionGoal,
  TrustSignal
} from './types';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

import type { FunnelTemplate } from '../types';
import type { Template } from '../website-templates';
import type { TemplateEnhancementConfig, EnhancedTemplate, EnhancedFunnelTemplate } from './types';
import { websiteTemplateEnhancer } from './website-template-enhancer';

/**
 * Quick enhancement function for templates with default configuration
 * 
 * @param template - The template to enhance
 * @param options - Optional enhancement options
 * @returns Promise resolving to enhanced template
 */
export async function enhanceTemplate(
  template: Template | FunnelTemplate,
  options: Partial<TemplateEnhancementConfig> = {}
): Promise<EnhancedTemplate | EnhancedFunnelTemplate> {
  const defaultConfig: TemplateEnhancementConfig = {
    id: `enhancement_${template.id}_${Date.now()}`,
    templateId: template.id,
    templateType: 'components' in template && Array.isArray(template.components) ? 'website' : 'funnel',
    enhancementLevel: 'professional',
    conversionGoals: ['increase_engagement'],
    enabledFeatures: {
      enterpriseDesign: true,
      gamification: false,
      interactivity: true,
      personalization: false,
      analytics: true
    },
    personalization: false,
    analytics: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...options
  };

  // Check if it's a FunnelTemplate by checking the stats structure
  const isFunnelTemplate = 'stats' in template &&
    typeof template.stats === 'object' &&
    'ctr' in template.stats &&
    'optInRate' in template.stats &&
    'healthScore' in template.stats;

  if (isFunnelTemplate) {
    // Convert FunnelTemplate to Template format for enhancement
    const funnelTemplate = template as FunnelTemplate;
    const convertedTemplate: Template = {
      ...funnelTemplate,
      stats: {
        visitors: `${Math.round(funnelTemplate.stats.ctr * 1000)}`,
        leads: `${Math.round(funnelTemplate.stats.optInRate * 100)}`,
        conversion: `${funnelTemplate.stats.healthScore}%`
      }
    };

    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(convertedTemplate, defaultConfig);

    // Convert back to EnhancedFunnelTemplate format
    const enhancedFunnel: EnhancedFunnelTemplate = {
      ...enhanced,
      stats: funnelTemplate.stats, // Restore original funnel stats
      purpose: funnelTemplate.purpose,
      targetAudience: funnelTemplate.targetAudience,
      conversionStrategy: funnelTemplate.conversionStrategy,
      industry: funnelTemplate.industry,
      psychologicalTriggers: funnelTemplate.psychologicalTriggers
    };

    return enhancedFunnel;
  } else {
    // Handle regular Template
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template as Template, defaultConfig);
    return enhanced;
  }
}

/**
 * Create a basic enhancement configuration
 * 
 * @param templateId - ID of the template to enhance
 * @param options - Configuration options
 * @returns Enhancement configuration
 */
export function createEnhancementConfig(
  templateId: string,
  options: Partial<TemplateEnhancementConfig> = {}
): TemplateEnhancementConfig {
  return {
    id: `enhancement_${templateId}_${Date.now()}`,
    templateId,
    templateType: 'website',
    enhancementLevel: 'professional',
    conversionGoals: ['increase_engagement'],
    enabledFeatures: {
      enterpriseDesign: true,
      gamification: false,
      interactivity: true,
      personalization: false,
      analytics: true
    },
    personalization: false,
    analytics: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...options
  };
}

/**
 * Validate if a template is suitable for enhancement
 * 
 * @param template - Template to validate
 * @returns Validation result
 */
export async function validateTemplateForEnhancement(
  template: Template | FunnelTemplate
): Promise<{ valid: boolean; issues: string[]; recommendations: string[] }> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Basic validation
  if (!template.id) {
    issues.push('Template must have an ID');
  }

  if (!template.title) {
    issues.push('Template must have a title');
  }

  if (!template.components || !Array.isArray(template.components)) {
    issues.push('Template must have a components array');
  } else if (template.components.length === 0) {
    issues.push('Template must have at least one component');
  }

  // Component validation
  if (template.components) {
    const componentsWithoutContent = template.components.filter(c => !c.content || Object.keys(c.content).length === 0);
    if (componentsWithoutContent.length > 0) {
      recommendations.push(`${componentsWithoutContent.length} components have no content - consider adding content for better enhancement results`);
    }

    const componentsWithoutType = template.components.filter(c => !c.type);
    if (componentsWithoutType.length > 0) {
      issues.push(`${componentsWithoutType.length} components are missing type information`);
    }
  }

  // Enhancement suitability recommendations
  if (template.components && template.components.length > 20) {
    recommendations.push('Large templates may benefit from performance optimization during enhancement');
  }

  if (template.components && template.components.some(c => c.type === 'quiz' || c.type === 'contact')) {
    recommendations.push('Interactive components detected - gamification features would work well with this template');
  }

  return {
    valid: issues.length === 0,
    issues,
    recommendations
  };
}

/**
 * Get enhancement recommendations based on template analysis
 * 
 * @param template - Template to analyze
 * @returns Enhancement recommendations
 */
export function getEnhancementRecommendations(
  template: Template | FunnelTemplate
): {
  recommendedLevel: 'basic' | 'professional' | 'enterprise';
  recommendedFeatures: string[];
  industrySpecific: string[];
  conversionOptimizations: string[];
} {
  const recommendations = {
    recommendedLevel: 'professional' as 'basic' | 'professional' | 'enterprise',
    recommendedFeatures: [] as string[],
    industrySpecific: [] as string[],
    conversionOptimizations: [] as string[]
  };

  // Analyze template components for recommendations
  if (template.components) {
    const hasFormComponents = template.components.some(c =>
      c.type === 'contact' || c.type === 'newsletter' || c.type === 'quiz'
    );

    if (hasFormComponents) {
      recommendations.recommendedFeatures.push('gamification', 'interactivity');
      recommendations.conversionOptimizations.push('form_optimization', 'progress_tracking');
    }

    const hasPricingComponents = template.components.some(c => c.type === 'pricing');
    if (hasPricingComponents) {
      recommendations.recommendedFeatures.push('enterprise_design', 'analytics');
      recommendations.conversionOptimizations.push('trust_signals', 'social_proof');
    }

    const hasTestimonialComponents = template.components.some(c => c.type === 'testimonials');
    if (hasTestimonialComponents) {
      recommendations.recommendedFeatures.push('enterprise_design');
      recommendations.conversionOptimizations.push('testimonial_verification', 'social_proof');
    }

    // Determine enhancement level based on complexity
    if (template.components.length > 15) {
      recommendations.recommendedLevel = 'enterprise';
    } else if (template.components.length > 8) {
      recommendations.recommendedLevel = 'professional';
    } else {
      recommendations.recommendedLevel = 'basic';
    }
  }

  // Industry-specific recommendations based on template content
  const templateContent = JSON.stringify(template).toLowerCase();

  if (templateContent.includes('saas') || templateContent.includes('software')) {
    recommendations.industrySpecific.push('security_badges', 'uptime_guarantees', 'integration_showcases');
  }

  if (templateContent.includes('coach') || templateContent.includes('course')) {
    recommendations.industrySpecific.push('authority_building', 'transformation_stories', 'certification_display');
  }

  if (templateContent.includes('ecommerce') || templateContent.includes('product')) {
    recommendations.industrySpecific.push('product_reviews', 'security_seals', 'shipping_guarantees');
  }

  return recommendations;
}

/**
 * Create a performance-optimized enhancement configuration
 * 
 * @param templateId - ID of the template
 * @param prioritizePerformance - Whether to prioritize performance over features
 * @returns Performance-optimized configuration
 */
export function createPerformanceOptimizedConfig(
  templateId: string,
  prioritizePerformance: boolean = true
): TemplateEnhancementConfig {
  return {
    id: `perf_enhancement_${templateId}_${Date.now()}`,
    templateId,
    templateType: 'website',
    enhancementLevel: prioritizePerformance ? 'basic' : 'professional',
    conversionGoals: ['improve_performance'],
    enabledFeatures: {
      enterpriseDesign: true,
      gamification: !prioritizePerformance, // Disable for performance
      interactivity: !prioritizePerformance, // Limit for performance
      personalization: false, // Disable for performance
      analytics: true
    },
    personalization: false,
    analytics: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// ============================================================================
// CONSTANTS AND DEFAULTS
// ============================================================================

/**
 * Default enhancement levels and their characteristics
 */
export const ENHANCEMENT_LEVELS = {
  basic: {
    name: 'Basic Enhancement',
    description: 'Essential professional design improvements and trust signals',
    features: ['enterprise_design', 'analytics'],
    maxComponents: 10,
    performanceImpact: 'low'
  },
  professional: {
    name: 'Professional Enhancement',
    description: 'Comprehensive enhancement with interactivity and optimization',
    features: ['enterprise_design', 'interactivity', 'analytics'],
    maxComponents: 20,
    performanceImpact: 'medium'
  },
  enterprise: {
    name: 'Enterprise Enhancement',
    description: 'Full-featured enhancement with all capabilities enabled',
    features: ['enterprise_design', 'gamification', 'interactivity', 'personalization', 'analytics'],
    maxComponents: -1, // No limit
    performanceImpact: 'high'
  }
} as const;

/**
 * Default conversion goals
 */
export const DEFAULT_CONVERSION_GOALS = [
  'increase_engagement',
  'improve_conversion',
  'reduce_bounce_rate',
  'increase_time_on_page',
  'improve_form_completion',
  'increase_social_sharing',
  'improve_trust_signals',
  'optimize_mobile_experience'
] as const;

/**
 * Supported template types
 */
export const SUPPORTED_TEMPLATE_TYPES = [
  'website',
  'funnel',
  'landing_page',
  'blog',
  'ecommerce',
  'portfolio',
  'business',
  'saas',
  'coaching',
  'course'
] as const;

/**
 * Performance thresholds for optimization
 */
export const PERFORMANCE_THRESHOLDS = {
  loadTime: {
    good: 1500,
    needs_improvement: 2500,
    poor: 4000
  },
  interactivityTime: {
    good: 300,
    needs_improvement: 500,
    poor: 1000
  },
  cumulativeLayoutShift: {
    good: 0.1,
    needs_improvement: 0.25,
    poor: 0.5
  }
} as const;