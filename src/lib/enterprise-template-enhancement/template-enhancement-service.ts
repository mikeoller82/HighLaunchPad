/**
 * Template Enhancement Service
 * 
 * Main service for enhancing existing website templates with enterprise features.
 * This service orchestrates the enhancement process and applies all improvements
 * to the template library.
 */

import { websiteTemplatesRaw as websiteTemplates, type Template } from '../website-templates';
import { websiteTemplateEnhancer } from './website-template-enhancer';
import { 
  TemplateEnhancementConfig, 
  EnhancedTemplate,
  EnhancementLevel,
  ConversionGoal
} from './types';

// ============================================================================
// TEMPLATE ENHANCEMENT SERVICE
// ============================================================================

export interface TemplateEnhancementService {
  /**
   * Enhance all website templates with enterprise features
   */
  enhanceAllTemplates(templates: Template[], config?: Partial<TemplateEnhancementConfig>): Promise<EnhancedTemplate[]>;
  
  /**
   * Enhance a specific template by ID
   */
  enhanceTemplateById(templateId: string, config?: Partial<TemplateEnhancementConfig>): Promise<EnhancedTemplate>;
  
  /**
   * Enhance templates by category or type
   */
  enhanceTemplatesByCategory(category: string, config?: Partial<TemplateEnhancementConfig>): Promise<EnhancedTemplate[]>;
  
  /**
   * Get enhancement recommendations for a template
   */
  getEnhancementRecommendations(templateId: string): Promise<{
    recommendedLevel: EnhancementLevel;
    recommendedFeatures: string[];
    industrySpecific: string[];
    conversionOptimizations: string[];
  }>;
  
  /**
   * Preview enhancement changes without applying them
   */
  previewEnhancement(templateId: string, config: TemplateEnhancementConfig): Promise<{
    original: Template;
    enhanced: EnhancedTemplate;
    changes: string[];
  }>;
  
  /**
   * Validate template compatibility with enhancements
   */
  validateTemplateCompatibility(templateId: string): Promise<{
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  }>;
}

export class TemplateEnhancementServiceImpl implements TemplateEnhancementService {
  enhanceTemplateById(templateId: string, config?: Partial<TemplateEnhancementConfig>): Promise<EnhancedTemplate> {
    throw new Error('Method not implemented.');
  }
  
  async enhanceAllTemplates(templates: Template[], config?: Partial<TemplateEnhancementConfig>): Promise<EnhancedTemplate[]> {
    const enhancedTemplates: EnhancedTemplate[] = [];
    for (const template of templates) {
      try {
  const enhancementConfig = this.createEnhancementConfig(template, config);
  const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, enhancementConfig);
  enhancedTemplates.push(enhanced);
} catch (error) {
  console.error(`Failed to enhance template ${template.id}:`, error);
  // Continue with other templates
}
    }
    return enhancedTemplates;
  }

  // Note: enhanceTemplateById and others should be refactored similarly if needed, but only enhanceAllTemplates is used for the main export.

  async enhanceTemplatesByCategory(category: string, config?: Partial<TemplateEnhancementConfig>): Promise<EnhancedTemplate[]> {
const templates = websiteTemplates;
const categoryTemplates = templates.filter(template => 
  this.getTemplateCategory(template) === category
);
const enhancedTemplates: EnhancedTemplate[] = [];
    for (const template of categoryTemplates) {
      try {
        const enhancementConfig = this.createEnhancementConfig(template, config);
        const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, enhancementConfig);
        enhancedTemplates.push(enhanced);
      } catch (error) {
        console.error(`Failed to enhance template ${template.id}:`, error);
      }
    }
    return enhancedTemplates;
  }
  
  async getEnhancementRecommendations(templateId: string): Promise<{
    recommendedLevel: EnhancementLevel;
    recommendedFeatures: string[];
    industrySpecific: string[];
    conversionOptimizations: string[];
  }> {
    const templates = websiteTemplates;
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    const recommendations = {
      recommendedLevel: 'professional' as EnhancementLevel,
      recommendedFeatures: [] as string[],
      industrySpecific: [] as string[],
      conversionOptimizations: [] as string[]
    };
    // Analyze template complexity
    const componentCount = template.components.length;
    if (componentCount > 15) {
      recommendations.recommendedLevel = 'enterprise';
    } else if (componentCount > 8) {
      recommendations.recommendedLevel = 'professional';
    } else {
      recommendations.recommendedLevel = 'basic';
    }
    // Analyze component types for feature recommendations
    const componentTypes = template.components.map(c => c.type);
    if (componentTypes.includes('contact') || componentTypes.includes('newsletter')) {
      recommendations.recommendedFeatures.push('gamification', 'interactivity');
      recommendations.conversionOptimizations.push('form_optimization', 'progress_tracking');
    }
    if (componentTypes.includes('pricing')) {
      recommendations.recommendedFeatures.push('enterprise_design', 'analytics');
      recommendations.conversionOptimizations.push('trust_signals', 'social_proof', 'pricing_psychology');
    }
    if (componentTypes.includes('testimonials')) {
      recommendations.recommendedFeatures.push('enterprise_design');
      recommendations.conversionOptimizations.push('testimonial_verification', 'social_proof');
    }
    
  if (componentTypes.includes('features')) {
    recommendations.recommendedFeatures.push('interactivity');
    recommendations.conversionOptimizations.push('interactive_demos', 'feature_highlighting');
  }
  // Industry-specific recommendations
  const templateContent = JSON.stringify(template).toLowerCase();
  const industry = this.detectIndustry(templateContent);
    
    switch (industry) {
      case 'saas':
        recommendations.industrySpecific.push(
          'security_badges', 
          'uptime_guarantees', 
          'integration_showcases',
          'free_trial_optimization'
        );
        break;
        
      case 'ecommerce':
        recommendations.industrySpecific.push(
          'product_reviews',
          'security_seals',
          'shipping_guarantees',
          'payment_security'
        );
        break;
        
      case 'coaching':
        recommendations.industrySpecific.push(
          'authority_building',
          'transformation_stories',
          'certification_display',
          'testimonial_videos'
        );
        break;
        
      case 'agency':
        recommendations.industrySpecific.push(
          'portfolio_showcase',
          'client_logos',
          'case_studies',
          'team_credentials'
        );
        break;
        
      default:
        recommendations.industrySpecific.push(
          'trust_building',
          'professional_credibility',
          'social_proof'
        );
    }
    
    return recommendations;
  }
  
  async previewEnhancement(templateId: string, config: TemplateEnhancementConfig): Promise<{
    original: Template;
    enhanced: EnhancedTemplate;
    changes: string[];
  }> {
    const templates = websiteTemplates;
    const template = templates.find((t: any) => t.id === templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, config);
    const changes = this.analyzeChanges(template, enhanced);
    return {
      original: template,
      enhanced,
      changes
    };
  }

  async validateTemplateCompatibility(templateId: string): Promise<{
    compatible: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const templates = websiteTemplates;
    const template = templates.find((t: any) => t.id === templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    const issues: string[] = [];
    const recommendations: string[] = [];
    // Validate basic structure
    if (!template.components || template.components.length === 0) {
      issues.push('Template has no components');
    }
    // Check for required component types
    const componentTypes = template.components.map((c: any) => c.type);
    if (!componentTypes.includes('hero')) {
      recommendations.push('Consider adding a hero component for better conversion');
    }
    if (!componentTypes.includes('cta')) {
      recommendations.push('Add call-to-action components to improve conversion rates');
    }
    // Validate component content
    const emptyComponents = template.components.filter((c: any) =>
      !c.content || Object.keys(c.content).length === 0
    );
    if (emptyComponents.length > 0) {
      recommendations.push(`${emptyComponents.length} components have minimal content - enhancement will be limited`);
    }
    // Check for design configuration
    const componentsWithoutDesign = template.components.filter((c: any) => !c.design);
    if (componentsWithoutDesign.length > 0) {
      recommendations.push(`${componentsWithoutDesign.length} components lack design configuration - some enhancements may not apply`);
    }
    // Performance considerations
    if (template.components.length > 20) {
      recommendations.push('Large template detected - consider performance optimization during enhancement');
    }
    return {
      compatible: issues.length === 0,
      issues,
      recommendations
    };
  }
  
  // ============================================================================
  // HELPER METHODS
  // ============================================================================
  
  private createEnhancementConfig(template: Template, config?: Partial<TemplateEnhancementConfig>): TemplateEnhancementConfig {
    const industry = this.detectIndustry(JSON.stringify(template).toLowerCase());
    const recommendations = this.getBasicRecommendations(template);
    
    const defaultConfig: TemplateEnhancementConfig = {
      id: `enhancement_${template.id}_${Date.now()}`,
      templateId: template.id,
      templateType: 'website',
      enhancementLevel: recommendations.level,
      industry,
      conversionGoals: this.getDefaultConversionGoals(template).map(goal => goal.id),
      enabledFeatures: {
        enterpriseDesign: true,
        gamification: recommendations.level !== 'basic',
        interactivity: true,
        personalization: recommendations.level === 'enterprise',
        analytics: true
      },
      personalization: recommendations.level === 'enterprise',
      analytics: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return { ...defaultConfig, ...config };
  }
  
  private getTemplateCategory(template: Template): string {
    const title = template.title.toLowerCase();
    const description = template.description.toLowerCase();
    const content = `${title} ${description}`;
    
    if (content.includes('saas') || content.includes('software')) return 'saas';
    if (content.includes('ecommerce') || content.includes('shop')) return 'ecommerce';
    if (content.includes('coach') || content.includes('course')) return 'coaching';
    if (content.includes('agency') || content.includes('portfolio')) return 'agency';
    if (content.includes('blog') || content.includes('content')) return 'blog';
    if (content.includes('landing') || content.includes('funnel')) return 'landing';
    
    return 'business';
  }
  
  private detectIndustry(content: string): string {
    if (content.includes('saas') || content.includes('software') || content.includes('api')) return 'saas';
    if (content.includes('ecommerce') || content.includes('shop') || content.includes('product')) return 'ecommerce';
    if (content.includes('coach') || content.includes('course') || content.includes('training')) return 'coaching';
    if (content.includes('agency') || content.includes('marketing') || content.includes('design')) return 'agency';
    if (content.includes('health') || content.includes('medical') || content.includes('wellness')) return 'healthcare';
    if (content.includes('finance') || content.includes('investment') || content.includes('banking')) return 'finance';
    if (content.includes('real estate') || content.includes('property')) return 'real_estate';
    if (content.includes('restaurant') || content.includes('food') || content.includes('cafe')) return 'food_service';
    
    return 'general';
  }
  
  private getBasicRecommendations(template: Template): { level: EnhancementLevel; features: string[] } {
    const componentCount = template.components.length;
    const componentTypes = template.components.map(c => c.type);
    
    let level: EnhancementLevel = 'professional';
    const features: string[] = [];
    
    // Determine level based on complexity
    if (componentCount > 15 || componentTypes.includes('pricing')) {
      level = 'enterprise';
      features.push('personalization', 'advanced_analytics');
    } else if (componentCount > 8) {
      level = 'professional';
      features.push('interactivity', 'basic_analytics');
    } else {
      level = 'basic';
      features.push('enterprise_design');
    }
    
    // Add features based on component types
    if (componentTypes.includes('contact') || componentTypes.includes('newsletter')) {
      features.push('form_enhancement');
    }
    
    if (componentTypes.includes('testimonials')) {
      features.push('social_proof');
    }
    
    if (componentTypes.includes('features')) {
      features.push('interactive_features');
    }
    
    return { level, features };
  }
  
  private getDefaultConversionGoals(template: Template): ConversionGoal[] {
    const componentTypes = template.components.map(c => c.type);
    const goals: ConversionGoal[] = [
      {
        id: 'increase_engagement',
        name: 'Increase User Engagement',
        type: 'scroll_depth',
        target: 'body',
        value: 75,
        operator: 'greater_than'
      }
    ];
    
    if (componentTypes.includes('contact') || componentTypes.includes('newsletter')) {
      goals.push({
        id: 'improve_form_conversion',
        name: 'Improve Form Conversion',
        type: 'form_submit',
        target: 'form',
        value: 1,
        operator: 'greater_than'
      });
    }
    
    if (componentTypes.includes('pricing')) {
      goals.push({
        id: 'increase_trial_signups',
        name: 'Increase Trial Signups',
        type: 'click',
        target: '.pricing-cta',
        value: 1,
        operator: 'greater_than'
      });
    }
    
    if (componentTypes.includes('cta')) {
      goals.push({
        id: 'improve_cta_clicks',
        name: 'Improve CTA Click Rate',
        type: 'click',
        target: '.cta-button',
        value: 1,
        operator: 'greater_than'
      });
    }
    
    return goals;
  }
  
  private analyzeChanges(original: Template, enhanced: EnhancedTemplate): string[] {
    const changes: string[] = [];
    
    // Compare component count
    if (enhanced.components.length !== original.components.length) {
      changes.push(`Component count changed from ${original.components.length} to ${enhanced.components.length}`);
    }
    
    // Analyze component enhancements
    for (let i = 0; i < Math.min(original.components.length, enhanced.components.length); i++) {
      const originalComp = original.components[i];
      const enhancedComp = enhanced.components[i];
      
      if (enhancedComp.design && !originalComp.design) {
        changes.push(`Added design configuration to ${originalComp.type} component`);
      }
      
      if (enhancedComp.metadata?.tracking && !originalComp.metadata?.tracking) {
        changes.push(`Added analytics tracking to ${originalComp.type} component`);
      }
      
      if (enhancedComp.metadata?.personalization && !originalComp.metadata?.personalization) {
        changes.push(`Added personalization to ${originalComp.type} component`);
      }
      
      // Check for new content properties
      const originalContentKeys = Object.keys(originalComp.content || {});
      const enhancedContentKeys = Object.keys(enhancedComp.content || {});
      const newContentKeys = enhancedContentKeys.filter(key => !originalContentKeys.includes(key));
      
      if (newContentKeys.length > 0) {
        changes.push(`Added new content properties to ${originalComp.type}: ${newContentKeys.join(', ')}`);
      }
    }
    
    // Check for enterprise features
    if (enhanced.enterpriseFeatures) {
      changes.push('Added enterprise design features');
    }
    
    if (enhanced.interactiveComponents) {
      changes.push('Added interactive components and animations');
    }
    
    return changes;
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createTemplateEnhancementService(): TemplateEnhancementService {
  return new TemplateEnhancementServiceImpl();
}

// ============================================================================
// DEFAULT INSTANCE
// ============================================================================

export const templateEnhancementService = createTemplateEnhancementService();