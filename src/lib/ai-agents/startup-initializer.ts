import { AgentInitializer } from './agent-initializer';
import { AgentActivityMonitor } from './agent-activity-monitor';
import { AgentOrchestrator } from './orchestrator';
import { Firestore } from 'firebase/firestore';

export class StartupInitializer {
  private static instance: StartupInitializer;
  private initialized = false;

  private constructor() {}

  public static getInstance(): StartupInitializer {
    if (!StartupInitializer.instance) {
      StartupInitializer.instance = new StartupInitializer();
    }
    return StartupInitializer.instance;
  }

  public async initializeApplication(db: Firestore, userId: string): Promise<void> {
    if (this.initialized) {
      console.log('🔄 Application already initialized');
      return;
    }

    try {
      console.log('🚀 Starting application initialization...');

      // Step 1: Initialize all AI agents
      const initializer = AgentInitializer.getInstance();
      await initializer.initializeAllAgents(db, userId);

      // Step 2: Start activity monitoring
      const monitor = AgentActivityMonitor.getInstance();
      monitor.startMonitoring(db, userId);

      // Step 3: Start orchestrator (it's a singleton, so this just ensures it's ready)
      const orchestrator = AgentOrchestrator.getInstance();
      console.log('🎯 Orchestrator ready');

      // Step 4: Generate some initial activity to show agents are working
      await this.generateInitialActivity(db, userId);

      this.initialized = true;
      console.log('✅ Application initialization complete!');

    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      throw error;
    }
  }

  private async generateInitialActivity(db: Firestore, userId: string): Promise<void> {
    try {
      const monitor = AgentActivityMonitor.getInstance();
      
      // Generate initial activities for a few agents to show they're working
      const agentIds = ['crm', 'content', 'social', 'automation'];
      
      for (const agentId of agentIds) {
        // Small delay between each agent activity
        setTimeout(async () => {
          try {
            await monitor.forceGenerateActivity(agentId, db, userId);
          } catch (error) {
            console.error(`Failed to generate initial activity for ${agentId}:`, error);
          }
        }, Math.random() * 5000); // Random delay up to 5 seconds
      }

      console.log('🎬 Initial agent activities scheduled');
    } catch (error) {
      console.error('Failed to generate initial activities:', error);
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public reset(): void {
    this.initialized = false;
  }
}

// Auto-initialize when imported (for convenience)
export const autoInitialize = async (db: Firestore, userId: string) => {
  const startup = StartupInitializer.getInstance();
  if (!startup.isInitialized()) {
    await startup.initializeApplication(db, userId);
  }
};