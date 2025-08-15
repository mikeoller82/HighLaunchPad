// Debug script to check template enhancement
const fs = require('fs');
const path = require('path');

// Read the raw templates file to see what we have
const templatesPath = path.join(__dirname, 'src/lib/website-templates.ts');
const content = fs.readFileSync(templatesPath, 'utf8');

console.log('🔍 Checking website-templates.ts structure...\n');

// Check if the file has the enhanced export
if (content.includes('templateEnhancementService.enhanceAllTemplates')) {
  console.log('✅ Enhanced templates export found');
} else {
  console.log('❌ Enhanced templates export NOT found');
}

// Check if the raw templates are available
if (content.includes('websiteTemplatesRaw')) {
  console.log('✅ Raw templates found');
} else {
  console.log('❌ Raw templates NOT found');
}

// Check if the enhancement service is imported
if (content.includes('templateEnhancementService')) {
  console.log('✅ Template enhancement service imported');
} else {
  console.log('❌ Template enhancement service NOT imported');
}

// Look for the raw templates array
const rawTemplatesMatch = content.match(/export const websiteTemplatesRaw: Template\[\] = \[([\s\S]*?)\];/);
if (rawTemplatesMatch) {
  const rawTemplatesContent = rawTemplatesMatch[1];
  const templateCount = (rawTemplatesContent.match(/{\s*id:/g) || []).length;
  console.log(`✅ Found ${templateCount} raw templates`);
  
  // Extract template IDs
  const idMatches = rawTemplatesContent.match(/id:\s*['"`]([^'"`]+)['"`]/g) || [];
  const templateIds = idMatches.map(match => match.match(/['"`]([^'"`]+)['"`]/)[1]);
  console.log('📋 Template IDs:', templateIds.join(', '));
} else {
  console.log('❌ Could not parse raw templates');
}

console.log('\n🎯 Checking for enhanced template types mentioned in summary:');
const enhancedTypes = ['consulting', 'ecommerce', 'real-estate', 'agency', 'construction', 'fitness', 'healthcare', 'restaurant'];
enhancedTypes.forEach(type => {
  const found = content.toLowerCase().includes(type);
  console.log(`   ${type}: ${found ? '✅' : '❌'}`);
});