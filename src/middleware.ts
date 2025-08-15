import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Enhanced in-memory rate limiter with better production handling
const rateLimit = new Map<string, { count: number; resetTime: number; lastRequest: number }>();

// Clean up old entries every 5 minutes to prevent memory leaks (only in runtime, not during build)
if (typeof window !== 'undefined' && typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const cutoff = now - 300000; // 5 minutes ago
    
    for (const [key, record] of Array.from(rateLimit.entries())) {
      if (record.lastRequest < cutoff) {
        rateLimit.delete(key);
      }
    }
  }, 300000);
}

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'anonymous';
  return `${ip}:${request.nextUrl.pathname}`;
}

function isRateLimited(key: string, limit: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimit.get(key);

  if (!record || now > record.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs, lastRequest: now });
    return false;
  }

  if (record.count >= limit) {
    record.lastRequest = now;
    return true;
  }

  record.count++;
  record.lastRequest = now;
  return false;
}

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const key = getRateLimitKey(request);
    
    // Balanced rate limits that prevent abuse while allowing normal usage
    let limit = 100; // Default: 100 requests per minute
    let windowMs = 60000; // 1 minute window
    
    if (request.nextUrl.pathname.includes('/ai/')) {
      limit = 30; // AI endpoints: 30 requests per minute
    } else if (request.nextUrl.pathname.includes('/auth/')) {
      limit = 20; // Auth endpoints: 20 requests per minute
    } else if (request.nextUrl.pathname.includes('/stripe/')) {
      limit = 50; // Stripe endpoints: 50 requests per minute
    } else if (request.nextUrl.pathname.includes('/social/')) {
      limit = 40; // Social media endpoints: 40 requests per minute
    } else if (request.nextUrl.pathname.includes('/content/')) {
      limit = 60; // Content endpoints: 60 requests per minute
    } else if (request.nextUrl.pathname.includes('/templates/') || 
               request.nextUrl.pathname.includes('/websites/') ||
               request.nextUrl.pathname.includes('/funnels/')) {
      limit = 300; // Template/website/funnel endpoints: 300 requests per minute
      windowMs = 60000; // 1 minute window
    } else if (request.nextUrl.pathname.includes('/images/') ||
               request.nextUrl.pathname.includes('/media/') ||
               request.nextUrl.pathname.includes('/assets/')) {
      limit = 500; // Image/media endpoints: 500 requests per minute
      windowMs = 60000; // 1 minute window
    }

    if (isRateLimited(key, limit, windowMs)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(windowMs / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(windowMs / 1000).toString(),
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(Date.now() / 1000 + windowMs / 1000).toString(),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    const record = rateLimit.get(key);
    if (record) {
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', Math.max(0, limit - record.count).toString());
      response.headers.set('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000).toString());
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};