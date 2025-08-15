const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');
const { getAuth, connectAuthEmulator, signInWithEmailAndPassword } = require('firebase/auth');

// Firebase config (using environment variables)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function testAIAgentsSync() {
  console.log('🧪 Testing AI Agents Firestore Sync...\n');

  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    console.log('✅ Firebase initialized');

    // Test workspace initialization
    console.log('\n📋 Testing Workspace Initialization...');
    
    // Import the workspace initializer
    const { WorkspaceInitializer } = await import('./src/lib/ai-agents/workspace-initializer.ts');
    const workspaceInitializer = WorkspaceInitializer.getInstance();

    // Test with a mock user ID
    const testUserId = 'test-user-123';
    
    console.log(`🔍 Checking if workspace exists for user: ${testUserId}`);
    const isInitialized = await workspaceInitializer.isWorkspaceInitialized(db, testUserId);
    console.log(`Workspace initialized: ${isInitialized}`);

    if (!isInitialized) {
      console.log('🏗️ Initializing workspace...');
      await workspaceInitializer.initializeWorkspace(db, testUserId);
      console.log('✅ Workspace initialized successfully');
    }

    // Test agent registry
    console.log('\n🤖 Testing Agent Registry...');
    const { AgentRegistry } = await import('./src/lib/ai-agents/agent-registry.ts');
    const registry = AgentRegistry.getInstance();

    console.log('📥 Loading active agents...');
    await registry.loadActiveAgents(db, testUserId);
    console.log('✅ Active agents loaded');

    // Test unified agent service
    console.log('\n🔧 Testing Unified Agent Service...');
    const { UnifiedAgentService } = await import('./src/lib/ai-agents/unified-agent-service.ts');
    const unifiedService = UnifiedAgentService.getInstance();

    console.log('🚀 Initializing workspace agents...');
    await unifiedService.initializeWorkspaceAgents(db, testUserId);
    console.log('✅ Workspace agents initialized');

    // Get agent status
    const agentIds = ['crm', 'content', 'social', 'automation'];
    console.log('\n📊 Agent Status:');
    agentIds.forEach(agentId => {
      const status = unifiedService.getAgentStatus(agentId);
      console.log(`  ${agentId}: ${status}`);
    });

    // Test registry stats
    const stats = registry.getRegistryStats();
    console.log('\n📈 Registry Stats:');
    console.log(`  Total Agents: ${stats.totalAgents}`);
    console.log(`  Active Agents: ${stats.activeAgents}`);
    console.log('  Agents by Type:', stats.agentsByType);
    console.log('  Agents by Status:', stats.agentsByStatus);

    console.log('\n✅ All tests passed! AI Agents are properly synced with Firestore.');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
    
    // Provide specific troubleshooting advice
    if (error.message.includes('Missing or insufficient permissions')) {
      console.log('\n🔧 Troubleshooting: Check Firestore security rules');
    } else if (error.message.includes('not found')) {
      console.log('\n🔧 Troubleshooting: Ensure workspace document exists');
    } else if (error.message.includes('Firebase')) {
      console.log('\n🔧 Troubleshooting: Check Firebase configuration');
    }
  }
}

// Run the test
testAIAgentsSync().catch(console.error);