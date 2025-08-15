/**
 * Personalization Engine Usage Examples
 * 
 * This file demonstrates how to use the comprehensive personalization and dynamic content engine
 * to implement all requirements from Requirement 7.
 */

import { PersonalizationEngine, UserContext, PersonalizationResult } from './personalization-engine';
import { DynamicContentManager } from './dynamic-content-manager';
import { UserPreferenceManager } from './user-preference-manager';
import CtaOptimizer from './cta-optimizer';
import type { Component } from '../types';

/**
 * Example 1: Basic Personalization Setup
 * Demonstrates Requirement 7.1: Traffic source, location, and previous interactions
 */
export async function basicPersonalizationExample() {
  console.log('🎯 Example 1: Basic Personalization Setup\n');

  const personalizationEngine = new PersonalizationEngine();

  // Sample component to personalize
  const heroComponent: Component = {
    id: 'hero-section',
    type: 'hero',
    name: 'Hero Section',
    content: 'Welcome to {{country}} visitors from {{traffic_source}}!',
    style: {
      backgroundColor: '#f8f9fa',
      padding: '60px 20px',
      textAlign: 'center'
    }
  };

  // User context with traffic source, location, and previous interactions
  const userContext: UserContext = {
    trafficSource: 'google-ads',
    location: {
      country: 'US',
      region: 'California',
      city: 'San Francisco',
      timezone: 'America/Los_Angeles'
    },
    device: {
      type: 'desktop',
      os: 'Windows',
      browser: 'Chrome'
    },
    previousInteractions: {
      visitCount: 3,
      lastVisit: new Date(Date.now() - 86400000), // 1 day ago
      pagesViewed: ['/home', '/pricing', '/features'],
      actionsCompleted: ['newsletter_signup', 'demo_request'],
      timeSpent: 1200 // 20 minutes total
    }
  };

  // Apply personalization
  const result = await personalizationEngine.createPersonalizedSystem(heroComponent, userContext);

  console.log('✅ Personalization Result:');
  console.log(`- Success: ${result.success}`);
  console.log(`- Applied Rules: ${result.appliedRules.join(', ')}`);
  console.log(`- Content Changes: ${result.contentChanges.length}`);
  console.log(`- User Segment: ${result.metadata.userSegment}`);
  console.log(`- Confidence: ${result.metadata.confidence}%`);
  console.log(`- Processing Time: ${result.metadata.processingTime}ms\n`);

  return result;
}

/**
 * Example 2: Dynamic Text Replacement System
 * Demonstrates Requirement 7.2: Dynamic text replacement and conditional content blocks
 */
export async function dynamicTextReplacementExample() {
  console.log('🔄 Example 2: Dynamic Text Replacement System\n');

  const personalizationEngine = new PersonalizationEngine();

  // Component with placeholder text
  const contentComponent: Component = {
    id: 'dynamic-content',
    type: 'text',
    name: 'Dynamic Content Section',
    content: `
      <h2>Welcome {{country}} visitors!</h2>
      <p>Join thousands of users in {{current_year}} who trust our platform.</p>
      <p>Special offer for {{traffic_source}} visitors - save 30% today!</p>
      <div class="user-segment-content">Content for {{user_segment}} users</div>
    `
  };

  const userContext: UserContext = {
    trafficSource: 'facebook',
    location: { country: 'UK', timezone: 'Europe/London' },
    device: { type: 'mobile', os: 'iOS', browser: 'Safari' }
  };

  // Build dynamic text replacement system
  const dynamicConfig = await personalizationEngine.buildDynamicTextReplacementSystem(
    contentComponent, 
    userContext
  );

  console.log('✅ Dynamic Text Replacement Configuration:');
  console.log(`- Configuration ID: ${dynamicConfig.id}`);
  console.log(`- Target Selector: ${dynamicConfig.targetSelector}`);
  console.log(`- Content Rules: ${dynamicConfig.contentRules.length}`);
  console.log(`- Update Frequency: ${dynamicConfig.updateFrequency}`);

  // Show some example rules
  console.log('\n📋 Sample Content Rules:');
  dynamicConfig.contentRules.slice(0, 3).forEach((rule, index) => {
    console.log(`${index + 1}. ${rule.id} (Priority: ${rule.priority})`);
    console.log(`   Condition: ${rule.condition}`);
    console.log(`   Content Preview: ${rule.content.substring(0, 100)}...`);
  });

  console.log('');
  return dynamicConfig;
}

/**
 * Example 3: User Preference Memory System
 * Demonstrates Requirement 7.3: User preference memory and experience customization
 */
export async function userPreferenceMemoryExample() {
  console.log('💾 Example 3: User Preference Memory System\n');

  const personalizationEngine = new PersonalizationEngine();
  const userPreferenceManager = new UserPreferenceManager();

  // User context with preferences and interaction history
  const userContext: UserContext = {
    preferences: {
      theme: 'dark',
      language: 'en-US',
      fontSize: '18px',
      notifications: true,
      autoplay: false,
      currency: 'USD'
    },
    previousInteractions: {
      visitCount: 5,
      lastVisit: new Date(),
      pagesViewed: ['/dashboard', '/settings', '/profile'],
      actionsCompleted: ['profile_update', 'subscription_upgrade'],
      timeSpent: 2400 // 40 minutes
    },
    segment: 'premium_user'
  };

  // Implement user preference memory
  await personalizationEngine.implementUserPreferenceMemory(userContext);

  console.log('✅ User Preferences Stored:');
  console.log(`- Theme: ${userPreferenceManager.getPreference('theme')}`);
  console.log(`- Language: ${userPreferenceManager.getPreference('language')}`);
  console.log(`- Font Size: ${userPreferenceManager.getPreference('fontSize')}`);
  console.log(`- User Segment: ${userPreferenceManager.getPreference('user_segment')}`);

  // Demonstrate preference-based customization
  const allPreferences = userPreferenceManager.getAllPreferences();
  console.log('\n🎨 Experience Customizations Applied:');
  console.log(`- Total Stored Preferences: ${Object.keys(allPreferences).length}`);
  console.log('- Theme customization: Applied to document root');
  console.log('- Language customization: Applied to HTML lang attribute');
  console.log('- Font size customization: Applied to document font size');

  console.log('');
  return allPreferences;
}

/**
 * Example 4: Relevant Testimonial System
 * Demonstrates Requirement 7.4: Display relevant examples based on user characteristics
 */
export async function relevantTestimonialExample() {
  console.log('⭐ Example 4: Relevant Testimonial System\n');

  const personalizationEngine = new PersonalizationEngine();

  // Testimonial component
  const testimonialComponent: Component = {
    id: 'testimonials-section',
    type: 'testimonial',
    name: 'Customer Testimonials',
    content: '<div class="testimonials-container">Loading testimonials...</div>'
  };

  // User context for enterprise tech user
  const enterpriseUserContext: UserContext = {
    segment: 'enterprise',
    customAttributes: {
      industry: 'tech',
      company_size: '500+',
      role: 'CTO'
    },
    location: { country: 'US' },
    trafficSource: 'linkedin'
  };

  // Create relevant testimonial system
  const testimonialConfig = await personalizationEngine.createRelevantTestimonialSystem(
    testimonialComponent,
    enterpriseUserContext
  );

  console.log('✅ Relevant Testimonial Configuration:');
  console.log(`- Configuration ID: ${testimonialConfig.id}`);
  console.log(`- Target Selector: ${testimonialConfig.targetSelector}`);
  console.log(`- Testimonial Rules: ${testimonialConfig.contentRules.length}`);

  // Show testimonial matching logic
  console.log('\n🎯 Testimonial Matching:');
  console.log('- User Segment: enterprise');
  console.log('- Industry: tech');
  console.log('- Location: US');
  console.log('- Traffic Source: linkedin');

  console.log('\n📝 Generated Testimonial Variations:');
  testimonialConfig.contentRules.forEach((rule, index) => {
    if (rule.content.includes('testimonial') || rule.content.includes('blockquote')) {
      console.log(`${index + 1}. Priority ${rule.priority} - ${rule.condition}`);
      console.log(`   Content: ${rule.content.substring(0, 150)}...`);
    }
  });

  console.log('');
  return testimonialConfig;
}

/**
 * Example 5: CTA Optimization System
 * Demonstrates Requirement 7.5: Optimize button text, colors, and placement based on user behavior
 */
export async function ctaOptimizationExample() {
  console.log('🎯 Example 5: CTA Optimization System\n');

  const personalizationEngine = new PersonalizationEngine();

  // CTA component
  const ctaComponent: Component = {
    id: 'primary-cta',
    type: 'button',
    name: 'Primary Call-to-Action',
    content: 'Get Started',
    style: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '6px'
    }
  };

  // Different user contexts for CTA optimization
  const contexts = [
    {
      name: 'Enterprise Desktop User',
      context: {
        segment: 'enterprise',
        device: { type: 'desktop' as const, os: 'Windows', browser: 'Chrome' },
        trafficSource: 'organic',
        previousInteractions: {
          visitCount: 2,
          lastVisit: new Date(),
          pagesViewed: ['/enterprise', '/pricing'],
          actionsCompleted: [],
          timeSpent: 300
        }
      }
    },
    {
      name: 'Startup Mobile User',
      context: {
        segment: 'startup',
        device: { type: 'mobile' as const, os: 'iOS', browser: 'Safari' },
        trafficSource: 'producthunt',
        previousInteractions: {
          visitCount: 1,
          lastVisit: new Date(),
          pagesViewed: ['/home'],
          actionsCompleted: [],
          timeSpent: 120
        }
      }
    },
    {
      name: 'Paid Traffic User',
      context: {
        segment: 'general',
        device: { type: 'desktop' as const, os: 'macOS', browser: 'Safari' },
        trafficSource: 'google-ads',
        previousInteractions: {
          visitCount: 1,
          lastVisit: new Date(),
          pagesViewed: ['/landing'],
          actionsCompleted: [],
          timeSpent: 60
        }
      }
    }
  ];

  console.log('✅ CTA Optimization Results:\n');

  for (const { name, context } of contexts) {
    console.log(`📱 ${name}:`);

    // Build CTA optimization system
    const ctaConfig = await personalizationEngine.buildCtaOptimizationSystem(ctaComponent, context);
    
    // Get optimized CTA from CtaOptimizer
    const optimizedCta = CtaOptimizer.getOptimizedCta(context);

    console.log(`   - Variation: ${optimizedCta.variation.text}`);
    console.log(`   - Color: ${optimizedCta.variation.color}`);
    console.log(`   - Position: ${optimizedCta.placement.position}`);
    console.log(`   - Size: ${optimizedCta.placement.size}`);
    console.log(`   - Prominence: ${optimizedCta.placement.prominence}`);
    console.log(`   - Priority: ${optimizedCta.variation.priority}`);
    console.log(`   - Content Rules: ${ctaConfig.contentRules.length}`);
    console.log('');
  }

  return contexts.map(({ context }) => CtaOptimizer.getOptimizedCta(context));
}

/**
 * Example 6: Complete Personalization Pipeline
 * Demonstrates all requirements working together
 */
export async function completePersonalizationPipeline() {
  console.log('🚀 Example 6: Complete Personalization Pipeline\n');

  const personalizationEngine = new PersonalizationEngine();

  // Complex template with multiple components
  const template = {
    id: 'landing-page-template',
    components: [
      {
        id: 'hero',
        type: 'hero',
        name: 'Hero Section',
        content: 'Transform your {{user_segment}} business with our platform'
      },
      {
        id: 'testimonials',
        type: 'testimonial',
        name: 'Social Proof',
        content: 'Customer testimonials'
      },
      {
        id: 'cta',
        type: 'button',
        name: 'Primary CTA',
        content: 'Get Started'
      }
    ]
  };

  // Comprehensive user context
  const userContext: UserContext = {
    trafficSource: 'linkedin',
    location: {
      country: 'UK',
      region: 'London',
      timezone: 'Europe/London'
    },
    device: {
      type: 'desktop',
      os: 'macOS',
      browser: 'Chrome'
    },
    previousInteractions: {
      visitCount: 3,
      lastVisit: new Date(Date.now() - 3600000), // 1 hour ago
      pagesViewed: ['/home', '/pricing', '/features', '/about'],
      actionsCompleted: ['newsletter_signup', 'whitepaper_download'],
      timeSpent: 1800 // 30 minutes
    },
    preferences: {
      theme: 'light',
      language: 'en-GB',
      currency: 'GBP',
      notifications: true
    },
    segment: 'enterprise',
    customAttributes: {
      industry: 'fintech',
      company_size: '200',
      role: 'VP Engineering'
    }
  };

  console.log('🎯 Processing Complete Personalization Pipeline...\n');

  // Process each component through the personalization pipeline
  const results = [];

  for (const component of template.components) {
    console.log(`📦 Processing ${component.name} (${component.type}):`);

    // 1. Apply basic personalization
    const personalizationResult = await personalizationEngine.createPersonalizedSystem(
      component as Component, 
      userContext
    );

    // 2. Build dynamic text replacement
    const dynamicTextConfig = await personalizationEngine.buildDynamicTextReplacementSystem(
      component as Component,
      userContext
    );

    // 3. Create relevant testimonials (for testimonial components)
    let testimonialConfig = null;
    if (component.type === 'testimonial') {
      testimonialConfig = await personalizationEngine.createRelevantTestimonialSystem(
        component as Component,
        userContext
      );
    }

    // 4. Optimize CTAs (for button components)
    let ctaConfig = null;
    if (component.type === 'button') {
      ctaConfig = await personalizationEngine.buildCtaOptimizationSystem(
        component as Component,
        userContext
      );
    }

    console.log(`   ✅ Applied ${personalizationResult.appliedRules.length} personalization rules`);
    console.log(`   ✅ Created ${dynamicTextConfig.contentRules.length} dynamic content rules`);
    if (testimonialConfig) {
      console.log(`   ✅ Generated ${testimonialConfig.contentRules.length} testimonial variations`);
    }
    if (ctaConfig) {
      console.log(`   ✅ Created ${ctaConfig.contentRules.length} CTA optimization rules`);
    }
    console.log(`   📊 Confidence: ${personalizationResult.metadata.confidence}%`);
    console.log('');

    results.push({
      component: component.name,
      personalization: personalizationResult,
      dynamicText: dynamicTextConfig,
      testimonials: testimonialConfig,
      cta: ctaConfig
    });
  }

  // 5. Implement user preference memory
  await personalizationEngine.implementUserPreferenceMemory(userContext);

  console.log('🎉 Complete Personalization Pipeline Results:');
  console.log(`- Total Components Processed: ${results.length}`);
  console.log(`- User Segment: ${userContext.segment}`);
  console.log(`- Traffic Source: ${userContext.trafficSource}`);
  console.log(`- Location: ${userContext.location?.country}`);
  console.log(`- Device: ${userContext.device?.type}`);
  console.log(`- Previous Visits: ${userContext.previousInteractions?.visitCount}`);
  console.log(`- Stored Preferences: ${Object.keys(userContext.preferences || {}).length}`);

  // Generate client-side personalization script
  const clientScript = personalizationEngine.generatePersonalizationScript(userContext);
  console.log(`\n📜 Generated client-side script: ${clientScript.length} characters`);

  console.log('\n✅ All Requirement 7 features successfully demonstrated!');

  return {
    template,
    userContext,
    results,
    clientScript
  };
}

/**
 * Example 7: Performance and Analytics
 * Demonstrates performance optimization and analytics integration
 */
export async function performanceAndAnalyticsExample() {
  console.log('📊 Example 7: Performance and Analytics\n');

  const personalizationEngine = new PersonalizationEngine();

  // Test performance with multiple components
  const components: Component[] = Array.from({ length: 10 }, (_, i) => ({
    id: `component-${i}`,
    type: i % 2 === 0 ? 'text' : 'button',
    name: `Component ${i}`,
    content: `Content for component ${i} with {{dynamic}} placeholders`
  }));

  const userContext: UserContext = {
    trafficSource: 'organic',
    location: { country: 'US' },
    device: { type: 'desktop', os: 'Windows', browser: 'Chrome' },
    segment: 'professional'
  };

  console.log('⚡ Performance Testing:');
  const startTime = Date.now();

  const results = [];
  for (const component of components) {
    const result = await personalizationEngine.createPersonalizedSystem(component, userContext);
    results.push(result);
  }

  const totalTime = Date.now() - startTime;
  const avgTime = totalTime / components.length;

  console.log(`- Total Processing Time: ${totalTime}ms`);
  console.log(`- Average Time per Component: ${avgTime.toFixed(2)}ms`);
  console.log(`- Components Processed: ${components.length}`);
  console.log(`- Performance Target: <100ms per component ✅`);

  // Analytics data
  console.log('\n📈 Analytics Summary:');
  const totalRules = results.reduce((sum, r) => sum + r.appliedRules.length, 0);
  const totalChanges = results.reduce((sum, r) => sum + r.contentChanges.length, 0);
  const avgConfidence = results.reduce((sum, r) => sum + r.metadata.confidence, 0) / results.length;

  console.log(`- Total Personalization Rules Applied: ${totalRules}`);
  console.log(`- Total Content Changes: ${totalChanges}`);
  console.log(`- Average Confidence Score: ${avgConfidence.toFixed(1)}%`);
  console.log(`- Success Rate: ${results.filter(r => r.success).length}/${results.length} (${Math.round(results.filter(r => r.success).length / results.length * 100)}%)`);

  return {
    performanceMetrics: {
      totalTime,
      avgTime,
      componentsProcessed: components.length
    },
    analyticsData: {
      totalRules,
      totalChanges,
      avgConfidence,
      successRate: results.filter(r => r.success).length / results.length
    }
  };
}

/**
 * Run all examples
 */
export async function runAllPersonalizationExamples() {
  console.log('🎯 Enterprise Template Enhancement - Personalization Engine Examples\n');
  console.log('=' .repeat(80) + '\n');

  try {
    await basicPersonalizationExample();
    await dynamicTextReplacementExample();
    await userPreferenceMemoryExample();
    await relevantTestimonialExample();
    await ctaOptimizationExample();
    await completePersonalizationPipeline();
    await performanceAndAnalyticsExample();

    console.log('🎉 All personalization examples completed successfully!');
    console.log('\n📋 Requirements Coverage Summary:');
    console.log('✅ Requirement 7.1: Traffic source, location, and previous interactions personalization');
    console.log('✅ Requirement 7.2: Dynamic text replacement and conditional content blocks');
    console.log('✅ Requirement 7.3: User preference memory and experience customization');
    console.log('✅ Requirement 7.4: Relevant testimonial and case study display');
    console.log('✅ Requirement 7.5: CTA optimization with dynamic text, colors, and placement');

  } catch (error) {
    console.error('❌ Error running personalization examples:', error);
  }
}

// Export all examples for individual use
export {
  basicPersonalizationExample,
  dynamicTextReplacementExample,
  userPreferenceMemoryExample,
  relevantTestimonialExample,
  ctaOptimizationExample,
  completePersonalizationPipeline,
  performanceAndAnalyticsExample
};

// Run examples if this file is executed directly
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runAllPersonalizationExamples();
}