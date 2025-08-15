#!/usr/bin/env tsx

/**
 * Test script to verify OAuth configuration
 */

import { createSocialMediaManager } from '../src/lib/social-media-manager';

function testOAuthConfig() {
  console.log('🔍 Testing OAuth Configuration...\n');

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_BASE_URL',
    'LINKEDIN_CLIENT_ID',
    'LINKEDIN_CLIENT_SECRET', 
    'TWITTER_CLIENT_ID',
    'TWITTER_CLIENT_SECRET'
  ];

  console.log('📋 Environment Variables:');
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    console.log(`  ${envVar}: ${value ? '✅ Set' : '❌ Missing'}`);
  }
  console.log();

  // Test social media manager creation
  try {
    const socialManager = createSocialMediaManager();
    const supportedPlatforms = socialManager.getSupportedPlatforms();
    
    console.log('🚀 Social Media Manager:');
    console.log(`  Supported platforms: ${supportedPlatforms.join(', ')}`);
    
    // Test auth URL generation
    console.log('\n🔗 Auth URL Generation:');
    for (const platform of supportedPlatforms) {
      try {
        const authUrl = socialManager.getAuthUrl(platform, 'test-state-123');
        console.log(`  ${platform}: ✅ Generated (${authUrl.length} chars)`);
      } catch (error) {
        console.log(`  ${platform}: ❌ Failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    console.log('\n✅ OAuth configuration test completed!');
  } catch (error) {
    console.error('❌ Failed to create social media manager:', error);
  }
}

if (require.main === module) {
  testOAuthConfig();
}