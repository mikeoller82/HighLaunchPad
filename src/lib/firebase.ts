// Firebase configuration
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, initializeFirestore, Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Production settings
export const PRODUCTION_SETTINGS = {
  maxIdleTime: 60000,
  maxConcurrentRequests: 5,
  retryDelayMs: 2000,
  maxRetryAttempts: 2,
  cacheSizeBytes: 40 * 1024 * 1024,
  enablePersistence: true,
  synchronizeTabs: false
};

// Rate limiter class
class FirebaseRateLimiter {
  private requestQueue: Array<() => Promise<any>> = [];
  private activeRequests = 0;
  private lastRequestTime = 0;
  private readonly maxConcurrent = PRODUCTION_SETTINGS.maxConcurrentRequests;
  private readonly minInterval = 200;

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.activeRequests >= this.maxConcurrent || this.requestQueue.length === 0) {
      return;
    }

    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minInterval) {
      setTimeout(() => this.processQueue(), this.minInterval - timeSinceLastRequest);
      return;
    }

    const operation = this.requestQueue.shift();
    if (!operation) return;

    this.activeRequests++;
    this.lastRequestTime = Date.now();

    try {
      await operation();
    } finally {
      this.activeRequests--;
      setTimeout(() => this.processQueue(), this.minInterval);
    }
  }
}

export const firebaseRateLimiter = new FirebaseRateLimiter();

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with modern persistence settings
let db: Firestore;
if (typeof window !== 'undefined') {
  // Client-side initialization with persistence
  try {
    db = initializeFirestore(app, {
      cacheSizeBytes: PRODUCTION_SETTINGS.cacheSizeBytes,
      localCache: {
        kind: 'persistent'
      }
    });
  } catch (error) {
    // Fallback if persistence fails (e.g., multiple tabs)
    console.warn('Failed to initialize with persistence, falling back to memory cache:', error);
    db = getFirestore(app);
  }
} else {
  // Server-side initialization
  db = getFirestore(app);
}

const auth = getAuth(app);

export { db, auth, app };
