'server-only';
import fs from 'fs';
import {
  getApps,
  initializeApp,
  cert,
  applicationDefault,
  App,
} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { logFirebaseOperation } from '@/lib/logger';

const ENV_VAR_NAME = 'FIREBASE_SERVICE_ACCOUNT'; // Cloud Run injects the secret here

/**
 * Initialise Firebase Admin exactly once and return the App instance.
 * Priority order for production:
 * 1. FIREBASE_SERVICE_ACCOUNT – secret JSON content (Google Cloud Build/Run)
 * 2. Individual environment variables (Cloud Build secrets)
 * 3. GOOGLE_APPLICATION_CREDENTIALS – path to JSON file (local dev)
 * 4. Application Default Credentials (gcloud auth / metadata-server)
 */
export function getAdminApp(): App {
  const logger = logFirebaseOperation('firebase_admin_init');
  
  if (getApps().length) {
    // already initialised
    logger.debug('Firebase Admin already initialized, returning existing app');
    return getApps()[0];
  }

  logger.info('Attempting to initialize Firebase Admin');

  // ───── 1) Google Cloud Build/Run: secret injected as env-var string ─────
  const jsonFromEnv = process.env[ENV_VAR_NAME];
  if (jsonFromEnv) {
    logger.info('Initializing from environment variable', { source: ENV_VAR_NAME });
    try {
      const serviceAccount = JSON.parse(jsonFromEnv);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    } catch (e) {
      logger.error('Failed to parse FIREBASE_SERVICE_ACCOUNT', { error: e });
      // Continue to next method instead of fallback
    }
  }

  // ───── 2) Google Cloud Build: Individual environment variables from secrets ─────
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    logger.info('Initializing from individual environment variables', { source: 'env_vars' });
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        projectId,
      });
    } catch (err) {
      logger.error('Failed to initialize with environment variables', { error: err });
      // Continue to next method instead of throwing
    }
  }

  // ───── 3) Local development: GOOGLE_APPLICATION_CREDENTIALS → file path ─────
  const filePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (filePath && fs.existsSync(filePath)) {
    logger.info('Initializing from credentials file', { source: 'credentials_file', path: filePath });
    try {
      const creds = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return initializeApp({
        credential: cert(creds),
        projectId: creds.project_id,
      });
    } catch (err) {
      logger.error('Failed to read credentials file', { error: err, path: filePath });
      // Continue to next method
    }
  }

  // ───── 4) Production fallback: Application Default Credentials ─────
  logger.warn('Using applicationDefault() - ensure service account is properly configured', { source: 'application_default' });
  try {
    return initializeApp({
      credential: applicationDefault(),
      projectId: projectId || 'firebase-veilnet',
    });
  } catch (err) {
    logger.error('All Firebase Admin initialization methods failed', { error: err });
    throw new Error('Firebase Admin initialization failed. Please check your service account configuration.');
  }
}

/**
 * Helper that returns Firebase Auth quickly.
 */
export function getFirebaseAuth() {
  return getAuth(getAdminApp());
}

/**
 * Helper that returns Firestore Admin DB instance.
 */
export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export const adminDb = getAdminDb;

// Export auth and db for compatibility
export const auth = getFirebaseAuth();
export const db = getAdminDb();

/**
 * Create a session cookie with configurable retries + exponential back-off.
 */
export async function createSessionCookieWithRetry(
  idToken: string,
  expiresIn: number,
  maxRetries = 3,
) {
  const auth = getFirebaseAuth();
  const logger = logFirebaseOperation('create_session_cookie');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug('Creating session cookie', { attempt, maxRetries });
      return await auth.createSessionCookie(idToken, { expiresIn });
    } catch (err) {
      logger.error('Session cookie creation attempt failed', { 
        attempt, 
        maxRetries, 
        error: (err as Error).message 
      });
      if (attempt === maxRetries) throw err;

      // simple exponential back-off up to 10 s
      const wait = Math.min(1000 * 2 ** (attempt - 1), 10_000);
      logger.info('Retrying session cookie creation', { waitTime: wait, nextAttempt: attempt + 1 });
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}
