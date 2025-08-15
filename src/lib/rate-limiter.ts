import { NextRequest, NextResponse } from 'next/server';
import { logger, logSecurityEvent } from '@/lib/logger';

// In-memory store for rate limiting (use Redis in production)
interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked?: boolean;
  blockUntil?: number;
}

class InMemoryRateLimitStore {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  private cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.store.forEach((entry, key) => {
      if (entry.resetTime < now && (!entry.blockUntil || entry.blockUntil < now)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.store.delete(key);
    });
  }

  get(key: string): RateLimitEntry | undefined {
    const entry = this.store.get(key);
    const now = Date.now();
    
    // Clean up expired entry
    if (entry && entry.resetTime < now && (!entry.blockUntil || entry.blockUntil < now)) {
      this.store.delete(key);
      return undefined;
    }
    
    return entry;
  }

  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }

  increment(key: string, windowMs: number, maxRequests: number): RateLimitEntry {
    const now = Date.now();
    const resetTime = now + windowMs;
    const existing = this.get(key);

    if (!existing || existing.resetTime < now) {
      // Create new or reset expired entry
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime,
      };
      this.set(key, newEntry);
      return newEntry;
    }

    // Increment existing entry
    existing.count++;
    this.set(key, existing);
    return existing;
  }

  block(key: string, blockDurationMs: number): void {
    const now = Date.now();
    const existing = this.get(key) || { count: 0, resetTime: now };
    existing.blocked = true;
    existing.blockUntil = now + blockDurationMs;
    this.set(key, existing);
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Global store instance
const store = new InMemoryRateLimitStore();

// Rate limit configuration
export interface RateLimitConfig {
  windowMs: number;        // Time window in milliseconds
  max: number;            // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
  skipIf?: (req: NextRequest) => boolean;      // Skip rate limiting condition
  blockDuration?: number; // How long to block after exceeding limit (ms)
  skipSuccessfulRequests?: boolean; // Only count failed requests
  skipFailedRequests?: boolean;     // Only count successful requests
}

// Default configurations for different endpoint types
export const RateLimitConfigs = {
  // Conservative limits for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                   // 5 attempts per window
    blockDuration: 30 * 60 * 1000, // Block for 30 minutes after exceeding
  } as RateLimitConfig,

  // Moderate limits for API endpoints
  api: {
    windowMs: 60 * 1000,      // 1 minute
    max: 100,                 // 100 requests per minute
    blockDuration: 5 * 60 * 1000, // Block for 5 minutes after exceeding
  } as RateLimitConfig,

  // Stricter limits for AI/ML endpoints (more resource intensive)
  ai: {
    windowMs: 60 * 1000,      // 1 minute
    max: 20,                  // 20 requests per minute
    blockDuration: 10 * 60 * 1000, // Block for 10 minutes after exceeding
  } as RateLimitConfig,

  // Very strict limits for webhook endpoints
  webhook: {
    windowMs: 60 * 1000,      // 1 minute
    max: 50,                  // 50 requests per minute
    blockDuration: 15 * 60 * 1000, // Block for 15 minutes after exceeding
  } as RateLimitConfig,

  // Generous limits for public/static content
  public: {
    windowMs: 60 * 1000,      // 1 minute
    max: 1000,                // 1000 requests per minute
    blockDuration: 60 * 1000, // Block for 1 minute after exceeding
  } as RateLimitConfig,
};

// Get client IP address
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const clientIP = req.headers.get('x-client-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || clientIP || req.ip || 'unknown';
}

// Default key generator using IP address
function defaultKeyGenerator(req: NextRequest): string {
  const ip = getClientIP(req);
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  // Include user agent hash for better fingerprinting
  const agentHash = Buffer.from(userAgent).toString('base64').slice(0, 8);
  return `rate_limit:${ip}:${agentHash}`;
}

// Rate limiter middleware factory
export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs,
    max,
    keyGenerator = defaultKeyGenerator,
    skipIf,
    blockDuration = 10 * 60 * 1000, // 10 minutes default
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = config;

  return async function rateLimitMiddleware(
    req: NextRequest,
    context?: { params?: any }
  ): Promise<NextResponse | null> {
    const requestLogger = logger.child({
      component: 'rate_limiter',
      method: req.method,
      url: req.url,
    });

    // Skip if condition is met
    if (skipIf && skipIf(req)) {
      requestLogger.debug('Rate limiting skipped due to skip condition');
      return null;
    }

    const key = keyGenerator(req);
    const now = Date.now();

    // Check if client is blocked
    const existing = store.get(key);
    if (existing && existing.blocked && existing.blockUntil && existing.blockUntil > now) {
      const remainingBlockTime = Math.ceil((existing.blockUntil - now) / 1000);
      
      logSecurityEvent('rate_limit_blocked_access_attempt', {
        key,
        ip: getClientIP(req),
        remainingBlockTime,
        userAgent: req.headers.get('user-agent'),
      });
      
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Access blocked. Try again in ${remainingBlockTime} seconds.`,
          retryAfter: remainingBlockTime,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(remainingBlockTime),
            'X-Blocked-Until': new Date(existing.blockUntil).toISOString(),
          },
        }
      );
    }

    // Increment counter
    const entry = store.increment(key, windowMs, max);
    
    // Check if limit exceeded
    if (entry.count > max) {
      // Block the client
      store.block(key, blockDuration);
      
      const blockUntilTime = Math.ceil(blockDuration / 1000);
      
      logSecurityEvent('rate_limit_exceeded', {
        key,
        ip: getClientIP(req),
        requestCount: entry.count,
        maxRequests: max,
        windowMs,
        blockDuration,
        userAgent: req.headers.get('user-agent'),
      });
      
      return new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Blocked for ${blockUntilTime} seconds.`,
          retryAfter: blockUntilTime,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(blockUntilTime),
            'X-RateLimit-Limit': String(max),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(entry.resetTime),
            'X-Blocked-Until': new Date(now + blockDuration).toISOString(),
          },
        }
      );
    }

    // Add rate limit headers to response
    const remaining = Math.max(0, max - entry.count);
    const resetTime = Math.ceil(entry.resetTime / 1000);
    
    requestLogger.debug('Rate limit check passed', {
      key,
      count: entry.count,
      limit: max,
      remaining,
      resetTime: new Date(entry.resetTime).toISOString(),
    });

    // Return null to continue (headers will be added by the calling handler)
    return null;
  };
}

// Helper to add rate limit headers to existing response
export function addRateLimitHeaders(
  response: NextResponse,
  config: RateLimitConfig,
  req: NextRequest
): NextResponse {
  const key = (config.keyGenerator || defaultKeyGenerator)(req);
  const entry = store.get(key);
  
  if (entry) {
    const remaining = Math.max(0, config.max - entry.count);
    const resetTime = Math.ceil(entry.resetTime / 1000);
    
    response.headers.set('X-RateLimit-Limit', String(config.max));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(resetTime));
    response.headers.set('X-RateLimit-Window', String(config.windowMs));
  }
  
  return response;
}

// Express-style middleware wrapper for API routes
export function withRateLimit(config: RateLimitConfig) {
  const rateLimiter = createRateLimiter(config);
  
  return function middleware(handler: Function) {
    return async function (req: NextRequest, context?: any) {
      const rateLimitResponse = await rateLimiter(req, context);
      
      if (rateLimitResponse) {
        // Rate limit exceeded, return the rate limit response
        return rateLimitResponse;
      }
      
      // Continue with the original handler
      const response = await handler(req, context);
      
      // Add rate limit headers to successful responses
      if (response instanceof NextResponse) {
        return addRateLimitHeaders(response, config, req);
      }
      
      return response;
    };
  };
}

// Cleanup function for graceful shutdown
export function cleanupRateLimiter(): void {
  store.destroy();
}

export default createRateLimiter;