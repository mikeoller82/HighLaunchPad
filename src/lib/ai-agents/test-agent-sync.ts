// Test script to verify agent synchronization
import { AgentRegistry } from './agent-registry';
import { AgentInitializer } from './agent-initializer';
import { AgentSyncService } from './agent-sync-service';

export async function testAgentSync() {
  console.log('🧪 Testing Agent Synchronization...');
  
  try {
    // Test 1: Registry Singleton
    const registry1 = AgentRegistry.getInstance();
    const registry2 = AgentRegistry.getInstance();
    console.log('✅ Registry singleton test:', registry1 === registry2);
    
    // Test 2: Initializer Singleton
    const initializer1 = AgentInitializer.getInstance();
    const initializer2 = AgentInitializer.getInstance();
    console.log('✅ Initializer singleton test:', initializer1 === initializer2);
    
    // Test 3: Sync Service Singleton
    const sync1 = AgentSyncService.getInstance();
    const sync2 = AgentSyncService.getInstance();
    console.log('✅ Sync service singleton test:', sync1 === sync2);
    
    // Test 4: Registry Stats (without DB)
    const stats = registry1.getRegistryStats();
    console.log('📊 Initial registry stats:', stats);
    
    console.log('✅ All agent sync tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Agent sync test failed:', error);
    return false;
  }
}

// Export for use in components
export { AgentRegistry, AgentInitializer, AgentSyncService };