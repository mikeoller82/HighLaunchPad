'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our context data
interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  checkApiKey: () => boolean;
  isKeyReady: boolean;
}

// Create the context with a default value
const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

// Create the Provider component that will wrap our app
export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyInternal] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // On initial load, try to get the key from browser's localStorage
  useEffect(() => {
    // Add safety check for localStorage availability
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedKey = localStorage.getItem('user_gemini_api_key');
        if (storedKey) {
          setApiKeyInternal(storedKey);
        }
      } catch (error) {
        console.warn('Failed to access localStorage:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Function to update state and localStorage together
  const setApiKey = (key: string | null) => {
    setApiKeyInternal(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        if (key) {
          localStorage.setItem('user_gemini_api_key', key);
        } else {
          localStorage.removeItem('user_gemini_api_key');
        }
      } catch (error) {
        console.warn('Failed to update localStorage:', error);
      }
    }
  };

  // Helper function for components to easily check for a key and open the dialog
  const checkApiKey = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = localStorage.getItem('user_gemini_api_key');
        if (!key) {
          setIsDialogOpen(true);
          return false;
        }
        return true;
      } catch (error) {
        console.warn('Failed to access localStorage:', error);
        setIsDialogOpen(true);
        return false;
      }
    }
    setIsDialogOpen(true);
    return false;
  }

  const value = {
    apiKey,
    setApiKey,
    isDialogOpen,
    setIsDialogOpen,
    checkApiKey,
    isKeyReady: isLoaded && !!apiKey,
  };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}
