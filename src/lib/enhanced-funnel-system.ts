// Enhanced funnel system that integrates all improvements
// Combines routing, dynamic content, validation, personalization, and psychological triggers

import { FunnelRouter, replaceTemplatePlaceholders, type RouteConfig } from './funnel-routing';
import { DynamicDateGenerator, generateDynamicContent } from './dynamic-dates';
import { SmartPlaceholderEngine, enhanceTemplateWithPlaceholders, type UserContext } from './smart-placeholder-engine';
import { ContentValidator, validateFunnelTemplate, type ValidationOptions } from './content-validation';
import { PsychologicalTriggerEngine, enhanceTemplateWithPsychology } from './psychological-triggers';
import { enhanceTemplateWithIndustryContent, getIndustryPsychologicalTriggers } from './industry-templates';
import type { FunnelTemplate, Component } from './types';

export interface EnhancedFunnelConfig {
  templateId: string;
  industry?: string;
  userContext: UserContext;
  routeConfig?: RouteConfig;
  validationOptions?: ValidationOptions;
  enablePsychologicalTriggers?: boolean;
  optimizeForConversion?: boolean;
}

export interface EnhancementResult {
  template: FunnelTemplate;
  validationReport: any;
  optimizations: string[];
  performanceScore: number;
  recommendations: string[];
}

export class EnhancedFunnelSystem {
  private router: FunnelRouter;
  private dateGenerator: DynamicDateGenerator;
  private placeholderEngine: SmartPlaceholderEngine;
  private validator: ContentValidator;
  private triggerEngine: PsychologicalTriggerEngine;

  constructor() {
    this.router = new FunnelRouter();
    this.dateGenerator = new DynamicDateGenerator();
    this.placeholderEngine = new SmartPlaceholderEngine();
    this.validator = new ContentValidator();
    this.triggerEngine = new PsychologicalTriggerEngine();
  }

  // Main enhancement method that applies all improvements
  async enhanceTemplate(
    baseTemplate: FunnelTemplate,
    config: EnhancedFunnelConfig
  ): Promise<EnhancementResult> {
    const optimizations: string[] = [];
    const recommendations: string[] = [];

    // 1. Apply industry-specific enhancements
    let enhancedTemplate = baseTemplate;
    if (config.industry) {
      enhancedTemplate = enhanceTemplateWithIndustryContent(baseTemplate, config.industry);
      optimizations.push(`Applied ${config.industry} industry-specific content and styling`);
    }

    // 2. Replace placeholder links with real routing
    enhancedTemplate = {
      ...enhancedTemplate,
      components: replaceTemplatePlaceholders(
        enhancedTemplate.components,
        config.templateId,
        config.routeConfig
      )
    };
    optimizations.push('Replaced placeholder links with dynamic routing');

    // 3. Apply dynamic date generation
    const dynamicDates = generateDynamicContent(enhancedTemplate.id);
    enhancedTemplate = this.applyDynamicDates(enhancedTemplate, dynamicDates);
    optimizations.push('Generated dynamic dates for scarcity and urgency');

    // 4. Apply smart placeholder replacement
    enhancedTemplate = {
      ...enhancedTemplate,
      components: enhancedTemplate.components.map(component => ({
        ...component,
        content: this.placeholderEngine.replaceInObject(component.content, config.userContext)
      }))
    };
    optimizations.push('Applied personalized content through smart placeholders');

    // 5. Add psychological triggers
    if (config.enablePsychologicalTriggers && config.industry) {
      enhancedTemplate = enhanceTemplateWithPsychology(
        enhancedTemplate,
        config.industry,
        config.userContext.targetAudience || 'general'
      );
      optimizations.push('Enhanced with psychological triggers for higher conversion');
    }

    // 6. Optimize for conversion
    if (config.optimizeForConversion) {
      enhancedTemplate = this.optimizeForConversion(enhancedTemplate, config.industry);
      optimizations.push('Applied conversion optimization best practices');
    }

    // 7. Validate the enhanced template
    const validationReport = validateFunnelTemplate(enhancedTemplate, config.validationOptions);
    if (!validationReport.isValid) {
      recommendations.push(...validationReport.suggestions);
    }

    // 8. Calculate performance score
    const performanceScore = this.calculatePerformanceScore(enhancedTemplate, validationReport);

    // 9. Generate additional recommendations
    const additionalRecommendations = this.generateRecommendations(enhancedTemplate, config);
    recommendations.push(...additionalRecommendations);

    return {
      template: enhancedTemplate,
      validationReport,
      optimizations,
      performanceScore,
      recommendations
    };
  }

  // Apply dynamic dates to template components
  private applyDynamicDates(template: FunnelTemplate, dynamicDates: Record<string, any>): FunnelTemplate {
    return {
      ...template,
      components: template.components.map(component => {
        let updatedContent = { ...component.content };

        // Apply dynamic dates based on component type
        if (component.type === 'countdown' && dynamicDates.endDate) {
          updatedContent.endDate = dynamicDates.endDate;
          updatedContent.endDateFormatted = dynamicDates.endDateFormatted;
        }

        if (component.type === 'hero' && dynamicDates.urgency) {
          updatedContent.urgency = dynamicDates.urgency;
        }

        if (component.type === 'pricing' && dynamicDates.scarcityMessage) {
          updatedContent.scarcityMessage = dynamicDates.scarcityMessage;
        }

        return {
          ...component,
          content: updatedContent
        };
      })
    };
  }

  // Optimize template for conversion
  private optimizeForConversion(template: FunnelTemplate, industry?: string): FunnelTemplate {
    const optimizedComponents = template.components.map(component => {
      // Optimize CTAs
      if (this.isCallToActionComponent(component)) {
        component = this.optimizeCallToAction(component, industry);
      }

      // Optimize headlines
      if (this.hasHeadline(component)) {
        component = this.optimizeHeadline(component);
      }

      // Add trust indicators
      if (component.type === 'hero' || component.type === 'pricing') {
        component = this.addTrustIndicators(component, industry);
      }

      // Optimize form fields
      if (component.type === 'contact' || component.type === 'quiz') {
        component = this.optimizeFormFields(component);
      }

      return component;
    });

    return {
      ...template,
      components: optimizedComponents
    };
  }

  // Check if component has call-to-action elements
  private isCallToActionComponent(component: Component): boolean {
    return !!(component.content?.cta || component.content?.ctaUrl || component.type === 'cta');
  }

  // Check if component has headline
  private hasHeadline(component: Component): boolean {
    return !!(component.content?.title || component.content?.headline);
  }

  // Optimize call-to-action buttons
  private optimizeCallToAction(component: Component, industry?: string): Component {
    const ctaOptimizations: Record<string, string[]> = {
      'healthcare': ['Schedule Consultation', 'Get Professional Care', 'Book Appointment'],
      'finance': ['Get Free Analysis', 'Secure Your Future', 'Start Building Wealth'],
      'realestate': ['Get Property Value', 'Find Your Dream Home', 'List Your Property'],
      'education': ['Enroll Now', 'Start Learning', 'Advance Your Career'],
      'fitness': ['Start Transformation', 'Get In Shape', 'Join Program'],
      'default': ['Get Started Now', 'Claim Your Spot', 'Take Action Today']
    };

    const suggestions = ctaOptimizations[industry || 'default'];
    const optimizedCta = suggestions[Math.floor(Math.random() * suggestions.length)];

    return {
      ...component,
      content: {
        ...component.content,
        cta: component.content?.cta || optimizedCta,
        // Add urgency to CTA
        ctaUrgency: 'Limited Time Offer',
        // Add security indicators
        ctaSecurity: '🔒 Secure & Confidential'
      }
    };
  }

  // Optimize headlines for better performance
  private optimizeHeadline(component: Component): Component {
    const currentTitle = component.content?.title || component.content?.headline || '';
    
    // Add emotional hooks if missing
    const emotionalHooks = [
      'Finally,', 'Discover', 'Unlock', 'Transform', 'Master', 'Achieve'
    ];
    
    let optimizedTitle = currentTitle;
    if (!emotionalHooks.some(hook => currentTitle.toLowerCase().includes(hook.toLowerCase()))) {
      const hook = emotionalHooks[Math.floor(Math.random() * emotionalHooks.length)];
      optimizedTitle = `${hook} ${currentTitle}`;
    }

    return {
      ...component,
      content: {
        ...component.content,
        title: optimizedTitle
      }
    };
  }

  // Add trust indicators to components
  private addTrustIndicators(component: Component, industry?: string): Component {
    const trustIndicators: Record<string, string[]> = {
      'healthcare': ['HIPAA Compliant', 'Licensed Professionals', 'Secure Platform'],
      'finance': ['SEC Registered', 'Fiduciary Duty', 'FDIC Insured'],
      'realestate': ['Licensed Agent', 'MLS Member', 'Local Expert'],
      'education': ['Accredited Programs', 'Industry Certified', 'Job Placement Support'],
      'fitness': ['Certified Trainers', 'Science-Based', 'Proven Results'],
      'default': ['Money-Back Guarantee', 'Secure Checkout', 'Trusted by Thousands']
    };

    const indicators = trustIndicators[industry || 'default'];

    return {
      ...component,
      content: {
        ...component.content,
        trustIndicators: indicators,
        guarantee: '100% Satisfaction Guarantee'
      }
    };
  }

  // Optimize form fields for better conversion
  private optimizeFormFields(component: Component): Component {
    if (!component.content?.fields) return component;

    const optimizedFields = component.content.fields.map((field: any) => ({
      ...field,
      placeholder: this.optimizeFieldPlaceholder(field),
      required: this.optimizeFieldRequirement(field)
    }));

    return {
      ...component,
      content: {
        ...component.content,
        fields: optimizedFields,
        privacyNote: '🔒 Your information is 100% secure and will never be shared'
      }
    };
  }

  // Optimize field placeholders
  private optimizeFieldPlaceholder(field: any): string {
    const placeholderMap: Record<string, string> = {
      'email': 'Enter your best email address',
      'name': 'Enter your first name',
      'phone': 'Enter your phone number (optional)',
      'company': 'Your company name'
    };

    return placeholderMap[field.type] || field.placeholder || `Enter your ${field.label?.toLowerCase()}`;
  }

  // Optimize field requirements
  private optimizeFieldRequirement(field: any): boolean {
    // Only require essential fields to reduce friction
    const essentialFields = ['email', 'name'];
    return essentialFields.includes(field.type) || field.required;
  }

  // Calculate overall performance score
  private calculatePerformanceScore(template: FunnelTemplate, validationReport: any): number {
    let score = validationReport.score || 0;

    // Bonus points for optimization features
    const hasCallToActions = template.components.some(c => this.isCallToActionComponent(c));
    const hasSocialProof = template.components.some(c => c.content?.testimonials || c.content?.socialProof);
    const hasUrgencyElements = template.components.some(c => c.content?.urgency || c.content?.countdown);
    const hasTrustIndicators = template.components.some(c => c.content?.trustIndicators);

    if (hasCallToActions) score += 5;
    if (hasSocialProof) score += 10;
    if (hasUrgencyElements) score += 8;
    if (hasTrustIndicators) score += 7;

    return Math.min(100, score);
  }

  // Generate recommendations for further improvement
  private generateRecommendations(template: FunnelTemplate, config: EnhancedFunnelConfig): string[] {
    const recommendations: string[] = [];

    // Check for missing elements
    const hasTestimonials = template.components.some(c => c.type === 'testimonials');
    const hasPricing = template.components.some(c => c.type === 'pricing');
    const hasFAQ = template.components.some(c => c.type === 'faq');
    const hasGuarantee = template.components.some(c => c.type === 'guarantee');

    if (!hasTestimonials) {
      recommendations.push('Add customer testimonials or success stories to build trust');
    }

    if (!hasPricing && template.purpose?.includes('Sales')) {
      recommendations.push('Include clear pricing information to reduce friction');
    }

    if (!hasFAQ) {
      recommendations.push('Add FAQ section to address common objections');
    }

    if (!hasGuarantee) {
      recommendations.push('Include guarantee or risk-reversal to reduce purchase anxiety');
    }

    // Industry-specific recommendations
    if (config.industry) {
      const industryRecommendations = this.getIndustrySpecificRecommendations(config.industry);
      recommendations.push(...industryRecommendations);
    }

    return recommendations;
  }

  // Get industry-specific recommendations
  private getIndustrySpecificRecommendations(industry: string): string[] {
    const industryRecommendations: Record<string, string[]> = {
      'healthcare': [
        'Include medical disclaimers and HIPAA compliance information',
        'Add doctor credentials and certifications',
        'Provide clear privacy and security assurances'
      ],
      'finance': [
        'Include SEC registration and compliance information',
        'Add risk disclaimers for investment products',
        'Provide clear fee structure and fiduciary duty statements'
      ],
      'realestate': [
        'Include agent licensing information',
        'Add local market data and expertise indicators',
        'Provide equal housing opportunity statements'
      ],
      'education': [
        'Include accreditation and certification information',
        'Add job placement statistics and career outcomes',
        'Provide clear refund and completion policies'
      ],
      'fitness': [
        'Include trainer certifications and qualifications',
        'Add health disclaimers and medical consultation advice',
        'Provide realistic expectations and timeline information'
      ]
    };

    return industryRecommendations[industry] || [];
  }

  // Batch process multiple templates
  async enhanceMultipleTemplates(
    templates: FunnelTemplate[],
    configs: EnhancedFunnelConfig[]
  ): Promise<EnhancementResult[]> {
    const results: EnhancementResult[] = [];

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      const config = configs[i] || configs[0]; // Use first config as fallback

      try {
        const result = await this.enhanceTemplate(template, {
          ...config,
          templateId: template.id
        });
        results.push(result);
      } catch (error) {
        console.error(`Error enhancing template ${template.id}:`, error);
        // Return template with error information
        results.push({
          template,
          validationReport: { isValid: false, errors: [`Enhancement failed: ${error}`], warnings: [], score: 0, suggestions: [] },
          optimizations: [],
          performanceScore: 0,
          recommendations: ['Template enhancement failed - please check configuration']
        });
      }
    }

    return results;
  }
}

// Utility functions for easy integration
export async function enhanceFunnelTemplate(
  template: FunnelTemplate,
  config: EnhancedFunnelConfig
): Promise<EnhancementResult> {
  const system = new EnhancedFunnelSystem();
  return await system.enhanceTemplate(template, config);
}

export function createOptimalFunnelConfig(
  templateId: string,
  industry: string,
  userContext: UserContext
): EnhancedFunnelConfig {
  return {
    templateId,
    industry,
    userContext,
    enablePsychologicalTriggers: true,
    optimizeForConversion: true,
    routeConfig: {
      templateId,
      userId: userContext.email?.split('@')[0] || 'user',
      trackingParams: {
        source: 'funnel',
        industry,
        template: templateId
      }
    },
    validationOptions: {
      strict: false,
      industry,
      templateType: templateId,
      minContentLength: 20,
      maxContentLength: 2000
    }
  };
}

// Export default system instance
export const defaultFunnelSystem = new EnhancedFunnelSystem();

const enhancedFunnelSystemExports = {
  EnhancedFunnelSystem,
  enhanceFunnelTemplate,
  createOptimalFunnelConfig,
  defaultFunnelSystem
};

export default enhancedFunnelSystemExports;