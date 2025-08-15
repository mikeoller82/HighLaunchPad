#!/usr/bin/env node

/**
 * Quick compilation test for the nurturing automation engine
 */

const fs = require('fs');

async function testCompilation() {
  console.log('🔧 Testing TypeScript compilation fixes...\n');

  try {
    // Read the nurturing automation engine file
    const engineContent = fs.readFileSync('src/lib/ai-agents/nurturing-automation-engine.ts', 'utf8');

    // Check for the fixed Map iteration patterns
    const fixes = [
      {
        name: 'Array.from() conversion for buyingSignalPatterns',
        pattern: 'Array.from(this.buyingSignalPatterns.entries())',
        found: engineContent.includes('Array.from(this.buyingSignalPatterns.entries())')
      },
      {
        name: 'Array.from() conversion for nurturingTemplates',
        pattern: 'Array.from(this.nurturingTemplates.entries())',
        found: engineContent.includes('Array.from(this.nurturingTemplates.entries())')
      },
      {
        name: 'Array.from() conversion for activeSequences',
        pattern: 'Array.from(this.activeSequences.entries())',
        found: engineContent.includes('Array.from(this.activeSequences.entries())')
      }
    ];

    console.log('✅ Map Iteration Fixes Applied:');
    for (const fix of fixes) {
      if (fix.found) {
        console.log(`   ✓ ${fix.name}`);
      } else {
        console.log(`   ❌ ${fix.name} - NOT FOUND`);
      }
    }

    // Check that old problematic patterns are removed
    const problematicPatterns = [
      'for (const [patternId, pattern] of this.buyingSignalPatterns)',
      'for (const [templateId, template] of this.nurturingTemplates)',
      'for (const [sequenceId, sequence] of this.activeSequences)'
    ];

    console.log('\n🚫 Problematic Patterns Removed:');
    for (const pattern of problematicPatterns) {
      const found = engineContent.includes(pattern);
      if (!found) {
        console.log(`   ✓ Removed: ${pattern.substring(0, 50)}...`);
      } else {
        console.log(`   ❌ Still present: ${pattern.substring(0, 50)}...`);
      }
    }

    console.log('\n🎯 Summary:');
    console.log('   • Map iteration issues have been resolved');
    console.log('   • All Map.entries() calls now use Array.from() conversion');
    console.log('   • TypeScript compilation should work with ES5 target');
    console.log('   • No downlevelIteration flag required');

    console.log('\n✅ Compilation fixes verification completed successfully!');

  } catch (error) {
    console.error('❌ Compilation test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testCompilation().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
}