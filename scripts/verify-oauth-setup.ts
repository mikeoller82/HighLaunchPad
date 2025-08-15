#!/usr/bin/env tsx

/**
 * OAuth Setup Verification Script for fir-veilnet.web.app
 * This script helps verify your OAuth configuration is correct
 */

const DOMAIN = 'https://fir-veilnet.web.app';

console.log('🔍 OAUTH SETUP VERIFICATION FOR fir-veilnet.web.app');
console.log('='.repeat(60));

const redirectURIs = {
  twitter: `${DOMAIN}/api/oauth/twitter/callback`,
  linkedin: `${DOMAIN}/api/oauth/linkedin/callback`,
  facebook: `${DOMAIN}/api/oauth/facebook/callback`,
  instagram: `${DOMAIN}/api/oauth/instagram/callback`,
};

console.log('\n📋 COPY THESE EXACT REDIRECT URIS:\n');

Object.entries(redirectURIs).forEach(([platform, uri]) => {
  console.log(`${platform.toUpperCase()}: ${uri}`);
});

console.log('\n🎯 IMMEDIATE ACTIONS NEEDED:\n');

console.log('1. UPDATE CLOUD BUILD TRIGGER:');
console.log('   Go to: Google Cloud Console → Cloud Build → Triggers');
console.log('   Edit your trigger → Substitution variables');
console.log('   Add: _NEXT_PUBLIC_BASE_URL=https://fir-veilnet.web.app');

console.log('\n2. UPDATE TWITTER/X APP:');
console.log('   Go to: https://developer.twitter.com/en/portal/dashboard');
console.log('   Your app → Settings → Authentication settings');
console.log('   ✅ Enable OAuth 2.0 (disable OAuth 1.0a)');
console.log('   ✅ Callback URI: https://fir-veilnet.web.app/api/oauth/twitter/callback');
console.log('   ✅ Website URL: https://fir-veilnet.web.app');
console.log('   ✅ Permissions: Read and write');

console.log('\n3. UPDATE LINKEDIN APP:');
console.log('   Go to: https://www.linkedin.com/developers/apps');
console.log('   Your app → Auth tab');
console.log('   ✅ Redirect URL: https://fir-veilnet.web.app/api/oauth/linkedin/callback');
console.log('   ✅ Products: Sign In with LinkedIn + Share on LinkedIn');

console.log('\n4. UPDATE FACEBOOK/INSTAGRAM APP:');
console.log('   Go to: https://developers.facebook.com/apps');
console.log('   Your app → Facebook Login → Settings');
console.log('   ✅ Valid OAuth Redirect URIs:');
console.log('      - https://fir-veilnet.web.app/api/oauth/facebook/callback');
console.log('      - https://fir-veilnet.web.app/api/oauth/instagram/callback');
console.log('   ✅ Switch app to "Live" mode');

console.log('\n5. DEPLOY & TEST:');
console.log('   git add . && git commit -m "Update OAuth config" && git push');
console.log('   npm run test:social');

console.log('\n🚨 CRITICAL CHECKLIST:');
const checklist = [
  'Cloud Build trigger has _NEXT_PUBLIC_BASE_URL=https://fir-veilnet.web.app',
  'Twitter app uses OAuth 2.0 (not 1.0a)',
  'All redirect URIs match exactly (no trailing slashes)',
  'All apps are in production/live mode (not development)',
  'All required OAuth credentials are in Cloud Build substitution variables',
  'App has been redeployed after environment variable changes'
];

checklist.forEach((item, index) => {
  console.log(`   ${index + 1}. [ ] ${item}`);
});

console.log('\n⚡ QUICK TEST URLS:');
console.log('After setup, test these URLs manually:');
console.log(`• OAuth test: ${DOMAIN}/dashboard/settings?tab=social`);
console.log(`• Twitter OAuth: Will redirect to Twitter, then back to ${redirectURIs.twitter}`);
console.log(`• LinkedIn OAuth: Will redirect to LinkedIn, then back to ${redirectURIs.linkedin}`);

console.log('\n🔧 DEBUGGING COMMANDS:');
console.log('• npm run debug:social-stripe - Full diagnostic');
console.log('• npm run test:social - Test OAuth URL generation');
console.log('• Check logs: gcloud logs read --service=highlaunchpad');

console.log('\n✅ SUCCESS INDICATORS:');
console.log('• OAuth URLs generate without errors');
console.log('• Clicking "Connect" buttons redirects to platform auth pages');
console.log('• After platform auth, redirects back to your app successfully');
console.log('• Social accounts appear in dashboard settings');

export {};