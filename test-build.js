// Simple test to verify TypeScript compilation
const { execSync } = require('child_process');

try {
  console.log('Testing TypeScript compilation...');
  execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful!');
} catch (error) {
  console.error('❌ TypeScript compilation failed:', error.message);
  process.exit(1);
}