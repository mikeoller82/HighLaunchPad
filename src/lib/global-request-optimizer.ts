// Global request optimizer to prevent rate exceeded issues
class GlobalRequestOptimizer {
  private pendingRequests = new Map<string, Promise<any>>();
  private requestCounts = new Map<string, number>();
  private lastRequestTime = new Map<string, number>();
  private readonly minInterval = 500; // Minimum 500ms between similar requests
  private readonly maxConcurrent = 3; // Maximum 3 concurrent requests of same type

  // Debounce identical requests
  async optimizeRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    options: {
      debounceMs?: number;
      maxConcurrent?: number;
      forceNew?: boolean;
    } = {}
  ): Promise<T> {
    const {
      debounceMs = this.minInterval,
      maxConcurrent = this.maxConcurrent,
      forceNew = false
    } = options;

    // If same request is already pending and not forced new, return existing promise
    if (!forceNew && this.pendingRequests.has(key)) {
      console.log(`Reusing pending request for: ${key}`);
      return this.pendingRequests.get(key)!;
    }

    // Check if we're making requests too frequently
    const now = Date.now();
    const lastRequest = this.lastRequestTime.get(key) || 0;
    const timeSinceLastRequest = now - lastRequest;

    if (timeSinceLastRequest < debounceMs) {
      const waitTime = debounceMs - timeSinceLastRequest;
      console.log(`Debouncing request for ${key}, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    // Check concurrent request limit
    const currentCount = this.requestCounts.get(key) || 0;
    if (currentCount >= maxConcurrent) {
      console.warn(`Too many concurrent requests for ${key}, queuing...`);
      // Wait for some requests to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.optimizeRequest(key, requestFn, { ...options, forceNew: true });
    }

    // Execute the request
    this.requestCounts.set(key, currentCount + 1);
    this.lastRequestTime.set(key, Date.now());

    const requestPromise = requestFn()
      .finally(() => {
        // Clean up
        this.pendingRequests.delete(key);
        const count = this.requestCounts.get(key) || 1;
        this.requestCounts.set(key, Math.max(0, count - 1));
      });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }

  // Clear all pending requests (useful for cleanup)
  clearAll() {
    this.pendingRequests.clear();
    this.requestCounts.clear();
    this.lastRequestTime.clear();
  }

  // Get stats for debugging
  getStats() {
    return {
      pendingRequests: this.pendingRequests.size,
      requestCounts: Object.fromEntries(this.requestCounts),
      lastRequestTimes: Object.fromEntries(this.lastRequestTime)
    };
  }
}

export const globalRequestOptimizer = new GlobalRequestOptimizer();

// Optimized fetch wrapper that uses the global optimizer
export async function optimizedApiCall<T = any>(
  url: string,
  options: RequestInit & {
    debounceMs?: number;
    maxConcurrent?: number;
    cacheKey?: string;
  } = {}
): Promise<T> {
  const {
    debounceMs = 1000,
    maxConcurrent = 2,
    cacheKey,
    ...fetchOptions
  } = options;

  const requestKey = cacheKey || `${fetchOptions.method || 'GET'}:${url}`;

  return globalRequestOptimizer.optimizeRequest(
    requestKey,
    async () => {
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - wait longer before retry
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
          console.warn(`Rate limited on ${url}, waiting ${waitTime}ms`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          throw new Error(`Rate limited: ${response.status}`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json() as Promise<T>;
    },
    { debounceMs, maxConcurrent }
  );
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalRequestOptimizer.clearAll();
  });
}