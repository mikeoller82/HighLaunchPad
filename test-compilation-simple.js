// Simple compilation test
console.log('Testing TypeScript compilation...');

const { spawn } = require('child_process');

const tsc = spawn('npx', ['tsc', '--noEmit', '--pretty'], {
  stdio: 'inherit',
  shell: true
});

tsc.on('close', (code) => {
  if (code === 0) {
    console.log('✅ TypeScript compilation successful!');
  } else {
    console.log(`❌ TypeScript compilation failed with code ${code}`);
  }
  process.exit(code);
});

tsc.on('error', (error) => {
  console.error('❌ Failed to start TypeScript compiler:', error);
  process.exit(1);
});