#!/usr/bin/env tsx

/**
 * Debug script for social media and Stripe integration issues
 * Run with: npx tsx scripts/debug-social-stripe.ts
 */

import { createSocialMediaManager } from '../src/lib/social-media-manager';

interface DebugResult {
  component: string;
  status: 'OK' | 'ERROR' | 'WARNING';
  message: string;
  details?: any;
}

class IntegrationDebugger {
  private results: DebugResult[] = [];

  private addResult(component: string, status: 'OK' | 'ERROR' | 'WARNING', message: string, details?: any) {
    this.results.push({ component, status, message, details });
  }

  private checkEnvVar(name: string, required: boolean = true): boolean {
    const value = process.env[name];
    if (!value) {
      this.addResult('Environment', required ? 'ERROR' : 'WARNING', 
        `${name} is ${required ? 'missing (required)' : 'not set (optional)'}`);
      return false;
    }
    this.addResult('Environment', 'OK', `${name} is configured`);
    return true;
  }

  async checkEnvironmentVariables() {
    console.log('🔍 Checking Environment Variables...\n');

    // Social Media Variables
    const facebookClientId = this.checkEnvVar('FACEBOOK_CLIENT_ID');
    const facebookClientSecret = this.checkEnvVar('FACEBOOK_CLIENT_SECRET');
    const linkedinClientId = this.checkEnvVar('LINKEDIN_CLIENT_ID');
    const linkedinClientSecret = this.checkEnvVar('LINKEDIN_CLIENT_SECRET');
    const twitterClientId = this.checkEnvVar('TWITTER_CLIENT_ID');
    const twitterClientSecret = this.checkEnvVar('TWITTER_CLIENT_SECRET');
    const baseUrl = this.checkEnvVar('NEXT_PUBLIC_BASE_URL');

    // Stripe Variables
    const stripeSecretKey = this.checkEnvVar('STRIPE_SECRET_KEY');
    const stripeWebhookSecret = this.checkEnvVar('STRIPE_WEBHOOK_SECRET');
    const stripePublishableKey = this.checkEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');

    // Check if base URL is properly formatted
    if (baseUrl && process.env.NEXT_PUBLIC_BASE_URL) {
      const url = process.env.NEXT_PUBLIC_BASE_URL;
      if (!url.startsWith('https://')) {
        this.addResult('Environment', 'ERROR', 
          'NEXT_PUBLIC_BASE_URL must start with https:// for OAuth to work');
      } else if (url.endsWith('/')) {
        this.addResult('Environment', 'WARNING', 
          'NEXT_PUBLIC_BASE_URL should not end with a slash');
      }
    }
  }

  async checkSocialMediaManager() {
    console.log('🔍 Checking Social Media Manager...\n');

    try {
      const manager = createSocialMediaManager();
      const platforms = manager.getSupportedPlatforms();
      
      this.addResult('Social Manager', 'OK', 
        `Social Media Manager created successfully with platforms: ${platforms.join(', ')}`);

      // Test OAuth URL generation
      for (const platform of platforms) {
        try {
          const authUrl = manager.getAuthUrl(platform, 'test-state');
          this.addResult('OAuth URLs', 'OK', 
            `${platform} OAuth URL generated successfully`);
          
          // Validate redirect URI in the URL
          const url = new URL(authUrl);
          const redirectUri = url.searchParams.get('redirect_uri');
          if (redirectUri && !redirectUri.startsWith('https://')) {
            this.addResult('OAuth URLs', 'ERROR', 
              `${platform} redirect URI is not HTTPS: ${redirectUri}`);
          }
        } catch (error) {
          this.addResult('OAuth URLs', 'ERROR', 
            `Failed to generate ${platform} OAuth URL: ${error}`);
        }
      }
    } catch (error) {
      this.addResult('Social Manager', 'ERROR', 
        `Failed to create Social Media Manager: ${error}`);
    }
  }

  async checkStripeConfiguration() {
    console.log('🔍 Checking Stripe Configuration...\n');

    if (!process.env.STRIPE_SECRET_KEY) {
      this.addResult('Stripe', 'ERROR', 'STRIPE_SECRET_KEY is missing');
      return;
    }

    try {
      // Dynamic import to avoid issues if Stripe isn't available
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20',
      });

      // Test Stripe connection
      const account = await stripe.accounts.retrieve();
      this.addResult('Stripe', 'OK', 
        `Stripe connection successful. Account: ${(account as any).display_name || account.id}`);

      // Check webhook endpoints
      const webhooks = await stripe.webhookEndpoints.list();
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const expectedWebhookUrl = `${baseUrl}/api/stripe/webhook`;
      
      const matchingWebhook = webhooks.data.find(wh => 
        wh.url === expectedWebhookUrl
      );

      if (matchingWebhook) {
        this.addResult('Stripe Webhooks', 'OK', 
          `Webhook endpoint configured: ${expectedWebhookUrl}`);
        
        // Check required events
        const requiredEvents = [
          'checkout.session.completed',
          'customer.subscription.updated',
          'customer.subscription.deleted',
          'invoice.payment_succeeded'
        ];
        
        const missingEvents = requiredEvents.filter(event => 
          !matchingWebhook.enabled_events.includes(event as any)
        );
        
        if (missingEvents.length > 0) {
          this.addResult('Stripe Webhooks', 'WARNING', 
            `Missing webhook events: ${missingEvents.join(', ')}`);
        }
      } else {
        this.addResult('Stripe Webhooks', 'ERROR', 
          `No webhook endpoint found for ${expectedWebhookUrl}`);
      }

    } catch (error) {
      this.addResult('Stripe', 'ERROR', 
        `Stripe connection failed: ${error}`);
    }
  }

  async checkFirebaseConfiguration() {
    console.log('🔍 Checking Firebase Configuration...\n');

    try {
      // Check if Firebase Admin is properly configured
      const { getAdminApp } = await import('../src/lib/firebase-admin');
      const adminApp = getAdminApp();
      
      this.addResult('Firebase', 'OK', 'Firebase Admin SDK initialized successfully');

      // Check Firestore rules (basic check)
      const { getFirestore } = await import('firebase-admin/firestore');
      const db = getFirestore(adminApp);
      
      // Test basic Firestore access
      await db.collection('test').limit(1).get();
      this.addResult('Firestore', 'OK', 'Firestore access successful');

    } catch (error) {
      this.addResult('Firebase', 'ERROR', 
        `Firebase configuration error: ${error}`);
    }
  }

  generateReport() {
    console.log('\n📊 INTEGRATION DEBUG REPORT\n');
    console.log('='.repeat(50));

    const errorCount = this.results.filter(r => r.status === 'ERROR').length;
    const warningCount = this.results.filter(r => r.status === 'WARNING').length;
    const okCount = this.results.filter(r => r.status === 'OK').length;

    console.log(`✅ OK: ${okCount} | ⚠️  WARNING: ${warningCount} | ❌ ERROR: ${errorCount}\n`);

    // Group by component
    const byComponent = this.results.reduce((acc, result) => {
      if (!acc[result.component]) acc[result.component] = [];
      acc[result.component].push(result);
      return acc;
    }, {} as Record<string, DebugResult[]>);

    for (const [component, results] of Object.entries(byComponent)) {
      console.log(`\n📁 ${component}:`);
      for (const result of results) {
        const icon = result.status === 'OK' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌';
        console.log(`  ${icon} ${result.message}`);
        if (result.details) {
          console.log(`     Details: ${JSON.stringify(result.details, null, 2)}`);
        }
      }
    }

    // Provide specific recommendations
    console.log('\n🔧 RECOMMENDATIONS:\n');

    if (errorCount > 0) {
      console.log('❌ CRITICAL ISSUES FOUND:');
      const errors = this.results.filter(r => r.status === 'ERROR');
      errors.forEach(error => {
        console.log(`   • ${error.message}`);
      });
      console.log('\n   These must be fixed before social media and Stripe will work properly.\n');
    }

    if (warningCount > 0) {
      console.log('⚠️  WARNINGS:');
      const warnings = this.results.filter(r => r.status === 'WARNING');
      warnings.forEach(warning => {
        console.log(`   • ${warning.message}`);
      });
      console.log('\n   These should be addressed for optimal functionality.\n');
    }

    if (errorCount === 0 && warningCount === 0) {
      console.log('🎉 All checks passed! Your integration should be working properly.');
    }

    // OAuth-specific troubleshooting
    const hasOAuthErrors = this.results.some(r => 
      r.component.includes('OAuth') && r.status === 'ERROR'
    );

    if (hasOAuthErrors) {
      console.log('\n🔐 OAUTH TROUBLESHOOTING STEPS:');
      console.log('1. Verify redirect URIs in platform developer consoles match exactly');
      console.log('2. Ensure apps are in production mode (not development)');
      console.log('3. Check that all required scopes are approved');
      console.log('4. Test OAuth URLs manually in browser');
    }

    // Stripe-specific troubleshooting
    const hasStripeErrors = this.results.some(r => 
      r.component.includes('Stripe') && r.status === 'ERROR'
    );

    if (hasStripeErrors) {
      console.log('\n💳 STRIPE TROUBLESHOOTING STEPS:');
      console.log('1. Verify Stripe keys are from the correct environment (test/live)');
      console.log('2. Check webhook endpoint is accessible from Stripe');
      console.log('3. Ensure webhook secret matches Stripe dashboard');
      console.log('4. Test webhook endpoint manually');
    }
  }

  async runAllChecks() {
    console.log('🚀 Starting Integration Debug...\n');
    
    await this.checkEnvironmentVariables();
    await this.checkFirebaseConfiguration();
    await this.checkSocialMediaManager();
    await this.checkStripeConfiguration();
    
    this.generateReport();
  }
}

// Run the debugger
const integrationDebugger = new IntegrationDebugger();
integrationDebugger.runAllChecks().catch(console.error);