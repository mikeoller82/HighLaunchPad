// Deal and Pipeline Validation Utilities for Agentic AI CRM Platform

import {
  Deal,
  Pipeline,
  DealPredictions,
  RiskAssessment,
  ForecastingData,
  PipelineHealthMetrics,
  PipelineStage,
  DealStatus,
  RiskLevel,
  Priority
} from './crm-types';

import { ValidationHelpers } from './crm-validation';

// ============================================================================
// VALIDATION INTERFACES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  suggestion?: string;
}

// ============================================================================
// DEAL VALIDATION
// ============================================================================

export class DealValidator {
  /**
   * Validates a complete deal object
   */
  static validateDeal(deal: Partial<Deal>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic Information Validation
    this.validateBasicInfo(deal, errors);
    
    // Financial Validation
    this.validateFinancialData(deal, errors, warnings);
    
    // Pipeline Validation
    this.validatePipelineData(deal, errors, warnings);
    
    // AI Predictions Validation - aiPredictions stored in customFields
    if (deal.customFields?.aiPredictions) {
      this.validateAIPredictions(deal.customFields.aiPredictions, errors, warnings);
    }
    
    // Risk Assessment Validation - riskAssessment stored in customFields
    if (deal.customFields?.riskAssessment) {
      this.validateRiskAssessment(deal.customFields.riskAssessment, errors, warnings);
    }
    
    // Forecasting Data Validation - forecastingData not part of Deal interface, skipping validation

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static validateBasicInfo(deal: Partial<Deal>, errors: ValidationError[]): void {
    if (!deal.title || deal.title.trim().length === 0) {
      errors.push({
        field: 'title',
        message: 'Deal title is required',
        code: 'DEAL_NAME_REQUIRED',
        severity: 'error'
      });
    }

    if (!deal.assignedTo || deal.assignedTo.trim().length === 0) {
      errors.push({
        field: 'assignedTo',
        message: 'Deal must be assigned to someone',
        code: 'DEAL_OWNER_REQUIRED',
        severity: 'error'
      });
    }

    if (!deal.currency || deal.currency.trim().length === 0) {
      errors.push({
        field: 'currency',
        message: 'Currency is required',
        code: 'DEAL_CURRENCY_REQUIRED',
        severity: 'error'
      });
    }
  }

  private static validateFinancialData(
    deal: Partial<Deal>, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    if (deal.value !== undefined) {
      if (deal.value < 0) {
        errors.push({
          field: 'value',
          message: 'Deal value cannot be negative',
          code: 'DEAL_VALUE_NEGATIVE',
          severity: 'error'
        });
      }

      if (deal.value === 0) {
        warnings.push({
          field: 'value',
          message: 'Deal value is zero',
          code: 'DEAL_VALUE_ZERO',
          suggestion: 'Consider setting an estimated deal value for better forecasting'
        });
      }

      if (deal.value > 10000000) { // $10M threshold
        warnings.push({
          field: 'value',
          message: 'Deal value is unusually high',
          code: 'DEAL_VALUE_HIGH',
          suggestion: 'Verify the deal value is correct'
        });
      }
    }

    // Discount validation - discount not part of Deal interface, skipping validation
  }

  private static validatePipelineData(
    deal: Partial<Deal>, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    if (deal.probability !== undefined) {
      if (deal.probability < 0 || deal.probability > 100) {
        errors.push({
          field: 'probability',
          message: 'Probability must be between 0 and 100',
          code: 'DEAL_PROBABILITY_RANGE',
          severity: 'error'
        });
      }
    }

    if (deal.expectedCloseDate) {
      const today = new Date();
      const closeDate = new Date(deal.expectedCloseDate);
      
      if (closeDate < today) {
        warnings.push({
          field: 'expectedCloseDate',
          message: 'Expected close date is in the past',
          code: 'DEAL_CLOSE_DATE_PAST',
          suggestion: 'Update the expected close date or move to appropriate stage'
        });
      }

      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      if (closeDate > oneYearFromNow) {
        warnings.push({
          field: 'expectedCloseDate',
          message: 'Expected close date is more than a year away',
          code: 'DEAL_CLOSE_DATE_FAR',
          suggestion: 'Consider if this timeline is realistic'
        });
      }
    }

    // Stage and status consistency validation - PipelineStage is interface not enum, using string comparison
    if (deal.stage && deal.status) {
      if ((deal.stage.id === 'closed-won' && deal.status !== DealStatus.WON) ||
          (deal.stage.id === 'closed-lost' && deal.status !== DealStatus.LOST)) {
        errors.push({
          field: 'stage',
          message: 'Deal stage and status are inconsistent',
          code: 'DEAL_STAGE_STATUS_MISMATCH',
          severity: 'error'
        });
      }
    }
  }

  private static validateAIPredictions(
    predictions: DealPredictions, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    // Validate winProbability (exists in DealPredictions interface)
    if (predictions.winProbability < 0 || predictions.winProbability > 1) {
      errors.push({
        field: 'aiPredictions.winProbability',
        message: 'Win probability must be between 0 and 1',
        code: 'PREDICTION_PROBABILITY_RANGE',
        severity: 'error'
      });
    }

    // Validate confidence (exists in DealPredictions interface)
    if (predictions.confidence < 0 || predictions.confidence > 1) {
      errors.push({
        field: 'aiPredictions.confidence',
        message: 'Confidence must be between 0 and 1',
        code: 'PREDICTION_CONFIDENCE_RANGE',
        severity: 'error'
      });
    }

    // Validate expectedCloseDate (exists in DealPredictions interface)
    if (predictions.expectedCloseDate && !ValidationHelpers.isValidDate(predictions.expectedCloseDate)) {
      errors.push({
        field: 'aiPredictions.expectedCloseDate',
        message: 'Expected close date must be a valid date',
        code: 'PREDICTION_DATE_INVALID',
        severity: 'error'
      });
    }

    // Validate riskFactors array (exists in DealPredictions interface)
    if (predictions.riskFactors && !Array.isArray(predictions.riskFactors)) {
      errors.push({
        field: 'aiPredictions.riskFactors',
        message: 'Risk factors must be an array',
        code: 'PREDICTION_RISK_FACTORS_INVALID',
        severity: 'error'
      });
    }

    // Validate recommendations array (exists in DealPredictions interface)
    if (predictions.recommendations && !Array.isArray(predictions.recommendations)) {
      errors.push({
        field: 'aiPredictions.recommendations',
        message: 'Recommendations must be an array',
        code: 'PREDICTION_RECOMMENDATIONS_INVALID',
        severity: 'error'
      });
    }

    // Validate generatedAt date (exists in DealPredictions interface)
    if (predictions.generatedAt && !ValidationHelpers.isValidDate(predictions.generatedAt)) {
      errors.push({
        field: 'aiPredictions.generatedAt',
        message: 'Generated date must be a valid date',
        code: 'PREDICTION_GENERATED_DATE_INVALID',
        severity: 'error'
      });
    }
  }

  private static validateRiskAssessment(
    riskAssessment: RiskAssessment, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    // Validate riskLevel (exists in RiskAssessment interface)
    if (riskAssessment.riskLevel && !ValidationHelpers.isValidEnum(riskAssessment.riskLevel, RiskLevel)) {
      errors.push({
        field: 'riskAssessment.riskLevel',
        message: 'Invalid risk level',
        code: 'RISK_LEVEL_INVALID',
        severity: 'error'
      });
    }

    // Validate risk factors array (exists in RiskAssessment interface)
    if (riskAssessment.riskFactors && Array.isArray(riskAssessment.riskFactors)) {
      riskAssessment.riskFactors.forEach((factor, index) => {
        // Validate severity (exists in RiskFactor interface)
        if (typeof factor.severity === 'number' && (factor.severity < 0 || factor.severity > 1)) {
          errors.push({
            field: `riskAssessment.riskFactors[${index}].severity`,
            message: 'Risk factor severity must be between 0 and 1',
            code: 'RISK_FACTOR_SEVERITY_RANGE',
            severity: 'error'
          });
        }

        // Validate required fields in RiskFactor
        if (!factor.type || !ValidationHelpers.isNonEmptyString(factor.type)) {
          errors.push({
            field: `riskAssessment.riskFactors[${index}].type`,
            message: 'Risk factor type is required',
            code: 'RISK_FACTOR_TYPE_REQUIRED',
            severity: 'error'
          });
        }

        if (!factor.description || !ValidationHelpers.isNonEmptyString(factor.description)) {
          errors.push({
            field: `riskAssessment.riskFactors[${index}].description`,
            message: 'Risk factor description is required',
            code: 'RISK_FACTOR_DESCRIPTION_REQUIRED',
            severity: 'error'
          });
        }
      });
    }

    // Validate mitigation array (exists in RiskAssessment interface)
    if (riskAssessment.mitigation && !Array.isArray(riskAssessment.mitigation)) {
      errors.push({
        field: 'riskAssessment.mitigation',
        message: 'Mitigation must be an array',
        code: 'RISK_MITIGATION_INVALID',
        severity: 'error'
      });
    }

    // Validate assessedAt date (exists in RiskAssessment interface)
    if (riskAssessment.assessedAt && !ValidationHelpers.isValidDate(riskAssessment.assessedAt)) {
      errors.push({
        field: 'riskAssessment.assessedAt',
        message: 'Assessed date must be a valid date',
        code: 'RISK_ASSESSED_DATE_INVALID',
        severity: 'error'
      });
    }

    // Check for high-risk deals without mitigation strategies
    if (riskAssessment.riskLevel === RiskLevel.HIGH || riskAssessment.riskLevel === RiskLevel.CRITICAL) {
      if (!riskAssessment.mitigation || riskAssessment.mitigation.length === 0) {
        warnings.push({
          field: 'riskAssessment.mitigation',
          message: 'High-risk deal should have mitigation strategies',
          code: 'HIGH_RISK_NO_MITIGATION',
          suggestion: 'Add mitigation strategies to address identified risks'
        });
      }
    }
  }

  private static validateForecastingData(
    forecastingData: ForecastingData, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    // Validate totalValue (exists in ForecastingData interface)
    if (forecastingData.totalValue < 0) {
      errors.push({
        field: 'forecastingData.totalValue',
        message: 'Total value cannot be negative',
        code: 'FORECAST_TOTAL_VALUE_NEGATIVE',
        severity: 'error'
      });
    }

    // Validate dealCount (exists in ForecastingData interface)
    if (forecastingData.dealCount < 0) {
      errors.push({
        field: 'forecastingData.dealCount',
        message: 'Deal count cannot be negative',
        code: 'FORECAST_DEAL_COUNT_NEGATIVE',
        severity: 'error'
      });
    }

    // Validate winRate (exists in ForecastingData interface)
    if (forecastingData.winRate < 0 || forecastingData.winRate > 1) {
      errors.push({
        field: 'forecastingData.winRate',
        message: 'Win rate must be between 0 and 1',
        code: 'FORECAST_WIN_RATE_RANGE',
        severity: 'error'
      });
    }

    // Validate averageDealSize (exists in ForecastingData interface)
    if (forecastingData.averageDealSize < 0) {
      errors.push({
        field: 'forecastingData.averageDealSize',
        message: 'Average deal size cannot be negative',
        code: 'FORECAST_AVERAGE_DEAL_SIZE_NEGATIVE',
        severity: 'error'
      });
    }

    // Validate pipeline array (exists in ForecastingData interface)
    if (forecastingData.pipeline && !Array.isArray(forecastingData.pipeline)) {
      errors.push({
        field: 'forecastingData.pipeline',
        message: 'Pipeline must be an array of deals',
        code: 'FORECAST_PIPELINE_INVALID',
        severity: 'error'
      });
    }
  }
}

// ============================================================================
// PIPELINE VALIDATION
// ============================================================================

export class PipelineValidator {
  /**
   * Validates a complete pipeline object
   */
  static validatePipeline(pipeline: Partial<Pipeline>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic Information Validation
    this.validateBasicInfo(pipeline, errors);
    
    // Stages Validation
    if (pipeline.stages) {
      this.validateStages(pipeline.stages, errors, warnings);
    }
    
    // Health Metrics Validation
    if (pipeline.healthMetrics) {
      this.validateHealthMetrics(pipeline.healthMetrics, errors, warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static validateBasicInfo(pipeline: Partial<Pipeline>, errors: ValidationError[]): void {
    if (!pipeline.name || pipeline.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Pipeline name is required',
        code: 'PIPELINE_NAME_REQUIRED',
        severity: 'error'
      });
    }

    if (!pipeline.createdBy || pipeline.createdBy.trim().length === 0) {
      errors.push({
        field: 'createdBy',
        message: 'Pipeline creator is required',
        code: 'PIPELINE_CREATOR_REQUIRED',
        severity: 'error'
      });
    }
  }

  private static validateStages(
    stages: any[], 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    if (stages.length === 0) {
      errors.push({
        field: 'stages',
        message: 'Pipeline must have at least one stage',
        code: 'PIPELINE_NO_STAGES',
        severity: 'error'
      });
      return;
    }

    // Check for duplicate stage orders
    const orders = stages.map(s => s.order);
    const duplicateOrders = orders.filter((order, index) => orders.indexOf(order) !== index);
    
    if (duplicateOrders.length > 0) {
      errors.push({
        field: 'stages',
        message: 'Duplicate stage orders found',
        code: 'PIPELINE_DUPLICATE_ORDERS',
        severity: 'error'
      });
    }

    // Validate individual stages
    stages.forEach((stage, index) => {
      // Validate required fields that exist in PipelineStage interface
      if (!stage.id || !ValidationHelpers.isNonEmptyString(stage.id)) {
        errors.push({
          field: `stages[${index}].id`,
          message: 'Stage ID is required',
          code: 'STAGE_ID_REQUIRED',
          severity: 'error'
        });
      }

      if (!stage.name || !ValidationHelpers.isNonEmptyString(stage.name)) {
        errors.push({
          field: `stages[${index}].name`,
          message: 'Stage name is required',
          code: 'STAGE_NAME_REQUIRED',
          severity: 'error'
        });
      }

      if (!stage.color || !ValidationHelpers.isNonEmptyString(stage.color)) {
        errors.push({
          field: `stages[${index}].color`,
          message: 'Stage color is required',
          code: 'STAGE_COLOR_REQUIRED',
          severity: 'error'
        });
      }

      if (typeof stage.order !== 'number' || stage.order < 0) {
        errors.push({
          field: `stages[${index}].order`,
          message: 'Stage order must be a non-negative number',
          code: 'STAGE_ORDER_INVALID',
          severity: 'error'
        });
      }
    });
  }

  private static validateHealthMetrics(
    healthMetrics: PipelineHealthMetrics, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    // Validate conversionRates (exists in PipelineHealthMetrics interface)
    if (healthMetrics.conversionRates) {
      Object.entries(healthMetrics.conversionRates).forEach(([stage, rate]) => {
        if (typeof rate === 'number' && (rate < 0 || rate > 1)) {
          errors.push({
            field: `healthMetrics.conversionRates.${stage}`,
            message: 'Conversion rate must be between 0 and 1',
            code: 'HEALTH_CONVERSION_RATE_RANGE',
            severity: 'error'
          });
        }
      });
    }

    // Validate averageTimeInStage (exists in PipelineHealthMetrics interface)
    if (healthMetrics.averageTimeInStage) {
      Object.entries(healthMetrics.averageTimeInStage).forEach(([stage, time]) => {
        if (typeof time === 'number' && time < 0) {
          errors.push({
            field: `healthMetrics.averageTimeInStage.${stage}`,
            message: 'Average time in stage cannot be negative',
            code: 'HEALTH_TIME_NEGATIVE',
            severity: 'error'
          });
        }

        // Warning for slow stages
        if (typeof time === 'number' && time > 90) { // More than 90 days
          warnings.push({
            field: `healthMetrics.averageTimeInStage.${stage}`,
            message: `Average time in ${stage} is very long (>90 days)`,
            code: 'SLOW_STAGE_TIME',
            suggestion: 'Consider optimizing processes for this stage'
          });
        }
      });
    }

    // Validate bottlenecks array (exists in PipelineHealthMetrics interface)
    if (healthMetrics.bottlenecks && !Array.isArray(healthMetrics.bottlenecks)) {
      errors.push({
        field: 'healthMetrics.bottlenecks',
        message: 'Bottlenecks must be an array',
        code: 'HEALTH_BOTTLENECKS_INVALID',
        severity: 'error'
      });
    }

    // Warning for multiple bottlenecks
    if (healthMetrics.bottlenecks && healthMetrics.bottlenecks.length > 3) {
      warnings.push({
        field: 'healthMetrics.bottlenecks',
        message: 'Multiple bottlenecks detected in pipeline',
        code: 'MULTIPLE_BOTTLENECKS',
        suggestion: 'Address bottlenecks to improve pipeline flow'
      });
    }

    // Validate recommendations array (exists in PipelineHealthMetrics interface)
    if (healthMetrics.recommendations && !Array.isArray(healthMetrics.recommendations)) {
      errors.push({
        field: 'healthMetrics.recommendations',
        message: 'Recommendations must be an array',
        code: 'HEALTH_RECOMMENDATIONS_INVALID',
        severity: 'error'
      });
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validates deal data quality and completeness
 */
export function validateDealDataQuality(deal: Partial<Deal>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check required fields for data completeness
  const requiredFields = ['title', 'assignedTo', 'value', 'currency', 'expectedCloseDate', 'stage'];
  const missingFields = requiredFields.filter(field => !deal[field as keyof Deal]);

  if (missingFields.length > 0) {
    warnings.push({
      field: 'dataCompleteness',
      message: `Missing recommended fields: ${missingFields.join(', ')}`,
      code: 'DEAL_INCOMPLETE_DATA',
      suggestion: 'Complete missing fields for better AI predictions and reporting'
    });
  }

  // Check for data freshness
  if (deal.updatedAt) {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceUpdate > 30) {
      warnings.push({
        field: 'updatedAt',
        message: 'Deal data is stale (not updated in 30+ days)',
        code: 'DEAL_STALE_DATA',
        suggestion: 'Update deal information to ensure accuracy'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates pipeline health and performance metrics
 */
export function validatePipelineHealth(pipeline: Pipeline): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const { healthMetrics } = pipeline;

  if (!healthMetrics) {
    warnings.push({
      field: 'healthMetrics',
      message: 'Pipeline health metrics are missing',
      code: 'HEALTH_METRICS_MISSING',
      suggestion: 'Add health metrics to monitor pipeline performance'
    });
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Validate conversionRates (exists in PipelineHealthMetrics interface)
  if (healthMetrics.conversionRates) {
    Object.entries(healthMetrics.conversionRates).forEach(([stage, rate]) => {
      if (typeof rate === 'number' && (rate < 0 || rate > 1)) {
        errors.push({
          field: `healthMetrics.conversionRates.${stage}`,
          message: 'Conversion rate must be between 0 and 1',
          code: 'CONVERSION_RATE_RANGE',
          severity: 'error'
        });
      }
    });
  }

  // Validate averageTimeInStage (exists in PipelineHealthMetrics interface)
  if (healthMetrics.averageTimeInStage) {
    Object.entries(healthMetrics.averageTimeInStage).forEach(([stage, time]) => {
      if (typeof time === 'number' && time < 0) {
        errors.push({
          field: `healthMetrics.averageTimeInStage.${stage}`,
          message: 'Average time in stage cannot be negative',
          code: 'AVERAGE_TIME_NEGATIVE',
          severity: 'error'
        });
      }

      if (typeof time === 'number' && time > 365) { // More than a year
        warnings.push({
          field: `healthMetrics.averageTimeInStage.${stage}`,
          message: `Average time in ${stage} is very long (>365 days)`,
          code: 'SLOW_STAGE_VELOCITY',
          suggestion: 'Review and optimize processes for this stage'
        });
      }
    });
  }

  // Validate bottlenecks array (exists in PipelineHealthMetrics interface)
  if (healthMetrics.bottlenecks && !Array.isArray(healthMetrics.bottlenecks)) {
    errors.push({
      field: 'healthMetrics.bottlenecks',
      message: 'Bottlenecks must be an array',
      code: 'BOTTLENECKS_INVALID',
      severity: 'error'
    });
  }

  // Validate recommendations array (exists in PipelineHealthMetrics interface)
  if (healthMetrics.recommendations && !Array.isArray(healthMetrics.recommendations)) {
    errors.push({
      field: 'healthMetrics.recommendations',
      message: 'Recommendations must be an array',
      code: 'RECOMMENDATIONS_INVALID',
      severity: 'error'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}