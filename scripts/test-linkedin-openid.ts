#!/usr/bin/env tsx

/**
 * Test script for LinkedIn OpenID Connect OAuth implementation
 * 
 * This script tests the updated LinkedIn OAuth flow with OpenID Connect scopes:
 * - openid: Required to indicate the application wants to use OIDC
 * - profile: Required to retrieve the member's lite profile
 * - email: Required to retrieve the member's email address
 */

import { LinkedInOAuth } from '../src/lib/social-oauth-clients';

async function testLinkedInOpenID() {
  console.log('🔍 Testing LinkedIn OpenID Connect OAuth Implementation');
  console.log('=' .repeat(60));

  // Check environment variables
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!clientId || !clientSecret) {
    console.error('❌ Missing LinkedIn OAuth credentials');
    console.log('Please set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables');
    return;
  }

  console.log('✅ LinkedIn OAuth credentials found');
  console.log(`📍 Base URL: ${baseUrl}`);

  // Initialize LinkedIn OAuth client with new OpenID Connect scopes
  const linkedinClient = new LinkedInOAuth({
    clientId,
    clientSecret,
    redirectUri: `${baseUrl}/api/oauth/linkedin/callback`,
    scopes: ['openid', 'profile', 'email', 'w_member_social']
  });

  console.log('\n🔗 Testing OAuth URL generation...');
  const state = 'test-state-' + Date.now();
  const authUrl = linkedinClient.getAuthUrl(state);
  
  console.log('✅ OAuth URL generated successfully');
  console.log(`🌐 Auth URL: ${authUrl}`);
  
  // Verify the URL contains the correct scopes
  const url = new URL(authUrl);
  const scopeParam = url.searchParams.get('scope');
  const expectedScopes = ['openid', 'profile', 'email', 'w_member_social'];
  
  console.log(`\n🔍 Verifying scopes in URL...`);
  console.log(`📋 Expected scopes: ${expectedScopes.join(', ')}`);
  console.log(`📋 URL scopes: ${scopeParam}`);
  
  if (scopeParam) {
    const urlScopes = scopeParam.split(' ');
    const hasAllScopes = expectedScopes.every(scope => urlScopes.includes(scope));
    
    if (hasAllScopes) {
      console.log('✅ All required OpenID Connect scopes are present');
    } else {
      console.log('❌ Missing required scopes');
      const missingScopes = expectedScopes.filter(scope => !urlScopes.includes(scope));
      console.log(`❌ Missing: ${missingScopes.join(', ')}`);
    }
  } else {
    console.log('❌ No scope parameter found in URL');
  }

  // Test JWKS endpoint accessibility
  console.log('\n🔍 Testing JWKS endpoint accessibility...');
  try {
    const jwksResponse = await fetch('https://www.linkedin.com/oauth/openid/jwks');
    if (jwksResponse.ok) {
      const jwks = await jwksResponse.json();
      console.log('✅ JWKS endpoint accessible');
      console.log(`🔑 Found ${jwks.keys?.length || 0} keys in JWKS`);
    } else {
      console.log(`❌ JWKS endpoint returned status: ${jwksResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Error accessing JWKS endpoint: ${error}`);
  }

  // Test userinfo endpoint (requires valid token, so we'll just check if it's reachable)
  console.log('\n🔍 Testing userinfo endpoint accessibility...');
  try {
    const userinfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': 'Bearer invalid-token-for-testing'
      }
    });
    
    // We expect a 401 Unauthorized, which means the endpoint is reachable
    if (userinfoResponse.status === 401) {
      console.log('✅ Userinfo endpoint is accessible (returned 401 as expected)');
    } else {
      console.log(`⚠️  Userinfo endpoint returned unexpected status: ${userinfoResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Error accessing userinfo endpoint: ${error}`);
  }

  console.log('\n📋 Summary:');
  console.log('- Updated LinkedIn OAuth to use OpenID Connect');
  console.log('- Added required scopes: openid, profile, email');
  console.log('- Implemented ID token validation with JWKS');
  console.log('- Updated profile retrieval to use userinfo endpoint');
  console.log('- Added fallback to legacy profile endpoint if needed');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Test the OAuth flow in your LinkedIn Developer Portal');
  console.log('2. Ensure your LinkedIn app has "Sign in with LinkedIn using OpenID Connect" product enabled');
  console.log('3. Verify the redirect URI matches exactly in your LinkedIn app settings');
  console.log('4. Test with a real OAuth flow to validate ID token handling');
}

// Run the test
testLinkedInOpenID().catch(console.error);