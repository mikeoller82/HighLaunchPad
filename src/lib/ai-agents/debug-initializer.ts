import { Firestore, doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore';

export interface DebugInfo {
  workspaceExists: boolean;
  workspaceData?: any;
  collectionsStatus: Record<string, { exists: boolean; documentCount: number }>;
  agentStates: Record<string, boolean>;
  errors: string[];
  recommendations: string[];
}

/**
 * Debug utility for AI Agents Firestore integration
 * Provides detailed status information and troubleshooting recommendations
 */
export class AIAgentsDebugger {
  private static instance: AIAgentsDebugger;

  private constructor() {}

  public static getInstance(): AIAgentsDebugger {
    if (!AIAgentsDebugger.instance) {
      AIAgentsDebugger.instance = new AIAgentsDebugger();
    }
    return AIAgentsDebugger.instance;
  }

  /**
   * Comprehensive debug check for AI agents workspace
   */
  public async debugWorkspace(db: Firestore, userId: string): Promise<DebugInfo> {
    const debugInfo: DebugInfo = {
      workspaceExists: false,
      collectionsStatus: {},
      agentStates: {},
      errors: [],
      recommendations: []
    };

    try {
      // Check workspace document
      console.log('🔍 Checking workspace document...');
      const workspaceRef = doc(db, 'workspaces', userId);
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (workspaceSnap.exists()) {
        debugInfo.workspaceExists = true;
        debugInfo.workspaceData = workspaceSnap.data();
        debugInfo.agentStates = debugInfo.workspaceData.activeAgents || {};
        console.log('✅ Workspace document exists');
      } else {
        debugInfo.errors.push('Workspace document does not exist');
        debugInfo.recommendations.push('Run workspace initialization');
        console.log('❌ Workspace document missing');
      }

      // Check required collections
      const requiredCollections = [
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

      console.log('🔍 Checking collections...');
      for (const collectionName of requiredCollections) {
        try {
          const collectionRef = collection(db, 'workspaces', userId, collectionName);
          const snapshot = await getDocs(query(collectionRef, limit(1)));
          
          debugInfo.collectionsStatus[collectionName] = {
            exists: !snapshot.empty,
            documentCount: snapshot.size
          };

          if (snapshot.empty) {
            console.log(`⚠️ Collection '${collectionName}' is empty`);
          } else {
            console.log(`✅ Collection '${collectionName}' has documents`);
          }
        } catch (error) {
          debugInfo.collectionsStatus[collectionName] = {
            exists: false,
            documentCount: 0
          };
          debugInfo.errors.push(`Failed to check collection '${collectionName}': ${error}`);
          console.log(`❌ Error checking collection '${collectionName}':`, error);
        }
      }

      // Analyze results and provide recommendations
      this.analyzeAndRecommend(debugInfo);

    } catch (error) {
      debugInfo.errors.push(`Debug check failed: ${error}`);
      console.error('❌ Debug check failed:', error);
    }

    return debugInfo;
  }

  /**
   * Analyze debug results and provide recommendations
   */
  private analyzeAndRecommend(debugInfo: DebugInfo): void {
    // Check workspace initialization
    if (!debugInfo.workspaceExists) {
      debugInfo.recommendations.push('Initialize workspace using WorkspaceInitializer');
      debugInfo.recommendations.push('Ensure user is properly authenticated');
    } else {
      // Check workspace structure
      if (!debugInfo.workspaceData?.activeAgents) {
        debugInfo.recommendations.push('Update workspace document with activeAgents field');
      }
      if (!debugInfo.workspaceData?.initialized) {
        debugInfo.recommendations.push('Mark workspace as initialized');
      }
    }

    // Check collections
    const emptyCollections = Object.entries(debugInfo.collectionsStatus)
      .filter(([_, status]) => !status.exists)
      .map(([name]) => name);

    if (emptyCollections.length > 0) {
      debugInfo.recommendations.push(`Initialize empty collections: ${emptyCollections.join(', ')}`);
    }

    // Check agent states
    const activeAgentCount = Object.values(debugInfo.agentStates).filter(Boolean).length;
    if (activeAgentCount === 0) {
      debugInfo.recommendations.push('Consider activating some AI agents to test functionality');
    }

    // Check for common issues
    if (debugInfo.errors.some(error => error.includes('permission'))) {
      debugInfo.recommendations.push('Check Firestore security rules');
      debugInfo.recommendations.push('Verify user authentication token');
    }

    if (debugInfo.errors.some(error => error.includes('index'))) {
      debugInfo.recommendations.push('Deploy Firestore indexes');
      debugInfo.recommendations.push('Wait for index creation to complete');
    }
  }

  /**
   * Print formatted debug report to console
   */
  public printDebugReport(debugInfo: DebugInfo): void {
    console.log('\n📊 AI Agents Debug Report');
    console.log('========================');
    
    console.log('\n🏗️ Workspace Status:');
    console.log(`  Exists: ${debugInfo.workspaceExists ? '✅' : '❌'}`);
    if (debugInfo.workspaceData) {
      console.log(`  Initialized: ${debugInfo.workspaceData.initialized ? '✅' : '❌'}`);
      console.log(`  Owner ID: ${debugInfo.workspaceData.ownerId || 'Not set'}`);
      console.log(`  Active Agents: ${Object.keys(debugInfo.agentStates).length}`);
    }

    console.log('\n📁 Collections Status:');
    Object.entries(debugInfo.collectionsStatus).forEach(([name, status]) => {
      const icon = status.exists ? '✅' : '⚠️';
      console.log(`  ${icon} ${name}: ${status.documentCount} documents`);
    });

    console.log('\n🤖 Agent States:');
    Object.entries(debugInfo.agentStates).forEach(([agentId, isActive]) => {
      const icon = isActive ? '🟢' : '🔴';
      console.log(`  ${icon} ${agentId}: ${isActive ? 'Active' : 'Inactive'}`);
    });

    if (debugInfo.errors.length > 0) {
      console.log('\n❌ Errors:');
      debugInfo.errors.forEach(error => console.log(`  • ${error}`));
    }

    if (debugInfo.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      debugInfo.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }

    console.log('\n========================\n');
  }

  /**
   * Quick health check - returns true if everything looks good
   */
  public async quickHealthCheck(db: Firestore, userId: string): Promise<boolean> {
    try {
      const debugInfo = await this.debugWorkspace(db, userId);
      return debugInfo.workspaceExists && 
             debugInfo.errors.length === 0 && 
             Object.keys(debugInfo.agentStates).length > 0;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Test Firestore connectivity
   */
  public async testFirestoreConnection(db: Firestore): Promise<boolean> {
    try {
      console.log('🔗 Testing Firestore connection...');
      
      // Try to read from a system collection
      const testRef = collection(db, 'test');
      await getDocs(query(testRef, limit(1)));
      
      console.log('✅ Firestore connection successful');
      return true;
    } catch (error) {
      console.error('❌ Firestore connection failed:', error);
      return false;
    }
  }
}

/**
 * Convenience function for quick debugging
 */
export async function debugAIAgents(db: Firestore, userId: string): Promise<void> {
  const debugInstance = AIAgentsDebugger.getInstance();
  
  console.log('🚀 Starting AI Agents Debug Check...\n');
  
  // Test connection first
  const connectionOk = await debugInstance.testFirestoreConnection(db);
  if (!connectionOk) {
    console.log('❌ Cannot proceed - Firestore connection failed');
    return;
  }

  // Run full debug check
  const debugInfo = await debugInstance.debugWorkspace(db, userId);
  debugInstance.printDebugReport(debugInfo);

  // Provide summary
  const isHealthy = await debugInstance.quickHealthCheck(db, userId);
  console.log(`🎯 Overall Status: ${isHealthy ? '✅ Healthy' : '⚠️ Needs Attention'}`);
}