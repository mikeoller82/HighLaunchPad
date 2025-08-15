// Request throttler to prevent API rate limiting
class RequestThrottler {
  private requestQueue: Map<string, number> = new Map();
  private readonly throttleDelay: number;
  private readonly maxConcurrent: number;
  private activeRequests = 0;

  constructor(throttleDelay = 1000, maxConcurrent = 3) {
    this.throttleDelay = throttleDelay;
    this.maxConcurrent = maxConcurrent;
  }

  async throttle<T>(key: string, request: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const lastRequest = this.requestQueue.get(key) || 0;
    const timeSinceLastRequest = now - lastRequest;

    // Wait if we're making requests too quickly
    if (timeSinceLastRequest < this.throttleDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.throttleDelay - timeSinceLastRequest)
      );
    }

    // Wait if we have too many concurrent requests
    while (this.activeRequests >= this.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.activeRequests++;
    this.requestQueue.set(key, Date.now());

    try {
      return await request();
    } finally {
      this.activeRequests--;
    }
  }

  clear() {
    this.requestQueue.clear();
    this.activeRequests = 0;
  }
}

export const apiThrottler = new RequestThrottler(2000, 2); // 2 second delay, max 2 concurrent
export const firebaseThrottler = new RequestThrottler(1500, 3); // 1.5 second delay, max 3 concurrent