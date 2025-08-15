#!/usr/bin/env node

// Set up comprehensive global polyfills before anything else runs
if (typeof global !== 'undefined') {
  // Define self to prevent "self is not defined" errors
  if (typeof global.self === 'undefined') {
    global.self = global;
  }
  
  // Define window for browser compatibility
  if (typeof global.window === 'undefined') {
    global.window = global;
  }
  
  // Define document with basic methods
  if (typeof global.document === 'undefined') {
    global.document = {
      createElement: () => ({}),
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      body: {},
      head: {}
    };
  }
  
  // Define navigator
  if (typeof global.navigator === 'undefined') {
    global.navigator = { 
      userAgent: 'node',
      platform: 'node',
      language: 'en-US'
    };
  }
  
  // Define location
  if (typeof global.location === 'undefined') {
    global.location = {
      href: '',
      origin: '',
      protocol: 'http:',
      host: '',
      hostname: '',
      port: '',
      pathname: '/',
      search: '',
      hash: ''
    };
  }
}

// Also set on globalThis for better compatibility
if (typeof globalThis !== 'undefined') {
  if (typeof globalThis.self === 'undefined') {
    globalThis.self = globalThis;
  }
}

// Set environment variables
process.env.OTEL_SDK_DISABLED = 'true';
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Import and run Next.js build
const { spawn } = require('child_process');

const build = spawn('npx', ['next', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Ensure polyfills are available during build
    NODE_OPTIONS: '--require ./src/server-polyfill.js'
  }
});

build.on('close', (code) => {
  process.exit(code);
});