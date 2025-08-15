import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

/**
 * Liveness probe endpoint
 * Returns 200 if the service is alive and running
 * Used by Kubernetes to determine if the container should be restarted
 * This should be a very lightweight check that only fails if the process is truly broken
 */
export async function GET(request: NextRequest) {
  const livenessLogger = logger.child({
    component: 'liveness_check',
    requestId: request.headers.get('x-request-id') || `live_${Date.now()}`
  });

  try {
    // Very basic checks that should always pass unless the process is broken
    
    // 1. Check if we can access basic Node.js APIs
    const currentTime = Date.now();
    const currentMemory = process.memoryUsage();
    
    // 2. Check if basic JavaScript operations work
    const testArray = [1, 2, 3];
    const testSum = testArray.reduce((a, b) => a + b, 0);
    
    if (testSum !== 6) {
      throw new Error('Basic JavaScript operations failing');
    }

    // 3. Check if we can perform basic async operations
    await new Promise(resolve => setTimeout(resolve, 1));

    livenessLogger.debug('Liveness check passed', {
      memoryUsage: currentMemory.heapUsed,
      uptime: process.uptime()
    });

    return NextResponse.json(
      { 
        alive: true, 
        timestamp: new Date(currentTime).toISOString(),
        uptime: process.uptime(),
        pid: process.pid
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      }
    );

  } catch (error) {
    // If we reach here, the process is likely in a bad state
    livenessLogger.error('Liveness check failed - process may be corrupted', { error });
    
    return NextResponse.json(
      { 
        alive: false, 
        error: 'Process health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}