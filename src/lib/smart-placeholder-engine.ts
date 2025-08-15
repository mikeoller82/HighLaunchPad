// Smart Placeholder Engine for dynamic content replacement
// Intelligently replaces placeholders with contextual, personalized content

export interface UserContext {
  // Business information
  brandName?: string;
  companyName?: string;
  productName?: string;
  industry?: string;
  targetAudience?: string;
  
  // Personal information
  firstName?: string;
  lastName?: string;
  email?: string;
  title?: string;
  
  // Business metrics
  currentRevenue?: string;
  teamSize?: string;
  businessStage?: string;
  
  // Preferences
  tone?: 'professional' | 'casual' | 'urgent' | 'friendly' | 'motivational';
  locale?: string;
  timezone?: string;
  
  // Custom fields
  customFields?: Record<string, string>;
}

export interface PlaceholderRule {
  pattern: RegExp;
  replacement: (context: UserContext) => string;
  fallback: string;
  description: string;
}

export class SmartPlaceholderEngine {
  private rules: PlaceholderRule[] = [];
  
  constructor() {
    this.initializeDefaultRules();
  }

  // Initialize default placeholder rules
  private initializeDefaultRules(): void {
    this.rules = [
      // Business identity placeholders
      {
        pattern: /\[Your Brand Name\]/gi,
        replacement: (ctx) => ctx.brandName || ctx.companyName || 'Your Brand',
        fallback: 'Your Brand',
        description: 'Brand or company name'
      },
      {
        pattern: /\[Your Company Name\]/gi,
        replacement: (ctx) => ctx.companyName || ctx.brandName || 'Your Company',
        fallback: 'Your Company',
        description: 'Company name'
      },
      {
        pattern: /\[Product Name\]/gi,
        replacement: (ctx) => ctx.productName || 'Your Product',
        fallback: 'Your Product',
        description: 'Main product or service name'
      },
      {
        pattern: /\[Your Industry\]/gi,
        replacement: (ctx) => ctx.industry || 'your industry',
        fallback: 'your industry',
        description: 'Business industry or niche'
      },
      
      // Personal placeholders
      {
        pattern: /\[First Name\]/gi,
        replacement: (ctx) => ctx.firstName || 'there',
        fallback: 'there',
        description: 'Customer first name'
      },
      {
        pattern: /\[Last Name\]/gi,
        replacement: (ctx) => ctx.lastName || 'Friend',
        fallback: 'Friend',
        description: 'Customer last name'
      },
      {
        pattern: /\[Full Name\]/gi,
        replacement: (ctx) => {
          if (ctx.firstName && ctx.lastName) {
            return `${ctx.firstName} ${ctx.lastName}`;
          }
          return ctx.firstName || 'Valued Customer';
        },
        fallback: 'Valued Customer',
        description: 'Customer full name'
      },
      
      // Target audience placeholders
      {
        pattern: /\[Your Target Audience\]/gi,
        replacement: (ctx) => ctx.targetAudience || 'entrepreneurs',
        fallback: 'entrepreneurs',
        description: 'Primary target audience'
      },
      {
        pattern: /\[Target Customer\]/gi,
        replacement: (ctx) => {
          const audiences: Record<string, string> = {
            'saas': 'business owners',
            'consulting': 'entrepreneurs',
            'ecommerce': 'online retailers',
            'coaching': 'high-achievers',
            'healthcare': 'patients',
            'finance': 'investors',
            'realestate': 'property buyers',
            'education': 'students'
          };
          return audiences[ctx.industry || ''] || ctx.targetAudience || 'customers';
        },
        fallback: 'customers',
        description: 'Contextual target customer description'
      },
      
      // Business metrics placeholders
      {
        pattern: /\[Current Revenue\]/gi,
        replacement: (ctx) => ctx.currentRevenue || '$10K-$50K/month',
        fallback: '$10K-$50K/month',
        description: 'Current business revenue'
      },
      {
        pattern: /\[Team Size\]/gi,
        replacement: (ctx) => ctx.teamSize || '5-10 people',
        fallback: '5-10 people',
        description: 'Current team size'
      },
      
      // Industry-specific placeholders
      {
        pattern: /\[Service Type\]/gi,
        replacement: (ctx) => this.getServiceType(ctx.industry),
        fallback: 'service',
        description: 'Industry-specific service type'
      },
      {
        pattern: /\[Primary Benefit\]/gi,
        replacement: (ctx) => this.getPrimaryBenefit(ctx.industry),
        fallback: 'grow your business',
        description: 'Industry-specific primary benefit'
      },
      {
        pattern: /\[Key Challenge\]/gi,
        replacement: (ctx) => this.getKeyChallenge(ctx.industry),
        fallback: 'scale efficiently',
        description: 'Industry-specific key challenge'
      },
      
      // Contact placeholders
      {
        pattern: /\[Support Email\]/gi,
        replacement: (ctx) => `support@${this.getDomainFromEmail(ctx.email)}`,
        fallback: 'support@yourcompany.com',
        description: 'Support email address'
      },
      {
        pattern: /\[Contact Email\]/gi,
        replacement: (ctx) => ctx.email || 'hello@yourcompany.com',
        fallback: 'hello@yourcompany.com',
        description: 'Main contact email'
      },
      
      // Dynamic content placeholders
      {
        pattern: /\[Testimonial Count\]/gi,
        replacement: () => this.generateTestimonialCount(),
        fallback: '500+',
        description: 'Dynamic testimonial count'
      },
      {
        pattern: /\[Customer Count\]/gi,
        replacement: () => this.generateCustomerCount(),
        fallback: '10,000+',
        description: 'Dynamic customer count'
      },
      {
        pattern: /\[Success Rate\]/gi,
        replacement: () => this.generateSuccessRate(),
        fallback: '95%',
        description: 'Dynamic success rate'
      }
    ];
  }

  // Main method to replace placeholders in content
  replacePlaceholders(content: string, context: UserContext): string {
    let result = content;
    
    for (const rule of this.rules) {
      try {
        const replacement = rule.replacement(context) || rule.fallback;
        result = result.replace(rule.pattern, replacement);
      } catch (error) {
        console.warn(`Error applying placeholder rule: ${rule.description}`, error);
        result = result.replace(rule.pattern, rule.fallback);
      }
    }
    
    // Handle custom fields
    if (context.customFields) {
      for (const [key, value] of Object.entries(context.customFields)) {
        const pattern = new RegExp(`\\[${key}\\]`, 'gi');
        result = result.replace(pattern, value);
      }
    }
    
    return result;
  }

  // Replace placeholders in complex objects (recursive)
  replaceInObject(obj: any, context: UserContext): any {
    if (typeof obj === 'string') {
      return this.replacePlaceholders(obj, context);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.replaceInObject(item, context));
    }
    
    if (obj && typeof obj === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.replaceInObject(value, context);
      }
      return result;
    }
    
    return obj;
  }

  // Add custom placeholder rule
  addRule(rule: PlaceholderRule): void {
    this.rules.push(rule);
  }

  // Industry-specific helpers
  private getServiceType(industry?: string): string {
    const serviceTypes: Record<string, string> = {
      'saas': 'software solution',
      'consulting': 'consulting service',
      'ecommerce': 'online store',
      'coaching': 'coaching program',
      'healthcare': 'healthcare service',
      'finance': 'financial service',  
      'realestate': 'real estate service',
      'education': 'educational program',
      'marketing': 'marketing service',
      'fitness': 'fitness program',
      'legal': 'legal service'
    };
    
    return serviceTypes[industry || ''] || 'service';
  }

  private getPrimaryBenefit(industry?: string): string {
    const benefits: Record<string, string> = {
      'saas': 'streamline your operations and boost productivity',
      'consulting': 'scale your business to 7-figures',
      'ecommerce': 'increase sales and customer loyalty',
      'coaching': 'achieve your goals and unlock your potential',
      'healthcare': 'improve your health and wellbeing',
      'finance': 'build wealth and financial security',
      'realestate': 'find your dream property',
      'education': 'master new skills and advance your career',
      'marketing': 'generate more leads and increase revenue',
      'fitness': 'transform your body and feel amazing',
      'legal': 'protect your interests and resolve legal matters'
    };
    
    return benefits[industry || ''] || 'achieve your goals';
  }

  private getKeyChallenge(industry?: string): string {
    const challenges: Record<string, string> = {
      'saas': 'managing complex workflows',
      'consulting': 'scaling without burnout',
      'ecommerce': 'converting visitors to customers',
      'coaching': 'breaking through limiting beliefs',
      'healthcare': 'maintaining optimal health',
      'finance': 'growing wealth consistently',
      'realestate': 'finding the right property',
      'education': 'keeping skills current',
      'marketing': 'getting quality leads',
      'fitness': 'staying motivated and consistent',
      'legal': 'navigating complex regulations'
    };
    
    return challenges[industry || ''] || 'achieving consistent growth';
  }

  // Dynamic content generators
  private generateTestimonialCount(): string {
    const counts = ['500+', '750+', '1,000+', '1,250+', '1,500+'];
    return counts[Math.floor(Math.random() * counts.length)];
  }

  private generateCustomerCount(): string {
    const counts = ['5,000+', '7,500+', '10,000+', '12,500+', '15,000+'];
    return counts[Math.floor(Math.random() * counts.length)];
  }

  private generateSuccessRate(): string {
    const rates = ['92%', '94%', '95%', '96%', '98%'];
    return rates[Math.floor(Math.random() * rates.length)];
  }

  // Utility to extract domain from email
  private getDomainFromEmail(email?: string): string {
    if (!email || !email.includes('@')) {
      return 'yourcompany.com';
    }
    return email.split('@')[1];
  }

  // Validate placeholder replacement
  validatePlaceholders(content: string): string[] {
    const placeholderPattern = /\[([^\]]+)\]/g;
    const matches = content.match(placeholderPattern) || [];
    
    const unreplacedPlaceholders: string[] = [];
    
    for (const match of matches) {
      const found = this.rules.some(rule => rule.pattern.test(match));
      if (!found) {
        unreplacedPlaceholders.push(match);
      }
    }
    
    return unreplacedPlaceholders;
  }

  // Get all available placeholders
  getAvailablePlaceholders(): Array<{ placeholder: string; description: string }> {
    return this.rules.map(rule => ({
      placeholder: rule.pattern.source.replace(/\\\[|\\\]/g, '').replace(/\|gi$/, ''),
      description: rule.description
    }));
  }
}

// Industry-specific context generators
export function generateIndustryContext(industry: string): Partial<UserContext> {
  const contexts: Record<string, Partial<UserContext>> = {
    healthcare: {
      industry: 'healthcare',
      targetAudience: 'patients and healthcare professionals',
      tone: 'professional'
    },
    finance: {
      industry: 'finance',
      targetAudience: 'investors and financial planning clients',
      tone: 'professional'
    },
    realestate: {
      industry: 'realestate',
      targetAudience: 'property buyers and sellers',
      tone: 'professional'
    },
    education: {
      industry: 'education',
      targetAudience: 'students and professionals',
      tone: 'friendly'
    },
    fitness: {
      industry: 'fitness',
      targetAudience: 'fitness enthusiasts and beginners',
      tone: 'motivational'
    },
    saas: {
      industry: 'saas',
      targetAudience: 'business owners and entrepreneurs',
      tone: 'professional'
    }
  };

  return contexts[industry] || {};
}

// Export default instance
export const defaultPlaceholderEngine = new SmartPlaceholderEngine();

// Utility function for easy template integration
export function enhanceTemplateWithPlaceholders(
  template: any,
  context: UserContext
): any {
  return defaultPlaceholderEngine.replaceInObject(template, context);
}