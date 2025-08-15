// Optimized fetch with automatic retry and rate limiting
import { apiThrottler } from './request-throttler';

interface OptimizedFetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  throttleKey?: string;
}

class OptimizedFetch {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly defaultTTL = 30000; // 30 seconds

  async fetch<T = any>(
    url: string, 
    options: OptimizedFetchOptions = {}
  ): Promise<T> {
    const {
      retries = 2,
      retryDelay = 1000,
      timeout = 10000,
      throttleKey = url,
      ...fetchOptions
    } = options;

    // Check cache first for GET requests
    if (!fetchOptions.method || fetchOptions.method === 'GET') {
      const cached = this.getFromCache(url);
      if (cached) {
        return cached;
      }
    }

    // Use throttler to prevent rate limiting
    return apiThrottler.throttle(throttleKey, async () => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            // Handle rate limiting specifically
            if (response.status === 429) {
              const retryAfter = response.headers.get('Retry-After');
              const delay = retryAfter ? parseInt(retryAfter) * 1000 : retryDelay * Math.pow(2, attempt);
              
              if (attempt < retries) {
                console.warn(`Rate limited. Retrying after ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
              }
            }

            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          // Cache successful GET responses
          if (!fetchOptions.method || fetchOptions.method === 'GET') {
            this.setCache(url, data, this.defaultTTL);
          }

          return data;
        } catch (error) {
          lastError = error as Error;
          
          if (attempt < retries) {
            const delay = retryDelay * Math.pow(2, attempt);
            console.warn(`Request failed, retrying in ${delay}ms:`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError || new Error('Request failed after all retries');
    });
  }

  private getFromCache(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  clearCache(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

export const optimizedFetch = new OptimizedFetch();

// Convenience wrapper that matches native fetch API
export async function fetchWithRetry<T = any>(
  url: string,
  options?: OptimizedFetchOptions
): Promise<T> {
  return optimizedFetch.fetch<T>(url, options);
}