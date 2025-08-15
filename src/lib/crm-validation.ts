// Data Validation Utilities for CRM Models

import {
  Lead,
  Customer,
  Interaction,
  LeadSource,
  LeadStatus,
  QualificationStatus,
  CustomerSegment,
  InteractionType,
  CommunicationChannel,
  JourneyStage,
  Priority
} from './crm-types';

// ============================================================================
// VALIDATION ERROR TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ============================================================================
// BASIC VALIDATION HELPERS
// ============================================================================

export const ValidationHelpers = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidScore: (score: number, min: number = 0, max: number = 100): boolean => {
    return typeof score === 'number' && score >= min && score <= max && !isNaN(score) && isFinite(score);
  },

  isValidProbability: (probability: number): boolean => {
    return typeof probability === 'number' && probability >= 0 && probability <= 1 && !isNaN(probability);
  },

  isValidDate: (date: Date): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  },

  isValidEnum: <T>(value: any, enumObject: Record<string, T>): boolean => {
    return Object.values(enumObject).includes(value);
  },

  isNonEmptyString: (value: string): boolean => {
    return typeof value === 'string' && value.trim().length > 0;
  },

  isValidArray: (value: any, minLength: number = 0): boolean => {
    return Array.isArray(value) && value.length >= minLength;
  }
};

// ============================================================================
// LEAD VALIDATION
// ============================================================================

export class LeadValidator {
  static validate(lead: Partial<Lead>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Required fields validation
    if (!lead.id || !ValidationHelpers.isNonEmptyString(lead.id)) {
      errors.push({
        field: 'id',
        message: 'Lead ID is required and must be a non-empty string',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!lead.firstName || !ValidationHelpers.isNonEmptyString(lead.firstName)) {
      errors.push({
        field: 'firstName',
        message: 'First name is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!lead.lastName || !ValidationHelpers.isNonEmptyString(lead.lastName)) {
      errors.push({
        field: 'lastName',
        message: 'Last name is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!lead.email || !ValidationHelpers.isValidEmail(lead.email)) {
      errors.push({
        field: 'email',
        message: 'Valid email address is required',
        code: 'INVALID_EMAIL',
        value: lead.email
      });
    }

    // Optional phone validation
    if (lead.phone && !ValidationHelpers.isValidPhone(lead.phone)) {
      warnings.push({
        field: 'phone',
        message: 'Phone number format appears invalid',
        code: 'INVALID_PHONE',
        value: lead.phone
      });
    }

    // Enum validations
    if (lead.source && !ValidationHelpers.isValidEnum(lead.source, LeadSource)) {
      errors.push({
        field: 'source',
        message: 'Invalid lead source',
        code: 'INVALID_ENUM',
        value: lead.source
      });
    }

    if (lead.status && !ValidationHelpers.isValidEnum(lead.status, LeadStatus)) {
      errors.push({
        field: 'status',
        message: 'Invalid lead status',
        code: 'INVALID_ENUM',
        value: lead.status
      });
    }

    if (lead.qualification && !ValidationHelpers.isValidEnum(lead.qualification, QualificationStatus)) {
      errors.push({
        field: 'qualification',
        message: 'Invalid qualification status',
        code: 'INVALID_ENUM',
        value: lead.qualification
      });
    }

    if (lead.journeyStage && !ValidationHelpers.isValidEnum(lead.journeyStage, JourneyStage)) {
      errors.push({
        field: 'journeyStage',
        message: 'Invalid journey stage',
        code: 'INVALID_ENUM',
        value: lead.journeyStage
      });
    }

    // Score validation
    if (lead.score) {
      this.validateLeadScore(lead.score, errors, warnings);
    }

    // Engagement score validation
    if (lead.engagementScore !== undefined && !ValidationHelpers.isValidScore(lead.engagementScore)) {
      errors.push({
        field: 'engagementScore',
        message: 'Engagement score must be between 0 and 100',
        code: 'INVALID_SCORE',
        value: lead.engagementScore
      });
    }

    // Conversion probability validation
    if (lead.conversionProbability !== undefined && !ValidationHelpers.isValidProbability(lead.conversionProbability)) {
      errors.push({
        field: 'conversionProbability',
        message: 'Conversion probability must be between 0 and 1',
        code: 'INVALID_PROBABILITY',
        value: lead.conversionProbability
      });
    }

    // Date validations
    if (lead.createdAt && !ValidationHelpers.isValidDate(lead.createdAt)) {
      errors.push({
        field: 'createdAt',
        message: 'Invalid created date',
        code: 'INVALID_DATE',
        value: lead.createdAt
      });
    }

    if (lead.updatedAt && !ValidationHelpers.isValidDate(lead.updatedAt)) {
      errors.push({
        field: 'updatedAt',
        message: 'Invalid updated date',
        code: 'INVALID_DATE',
        value: lead.updatedAt
      });
    }

    // Business logic validations
    if (lead.createdAt && lead.updatedAt && lead.createdAt > lead.updatedAt) {
      errors.push({
        field: 'updatedAt',
        message: 'Updated date cannot be before created date',
        code: 'INVALID_DATE_SEQUENCE'
      });
    }

    // Data quality validation
    if (lead.dataQuality) {
      this.validateDataQuality(lead.dataQuality, errors, warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static validateLeadScore(score: any, errors: ValidationError[], warnings: ValidationError[]): void {
    if (score.total === undefined || score.total === null || !ValidationHelpers.isValidScore(score.total)) {
      errors.push({
        field: 'score.total',
        message: 'Total score must be between 0 and 100',
        code: 'INVALID_SCORE',
        value: score.total
      });
    }

    const scoreComponents = ['demographic', 'behavioral', 'engagement', 'firmographic'];
    scoreComponents.forEach(component => {
      if (score[component] !== undefined && !ValidationHelpers.isValidScore(score[component])) {
        errors.push({
          field: `score.${component}`,
          message: `${component} score must be between 0 and 100`,
          code: 'INVALID_SCORE',
          value: score[component]
        });
      }
    });

    if (!ValidationHelpers.isValidDate(score.lastUpdated)) {
      errors.push({
        field: 'score.lastUpdated',
        message: 'Score last updated date is invalid',
        code: 'INVALID_DATE',
        value: score.lastUpdated
      });
    }
  }

  private static validateDataQuality(dataQuality: any, errors: ValidationError[], warnings: ValidationError[]): void {
    if (!ValidationHelpers.isValidProbability(dataQuality.completeness)) {
      errors.push({
        field: 'dataQuality.completeness',
        message: 'Data completeness must be between 0 and 1',
        code: 'INVALID_PROBABILITY',
        value: dataQuality.completeness
      });
    }

    if (!ValidationHelpers.isValidProbability(dataQuality.accuracy)) {
      errors.push({
        field: 'dataQuality.accuracy',
        message: 'Data accuracy must be between 0 and 1',
        code: 'INVALID_PROBABILITY',
        value: dataQuality.accuracy
      });
    }

    if (!ValidationHelpers.isValidDate(dataQuality.freshness)) {
      errors.push({
        field: 'dataQuality.freshness',
        message: 'Data freshness date is invalid',
        code: 'INVALID_DATE',
        value: dataQuality.freshness
      });
    }

    if (!ValidationHelpers.isValidArray(dataQuality.sources)) {
      warnings.push({
        field: 'dataQuality.sources',
        message: 'Data sources should be specified',
        code: 'MISSING_DATA_SOURCES'
      });
    }
  }
}

// ============================================================================
// CUSTOMER VALIDATION
// ============================================================================

export class CustomerValidator {
  static validate(customer: Partial<Customer>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Required fields validation
    if (!customer.id || !ValidationHelpers.isNonEmptyString(customer.id)) {
      errors.push({
        field: 'id',
        message: 'Customer ID is required and must be a non-empty string',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!customer.firstName || !ValidationHelpers.isNonEmptyString(customer.firstName)) {
      errors.push({
        field: 'firstName',
        message: 'First name is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!customer.lastName || !ValidationHelpers.isNonEmptyString(customer.lastName)) {
      errors.push({
        field: 'lastName',
        message: 'Last name is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!customer.email || !ValidationHelpers.isValidEmail(customer.email)) {
      errors.push({
        field: 'email',
        message: 'Valid email address is required',
        code: 'INVALID_EMAIL',
        value: customer.email
      });
    }

    // Customer-specific required fields
    if (!customer.createdAt || !ValidationHelpers.isValidDate(customer.createdAt)) {
      errors.push({
        field: 'createdAt',
        message: 'Customer creation date is required and must be valid',
        code: 'REQUIRED_FIELD'
      });
    }

    // Enum validations
    if (customer.segment && !ValidationHelpers.isValidEnum(customer.segment, CustomerSegment)) {
      errors.push({
        field: 'segment',
        message: 'Invalid customer segment',
        code: 'INVALID_ENUM',
        value: customer.segment
      });
    }

    // Score validations - healthScore not part of Customer interface, skipping validation

    // Churn risk validation - churnRisk not part of Customer interface, skipping validation

    // Lifetime value validation
    if (customer.lifetime_value !== undefined) {
      if (typeof customer.lifetime_value !== 'number' || customer.lifetime_value < 0) {
        errors.push({
          field: 'lifetime_value',
          message: 'Lifetime value must be a non-negative number',
          code: 'INVALID_VALUE',
          value: customer.lifetime_value
        });
      }
    }

    // Engagement metrics validation - engagementMetrics not part of Customer interface, skipping validation

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static validateEngagementMetrics(metrics: any, errors: ValidationError[], warnings: ValidationError[]): void {
    const engagementFields = ['emailEngagement', 'websiteEngagement', 'socialEngagement', 'supportEngagement'];
    
    engagementFields.forEach(field => {
      if (metrics[field] !== undefined && !ValidationHelpers.isValidProbability(metrics[field])) {
        errors.push({
          field: `engagementMetrics.${field}`,
          message: `${field} must be between 0 and 1`,
          code: 'INVALID_PROBABILITY',
          value: metrics[field]
        });
      }
    });

    if (metrics.lastEngagement && !ValidationHelpers.isValidDate(metrics.lastEngagement)) {
      errors.push({
        field: 'engagementMetrics.lastEngagement',
        message: 'Last engagement date is invalid',
        code: 'INVALID_DATE',
        value: metrics.lastEngagement
      });
    }
  }
}

// ============================================================================
// INTERACTION VALIDATION
// ============================================================================

export class InteractionValidator {
  static validate(interaction: Partial<Interaction>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Required fields validation
    if (!interaction.id || !ValidationHelpers.isNonEmptyString(interaction.id)) {
      errors.push({
        field: 'id',
        message: 'Interaction ID is required and must be a non-empty string',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!interaction.type || !ValidationHelpers.isValidEnum(interaction.type, InteractionType)) {
      errors.push({
        field: 'type',
        message: 'Valid interaction type is required',
        code: 'INVALID_ENUM',
        value: interaction.type
      });
    }

    // Channel validation - channel not part of Interaction interface, skipping validation

    // Direction validation - direction not part of Interaction interface, skipping validation

    if (!interaction.description || !ValidationHelpers.isNonEmptyString(interaction.description)) {
      errors.push({
        field: 'description',
        message: 'Interaction content is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (!interaction.timestamp || !ValidationHelpers.isValidDate(interaction.timestamp)) {
      errors.push({
        field: 'timestamp',
        message: 'Valid timestamp is required',
        code: 'INVALID_DATE',
        value: interaction.timestamp
      });
    }

    // At least one participant must be specified
    if (!interaction.contactId) {
      errors.push({
        field: 'contactId',
        message: 'Contact ID is required for interactions',
        code: 'MISSING_PARTICIPANT'
      });
    }

    // Sentiment validation - sentiment not part of Interaction interface, skipping validation

    // Sentiment score validation - sentimentScore not part of Interaction interface, skipping validation

    // Engagement score validation - engagementScore not part of Interaction interface, skipping validation

    // Priority validation - urgency not part of Interaction interface, skipping validation
    // Duration validation - duration not part of Interaction interface, skipping validation

    // AI confidence validation - aiConfidence not part of Interaction interface, skipping validation
    // Data quality validation - dataQuality not part of Interaction interface, skipping validation

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// ============================================================================
// BATCH VALIDATION UTILITIES
// ============================================================================

export class BatchValidator {
  static validateLeads(leads: Partial<Lead>[]): { results: ValidationResult[]; summary: ValidationSummary } {
    const results = leads.map(lead => LeadValidator.validate(lead));
    const summary = this.createValidationSummary(results);
    return { results, summary };
  }

  static validateCustomers(customers: Partial<Customer>[]): { results: ValidationResult[]; summary: ValidationSummary } {
    const results = customers.map(customer => CustomerValidator.validate(customer));
    const summary = this.createValidationSummary(results);
    return { results, summary };
  }

  static validateInteractions(interactions: Partial<Interaction>[]): { results: ValidationResult[]; summary: ValidationSummary } {
    const results = interactions.map(interaction => InteractionValidator.validate(interaction));
    const summary = this.createValidationSummary(results);
    return { results, summary };
  }

  private static createValidationSummary(results: ValidationResult[]): ValidationSummary {
    const totalRecords = results.length;
    const validRecords = results.filter(r => r.isValid).length;
    const invalidRecords = totalRecords - validRecords;
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

    const errorsByCode: Record<string, number> = {};
    const warningsByCode: Record<string, number> = {};

    results.forEach(result => {
      result.errors.forEach(error => {
        errorsByCode[error.code] = (errorsByCode[error.code] || 0) + 1;
      });
      result.warnings.forEach(warning => {
        warningsByCode[warning.code] = (warningsByCode[warning.code] || 0) + 1;
      });
    });

    return {
      totalRecords,
      validRecords,
      invalidRecords,
      validationRate: validRecords / totalRecords,
      totalErrors,
      totalWarnings,
      errorsByCode,
      warningsByCode,
      mostCommonErrors: Object.entries(errorsByCode)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([code, count]) => ({ code, count })),
      mostCommonWarnings: Object.entries(warningsByCode)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([code, count]) => ({ code, count }))
    };
  }
}

export interface ValidationSummary {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  validationRate: number;
  totalErrors: number;
  totalWarnings: number;
  errorsByCode: Record<string, number>;
  warningsByCode: Record<string, number>;
  mostCommonErrors: { code: string; count: number }[];
  mostCommonWarnings: { code: string; count: number }[];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const CRMValidationUtils = {
  // Quick validation functions
  isValidLead: (lead: Partial<Lead>): boolean => LeadValidator.validate(lead).isValid,
  isValidCustomer: (customer: Partial<Customer>): boolean => CustomerValidator.validate(customer).isValid,
  isValidInteraction: (interaction: Partial<Interaction>): boolean => InteractionValidator.validate(interaction).isValid,

  // Get validation errors only
  getLeadErrors: (lead: Partial<Lead>): ValidationError[] => LeadValidator.validate(lead).errors,
  getCustomerErrors: (customer: Partial<Customer>): ValidationError[] => CustomerValidator.validate(customer).errors,
  getInteractionErrors: (interaction: Partial<Interaction>): ValidationError[] => InteractionValidator.validate(interaction).errors,

  // Sanitization helpers
  sanitizeEmail: (email: string): string => email.toLowerCase().trim(),
  sanitizePhone: (phone: string): string => phone.replace(/[^\d+\-\(\)\s]/g, ''),
  sanitizeName: (name: string): string => name.trim().replace(/\s+/g, ' '),

  // Data completeness calculation
  calculateLeadCompleteness: (lead: Partial<Lead>): number => {
    const requiredFields = ['id', 'firstName', 'lastName', 'email', 'source', 'status'];
    const optionalFields = ['phone', 'company', 'jobTitle', 'assignedTo'];
    const allFields = [...requiredFields, ...optionalFields];
    
    const filledFields = allFields.filter(field => {
      const value = (lead as any)[field];
      return value !== undefined && value !== null && value !== '';
    });
    
    return filledFields.length / allFields.length;
  },

  calculateCustomerCompleteness: (customer: Partial<Customer>): number => {
    const requiredFields = ['id', 'firstName', 'lastName', 'email', 'customerSince', 'segment'];
    const optionalFields = ['phone', 'company', 'jobTitle', 'tier', 'status'];
    const allFields = [...requiredFields, ...optionalFields];
    
    const filledFields = allFields.filter(field => {
      const value = (customer as any)[field];
      return value !== undefined && value !== null && value !== '';
    });
    
    return filledFields.length / allFields.length;
  }
};

// All validators and utilities are already exported above