// Firebase Connection Manager - Optimized for production
import { 
  Firestore, 
  onSnapshot, 
  Unsubscribe,
  DocumentReference,
  Query,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';

interface ConnectionConfig {
  maxConnections: number;
  throttleDelay: number;
  retryAttempts: number;
  batchSize: number;
}

class FirebaseConnectionManager {
  private connections = new Map<string, Unsubscribe>();
  private throttleMap = new Map<string, number>();
  private config: ConnectionConfig;

  constructor(config: Partial<ConnectionConfig> = {}) {
    this.config = {
      maxConnections: 10, // Limit concurrent connections
      throttleDelay: 1000, // 1 second between similar requests
      retryAttempts: 3,
      batchSize: 25, // Firebase limit
      ...config
    };
  }

  // Throttled onSnapshot with automatic cleanup
  subscribe<T>(
    key: string,
    ref: DocumentReference | Query,
    callback: (snapshot: DocumentSnapshot | QuerySnapshot) => void,
    errorCallback?: (error: Error) => void
  ): () => void {
    // Check if we're at connection limit
    if (this.connections.size >= this.config.maxConnections) {
      console.warn(`Firebase connection limit reached (${this.config.maxConnections}). Skipping subscription for ${key}`);
      return () => {};
    }

    // Throttle similar requests
    const now = Date.now();
    const lastRequest = this.throttleMap.get(key) || 0;
    
    if (now - lastRequest < this.config.throttleDelay) {
      console.log(`Throttling Firebase request for ${key}`);
      return () => {};
    }

    // Clean up existing connection if it exists
    this.unsubscribe(key);

    // Create new connection with error handling
    const errorHandler = (error: Error) => {
      console.error(`Firebase subscription error for ${key}:`, error);
      this.unsubscribe(key);
      if (errorCallback) errorCallback(error);
    };

    // Check if it's a DocumentReference or Query by checking for 'path' property
    const isDocumentRef = 'path' in ref && typeof ref.path === 'string' && !ref.path.includes('/');
    
    const unsubscribe = isDocumentRef
      ? onSnapshot(
          ref as DocumentReference,
          { includeMetadataChanges: false },
          callback as (snapshot: DocumentSnapshot) => void,
          errorHandler
        )
      : onSnapshot(
          ref as Query,
          { includeMetadataChanges: false },
          callback as (snapshot: QuerySnapshot) => void,
          errorHandler
        );

    this.connections.set(key, unsubscribe);
    this.throttleMap.set(key, now);

    // Return cleanup function
    return () => this.unsubscribe(key);
  }

  // Unsubscribe from specific connection
  unsubscribe(key: string): void {
    const unsubscribe = this.connections.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.connections.delete(key);
      console.log(`Unsubscribed from Firebase connection: ${key}`);
    }
  }

  // Clean up all connections
  cleanup(): void {
    console.log(`Cleaning up ${this.connections.size} Firebase connections`);
    this.connections.forEach((unsubscribe, key) => {
      unsubscribe();
      console.log(`Cleaned up connection: ${key}`);
    });
    this.connections.clear();
    this.throttleMap.clear();
  }

  // Get connection stats
  getStats() {
    return {
      activeConnections: this.connections.size,
      maxConnections: this.config.maxConnections,
      throttledRequests: this.throttleMap.size
    };
  }

  // Check if we're approaching limits
  isNearLimit(): boolean {
    return this.connections.size >= this.config.maxConnections * 0.8;
  }
}

// Global instance
export const firebaseConnectionManager = new FirebaseConnectionManager({
  maxConnections: 8, // Conservative limit for production
  throttleDelay: 2000, // 2 seconds between similar requests
  retryAttempts: 2,
  batchSize: 20
});

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    firebaseConnectionManager.cleanup();
  });
}

export default firebaseConnectionManager;