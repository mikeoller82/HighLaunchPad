#!/usr/bin/env node
/**
 * LinkedIn OAuth Production Verification Script
 * Run this to verify your LinkedIn OAuth setup is correct for production
 */

import https from 'https';
import { URL } from 'url';

const PRODUCTION_URL = 'https://highlaunchpad.com';
const LINKEDIN_APP_ID = '86lhf1a47prmph';

async function checkEndpoint(url: string): Promise<{ status: number; headers: any }> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            resolve({
                status: res.statusCode || 0,
                headers: res.headers
            });
        }).on('error', reject);
    });
}

async function verifyLinkedInProduction() {
    console.log('🔍 LinkedIn OAuth Production Verification\n');
    console.log(`App ID: ${LINKEDIN_APP_ID}`);
    console.log(`Production URL: ${PRODUCTION_URL}\n`);

    // 1. Check if callback endpoint is accessible
    console.log('1. Checking OAuth endpoints accessibility:');
    
    const endpoints = [
        '/api/oauth/linkedin/connect',
        '/api/oauth/linkedin/callback',
        '/oauth-success'
    ];

    for (const endpoint of endpoints) {
        try {
            const url = `${PRODUCTION_URL}${endpoint}`;
            const result = await checkEndpoint(url);
            console.log(`   ${endpoint}: ${result.status === 404 ? '❌ NOT FOUND' : '✅ Accessible'} (${result.status})`);
            
            if (result.status === 404) {
                console.log(`      ⚠️  This endpoint must be accessible for OAuth to work!`);
            }
        } catch (error) {
            console.log(`   ${endpoint}: ❌ Error - ${error}`);
        }
    }

    console.log('\n2. LinkedIn App Configuration Requirements:');
    console.log('   Go to: https://www.linkedin.com/developers/apps');
    console.log(`   Direct link: https://www.linkedin.com/developers/apps/${LINKEDIN_APP_ID}/auth\n`);
    
    console.log('   Required Authorized Redirect URLs (add ALL of these):');
    console.log(`   ✓ ${PRODUCTION_URL}/api/oauth/linkedin/callback`);
    console.log(`   ✓ https://www.highlaunchpad.com/api/oauth/linkedin/callback`);
    console.log('   Note: Add both with and without www to be safe\n');

    console.log('3. Required Products (at least one):');
    console.log('   ✓ Sign In with LinkedIn using OpenID Connect');
    console.log('   ✓ Share on LinkedIn');
    console.log('   ✓ Marketing Developer Platform\n');

    console.log('4. OAuth 2.0 Scopes to enable:');
    console.log('   ✓ openid (for OpenID Connect)');
    console.log('   ✓ profile (for OpenID Connect)');
    console.log('   ✓ email (for OpenID Connect)');
    console.log('   ✓ w_member_social (for posting)\n');

    console.log('5. Common Issues and Solutions:');
    console.log('   Issue: "Page not found" error');
    console.log('   → Solution: Exact redirect URI match required');
    console.log('   → Check: No trailing slashes, exact protocol (https), exact domain\n');
    
    console.log('   Issue: "Invalid redirect_uri" error');
    console.log('   → Solution: Copy the exact URI from the error and add to LinkedIn app\n');
    
    console.log('   Issue: "Unauthorized scope" error');
    console.log('   → Solution: Remove w_member_social scope or request approval\n');

    console.log('6. Test OAuth Flow:');
    const testState = 'test123';
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', LINKEDIN_APP_ID);
    authUrl.searchParams.set('redirect_uri', `${PRODUCTION_URL}/api/oauth/linkedin/callback`);
    authUrl.searchParams.set('scope', 'openid profile email w_member_social');
    authUrl.searchParams.set('state', testState);
    
    console.log('   Open this URL in a browser:');
    console.log(`   ${authUrl.toString()}\n`);
    
    console.log('7. Expected Flow:');
    console.log('   1. User clicks Connect in your app');
    console.log('   2. Redirected to LinkedIn login');
    console.log('   3. User authorizes your app');
    console.log('   4. LinkedIn redirects to: /api/oauth/linkedin/callback');
    console.log('   5. Your app processes the code');
    console.log('   6. User redirected to: /oauth-success');
    console.log('   7. Window closes or redirects to settings\n');

    console.log('8. Debugging Tips:');
    console.log('   - Check browser DevTools Network tab for exact redirect URL');
    console.log('   - Look for "redirect_uri" parameter in the LinkedIn auth URL');
    console.log('   - Check Vercel/deployment logs for callback route errors');
    console.log('   - Ensure popups are not blocked in the browser\n');

    console.log('✅ Verification complete!');
}

// Run verification
verifyLinkedInProduction().catch(console.error);