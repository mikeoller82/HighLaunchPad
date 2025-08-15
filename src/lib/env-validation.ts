import { z } from 'zod';
import { logger } from '@/lib/logger';

// Define a comprehensive schema for all environment variables
const envSchema = z.object({
  // Node.js Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Application Configuration
  APP_VERSION: z.string().optional(),
  PORT: z.string().transform(Number).default('3000'),
  
  // Next.js Configuration
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
  
  // Firebase Admin Configuration
  FIREBASE_SERVICE_ACCOUNT: z.string().optional(),
  FIREBASE_ADMIN_PROJECT_ID: z.string().optional(),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().optional(),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
  
  // Stripe Configuration
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // AI/ML Configuration
  GOOGLE_APPLICATION_CREDENTIALS_JSON: z.string().optional(),
  
  // OAuth Configuration
  TWITTER_CLIENT_ID: z.string().optional(),
  TWITTER_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  INSTAGRAM_CLIENT_ID: z.string().optional(),
  INSTAGRAM_CLIENT_SECRET: z.string().optional(),
  
  // Webhook Configuration
  WEBHOOK_VERIFY_TOKEN: z.string().optional(),
  
  // Email Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // JWT/Security Configuration
  JWT_SECRET: z.string().optional(),
  SESSION_SECRET: z.string().optional(),
  
  // Database Configuration (if using non-Firebase databases)
  DATABASE_URL: z.string().optional(),
  
  // Monitoring & Observability
  SENTRY_DSN: z.string().optional(),
  JAEGER_ENDPOINT: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

type EnvVars = z.infer<typeof envSchema>;

// Validate required vs optional based on environment
function validateEnvironmentSpecificRequirements(env: EnvVars): string[] {
  const errors: string[] = [];
  
  if (env.NODE_ENV === 'production') {
    // Production-specific validations
    
    // Firebase Admin configuration - warn but don't fail build
    if (!env.FIREBASE_SERVICE_ACCOUNT && 
        !(env.FIREBASE_ADMIN_PROJECT_ID && env.FIREBASE_ADMIN_CLIENT_EMAIL && env.FIREBASE_ADMIN_PRIVATE_KEY) &&
        !env.GOOGLE_APPLICATION_CREDENTIALS) {
      logger.warn('Production environment: Firebase Admin configuration not found. Some features may not work properly.');
    }
    
    // Stripe configuration - warn but don't fail build
    if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
      logger.warn('Production environment: Stripe configuration incomplete. Payment features may not work properly.');
    }
    
    // Security configuration - warn but don't fail build
    if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
      logger.warn('Production environment: JWT_SECRET not configured or too short. OAuth state manager will use fallback.');
    }
    
    if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
      logger.warn('Production environment: SESSION_SECRET not configured or too short.');
    }
    
    // Monitoring
    if (!env.SENTRY_DSN) {
      logger.warn('Production environment without Sentry monitoring configured');
    }
  }
  
  if (env.NODE_ENV === 'development') {
    // Development-specific warnings
    if (!env.GOOGLE_APPLICATION_CREDENTIALS && !env.FIREBASE_SERVICE_ACCOUNT) {
      logger.warn('Development environment: Consider setting up GOOGLE_APPLICATION_CREDENTIALS for Firebase');
    }
  }
  
  return errors;
}

// Validate Stripe key format
function validateStripeKey(key: string | undefined, keyType: 'secret' | 'publishable'): string[] {
  if (!key) return [];
  
  const errors: string[] = [];
  const expectedPrefix = keyType === 'secret' ? 'sk_' : 'pk_';
  
  if (!key.startsWith(expectedPrefix)) {
    errors.push(`Invalid ${keyType} Stripe key format: must start with '${expectedPrefix}'`);
  }
  
  if (key.includes('test') && process.env.NODE_ENV === 'production') {
    errors.push(`Production environment cannot use test Stripe keys`);
  }
  
  return errors;
}

// Main validation function
export function validateEnvironment(): EnvVars {
  const startTime = Date.now();
  logger.info('Starting environment variable validation');
  
  try {
    // Basic schema validation
    const env = envSchema.parse(process.env);
    
    // Collect all validation errors
    const errors: string[] = [];
    
    // Environment-specific validations
    errors.push(...validateEnvironmentSpecificRequirements(env));
    
    // Stripe key validation
    errors.push(...validateStripeKey(env.STRIPE_SECRET_KEY, 'secret'));
    errors.push(...validateStripeKey(env.STRIPE_PUBLISHABLE_KEY, 'publishable'));
    
    // Log validation results
    const duration = Date.now() - startTime;
    
    if (errors.length > 0) {
      logger.error('Environment validation failed', {
        errors,
        duration,
        environment: env.NODE_ENV
      });
      
      // In production, fail fast on validation errors
      if (env.NODE_ENV === 'production') {
        throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
      }
      
      // In development, log warnings but continue
      logger.warn('Environment validation has warnings, but continuing in development mode');
    } else {
      logger.info('Environment validation successful', {
        duration,
        environment: env.NODE_ENV,
        configuredServices: {
          firebase: !!(env.FIREBASE_SERVICE_ACCOUNT || env.FIREBASE_ADMIN_PROJECT_ID),
          stripe: !!env.STRIPE_SECRET_KEY,
          oauth: {
            twitter: !!(env.TWITTER_CLIENT_ID && env.TWITTER_CLIENT_SECRET),
            facebook: !!(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET),
            linkedin: !!(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET),
            instagram: !!(env.INSTAGRAM_CLIENT_ID && env.INSTAGRAM_CLIENT_SECRET),
          },
          monitoring: !!env.SENTRY_DSN,
        }
      });
    }
    
    return env;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      );
      
      logger.error('Environment schema validation failed', {
        errors: formattedErrors,
        duration,
        environment: process.env.NODE_ENV
      });
      
      throw new Error(`Environment validation failed:\n${formattedErrors.join('\n')}`);
    }
    
    logger.error('Unexpected error during environment validation', {
      error,
      duration,
      environment: process.env.NODE_ENV
    });
    
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnvironment();

// Helper functions for environment-specific checks
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

// Service availability checks
export const hasFirebaseConfig = !!(env.FIREBASE_SERVICE_ACCOUNT || env.FIREBASE_ADMIN_PROJECT_ID);
export const hasStripeConfig = !!env.STRIPE_SECRET_KEY;
export const hasMonitoring = !!env.SENTRY_DSN;

export default env;