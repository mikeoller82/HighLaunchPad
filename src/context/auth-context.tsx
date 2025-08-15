'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { User, Auth } from 'firebase/auth';
import type { Firestore } from "firebase/firestore";
import { Loader2 } from 'lucide-react';
import type { DocumentData } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  subscription: DocumentData | null;
  loading: boolean;
  auth: Auth | null;
  db: Firestore | null;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [db, setDb] = useState<Firestore | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Use refs to prevent unnecessary re-renders
  const unsubscribeAuthRef = useRef<(() => void) | null>(null);
  const unsubscribeSubRef = useRef<(() => void) | null>(null);
  const initializingRef = useRef(false);

  const handleUserChange = useCallback((userAuth: User | null, firebaseDb: Firestore | null) => {
    setUser(userAuth);
    
    // Clean up previous subscription listener
    if (unsubscribeSubRef.current) {
      unsubscribeSubRef.current();
      unsubscribeSubRef.current = null;
    }
    
    if (userAuth && firebaseDb) {
      try {
        // Use async/await instead of .then() to avoid potential webpack issues
        const setupSubscriptionListener = async () => {
          try {
            const { onCurrentUserSubscriptionUpdate } = await import('@/lib/stripe-client');
            if (onCurrentUserSubscriptionUpdate) {
              const unsubscribeSub = onCurrentUserSubscriptionUpdate(firebaseDb, userAuth, (snapshot) => {
                const newSubscription = snapshot.subscriptions[0] || null;
                setSubscription(newSubscription);
              });
              unsubscribeSubRef.current = unsubscribeSub;
            } else {
              console.warn('onCurrentUserSubscriptionUpdate not available');
              setSubscription(null);
            }
          } catch (error) {
            console.error('Error setting up subscription listener:', error);
            setSubscription(null);
          }
        };
        
        setupSubscriptionListener();
      } catch (error) {
        console.error('Error setting up subscription listener:', error);
        setSubscription(null);
      }
    } else {
      setSubscription(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initializingRef.current) return;
    initializingRef.current = true;
    
    const initFirebase = async () => {
      try {
        // Import Firebase modules
        const firebaseModule = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');

        const firebaseAuth: Auth | null = firebaseModule.auth;
        const firebaseDb: Firestore | null = firebaseModule.db;

        if (!firebaseAuth || !firebaseDb) {
          console.warn('Firebase services not properly initialized - likely missing environment variables');
          setAuthError('Firebase configuration is incomplete. Please check environment variables.');
          setLoading(false);
          return;
        }

        setAuth(firebaseAuth);
        setDb(firebaseDb);

        const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (userAuth) => {
          handleUserChange(userAuth, firebaseDb);
        });
        
        unsubscribeAuthRef.current = unsubscribeAuth;
      } catch (error) {
        console.error("Firebase initialization error:", error);
        setAuthError("Failed to load Firebase services.");
        setLoading(false);
      }
    };

    initFirebase();

    // Cleanup function
    return () => {
      if (unsubscribeAuthRef.current) {
        unsubscribeAuthRef.current();
      }
      if (unsubscribeSubRef.current) {
        unsubscribeSubRef.current();
      }
    };
  }, [handleUserChange]);

  const value = { user, subscription, loading, auth, db, authError };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
