'use client';

import { AuthProvider } from '@/context/auth-context';
import { ApiKeyProvider } from '@/context/ApiKeyContext';
import { Toaster } from '@/components/ui/toaster';
import { ApiKeyDialog } from '@/components/ai/api-key-dialog';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ApiKeyProvider>
          {children}
          <ApiKeyDialog />
          <Toaster />
        </ApiKeyProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}