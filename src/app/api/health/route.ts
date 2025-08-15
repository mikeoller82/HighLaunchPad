import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp, getFirebaseAuth, getAdminDb } from '@/lib/firebase-admin';
import { logger } from '@/lib/logger';
import { env, hasFirebaseConfig, hasStripeConfig } from '@/lib/env-validation';

interface HealthCheckStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  services: {
    [key: string]: {
      status: 'up' | 'down' | 'degraded';
      responseTime?: number;
      error?: string;
      details?: any;
    };
  };
  system: {
    nodeVersion: string;
    platform: string;
    memory: {
      used: number;
      free: number;
      total: number;
      percentage: number;
    };
    cpu: {
      loadAverage: number[];
    };
  };
}

// Track service start time for uptime calculation
const startTime = Date.now();

async function checkFirebaseHealth(): Promise<{ status: 'up' | 'down' | 'degraded'; responseTime?: number; error?: string; details?: any }> {
  if (!hasFirebaseConfig) {
    return { 
      status: 'down', 
      error: 'Firebase not configured',
      details: { reason: 'Missing Firebase configuration' }
    };
  }

  const checkStart = Date.now();
  
  try {
    // Test Firebase Admin initialization
    const app = getAdminApp();
    
    // Test Firestore connection
    const db = getAdminDb();
    await db.collection('_health_check').limit(1).get();
    
    // Test Firebase Auth
    const auth = getFirebaseAuth();
    // Just check if auth is available (no actual operations)
    
    const responseTime = Date.now() - checkStart;
    
    return { 
      status: 'up', 
      responseTime,
      details: {
        projectId: app.options.projectId,
        authConfigured: !!auth,
        firestoreConnected: true
      }
    };
    
  } catch (error) {
    const responseTime = Date.now() - checkStart;
    logger.error('Firebase health check failed', { error, responseTime });
    
    return { 
      status: 'down', 
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: { error: error instanceof Error ? error.stack : error }
    };
  }
}

async function checkStripeHealth(): Promise<{ status: 'up' | 'down' | 'degraded'; responseTime?: number; error?: string; details?: any }> {
  if (!hasStripeConfig) {
    return { 
      status: 'down', 
      error: 'Stripe not configured',
      details: { reason: 'Missing Stripe configuration' }
    };
  }

  const checkStart = Date.now();
  
  try {
    // Check if Stripe is configured
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe not configured');
    }
    
    // Import Stripe dynamically to avoid issues if not configured
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
    
    // Simple API test - retrieve account information
    const account = await stripe.accounts.retrieve();
    const responseTime = Date.now() - checkStart;
    
    return { 
      status: 'up', 
      responseTime,
      details: {
        accountId: account.id,
        country: account.country,
        livemode: !account.id.includes('test')
      }
    };
    
  } catch (error) {
    const responseTime = Date.now() - checkStart;
    logger.error('Stripe health check failed', { error, responseTime });
    
    return { 
      status: 'down', 
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: { error: error instanceof Error ? error.stack : error }
    };
  }
}

async function checkDatabaseHealth(): Promise<{ status: 'up' | 'down' | 'degraded'; responseTime?: number; error?: string; details?: any }> {
  // For Firebase, this is covered by the Firebase check
  // If using other databases, add specific checks here
  return { status: 'up', details: { note: 'Using Firebase Firestore (checked in Firebase health)' } };
}

function getSystemHealth() {
  const memUsage = process.memoryUsage();
  const totalMem = memUsage.heapTotal + memUsage.external;
  const usedMem = memUsage.heapUsed;
  const freeMem = totalMem - usedMem;
  
  return {
    nodeVersion: process.version,
    platform: process.platform,
    memory: {
      used: usedMem,
      free: freeMem,
      total: totalMem,
      percentage: Math.round((usedMem / totalMem) * 100)
    },
    cpu: {
      loadAverage: process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0]
    }
  };
}

// Determine overall status based on service statuses
function determineOverallStatus(services: HealthCheckStatus['services']): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(services).map(service => service.status);
  
  const downCount = statuses.filter(status => status === 'down').length;
  const degradedCount = statuses.filter(status => status === 'degraded').length;
  
  if (downCount > 0) {
    return 'unhealthy';
  } else if (degradedCount > 0) {
    return 'degraded';
  } else {
    return 'healthy';
  }
}

export async function GET(request: NextRequest) {
  const healthLogger = logger.child({
    component: 'health_check',
    requestId: request.headers.get('x-request-id') || `health_${Date.now()}`
  });

  healthLogger.info('Health check initiated');
  const checkStart = Date.now();

  try {
    // Run all health checks in parallel
    const [firebaseHealth, stripeHealth, databaseHealth] = await Promise.allSettled([
      checkFirebaseHealth(),
      checkStripeHealth(), 
      checkDatabaseHealth()
    ]);

    const services: HealthCheckStatus['services'] = {
      firebase: firebaseHealth.status === 'fulfilled' ? firebaseHealth.value : { 
        status: 'down', 
        error: firebaseHealth.reason?.message || 'Health check failed' 
      },
      stripe: stripeHealth.status === 'fulfilled' ? stripeHealth.value : { 
        status: 'down', 
        error: stripeHealth.reason?.message || 'Health check failed' 
      },
      database: databaseHealth.status === 'fulfilled' ? databaseHealth.value : { 
        status: 'down', 
        error: databaseHealth.reason?.message || 'Health check failed' 
      },
    };

    const systemHealth = getSystemHealth();
    const overallStatus = determineOverallStatus(services);
    const uptime = Date.now() - startTime;

    const healthStatus: HealthCheckStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: env.APP_VERSION || '1.0.0',
      environment: env.NODE_ENV,
      uptime,
      services,
      system: systemHealth
    };

    const totalCheckTime = Date.now() - checkStart;
    
    healthLogger.info('Health check completed', {
      status: overallStatus,
      totalCheckTime,
      serviceStatuses: Object.fromEntries(
        Object.entries(services).map(([key, value]) => [key, value.status])
      )
    });

    // Return appropriate HTTP status code
    const httpStatus = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    const totalCheckTime = Date.now() - checkStart;
    
    healthLogger.error('Health check failed with unexpected error', {
      error,
      totalCheckTime
    });

    const errorResponse: HealthCheckStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: env.APP_VERSION || '1.0.0',
      environment: env.NODE_ENV,
      uptime: Date.now() - startTime,
      services: {
        system: {
          status: 'down',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      system: getSystemHealth()
    };

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });
  }
}