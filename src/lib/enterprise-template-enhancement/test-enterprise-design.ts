/**
 * Test Suite for Enterprise Design Enhancement Engine
 * 
 * This file contains comprehensive tests to verify that the enterprise design
 * enhancement engine is working correctly and implementing all required features.
 */

import type { FunnelTemplate } from '../types';
import type { Template } from '../website-templates';
import {
  enterpriseDesignEngine,
  ProfessionalTypographySystem,
  SophisticatedColorPaletteManager,
  PremiumAssetLibrary,
  TrustSignalSystem,
  BrandAuthoritySystem
} from './enterprise-design-engine';
import { createEnhancementConfig } from './index';

// ============================================================================
// TEST DATA
// ============================================================================

const testWebsiteTemplate: Template = {
  id: 'test-website-1',
  title: 'Test Website Template',
  description: 'A test template for enterprise enhancement',
  image: '/test/template.jpg',
  hint: 'Test template',
  aiInsight: 'Perfect for testing',
  stats: {
    visitors: '1k',
    leads: '100',
    conversion: '10%'
  },
  components: [
    {
      id: 'test-hero',
      type: 'hero',
      content: {
        title: 'Test Hero Title',
        subtitle: 'Test subtitle',
        cta: 'Test CTA'
      },
      design: {
        theme: 'modern'
      }
    },
    {
      id: 'test-features',
      type: 'features',
      content: {
        title: 'Test Features',
        features: [
          { title: 'Feature 1', description: 'Description 1' },
          { title: 'Feature 2', description: 'Description 2' }
        ]
      }
    },
    {
      id: 'test-pricing',
      type: 'pricing',
      content: {
        title: 'Test Pricing',
        plans: [
          { name: 'Basic', price: '$10', features: ['Feature A'] },
          { name: 'Pro', price: '$20', features: ['Feature A', 'Feature B'] }
        ]
      }
    },
    {
      id: 'test-testimonials',
      type: 'testimonials',
      content: {
        title: 'Test Testimonials',
        testimonials: [
          { quote: 'Great service!', author: 'John Doe', company: 'Test Corp' }
        ]
      }
    }
  ]
};

const testFunnelTemplate: FunnelTemplate = {
  id: 'test-funnel-1',
  title: 'Test Funnel Template',
  description: 'A test funnel for enterprise enhancement',
  image: '/test/funnel.jpg',
  hint: 'Test funnel',
  stats: { ctr: 10, optInRate: 20, healthScore: 80 },
  aiInsight: 'Perfect for testing funnels',
  purpose: 'Lead Generation',
  targetAudience: 'Test Audience',
  conversionStrategy: 'Test strategy',
  industry: 'testing',
  components: [
    {
      id: 'funnel-hero',
      type: 'hero',
      content: {
        title: 'Test Funnel Hero',
        subtitle: 'Test funnel subtitle',
        cta: 'Start Test'
      }
    },
    {
      id: 'funnel-form',
      type: 'contact',
      content: {
        title: 'Test Form',
        fields: ['name', 'email']
      }
    }
  ]
};

// ============================================================================
// TYPOGRAPHY SYSTEM TESTS
// ============================================================================

export async function testProfessionalTypographySystem() {
  console.log('🧪 Testing Professional Typography System...');
  
  try {
    // Test typography configuration creation
    const modernConfig = ProfessionalTypographySystem.createTypographyConfig('modern', 'minor_third');
    console.log('✅ Modern typography config created:', {
      primaryFont: modernConfig.primaryFont.family,
      secondaryFont: modernConfig.secondaryFont?.family,
      headingScaleLength: modernConfig.headingScale.length,
      lineHeight: modernConfig.lineHeight
    });

    // Test different styles
    const styles = ['modern', 'elegant', 'corporate', 'tech', 'luxury'] as const;
    for (const style of styles) {
      const config = ProfessionalTypographySystem.createTypographyConfig(style);
      console.log(`✅ ${style} typography config:`, {
        primary: config.primaryFont.family,
        secondary: config.secondaryFont?.family
      });
    }

    // Test CSS generation
    const css = ProfessionalTypographySystem.generateTypographyCSS(modernConfig);
    console.log('✅ Typography CSS generated:', Object.keys(css).length, 'rules');

    return true;
  } catch (error) {
    console.error('❌ Typography system test failed:', error);
    return false;
  }
}

// ============================================================================
// COLOR PALETTE SYSTEM TESTS
// ============================================================================

export async function testSophisticatedColorPaletteManager() {
  console.log('🧪 Testing Sophisticated Color Palette Manager...');
  
  try {
    // Test color palette creation
    const corporateBlue = SophisticatedColorPaletteManager.createColorPalette('corporate_blue');
    console.log('✅ Corporate blue palette created:', {
      primary: corporateBlue.primary.main,
      secondary: corporateBlue.secondary.main,
      accent: corporateBlue.accent.main,
      semanticColors: Object.keys(corporateBlue.semantic).length
    });

    // Test different color schemes
    const schemes = ['corporate_blue', 'modern_green', 'luxury_purple', 'tech_orange', 'elegant_rose'] as const;
    for (const scheme of schemes) {
      const palette = SophisticatedColorPaletteManager.createColorPalette(scheme);
      console.log(`✅ ${scheme} palette:`, {
        primary: palette.primary.main,
        accent: palette.accent.main
      });
    }

    // Test accessibility validation
    const accessibilityReport = SophisticatedColorPaletteManager.validateAccessibility(corporateBlue);
    console.log('✅ Accessibility validation:', {
      score: accessibilityReport.score,
      wcagLevel: accessibilityReport.wcagLevel,
      issuesCount: accessibilityReport.issues.length
    });

    // Test CSS generation
    const css = SophisticatedColorPaletteManager.generateColorCSS(corporateBlue);
    console.log('✅ Color CSS generated:', Object.keys(css).length, 'rules');

    return true;
  } catch (error) {
    console.error('❌ Color palette system test failed:', error);
    return false;
  }
}

// ============================================================================
// PREMIUM ASSET LIBRARY TESTS
// ============================================================================

export async function testPremiumAssetLibrary() {
  console.log('🧪 Testing Premium Asset Library...');
  
  try {
    // Test asset finding for different categories
    const categories = ['hero', 'feature', 'testimonial', 'brand', 'background', 'decoration'] as const;
    
    for (const category of categories) {
      const assets = await PremiumAssetLibrary.findPremiumAssets(category, 3, 'premium');
      console.log(`✅ Found ${assets.length} ${category} assets:`, {
        firstAsset: assets[0] ? {
          id: assets[0].id,
          type: assets[0].type,
          category: assets[0].category,
          quality: assets[0].quality
        } : 'None'
      });
    }

    // Test asset optimization
    const testAsset = await PremiumAssetLibrary.findPremiumAssets('hero', 1, 'premium');
    if (testAsset.length > 0) {
      const optimizedAsset = PremiumAssetLibrary.optimizeAsset(testAsset[0], {
        compression: true,
        webpSupport: true,
        lazyLoading: true,
        responsiveImages: true
      });
      console.log('✅ Asset optimization:', {
        original: testAsset[0].url,
        optimized: optimizedAsset.url,
        hasOptimizations: optimizedAsset.url !== testAsset[0].url
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Premium asset library test failed:', error);
    return false;
  }
}

// ============================================================================
// TRUST SIGNAL SYSTEM TESTS
// ============================================================================

export async function testTrustSignalSystem() {
  console.log('🧪 Testing Trust Signal System...');
  
  try {
    // Test trust signals for different industries
    const industries = ['saas', 'ecommerce', 'healthcare', 'finance', 'education'];
    
    for (const industry of industries) {
      const trustSignals = TrustSignalSystem.getTrustSignalsForIndustry(industry);
      console.log(`✅ ${industry} trust signals:`, {
        count: trustSignals.length,
        types: [...new Set(trustSignals.map(s => s.type))],
        verified: trustSignals.filter(s => s.verified).length
      });
    }

    // Test HTML generation
    const saasSignals = TrustSignalSystem.getTrustSignalsForIndustry('saas');
    if (saasSignals.length > 0) {
      const html = TrustSignalSystem.generateTrustSignalHTML(saasSignals[0]);
      console.log('✅ Trust signal HTML generated:', html.length, 'characters');
    }

    // Test CSS generation
    const css = TrustSignalSystem.generateTrustSignalCSS();
    console.log('✅ Trust signal CSS generated:', Object.keys(css).length, 'rules');

    return true;
  } catch (error) {
    console.error('❌ Trust signal system test failed:', error);
    return false;
  }
}

// ============================================================================
// BRAND AUTHORITY SYSTEM TESTS
// ============================================================================

export async function testBrandAuthoritySystem() {
  console.log('🧪 Testing Brand Authority System...');
  
  try {
    // Test brand authority element creation
    const brandConfig = {
      logos: ['tech', 'enterprise'],
      certifications: ['security', 'privacy'],
      testimonials: true,
      socialProof: true,
      industryRecognition: true
    };

    const brandElements = BrandAuthoritySystem.createBrandAuthorityElements(brandConfig);
    console.log('✅ Brand authority elements created:', {
      count: brandElements.length,
      types: [...new Set(brandElements.map(e => e.type))],
      categories: [...new Set(brandElements.map(e => e.category))]
    });

    // Test HTML generation
    const html = BrandAuthoritySystem.generateAuthorityHTML(brandElements);
    console.log('✅ Brand authority HTML generated:', html.length, 'characters');

    // Test CSS generation
    const css = BrandAuthoritySystem.generateAuthorityCSS();
    console.log('✅ Brand authority CSS generated:', Object.keys(css).length, 'rules');

    return true;
  } catch (error) {
    console.error('❌ Brand authority system test failed:', error);
    return false;
  }
}

// ============================================================================
// ENTERPRISE DESIGN ENGINE INTEGRATION TESTS
// ============================================================================

export async function testEnterpriseDesignEngineIntegration() {
  console.log('🧪 Testing Enterprise Design Engine Integration...');
  
  try {
    // Test website template enhancement
    const websiteConfig = createEnhancementConfig(testWebsiteTemplate.id, {
      enhancementLevel: 'professional',
      industry: 'saas',
      enabledFeatures: {
        enterpriseDesign: true,
        gamification: false,
        interactivity: true,
        personalization: false,
        analytics: true
      }
    });

    const enhancedWebsite = await enterpriseDesignEngine.enhanceTemplate(testWebsiteTemplate, websiteConfig);
    console.log('✅ Website template enhanced:', {
      success: enhancedWebsite.success,
      errorsCount: enhancedWebsite.errors.length,
      warningsCount: enhancedWebsite.warnings.length,
      enhancementsApplied: enhancedWebsite.metadata.enhancementsApplied,
      processingTime: enhancedWebsite.metadata.processingTime
    });

    // Test funnel template enhancement
    const funnelConfig = createEnhancementConfig(testFunnelTemplate.id, {
      templateType: 'funnel',
      enhancementLevel: 'enterprise',
      industry: 'marketing',
      enabledFeatures: {
        enterpriseDesign: true,
        gamification: true,
        interactivity: true,
        personalization: true,
        analytics: true
      }
    });

    const enhancedFunnel = await enterpriseDesignEngine.enhanceTemplate(testFunnelTemplate, funnelConfig);
    console.log('✅ Funnel template enhanced:', {
      success: enhancedFunnel.success,
      errorsCount: enhancedFunnel.errors.length,
      warningsCount: enhancedFunnel.warnings.length,
      enhancementsApplied: enhancedFunnel.metadata.enhancementsApplied,
      processingTime: enhancedFunnel.metadata.processingTime
    });

    return enhancedWebsite.success && enhancedFunnel.success;
  } catch (error) {
    console.error('❌ Enterprise design engine integration test failed:', error);
    return false;
  }
}

// ============================================================================
// INDIVIDUAL ENHANCEMENT METHOD TESTS
// ============================================================================

export async function testIndividualEnhancementMethods() {
  console.log('🧪 Testing Individual Enhancement Methods...');
  
  try {
    // Test trust signals application
    const trustResult = await enterpriseDesignEngine.applyTrustSignals(testWebsiteTemplate, 'saas');
    console.log('✅ Trust signals applied:', {
      success: trustResult.success,
      processingTime: trustResult.metadata.processingTime,
      enhancementsApplied: trustResult.metadata.enhancementsApplied
    });

    // Test visual hierarchy optimization
    const hierarchyResult = await enterpriseDesignEngine.optimizeVisualHierarchy(testWebsiteTemplate);
    console.log('✅ Visual hierarchy optimized:', {
      success: hierarchyResult.success,
      processingTime: hierarchyResult.metadata.processingTime,
      enhancementsApplied: hierarchyResult.metadata.enhancementsApplied
    });

    // Test accessibility validation
    const accessibilityReport = await enterpriseDesignEngine.validateAccessibility(testWebsiteTemplate);
    console.log('✅ Accessibility validated:', {
      score: accessibilityReport.score,
      wcagLevel: accessibilityReport.wcagLevel,
      issuesCount: accessibilityReport.issues.length,
      recommendationsCount: accessibilityReport.recommendations.length
    });

    // Test typography application
    const typographyResult = await enterpriseDesignEngine.applyProfessionalTypography(testWebsiteTemplate);
    console.log('✅ Typography applied:', {
      success: typographyResult.success,
      processingTime: typographyResult.metadata.processingTime,
      enhancementsApplied: typographyResult.metadata.enhancementsApplied
    });

    // Test color palette application
    const colorResult = await enterpriseDesignEngine.applySophisticatedColors(testWebsiteTemplate);
    console.log('✅ Colors applied:', {
      success: colorResult.success,
      processingTime: colorResult.metadata.processingTime,
      enhancementsApplied: colorResult.metadata.enhancementsApplied
    });

    // Test premium assets integration
    const assetResult = await enterpriseDesignEngine.integratePremiumAssets(testWebsiteTemplate);
    console.log('✅ Premium assets integrated:', {
      success: assetResult.success,
      processingTime: assetResult.metadata.processingTime,
      enhancementsApplied: assetResult.metadata.enhancementsApplied
    });

    // Test brand authority addition
    const brandResult = await enterpriseDesignEngine.addBrandAuthority(testWebsiteTemplate);
    console.log('✅ Brand authority added:', {
      success: brandResult.success,
      processingTime: brandResult.metadata.processingTime,
      enhancementsApplied: brandResult.metadata.enhancementsApplied
    });

    return true;
  } catch (error) {
    console.error('❌ Individual enhancement methods test failed:', error);
    return false;
  }
}

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

export async function testErrorHandling() {
  console.log('🧪 Testing Error Handling...');
  
  try {
    // Test with invalid template
    const invalidTemplate = {
      ...testWebsiteTemplate,
      components: [] // Empty components should trigger warnings
    };

    const config = createEnhancementConfig(invalidTemplate.id, {
      enhancementLevel: 'professional',
      industry: 'saas'
    });

    const result = await enterpriseDesignEngine.enhanceTemplate(invalidTemplate as Template, config);
    console.log('✅ Error handling test:', {
      success: result.success,
      errorsCount: result.errors.length,
      warningsCount: result.warnings.length,
      handledGracefully: result.errors.length > 0 || result.warnings.length > 0
    });

    // Test accessibility validation with problematic template
    const problematicTemplate = {
      ...testWebsiteTemplate,
      components: [
        {
          id: 'bad-image',
          type: 'image',
          content: {
            src: 'test.jpg'
            // Missing alt text should trigger accessibility issue
          }
        }
      ]
    };

    const accessibilityReport = await enterpriseDesignEngine.validateAccessibility(problematicTemplate as Template);
    console.log('✅ Accessibility error detection:', {
      score: accessibilityReport.score,
      issuesFound: accessibilityReport.issues.length > 0,
      issueTypes: accessibilityReport.issues.map(i => i.type)
    });

    return true;
  } catch (error) {
    console.error('❌ Error handling test failed:', error);
    return false;
  }
}

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

export async function testPerformance() {
  console.log('🧪 Testing Performance...');
  
  try {
    // Test with large template
    const largeTemplate: Template = {
      ...testWebsiteTemplate,
      components: Array.from({ length: 50 }, (_, index) => ({
        id: `component-${index}`,
        type: 'features',
        content: {
          title: `Feature Set ${index}`,
          features: Array.from({ length: 5 }, (_, i) => ({
            title: `Feature ${i}`,
            description: `Description for feature ${i}`
          }))
        }
      }))
    };

    const config = createEnhancementConfig(largeTemplate.id, {
      enhancementLevel: 'enterprise',
      industry: 'saas'
    });

    const startTime = Date.now();
    const result = await enterpriseDesignEngine.enhanceTemplate(largeTemplate, config);
    const endTime = Date.now();

    console.log('✅ Performance test with large template:', {
      success: result.success,
      componentCount: largeTemplate.components.length,
      processingTime: endTime - startTime,
      reportedProcessingTime: result.metadata.processingTime,
      performanceImpact: result.metadata.performanceImpact.renderingComplexity,
      recommendations: result.metadata.performanceImpact.recommendations.length
    });

    return true;
  } catch (error) {
    console.error('❌ Performance test failed:', error);
    return false;
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

export async function runAllEnterpriseDesignTests() {
  console.log('🎯 Running Enterprise Design Enhancement Engine Tests\n');
  console.log('=' .repeat(60));
  
  const testResults: { [key: string]: boolean } = {};
  
  try {
    // Run all test suites
    testResults.typography = await testProfessionalTypographySystem();
    console.log('\n' + '-'.repeat(60) + '\n');
    
    testResults.colorPalette = await testSophisticatedColorPaletteManager();
    console.log('\n' + '-'.repeat(60) + '\n');
    
    testResults.assetLibrary = await testPremiumAssetLibrary();
    console.log('\n' + '-'.repeat(60) + '\n');
    
    testResults.trustSignals = await testTrustSignalSystem();
    console.log('\n' + '-'.repeat(60) + '\n');
    
    testResults.brandAuthority = await testBrandAuthoritySystem();
    console.log('\n' + '-'.repeat(60) + '\n');
    
    testResults.integration = await testEnterpriseDesignEngineIntegration();
    console.log('\n' + '-'.repeat(60) + '\n');
    
    testResults.individualMethods = await testIndividualEnhancementMethods();
    console.log('\n' + '-'.repeat(60) + '\n');
    
    testResults.errorHandling = await testErrorHandling();
    console.log('\n' + '-'.repeat(60) + '\n');
    
    testResults.performance = await testPerformance();
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' .repeat(60));
    
    const passedTests = Object.values(testResults).filter(result => result).length;
    const totalTests = Object.keys(testResults).length;
    
    Object.entries(testResults).forEach(([testName, passed]) => {
      const status = passed ? '✅ PASSED' : '❌ FAILED';
      console.log(`${status} - ${testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`);
    });
    
    console.log('\n' + '-'.repeat(60));
    console.log(`Overall: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All tests passed! Enterprise Design Enhancement Engine is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the failed tests above.');
    }
    
    return passedTests === totalTests;
    
  } catch (error) {
    console.error('❌ Test suite execution failed:', error);
    return false;
  }
}

// Export individual test functions for selective testing
export {
  testWebsiteTemplate,
  testFunnelTemplate
};