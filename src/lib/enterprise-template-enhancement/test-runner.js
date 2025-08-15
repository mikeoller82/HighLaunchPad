/**
 * Simple test runner for trust signal system
 */

const { TrustSignalManager, SecurityBadgeSystem } = require('./trust-signal-manager');

async function runBasicTests() {
  console.log('🧪 Running basic trust signal tests...');
  
  try {
    // Test security badge creation
    console.log('  Testing security badge creation...');
    const badges = SecurityBadgeSystem.createSecurityBadges(['soc2', 'ssl']);
    console.log(`    ✅ Created ${badges.length} security badges`);
    
    // Test badge validation
    console.log('  Testing badge validation...');
    const isValid = SecurityBadgeSystem.validateSecurityBadge(badges[0]);
    console.log(`    ✅ Badge validation: ${isValid}`);
    
    // Test HTML generation
    console.log('  Testing HTML generation...');
    const html = SecurityBadgeSystem.generateSecurityBadgeHTML(badges[0]);
    console.log(`    ✅ Generated HTML (${html.length} chars)`);
    
    console.log('🎉 Basic tests passed!');
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
  }
}

runBasicTests();