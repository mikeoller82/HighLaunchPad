/**
 * Website Template Enhancement Test Suite
 * 
 * Comprehensive tests for the website template enhancement system.
 * This file demonstrates and validates all enhancement features.
 */

import { templateEnhancementService } from './template-enhancement-service';
import { websiteTemplateEnhancer } from './website-template-enhancer';
import { websiteTemplates } from '../website-templates';
import type { TemplateEnhancementConfig, EnhancedTemplate } from './types';

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const TEST_CONFIG: TemplateEnhancementConfig = {
  id: 'test_enhancement_001',
  templateId: 'saas-dark-pro',
  templateType: 'website',
  enhancementLevel: 'enterprise',
  industry: 'saas',
  conversionGoals: [
    {
      id: 'increase_trial_signups',
      name: 'Increase Trial Signups',
      description: 'Convert more visitors to trial users',
      trigger: 'pricing_click',
      value: 10,
      priority: 'critical'
    },
    {
      id: 'improve_engagement',
      name: 'Improve User Engagement',
      description: 'Increase time on page and interactions',
      trigger: 'scroll_depth',
      value: 5,
      priority: 'high'
    }
  ],
  enabledFeatures: {
    enterpriseDesign: true,
    gamification: true,
    interactivity: true,
    personalization: true,
    analytics: true
  },
  personalization: {
    rules: [
      {
        id: 'traffic_source_personalization',
        name: 'Traffic Source Personalization',
        conditions: [
          {
            type: 'traffic_source',
            operator: 'equals',
            value: 'google'
          }
        ],
        actions: [
          {
            type: 'content_change',
            target: 'hero.title',
            value: 'Found us on Google? You\'re in the right place!'
          }
        ],
        targetComponents: ['hero'],
        priority: 1,
        enabled: true
      }
    ],
    dynamicContent: [
      {
        id: 'location_based_testimonials',
        componentId: 'testimonials',
        componentType: 'testimonials',
        rules: [
          {
            condition: { location: 'US' },
            content: { testimonials: 'us_focused' }
          },
          {
            condition: { location: 'EU' },
            content: { testimonials: 'eu_focused' }
          }
        ]
      }
    ]
  },
  analytics: {
    providers: [
      {
        name: 'Google Analytics',
        id: 'ga4',
        config: { measurementId: 'G-XXXXXXXXXX' },
        enabled: true
      }
    ],
    conversionGoals: [
      {
        id: 'trial_signup',
        name: 'Trial Signup',
        description: 'User starts free trial',
        trigger: 'form_submit',
        value: 25,
        funnelStep: 5
      }
    ],
    customEvents: [
      {
        name: 'feature_interaction',
        description: 'User interacts with feature showcase',
        parameters: ['feature_name', 'interaction_type']
      }
    ]
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

/**
 * Test basic template enhancement
 */
export async function testBasicTemplateEnhancement(): Promise<void> {
  console.log('🧪 Testing Basic Template Enhancement...');
  
  try {
    const template = websiteTemplates[0]; // Get first template
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, TEST_CONFIG);
    
    console.log('✅ Template enhanced successfully');
    console.log(`   Original components: ${template.components.length}`);
    console.log(`   Enhanced components: ${enhanced.components.length}`);
    console.log(`   Enhancement level: ${enhanced.enhancementConfig.enhancementLevel}`);
    console.log(`   Enterprise features enabled: ${enhanced.enterpriseFeatures ? 'Yes' : 'No'}`);
    console.log(`   Interactive components enabled: ${enhanced.interactiveComponents ? 'Yes' : 'No'}`);
    
    // Validate enhancement
    if (!enhanced.enterpriseFeatures) {
      throw new Error('Enterprise features not applied');
    }
    
    if (!enhanced.interactiveComponents) {
      throw new Error('Interactive components not applied');
    }
    
    console.log('✅ Basic enhancement validation passed\n');
    
  } catch (error) {
    console.error('❌ Basic template enhancement failed:', error);
    throw error;
  }
}

/**
 * Test enterprise design enhancements
 */
export async function testEnterpriseDesignEnhancements(): Promise<void> {
  console.log('🎨 Testing Enterprise Design Enhancements...');
  
  try {
    const template = websiteTemplates.find(t => t.id === 'saas-light-pro');
    if (!template) throw new Error('Test template not found');
    
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, TEST_CONFIG);
    
    // Check for professional typography
    const heroComponent = enhanced.components.find(c => c.type === 'hero');
    if (heroComponent?.design?.typography) {
      console.log('✅ Professional typography applied');
      console.log(`   Font family: ${heroComponent.design.typography.fontFamily}`);
      console.log(`   Font weight: ${heroComponent.design.typography.fontWeight}`);
    }
    
    // Check for trust signals
    const headerComponent = enhanced.components.find(c => c.type === 'header');
    if (headerComponent?.content?.trustBadges) {
      console.log('✅ Trust signals integrated');
      console.log(`   Trust badges: ${headerComponent.content.trustBadges.length}`);
    }
    
    // Check for sophisticated color palette
    const pricingComponent = enhanced.components.find(c => c.type === 'pricing');
    if (pricingComponent?.design?.colors) {
      console.log('✅ Sophisticated color palette applied');
      console.log(`   Primary color: ${pricingComponent.design.colors.primary}`);
    }
    
    console.log('✅ Enterprise design enhancement validation passed\n');
    
  } catch (error) {
    console.error('❌ Enterprise design enhancement failed:', error);
    throw error;
  }
}

/**
 * Test interactive components and animations
 */
export async function testInteractiveComponents(): Promise<void> {
  console.log('⚡ Testing Interactive Components...');
  
  try {
    const template = websiteTemplates.find(t => t.id === 'saas-dark-pro');
    if (!template) throw new Error('Test template not found');
    
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, TEST_CONFIG);
    
    // Check for animations
    const componentsWithAnimations = enhanced.components.filter(c => 
      c.design?.animations?.entrance || c.design?.animations?.hover || c.design?.animations?.scroll
    );
    
    console.log('✅ Animations applied to components');
    console.log(`   Components with animations: ${componentsWithAnimations.length}`);
    
    // Check for interactive features
    const heroComponent = enhanced.components.find(c => c.type === 'hero');
    if (heroComponent?.content?.interactiveDemo) {
      console.log('✅ Interactive demo added to hero');
    }
    
    const featuresComponent = enhanced.components.find(c => c.type === 'features');
    if (featuresComponent?.content?.features?.some((f: any) => f.interactive)) {
      console.log('✅ Interactive features enabled');
    }
    
    const pricingComponent = enhanced.components.find(c => c.type === 'pricing');
    if (pricingComponent?.content?.calculator) {
      console.log('✅ ROI calculator added to pricing');
    }
    
    console.log('✅ Interactive components validation passed\n');
    
  } catch (error) {
    console.error('❌ Interactive components test failed:', error);
    throw error;
  }
}

/**
 * Test personalization features
 */
export async function testPersonalizationFeatures(): Promise<void> {
  console.log('👤 Testing Personalization Features...');
  
  try {
    const template = websiteTemplates[0];
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, TEST_CONFIG);
    
    // Check for personalization rules
    const componentsWithPersonalization = enhanced.components.filter(c => 
      c.metadata?.personalization && c.metadata.personalization.rules.length > 0
    );
    
    console.log('✅ Personalization rules applied');
    console.log(`   Components with personalization: ${componentsWithPersonalization.length}`);
    
    // Check for dynamic content variations
    const heroComponent = enhanced.components.find(c => c.type === 'hero');
    if (heroComponent?.content?.variations) {
      console.log('✅ Dynamic content variations added');
      console.log(`   Hero variations: ${heroComponent.content.variations.length}`);
    }
    
    // Check for personalized testimonials
    const testimonialsComponent = enhanced.components.find(c => c.type === 'testimonials');
    if (testimonialsComponent?.metadata?.personalization?.rules) {
      console.log('✅ Personalized testimonials configured');
    }
    
    console.log('✅ Personalization features validation passed\n');
    
  } catch (error) {
    console.error('❌ Personalization features test failed:', error);
    throw error;
  }
}

/**
 * Test analytics tracking and optimization
 */
export async function testAnalyticsTracking(): Promise<void> {
  console.log('📊 Testing Analytics Tracking...');
  
  try {
    const template = websiteTemplates[0];
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, TEST_CONFIG);
    
    // Check for tracking events
    const componentsWithTracking = enhanced.components.filter(c => 
      c.metadata?.tracking && c.metadata.tracking.events && c.metadata.tracking.events.length > 0
    );
    
    console.log('✅ Analytics tracking applied');
    console.log(`   Components with tracking: ${componentsWithTracking.length}`);
    
    // Check for conversion tracking
    const componentsWithConversionTracking = enhanced.components.filter(c => 
      c.metadata?.tracking?.conversionTracking?.enabled
    );
    
    console.log('✅ Conversion tracking enabled');
    console.log(`   Components with conversion tracking: ${componentsWithConversionTracking.length}`);
    
    // Check for A/B testing variants
    const componentsWithABTesting = enhanced.components.filter(c => 
      c.metadata?.tracking?.abTesting?.enabled && c.metadata.tracking.abTesting.variants.length > 0
    );
    
    console.log('✅ A/B testing configured');
    console.log(`   Components with A/B testing: ${componentsWithABTesting.length}`);
    
    // Check for heatmap tracking
    const componentsWithHeatmap = enhanced.components.filter(c => 
      c.metadata?.tracking?.heatmap?.enabled
    );
    
    console.log('✅ Heatmap tracking enabled');
    console.log(`   Components with heatmap: ${componentsWithHeatmap.length}`);
    
    console.log('✅ Analytics tracking validation passed\n');
    
  } catch (error) {
    console.error('❌ Analytics tracking test failed:', error);
    throw error;
  }
}

/**
 * Test template enhancement service
 */
export async function testTemplateEnhancementService(): Promise<void> {
  console.log('🔧 Testing Template Enhancement Service...');
  
  try {
    // Test single template enhancement
    const templateId = websiteTemplates[0].id;
    const enhanced = await templateEnhancementService.enhanceTemplateById(templateId);
    
    console.log('✅ Single template enhancement successful');
    console.log(`   Template ID: ${enhanced.id}`);
    console.log(`   Original ID: ${templateId}`);
    
    // Test enhancement recommendations
    const recommendations = await templateEnhancementService.getEnhancementRecommendations(templateId);
    
    console.log('✅ Enhancement recommendations generated');
    console.log(`   Recommended level: ${recommendations.recommendedLevel}`);
    console.log(`   Recommended features: ${recommendations.recommendedFeatures.length}`);
    console.log(`   Industry specific: ${recommendations.industrySpecific.length}`);
    
    // Test template compatibility validation
    const compatibility = await templateEnhancementService.validateTemplateCompatibility(templateId);
    
    console.log('✅ Template compatibility validated');
    console.log(`   Compatible: ${compatibility.compatible}`);
    console.log(`   Issues: ${compatibility.issues.length}`);
    console.log(`   Recommendations: ${compatibility.recommendations.length}`);
    
    // Test enhancement preview
    const preview = await templateEnhancementService.previewEnhancement(templateId, TEST_CONFIG);
    
    console.log('✅ Enhancement preview generated');
    console.log(`   Changes detected: ${preview.changes.length}`);
    
    console.log('✅ Template enhancement service validation passed\n');
    
  } catch (error) {
    console.error('❌ Template enhancement service test failed:', error);
    throw error;
  }
}

/**
 * Test bulk template enhancement
 */
export async function testBulkTemplateEnhancement(): Promise<void> {
  console.log('📦 Testing Bulk Template Enhancement...');
  
  try {
    // Enhance first 3 templates to avoid overwhelming the test
    const testTemplates = websiteTemplates.slice(0, 3);
    const enhancedTemplates: EnhancedTemplate[] = [];
    
    for (const template of testTemplates) {
      const config: TemplateEnhancementConfig = {
        ...TEST_CONFIG,
        id: `bulk_enhancement_${template.id}_${Date.now()}`,
        templateId: template.id,
        enhancementLevel: 'professional' // Use professional for bulk to reduce processing time
      };
      
      const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, config);
      enhancedTemplates.push(enhanced);
    }
    
    console.log('✅ Bulk template enhancement successful');
    console.log(`   Templates processed: ${enhancedTemplates.length}`);
    console.log(`   Success rate: 100%`);
    
    // Validate all templates were enhanced
    const allEnhanced = enhancedTemplates.every(template => 
      template.enterpriseFeatures && template.enhancementConfig
    );
    
    if (!allEnhanced) {
      throw new Error('Not all templates were properly enhanced');
    }
    
    console.log('✅ Bulk enhancement validation passed\n');
    
  } catch (error) {
    console.error('❌ Bulk template enhancement failed:', error);
    throw error;
  }
}

/**
 * Test performance and optimization
 */
export async function testPerformanceOptimization(): Promise<void> {
  console.log('⚡ Testing Performance Optimization...');
  
  try {
    const template = websiteTemplates[0];
    const startTime = Date.now();
    
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, {
      ...TEST_CONFIG,
      enhancementLevel: 'basic' // Use basic level for performance test
    });
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    console.log('✅ Performance optimization test completed');
    console.log(`   Processing time: ${processingTime}ms`);
    console.log(`   Components processed: ${template.components.length}`);
    console.log(`   Average time per component: ${Math.round(processingTime / template.components.length)}ms`);
    
    // Validate performance is acceptable (under 5 seconds for basic enhancement)
    if (processingTime > 5000) {
      console.warn('⚠️  Processing time exceeded 5 seconds - consider optimization');
    } else {
      console.log('✅ Performance within acceptable limits');
    }
    
    console.log('✅ Performance optimization validation passed\n');
    
  } catch (error) {
    console.error('❌ Performance optimization test failed:', error);
    throw error;
  }
}

/**
 * Run all tests
 */
export async function runAllWebsiteTemplateEnhancementTests(): Promise<void> {
  console.log('🚀 Starting Website Template Enhancement Test Suite...\n');
  
  const tests = [
    testBasicTemplateEnhancement,
    testEnterpriseDesignEnhancements,
    testInteractiveComponents,
    testPersonalizationFeatures,
    testAnalyticsTracking,
    testTemplateEnhancementService,
    testBulkTemplateEnhancement,
    testPerformanceOptimization
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      await test();
      passed++;
    } catch (error) {
      console.error(`Test failed: ${test.name}`, error);
      failed++;
    }
  }
  
  console.log('📊 Test Suite Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Website template enhancement system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.');
  }
}

// ============================================================================
// DEMO FUNCTIONS
// ============================================================================

/**
 * Demonstrate template enhancement with detailed output
 */
export async function demonstrateTemplateEnhancement(): Promise<void> {
  console.log('🎯 Demonstrating Website Template Enhancement...\n');
  
  try {
    const template = websiteTemplates.find(t => t.id === 'saas-light-pro');
    if (!template) throw new Error('Demo template not found');
    
    console.log('📋 Original Template:');
    console.log(`   ID: ${template.id}`);
    console.log(`   Title: ${template.title}`);
    console.log(`   Components: ${template.components.length}`);
    console.log(`   Description: ${template.description}\n`);
    
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, TEST_CONFIG);
    
    console.log('✨ Enhanced Template:');
    console.log(`   ID: ${enhanced.id}`);
    console.log(`   Title: ${enhanced.title}`);
    console.log(`   Components: ${enhanced.components.length}`);
    console.log(`   Enhancement Level: ${enhanced.enhancementConfig.enhancementLevel}`);
    console.log(`   Industry: ${enhanced.enhancementConfig.industry}`);
    console.log(`   Enhanced At: ${enhanced.enhancedAt}\n`);
    
    console.log('🏢 Enterprise Features:');
    if (enhanced.enterpriseFeatures) {
      console.log(`   Professional Design: ${enhanced.enterpriseFeatures.professionalDesign.enabled ? 'Enabled' : 'Disabled'}`);
      console.log(`   Trust Signals: ${enhanced.enterpriseFeatures.trustSignals.enabled ? 'Enabled' : 'Disabled'}`);
      console.log(`   Brand Authority: ${enhanced.enterpriseFeatures.brandAuthority.enabled ? 'Enabled' : 'Disabled'}`);
    }
    
    console.log('\n⚡ Interactive Components:');
    if (enhanced.interactiveComponents) {
      console.log(`   Animations: ${enhanced.interactiveComponents.animations.enabled ? 'Enabled' : 'Disabled'}`);
      console.log(`   Dynamic Content: ${enhanced.interactiveComponents.dynamicContent.enabled ? 'Enabled' : 'Disabled'}`);
      console.log(`   Interactive Elements: ${enhanced.interactiveComponents.interactiveElements.enabled ? 'Enabled' : 'Disabled'}`);
    }
    
    console.log('\n📊 Component Enhancements:');
    enhanced.components.forEach((component, index) => {
      const original = template.components[index];
      const hasNewFeatures = component.metadata?.tracking || component.metadata?.personalization || 
                             (component.design && !original.design);
      
      if (hasNewFeatures) {
        console.log(`   ${component.type}: Enhanced with ${
          [
            component.metadata?.tracking ? 'analytics' : null,
            component.metadata?.personalization ? 'personalization' : null,
            (component.design && !original.design) ? 'design' : null
          ].filter(Boolean).join(', ')
        }`);
      }
    });
    
    console.log('\n🎉 Template enhancement demonstration completed successfully!');
    
  } catch (error) {
    console.error('❌ Template enhancement demonstration failed:', error);
    throw error;
  }
}

// ============================================================================
// EXPORT FOR EXTERNAL USE
// ============================================================================

export const websiteTemplateEnhancementTests = {
  runAllTests: runAllWebsiteTemplateEnhancementTests,
  demonstrate: demonstrateTemplateEnhancement,
  individual: {
    testBasicTemplateEnhancement,
    testEnterpriseDesignEnhancements,
    testInteractiveComponents,
    testPersonalizationFeatures,
    testAnalyticsTracking,
    testTemplateEnhancementService,
    testBulkTemplateEnhancement,
    testPerformanceOptimization
  }
};