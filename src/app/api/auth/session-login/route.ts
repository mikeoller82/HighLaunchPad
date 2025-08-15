// src/app/api/auth/session-login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withRateLimit, RateLimitConfigs } from '@/lib/rate-limiter';
import { logRequest, logSecurityEvent } from '@/lib/logger';

import {
  getFirebaseAuth,
  createSessionCookieWithRetry,
} from '@/lib/firebase-admin';

/* ------------------------------------------------------------------ */
/* constants                                                          */
/* ------------------------------------------------------------------ */
const COOKIE_NAME = '__session';
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;          // 432-000-000
const VERIFY_TIMEOUT_MS = 15_000;
const IS_DEV = process.env.NODE_ENV === 'development';

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */
const bodySchema = z.object({
  idToken: z.string().min(10, 'idToken is required'),
});

/** Abort-controller helper (Node 18+) */
async function withTimeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort('timeout'), ms);
  try {
    // @ts-ignore – firebase SDK ignores unknown signal
    return await promise;
  } finally {
    clearTimeout(id);
  }
}

/* ------------------------------------------------------------------ */
/* route handler                                                      */
/* ------------------------------------------------------------------ */
async function handlePOST(req: NextRequest) {
  const logger = logRequest(req, 'session-login');
  /* ---------- DEV shortcut ---------- */
  if (IS_DEV) {
    logger.info('Development mode authentication bypass');
    
    const res = NextResponse.json({
      success: true,
      user: { uid: 'dev', email: 'dev@example.com' },
    });
    res.cookies.set({
      name: COOKIE_NAME,
      value: 'dev-session',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: FIVE_DAYS_MS / 1000,
    });
    return res;
  }

  /* ---------- Parse JSON ---------- */
  let idToken: string;
  try {
    const json = await req.json();
    ({ idToken } = bodySchema.parse(json));
  } catch (err) {
    logger.error('Invalid request body', { error: err });
    return NextResponse.json(
      { error: 'Invalid body', details: (err as Error).message },
      { status: 400 },
    );
  }

  const auth = getFirebaseAuth();

  try {
    logger.info('Attempting token verification and session creation');
    
    /* ---------- Verify token ---------- */
    const decoded = await withTimeout(
      VERIFY_TIMEOUT_MS,
      auth.verifyIdToken(idToken),
    );

    logger.info('Token verified successfully', { 
      uid: decoded.uid, 
      email: decoded.email?.substring(0, 3) + '***' // Partially mask email
    });

    /* ---------- Create session cookie ---------- */
    const sessionCookie = await createSessionCookieWithRetry(
      idToken,
      FIVE_DAYS_MS,
    );

    /* ---------- Build response ---------- */
    const res = NextResponse.json({
      success: true,
      user: { uid: decoded.uid, email: decoded.email },
    });

    res.cookies.set(COOKIE_NAME, sessionCookie || '', {
      httpOnly: true,
      secure: !IS_DEV,
      sameSite: 'lax',
      path: '/',
      maxAge: FIVE_DAYS_MS / 1000,
    });

    logger.info('Session created successfully', { userId: decoded.uid });
    return res;
  } catch (err) {
    const e = err as Error & { code?: string };
    const isTimeout =
      e.message === 'timeout' || e.code === 'ETIMEDOUT' || e.name === 'AbortError';

    if (isTimeout) {
      logger.warn('Authentication timeout', { timeout: VERIFY_TIMEOUT_MS, error: e.message });
    } else {
      logger.error('Authentication failed', { error: e.message, code: e.code });
      
      // Log security event for failed authentication
      logSecurityEvent('auth_failure', {
        userAgent: req.headers.get('user-agent'),
        ip: req.headers.get('x-forwarded-for') || req.ip,
        error: e.message
      });
    }

    return NextResponse.json(
      {
        error: isTimeout ? 'Verification timeout' : 'Auth error',
        details: e.message,
      },
      { status: isTimeout ? 408 : 401 },
    );
  }
}

// Apply rate limiting to the POST handler
export const POST = withRateLimit(RateLimitConfigs.auth)(handlePOST);
