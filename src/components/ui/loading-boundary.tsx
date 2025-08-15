'use client';

import { Suspense, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function LoadingBoundary({ children, fallback }: LoadingBoundaryProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
}