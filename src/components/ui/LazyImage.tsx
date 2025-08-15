'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Loader2, ImageOff } from 'lucide-react';
import { loadImageSafely } from '@/lib/rate-limit-prevention';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: number;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  'data-ai-hint'?: string;
}

export function LazyImage({
  src,
  alt,
  className = '',
  fill = false,
  sizes,
  priority = 0,
  fallbackSrc = '/placeholder-image.jpg',
  onLoad,
  onError,
  'data-ai-hint': dataAiHint,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  // Preload image when visible
  useEffect(() => {
    if (!isVisible || hasError) return;

    const preloadImage = async () => {
      try {
        setIsLoading(true);
        
        // Use the simple rate limiting approach
        await loadImageSafely(currentSrc);
        
        setIsLoading(false);
        onLoad?.();
      } catch (error) {
        console.warn(`Failed to load image: ${currentSrc}`, error);

        // Try fallback image if original fails
        if (currentSrc !== fallbackSrc && retryCountRef.current < maxRetries) {
          console.log(`Switching to fallback image: ${fallbackSrc}`);
          setCurrentSrc(fallbackSrc);
          retryCountRef.current++;
          return;
        }

        // Final failure
        setHasError(true);
        setIsLoading(false);
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    };

    preloadImage();
  }, [isVisible, currentSrc, priority, fallbackSrc, onLoad, onError, hasError]);

  if (!isVisible) {
    return (
      <div 
        ref={imgRef} 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        {...(fill ? { style: { position: 'absolute', inset: 0 } } : {})}
      >
        <div className="flex flex-col items-center justify-center p-4 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <span className="text-xs">Loading...</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        {...(fill ? { style: { position: 'absolute', inset: 0 } } : {})}
      >
        <div className="flex flex-col items-center justify-center p-4 text-gray-400">
          <ImageOff className="h-6 w-6 mb-2" />
          <span className="text-xs text-center">Image unavailable</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        {...(fill ? { style: { position: 'absolute', inset: 0 } } : {})}
      >
        <div className="flex flex-col items-center justify-center p-4 text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <span className="text-xs">Loading image...</span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      data-ai-hint={dataAiHint}
      onLoad={() => {
        setIsLoading(false);
        onLoad?.();
      }}
      onError={(error) => {
        console.warn(`Next.js Image component error for: ${currentSrc}`, error);
        setHasError(true);
        setIsLoading(false);
        onError?.(new Error(`Failed to load image: ${currentSrc}`));
      }}
      {...props}
    />
  );
}