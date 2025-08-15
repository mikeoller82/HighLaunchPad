// Test script to verify workspace creation works
import { seedUserWorkspace, getAllTemplates, getAvailableTemplateIds } from './src/lib/workspace-seeder.ts';

async function testWorkspaceCreation() {
  try {
    console.log('Testing workspace creation...');
    
    // Test getting available templates
    console.log('Available templates:', getAvailableTemplateIds());
    console.log('Total templates:', getAllTemplates().length);
    
    // Test workspace creation with different templates
    const testUserId = 'test-user-123';
    const testWorkspaceId = 'test-workspace-' + Date.now();
    
    console.log(`Creating workspace "${testWorkspaceId}" for user "${testUserId}"`);
    
    const result = await seedUserWorkspace(testUserId, testWorkspaceId, 'saas');
    
    console.log('Workspace creation result:', result);
    console.log('✅ Workspace creation test passed!');
    
  } catch (error) {
    console.error('❌ Workspace creation test failed:', error);
    process.exit(1);
  }
}

testWorkspaceCreation();