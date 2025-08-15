// Server-side Stripe configuration validator and initializer
import Stripe from 'stripe';

interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  priceId: string;
  baseUrl: string;
}

class StripeServerConfig {
  private static instance: StripeServerConfig;
  private stripe: Stripe | null = null;
  private config: StripeConfig | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): StripeServerConfig {
    if (!StripeServerConfig.instance) {
      StripeServerConfig.instance = new StripeServerConfig();
    }
    return StripeServerConfig.instance;
  }

  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Only initialize on server-side
    if (typeof window !== 'undefined') {
      console.log('⚠️ Stripe server config should not be initialized on client-side');
      return;
    }

    console.log('🔧 Initializing Stripe server configuration...');

    // Load and validate environment variables
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Validate required environment variables
    const missingVars: string[] = [];
    
    if (!secretKey) missingVars.push('STRIPE_SECRET_KEY');
    if (!publishableKey) missingVars.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
    if (!webhookSecret) missingVars.push('STRIPE_WEBHOOK_SECRET');
    if (!priceId) missingVars.push('NEXT_PUBLIC_STRIPE_PRO_PRICE_ID');
    if (!baseUrl) missingVars.push('NEXT_PUBLIC_BASE_URL');

    if (missingVars.length > 0) {
      const errorMsg = `Missing required Stripe environment variables: ${missingVars.join(', ')}`;
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    // Validate key formats
    if (!secretKey!.startsWith('sk_')) {
      throw new Error('Invalid STRIPE_SECRET_KEY format - must start with sk_');
    }

    if (!publishableKey!.startsWith('pk_')) {
      throw new Error('Invalid NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY format - must start with pk_');
    }

    if (!webhookSecret!.startsWith('whsec_')) {
      throw new Error('Invalid STRIPE_WEBHOOK_SECRET format - must start with whsec_');
    }

    // Check key consistency (both should be live or both should be test)
    const secretIsLive = secretKey!.startsWith('sk_live_');
    const publishableIsLive = publishableKey!.startsWith('pk_live_');

    if (secretIsLive !== publishableIsLive) {
      throw new Error('Stripe key mismatch: secret and publishable keys must both be live or both be test keys');
    }

    // Store configuration
    this.config = {
      secretKey: secretKey!,
      publishableKey: publishableKey!,
      webhookSecret: webhookSecret!,
      priceId: priceId!,
      baseUrl: baseUrl!
    };

    // Initialize Stripe instance
    this.stripe = new Stripe(this.config.secretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });

    this.isInitialized = true;

    const keyType = secretIsLive ? 'LIVE' : 'TEST';
    console.log(`✅ Stripe server configuration initialized with ${keyType} keys`);
  }

  public getStripe(): Stripe {
    if (typeof window !== 'undefined') {
      throw new Error('Stripe server instance should not be accessed on client-side');
    }
    
    if (!this.isInitialized || !this.stripe) {
      this.initialize();
    }
    return this.stripe!;
  }

  public getConfig(): StripeConfig {
    if (typeof window !== 'undefined') {
      throw new Error('Stripe server config should not be accessed on client-side');
    }
    
    if (!this.isInitialized || !this.config) {
      this.initialize();
    }
    return this.config!;
  }

  public isConfigured(): boolean {
    if (typeof window !== 'undefined') {
      console.log('⚠️ Stripe server config check called on client-side');
      return false;
    }
    
    try {
      this.initialize();
      return true;
    } catch (error) {
      console.error('Stripe configuration check failed:', error);
      return false;
    }
  }

  public async testConnection(): Promise<{
    success: boolean;
    account?: any;
    error?: string;
  }> {
    try {
      const stripe = this.getStripe();
      const account = await stripe.accounts.retrieve();
      
      return {
        success: true,
        account: {
          id: account.id,
          country: account.country,
          email: account.email,
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public reset(): void {
    this.stripe = null;
    this.config = null;
    this.isInitialized = false;
  }
}

// Export singleton instance
export const stripeServerConfig = StripeServerConfig.getInstance();

// Helper function to get configured Stripe instance
export function getStripeInstance(): Stripe {
  return stripeServerConfig.getStripe();
}

// Helper function to check if Stripe is properly configured
export function isStripeConfigured(): boolean {
  return stripeServerConfig.isConfigured();
}

// Helper function to get Stripe configuration
export function getStripeConfig(): StripeConfig {
  return stripeServerConfig.getConfig();
}