// Optimized Firestore hook with rate limiting protection
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  DocumentReference, 
  Query, 
  DocumentSnapshot, 
  QuerySnapshot,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { firebaseConnectionManager } from '@/lib/firebase-connection-manager';

interface UseOptimizedFirestoreOptions {
  enabled?: boolean;
  throttleMs?: number;
  maxRetries?: number;
}

// Hook for real-time document subscription
export function useOptimizedDocument<T>(
  ref: DocumentReference | null,
  key: string,
  options: UseOptimizedFirestoreOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const { enabled = true, throttleMs = 2000, maxRetries = 2 } = options;

  useEffect(() => {
    if (!ref || !enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Use connection manager for throttled subscription
    const unsubscribe = firebaseConnectionManager.subscribe(
      key,
      ref,
      (snapshot: DocumentSnapshot | QuerySnapshot) => {
        if ('exists' in snapshot) { // Type guard for DocumentSnapshot
          if (snapshot.exists()) {
            setData({ id: snapshot.id, ...snapshot.data() } as T);
          } else {
            setData(null);
          }
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Firestore error for ${key}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [ref, key, enabled]);

  return { data, loading, error };
}

// Hook for real-time collection subscription
export function useOptimizedCollection<T>(
  query: Query | null,
  key: string,
  options: UseOptimizedFirestoreOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const { enabled = true } = options;

  useEffect(() => {
    if (!query || !enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = firebaseConnectionManager.subscribe(
      key,
      query,
      (snapshot: DocumentSnapshot | QuerySnapshot) => {
        if ('docs' in snapshot) { // Type guard for QuerySnapshot
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          setData(items);
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Firestore collection error for ${key}:`, err);
        setError(err);
        setLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [query, key, enabled]);

  return { data, loading, error };
}

// One-time fetch with caching
const fetchCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export function useOptimizedFetch<T>(
  ref: DocumentReference | Query | null,
  key: string,
  options: UseOptimizedFirestoreOptions = {}
) {
  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { enabled = true } = options;

  const fetchData = useCallback(async () => {
    if (!ref || !enabled) {
      setLoading(false);
      return;
    }

    // Check cache first
    const cached = fetchCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if ('path' in ref) {
        // Document reference
        const snapshot = await getDoc(ref as DocumentReference);
        const result = snapshot.exists() 
          ? { id: snapshot.id, ...snapshot.data() } as T
          : null;
        
        setData(result);
        fetchCache.set(key, { data: result, timestamp: Date.now() });
      } else {
        // Query reference
        const snapshot = await getDocs(ref as Query);
        const result = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        
        setData(result);
        fetchCache.set(key, { data: result, timestamp: Date.now() });
      }
    } catch (err) {
      console.error(`Firestore fetch error for ${key}:`, err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [ref, key, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Clear cache utility
export function clearFirestoreCache(key?: string) {
  if (key) {
    fetchCache.delete(key);
  } else {
    fetchCache.clear();
  }
}