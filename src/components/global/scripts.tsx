'use client';

import { useEffect } from 'react';

export function GlobalScripts() {
  useEffect(() => {
    // Performance optimizations - removed service worker for now to avoid build issues

    // Optimize back button behavior
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was loaded from cache, refresh dynamic content
        window.dispatchEvent(new Event('page-restored-from-cache'));
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    // Handle LinkedIn tracking script errors
    const handleError = (e: ErrorEvent) => {
      if (e.message && (
        e.message.includes('require is not defined') ||
        e.message.includes('TrackingTwo requires an initialPageInstance')
      )) {
        console.warn('LinkedIn tracking script error suppressed:', e.message);
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);

    // Handle unhandled promise rejections from LinkedIn scripts
    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      if (e.reason && e.reason.toString().includes('linkedin')) {
        console.warn('LinkedIn script promise rejection suppressed:', e.reason);
        e.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Prefetch critical dashboard routes
    if (window.location.pathname.startsWith('/dashboard')) {
      const criticalRoutes = ['/dashboard', '/dashboard/links', '/dashboard/funnels'];
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    }

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
