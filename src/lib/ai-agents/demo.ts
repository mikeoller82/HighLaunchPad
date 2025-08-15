#!/usr/bin/env node

// AI Agent Framework Demonstration Script
import { demonstrateFramework } from './example';

async function main() {
  console.log('🤖 AI Agent Framework Demo');
  console.log('==========================\n');
  
  try {
    await demonstrateFramework();
  } catch (error) {
    console.error('Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  main();
}