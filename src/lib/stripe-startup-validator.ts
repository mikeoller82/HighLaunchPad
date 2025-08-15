// Stripe startup validator - ensures Stripe is properly configured on app startup
import { stripeServerConfig } from './stripe-server-config';

export class StripeStartupValidator {
  private static instance: StripeStartupValidator;
  private isValidated = false;
  private validationError: string | null = null;

  private constructor() {}

  public static getInstance(): StripeStartupValidator {
    if (!StripeStartupValidator.instance) {
      StripeStartupValidator.instance = new StripeStartupValidator();
    }
    return StripeStartupValidator.instance;
  }

  public async validateOnStartup(): Promise<{
    success: boolean;
    error?: string;
    details?: any;
  }> {
    if (this.isValidated) {
      return { 
        success: this.validationError === null,
        error: this.validationError || undefined
      };
    }

    console.log('🔍 Validating Stripe configuration on startup...');

    try {
      // Step 1: Check environment variables
      const envCheck = this.checkEnvironmentVariables();
      if (!envCheck.success) {
        this.validationError = envCheck.error!;
        return envCheck;
      }

      // Step 2: Initialize Stripe configuration
      const configCheck = await this.initializeStripeConfig();
      if (!configCheck.success) {
        this.validationError = configCheck.error!;
        return configCheck;
      }

      // Step 3: Test Stripe API connection
      const connectionCheck = await this.testStripeConnection();
      if (!connectionCheck.success) {
        this.validationError = connectionCheck.error!;
        return connectionCheck;
      }

      this.isValidated = true;
      console.log('✅ Stripe configuration validated successfully');
      
      return {
        success: true,
        details: {
          environment: process.env.NODE_ENV,
          keyType: connectionCheck.details?.keyType,
          accountId: connectionCheck.details?.accountId
        }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
      this.validationError = errorMessage;
      console.error('❌ Stripe startup validation failed:', error);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private checkEnvironmentVariables(): { success: boolean; error?: string } {
    const requiredVars = [
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'NEXT_PUBLIC_STRIPE_PRO_PRICE_ID',
      'NEXT_PUBLIC_BASE_URL'
    ];

    const missingVars: string[] = [];
    const invalidVars: string[] = [];

    for (const varName of requiredVars) {
      const value = process.env[varName];
      
      if (!value) {
        missingVars.push(varName);
        continue;
      }

      // Validate formats
      if (varName === 'STRIPE_SECRET_KEY' && !value.startsWith('sk_')) {
        invalidVars.push(`${varName} (must start with sk_)`);
      }
      
      if (varName === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' && !value.startsWith('pk_')) {
        invalidVars.push(`${varName} (must start with pk_)`);
      }
      
      if (varName === 'STRIPE_WEBHOOK_SECRET' && !value.startsWith('whsec_')) {
        invalidVars.push(`${varName} (must start with whsec_)`);
      }
    }

    if (missingVars.length > 0) {
      return {
        success: false,
        error: `Missing required environment variables: ${missingVars.join(', ')}`
      };
    }

    if (invalidVars.length > 0) {
      return {
        success: false,
        error: `Invalid environment variable formats: ${invalidVars.join(', ')}`
      };
    }

    // Check key consistency
    const secretKey = process.env.STRIPE_SECRET_KEY!;
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
    
    const secretIsLive = secretKey.startsWith('sk_live_');
    const publishableIsLive = publishableKey.startsWith('pk_live_');

    if (secretIsLive !== publishableIsLive) {
      return {
        success: false,
        error: 'Stripe key mismatch: secret and publishable keys must both be live or both be test keys'
      };
    }

    return { success: true };
  }

  private async initializeStripeConfig(): Promise<{ success: boolean; error?: string }> {
    try {
      stripeServerConfig.initialize();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initialize Stripe configuration'
      };
    }
  }

  private async testStripeConnection(): Promise<{ 
    success: boolean; 
    error?: string; 
    details?: any 
  }> {
    try {
      const connectionTest = await stripeServerConfig.testConnection();
      
      if (!connectionTest.success) {
        return {
          success: false,
          error: `Stripe API connection failed: ${connectionTest.error}`
        };
      }

      const config = stripeServerConfig.getConfig();
      const keyType = config.secretKey.startsWith('sk_live_') ? 'LIVE' : 'TEST';

      return {
        success: true,
        details: {
          keyType,
          accountId: connectionTest.account?.id,
          country: connectionTest.account?.country,
          chargesEnabled: connectionTest.account?.chargesEnabled,
          payoutsEnabled: connectionTest.account?.payoutsEnabled
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Stripe connection test failed'
      };
    }
  }

  public isStripeReady(): boolean {
    return this.isValidated && this.validationError === null;
  }

  public getValidationError(): string | null {
    return this.validationError;
  }

  public reset(): void {
    this.isValidated = false;
    this.validationError = null;
    stripeServerConfig.reset();
  }
}

// Export singleton instance
export const stripeStartupValidator = StripeStartupValidator.getInstance();

// Helper function for easy validation
export async function validateStripeOnStartup(): Promise<boolean> {
  const result = await stripeStartupValidator.validateOnStartup();
  return result.success;
}