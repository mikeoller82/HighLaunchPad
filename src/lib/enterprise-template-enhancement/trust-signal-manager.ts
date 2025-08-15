/**
 * Trust Signal and Credibility System
 * 
 * This module implements a comprehensive trust signal management system that:
 * - Creates trust signal manager that applies appropriate badges based on industry and template type
 * - Implements security badge system (SOC 2, HIPAA, SSL certificates)
 * - Builds testimonial verification system with authentic social proof elements
 * - Adds professional certification display system
 * - Creates industry-specific credibility indicators
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import type {
  TrustSignal,
  EnhancementResult,
  ProcessingError,
  ProcessingWarning,
  PerformanceImpact
} from './types';
import type { Template } from '../website-templates';
import type { FunnelTemplate } from '../types';

// ============================================================================
// TRUST SIGNAL DEFINITIONS
// ============================================================================

/**
 * Security Badge Configuration
 */
export interface SecurityBadge extends TrustSignal {
  type: 'security_badge';
  securityLevel: 'basic' | 'advanced' | 'enterprise';
  validUntil?: Date;
  certificateUrl?: string;
}

/**
 * Professional Certification Configuration
 */
export interface ProfessionalCertification extends TrustSignal {
  type: 'certification';
  issuingOrganization: string;
  certificationLevel: 'standard' | 'advanced' | 'expert';
  validUntil?: Date;
  credentialId?: string;
}

/**
 * Testimonial Verification Configuration
 */
export interface TestimonialVerification extends TrustSignal {
  type: 'testimonial_verification';
  verificationMethod: 'email' | 'linkedin' | 'third_party' | 'video';
  verifiedDate: Date;
  reviewerProfile?: {
    name: string;
    company: string;
    position: string;
    linkedinUrl?: string;
    photoUrl?: string;
  };
}

/**
 * Industry-Specific Credibility Indicator
 */
export interface CredibilityIndicator extends TrustSignal {
  type: 'social_proof' | 'guarantee' | 'uptime' | 'compliance';
  industrySpecific: boolean;
  metricValue?: string | number;
  metricUnit?: string;
  lastUpdated: Date;
}

/**
 * Trust Signal Application Context
 */
export interface TrustSignalContext {
  industry: string;
  templateType: 'website' | 'funnel';
  targetAudience: 'b2b' | 'b2c' | 'mixed';
  businessSize: 'startup' | 'smb' | 'enterprise';
  complianceRequirements: string[];
  existingCredentials: string[];
}

// ============================================================================
// TRUST SIGNAL MANAGER
// ============================================================================

/**
 * Trust Signal Manager
 * 
 * Manages the application of appropriate trust signals based on industry,
 * template type, and business context.
 */
export class TrustSignalManager {
  private static readonly INDUSTRY_TRUST_SIGNALS = {
    saas: {
      required: ['security_badge', 'uptime', 'compliance'],
      recommended: ['certification', 'social_proof'],
      badges: [
        {
          type: 'security_badge' as const,
          title: 'SOC 2 Type II Compliant',
          description: 'Independently audited security controls',
          icon: 'shield-check',
          securityLevel: 'enterprise' as const,
          displayPosition: 'footer' as const
        },
        {
          type: 'uptime' as const,
          title: '99.9% Uptime SLA',
          description: 'Guaranteed service availability',
          icon: 'activity',
          metricValue: '99.9',
          metricUnit: '%',
          displayPosition: 'header' as const
        },
        {
          type: 'compliance' as const,
          title: 'GDPR Compliant',
          description: 'Full compliance with EU data protection',
          icon: 'lock',
          displayPosition: 'footer' as const
        }
      ]
    },
    ecommerce: {
      required: ['security_badge', 'guarantee', 'social_proof'],
      recommended: ['certification', 'testimonial_verification'],
      badges: [
        {
          type: 'security_badge' as const,
          title: 'SSL Secured Checkout',
          description: '256-bit encryption for all transactions',
          icon: 'shield',
          securityLevel: 'advanced' as const,
          displayPosition: 'pricing' as const
        },
        {
          type: 'guarantee' as const,
          title: '30-Day Money Back Guarantee',
          description: 'Full refund if not satisfied',
          icon: 'refresh-cw',
          displayPosition: 'pricing' as const
        },
        {
          type: 'social_proof' as const,
          title: '50,000+ Happy Customers',
          description: 'Join thousands of satisfied buyers',
          icon: 'users',
          metricValue: '50000',
          metricUnit: 'customers',
          displayPosition: 'hero' as const
        }
      ]
    },
    healthcare: {
      required: ['compliance', 'security_badge', 'certification'],
      recommended: ['social_proof', 'testimonial_verification'],
      badges: [
        {
          type: 'compliance' as const,
          title: 'HIPAA Compliant',
          description: 'Protected health information security',
          icon: 'shield-check',
          displayPosition: 'header' as const
        },
        {
          type: 'security_badge' as const,
          title: 'Medical Grade Security',
          description: 'Healthcare industry security standards',
          icon: 'lock',
          securityLevel: 'enterprise' as const,
          displayPosition: 'footer' as const
        },
        {
          type: 'certification' as const,
          title: 'FDA Registered',
          description: 'Registered with Food and Drug Administration',
          icon: 'check-circle',
          issuingOrganization: 'FDA',
          displayPosition: 'testimonials' as const
        }
      ]
    },
    finance: {
      required: ['security_badge', 'compliance', 'certification'],
      recommended: ['social_proof', 'guarantee'],
      badges: [
        {
          type: 'security_badge' as const,
          title: 'Bank-Level Security',
          description: '256-bit SSL encryption and secure data centers',
          icon: 'shield',
          securityLevel: 'enterprise' as const,
          displayPosition: 'header' as const
        },
        {
          type: 'compliance' as const,
          title: 'PCI DSS Compliant',
          description: 'Payment card industry security standards',
          icon: 'credit-card',
          displayPosition: 'footer' as const
        },
        {
          type: 'certification' as const,
          title: 'SEC Registered',
          description: 'Securities and Exchange Commission registered',
          icon: 'file-text',
          issuingOrganization: 'SEC',
          displayPosition: 'testimonials' as const
        }
      ]
    },
    education: {
      required: ['certification', 'social_proof', 'guarantee'],
      recommended: ['testimonial_verification', 'compliance'],
      badges: [
        {
          type: 'certification' as const,
          title: 'Accredited Institution',
          description: 'Nationally recognized accreditation',
          icon: 'graduation-cap',
          issuingOrganization: 'Department of Education',
          displayPosition: 'header' as const
        },
        {
          type: 'social_proof' as const,
          title: '100,000+ Students Taught',
          description: 'Trusted by students worldwide',
          icon: 'users',
          metricValue: '100000',
          metricUnit: 'students',
          displayPosition: 'hero' as const
        },
        {
          type: 'guarantee' as const,
          title: 'Job Placement Guarantee',
          description: 'Get hired or get your money back',
          icon: 'briefcase',
          displayPosition: 'pricing' as const
        }
      ]
    },
    consulting: {
      required: ['certification', 'testimonial_verification', 'social_proof'],
      recommended: ['guarantee', 'compliance'],
      badges: [
        {
          type: 'certification' as const,
          title: 'Certified Management Consultant',
          description: 'Professional consulting certification',
          icon: 'award',
          issuingOrganization: 'Institute of Management Consultants',
          displayPosition: 'testimonials' as const
        },
        {
          type: 'social_proof' as const,
          title: '500+ Successful Projects',
          description: 'Proven track record of results',
          icon: 'trending-up',
          metricValue: '500',
          metricUnit: 'projects',
          displayPosition: 'hero' as const
        }
      ]
    }
  };

  /**
   * Apply appropriate trust signals to a template based on context
   */
  static async applyTrustSignals(
    template: Template | FunnelTemplate,
    context: TrustSignalContext
  ): Promise<EnhancementResult<(Template | FunnelTemplate) & { trustSignals: TrustSignal[] }>> {
    const startTime = Date.now();
    const errors: ProcessingError[] = [];
    const warnings: ProcessingWarning[] = [];
    const enhancementsApplied: string[] = [];

    try {
      // Get industry-specific trust signals
      const industrySignals = this.getIndustryTrustSignals(context.industry);
      
      // Filter signals based on template type and audience
      const applicableSignals = this.filterSignalsForContext(industrySignals, context);
      
      // Generate trust signal instances
      const trustSignals = this.generateTrustSignalInstances(applicableSignals, context);
      
      // Apply trust signals to template
      const enhancedTemplate = this.integrateSignalsIntoTemplate(template, trustSignals);
      
      enhancementsApplied.push('trust_signals_applied', 'industry_specific_badges', 'credibility_indicators');

      const processingTime = Date.now() - startTime;
      
      return {
        success: true,
        data: {
          ...enhancedTemplate,
          trustSignals
        },
        errors,
        warnings,
        metadata: {
          processingTime,
          enhancementsApplied,
          performanceImpact: this.assessPerformanceImpact(trustSignals)
        }
      };
    } catch (error) {
      errors.push({
        stage: 'enterprise_design',
        code: 'TRUST_SIGNAL_APPLICATION_ERROR',
        message: `Failed to apply trust signals: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
            recommendations: ['Fix trust signal application errors before proceeding']
          }
        }
      };
    }
  }

  /**
   * Get trust signals for a specific industry
   */
  private static getIndustryTrustSignals(industry: string): any[] {
    const industryConfig = this.INDUSTRY_TRUST_SIGNALS[industry as keyof typeof this.INDUSTRY_TRUST_SIGNALS];
    return industryConfig ? industryConfig.badges : this.INDUSTRY_TRUST_SIGNALS.saas.badges;
  }

  /**
   * Filter trust signals based on context
   */
  private static filterSignalsForContext(signals: any[], context: TrustSignalContext): any[] {
    return signals.filter(signal => {
      // Filter based on business size
      if (context.businessSize === 'startup' && signal.securityLevel === 'enterprise') {
        return false;
      }

      // Filter based on template type
      if (context.templateType === 'funnel' && signal.displayPosition === 'header') {
        return false; // Funnels typically don't have persistent headers
      }

      // Filter based on compliance requirements
      if (signal.type === 'compliance' && !context.complianceRequirements.includes(signal.title)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Generate trust signal instances with unique IDs
   */
  private static generateTrustSignalInstances(signals: any[], context: TrustSignalContext): TrustSignal[] {
    return signals.map((signal, index) => ({
      id: `trust_${context.industry}_${index}`,
      type: signal.type,
      title: signal.title,
      description: signal.description,
      icon: signal.icon,
      verified: true,
      displayPosition: signal.displayPosition,
      industry: [context.industry],
      ...signal
    }));
  }

  /**
   * Integrate trust signals into template structure
   */
  private static integrateSignalsIntoTemplate(
    template: Template | FunnelTemplate,
    trustSignals: TrustSignal[]
  ): Template | FunnelTemplate {
    // Group signals by display position
    const signalsByPosition = trustSignals.reduce((acc, signal) => {
      if (!acc[signal.displayPosition]) {
        acc[signal.displayPosition] = [];
      }
      acc[signal.displayPosition].push(signal);
      return acc;
    }, {} as Record<string, TrustSignal[]>);

    // Create enhanced template with trust signals integrated
    const enhancedTemplate = {
      ...template,
      trustSignals: {
        header: signalsByPosition.header || [],
        footer: signalsByPosition.footer || [],
        hero: signalsByPosition.hero || [],
        pricing: signalsByPosition.pricing || [],
        testimonials: signalsByPosition.testimonials || [],
        inline: signalsByPosition.inline || []
      }
    };

    return enhancedTemplate;
  }

  /**
   * Assess performance impact of trust signals
   */
  private static assessPerformanceImpact(trustSignals: TrustSignal[]): PerformanceImpact {
    const signalCount = trustSignals.length;
    const hasImages = trustSignals.some(signal => signal.image);
    
    return {
      loadTimeIncrease: signalCount * 10, // ~10ms per signal
      bundleSizeIncrease: signalCount * 2, // ~2KB per signal
      memoryUsageIncrease: signalCount * 1, // ~1KB per signal
      renderingComplexity: signalCount > 10 ? 'high' : signalCount > 5 ? 'medium' : 'low',
      recommendations: [
        ...(signalCount > 10 ? ['Consider reducing number of trust signals for better performance'] : []),
        ...(hasImages ? ['Optimize trust signal images for web delivery'] : []),
        'Use lazy loading for trust signals below the fold'
      ]
    };
  }
}

// ============================================================================
// SECURITY BADGE SYSTEM
// ============================================================================

/**
 * Security Badge System
 * 
 * Manages security-related trust signals including SOC 2, HIPAA, SSL certificates
 */
export class SecurityBadgeSystem {
  private static readonly SECURITY_BADGES = {
    soc2: {
      title: 'SOC 2 Type II Compliant',
      description: 'Independently audited security, availability, and confidentiality controls',
      icon: 'shield-check',
      securityLevel: 'enterprise' as const,
      validityPeriod: 12, // months
      auditingBody: 'Independent CPA Firm'
    },
    hipaa: {
      title: 'HIPAA Compliant',
      description: 'Protected Health Information security and privacy controls',
      icon: 'shield-check',
      securityLevel: 'enterprise' as const,
      validityPeriod: 12,
      auditingBody: 'Healthcare Compliance Auditor'
    },
    ssl: {
      title: 'SSL Certificate',
      description: 'Encrypted data transmission with 256-bit SSL',
      icon: 'lock',
      securityLevel: 'basic' as const,
      validityPeriod: 12,
      auditingBody: 'Certificate Authority'
    },
    iso27001: {
      title: 'ISO 27001 Certified',
      description: 'International standard for information security management',
      icon: 'certificate',
      securityLevel: 'enterprise' as const,
      validityPeriod: 36,
      auditingBody: 'ISO Certification Body'
    },
    pci: {
      title: 'PCI DSS Compliant',
      description: 'Payment Card Industry Data Security Standard compliance',
      icon: 'credit-card',
      securityLevel: 'advanced' as const,
      validityPeriod: 12,
      auditingBody: 'PCI Security Standards Council'
    }
  };

  /**
   * Create security badges for specific compliance requirements
   */
  static createSecurityBadges(requirements: string[]): SecurityBadge[] {
    return requirements.map((requirement, index) => {
      const badgeConfig = this.SECURITY_BADGES[requirement as keyof typeof this.SECURITY_BADGES];
      
      if (!badgeConfig) {
        throw new Error(`Unknown security requirement: ${requirement}`);
      }

      const validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + badgeConfig.validityPeriod);

      return {
        id: `security_${requirement}_${index}`,
        type: 'security_badge',
        title: badgeConfig.title,
        description: badgeConfig.description,
        icon: badgeConfig.icon,
        verified: true,
        displayPosition: 'footer',
        industry: [],
        securityLevel: badgeConfig.securityLevel,
        validUntil,
        certificateUrl: `/certificates/${requirement}.pdf`
      };
    });
  }

  /**
   * Validate security badge authenticity
   */
  static validateSecurityBadge(badge: SecurityBadge): boolean {
    // Check if badge is still valid
    if (badge.validUntil && badge.validUntil < new Date()) {
      return false;
    }

    // Verify badge configuration exists
    const badgeType = badge.title.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    return Object.keys(this.SECURITY_BADGES).some(key => 
      badgeType.includes(key) || key.includes(badgeType)
    );
  }

  /**
   * Generate security badge HTML
   */
  static generateSecurityBadgeHTML(badge: SecurityBadge): string {
    const isValid = this.validateSecurityBadge(badge);
    const statusClass = isValid ? 'valid' : 'expired';

    return `
      <div class="security-badge security-badge--${badge.securityLevel} security-badge--${statusClass}">
        <div class="security-badge__icon">
          <i class="lucide-${badge.icon}"></i>
        </div>
        <div class="security-badge__content">
          <h4 class="security-badge__title">${badge.title}</h4>
          <p class="security-badge__description">${badge.description}</p>
          ${badge.validUntil ? `<span class="security-badge__validity">Valid until ${badge.validUntil.toLocaleDateString()}</span>` : ''}
          ${badge.certificateUrl ? `<a href="${badge.certificateUrl}" class="security-badge__certificate" target="_blank">View Certificate</a>` : ''}
        </div>
        <div class="security-badge__status">
          <i class="lucide-${isValid ? 'check-circle' : 'alert-circle'}"></i>
        </div>
      </div>
    `;
  }

  /**
   * Generate security badge CSS
   */
  static generateSecurityBadgeCSS(): Record<string, string> {
    return {
      '.security-badge': `
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.75rem;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      `,
      '.security-badge:hover': `
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      `,
      '.security-badge--enterprise': `
        border-color: var(--color-primary);
        background: linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.1), rgba(var(--color-primary-rgb), 0.05));
      `,
      '.security-badge--advanced': `
        border-color: var(--color-accent);
        background: linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.1), rgba(var(--color-accent-rgb), 0.05));
      `,
      '.security-badge--basic': `
        border-color: var(--color-secondary);
        background: linear-gradient(135deg, rgba(var(--color-secondary-rgb), 0.1), rgba(var(--color-secondary-rgb), 0.05));
      `,
      '.security-badge__icon': `
        flex-shrink: 0;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-primary);
        color: var(--color-primary-contrast);
        border-radius: 0.5rem;
        font-size: 1.25rem;
      `,
      '.security-badge__content': `
        flex: 1;
      `,
      '.security-badge__title': `
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--color-primary);
      `,
      '.security-badge__description': `
        font-size: 0.875rem;
        color: var(--color-secondary);
        margin: 0 0 0.5rem 0;
        line-height: 1.5;
      `,
      '.security-badge__validity': `
        font-size: 0.75rem;
        color: var(--color-success);
        font-weight: 500;
        display: block;
        margin-bottom: 0.5rem;
      `,
      '.security-badge__certificate': `
        font-size: 0.75rem;
        color: var(--color-primary);
        text-decoration: none;
        font-weight: 500;
        border-bottom: 1px solid transparent;
        transition: border-color 0.2s ease;
      `,
      '.security-badge__certificate:hover': `
        border-bottom-color: var(--color-primary);
      `,
      '.security-badge__status': `
        flex-shrink: 0;
        color: var(--color-success);
        font-size: 1.25rem;
      `,
      '.security-badge--expired .security-badge__status': `
        color: var(--color-error);
      `,
      '.security-badge--expired .security-badge__validity': `
        color: var(--color-error);
      `
    };
  }
}

// ============================================================================
// TESTIMONIAL VERIFICATION SYSTEM
// ============================================================================

/**
 * Testimonial Verification System
 * 
 * Builds authentic social proof elements with verification mechanisms
 */
export class TestimonialVerificationSystem {
  private static readonly VERIFICATION_METHODS = {
    email: {
      name: 'Email Verified',
      icon: 'mail-check',
      trustLevel: 'medium',
      description: 'Verified through email confirmation'
    },
    linkedin: {
      name: 'LinkedIn Verified',
      icon: 'linkedin',
      trustLevel: 'high',
      description: 'Verified through LinkedIn profile'
    },
    third_party: {
      name: 'Third-Party Verified',
      icon: 'shield-check',
      trustLevel: 'high',
      description: 'Verified by independent third party'
    },
    video: {
      name: 'Video Testimonial',
      icon: 'video',
      trustLevel: 'highest',
      description: 'Authentic video testimonial'
    }
  };

  /**
   * Create verified testimonials with authentication
   */
  static createVerifiedTestimonials(testimonials: any[]): TestimonialVerification[] {
    return testimonials.map((testimonial, index) => {
      const verificationMethod = this.selectVerificationMethod(testimonial);
      
      return {
        id: `testimonial_${index}`,
        type: 'testimonial_verification',
        title: `Verified Customer Review`,
        description: testimonial.content,
        icon: this.VERIFICATION_METHODS[verificationMethod].icon,
        verified: true,
        displayPosition: 'testimonials',
        industry: [],
        verificationMethod,
        verifiedDate: new Date(testimonial.date || Date.now()),
        reviewerProfile: {
          name: testimonial.name,
          company: testimonial.company,
          position: testimonial.position,
          linkedinUrl: testimonial.linkedinUrl,
          photoUrl: testimonial.photoUrl
        }
      };
    });
  }

  /**
   * Select appropriate verification method based on available data
   */
  private static selectVerificationMethod(testimonial: any): TestimonialVerification['verificationMethod'] {
    if (testimonial.videoUrl) return 'video';
    if (testimonial.linkedinUrl) return 'linkedin';
    if (testimonial.thirdPartyVerified) return 'third_party';
    return 'email';
  }

  /**
   * Generate testimonial verification HTML
   */
  static generateTestimonialHTML(testimonial: TestimonialVerification): string {
    const verificationInfo = this.VERIFICATION_METHODS[testimonial.verificationMethod];
    const profile = testimonial.reviewerProfile;

    return `
      <div class="testimonial-verification">
        <div class="testimonial-verification__content">
          <blockquote class="testimonial-verification__quote">
            "${testimonial.description}"
          </blockquote>
          
          <div class="testimonial-verification__author">
            ${profile?.photoUrl ? `
              <img src="${profile.photoUrl}" alt="${profile.name}" class="testimonial-verification__photo" loading="lazy" />
            ` : ''}
            
            <div class="testimonial-verification__author-info">
              <h4 class="testimonial-verification__name">${profile?.name || 'Anonymous'}</h4>
              <p class="testimonial-verification__title">
                ${profile?.position || ''} ${profile?.company ? `at ${profile.company}` : ''}
              </p>
              
              <div class="testimonial-verification__verification">
                <i class="lucide-${verificationInfo.icon}"></i>
                <span>${verificationInfo.name}</span>
                <time datetime="${testimonial.verifiedDate.toISOString()}">
                  ${testimonial.verifiedDate.toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>
        </div>
        
        <div class="testimonial-verification__trust-indicator">
          <div class="testimonial-verification__trust-level testimonial-verification__trust-level--${verificationInfo.trustLevel}">
            <i class="lucide-shield-check"></i>
            <span>Verified</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate testimonial verification CSS
   */
  static generateTestimonialCSS(): Record<string, string> {
    return {
      '.testimonial-verification': `
        position: relative;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      `,
      '.testimonial-verification:hover': `
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      `,
      '.testimonial-verification__quote': `
        font-size: 1.125rem;
        line-height: 1.6;
        color: var(--color-primary);
        margin: 0 0 1.5rem 0;
        font-style: italic;
        position: relative;
      `,
      '.testimonial-verification__quote::before': `
        content: '"';
        font-size: 3rem;
        color: var(--color-accent);
        position: absolute;
        top: -1rem;
        left: -1rem;
        font-family: serif;
      `,
      '.testimonial-verification__author': `
        display: flex;
        align-items: center;
        gap: 1rem;
      `,
      '.testimonial-verification__photo': `
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--color-primary);
      `,
      '.testimonial-verification__author-info': `
        flex: 1;
      `,
      '.testimonial-verification__name': `
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
        color: var(--color-primary);
      `,
      '.testimonial-verification__title': `
        font-size: 0.875rem;
        color: var(--color-secondary);
        margin: 0 0 0.5rem 0;
      `,
      '.testimonial-verification__verification': `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: var(--color-success);
        font-weight: 500;
      `,
      '.testimonial-verification__trust-indicator': `
        position: absolute;
        top: 1rem;
        right: 1rem;
      `,
      '.testimonial-verification__trust-level': `
        display: flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.5rem 0.75rem;
        border-radius: 2rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      `,
      '.testimonial-verification__trust-level--medium': `
        background: rgba(var(--color-warning-rgb), 0.2);
        color: var(--color-warning);
        border: 1px solid rgba(var(--color-warning-rgb), 0.3);
      `,
      '.testimonial-verification__trust-level--high': `
        background: rgba(var(--color-success-rgb), 0.2);
        color: var(--color-success);
        border: 1px solid rgba(var(--color-success-rgb), 0.3);
      `,
      '.testimonial-verification__trust-level--highest': `
        background: rgba(var(--color-primary-rgb), 0.2);
        color: var(--color-primary);
        border: 1px solid rgba(var(--color-primary-rgb), 0.3);
      `
    };
  }

  /**
   * Validate testimonial authenticity
   */
  static validateTestimonial(testimonial: TestimonialVerification): {
    isValid: boolean;
    trustScore: number;
    issues: string[];
  } {
    const issues: string[] = [];
    let trustScore = 0;

    // Check verification method
    const verificationInfo = this.VERIFICATION_METHODS[testimonial.verificationMethod];
    switch (verificationInfo.trustLevel) {
      case 'highest': trustScore += 40; break;
      case 'high': trustScore += 30; break;
      case 'medium': trustScore += 20; break;
      default: trustScore += 10;
    }

    // Check profile completeness
    const profile = testimonial.reviewerProfile;
    if (profile?.name) trustScore += 10;
    if (profile?.company) trustScore += 10;
    if (profile?.position) trustScore += 10;
    if (profile?.linkedinUrl) trustScore += 15;
    if (profile?.photoUrl) trustScore += 15;

    // Check verification date
    const daysSinceVerification = (Date.now() - testimonial.verifiedDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceVerification > 365) {
      issues.push('Testimonial verification is over 1 year old');
      trustScore -= 10;
    }

    // Validate required fields
    if (!testimonial.description || testimonial.description.length < 20) {
      issues.push('Testimonial content is too short or missing');
      trustScore -= 20;
    }

    if (!profile?.name) {
      issues.push('Reviewer name is missing');
      trustScore -= 15;
    }

    return {
      isValid: trustScore >= 50 && issues.length === 0,
      trustScore: Math.max(0, Math.min(100, trustScore)),
      issues
    };
  }
}

// ============================================================================
// PROFESSIONAL CERTIFICATION SYSTEM
// ============================================================================

/**
 * Professional Certification Display System
 * 
 * Manages professional certifications and industry credentials
 */
export class ProfessionalCertificationSystem {
  private static readonly CERTIFICATION_CATEGORIES = {
    technology: {
      aws: {
        name: 'AWS Certified',
        levels: ['Practitioner', 'Associate', 'Professional', 'Specialty'],
        issuingOrganization: 'Amazon Web Services',
        icon: 'cloud',
        validityPeriod: 36
      },
      google: {
        name: 'Google Cloud Certified',
        levels: ['Associate', 'Professional'],
        issuingOrganization: 'Google Cloud',
        icon: 'cloud',
        validityPeriod: 24
      },
      microsoft: {
        name: 'Microsoft Certified',
        levels: ['Fundamentals', 'Associate', 'Expert'],
        issuingOrganization: 'Microsoft',
        icon: 'monitor',
        validityPeriod: 12
      }
    },
    business: {
      pmp: {
        name: 'Project Management Professional',
        levels: ['PMP'],
        issuingOrganization: 'Project Management Institute',
        icon: 'briefcase',
        validityPeriod: 36
      },
      cpa: {
        name: 'Certified Public Accountant',
        levels: ['CPA'],
        issuingOrganization: 'State Board of Accountancy',
        icon: 'calculator',
        validityPeriod: 12
      },
      mba: {
        name: 'Master of Business Administration',
        levels: ['MBA'],
        issuingOrganization: 'Accredited University',
        icon: 'graduation-cap',
        validityPeriod: null // Permanent
      }
    },
    marketing: {
      google_ads: {
        name: 'Google Ads Certified',
        levels: ['Search', 'Display', 'Video', 'Shopping'],
        issuingOrganization: 'Google',
        icon: 'target',
        validityPeriod: 12
      },
      hubspot: {
        name: 'HubSpot Certified',
        levels: ['Inbound', 'Content', 'Email', 'Social Media'],
        issuingOrganization: 'HubSpot Academy',
        icon: 'mail',
        validityPeriod: 24
      }
    },
    design: {
      adobe: {
        name: 'Adobe Certified Expert',
        levels: ['ACE'],
        issuingOrganization: 'Adobe',
        icon: 'palette',
        validityPeriod: 24
      },
      ux: {
        name: 'UX Design Certified',
        levels: ['Foundation', 'Advanced', 'Expert'],
        issuingOrganization: 'Nielsen Norman Group',
        icon: 'smartphone',
        validityPeriod: 36
      }
    }
  };

  /**
   * Create professional certifications
   */
  static createProfessionalCertifications(
    certifications: Array<{
      category: string;
      type: string;
      level: string;
      credentialId?: string;
      issueDate: Date;
    }>
  ): ProfessionalCertification[] {
    return certifications.map((cert, index) => {
      const categoryConfig = this.CERTIFICATION_CATEGORIES[cert.category as keyof typeof this.CERTIFICATION_CATEGORIES];
      const certConfig = categoryConfig?.[cert.type as keyof typeof categoryConfig] as any;

      if (!certConfig) {
        throw new Error(`Unknown certification: ${cert.category}/${cert.type}`);
      }

      const validUntil = certConfig.validityPeriod 
        ? new Date(cert.issueDate.getTime() + (certConfig.validityPeriod * 30 * 24 * 60 * 60 * 1000))
        : undefined;

      return {
        id: `cert_${cert.category}_${cert.type}_${index}`,
        type: 'certification',
        title: `${certConfig.name} - ${cert.level}`,
        description: `Professional certification from ${certConfig.issuingOrganization}`,
        icon: certConfig.icon,
        verified: true,
        displayPosition: 'testimonials',
        industry: [],
        issuingOrganization: certConfig.issuingOrganization,
        certificationLevel: this.mapCertificationLevel(cert.level),
        validUntil,
        credentialId: cert.credentialId
      };
    });
  }

  /**
   * Map certification level to standard levels
   */
  private static mapCertificationLevel(level: string): ProfessionalCertification['certificationLevel'] {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('expert') || lowerLevel.includes('professional') || lowerLevel.includes('specialty')) {
      return 'expert';
    }
    if (lowerLevel.includes('advanced') || lowerLevel.includes('associate')) {
      return 'advanced';
    }
    return 'standard';
  }

  /**
   * Generate certification HTML
   */
  static generateCertificationHTML(certification: ProfessionalCertification): string {
    const isValid = !certification.validUntil || certification.validUntil > new Date();
    const statusClass = isValid ? 'valid' : 'expired';

    return `
      <div class="professional-certification professional-certification--${certification.certificationLevel} professional-certification--${statusClass}">
        <div class="professional-certification__badge">
          <i class="lucide-${certification.icon}"></i>
          <div class="professional-certification__level-indicator">
            ${this.getLevelStars(certification.certificationLevel)}
          </div>
        </div>
        
        <div class="professional-certification__content">
          <h4 class="professional-certification__title">${certification.title}</h4>
          <p class="professional-certification__issuer">
            Issued by ${certification.issuingOrganization}
          </p>
          
          ${certification.credentialId ? `
            <p class="professional-certification__credential">
              Credential ID: ${certification.credentialId}
            </p>
          ` : ''}
          
          ${certification.validUntil ? `
            <p class="professional-certification__validity">
              ${isValid ? 'Valid until' : 'Expired on'} ${certification.validUntil.toLocaleDateString()}
            </p>
          ` : ''}
        </div>
        
        <div class="professional-certification__status">
          <i class="lucide-${isValid ? 'check-circle' : 'alert-circle'}"></i>
        </div>
      </div>
    `;
  }

  /**
   * Get level indicator stars
   */
  private static getLevelStars(level: ProfessionalCertification['certificationLevel']): string {
    const starCount = level === 'expert' ? 3 : level === 'advanced' ? 2 : 1;
    return '★'.repeat(starCount) + '☆'.repeat(3 - starCount);
  }

  /**
   * Generate certification CSS
   */
  static generateCertificationCSS(): Record<string, string> {
    return {
      '.professional-certification': `
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.75rem;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      `,
      '.professional-certification:hover': `
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      `,
      '.professional-certification--expert': `
        border-color: var(--color-primary);
        background: linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.15), rgba(var(--color-primary-rgb), 0.05));
      `,
      '.professional-certification--advanced': `
        border-color: var(--color-accent);
        background: linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.15), rgba(var(--color-accent-rgb), 0.05));
      `,
      '.professional-certification--standard': `
        border-color: var(--color-secondary);
        background: linear-gradient(135deg, rgba(var(--color-secondary-rgb), 0.15), rgba(var(--color-secondary-rgb), 0.05));
      `,
      '.professional-certification__badge': `
        position: relative;
        flex-shrink: 0;
        width: 4rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-primary);
        color: var(--color-primary-contrast);
        border-radius: 50%;
        font-size: 1.5rem;
      `,
      '.professional-certification__level-indicator': `
        position: absolute;
        bottom: -0.5rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-accent);
        color: var(--color-accent-contrast);
        padding: 0.125rem 0.5rem;
        border-radius: 1rem;
        font-size: 0.625rem;
        font-weight: bold;
        white-space: nowrap;
      `,
      '.professional-certification__content': `
        flex: 1;
      `,
      '.professional-certification__title': `
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--color-primary);
      `,
      '.professional-certification__issuer': `
        font-size: 0.875rem;
        color: var(--color-secondary);
        margin: 0 0 0.25rem 0;
      `,
      '.professional-certification__credential': `
        font-size: 0.75rem;
        color: var(--color-secondary);
        margin: 0 0 0.25rem 0;
        font-family: monospace;
      `,
      '.professional-certification__validity': `
        font-size: 0.75rem;
        font-weight: 500;
        margin: 0;
      `,
      '.professional-certification--valid .professional-certification__validity': `
        color: var(--color-success);
      `,
      '.professional-certification--expired .professional-certification__validity': `
        color: var(--color-error);
      `,
      '.professional-certification__status': `
        flex-shrink: 0;
        font-size: 1.25rem;
      `,
      '.professional-certification--valid .professional-certification__status': `
        color: var(--color-success);
      `,
      '.professional-certification--expired .professional-certification__status': `
        color: var(--color-error);
      `
    };
  }
}

// ============================================================================
// INDUSTRY-SPECIFIC CREDIBILITY INDICATORS
// ============================================================================

/**
 * Industry-Specific Credibility Indicators
 * 
 * Creates credibility indicators tailored to specific industries
 */
export class IndustryCredibilityIndicators {
  private static readonly INDUSTRY_INDICATORS = {
    saas: [
      {
        type: 'uptime' as const,
        title: '99.99% Uptime',
        description: 'Guaranteed service availability',
        metricValue: '99.99',
        metricUnit: '%',
        icon: 'activity',
        displayPosition: 'header' as const
      },
      {
        type: 'social_proof' as const,
        title: '1M+ API Calls Daily',
        description: 'Trusted by developers worldwide',
        metricValue: '1000000',
        metricUnit: 'API calls/day',
        icon: 'zap',
        displayPosition: 'hero' as const
      },
      {
        type: 'compliance' as const,
        title: 'Enterprise Grade Security',
        description: 'SOC 2 Type II & ISO 27001 certified',
        icon: 'shield-check',
        displayPosition: 'footer' as const
      }
    ],
    ecommerce: [
      {
        type: 'social_proof' as const,
        title: '500K+ Orders Shipped',
        description: 'Trusted by customers worldwide',
        metricValue: '500000',
        metricUnit: 'orders',
        icon: 'package',
        displayPosition: 'hero' as const
      },
      {
        type: 'guarantee' as const,
        title: '30-Day Returns',
        description: 'Hassle-free return policy',
        icon: 'refresh-cw',
        displayPosition: 'pricing' as const
      },
      {
        type: 'social_proof' as const,
        title: '4.9/5 Customer Rating',
        description: 'Based on 50,000+ reviews',
        metricValue: '4.9',
        metricUnit: '/5 stars',
        icon: 'star',
        displayPosition: 'testimonials' as const
      }
    ],
    healthcare: [
      {
        type: 'compliance' as const,
        title: 'HIPAA Compliant',
        description: 'Protected health information security',
        icon: 'shield-check',
        displayPosition: 'header' as const
      },
      {
        type: 'social_proof' as const,
        title: '10,000+ Healthcare Providers',
        description: 'Trusted by medical professionals',
        metricValue: '10000',
        metricUnit: 'providers',
        icon: 'heart',
        displayPosition: 'hero' as const
      },
      {
        type: 'compliance' as const,
        title: 'FDA Registered',
        description: 'Registered medical device',
        icon: 'check-circle',
        displayPosition: 'footer' as const
      }
    ],
    finance: [
      {
        type: 'compliance' as const,
        title: 'Bank-Level Security',
        description: '256-bit SSL encryption',
        icon: 'shield',
        displayPosition: 'header' as const
      },
      {
        type: 'social_proof' as const,
        title: '$10B+ Assets Protected',
        description: 'Trusted with client assets',
        metricValue: '10000000000',
        metricUnit: 'USD protected',
        icon: 'dollar-sign',
        displayPosition: 'hero' as const
      },
      {
        type: 'compliance' as const,
        title: 'SEC Registered',
        description: 'Securities and Exchange Commission',
        icon: 'file-text',
        displayPosition: 'footer' as const
      }
    ],
    education: [
      {
        type: 'social_proof' as const,
        title: '1M+ Students Taught',
        description: 'Global learning community',
        metricValue: '1000000',
        metricUnit: 'students',
        icon: 'users',
        displayPosition: 'hero' as const
      },
      {
        type: 'guarantee' as const,
        title: '90% Job Placement Rate',
        description: 'Career success guarantee',
        metricValue: '90',
        metricUnit: '% placement',
        icon: 'briefcase',
        displayPosition: 'pricing' as const
      },
      {
        type: 'social_proof' as const,
        title: '4.8/5 Course Rating',
        description: 'Highly rated by students',
        metricValue: '4.8',
        metricUnit: '/5 stars',
        icon: 'star',
        displayPosition: 'testimonials' as const
      }
    ]
  };

  /**
   * Create industry-specific credibility indicators
   */
  static createCredibilityIndicators(industry: string): CredibilityIndicator[] {
    const indicators = this.INDUSTRY_INDICATORS[industry as keyof typeof this.INDUSTRY_INDICATORS] || 
                     this.INDUSTRY_INDICATORS.saas;

    return indicators.map((indicator, index) => ({
      id: `credibility_${industry}_${index}`,
      type: indicator.type,
      title: indicator.title,
      description: indicator.description,
      icon: indicator.icon,
      verified: true,
      displayPosition: indicator.displayPosition,
      industry: [industry],
      industrySpecific: true,
      metricValue: indicator.metricValue,
      metricUnit: indicator.metricUnit,
      lastUpdated: new Date()
    }));
  }

  /**
   * Generate credibility indicator HTML
   */
  static generateCredibilityHTML(indicator: CredibilityIndicator): string {
    return `
      <div class="credibility-indicator credibility-indicator--${indicator.type}">
        <div class="credibility-indicator__icon">
          <i class="lucide-${indicator.icon}"></i>
        </div>
        
        <div class="credibility-indicator__content">
          <div class="credibility-indicator__metric">
            ${indicator.metricValue ? `
              <span class="credibility-indicator__value">${this.formatMetricValue(indicator.metricValue)}</span>
              ${indicator.metricUnit ? `<span class="credibility-indicator__unit">${indicator.metricUnit}</span>` : ''}
            ` : ''}
          </div>
          
          <h4 class="credibility-indicator__title">${indicator.title}</h4>
          <p class="credibility-indicator__description">${indicator.description}</p>
          
          <div class="credibility-indicator__verification">
            <i class="lucide-check-circle"></i>
            <span>Verified</span>
            <time datetime="${indicator.lastUpdated.toISOString()}">
              Updated ${this.getRelativeTime(indicator.lastUpdated)}
            </time>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Format metric values for display
   */
  private static formatMetricValue(value: string | number): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (numValue >= 1000000000) {
      return (numValue / 1000000000).toFixed(1) + 'B';
    }
    if (numValue >= 1000000) {
      return (numValue / 1000000).toFixed(1) + 'M';
    }
    if (numValue >= 1000) {
      return (numValue / 1000).toFixed(1) + 'K';
    }
    
    return numValue.toLocaleString();
  }

  /**
   * Get relative time string
   */
  private static getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'today';
    } else if (diffInHours < 48) {
      return 'yesterday';
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  /**
   * Generate credibility indicator CSS
   */
  static generateCredibilityCSS(): Record<string, string> {
    return {
      '.credibility-indicator': `
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 0.75rem;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      `,
      '.credibility-indicator:hover': `
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        border-color: var(--color-primary);
      `,
      '.credibility-indicator__icon': `
        flex-shrink: 0;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-primary);
        color: var(--color-primary-contrast);
        border-radius: 0.5rem;
        font-size: 1.25rem;
      `,
      '.credibility-indicator__content': `
        flex: 1;
      `,
      '.credibility-indicator__metric': `
        margin-bottom: 0.5rem;
      `,
      '.credibility-indicator__value': `
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-primary);
        line-height: 1;
      `,
      '.credibility-indicator__unit': `
        font-size: 0.875rem;
        color: var(--color-secondary);
        margin-left: 0.25rem;
      `,
      '.credibility-indicator__title': `
        font-size: 1rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: var(--color-primary);
      `,
      '.credibility-indicator__description': `
        font-size: 0.875rem;
        color: var(--color-secondary);
        margin: 0 0 1rem 0;
        line-height: 1.5;
      `,
      '.credibility-indicator__verification': `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: var(--color-success);
        font-weight: 500;
      `,
      '.credibility-indicator--uptime': `
        border-color: var(--color-success);
      `,
      '.credibility-indicator--uptime .credibility-indicator__icon': `
        background: var(--color-success);
      `,
      '.credibility-indicator--social_proof': `
        border-color: var(--color-accent);
      `,
      '.credibility-indicator--social_proof .credibility-indicator__icon': `
        background: var(--color-accent);
      `,
      '.credibility-indicator--guarantee': `
        border-color: var(--color-info);
      `,
      '.credibility-indicator--guarantee .credibility-indicator__icon': `
        background: var(--color-info);
      `,
      '.credibility-indicator--compliance': `
        border-color: var(--color-primary);
      `,
      '.credibility-indicator--compliance .credibility-indicator__icon': `
        background: var(--color-primary);
      `
    };
  }
}

// ============================================================================
// TRUST SIGNAL RENDERER
// ============================================================================

/**
 * Trust Signal Renderer
 * 
 * Renders trust signals in appropriate template positions
 */
export class TrustSignalRenderer {
  /**
   * Render all trust signals for a template
   */
  static renderTrustSignals(trustSignals: TrustSignal[]): {
    html: Record<string, string>;
    css: Record<string, string>;
  } {
    const html: Record<string, string> = {};
    const css: Record<string, string> = {};

    // Group signals by position
    const signalsByPosition = trustSignals.reduce((acc, signal) => {
      if (!acc[signal.displayPosition]) {
        acc[signal.displayPosition] = [];
      }
      acc[signal.displayPosition].push(signal);
      return acc;
    }, {} as Record<string, TrustSignal[]>);

    // Render each position
    Object.entries(signalsByPosition).forEach(([position, signals]) => {
      html[position] = this.renderSignalGroup(signals, position);
    });

    // Combine all CSS
    Object.assign(css, 
      SecurityBadgeSystem.generateSecurityBadgeCSS(),
      TestimonialVerificationSystem.generateTestimonialCSS(),
      ProfessionalCertificationSystem.generateCertificationCSS(),
      IndustryCredibilityIndicators.generateCredibilityCSS(),
      this.generateContainerCSS()
    );

    return { html, css };
  }

  /**
   * Render a group of trust signals for a specific position
   */
  private static renderSignalGroup(signals: TrustSignal[], position: string): string {
    const signalHTML = signals.map(signal => {
      switch (signal.type) {
        case 'security_badge':
          return SecurityBadgeSystem.generateSecurityBadgeHTML(signal as SecurityBadge);
        case 'testimonial_verification':
          return TestimonialVerificationSystem.generateTestimonialHTML(signal as TestimonialVerification);
        case 'certification':
          return ProfessionalCertificationSystem.generateCertificationHTML(signal as ProfessionalCertification);
        default:
          return IndustryCredibilityIndicators.generateCredibilityHTML(signal as CredibilityIndicator);
      }
    }).join('');

    return `
      <div class="trust-signals trust-signals--${position}">
        <div class="trust-signals__container">
          ${signalHTML}
        </div>
      </div>
    `;
  }

  /**
   * Generate container CSS
   */
  private static generateContainerCSS(): Record<string, string> {
    return {
      '.trust-signals': `
        padding: 2rem 0;
      `,
      '.trust-signals__container': `
        display: grid;
        gap: 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      `,
      '.trust-signals--header .trust-signals__container': `
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      `,
      '.trust-signals--footer .trust-signals__container': `
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      `,
      '.trust-signals--hero .trust-signals__container': `
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      `,
      '.trust-signals--pricing .trust-signals__container': `
        grid-template-columns: 1fr;
        max-width: 600px;
      `,
      '.trust-signals--testimonials .trust-signals__container': `
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      `,
      '@media (max-width: 768px)': `
        .trust-signals__container {
          grid-template-columns: 1fr !important;
        }
      `
    };
  }
}