'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Throttle prefetch requests to prevent rate limiting
const prefetchThrottle = new Map<string, number>();
const THROTTLE_DELAY = 1000; // 1 second between prefetch requests

interface OptimizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  onMouseEnter?: () => void;
  onClick?: () => void;
}

export function OptimizedLink({ 
  href, 
  children, 
  className, 
  prefetch = true,
  replace = false,
  onMouseEnter,
  onClick,
  ...props 
}: OptimizedLinkProps) {
  const router = useRouter();
  const prefetchedRef = useRef(false);

  const handleMouseEnter = useCallback(() => {
    if (prefetch && !prefetchedRef.current) {
      const now = Date.now();
      const lastPrefetch = prefetchThrottle.get(href) || 0;
      
      if (now - lastPrefetch > THROTTLE_DELAY) {
        router.prefetch(href);
        prefetchedRef.current = true;
        prefetchThrottle.set(href, now);
      }
    }
    onMouseEnter?.();
  }, [href, prefetch, router, onMouseEnter]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    onClick?.();
    
    // For same-origin navigation, use router for better performance
    if (href.startsWith('/')) {
      e.preventDefault();
      if (replace) {
        router.replace(href);
      } else {
        router.push(href);
      }
    }
  }, [href, replace, router, onClick]);

  // Prefetch on mount for critical routes with throttling
  useEffect(() => {
    if (prefetch && href.startsWith('/dashboard')) {
      const now = Date.now();
      const lastPrefetch = prefetchThrottle.get(href) || 0;
      
      if (now - lastPrefetch > THROTTLE_DELAY) {
        router.prefetch(href);
        prefetchedRef.current = true;
        prefetchThrottle.set(href, now);
      }
    }
  }, [href, prefetch, router]);

  return (
    <Link
      href={href}
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}