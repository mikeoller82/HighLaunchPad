// Test script to verify enhanced templates are working correctly
const { websiteTemplates } = require('./src/lib/website-templates');

async function testEnhancedTemplates() {
  try {
    console.log('🔍 Testing Enhanced Templates...\n');
    
    // Load the enhanced templates
    const templates = await websiteTemplates;
    
    console.log(`📊 Found ${templates.length} enhanced templates\n`);
    
    // Check each template
    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title} (${template.id})`);
      console.log(`   Description: ${template.description}`);
      console.log(`   Components: ${template.components?.length || 0}`);
      console.log(`   Enhanced: ${template.isEnhanced ? '✅' : '❌'}`);
      console.log(`   Stats: ${JSON.stringify(template.stats)}`);
      
      // Check if template has the enhanced components from the summary
      const componentTypes = template.components?.map(c => c.type) || [];
      const hasEnhancedComponents = componentTypes.includes('brands') || 
                                   componentTypes.includes('stats') || 
                                   componentTypes.includes('portfolio') ||
                                   componentTypes.includes('pricing');
      
      console.log(`   Has Enhanced Components: ${hasEnhancedComponents ? '✅' : '❌'}`);
      console.log(`   Component Types: ${componentTypes.join(', ')}`);
      console.log('');
    });
    
    // Check specific templates mentioned in the enhancement summary
    const expectedEnhancedTemplates = [
      'consulting', 'ecommerce', 'real-estate', 'agency', 
      'construction', 'fitness', 'healthcare', 'restaurant'
    ];
    
    console.log('🎯 Checking for specific enhanced templates:');
    expectedEnhancedTemplates.forEach(expectedId => {
      const found = templates.find(t => t.id.includes(expectedId) || t.title.toLowerCase().includes(expectedId));
      console.log(`   ${expectedId}: ${found ? '✅ Found' : '❌ Missing'}`);
      if (found) {
        console.log(`      ID: ${found.id}, Title: ${found.title}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error testing enhanced templates:', error);
  }
}

testEnhancedTemplates();