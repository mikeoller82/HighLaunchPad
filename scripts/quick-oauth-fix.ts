#!/usr/bin/env tsx

/**
 * Quick OAuth Redirect URI Fix
 * This script helps you identify and fix OAuth redirect URI issues
 */

console.log('🔧 QUICK OAUTH REDIRECT URI FIX');
console.log('='.repeat(50));

// Step 1: Identify your deployed domain
console.log('\n📍 STEP 1: IDENTIFY YOUR DEPLOYED DOMAIN\n');

console.log('Your deployed domain should be one of these:');
console.log('• Cloud Run: https://highlaunchpad-[hash]-uc.a.run.app');
console.log('• Custom domain: https://your-custom-domain.com');
console.log('• Firebase Hosting: https://your-project.web.app');

console.log('\nTo find your Cloud Run URL:');
console.log('gcloud run services describe highlaunchpad --region=us-central1 --format="value(status.url)"');

console.log('\n📋 STEP 2: UPDATE OAUTH REDIRECT URIS\n');

const platforms = [
  {
    name: 'Twitter/X',
    url: 'https://developer.twitter.com/en/portal/dashboard',
    steps: [
      'Go to your Twitter app → Settings → Authentication settings',
      'Enable OAuth 2.0 (disable OAuth 1.0a)',
      'Set Callback URI: https://YOUR-DOMAIN.com/api/oauth/twitter/callback',
      'Set Website URL: https://YOUR-DOMAIN.com',
      'Set permissions to "Read and write"',
      'Save settings'
    ]
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/developers/apps',
    steps: [
      'Go to your LinkedIn app → Auth tab',
      'Add redirect URL: https://YOUR-DOMAIN.com/api/oauth/linkedin/callback',
      'Ensure required products are added',
      'Save settings'
    ]
  },
  {
    name: 'Facebook/Instagram',
    url: 'https://developers.facebook.com/apps',
    steps: [
      'Go to your Facebook app → Facebook Login → Settings',
      'Add Valid OAuth Redirect URI: https://YOUR-DOMAIN.com/api/oauth/facebook/callback',
      'For Instagram, add: https://YOUR-DOMAIN.com/api/oauth/instagram/callback',
      'Switch app to "Live" mode',
      'Save settings'
    ]
  }
];

platforms.forEach((platform, index) => {
  console.log(`${index + 1}. ${platform.name.toUpperCase()}`);
  console.log(`   Portal: ${platform.url}`);
  platform.steps.forEach(step => console.log(`   • ${step}`));
  console.log('');
});

console.log('🚨 CRITICAL REMINDERS:');
console.log('• Replace YOUR-DOMAIN.com with your actual deployed domain');
console.log('• URLs must be HTTPS (not HTTP)');
console.log('• URLs must match EXACTLY (no trailing slashes)');
console.log('• Apps must be in production/live mode');

console.log('\n⚡ QUICK TEST:');
console.log('After updating redirect URIs, test with:');
console.log('npm run test:social');

console.log('\n🔍 DEBUGGING:');
console.log('If connections still fail:');
console.log('1. Check browser network tab for OAuth errors');
console.log('2. Check Cloud Run logs: gcloud logs read --service=highlaunchpad');
console.log('3. Verify environment variables: npm run debug:social-stripe');

// Generate a quick verification checklist
console.log('\n✅ VERIFICATION CHECKLIST:');
const checklist = [
  'NEXT_PUBLIC_BASE_URL set in Cloud Build trigger',
  'OAuth redirect URIs updated in all platform developer consoles',
  'Apps switched from development to production mode',
  'All required scopes approved',
  'Environment variables deployed to Cloud Run',
  'Test OAuth flow manually in browser'
];

checklist.forEach((item, index) => {
  console.log(`   ${index + 1}. [ ] ${item}`);
});

console.log('\n🎯 NEXT ACTIONS:');
console.log('1. Find your deployed domain URL');
console.log('2. Update NEXT_PUBLIC_BASE_URL in Cloud Build trigger');
console.log('3. Update OAuth redirect URIs in platform consoles');
console.log('4. Deploy and test');