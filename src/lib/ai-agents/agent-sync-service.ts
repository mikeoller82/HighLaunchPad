import { AgentRegistry } from './agent-registry';
import { AgentInitializer } from './agent-initializer';
import { Firestore, doc, onSnapshot } from 'firebase/firestore';

export class AgentSyncService {
  private static instance: AgentSyncService;
  private unsubscribeCallbacks: (() => void)[] = [];
  private isListening = false;

  private constructor() {}

  public static getInstance(): AgentSyncService {
    if (!AgentSyncService.instance) {
      AgentSyncService.instance = new AgentSyncService();
    }
    return AgentSyncService.instance;
  }

  public async startSyncService(db: Firestore, userId: string): Promise<void> {
    if (this.isListening) {
      console.log('Agent sync service already running');
      return;
    }

    try {
      console.log('🔄 Starting Agent Sync Service...');
      
      // Initialize agents first
      const initializer = AgentInitializer.getInstance();
      if (!initializer.getInitializationStatus()) {
        await initializer.initializeAllAgents(db, userId);
      }

      // Set up real-time listener for workspace changes
      const workspaceRef = doc(db, 'workspaces', userId);
      
      const unsubscribe = onSnapshot(workspaceRef, async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const activeAgents = data.activeAgents || {};
          
          console.log('🔄 Workspace agents updated:', activeAgents);
          
          // Sync agent states
          await this.syncAgentStates(db, userId, activeAgents);
        }
      }, (error) => {
        console.error('Error listening to workspace changes:', error);
      });

      this.unsubscribeCallbacks.push(unsubscribe);
      this.isListening = true;
      
      console.log('✅ Agent Sync Service started');
    } catch (error) {
      console.error('❌ Failed to start Agent Sync Service:', error);
      throw error;
    }
  }

  private async syncAgentStates(db: Firestore, userId: string, activeAgents: Record<string, boolean>): Promise<void> {
    try {
      const registry = AgentRegistry.getInstance();
      
      // Update registry's active agents cache
      await registry.loadActiveAgents(db, userId);
      
      // Get all registered agents
      const allAgents = registry.getAllAgents();
      
      // Sync each agent's state
      for (const agent of allAgents) {
        const shouldBeActive = activeAgents[agent.id] === true;
        const currentStatus = agent.getStatus();
        const isCurrentlyActive = currentStatus !== 'disabled' && currentStatus !== 'error';
        
        if (shouldBeActive && !isCurrentlyActive) {
          // Start the agent
          await agent.start();
          console.log(`✅ Started agent: ${agent.id}`);
        } else if (!shouldBeActive && isCurrentlyActive) {
          // Stop the agent
          await agent.stop();
          console.log(`⏸️ Stopped agent: ${agent.id}`);
        }
      }
      
      console.log('🔄 Agent states synchronized');
    } catch (error) {
      console.error('❌ Failed to sync agent states:', error);
    }
  }

  public async forceSync(db: Firestore, userId: string): Promise<void> {
    try {
      console.log('🔄 Force syncing agents...');
      
      const initializer = AgentInitializer.getInstance();
      await initializer.refreshAgentStates(db, userId);
      
      console.log('✅ Force sync completed');
    } catch (error) {
      console.error('❌ Force sync failed:', error);
      throw error;
    }
  }

  public getAgentStats(): any {
    const registry = AgentRegistry.getInstance();
    return registry.getRegistryStats();
  }

  public stopSyncService(): void {
    this.unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    this.unsubscribeCallbacks = [];
    this.isListening = false;
    console.log('⏹️ Agent Sync Service stopped');
  }

  public isRunning(): boolean {
    return this.isListening;
  }
}