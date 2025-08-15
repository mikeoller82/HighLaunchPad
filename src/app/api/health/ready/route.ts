import { NextRequest, NextResponse } from 'next/server';
import { getAdminApp, getAdminDb } from '@/lib/firebase-admin';
import { logger } from '@/lib/logger';
import { hasFirebaseConfig } from '@/lib/env-validation';

/**
 * Readiness probe endpoint
 * Returns 200 if the service is ready to accept traffic
 * Used by Kubernetes and load balancers to determine if traffic should be routed here
 */
export async function GET(request: NextRequest) {
  const readinessLogger = logger.child({
    component: 'readiness_check',
    requestId: request.headers.get('x-request-id') || `ready_${Date.now()}`
  });

  readinessLogger.debug('Readiness check initiated');

  try {
    // Check critical services that must be available for the app to function
    
    // 1. Firebase configuration and connectivity
    if (!hasFirebaseConfig) {
      readinessLogger.error('Readiness check failed: Firebase not configured');
      return NextResponse.json(
        { 
          ready: false, 
          error: 'Firebase not configured',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    // Test Firebase Admin initialization and basic connectivity
    try {
      const app = getAdminApp();
      const db = getAdminDb();
      
      // Simple connectivity test - this should be very fast
      await db.collection('_readiness_check').limit(1).get();
      
    } catch (error) {
      readinessLogger.error('Readiness check failed: Firebase connectivity issue', { error });
      return NextResponse.json(
        { 
          ready: false, 
          error: 'Firebase connectivity issue',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    // 2. Environment variables validation
    if (!process.env.NODE_ENV) {
      readinessLogger.error('Readiness check failed: NODE_ENV not set');
      return NextResponse.json(
        { 
          ready: false, 
          error: 'Environment not properly configured',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    // Service is ready
    readinessLogger.debug('Readiness check passed');
    
    return NextResponse.json(
      { 
        ready: true, 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    );

  } catch (error) {
    readinessLogger.error('Readiness check failed with unexpected error', { error });
    
    return NextResponse.json(
      { 
        ready: false, 
        error: 'Internal readiness check error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}