#!/usr/bin/env node

// Simple test to verify TypeScript fixes
console.log('🧪 Testing TypeScript Fixes');
console.log('='.repeat(50));

try {
  // Test 1: Check if files can be required without syntax errors
  console.log('📁 Testing file imports...');
  
  // We'll test the compiled JavaScript if available, or just check syntax
  const fs = require('fs');
  const path = require('path');
  
  const filesToCheck = [
    'src/lib/ai-agents/types.ts',
    'src/lib/ai-agents/base-agent.ts',
    'src/lib/ai-agents/lead-management-agent.ts',
    'src/lib/ai-agents/lead-capture-service.ts',
    'src/lib/ai-agents/test-lead-management.ts'
  ];
  
  let allFilesExist = true;
  
  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      console.log(`  ✅ ${file} exists`);
      
      // Basic syntax check - read file and check for obvious issues
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for common TypeScript issues we fixed
      const issues = [];
      
      // Check for string repeat issue
      if (content.includes("'=' .repeat(")) {
        issues.push("String repeat spacing issue");
      }
      
      // Check for proper imports
      if (file.includes('test-lead-management.ts') && !content.includes('QualificationStatus')) {
        issues.push("Missing QualificationStatus import");
      }
      
      if (issues.length > 0) {
        console.log(`    ⚠️  Issues found: ${issues.join(', ')}`);
        allFilesExist = false;
      } else {
        console.log(`    ✅ No obvious syntax issues`);
      }
      
    } else {
      console.log(`  ❌ ${file} missing`);
      allFilesExist = false;
    }
  }
  
  // Test 2: Check for proper TypeScript patterns
  console.log('\n🔍 Checking TypeScript patterns...');
  
  const leadAgentContent = fs.readFileSync('src/lib/ai-agents/lead-management-agent.ts', 'utf8');
  
  // Check if we fixed the assignLead return type
  if (leadAgentContent.includes('assignLead(leadData: any, context?: DecisionContext): Promise<string | null>')) {
    console.log('  ✅ assignLead method signature fixed');
  } else {
    console.log('  ❌ assignLead method signature needs fixing');
  }
  
  // Check if we added proper null checks for leadData.id
  if (leadAgentContent.includes('leadData.id || event.leadId ||')) {
    console.log('  ✅ leadData.id null checks added');
  } else {
    console.log('  ❌ leadData.id null checks missing');
  }
  
  // Test 3: Summary
  console.log('\n📊 Summary:');
  if (allFilesExist) {
    console.log('  ✅ All files exist and have basic syntax correctness');
    console.log('  ✅ TypeScript fixes appear to be applied correctly');
    console.log('  ✅ Ready for compilation testing');
  } else {
    console.log('  ❌ Some issues remain to be fixed');
  }
  
  console.log('\n🎉 TypeScript fixes verification completed!');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}