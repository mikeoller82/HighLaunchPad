import { Firestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface WorkspaceData {
  id: string;
  ownerId: string;
  name?: string;
  activeAgents: Record<string, boolean>;
  createdAt: any;
  updatedAt: any;
  initialized: boolean;
}

export class WorkspaceInitializer {
  private static instance: WorkspaceInitializer;
  private initializedWorkspaces = new Set<string>();

  private constructor() {}

  public static getInstance(): WorkspaceInitializer {
    if (!WorkspaceInitializer.instance) {
      WorkspaceInitializer.instance = new WorkspaceInitializer();
    }
    return WorkspaceInitializer.instance;
  }

  /**
   * Ensures a workspace document exists with proper structure for AI agents
   */
  public async ensureWorkspaceExists(db: Firestore, userId: string): Promise<void> {
    if (this.initializedWorkspaces.has(userId)) {
      return; // Already initialized
    }

    try {
      const workspaceRef = doc(db, 'workspaces', userId);
      const workspaceSnap = await getDoc(workspaceRef);

      if (!workspaceSnap.exists()) {
        console.log('🏗️ Creating workspace document for user:', userId);
        
        // Create the workspace document with default structure
        const workspaceData: WorkspaceData = {
          id: userId,
          ownerId: userId,
          name: 'My Workspace',
          activeAgents: this.getDefaultActiveAgents(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          initialized: true
        };

        await setDoc(workspaceRef, workspaceData);
        console.log('✅ Workspace document created successfully');
      } else {
        // Ensure the workspace has the required fields
        const data = workspaceSnap.data();
        const updates: Partial<WorkspaceData> = {};
        let needsUpdate = false;

        if (!data.activeAgents) {
          updates.activeAgents = this.getDefaultActiveAgents();
          needsUpdate = true;
        }

        if (!data.initialized) {
          updates.initialized = true;
          needsUpdate = true;
        }

        if (!data.ownerId) {
          updates.ownerId = userId;
          needsUpdate = true;
        }

        if (needsUpdate) {
          updates.updatedAt = serverTimestamp();
          await setDoc(workspaceRef, updates, { merge: true });
          console.log('✅ Workspace document updated with missing fields');
        }
      }

      // Mark as initialized
      this.initializedWorkspaces.add(userId);
      
    } catch (error) {
      console.error('❌ Failed to ensure workspace exists:', error);
      throw error;
    }
  }

  /**
   * Initialize required subcollections for AI agents
   */
  public async initializeWorkspaceCollections(db: Firestore, userId: string): Promise<void> {
    try {
      // Create placeholder documents in required collections to ensure they exist
      const collections = [
        'agentChats',
        'agentActivities', 
        'taskExecutions',
        'agentConfigs',
        'blog_drafts',
        'posts',
        'scheduledPosts',
        'lead_scores',
        'lead_qualifications',
        'lead_assignments',
        'followups',
        'email_sequences',
        'nurturing_actions',
        'crm_updates'
      ];

      const initPromises = collections.map(async (collectionName) => {
        try {
          // Check if collection has any documents
          const { collection, query, limit, getDocs } = await import('firebase/firestore');
          const collectionRef = collection(db, 'workspaces', userId, collectionName);
          const snapshot = await getDocs(query(collectionRef, limit(1)));
          
          if (snapshot.empty) {
            // Create a placeholder document that will be cleaned up later
            const { addDoc } = await import('firebase/firestore');
            await addDoc(collectionRef, {
              _placeholder: true,
              createdAt: serverTimestamp(),
              message: 'This is a placeholder document to initialize the collection'
            });
            console.log(`✅ Initialized collection: ${collectionName}`);
          }
        } catch (error) {
          console.warn(`⚠️ Could not initialize collection ${collectionName}:`, error);
        }
      });

      await Promise.all(initPromises);
      console.log('✅ Workspace collections initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize workspace collections:', error);
      // Don't throw here as this is not critical for basic functionality
    }
  }

  /**
   * Get default active agents configuration
   */
  private getDefaultActiveAgents(): Record<string, boolean> {
    return {
      'crm': false,
      'content': false,
      'social': false,
      'automation': false,
      'customer_interaction': false,
      'sales_pipeline': false,
      'journey_orchestration': false,
      'data_integration': false,
      'workflow_management': false,
      'intelligence_reporting': false,
      'conversational_ai': false
    };
  }

  /**
   * Check if workspace is properly initialized
   */
  public async isWorkspaceInitialized(db: Firestore, userId: string): Promise<boolean> {
    try {
      const workspaceRef = doc(db, 'workspaces', userId);
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (!workspaceSnap.exists()) {
        return false;
      }

      const data = workspaceSnap.data();
      return !!(data.initialized && data.activeAgents && data.ownerId);
      
    } catch (error) {
      console.error('Error checking workspace initialization:', error);
      return false;
    }
  }

  /**
   * Reset initialization cache (useful for testing)
   */
  public resetCache(): void {
    this.initializedWorkspaces.clear();
  }

  /**
   * Full workspace initialization - ensures document and collections exist
   */
  public async initializeWorkspace(db: Firestore, userId: string): Promise<void> {
    console.log('🚀 Initializing workspace for user:', userId);
    
    // Step 1: Ensure workspace document exists
    await this.ensureWorkspaceExists(db, userId);
    
    // Step 2: Initialize required collections
    await this.initializeWorkspaceCollections(db, userId);
    
    console.log('✅ Workspace fully initialized for user:', userId);
  }
}