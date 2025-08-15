// Performance optimization utilities
import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Debounce hook for performance
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

// Optimized router with prefetching
export function useOptimizedRouter() {
  const router = useRouter();
  
  const prefetchRoute = useCallback((href: string) => {
    router.prefetch(href);
  }, [router]);
  
  const navigateWithTransition = useCallback((href: string, options?: { replace?: boolean }) => {
    // Use replace for better back button behavior
    if (options?.replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  }, [router]);
  
  return {
    ...router,
    prefetchRoute,
    navigateWithTransition
  };
}

// Memory-efficient state management
export function useOptimizedState<T>(initialValue: T) {
  const [state, setState] = useState(initialValue);
  const stateRef = useRef(state);
  
  const optimizedSetState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
      stateRef.current = nextValue;
      return nextValue;
    });
  }, []);
  
  return [state, optimizedSetState, stateRef] as const;
}

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const observe = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.observe(element);
    }
  }, []);
  
  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);
  
  return { observe, unobserve };
}

// Cache management for API responses
class ResponseCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear() {
    this.cache.clear();
  }
  
  delete(key: string) {
    this.cache.delete(key);
  }
}

export const apiCache = new ResponseCache();

// Optimized fetch with caching
export async function optimizedFetch(url: string, options?: RequestInit & { cache?: boolean; ttl?: number }) {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  
  if (options?.cache !== false) {
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (options?.cache !== false) {
      apiCache.set(cacheKey, data, options?.ttl);
    }
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}