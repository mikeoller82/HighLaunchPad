#!/usr/bin/env tsx

/**
 * Automated fix script for common social media and Stripe integration issues
 * Run with: npx tsx scripts/fix-common-issues.ts
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

class IntegrationFixer {
  private fixes: string[] = [];

  private addFix(description: string) {
    this.fixes.push(description);
    console.log(`✅ ${description}`);
  }

  async fixEnvironmentVariables() {
    console.log('🔧 Checking and fixing environment variable issues...\n');

    // Check if .env.local exists and create template if not
    const envLocalPath = join(process.cwd(), '.env.local');
    
    if (!existsSync(envLocalPath)) {
      const envTemplate = `# Social Media OAuth Configuration
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
INSTAGRAM_CLIENT_ID=your_facebook_app_id
INSTAGRAM_CLIENT_SECRET=your_facebook_app_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Base URL - CRITICAL: Must match your deployed domain
NEXT_PUBLIC_BASE_URL=https://your-deployed-domain.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_BILLING_PORTAL_URL=https://billing.stripe.com/p/login/...

# Firebase Configuration (if not using environment)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Optional: Cron job secret for scheduled posts
CRON_SECRET_KEY=your_secure_random_key
`;
      
      writeFileSync(envLocalPath, envTemplate);
      this.addFix('Created .env.local template - please fill in your actual values');
    }

    // Check for common environment variable issues
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl) {
      if (baseUrl.endsWith('/')) {
        console.log('⚠️  NEXT_PUBLIC_BASE_URL should not end with a slash');
      }
      if (!baseUrl.startsWith('https://')) {
        console.log('❌ NEXT_PUBLIC_BASE_URL must start with https:// for OAuth to work');
      }
    }
  }

  async fixCloudBuildConfiguration() {
    console.log('🔧 Checking Cloud Build configuration...\n');

    const cloudBuildPath = join(process.cwd(), 'cloudbuild.yaml');
    
    if (existsSync(cloudBuildPath)) {
      let cloudBuildContent = readFileSync(cloudBuildPath, 'utf8');
      
      // Check if all required environment variables are in the deploy step
      const requiredVars = [
        'FACEBOOK_CLIENT_ID',
        'FACEBOOK_CLIENT_SECRET',
        'LINKEDIN_CLIENT_ID', 
        'LINKEDIN_CLIENT_SECRET',
        'TWITTER_CLIENT_ID',
        'TWITTER_CLIENT_SECRET',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET'
      ];

      const missingVars = requiredVars.filter(varName => 
        !cloudBuildContent.includes(`${varName}=$_${varName}`)
      );

      if (missingVars.length > 0) {
        console.log(`⚠️  Missing environment variables in cloudbuild.yaml: ${missingVars.join(', ')}`);
        console.log('   Add these to your Cloud Build trigger substitution variables');
      } else {
        this.addFix('All required environment variables found in cloudbuild.yaml');
      }
    }
  }

  async fixFirestoreRules() {
    console.log('🔧 Checking Firestore rules...\n');

    const rulesPath = join(process.cwd(), 'firestore.rules');
    
    if (existsSync(rulesPath)) {
      const rulesContent = readFileSync(rulesPath, 'utf8');
      
      // Check for social accounts collection rules
      if (!rulesContent.includes('social_accounts')) {
        console.log('⚠️  Firestore rules may not allow social_accounts collection access');
        console.log('   Ensure your firestore.rules includes rules for social_accounts collection');
      }

      // Check for customers collection rules (for Stripe)
      if (!rulesContent.includes('customers')) {
        console.log('⚠️  Firestore rules may not allow customers collection access');
        console.log('   Ensure your firestore.rules includes rules for customers collection');
      }
    }
  }

  async fixOAuthRedirectURIs() {
    console.log('🔧 Generating OAuth redirect URIs...\n');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-deployed-domain.com';
    
    const redirectURIs = {
      facebook: `${baseUrl}/api/oauth/facebook/callback`,
      instagram: `${baseUrl}/api/oauth/instagram/callback`,
      linkedin: `${baseUrl}/api/oauth/linkedin/callback`,
      twitter: `${baseUrl}/api/oauth/twitter/callback`,
    };

    console.log('📋 Add these EXACT redirect URIs to your OAuth apps:\n');
    
    Object.entries(redirectURIs).forEach(([platform, uri]) => {
      console.log(`${platform.toUpperCase()}: ${uri}`);
    });

    console.log('\n🔗 Platform-specific configuration:');
    console.log('Twitter: https://developer.twitter.com/en/portal/dashboard');
    console.log('LinkedIn: https://www.linkedin.com/developers/apps');
    console.log('Facebook: https://developers.facebook.com/apps');

    this.addFix('Generated OAuth redirect URIs for platform configuration');
  }

  async fixStripeWebhook() {
    console.log('🔧 Checking Stripe webhook configuration...\n');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-deployed-domain.com';
    const webhookUrl = `${baseUrl}/api/stripe/webhook`;

    console.log(`📋 Configure this webhook endpoint in Stripe Dashboard:`);
    console.log(`URL: ${webhookUrl}`);
    console.log(`Events to listen for:`);
    console.log(`  • checkout.session.completed`);
    console.log(`  • customer.subscription.updated`);
    console.log(`  • customer.subscription.deleted`);
    console.log(`  • invoice.payment_succeeded`);

    this.addFix('Generated Stripe webhook configuration details');
  }

  async createTestScript() {
    console.log('🔧 Creating test script for social connections...\n');

    const testScript = `#!/usr/bin/env tsx

/**
 * Test script for social media connections
 * Run with: npm run test:social
 */

import { createSocialMediaManager } from '../src/lib/social-media-manager';

async function testSocialConnections() {
  console.log('🧪 Testing Social Media Connections..\\n');

  try {
    const manager = createSocialMediaManager();
    const platforms = manager.getSupportedPlatforms();
    
    console.log(\`✅ Supported platforms: \${platforms.join(', ')}\`);

    // Test OAuth URL generation
    for (const platform of platforms) {
      try {
        const authUrl = manager.getAuthUrl(platform, 'test-state-123');
        console.log(\`✅ \${platform}: OAuth URL generated successfully\`);
        console.log(\`   URL: \${authUrl.substring(0, 100)}...\`);
      } catch (error) {
        console.log(\`❌ \${platform}: Failed to generate OAuth URL - \${error}\`);
      }
    }

    console.log('\\n🔍 Manual Testing Steps:');
    console.log('1. Copy any OAuth URL above and test in browser');
    console.log('2. Check that redirect URI matches your platform configuration');
    console.log('3. Verify you get redirected to the correct callback URL');
    console.log('4. Check browser network tab for any errors');

  } catch (error) {
    console.error('❌ Failed to create social media manager:', error);
  }
}

testSocialConnections().catch(console.error);
`;

    writeFileSync(join(process.cwd(), 'scripts', 'test-social-connections.ts'), testScript);
    this.addFix('Created test script for social connections');
  }

  async generateReport() {
    console.log('\n📊 FIX SUMMARY\n');
    console.log('='.repeat(50));

    if (this.fixes.length > 0) {
      console.log('✅ Applied fixes:');
      this.fixes.forEach(fix => console.log(`   • ${fix}`));
    }

    console.log('\n🔧 NEXT STEPS:\n');
    console.log('1. Fill in actual values in .env.local (if created)');
    console.log('2. Update your Cloud Build trigger with substitution variables');
    console.log('3. Configure OAuth redirect URIs in platform developer consoles');
    console.log('4. Set up Stripe webhook endpoint');
    console.log('5. Run debug script: npm run debug:social-stripe');
    console.log('6. Test connections: npm run test:social');

    console.log('\n🚨 CRITICAL REMINDERS:\n');
    console.log('• NEXT_PUBLIC_BASE_URL must match your deployed domain exactly');
    console.log('• OAuth apps must be in production mode (not development)');
    console.log('• Redirect URIs must be HTTPS and match exactly');
    console.log('• All environment variables must be set in Cloud Build triggers');
  }

  async runAllFixes() {
    console.log('🚀 Starting automated fixes...\n');
    
    await this.fixEnvironmentVariables();
    await this.fixCloudBuildConfiguration();
    await this.fixFirestoreRules();
    await this.fixOAuthRedirectURIs();
    await this.fixStripeWebhook();
    await this.createTestScript();
    
    await this.generateReport();
  }
}

// Run the fixer
const fixer = new IntegrationFixer();
fixer.runAllFixes().catch(console.error);