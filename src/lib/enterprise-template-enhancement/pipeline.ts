/**
 * Template Processing Pipeline
 * 
 * Core template enhancement engine with layered processing that preserves
 * existing template structure while systematically adding enterprise features.
 */

import type { Component, FunnelTemplate } from '../types';
import type { Template } from '../website-templates';
import type {
  EnhancedTemplate,
  EnhancedFunnelTemplate,
  TemplateEnhancementConfig,
  TemplateProcessingContext,
  ProcessingError,
  ProcessingWarning,
  EnhancementResult
} from './types';
import type {
  TemplateProcessingPipeline,
  ValidationResult,
  ProcessingReport,
  ProcessingStage,
  PerformanceMetrics
} from './interfaces';
import { enterpriseDesignEngine } from './enterprise-design-engine';

/**
 * Template Processing Pipeline Implementation
 * 
 * Orchestrates the enhancement process through multiple layers:
 * 1. Initialization - Validate and prepare template
 * 2. Enterprise Design - Apply professional design elements
 * 3. Gamification - Add interactive engagement elements
 * 4. Interactivity - Implement dynamic user experiences
 * 5. Functionality - Add conversion optimization features
 * 6. Personalization - Apply dynamic content rules
 * 7. Analytics - Integrate tracking and optimization
 * 8. Optimization - Performance and accessibility optimization
 * 9. Finalization - Final validation and cleanup
 */
export class TemplateProcessingPipelineImpl implements TemplateProcessingPipeline {
  private readonly processingStages: ProcessingStage[] = [
    'initialization',
    'enterprise_design',
    'gamification',
    'interactivity',
    'functionality',
    'personalization',
    'analytics',
    'optimization',
    'finalization'
  ];

  /**
   * Process a template through all enhancement layers
   */
  async processTemplate(
    template: Template | FunnelTemplate,
    config: TemplateEnhancementConfig
  ): Promise<EnhancementResult<EnhancedTemplate | EnhancedFunnelTemplate>> {
    const startTime = Date.now();
    const context: TemplateProcessingContext = {
      originalTemplate: template,
      enhancementConfig: config,
      processingStage: 'initialization',
      metadata: {
        startTime: new Date(startTime),
        processedComponents: 0,
        totalComponents: template.components.length,
        enhancementsApplied: [],
        performanceMetrics: this.initializePerformanceMetrics()
      },
      errors: [],
      warnings: []
    };

    try {
      // Validate template before processing
      const validationResult = await this.validateTemplate(template);
      if (!validationResult.valid) {
        return {
          success: false,
          errors: validationResult.errors.map(err => ({
            stage: 'initialization',
            code: err.code,
            message: err.message,
            componentId: err.field,
            severity: err.severity === 'error' ? 'high' : 'medium',
            timestamp: new Date()
          })),
          warnings: [],
          metadata: {
            processingTime: Date.now() - startTime,
            enhancementsApplied: [],
            performanceImpact: {
              loadTimeIncrease: 0,
              bundleSizeIncrease: 0,
              memoryUsageIncrease: 0,
              renderingComplexity: 'low',
              recommendations: ['Fix validation errors before processing']
            }
          }
        };
      }

      // Create enhanced template structure
      let enhancedTemplate = this.createEnhancedTemplate(template, config);

      // Process through each stage
      for (const stage of this.processingStages) {
        context.processingStage = stage;

        try {
          const stageResult = await this.processStage(enhancedTemplate, stage, context);

          if (!stageResult.success) {
            context.errors.push(...stageResult.errors);

            // Check if errors are critical
            const criticalErrors = stageResult.errors.filter(err => err.severity === 'critical');
            if (criticalErrors.length > 0) {
              context.processingStage = 'error';
              break;
            }
          }

          context.warnings.push(...stageResult.warnings);
          if (stageResult.data) {
            enhancedTemplate = stageResult.data as EnhancedTemplate | EnhancedFunnelTemplate;
          }

          // Update metadata
          context.metadata.enhancementsApplied.push(...(stageResult.metadata?.enhancementsApplied || []));

        } catch (error) {
          const processingError: ProcessingError = {
            stage,
            code: 'STAGE_PROCESSING_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error during stage processing',
            severity: 'critical',
            timestamp: new Date()
          };

          context.errors.push(processingError);
          context.processingStage = 'error';
          break;
        }
      }

      // Finalize processing
      const endTime = Date.now();
      context.metadata.endTime = new Date(endTime);
      context.metadata.duration = endTime - startTime;

      // Update performance metrics
      context.metadata.performanceMetrics = await this.calculatePerformanceMetrics(enhancedTemplate);

      const success = context.processingStage !== 'error' && context.errors.filter(e => e.severity === 'critical').length === 0;

      return {
        success,
        data: success ? enhancedTemplate : undefined,
        errors: context.errors,
        warnings: context.warnings,
        metadata: {
          processingTime: context.metadata.duration || 0,
          enhancementsApplied: context.metadata.enhancementsApplied,
          performanceImpact: this.calculatePerformanceImpact(context.metadata.performanceMetrics)
        }
      };

    } catch (error) {
      const processingError: ProcessingError = {
        stage: context.processingStage,
        code: 'PIPELINE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown pipeline error',
        severity: 'critical',
        timestamp: new Date()
      };

      return {
        success: false,
        errors: [processingError],
        warnings: context.warnings,
        metadata: {
          processingTime: Date.now() - startTime,
          enhancementsApplied: context.metadata.enhancementsApplied,
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: ['Fix pipeline errors before retrying']
          }
        }
      };
    }
  }

  /**
   * Process template through specific enhancement stage
   */
  async processStage(
    template: Template | FunnelTemplate,
    stage: ProcessingStage,
    context: TemplateProcessingContext
  ): Promise<EnhancementResult<Template | FunnelTemplate>> {
    const startTime = Date.now();
    const errors: ProcessingError[] = [];
    const warnings: ProcessingWarning[] = [];
    const enhancementsApplied: string[] = [];

    try {
      let processedTemplate = { ...template };

      switch (stage) {
        case 'initialization':
          processedTemplate = await this.processInitialization(template, context);
          enhancementsApplied.push('template_structure_validated');
          break;

        case 'enterprise_design':
          if (context.enhancementConfig.enabledFeatures.enterpriseDesign) {
            processedTemplate = await this.processEnterpriseDesign(template, context);
            enhancementsApplied.push('enterprise_design_applied');
          }
          break;

        case 'gamification':
          if (context.enhancementConfig.enabledFeatures.gamification) {
            processedTemplate = await this.processGamification(template, context);
            enhancementsApplied.push('gamification_elements_added');
          }
          break;

        case 'interactivity':
          if (context.enhancementConfig.enabledFeatures.interactivity) {
            processedTemplate = await this.processInteractivity(template, context);
            enhancementsApplied.push('interactive_components_enhanced');
          }
          break;

        case 'functionality':
          processedTemplate = await this.processFunctionality(template, context);
          enhancementsApplied.push('functional_features_integrated');
          break;

        case 'personalization':
          if (context.enhancementConfig.enabledFeatures.personalization) {
            processedTemplate = await this.processPersonalization(template, context);
            enhancementsApplied.push('personalization_rules_applied');
          }
          break;

        case 'analytics':
          if (context.enhancementConfig.enabledFeatures.analytics) {
            processedTemplate = await this.processAnalytics(template, context);
            enhancementsApplied.push('analytics_tracking_integrated');
          }
          break;

        case 'optimization':
          processedTemplate = await this.processOptimization(template, context);
          enhancementsApplied.push('performance_optimized');
          break;

        case 'finalization':
          processedTemplate = await this.processFinalization(template, context);
          enhancementsApplied.push('template_finalized');
          break;

        default:
          warnings.push({
            stage,
            code: 'UNKNOWN_STAGE',
            message: `Unknown processing stage: ${stage}`,
            recommendation: 'Skip unknown stage',
            timestamp: new Date()
          });
      }

      return {
        success: true,
        data: processedTemplate,
        errors,
        warnings,
        metadata: {
          processingTime: Date.now() - startTime,
          enhancementsApplied,
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: []
          }
        }
      };

    } catch (error) {
      errors.push({
        stage,
        code: 'STAGE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown stage error',
        severity: 'high',
        timestamp: new Date()
      });

      return {
        success: false,
        errors,
        warnings,
        metadata: {
          processingTime: Date.now() - startTime,
          enhancementsApplied,
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: [`Fix errors in ${stage} stage`]
          }
        }
      };
    }
  }

  /**
   * Validate template structure before processing
   */
  async validateTemplate(template: Template | FunnelTemplate): Promise<ValidationResult> {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Basic structure validation
    if (!template.id) {
      errors.push({
        code: 'MISSING_ID',
        message: 'Template must have an ID',
        field: 'id',
        severity: 'error'
      });
    }

    if (!template.title) {
      errors.push({
        code: 'MISSING_TITLE',
        message: 'Template must have a title',
        field: 'title',
        severity: 'error'
      });
    }

    if (!template.components || !Array.isArray(template.components)) {
      errors.push({
        code: 'INVALID_COMPONENTS',
        message: 'Template must have a valid components array',
        field: 'components',
        severity: 'error'
      });
    } else {
      // Validate components
      template.components.forEach((component, index) => {
        if (!component.id) {
          errors.push({
            code: 'MISSING_COMPONENT_ID',
            message: `Component at index ${index} must have an ID`,
            field: `components[${index}].id`,
            severity: 'error'
          });
        }

        if (!component.type) {
          errors.push({
            code: 'MISSING_COMPONENT_TYPE',
            message: `Component at index ${index} must have a type`,
            field: `components[${index}].type`,
            severity: 'error'
          });
        }

        if (!component.content) {
          warnings.push({
            code: 'MISSING_COMPONENT_CONTENT',
            message: `Component at index ${index} has no content`,
            field: `components[${index}].content`,
            recommendation: 'Add content to component for better enhancement results'
          });
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Optimize template performance after enhancement
   */
  async optimizePerformance(
    template: EnhancedTemplate | EnhancedFunnelTemplate
  ): Promise<EnhancementResult<EnhancedTemplate | EnhancedFunnelTemplate>> {
    const startTime = Date.now();
    const optimizedTemplate = { ...template };
    const enhancementsApplied: string[] = [];

    try {
      // Optimize images and assets
      optimizedTemplate.components = await this.optimizeAssets(template.components);
      enhancementsApplied.push('assets_optimized');

      // Optimize animations for performance
      if (optimizedTemplate.interactiveComponents?.animations) {
        optimizedTemplate.interactiveComponents.animations = this.optimizeAnimations(
          optimizedTemplate.interactiveComponents.animations
        );
        enhancementsApplied.push('animations_optimized');
      }

      // Optimize CSS and styles
      optimizedTemplate.components = this.optimizeStyles(optimizedTemplate.components);
      enhancementsApplied.push('styles_optimized');

      // Add lazy loading where appropriate
      optimizedTemplate.components = this.addLazyLoading(optimizedTemplate.components);
      enhancementsApplied.push('lazy_loading_added');

      return {
        success: true,
        data: optimizedTemplate,
        errors: [],
        warnings: [],
        metadata: {
          processingTime: Date.now() - startTime,
          enhancementsApplied,
          performanceImpact: {
            loadTimeIncrease: -10, // Performance optimization should reduce load time
            bundleSizeIncrease: 0,
            memoryUsageIncrease: -5,
            renderingComplexity: 'low',
            recommendations: ['Performance optimizations applied successfully']
          }
        }
      };

    } catch (error) {
      return {
        success: false,
        errors: [{
          stage: 'optimization',
          code: 'OPTIMIZATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown optimization error',
          severity: 'medium',
          timestamp: new Date()
        }],
        warnings: [],
        metadata: {
          processingTime: Date.now() - startTime,
          enhancementsApplied,
          performanceImpact: {
            loadTimeIncrease: 0,
            bundleSizeIncrease: 0,
            memoryUsageIncrease: 0,
            renderingComplexity: 'low',
            recommendations: ['Fix optimization errors']
          }
        }
      };
    }
  }

  /**
   * Generate processing report
   */
  generateReport(context: TemplateProcessingContext): ProcessingReport {
    // Handle special stages that aren't in the standard processing pipeline
    const stageIndex = this.processingStages.indexOf(context.processingStage as ProcessingStage);
    const completedStages = stageIndex >= 0
      ? this.processingStages.slice(0, stageIndex + 1)
      : this.processingStages; // If stage not found (e.g., 'error', 'complete'), include all stages

    // Convert errors and warnings to compatible format
    const compatibleErrors = context.errors
      .filter(error => this.processingStages.includes(error.stage as ProcessingStage))
      .map(error => ({
        stage: error.stage as ProcessingStage,
        code: error.code,
        message: error.message,
        severity: error.severity
      }));

    const compatibleWarnings = context.warnings
      .filter(warning => this.processingStages.includes(warning.stage as ProcessingStage))
      .map(warning => ({
        stage: warning.stage as ProcessingStage,
        code: warning.code,
        message: warning.message,
        recommendation: warning.recommendation
      }));

    return {
      templateId: context.originalTemplate.id,
      processingTime: context.metadata.duration || 0,
      stagesCompleted: completedStages,
      enhancementsApplied: context.metadata.enhancementsApplied,
      errors: compatibleErrors,
      warnings: compatibleWarnings,
      performanceMetrics: context.metadata.performanceMetrics,
      recommendations: this.generateRecommendations(context)
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Create enhanced template structure from base template
   */
  private createEnhancedTemplate(
    template: Template | FunnelTemplate,
    config: TemplateEnhancementConfig
  ): EnhancedTemplate | EnhancedFunnelTemplate {
    const baseEnhanced = {
      ...template,
      enhancementConfig: config,
      enterpriseFeatures: {
        trustSignals: [],
        professionalAssets: [],
        brandElements: [],
        designEnhancements: []
      },
      gamificationElements: {
        progressTrackers: [],
        achievements: [],
        rewards: [],
        engagementFeatures: []
      },
      interactiveComponents: {
        animations: [],
        dynamicContent: [],
        interactions: [],
        mediaEnhancements: []
      },
      functionalFeatures: {
        conversionElements: [],
        testingConfig: {
          id: `test_${template.id}`,
          name: `A/B Test for ${template.title}`,
          description: 'Automated A/B test configuration',
          status: 'draft' as const,
          variants: [],
          trafficSplit: {},
          conversionGoal: {
            id: 'default_goal',
            name: 'Default Conversion',
            type: 'click' as const,
            target: '.cta-button'
          },
          minSampleSize: 100,
          confidenceLevel: 95
        },
        leadMagnets: [],
        automationTriggers: []
      },
      personalization: {
        rules: [],
        segments: [],
        dynamicContent: [],
        behaviorTracking: {
          trackPageViews: true,
          trackClicks: true,
          trackScrollDepth: true,
          trackTimeOnPage: true,
          trackFormInteractions: true,
          customEvents: []
        }
      },
      analytics: {
        conversionGoals: [],
        enabled: true,
        providers: [],
        trackingId: '',
        batchSize: 100,
        autoTrack: {
          pageViews: true,
          clicks: true,
          formSubmissions: true
        },
        goals: [],
        dashboards: [],
        reports: [],
        realTimeTracking: true
      }
    };

    return baseEnhanced as EnhancedTemplate | EnhancedFunnelTemplate;
  }

  /**
   * Initialize performance metrics
   */
  private initializePerformanceMetrics(): PerformanceMetrics {
    return {
      loadTime: 0,
      renderTime: 0,
      bundleSize: 0,
      memoryUsage: 0,
      interactivityScore: 0
    };
  }

  /**
   * Calculate performance metrics for enhanced template
   */
  private async calculatePerformanceMetrics(
    template: EnhancedTemplate | EnhancedFunnelTemplate
  ): Promise<PerformanceMetrics> {
    // Simulate performance calculation based on template complexity
    const componentCount = template.components.length;
    const animationCount = template.interactiveComponents?.animations?.length || 0;
    const interactionCount = template.interactiveComponents?.interactions?.length || 0;

    return {
      loadTime: Math.max(500, componentCount * 50 + animationCount * 20),
      renderTime: Math.max(100, componentCount * 10 + interactionCount * 15),
      bundleSize: Math.max(50, componentCount * 5 + animationCount * 10),
      memoryUsage: Math.max(20, componentCount * 2 + interactionCount * 5),
      interactivityScore: Math.min(100, Math.max(0, 100 - (animationCount * 5) - (interactionCount * 3)))
    };
  }

  /**
   * Calculate performance impact
   */
  private calculatePerformanceImpact(metrics: PerformanceMetrics): any {
    const baseLoadTime = 1000; // Baseline load time
    const loadTimeIncrease = ((metrics.loadTime - baseLoadTime) / baseLoadTime) * 100;

    return {
      loadTimeIncrease: Math.round(loadTimeIncrease),
      bundleSizeIncrease: Math.round(metrics.bundleSize / 10), // Rough estimate based on bundle size
      memoryUsageIncrease: Math.round(metrics.memoryUsage / 5), // Rough estimate based on memory usage
      renderingComplexity: metrics.interactivityScore < 50 ? 'high' :
        metrics.interactivityScore < 75 ? 'medium' : 'low',
      recommendations: this.generatePerformanceRecommendations(metrics)
    };
  }

  /**
   * Generate performance recommendations
   */
  private generatePerformanceRecommendations(metrics: PerformanceMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.loadTime > 2000) {
      recommendations.push('Consider reducing the number of components or optimizing assets');
    }

    if (metrics.renderTime > 1000) {
      recommendations.push('Reduce animation complexity or implement lazy loading for interactions');
    }

    if (metrics.bundleSize > 500) {
      recommendations.push('Consider code splitting or reducing bundle size');
    }

    if (metrics.memoryUsage > 100) {
      recommendations.push('Optimize memory usage by reducing component complexity');
    }

    if (metrics.interactivityScore < 50) {
      recommendations.push('Optimize layout stability by reserving space for dynamic content');
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance metrics are within acceptable ranges');
    }

    return recommendations;
  }

  /**
   * Generate general recommendations based on processing context
   */
  private generateRecommendations(context: TemplateProcessingContext): string[] {
    const recommendations: string[] = [];

    if (context.errors.length > 0) {
      recommendations.push('Address processing errors to improve template quality');
    }

    if (context.warnings.length > 0) {
      recommendations.push('Review warnings for potential improvements');
    }

    if (context.metadata.enhancementsApplied.length < 3) {
      recommendations.push('Consider enabling more enhancement features for better results');
    }

    return recommendations;
  }

  // Stage processing methods (placeholder implementations)
  private async processInitialization(template: Template | FunnelTemplate, context: TemplateProcessingContext): Promise<Template | FunnelTemplate> {
    // Validate and prepare template structure
    return { ...template };
  }

  private async processEnterpriseDesign(template: Template | FunnelTemplate, context: TemplateProcessingContext): Promise<Template | FunnelTemplate> {
    try {
      // Apply enterprise design enhancements using the enterprise design engine
      const enhancementResult = await enterpriseDesignEngine.enhanceTemplate(template, context.enhancementConfig);

      if (enhancementResult.success && enhancementResult.data) {
        // Add any errors or warnings from the enhancement process
        if (enhancementResult.errors.length > 0) {
          context.errors.push(...enhancementResult.errors);
        }
        if (enhancementResult.warnings.length > 0) {
          context.warnings.push(...enhancementResult.warnings);
        }

        // Update metadata with enhancements applied
        context.metadata.enhancementsApplied.push(...enhancementResult.metadata.enhancementsApplied);

        return enhancementResult.data;
      } else {
        // If enhancement failed, add errors to context and return original template
        context.errors.push(...enhancementResult.errors);
        context.warnings.push(...enhancementResult.warnings);
        return { ...template };
      }
    } catch (error) {
      // Handle any unexpected errors
      context.errors.push({
        stage: 'enterprise_design',
        code: 'ENTERPRISE_DESIGN_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error in enterprise design processing',
        severity: 'high',
        timestamp: new Date()
      });
      return { ...template };
    }
  }

  private async processGamification(template: Template | FunnelTemplate, context: TemplateProcessingContext): Promise<Template | FunnelTemplate> {
    // Add gamification elements
    return { ...template };
  }

  private async processInteractivity(template: Template | FunnelTemplate, context: TemplateProcessingContext): Promise<Template | FunnelTemplate> {
    // Enhance with interactive components
    return { ...template };
  }

  private async processFunctionality(template: Template | FunnelTemplate, context: TemplateProcessingContext): Promise<Template | FunnelTemplate> {
    // Add functional features
    return { ...template };
  }

  private async processPersonalization(template: Template | FunnelTemplate, context: TemplateProcessingContext): Promise<Template | FunnelTemplate> {
    // Apply personalization rules
    return { ...template };
  }

  private async processAnalytics(template: Template | FunnelTemplate, context: TemplateProcessingContext): Promise<Template | FunnelTemplate> {
    // Integrate analytics tracking
    return { ...template };
  }

  private async processOptimization(template: Template | FunnelTemplate, context: TemplateProcessingContext): Promise<Template | FunnelTemplate> {
    // Optimize performance
    return { ...template };
  }

  private async processFinalization(template: Template | FunnelTemplate, context: TemplateProcessingContext): Promise<Template | FunnelTemplate> {
    // Final validation and cleanup
    return { ...template };
  }

  // Optimization helper methods (placeholder implementations)
  private async optimizeAssets(components: Component[]): Promise<Component[]> {
    return components.map(component => ({
      ...component,
      // Add asset optimization logic here
    }));
  }

  private optimizeAnimations(animations: any[]): any[] {
    return animations.map(animation => ({
      ...animation,
      // Add animation optimization logic here
    }));
  }

  private optimizeStyles(components: Component[]): Component[] {
    return components.map(component => ({
      ...component,
      // Add style optimization logic here
    }));
  }

  private addLazyLoading(components: Component[]): Component[] {
    return components.map(component => ({
      ...component,
      // Add lazy loading logic here
    }));
  }
}

/**
 * Factory function to create template processing pipeline
 */
export function createTemplateProcessingPipeline(): TemplateProcessingPipeline {
  return new TemplateProcessingPipelineImpl();
}

/**
 * Default pipeline instance
 */
export const templateProcessingPipeline = createTemplateProcessingPipeline();