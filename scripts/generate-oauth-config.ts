#!/usr/bin/env tsx

/**
 * OAuth Redirect URI Configuration Generator
 * This script generates the exact redirect URIs you need to configure in each platform
 */

interface PlatformConfig {
  name: string;
  developerPortalUrl: string;
  redirectUri: string;
  scopes: string[];
  additionalNotes: string[];
}

class OAuthConfigGenerator {
  private baseUrl: string;

  constructor() {
    // Try to get base URL from environment, fallback to placeholder
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-deployed-domain.com';
    
    if (this.baseUrl === 'https://your-deployed-domain.com') {
      console.log('⚠️  NEXT_PUBLIC_BASE_URL not set. Using placeholder.');
      console.log('   Set your actual deployed domain in environment variables.\n');
    }
  }

  generateConfigs(): PlatformConfig[] {
    return [
      {
        name: 'Twitter/X',
        developerPortalUrl: 'https://developer.twitter.com/en/portal/dashboard',
        redirectUri: `${this.baseUrl}/api/oauth/twitter/callback`,
        scopes: ['tweet.read', 'tweet.write', 'users.read', 'dm.read', 'dm.write'],
        additionalNotes: [
          'MUST use OAuth 2.0 (not OAuth 1.0a)',
          'Enable PKCE (Proof Key for Code Exchange)',
          'Set app environment to "Production" (not Development)',
          'Ensure "Read and write" permissions are enabled',
          'Add your domain to "Website URL" field'
        ]
      },
      {
        name: 'LinkedIn',
        developerPortalUrl: 'https://www.linkedin.com/developers/apps',
        redirectUri: `${this.baseUrl}/api/oauth/linkedin/callback`,
        scopes: ['profile', 'email', 'w_member_social', 'r_organization_social', 'w_organization_social'],
        additionalNotes: [
          'Some scopes require LinkedIn app review',
          'Start with basic scopes: profile, email, w_member_social',
          'Add organization scopes after basic approval',
          'Ensure "Sign In with LinkedIn using OpenID Connect" product is added',
          'Add "Share on LinkedIn" product for posting capabilities'
        ]
      },
      {
        name: 'Facebook',
        developerPortalUrl: 'https://developers.facebook.com/apps',
        redirectUri: `${this.baseUrl}/api/oauth/facebook/callback`,
        scopes: [
          'pages_read_engagement',
          'pages_read_user_content', 
          'pages_manage_posts',
          'pages_messaging',
          'pages_show_list',
          'business_management'
        ],
        additionalNotes: [
          'Add "Facebook Login" product',
          'Add "Pages API" product', 
          'For Instagram: Add "Instagram Basic Display" product',
          'For Instagram Business: Add "Instagram API" product',
          'App must be in "Live" mode for production use',
          'Some permissions require Facebook app review'
        ]
      },
      {
        name: 'Instagram',
        developerPortalUrl: 'https://developers.facebook.com/apps',
        redirectUri: `${this.baseUrl}/api/oauth/instagram/callback`,
        scopes: [
          'instagram_basic',
          'instagram_content_publish',
          'instagram_manage_comments',
          'instagram_manage_messages'
        ],
        additionalNotes: [
          'Instagram uses Facebook OAuth (same app)',
          'Requires Instagram Business account',
          'Business account must be connected to a Facebook Page',
          'Add "Instagram Basic Display" and "Instagram API" products',
          'Test with Instagram test users first'
        ]
      }
    ];
  }

  printConfiguration() {
    const configs = this.generateConfigs();
    
    console.log('🔐 OAUTH REDIRECT URI CONFIGURATION GUIDE');
    console.log('='.repeat(60));
    console.log(`\n🌐 Base URL: ${this.baseUrl}\n`);

    configs.forEach((config, index) => {
      console.log(`${index + 1}. ${config.name.toUpperCase()}`);
      console.log('─'.repeat(40));
      console.log(`🔗 Developer Portal: ${config.developerPortalUrl}`);
      console.log(`📍 Redirect URI: ${config.redirectUri}`);
      console.log(`🔑 Required Scopes: ${config.scopes.join(', ')}`);
      
      if (config.additionalNotes.length > 0) {
        console.log(`📝 Important Notes:`);
        config.additionalNotes.forEach(note => {
          console.log(`   • ${note}`);
        });
      }
      console.log('');
    });

    this.printStepByStepInstructions();
    this.printTroubleshootingTips();
  }

  printStepByStepInstructions() {
    console.log('📋 STEP-BY-STEP CONFIGURATION INSTRUCTIONS');
    console.log('='.repeat(60));
    
    console.log('\n🐦 TWITTER/X SETUP:');
    console.log('1. Go to https://developer.twitter.com/en/portal/dashboard');
    console.log('2. Select your app → App settings → Authentication settings');
    console.log('3. Enable "OAuth 2.0" (disable OAuth 1.0a if enabled)');
    console.log('4. Set Type of App: "Web App"');
    console.log('5. Add Callback URI:', `${this.baseUrl}/api/oauth/twitter/callback`);
    console.log('6. Add Website URL:', this.baseUrl);
    console.log('7. Enable "Request email from users"');
    console.log('8. Set App permissions to "Read and write"');
    console.log('9. Save settings');

    console.log('\n💼 LINKEDIN SETUP:');
    console.log('1. Go to https://www.linkedin.com/developers/apps');
    console.log('2. Select your app → Auth tab');
    console.log('3. Add Authorized redirect URLs:', `${this.baseUrl}/api/oauth/linkedin/callback`);
    console.log('4. In Products tab, add:');
    console.log('   • Sign In with LinkedIn using OpenID Connect');
    console.log('   • Share on LinkedIn');
    console.log('5. Request access to required scopes');
    console.log('6. Submit for review if needed');

    console.log('\n📘 FACEBOOK/INSTAGRAM SETUP:');
    console.log('1. Go to https://developers.facebook.com/apps');
    console.log('2. Select your app → Add Product → Facebook Login');
    console.log('3. Facebook Login → Settings → Valid OAuth Redirect URIs:');
    console.log('   Add:', `${this.baseUrl}/api/oauth/facebook/callback`);
    console.log('4. For Instagram: Add Instagram Basic Display product');
    console.log('5. Add Instagram API product for business features');
    console.log('6. Configure Instagram redirect URI:', `${this.baseUrl}/api/oauth/instagram/callback`);
    console.log('7. Switch app to "Live" mode when ready for production');
  }

  printTroubleshootingTips() {
    console.log('\n🔧 TROUBLESHOOTING TIPS');
    console.log('='.repeat(60));
    
    console.log('\n❌ Common Issues:');
    console.log('• Redirect URI mismatch → Must match EXACTLY (including https://)');
    console.log('• App in development mode → Switch to production/live mode');
    console.log('• Missing scopes → Ensure all required scopes are approved');
    console.log('• Wrong OAuth version → Twitter must use OAuth 2.0');
    console.log('• CORS errors → Check domain configuration in app settings');

    console.log('\n✅ Verification Steps:');
    console.log('1. Test OAuth URLs manually in browser');
    console.log('2. Check browser network tab for errors');
    console.log('3. Verify redirect happens to correct callback URL');
    console.log('4. Check Cloud Run logs for detailed error messages');
    console.log('5. Ensure NEXT_PUBLIC_BASE_URL matches deployed domain exactly');

    console.log('\n🧪 Testing Commands:');
    console.log('• Test social connections: npm run test:social');
    console.log('• Debug full integration: npm run debug:social-stripe');
    console.log('• Check environment: echo $NEXT_PUBLIC_BASE_URL');
  }

  generateEnvTemplate() {
    console.log('\n📄 ENVIRONMENT VARIABLES TEMPLATE');
    console.log('='.repeat(60));
    console.log('Add these to your Cloud Build trigger substitution variables:\n');

    const envVars = [
      { key: '_NEXT_PUBLIC_BASE_URL', value: this.baseUrl, description: 'Your deployed domain' },
      { key: '_FACEBOOK_CLIENT_ID', value: 'your_facebook_app_id', description: 'From Facebook Developer Console' },
      { key: '_FACEBOOK_CLIENT_SECRET', value: 'your_facebook_app_secret', description: 'From Facebook Developer Console' },
      { key: '_LINKEDIN_CLIENT_ID', value: 'your_linkedin_client_id', description: 'From LinkedIn Developer Portal' },
      { key: '_LINKEDIN_CLIENT_SECRET', value: 'your_linkedin_client_secret', description: 'From LinkedIn Developer Portal' },
      { key: '_TWITTER_CLIENT_ID', value: 'your_twitter_client_id', description: 'From Twitter Developer Portal' },
      { key: '_TWITTER_CLIENT_SECRET', value: 'your_twitter_client_secret', description: 'From Twitter Developer Portal' },
    ];

    envVars.forEach(env => {
      console.log(`${env.key}=${env.value}`);
      console.log(`  # ${env.description}`);
    });
  }
}

// Run the generator
const generator = new OAuthConfigGenerator();
generator.printConfiguration();
generator.generateEnvTemplate();