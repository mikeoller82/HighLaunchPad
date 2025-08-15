/**
 * Trust Signal System Test Suite
 * 
 * Comprehensive tests for the trust signal and credibility system
 */

import {
  TrustSignalManager,
  SecurityBadgeSystem,
  TestimonialVerificationSystem,
  ProfessionalCertificationSystem,
  IndustryCredibilityIndicators,
  TrustSignalRenderer
} from './trust-signal-manager';
import type { TrustSignalContext } from './trust-signal-manager';
import type { Template } from '../website-templates';
import type { FunnelTemplate } from '../types';

// ============================================================================
// TEST DATA
// ============================================================================

const mockTemplate: Template = {
  id: 'test-template',
  name: 'Test Template',
  category: 'business',
  description: 'Test template for trust signals',
  components: [],
  styles: {},
  metadata: {
    industry: 'saas',
    targetAudience: 'b2b',
    conversionGoals: ['lead_generation']
  }
};

const mockFunnelTemplate: FunnelTemplate = {
  id: 'test-funnel',
  name: 'Test Funnel',
  category: 'lead-generation',
  description: 'Test funnel for trust signals',
  pages: [],
  metadata: {
    industry: 'ecommerce',
    targetAudience: 'b2c'
  }
};

const saasContext: TrustSignalContext = {
  industry: 'saas',
  templateType: 'website',
  targetAudience: 'b2b',
  businessSize: 'enterprise',
  complianceRequirements: ['SOC 2', 'GDPR', 'ISO 27001'],
  existingCredentials: ['soc2', 'gdpr']
};

const ecommerceContext: TrustSignalContext = {
  industry: 'ecommerce',
  templateType: 'funnel',
  targetAudience: 'b2c',
  businessSize: 'smb',
  complianceRequirements: ['SSL', 'PCI DSS'],
  existingCredentials: ['ssl']
};

const healthcareContext: TrustSignalContext = {
  industry: 'healthcare',
  templateType: 'website',
  targetAudience: 'b2b',
  businessSize: 'enterprise',
  complianceRequirements: ['HIPAA', 'FDA'],
  existingCredentials: ['hipaa']
};

// ============================================================================
// TRUST SIGNAL MANAGER TESTS
// ============================================================================

/**
 * Test Trust Signal Manager functionality
 */
export async function testTrustSignalManager(): Promise<void> {
  console.log('🧪 Testing Trust Signal Manager...');

  try {
    // Test SaaS industry signals
    console.log('  Testing SaaS trust signals...');
    const saasResult = await TrustSignalManager.applyTrustSignals(mockTemplate, saasContext);
    
    if (!saasResult.success) {
      throw new Error(`SaaS trust signals failed: ${saasResult.errors.map(e => e.message).join(', ')}`);
    }

    console.log(`    ✅ Applied ${saasResult.data?.trustSignals.length} SaaS trust signals`);
    console.log(`    ✅ Processing time: ${saasResult.metadata.processingTime}ms`);

    // Test E-commerce industry signals
    console.log('  Testing E-commerce trust signals...');
    const ecommerceResult = await TrustSignalManager.applyTrustSignals(mockFunnelTemplate, ecommerceContext);
    
    if (!ecommerceResult.success) {
      throw new Error(`E-commerce trust signals failed: ${ecommerceResult.errors.map(e => e.message).join(', ')}`);
    }

    console.log(`    ✅ Applied ${ecommerceResult.data?.trustSignals.length} E-commerce trust signals`);

    // Test Healthcare industry signals
    console.log('  Testing Healthcare trust signals...');
    const healthcareResult = await TrustSignalManager.applyTrustSignals(mockTemplate, healthcareContext);
    
    if (!healthcareResult.success) {
      throw new Error(`Healthcare trust signals failed: ${healthcareResult.errors.map(e => e.message).join(', ')}`);
    }

    console.log(`    ✅ Applied ${healthcareResult.data?.trustSignals.length} Healthcare trust signals`);

    // Verify trust signals are properly categorized
    const trustSignals = saasResult.data?.trustSignals || [];
    const signalTypes = [...new Set(trustSignals.map(s => s.type))];
    console.log(`    ✅ Signal types: ${signalTypes.join(', ')}`);

    // Verify display positions
    const positions = [...new Set(trustSignals.map(s => s.displayPosition))];
    console.log(`    ✅ Display positions: ${positions.join(', ')}`);

    console.log('  ✅ Trust Signal Manager tests passed');
  } catch (error) {
    console.error('  ❌ Trust Signal Manager tests failed:', error);
    throw error;
  }
}

// ============================================================================
// SECURITY BADGE SYSTEM TESTS
// ============================================================================

/**
 * Test Security Badge System functionality
 */
export function testSecurityBadgeSystem(): void {
  console.log('🔒 Testing Security Badge System...');

  try {
    // Test security badge creation
    console.log('  Testing security badge creation...');
    const securityRequirements = ['soc2', 'hipaa', 'ssl', 'iso27001', 'pci'];
    const badges = SecurityBadgeSystem.createSecurityBadges(securityRequirements);

    if (badges.length !== securityRequirements.length) {
      throw new Error(`Expected ${securityRequirements.length} badges, got ${badges.length}`);
    }

    console.log(`    ✅ Created ${badges.length} security badges`);

    // Test badge validation
    console.log('  Testing badge validation...');
    badges.forEach((badge, index) => {
      const isValid = SecurityBadgeSystem.validateSecurityBadge(badge);
      if (!isValid) {
        throw new Error(`Badge ${index} validation failed`);
      }
    });

    console.log('    ✅ All badges validated successfully');

    // Test HTML generation
    console.log('  Testing HTML generation...');
    badges.forEach(badge => {
      const html = SecurityBadgeSystem.generateSecurityBadgeHTML(badge);
      if (!html.includes(badge.title) || !html.includes(badge.description)) {
        throw new Error(`HTML generation failed for badge: ${badge.title}`);
      }
    });

    console.log('    ✅ HTML generation successful');

    // Test CSS generation
    console.log('  Testing CSS generation...');
    const css = SecurityBadgeSystem.generateSecurityBadgeCSS();
    const expectedClasses = ['.security-badge', '.security-badge__icon', '.security-badge__content'];
    
    expectedClasses.forEach(className => {
      if (!css[className]) {
        throw new Error(`Missing CSS class: ${className}`);
      }
    });

    console.log('    ✅ CSS generation successful');
    console.log('  ✅ Security Badge System tests passed');
  } catch (error) {
    console.error('  ❌ Security Badge System tests failed:', error);
    throw error;
  }
}

// ============================================================================
// TESTIMONIAL VERIFICATION SYSTEM TESTS
// ============================================================================

/**
 * Test Testimonial Verification System functionality
 */
export function testTestimonialVerificationSystem(): void {
  console.log('👥 Testing Testimonial Verification System...');

  try {
    // Test testimonial creation
    console.log('  Testing testimonial creation...');
    const mockTestimonials = [
      {
        name: 'John Smith',
        company: 'Tech Corp',
        position: 'CTO',
        content: 'This product has revolutionized our workflow and increased productivity by 300%.',
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
        photoUrl: 'https://example.com/john.jpg',
        date: '2024-01-15'
      },
      {
        name: 'Sarah Johnson',
        company: 'Marketing Inc',
        position: 'Marketing Director',
        content: 'Outstanding service and support. Highly recommend to any business.',
        videoUrl: 'https://example.com/testimonial.mp4',
        date: '2024-02-01'
      },
      {
        name: 'Mike Davis',
        company: 'Startup LLC',
        position: 'Founder',
        content: 'Game-changing solution that helped us scale from 10 to 100 customers.',
        thirdPartyVerified: true,
        date: '2024-01-20'
      }
    ];

    const testimonials = TestimonialVerificationSystem.createVerifiedTestimonials(mockTestimonials);

    if (testimonials.length !== mockTestimonials.length) {
      throw new Error(`Expected ${mockTestimonials.length} testimonials, got ${testimonials.length}`);
    }

    console.log(`    ✅ Created ${testimonials.length} verified testimonials`);

    // Test testimonial validation
    console.log('  Testing testimonial validation...');
    testimonials.forEach((testimonial, index) => {
      const validation = TestimonialVerificationSystem.validateTestimonial(testimonial);
      console.log(`    Testimonial ${index + 1}: Valid=${validation.isValid}, Score=${validation.trustScore}`);
      
      if (validation.issues.length > 0) {
        console.log(`      Issues: ${validation.issues.join(', ')}`);
      }
    });

    console.log('    ✅ Testimonial validation completed');

    // Test HTML generation
    console.log('  Testing HTML generation...');
    testimonials.forEach(testimonial => {
      const html = TestimonialVerificationSystem.generateTestimonialHTML(testimonial);
      if (!html.includes(testimonial.description) || !html.includes('Verified')) {
        throw new Error(`HTML generation failed for testimonial: ${testimonial.id}`);
      }
    });

    console.log('    ✅ HTML generation successful');

    // Test CSS generation
    console.log('  Testing CSS generation...');
    const css = TestimonialVerificationSystem.generateTestimonialCSS();
    const expectedClasses = ['.testimonial-verification', '.testimonial-verification__quote'];
    
    expectedClasses.forEach(className => {
      if (!css[className]) {
        throw new Error(`Missing CSS class: ${className}`);
      }
    });

    console.log('    ✅ CSS generation successful');
    console.log('  ✅ Testimonial Verification System tests passed');
  } catch (error) {
    console.error('  ❌ Testimonial Verification System tests failed:', error);
    throw error;
  }
}

// ============================================================================
// PROFESSIONAL CERTIFICATION SYSTEM TESTS
// ============================================================================

/**
 * Test Professional Certification System functionality
 */
export function testProfessionalCertificationSystem(): void {
  console.log('🎓 Testing Professional Certification System...');

  try {
    // Test certification creation
    console.log('  Testing certification creation...');
    const mockCertifications = [
      {
        category: 'technology',
        type: 'aws',
        level: 'Professional',
        credentialId: 'AWS-12345',
        issueDate: new Date('2023-06-01')
      },
      {
        category: 'business',
        type: 'pmp',
        level: 'PMP',
        credentialId: 'PMP-67890',
        issueDate: new Date('2022-03-15')
      },
      {
        category: 'marketing',
        type: 'google_ads',
        level: 'Search',
        issueDate: new Date('2024-01-10')
      }
    ];

    const certifications = ProfessionalCertificationSystem.createProfessionalCertifications(mockCertifications);

    if (certifications.length !== mockCertifications.length) {
      throw new Error(`Expected ${mockCertifications.length} certifications, got ${certifications.length}`);
    }

    console.log(`    ✅ Created ${certifications.length} professional certifications`);

    // Verify certification levels
    const levels = certifications.map(cert => cert.certificationLevel);
    console.log(`    ✅ Certification levels: ${levels.join(', ')}`);

    // Test HTML generation
    console.log('  Testing HTML generation...');
    certifications.forEach(certification => {
      const html = ProfessionalCertificationSystem.generateCertificationHTML(certification);
      if (!html.includes(certification.title) || !html.includes(certification.issuingOrganization)) {
        throw new Error(`HTML generation failed for certification: ${certification.title}`);
      }
    });

    console.log('    ✅ HTML generation successful');

    // Test CSS generation
    console.log('  Testing CSS generation...');
    const css = ProfessionalCertificationSystem.generateCertificationCSS();
    const expectedClasses = ['.professional-certification', '.professional-certification__badge'];
    
    expectedClasses.forEach(className => {
      if (!css[className]) {
        throw new Error(`Missing CSS class: ${className}`);
      }
    });

    console.log('    ✅ CSS generation successful');
    console.log('  ✅ Professional Certification System tests passed');
  } catch (error) {
    console.error('  ❌ Professional Certification System tests failed:', error);
    throw error;
  }
}

// ============================================================================
// INDUSTRY CREDIBILITY INDICATORS TESTS
// ============================================================================

/**
 * Test Industry Credibility Indicators functionality
 */
export function testIndustryCredibilityIndicators(): void {
  console.log('📊 Testing Industry Credibility Indicators...');

  try {
    // Test indicator creation for different industries
    const industries = ['saas', 'ecommerce', 'healthcare', 'finance', 'education'];
    
    industries.forEach(industry => {
      console.log(`  Testing ${industry} indicators...`);
      
      const indicators = IndustryCredibilityIndicators.createCredibilityIndicators(industry);
      
      if (indicators.length === 0) {
        throw new Error(`No indicators created for industry: ${industry}`);
      }

      console.log(`    ✅ Created ${indicators.length} indicators for ${industry}`);

      // Verify all indicators are industry-specific
      indicators.forEach(indicator => {
        if (!indicator.industrySpecific) {
          throw new Error(`Indicator should be industry-specific: ${indicator.title}`);
        }
      });

      // Test HTML generation
      indicators.forEach(indicator => {
        const html = IndustryCredibilityIndicators.generateCredibilityHTML(indicator);
        if (!html.includes(indicator.title) || !html.includes('Verified')) {
          throw new Error(`HTML generation failed for indicator: ${indicator.title}`);
        }
      });
    });

    console.log('  Testing CSS generation...');
    const css = IndustryCredibilityIndicators.generateCredibilityCSS();
    const expectedClasses = ['.credibility-indicator', '.credibility-indicator__icon'];
    
    expectedClasses.forEach(className => {
      if (!css[className]) {
        throw new Error(`Missing CSS class: ${className}`);
      }
    });

    console.log('    ✅ CSS generation successful');
    console.log('  ✅ Industry Credibility Indicators tests passed');
  } catch (error) {
    console.error('  ❌ Industry Credibility Indicators tests failed:', error);
    throw error;
  }
}

// ============================================================================
// TRUST SIGNAL RENDERER TESTS
// ============================================================================

/**
 * Test Trust Signal Renderer functionality
 */
export async function testTrustSignalRenderer(): Promise<void> {
  console.log('🎨 Testing Trust Signal Renderer...');

  try {
    // Create a mix of trust signals
    console.log('  Creating mixed trust signals...');
    
    const securityBadges = SecurityBadgeSystem.createSecurityBadges(['soc2', 'ssl']);
    const testimonials = TestimonialVerificationSystem.createVerifiedTestimonials([
      {
        name: 'Test User',
        company: 'Test Corp',
        position: 'CEO',
        content: 'Great product!',
        date: '2024-01-01'
      }
    ]);
    const certifications = ProfessionalCertificationSystem.createProfessionalCertifications([
      {
        category: 'technology',
        type: 'aws',
        level: 'Professional',
        issueDate: new Date()
      }
    ]);
    const indicators = IndustryCredibilityIndicators.createCredibilityIndicators('saas');

    const allSignals = [...securityBadges, ...testimonials, ...certifications, ...indicators];
    console.log(`    ✅ Created ${allSignals.length} mixed trust signals`);

    // Test rendering
    console.log('  Testing trust signal rendering...');
    const rendered = TrustSignalRenderer.renderTrustSignals(allSignals);

    // Verify HTML output
    if (!rendered.html || Object.keys(rendered.html).length === 0) {
      throw new Error('No HTML output generated');
    }

    console.log(`    ✅ Generated HTML for ${Object.keys(rendered.html).length} positions`);

    // Verify CSS output
    if (!rendered.css || Object.keys(rendered.css).length === 0) {
      throw new Error('No CSS output generated');
    }

    console.log(`    ✅ Generated ${Object.keys(rendered.css).length} CSS rules`);

    // Verify positions are handled correctly
    const positions = Object.keys(rendered.html);
    console.log(`    ✅ Rendered positions: ${positions.join(', ')}`);

    console.log('  ✅ Trust Signal Renderer tests passed');
  } catch (error) {
    console.error('  ❌ Trust Signal Renderer tests failed:', error);
    throw error;
  }
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

/**
 * Test complete trust signal integration
 */
export async function testTrustSignalIntegration(): Promise<void> {
  console.log('🔗 Testing Trust Signal Integration...');

  try {
    // Test complete workflow
    console.log('  Testing complete trust signal workflow...');
    
    // Apply trust signals to template
    const result = await TrustSignalManager.applyTrustSignals(mockTemplate, saasContext);
    
    if (!result.success || !result.data) {
      throw new Error('Trust signal application failed');
    }

    // Render the trust signals
    const rendered = TrustSignalRenderer.renderTrustSignals(result.data.trustSignals);

    // Verify integration
    if (!rendered.html || !rendered.css) {
      throw new Error('Trust signal rendering failed');
    }

    console.log(`    ✅ Complete workflow successful`);
    console.log(`    ✅ Applied ${result.data.trustSignals.length} trust signals`);
    console.log(`    ✅ Generated HTML for ${Object.keys(rendered.html).length} positions`);
    console.log(`    ✅ Generated ${Object.keys(rendered.css).length} CSS rules`);
    console.log(`    ✅ Processing time: ${result.metadata.processingTime}ms`);

    // Test performance impact assessment
    const performanceImpact = result.metadata.performanceImpact;
    console.log(`    ✅ Performance impact: ${performanceImpact.renderingComplexity} complexity`);
    console.log(`    ✅ Load time increase: ${performanceImpact.loadTimeIncrease}ms`);

    console.log('  ✅ Trust Signal Integration tests passed');
  } catch (error) {
    console.error('  ❌ Trust Signal Integration tests failed:', error);
    throw error;
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

/**
 * Run all trust signal tests
 */
export async function runTrustSignalTests(): Promise<void> {
  console.log('🚀 Running Trust Signal System Tests...\n');

  try {
    await testTrustSignalManager();
    console.log('');
    
    testSecurityBadgeSystem();
    console.log('');
    
    testTestimonialVerificationSystem();
    console.log('');
    
    testProfessionalCertificationSystem();
    console.log('');
    
    testIndustryCredibilityIndicators();
    console.log('');
    
    await testTrustSignalRenderer();
    console.log('');
    
    await testTrustSignalIntegration();
    console.log('');

    console.log('🎉 All Trust Signal System tests passed!');
  } catch (error) {
    console.error('💥 Trust Signal System tests failed:', error);
    throw error;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTrustSignalTests().catch(console.error);
}