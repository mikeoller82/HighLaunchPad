// Content validation system to prevent blank spaces and ensure template quality
// Validates funnel templates and provides quality recommendations

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 0-100 quality score
  suggestions: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'critical' | 'major' | 'minor';
  location?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  recommendation: string;
  location?: string;
}

export interface ValidationOptions {
  strict?: boolean; // Strict mode prevents any placeholders or empty content
  industry?: string; // Industry-specific validation rules
  templateType?: string; // Template-specific validation
  minContentLength?: number; // Minimum content length
  maxContentLength?: number; // Maximum content length
}

export class ContentValidator {
  private options: ValidationOptions;

  constructor(options: ValidationOptions = {}) {
    this.options = {
      strict: false,
      minContentLength: 10,
      maxContentLength: 500,
      ...options
    };
  }

  // Main validation method
  validateTemplate(template: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Validate the template structure
    this.validateStructure(template, errors, warnings);
    
    // Validate content quality
    this.validateContent(template, errors, warnings, suggestions);
    
    // Validate links and URLs
    this.validateLinks(template, errors, warnings);
    
    // Validate placeholders
    this.validatePlaceholders(template, errors, warnings, suggestions);
    
    // Industry-specific validation
    if (this.options.industry) {
      this.validateIndustrySpecific(template, errors, warnings, this.options.industry);
    }

    // Calculate quality score
    const score = this.calculateQualityScore(template, errors, warnings);

    return {
      isValid: errors.filter(e => e.severity === 'critical').length === 0,
      errors,
      warnings,
      score,
      suggestions
    };
  }

  // Validate basic template structure
  private validateStructure(template: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!template) {
      errors.push({
        field: 'template',
        message: 'Template is null or undefined',
        severity: 'critical'
      });
      return;
    }

    // Check for required fields
    const requiredFields = ['id', 'title', 'description', 'components'];
    for (const field of requiredFields) {
      if (!template[field]) {
        errors.push({
          field,
          message: `Required field '${field}' is missing`,
          severity: 'critical'
        });
      }
    }

    // Validate components array
    if (template.components && Array.isArray(template.components)) {
      if (template.components.length === 0) {
        errors.push({
          field: 'components',
          message: 'Template must have at least one component',
          severity: 'critical'
        });
      }

      // Validate each component
      template.components.forEach((component: any, index: number) => {
        this.validateComponent(component, index, errors, warnings);
      });
    }
  }

  // Validate individual component
  private validateComponent(component: any, index: number, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const location = `components[${index}]`;

    if (!component.id) {
      errors.push({
        field: 'id',
        message: 'Component must have an ID',
        severity: 'major',
        location
      });
    }

    if (!component.type) {
      errors.push({
        field: 'type',
        message: 'Component must have a type',
        severity: 'critical',
        location
      });
    }

    if (!component.content || Object.keys(component.content).length === 0) {
      errors.push({
        field: 'content',
        message: 'Component must have content',
        severity: 'critical',
        location
      });
    }

    // Validate component content
    if (component.content) {
      this.validateComponentContent(component.content, location, errors, warnings);
    }
  }

  // Validate component content for blank spaces and quality
  private validateComponentContent(content: any, location: string, errors: ValidationError[], warnings: ValidationWarning[]): void {
    this.validateContentRecursively(content, location, errors, warnings);
  }

  // Recursively validate content object
  private validateContentRecursively(obj: any, path: string, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (typeof obj === 'string') {
      this.validateStringContent(obj, path, errors, warnings);
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        this.validateContentRecursively(item, `${path}[${index}]`, errors, warnings);
      });
    } else if (obj && typeof obj === 'object') {
      Object.entries(obj).forEach(([key, value]) => {
        this.validateContentRecursively(value, `${path}.${key}`, errors, warnings);
      });
    }
  }

  // Validate string content
  private validateStringContent(content: string, location: string, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // Check for completely empty content
    if (!content || content.trim().length === 0) {
      errors.push({
        field: 'content',
        message: 'Content cannot be empty or contain only whitespace',
        severity: 'critical',
        location
      });
      return;
    }

    // Check for placeholder-only content
    if (this.isPlaceholderOnly(content)) {
      if (this.options.strict) {
        errors.push({
          field: 'content',
          message: 'Content contains only placeholders in strict mode',
          severity: 'major',
          location
        });
      } else {
        warnings.push({
          field: 'content',
          message: 'Content contains only placeholders',
          recommendation: 'Add default content or ensure placeholders are replaced',
          location
        });
      }
    }

    // Check content length
    if (content.length < (this.options.minContentLength || 0)) {
      warnings.push({
        field: 'content',
        message: `Content is too short (${content.length} characters)`,
        recommendation: `Consider expanding content to at least ${this.options.minContentLength} characters`,
        location
      });
    }

    if (content.length > (this.options.maxContentLength || 1000)) {
      warnings.push({
        field: 'content',
        message: `Content is very long (${content.length} characters)`,
        recommendation: 'Consider breaking long content into smaller sections',
        location
      });
    }

    // Check for multiple consecutive spaces
    if (/\s{3,}/.test(content)) {
      warnings.push({
        field: 'content',
        message: 'Content contains multiple consecutive spaces',
        recommendation: 'Clean up spacing for better readability',
        location
      });
    }

    // Check for common typos or formatting issues
    this.validateTextQuality(content, location, warnings);
  }

  // Validate overall content quality
  private validateContent(template: any, errors: ValidationError[], warnings: ValidationWarning[], suggestions: string[]): void {
    // Check for duplicate content
    const contentStrings = this.extractAllStrings(template);
    const duplicates = this.findDuplicates(contentStrings);
    
    if (duplicates.length > 0) {
      warnings.push({
        field: 'content',
        message: `Found ${duplicates.length} duplicate content sections`,
        recommendation: 'Consider varying content to improve user engagement'
      });
    }

    // Check for missing calls-to-action
    const hasCTA = this.hasCallToAction(template);
    if (!hasCTA) {
      errors.push({
        field: 'cta',
        message: 'Template should have at least one call-to-action',
        severity: 'major'
      });
    }

    // Check for social proof elements
    const hasSocialProof = this.hasSocialProof(template);
    if (!hasSocialProof) {
      suggestions.push('Consider adding testimonials or social proof elements to increase credibility');
    }

    // Check for urgency/scarcity elements
    const hasUrgency = this.hasUrgencyElements(template);
    if (!hasUrgency) {
      suggestions.push('Consider adding urgency or scarcity elements to increase conversions');
    }
  }

  // Validate links and URLs
  private validateLinks(template: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const links = this.extractAllLinks(template);
    
    for (const link of links) {
      if (!link.url || link.url.trim() === '') {
        errors.push({
          field: 'url',
          message: 'Empty URL found',
          severity: 'major',
          location: link.location
        });
        continue;
      }

      // Check for placeholder URLs
      if (link.url.startsWith('#') && link.url.length === 1) {
        errors.push({
          field: 'url',
          message: 'Placeholder URL found (#)',
          severity: 'major',
          location: link.location
        });
      }

      // Check for invalid URL format
      if (!this.isValidUrl(link.url) && !link.url.startsWith('#') && !link.url.startsWith('/')) {
        warnings.push({
          field: 'url',
          message: `Potentially invalid URL: ${link.url}`,
          recommendation: 'Verify URL format and accessibility',
          location: link.location
        });
      }
    }
  }

  // Validate placeholders
  private validatePlaceholders(template: any, errors: ValidationError[], warnings: ValidationWarning[], suggestions: string[]): void {
    const content = JSON.stringify(template);
    const placeholders = content.match(/\[([^\]]+)\]/g) || [];
    
    if (placeholders.length === 0 && !this.options.strict) {
      suggestions.push('Consider adding personalization placeholders to improve user engagement');
    }

    // Check for malformed placeholders
    const malformedPlaceholders = content.match(/\[[^\]]*$/g) || [];
    if (malformedPlaceholders.length > 0) {
      errors.push({
        field: 'placeholders',
        message: 'Found malformed placeholders (missing closing bracket)',
        severity: 'minor'
      });
    }
  }

  // Industry-specific validation
  private validateIndustrySpecific(template: any, errors: ValidationError[], warnings: ValidationWarning[], industry: string): void {
    const industryRules: Record<string, (template: any) => { errors: ValidationError[], warnings: ValidationWarning[] }> = {
      healthcare: this.validateHealthcareContent.bind(this),
      finance: this.validateFinanceContent.bind(this),
      legal: this.validateLegalContent.bind(this)
    };

    const validator = industryRules[industry];
    if (validator) {
      const result = validator(template);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    }
  }

  // Healthcare-specific validation
  private validateHealthcareContent(template: any): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const content = JSON.stringify(template).toLowerCase();

    // Check for medical disclaimers
    if (!content.includes('disclaimer') && !content.includes('consult') && !content.includes('physician')) {
      warnings.push({
        field: 'disclaimer',
        message: 'Healthcare content should include appropriate disclaimers',
        recommendation: 'Add medical disclaimer advising users to consult healthcare professionals'
      });
    }

    return { errors, warnings };
  }

  // Finance-specific validation
  private validateFinanceContent(template: any): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const content = JSON.stringify(template).toLowerCase();

    // Check for financial disclaimers
    if (!content.includes('risk') && !content.includes('disclaimer')) {
      warnings.push({
        field: 'disclaimer',
        message: 'Financial content should include risk disclaimers',
        recommendation: 'Add appropriate financial risk disclaimers'
      });
    }

    return { errors, warnings };
  }

  // Legal-specific validation
  private validateLegalContent(template: any): { errors: ValidationError[], warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Legal content validation would go here
    return { errors, warnings };
  }

  // Helper methods
  private isPlaceholderOnly(content: string): boolean {
    const placeholderPattern = /^\s*\[[^\]]+\]\s*$/;
    return placeholderPattern.test(content.trim());
  }

  private validateTextQuality(content: string, location: string, warnings: ValidationWarning[]): void {
    // Check for repeated words
    const words = content.toLowerCase().split(/\s+/);
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i] === words[i + 1] && words[i].length > 3) {
        warnings.push({
          field: 'content',
          message: `Repeated word found: "${words[i]}"`,
          recommendation: 'Review content for unintentional repetition',
          location
        });
        break; // Only report first occurrence
      }
    }

    // Check for all caps (except for certain cases)
    if (content.length > 10 && content === content.toUpperCase() && !/[0-9]/.test(content)) {
      warnings.push({
        field: 'content',
        message: 'Content is in ALL CAPS',
        recommendation: 'Consider using normal capitalization for better readability',
        location
      });
    }
  }

  private extractAllStrings(obj: any): string[] {
    const strings: string[] = [];
    
    function extract(item: any): void {
      if (typeof item === 'string' && item.length > 10) {
        strings.push(item);
      } else if (Array.isArray(item)) {
        item.forEach(extract);
      } else if (item && typeof item === 'object') {
        Object.values(item).forEach(extract);
      }
    }
    
    extract(obj);
    return strings;
  }

  private findDuplicates(strings: string[]): string[] {
    const seen = new Set();
    const duplicates = new Set();
    
    for (const str of strings) {
      if (seen.has(str)) {
        duplicates.add(str);
      } else {
        seen.add(str);
      }
    }
    
    return Array.from(duplicates) as string[];
  }

  private hasCallToAction(template: any): boolean {
    const content = JSON.stringify(template).toLowerCase();
    const ctaKeywords = ['cta', 'button', 'click', 'signup', 'register', 'buy', 'purchase', 'download'];
    return ctaKeywords.some(keyword => content.includes(keyword));
  }

  private hasSocialProof(template: any): boolean {
    const content = JSON.stringify(template).toLowerCase();
    const socialProofKeywords = ['testimonial', 'review', 'customer', 'client', 'success', 'rating'];
    return socialProofKeywords.some(keyword => content.includes(keyword));
  }

  private hasUrgencyElements(template: any): boolean {
    const content = JSON.stringify(template).toLowerCase();
    const urgencyKeywords = ['limited', 'urgent', 'countdown', 'deadline', 'expires', 'hurry', 'act now'];
    return urgencyKeywords.some(keyword => content.includes(keyword));
  }

  private extractAllLinks(obj: any): Array<{ url: string, location: string }> {
    const links: Array<{ url: string, location: string }> = [];
    
    function extract(item: any, path: string = ''): void {
      if (typeof item === 'string' && (item.startsWith('http') || item.startsWith('/') || item.startsWith('#'))) {
        links.push({ url: item, location: path });
      } else if (Array.isArray(item)) {
        item.forEach((subItem, index) => extract(subItem, `${path}[${index}]`));
      } else if (item && typeof item === 'object') {
        Object.entries(item).forEach(([key, value]) => {
          if (key.toLowerCase().includes('url') || key.toLowerCase().includes('href') || key.toLowerCase().includes('link')) {
            if (typeof value === 'string') {
              links.push({ url: value, location: `${path}.${key}` });
            }
          } else {
            extract(value, `${path}.${key}`);
          }
        });
      }
    }
    
    extract(obj);
    return links;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private calculateQualityScore(template: any, errors: ValidationError[], warnings: ValidationWarning[]): number {
    let score = 100;
    
    // Deduct points for errors
    errors.forEach(error => {
      switch (error.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'major':
          score -= 10;
          break;
        case 'minor':
          score -= 5;
          break;
      }
    });
    
    // Deduct points for warnings
    warnings.forEach(() => {
      score -= 2;
    });
    
    // Bonus points for good practices
    if (this.hasCallToAction(template)) score += 5;
    if (this.hasSocialProof(template)) score += 5;
    if (this.hasUrgencyElements(template)) score += 3;
    
    return Math.max(0, Math.min(100, score));
  }
}

// Utility functions
export function validateFunnelTemplate(template: any, options?: ValidationOptions): ValidationResult {
  const validator = new ContentValidator(options);
  return validator.validateTemplate(template);
}

export function validateMultipleTemplates(templates: any[], options?: ValidationOptions): ValidationResult[] {
  const validator = new ContentValidator(options);
  return templates.map(template => validator.validateTemplate(template));
}

// Quick validation for specific issues
export function hasBlankSpaces(content: string): boolean {
  return !content || content.trim().length === 0 || /^\s*$/.test(content);
}

export function hasPlaceholderLinks(obj: any): boolean {
  const content = JSON.stringify(obj);
  return /#$|#purchase|#signup|#register/.test(content);
}

// Export default validator
export const defaultValidator = new ContentValidator();