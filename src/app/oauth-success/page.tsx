'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function OAuthSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const success = searchParams?.get('success');
    const error = searchParams?.get('error');
    const details = searchParams?.get('details');

    console.log('[OAuth Success] Processing callback:', { success, error, details });

    // Set status for UI feedback
    if (success) {
      setStatus('success');
    } else if (error) {
      setStatus('error');
    }

    // Small delay to ensure UI updates before closing popup
    const processCallback = () => {
      if (window.opener && !window.opener.closed) {
        console.log('[OAuth Success] Sending message to parent window');
        try {
          // We're in a popup, communicate back to parent
          if (success) {
            window.opener.postMessage({ 
              type: 'oauth-success',
              timestamp: Date.now()
            }, window.location.origin);
          } else if (error) {
            window.opener.postMessage({ 
              type: 'oauth-error', 
              error, 
              details: details || 'Unknown error occurred',
              timestamp: Date.now()
            }, window.location.origin);
          }
          
          // Close popup after a short delay
          setTimeout(() => {
            window.close();
          }, 1000);
        } catch (err) {
          console.error('[OAuth Success] Error communicating with parent:', err);
          // Fallback to redirect
          setTimeout(() => {
            const redirectUrl = success 
              ? '/dashboard/settings?tab=social&success=true'
              : `/dashboard/settings?tab=social&error=${error}&details=${encodeURIComponent(details || '')}`;
            window.location.href = redirectUrl;
          }, 2000);
        }
      } else {
        console.log('[OAuth Success] No parent window, redirecting');
        // Fallback: redirect to settings page
        const redirectUrl = success 
          ? '/dashboard/settings?tab=social&success=true'
          : `/dashboard/settings?tab=social&error=${error}&details=${encodeURIComponent(details || '')}`;
        window.location.href = redirectUrl;
      }
    };

    // Process after a short delay to ensure UI renders
    setTimeout(processCallback, 500);
  }, [searchParams]);

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return 'Account connected successfully! This window will close automatically.';
      case 'error':
        return 'Connection failed. Please try again.';
      default:
        return 'Processing your request...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-sm border max-w-md">
        <div className="mb-4">
          {status === 'processing' && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          )}
          {status === 'success' && (
            <div className="rounded-full h-8 w-8 bg-green-100 flex items-center justify-center mx-auto">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="rounded-full h-8 w-8 bg-red-100 flex items-center justify-center mx-auto">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        <h1 className="text-xl font-semibold mb-2">
          {status === 'success' ? 'Success!' : status === 'error' ? 'Connection Failed' : 'Processing...'}
        </h1>
        <p className={getStatusColor()}>
          {getStatusMessage()}
        </p>
        {searchParams?.get('details') && status === 'error' && (
          <p className="text-sm text-gray-500 mt-2">
            {searchParams.get('details')}
          </p>
        )}
      </div>
    </div>
  );
}