/**
 * Client-side affiliate utilities
 * These functions are safe to use in React components
 */

export interface ReferralTrackingData {
  referralCode?: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  utm?: Record<string, string>;
}

/**
 * Track a click on an affiliate link
 */
export async function trackAffiliateClick(referralCode: string, trackingData: ReferralTrackingData = {}) {
  try {
    const response = await fetch('/api/affiliate/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referralCode,
        clickData: {
          userAgent: trackingData.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
          referrer: trackingData.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
          utm: trackingData.utm || {},
          sessionId: generateSessionId(),
        }
      })
    });

    if (!response.ok) {
      console.error('Failed to track affiliate click');
    }
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
  }
}

/**
 * Track a conversion when a user signs up through an affiliate link
 */
export async function trackAffiliateConversion(
  referralCode: string, 
  userId: string, 
  subscriptionAmount: number,
  subscriptionId?: string
) {
  try {
    const response = await fetch('/api/affiliate/track-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referralCode,
        userId,
        subscriptionAmount,
        subscriptionId
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Failed to track affiliate conversion:', data.error);
      return { success: false, error: data.error };
    }

    return { 
      success: true, 
      commissionAmount: data.commissionAmount,
      tier2Commission: data.tier2Commission 
    };
  } catch (error) {
    console.error('Error tracking affiliate conversion:', error);
    return { success: false, error: 'Network error' };
  }
}

/**
 * Store referral information in user's session/localStorage for later conversion tracking
 */
export function storeReferralInfo(referralCode: string) {
  if (typeof window !== 'undefined') {
    // Store in localStorage with expiration (30 days)
    const referralData = {
      code: referralCode,
      timestamp: Date.now(),
      expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    };
    
    localStorage.setItem('hlp_referral', JSON.stringify(referralData));
    
    // Also store in sessionStorage for immediate access
    sessionStorage.setItem('hlp_referral_code', referralCode);
  }
}

/**
 * Get stored referral information
 */
export function getStoredReferralInfo(): { code: string; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // First check sessionStorage
    const sessionCode = sessionStorage.getItem('hlp_referral_code');
    if (sessionCode) {
      return { code: sessionCode, timestamp: Date.now() };
    }
    
    // Then check localStorage
    const stored = localStorage.getItem('hlp_referral');
    if (!stored) return null;
    
    const referralData = JSON.parse(stored);
    
    // Check if expired
    if (Date.now() > referralData.expires) {
      localStorage.removeItem('hlp_referral');
      return null;
    }
    
    return {
      code: referralData.code,
      timestamp: referralData.timestamp
    };
  } catch (error) {
    console.error('Error getting stored referral info:', error);
    return null;
  }
}

/**
 * Clear stored referral information (call after successful conversion)
 */
export function clearStoredReferralInfo() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hlp_referral');
    sessionStorage.removeItem('hlp_referral_code');
  }
}

/**
 * Generate a unique session ID for tracking
 */
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Extract UTM parameters from URL
 */
export function extractUtmParameters(url?: string): Record<string, string> {
  const utm: Record<string, string> = {};
  
  try {
    const urlObj = new URL(url || (typeof window !== 'undefined' ? window.location.href : ''));
    const params = urlObj.searchParams;
    
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = params.get(param);
      if (value) {
        utm[param] = value;
      }
    });
  } catch (error) {
    console.error('Error extracting UTM parameters:', error);
  }
  
  return utm;
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  // Referral codes should be 8-10 characters, alphanumeric
  return /^[a-zA-Z0-9]{8,10}$/.test(code);
}