#!/usr/bin/env node
import { LinkedInOAuth } from '../src/lib/social-oauth-clients';
import crypto from 'crypto';

// Test LinkedIn OAuth configuration
async function testLinkedInOAuth() {
    console.log('🔍 Testing LinkedIn OAuth Configuration\n');

    // Check environment variables
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    console.log('1. Environment Variables:');
    console.log(`   - Client ID: ${clientId ? '✅ Set' : '❌ Missing'} ${clientId ? `(${clientId})` : ''}`);
    console.log(`   - Client Secret: ${clientSecret ? '✅ Set' : '❌ Missing'} ${clientSecret ? `(${clientSecret.substring(0, 10)}...)` : ''}`);
    console.log(`   - Base URL: ${baseUrl ? '✅ Set' : '❌ Missing'} ${baseUrl ? `(${baseUrl})` : ''}`);
    console.log('');

    if (!clientId || !clientSecret || !baseUrl) {
        console.error('❌ Missing required environment variables!');
        process.exit(1);
    }

    // Create OAuth client
    const config = {
        clientId,
        clientSecret,
        redirectUri: `${baseUrl}/api/oauth/linkedin/callback`,
        scopes: ['openid', 'profile', 'email', 'w_member_social']
    };

    console.log('2. OAuth Configuration:');
    console.log(`   - Redirect URI: ${config.redirectUri}`);
    console.log(`   - Scopes: ${config.scopes.join(', ')}`);
    console.log('');

    const client = new LinkedInOAuth(config);

    // Generate test state
    const state = crypto.randomBytes(16).toString('hex');
    
    // Get auth URL
    const authUrl = client.getAuthUrl(state);
    
    console.log('3. Generated Auth URL:');
    console.log(`   ${authUrl}`);
    console.log('');

    // Parse and validate URL
    try {
        const url = new URL(authUrl);
        const params = url.searchParams;

        console.log('4. Auth URL Parameters:');
        console.log(`   - response_type: ${params.get('response_type')} ${params.get('response_type') === 'code' ? '✅' : '❌'}`);
        console.log(`   - client_id: ${params.get('client_id')} ${params.get('client_id') === clientId ? '✅' : '❌'}`);
        console.log(`   - redirect_uri: ${params.get('redirect_uri')}`);
        console.log(`     ${params.get('redirect_uri') === config.redirectUri ? '✅ Matches config' : '❌ Mismatch!'}`);
        console.log(`   - scope: ${params.get('scope')}`);
        console.log(`   - state: ${params.get('state')} ${params.get('state') === state ? '✅' : '❌'}`);
        console.log('');

        // Check for common issues
        console.log('5. Common Issues Check:');
        
        const redirectUri = params.get('redirect_uri') || '';
        
        // Check for trailing slash
        if (redirectUri.endsWith('/')) {
            console.log('   ⚠️  Redirect URI has trailing slash - this can cause issues!');
        } else {
            console.log('   ✅ No trailing slash in redirect URI');
        }

        // Check for localhost
        if (redirectUri.includes('localhost')) {
            console.log('   ⚠️  Using localhost - make sure this is intended for development');
        } else {
            console.log('   ✅ Using production domain');
        }

        // Check for HTTPS
        if (!redirectUri.startsWith('https://')) {
            console.log('   ❌ Not using HTTPS - LinkedIn requires HTTPS in production!');
        } else {
            console.log('   ✅ Using HTTPS');
        }

        // Check URL encoding
        const decodedUri = decodeURIComponent(redirectUri);
        if (decodedUri !== redirectUri) {
            console.log('   ⚠️  Redirect URI appears to be double-encoded');
        } else {
            console.log('   ✅ Redirect URI encoding looks correct');
        }

        console.log('\n6. LinkedIn App Configuration Required:');
        console.log('   Go to: https://www.linkedin.com/developers/apps');
        console.log('   1. Select your app → Auth tab');
        console.log('   2. Add this EXACT redirect URL:');
        console.log(`      ${config.redirectUri}`);
        console.log('   3. Ensure these products are added:');
        console.log('      - Sign In with LinkedIn using OpenID Connect');
        console.log('      - Share on LinkedIn');
        console.log('   4. Save changes');

        console.log('\n7. Test the OAuth Flow:');
        console.log('   1. Open this URL in a browser:');
        console.log(`      ${authUrl}`);
        console.log('   2. Log in to LinkedIn');
        console.log('   3. Check if you get redirected properly');
        console.log('   4. Look for error messages in the URL');

    } catch (error) {
        console.error('❌ Failed to parse auth URL:', error);
    }
}

// Run the test
testLinkedInOAuth().catch(console.error);