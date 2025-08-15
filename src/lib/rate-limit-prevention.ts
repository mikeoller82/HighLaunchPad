/**
 * Rate Limit Prevention
 * Simple solution to prevent "rate exceeded" errors without complex dependencies
 */

// Simple in-memory store for tracking requests
const requestTracker = new Map<string, { count: number; resetTime: number }>();

/**
 * Get hostname from URL
 */
function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'localhost';
  }
}

/**
 * Check if we should delay a request to prevent rate limiting
 */
export function shouldDelayRequest(url: string): number {
  const hostname = getHostname(url);
  const now = Date.now();
  const key = `${hostname}:requests`;
  
  let tracker = requestTracker.get(key);
  
  // Reset if window expired (1 minute window)
  if (!tracker || now > tracker.resetTime) {
    tracker = { count: 0, resetTime: now + 60000 };
    requestTracker.set(key, tracker);
  }
  
  // If we've made too many requests, suggest a delay
  if (tracker.count >= 10) { // Max 10 requests per minute per hostname
    return Math.max(0, tracker.resetTime - now);
  }
  
  tracker.count++;
  return 0;
}

/**
 * Simple delay function
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Load image with rate limiting protection
 */
export async function loadImageSafely(src: string): Promise<void> {
  // Check if we should delay
  const delayMs = shouldDelayRequest(src);
  if (delayMs > 0) {
    console.log(`Delaying image load for ${Math.round(delayMs / 1000)}s to prevent rate limiting: ${src}`);
    await delay(Math.min(delayMs, 10000)); // Max 10 second delay
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    const timeout = setTimeout(() => {
      reject(new Error(`Image load timeout: ${src}`));
    }, 15000); // 15 second timeout
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve();
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    if (src.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.src = src;
  });
}

/**
 * Batch load images with rate limiting
 */
export async function loadImagesInBatch(
  imageUrls: string[], 
  options: { 
    batchSize?: number; 
    delayBetweenBatches?: number;
    onProgress?: (loaded: number, total: number) => void;
  } = {}
): Promise<{ loaded: number; failed: number }> {
  const { batchSize = 1, delayBetweenBatches = 2000, onProgress } = options;
  
  let loaded = 0;
  let failed = 0;
  
  // Process images in small batches
  for (let i = 0; i < imageUrls.length; i += batchSize) {
    const batch = imageUrls.slice(i, i + batchSize);
    
    // Load batch concurrently
    const promises = batch.map(async (url) => {
      try {
        await loadImageSafely(url);
        loaded++;
        onProgress?.(loaded, imageUrls.length);
      } catch (error) {
        failed++;
        console.warn(`Failed to load image: ${url}`, error);
      }
    });
    
    await Promise.allSettled(promises);
    
    // Delay between batches (except for the last batch)
    if (i + batchSize < imageUrls.length) {
      await delay(delayBetweenBatches);
    }
  }
  
  return { loaded, failed };
}

/**
 * Clean up old tracking data
 */
function cleanup() {
  const now = Date.now();
  requestTracker.forEach((tracker, key) => {
    if (now > tracker.resetTime + 300000) { // 5 minutes after reset
      requestTracker.delete(key);
    }
  });
}

// Clean up every 5 minutes (only in runtime, not during build)
if (typeof window !== 'undefined' && typeof setInterval !== 'undefined') {
  setInterval(cleanup, 300000);
}

// Export for debugging
if (typeof window !== 'undefined') {
  (window as any).rateLimitPrevention = {
    shouldDelayRequest,
    loadImageSafely,
    loadImagesInBatch,
    getTrackerStats: () => Array.from(requestTracker.entries())
  };
}