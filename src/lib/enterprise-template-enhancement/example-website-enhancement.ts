/**
 * Website Template Enhancement Example
 * 
 * This example demonstrates how to enhance existing website templates
 * with enterprise features, interactive components, and analytics tracking.
 */

import { templateEnhancementService } from './template-enhancement-service';
import { websiteTemplateEnhancer } from './website-template-enhancer';
import { websiteTemplates } from '../website-templates';
import type { TemplateEnhancementConfig } from './types';

// ============================================================================
// EXAMPLE 1: BASIC TEMPLATE ENHANCEMENT
// ============================================================================

export async function basicTemplateEnhancement() {
  console.log('🚀 Example 1: Basic Template Enhancement\n');
  
  // Get a template to enhance
  const template = websiteTemplates.find(t => t.id === 'saas-light-pro');
  if (!template) {
    console.error('Template not found');
    return;
  }
  
  console.log(`📋 Enhancing template: ${template.title}`);
  
  // Create basic enhancement configuration
  const config: TemplateEnhancementConfig = {
    id: `basic_enhancement_${Date.now()}`,
    templateId: template.id,
    templateType: 'website',
    enhancementLevel: 'professional',
    industry: 'saas',
    conversionGoals: [
      {
        id: 'increase_trial_signups',
        name: 'Increase Trial Signups',
        description: 'Convert more visitors to trial users',
        trigger: 'pricing_click',
        value: 10,
        priority: 'high'
      }
    ],
    enabledFeatures: {
      enterpriseDesign: true,
      gamification: false,
      interactivity: true,
      personalization: false,
      analytics: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  try {
    // Enhance the template
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, config);
    
    console.log('✅ Template enhanced successfully!');
    console.log(`   Enhanced ID: ${enhanced.id}`);
    console.log(`   Components: ${enhanced.components.length}`);
    console.log(`   Enterprise features: ${enhanced.enterpriseFeatures ? 'Enabled' : 'Disabled'}`);
    console.log(`   Interactive components: ${enhanced.interactiveComponents ? 'Enabled' : 'Disabled'}\n`);
    
    return enhanced;
    
  } catch (error) {
    console.error('❌ Enhancement failed:', error);
  }
}

// ============================================================================
// EXAMPLE 2: ENTERPRISE-LEVEL ENHANCEMENT
// ============================================================================

export async function enterpriseTemplateEnhancement() {
  console.log('🏢 Example 2: Enterprise-Level Template Enhancement\n');
  
  const template = websiteTemplates.find(t => t.id === 'saas-dark-pro');
  if (!template) {
    console.error('Template not found');
    return;
  }
  
  console.log(`📋 Enhancing template: ${template.title}`);
  
  // Create enterprise enhancement configuration
  const config: TemplateEnhancementConfig = {
    id: `enterprise_enhancement_${Date.now()}`,
    templateId: template.id,
    templateType: 'website',
    enhancementLevel: 'enterprise',
    industry: 'saas',
    conversionGoals: [
      {
        id: 'increase_trial_signups',
        name: 'Increase Trial Signups',
        description: 'Convert more visitors to trial users',
        trigger: 'pricing_click',
        value: 25,
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
          id: 'returning_visitor_personalization',
          name: 'Returning Visitor Personalization',
          conditions: [
            {
              type: 'returning_visitor',
              operator: 'equals',
              value: true
            }
          ],
          actions: [
            {
              type: 'content_change',
              target: 'hero.title',
              value: 'Welcome back! Ready to continue?'
            },
            {
              type: 'content_change',
              target: 'hero.cta',
              value: 'Continue Your Journey'
            }
          ],
          targetComponents: ['hero'],
          priority: 1,
          enabled: true
        }
      ],
      dynamicContent: [
        {
          id: 'industry_testimonials',
          componentId: 'testimonials',
          componentType: 'testimonials',
          rules: [
            {
              condition: { industry: 'fintech' },
              content: { testimonials: 'fintech_focused' }
            },
            {
              condition: { industry: 'healthcare' },
              content: { testimonials: 'healthcare_focused' }
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
          name: 'feature_demo_view',
          description: 'User views feature demo',
          parameters: ['feature_name', 'demo_duration']
        }
      ]
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  try {
    const enhanced = await websiteTemplateEnhancer.enhanceTemplate(template, config);
    
    console.log('✅ Enterprise template enhanced successfully!');
    console.log(`   Enhanced ID: ${enhanced.id}`);
    console.log(`   Enhancement level: ${enhanced.enhancementConfig.enhancementLevel}`);
    console.log(`   Personalization rules: ${enhanced.enhancementConfig.personalization?.rules.length || 0}`);
    console.log(`   Analytics providers: ${enhanced.enhancementConfig.analytics?.providers.length || 0}`);
    
    // Show detailed enhancement features
    if (enhanced.enterpriseFeatures) {
      console.log('\n🏢 Enterprise Features Applied:');
      console.log(`   Professional Design: ${enhanced.enterpriseFeatures.professionalDesign.enabled}`);
      console.log(`   Trust Signals: ${enhanced.enterpriseFeatures.trustSignals.enabled}`);
      console.log(`   Brand Authority: ${enhanced.enterpriseFeatures.brandAuthority.enabled}`);
    }
    
    if (enhanced.interactiveComponents) {
      console.log('\n⚡ Interactive Components:');
      console.log(`   Animations: ${enhanced.interactiveComponents.animations.enabled}`);
      console.log(`   Dynamic Content: ${enhanced.interactiveComponents.dynamicContent.enabled}`);
      console.log(`   Interactive Elements: ${enhanced.interactiveComponents.interactiveElements.enabled}`);
    }
    
    console.log('');
    return enhanced;
    
  } catch (error) {
    console.error('❌ Enterprise enhancement failed:', error);
  }
}

// ============================================================================
// EXAMPLE 3: BULK TEMPLATE ENHANCEMENT
// ============================================================================

export async function bulkTemplateEnhancement() {
  console.log('📦 Example 3: Bulk Template Enhancement\n');
  
  try {
    // Enhance first 3 templates for demonstration
    const templatesToEnhance = websiteTemplates.slice(0, 3);
    console.log(`📋 Enhancing ${templatesToEnhance.length} templates...`);
    
    const enhancedTemplates = [];
    
    for (const template of templatesToEnhance) {
      console.log(`   Processing: ${template.title}`);
      
      const enhanced = await templateEnhancementService.enhanceTemplateById(template.id, {
        enhancementLevel: 'professional',
        enabledFeatures: {
          enterpriseDesign: true,
          gamification: false,
          interactivity: true,
          personalization: false,
          analytics: true
        }
      });
      
      enhancedTemplates.push(enhanced);
      console.log(`   ✅ Enhanced: ${enhanced.id}`);
    }
    
    console.log(`\n✅ Bulk enhancement completed!`);
    console.log(`   Templates processed: ${enhancedTemplates.length}`);
    console.log(`   Success rate: 100%\n`);
    
    return enhancedTemplates;
    
  } catch (error) {
    console.error('❌ Bulk enhancement failed:', error);
  }
}

// ============================================================================
// EXAMPLE 4: ENHANCEMENT WITH RECOMMENDATIONS
// ============================================================================

export async function enhancementWithRecommendations() {
  console.log('💡 Example 4: Enhancement with AI Recommendations\n');
  
  const templateId = websiteTemplates[0].id;
  
  try {
    // Get enhancement recommendations
    console.log('🔍 Analyzing template for enhancement recommendations...');
    const recommendations = await templateEnhancementService.getEnhancementRecommendations(templateId);
    
    console.log('📊 Enhancement Recommendations:');
    console.log(`   Recommended Level: ${recommendations.recommendedLevel}`);
    console.log(`   Recommended Features: ${recommendations.recommendedFeatures.join(', ')}`);
    console.log(`   Industry Specific: ${recommendations.industrySpecific.join(', ')}`);
    console.log(`   Conversion Optimizations: ${recommendations.conversionOptimizations.join(', ')}`);
    
    // Apply recommendations
    console.log('\n🚀 Applying recommended enhancements...');
    
    const config: Partial<TemplateEnhancementConfig> = {
      enhancementLevel: recommendations.recommendedLevel,
      enabledFeatures: {
        enterpriseDesign: true,
        gamification: recommendations.recommendedFeatures.includes('gamification'),
        interactivity: recommendations.recommendedFeatures.includes('interactivity'),
        personalization: recommendations.recommendedFeatures.includes('personalization'),
        analytics: true
      }
    };
    
    const enhanced = await templateEnhancementService.enhanceTemplateById(templateId, config);
    
    console.log('✅ Template enhanced with AI recommendations!');
    console.log(`   Enhanced ID: ${enhanced.id}`);
    console.log(`   Applied Level: ${enhanced.enhancementConfig.enhancementLevel}`);
    console.log(`   Features Applied: ${Object.entries(enhanced.enhancementConfig.enabledFeatures)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature)
      .join(', ')}\n`);
    
    return enhanced;
    
  } catch (error) {
    console.error('❌ Enhancement with recommendations failed:', error);
  }
}

// ============================================================================
// EXAMPLE 5: PREVIEW ENHANCEMENT CHANGES
// ============================================================================

export async function previewEnhancementChanges() {
  console.log('👀 Example 5: Preview Enhancement Changes\n');
  
  const templateId = websiteTemplates[0].id;
  
  const config: TemplateEnhancementConfig = {
    id: `preview_enhancement_${Date.now()}`,
    templateId,
    templateType: 'website',
    enhancementLevel: 'professional',
    conversionGoals: [],
    enabledFeatures: {
      enterpriseDesign: true,
      gamification: true,
      interactivity: true,
      personalization: false,
      analytics: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  try {
    console.log('🔍 Generating enhancement preview...');
    
    const preview = await templateEnhancementService.previewEnhancement(templateId, config);
    
    console.log('📋 Original Template:');
    console.log(`   ID: ${preview.original.id}`);
    console.log(`   Title: ${preview.original.title}`);
    console.log(`   Components: ${preview.original.components.length}`);
    
    console.log('\n✨ Enhanced Template:');
    console.log(`   ID: ${preview.enhanced.id}`);
    console.log(`   Title: ${preview.enhanced.title}`);
    console.log(`   Components: ${preview.enhanced.components.length}`);
    
    console.log('\n📝 Changes Applied:');
    preview.changes.forEach((change, index) => {
      console.log(`   ${index + 1}. ${change}`);
    });
    
    console.log(`\n✅ Preview generated successfully! ${preview.changes.length} changes detected.\n`);
    
    return preview;
    
  } catch (error) {
    console.error('❌ Preview generation failed:', error);
  }
}

// ============================================================================
// EXAMPLE 6: VALIDATE TEMPLATE COMPATIBILITY
// ============================================================================

export async function validateTemplateCompatibility() {
  console.log('🔍 Example 6: Validate Template Compatibility\n');
  
  try {
    console.log('🧪 Validating template compatibility...');
    
    const results = [];
    
    // Test first 3 templates
    for (const template of websiteTemplates.slice(0, 3)) {
      const validation = await templateEnhancementService.validateTemplateCompatibility(template.id);
      
      console.log(`\n📋 Template: ${template.title}`);
      console.log(`   Compatible: ${validation.compatible ? '✅ Yes' : '❌ No'}`);
      
      if (validation.issues.length > 0) {
        console.log('   Issues:');
        validation.issues.forEach(issue => console.log(`     - ${issue}`));
      }
      
      if (validation.recommendations.length > 0) {
        console.log('   Recommendations:');
        validation.recommendations.forEach(rec => console.log(`     - ${rec}`));
      }
      
      results.push({
        templateId: template.id,
        templateTitle: template.title,
        ...validation
      });
    }
    
    const compatibleCount = results.filter(r => r.compatible).length;
    console.log(`\n📊 Compatibility Summary:`);
    console.log(`   Compatible templates: ${compatibleCount}/${results.length}`);
    console.log(`   Compatibility rate: ${Math.round((compatibleCount / results.length) * 100)}%\n`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Compatibility validation failed:', error);
  }
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

export async function runAllExamples() {
  console.log('🎯 Website Template Enhancement Examples\n');
  console.log('=' .repeat(60) + '\n');
  
  try {
    await basicTemplateEnhancement();
    await enterpriseTemplateEnhancement();
    await bulkTemplateEnhancement();
    await enhancementWithRecommendations();
    await previewEnhancementChanges();
    await validateTemplateCompatibility();
    
    console.log('🎉 All examples completed successfully!');
    console.log('The website template enhancement system is ready for use.\n');
    
  } catch (error) {
    console.error('❌ Examples failed:', error);
  }
}

// Export for external use
export const websiteEnhancementExamples = {
  basic: basicTemplateEnhancement,
  enterprise: enterpriseTemplateEnhancement,
  bulk: bulkTemplateEnhancement,
  withRecommendations: enhancementWithRecommendations,
  preview: previewEnhancementChanges,
  validate: validateTemplateCompatibility,
  runAll: runAllExamples
};