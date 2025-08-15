import { useEffect, useState } from 'react';
import { Firestore } from 'firebase/firestore';
import { WorkspaceInitializer } from './workspace-initializer';
import { UnifiedAgentService } from './unified-agent-service';

export interface InitializationStatus {
  isInitializing: boolean;
  isInitialized: boolean;
  error: string | null;
  progress: string;
}

/**
 * React hook for initializing AI agents workspace
 * Ensures proper Firestore document structure before agents are used
 */
export function useAIAgentsInitialization(db: Firestore | null, userId: string | null) {
  const [status, setStatus] = useState<InitializationStatus>({
    isInitializing: false,
    isInitialized: false,
    error: null,
    progress: 'Waiting for authentication...'
  });

  useEffect(() => {
    if (!db || !userId) {
      setStatus({
        isInitializing: false,
        isInitialized: false,
        error: null,
        progress: 'Waiting for authentication...'
      });
      return;
    }

    let isMounted = true;

    const initializeAgents = async () => {
      if (!isMounted) return;

      setStatus({
        isInitializing: true,
        isInitialized: false,
        error: null,
        progress: 'Checking workspace...'
      });

      try {
        // Step 1: Check if workspace is already initialized
        const workspaceInitializer = WorkspaceInitializer.getInstance();
        const isAlreadyInitialized = await workspaceInitializer.isWorkspaceInitialized(db, userId);

        if (isAlreadyInitialized && isMounted) {
          setStatus({
            isInitializing: false,
            isInitialized: true,
            error: null,
            progress: 'Already initialized'
          });
          return;
        }

        // Step 2: Initialize workspace
        if (isMounted) {
          setStatus(prev => ({ ...prev, progress: 'Initializing workspace...' }));
        }
        
        await workspaceInitializer.initializeWorkspace(db, userId);

        // Step 3: Initialize agents
        if (isMounted) {
          setStatus(prev => ({ ...prev, progress: 'Initializing AI agents...' }));
        }

        const unifiedService = UnifiedAgentService.getInstance();
        await unifiedService.initializeWorkspaceAgents(db, userId);

        // Step 4: Complete
        if (isMounted) {
          setStatus({
            isInitializing: false,
            isInitialized: true,
            error: null,
            progress: 'Initialization complete'
          });
        }

        console.log('✅ AI Agents initialization completed successfully');

      } catch (error) {
        console.error('❌ AI Agents initialization failed:', error);
        
        if (isMounted) {
          setStatus({
            isInitializing: false,
            isInitialized: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            progress: 'Initialization failed'
          });
        }
      }
    };

    // Start initialization
    initializeAgents();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [db, userId]);

  return status;
}

/**
 * Manual initialization function for use outside of React components
 */
export async function initializeAIAgentsWorkspace(db: Firestore, userId: string): Promise<void> {
  console.log('🚀 Starting AI Agents workspace initialization...');
  
  try {
    // Step 1: Initialize workspace document and collections
    const workspaceInitializer = WorkspaceInitializer.getInstance();
    await workspaceInitializer.initializeWorkspace(db, userId);

    // Step 2: Initialize AI agents
    const unifiedService = UnifiedAgentService.getInstance();
    await unifiedService.initializeWorkspaceAgents(db, userId);

    console.log('✅ AI Agents workspace initialization completed');
  } catch (error) {
    console.error('❌ AI Agents workspace initialization failed:', error);
    throw error;
  }
}

/**
 * Check if AI agents are properly initialized for a user
 */
export async function checkAIAgentsInitialization(db: Firestore, userId: string): Promise<boolean> {
  try {
    const workspaceInitializer = WorkspaceInitializer.getInstance();
    return await workspaceInitializer.isWorkspaceInitialized(db, userId);
  } catch (error) {
    console.error('Error checking AI agents initialization:', error);
    return false;
  }
}