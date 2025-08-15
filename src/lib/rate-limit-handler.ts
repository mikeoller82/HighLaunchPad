/**
 * Rate Limit Handler
 * Specialized handler for detecting and managing rate limiting scenarios
 */

interface RateLimitInfo {
  hostname: string;
  lastRateLimit: number;
  consecutiveRateLimits: number;
  backoffUntil: number;
  isBlocked: boolean;
}

class RateLimitHandler {
  private rateLimitMap = new Map<string, RateLimitInfo>();
  private readonly baseBackoffDelay = 5000; // 5 seconds base delay
  private readonly maxBackoffDelay = 300000; // 5 minutes max delay
  private readonly backoffMultiplier = 2;
  private readonly rateLimitResetTime = 600000; // 10 minutes to reset rate limit counter

  /**
   * Check if a hostname is currently rate limited
   */
  isRateLimited(url: string): boolean {
    const hostname = this.getHostname(url);
    const info = this.rateLimitMap.get(hostname);
    
    if (!info) return false;
    
    const now = Date.now();
    
    // Reset if enough time has passed
    if (now - info.lastRateLimit > this.rateLimitResetTime) {
      info.consecutiveRateLimits = 0;
      info.isBlocked = false;
      return false;
    }
    
    // Check if still in backoff period
    if (info.isBlocked && now < info.backoffUntil) {
      return true;
    }
    
    // Clear block if backoff period has passed
    if (info.isBlocked && now >= info.backoffUntil) {
      info.isBlocked = false;
    }
    
    return false;
  }

  /**
   * Record a rate limit occurrence
   */
  recordRateLimit(url: string, retryAfter?: number): number {
    const hostname = this.getHostname(url);
    const now = Date.now();
    
    let info = this.rateLimitMap.get(hostname);
    if (!info) {
      info = {
        hostname,
        lastRateLimit: 0,
        consecutiveRateLimits: 0,
        backoffUntil: 0,
        isBlocked: false
      };
      this.rateLimitMap.set(hostname, info);
    }
    
    info.lastRateLimit = now;
    info.consecutiveRateLimits++;
    info.isBlocked = true;
    
    // Calculate backoff delay
    let backoffDelay: number;
    
    if (retryAfter) {
      // Use server-provided retry-after if available
      backoffDelay = retryAfter * 1000;
    } else {
      // Use exponential backoff based on consecutive rate limits
      backoffDelay = Math.min(
        this.baseBackoffDelay * Math.pow(this.backoffMultiplier, info.consecutiveRateLimits - 1),
        this.maxBackoffDelay
      );
    }
    
    info.backoffUntil = now + backoffDelay;
    
    console.warn(`Rate limit detected for ${hostname}. Backing off for ${Math.round(backoffDelay / 1000)} seconds. (Consecutive: ${info.consecutiveRateLimits})`);
    
    return backoffDelay;
  }

  /**
   * Record a successful request (resets consecutive rate limits)
   */
  recordSuccess(url: string): void {
    const hostname = this.getHostname(url);
    const info = this.rateLimitMap.get(hostname);
    
    if (info) {
      info.consecutiveRateLimits = Math.max(0, info.consecutiveRateLimits - 1);
      if (info.consecutiveRateLimits === 0) {
        info.isBlocked = false;
      }
    }
  }

  /**
   * Get the next allowed request time for a hostname
   */
  getNextAllowedTime(url: string): number {
    const hostname = this.getHostname(url);
    const info = this.rateLimitMap.get(hostname);
    
    if (!info || !info.isBlocked) {
      return Date.now();
    }
    
    return info.backoffUntil;
  }

  /**
   * Get rate limit status for debugging
   */
  getRateLimitStatus(): Array<{
    hostname: string;
    isBlocked: boolean;
    consecutiveRateLimits: number;
    nextAllowedTime: string;
  }> {
    const status: Array<{
      hostname: string;
      isBlocked: boolean;
      consecutiveRateLimits: number;
      nextAllowedTime: string;
    }> = [];
    
    this.rateLimitMap.forEach((info, hostname) => {
      status.push({
        hostname,
        isBlocked: info.isBlocked,
        consecutiveRateLimits: info.consecutiveRateLimits,
        nextAllowedTime: new Date(info.backoffUntil).toLocaleTimeString()
      });
    });
    
    return status;
  }

  /**
   * Clear rate limit info for a hostname
   */
  clearRateLimit(url: string): void {
    const hostname = this.getHostname(url);
    this.rateLimitMap.delete(hostname);
  }

  /**
   * Clear all rate limit info
   */
  clearAllRateLimits(): void {
    this.rateLimitMap.clear();
  }

  /**
   * Extract hostname from URL
   */
  private getHostname(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Detect if an error is likely a rate limit error
   */
  isRateLimitError(error: any): boolean {
    if (!error) return false;
    
    const errorString = error.toString().toLowerCase();
    const rateLimitIndicators = [
      '429',
      'too many requests',
      'rate limit',
      'quota exceeded',
      'throttled',
      'rate limiting detected'
    ];
    
    return rateLimitIndicators.some(indicator => errorString.includes(indicator));
  }

  /**
   * Wait until a hostname is no longer rate limited
   */
  async waitForRateLimit(url: string): Promise<void> {
    const nextAllowedTime = this.getNextAllowedTime(url);
    const now = Date.now();
    
    if (nextAllowedTime > now) {
      const waitTime = nextAllowedTime - now;
      console.log(`Waiting ${Math.round(waitTime / 1000)} seconds for rate limit to clear for ${this.getHostname(url)}`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Global instance
export const rateLimitHandler = new RateLimitHandler();

// Clean up old rate limit entries every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const resetTime = 600000; // 10 minutes
    
    rateLimitHandler.getRateLimitStatus().forEach(status => {
      // Clear entries that haven't had rate limits for a while
      if (now - rateLimitHandler.getNextAllowedTime(`https://${status.hostname}`) > resetTime) {
        rateLimitHandler.clearRateLimit(`https://${status.hostname}`);
      }
    });
  }, 10 * 60 * 1000);
}