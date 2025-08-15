'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationState {
  scrollPosition: number;
  formData?: Record<string, any>;
  timestamp: number;
}

// Custom hook for better browser navigation
export function useBrowserNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const navigationStateRef = useRef<Map<string, NavigationState>>(new Map());
  const currentScrollRef = useRef(0);

  // Save scroll position before navigation
  const saveScrollPosition = useCallback(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined' && pathname) {
      currentScrollRef.current = window.scrollY;
      const state: NavigationState = {
        scrollPosition: window.scrollY,
        timestamp: Date.now()
      };
      navigationStateRef.current.set(pathname, state);
      
      // Store in sessionStorage for persistence across refreshes
      try {
        sessionStorage.setItem(`nav_state_${pathname}`, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save navigation state:', error);
      }
    }
  }, [pathname]);

  // Restore scroll position after navigation
  const restoreScrollPosition = useCallback((targetPath: string) => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const state = navigationStateRef.current.get(targetPath);
      let scrollPosition = 0;
      
      if (state) {
        scrollPosition = state.scrollPosition;
      } else {
        // Try to get from sessionStorage
        try {
          const stored = sessionStorage.getItem(`nav_state_${targetPath}`);
          if (stored) {
            const parsedState = JSON.parse(stored) as NavigationState;
            scrollPosition = parsedState.scrollPosition;
          }
        } catch (error) {
          console.warn('Failed to restore navigation state:', error);
        }
      }
      
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'instant'
        });
      });
    }
  }, []);

  // Enhanced navigation with state preservation
  const navigateWithState = useCallback((href: string, options?: { 
    replace?: boolean; 
    preserveScroll?: boolean;
    state?: Record<string, any>;
  }) => {
    if (options?.preserveScroll !== false) {
      saveScrollPosition();
    }
    
    if (options?.state && pathname) {
      const currentState = navigationStateRef.current.get(pathname) || {
        scrollPosition: currentScrollRef.current,
        timestamp: Date.now()
      };
      navigationStateRef.current.set(pathname, {
        ...currentState,
        formData: options.state
      });
    }
    
    if (options?.replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  }, [router, pathname, saveScrollPosition]);

  // Handle browser back/forward buttons
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handlePopState = () => {
      // Small delay to ensure pathname is updated
      setTimeout(() => {
        if (pathname) {
          restoreScrollPosition(pathname);
        }
      }, 50);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pathname, restoreScrollPosition]);

  // Save scroll position on page unload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveScrollPosition]);

  // Throttled scroll tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let ticking = false;
    
    const updateScrollPosition = () => {
      currentScrollRef.current = window.scrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get saved form data for current route
  const getSavedFormData = useCallback(() => {
    if (!pathname) return null;
    const state = navigationStateRef.current.get(pathname);
    return state?.formData || null;
  }, [pathname]);

  // Clear navigation state for a specific route
  const clearNavigationState = useCallback((path?: string) => {
    const targetPath = path || pathname;
    if (!targetPath) return;
    
    navigationStateRef.current.delete(targetPath);
    try {
      sessionStorage.removeItem(`nav_state_${targetPath}`);
    } catch (error) {
      console.warn('Failed to clear navigation state:', error);
    }
  }, [pathname]);

  return {
    navigateWithState,
    saveScrollPosition,
    restoreScrollPosition,
    getSavedFormData,
    clearNavigationState,
    currentScrollPosition: currentScrollRef.current
  };
}