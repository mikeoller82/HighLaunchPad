'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth, getAdminDb } from '@/lib/firebase-admin';
import { AgentRegistry } from '@/lib/ai-agents/agent-registry';
import { AgentInitializer } from '@/lib/ai-agents/agent-initializer';
import { UnifiedAgentService } from '@/lib/ai-agents/unified-agent-service';

const auth = getFirebaseAuth();
const db = getAdminDb();

async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No valid authorization header');
  }

  const token = authHeader.split('Bearer ')[1];
  const decodedToken = await auth.verifyIdToken(token);
  return decodedToken;
}

// GET /api/ai-agents - List all agents and their status
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    const registry = AgentRegistry.getInstance();
    const unifiedService = UnifiedAgentService.getInstance();

    // Load active agents for the user
    await registry.loadActiveAgents(db as any, user.uid);

    // Get all agents with their status
    const agents = registry.getAllAgents();
    const agentData = await Promise.all(
      agents.map(async (agent) => {
        const metrics = await unifiedService.getAgentMetrics(db as any, user.uid, agent.id);
        return {
          id: agent.id,
          type: agent.type,
          name: agent.configuration.name,
          description: agent.configuration.description,
          status: agent.getStatus(),
          enabled: agent.configuration.enabled,
          capabilities: agent.capabilities,
          metrics: metrics,
          lastActivity: metrics.lastActivity
        };
      })
    );

    return NextResponse.json({
      success: true,
      agents: agentData,
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.configuration.enabled).length
    });

  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch agents'
      },
      { status: 500 }
    );
  }
}

// POST /api/ai-agents - Initialize or configure agents
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    const body = await request.json();
    const { action, agentId, configuration } = body;

    const registry = AgentRegistry.getInstance();
    const initializer = AgentInitializer.getInstance();

    switch (action) {
      case 'initialize':
        // Initialize all agents for the user
        await initializer.initializeAllAgents(db as any, user.uid);
        return NextResponse.json({
          success: true,
          message: 'All agents initialized successfully'
        });

      case 'configure':
        if (!agentId || !configuration) {
          return NextResponse.json(
            { success: false, error: 'Agent ID and configuration required' },
            { status: 400 }
          );
        }

        const agent = registry.getAgent(agentId);
        if (!agent) {
          return NextResponse.json(
            { success: false, error: 'Agent not found' },
            { status: 404 }
          );
        }

        await agent.updateConfiguration(configuration);

        // Save configuration to Firestore
        const agentConfigRef = db.collection('workspaces').doc(user.uid)
          .collection('agentConfigs').doc(agentId);
        await agentConfigRef.set({
          ...configuration,
          lastUpdated: new Date(),
          updatedBy: user.uid
        }, { merge: true });

        return NextResponse.json({
          success: true,
          message: 'Agent configuration updated successfully'
        });

      case 'toggle':
        if (!agentId) {
          return NextResponse.json(
            { success: false, error: 'Agent ID required' },
            { status: 400 }
          );
        }

        const targetAgent = registry.getAgent(agentId);
        if (!targetAgent) {
          return NextResponse.json(
            { success: false, error: 'Agent not found' },
            { status: 404 }
          );
        }

        const newEnabledState = !targetAgent.configuration.enabled;

        if (newEnabledState) {
          await registry.startAgent(agentId);
        } else {
          await registry.stopAgent(agentId);
        }

        // Update workspace configuration
        const workspaceRef = db.collection('workspaces').doc(user.uid);
        await workspaceRef.update({
          [`activeAgents.${agentId}`]: newEnabledState
        });

        return NextResponse.json({
          success: true,
          message: `Agent ${newEnabledState ? 'enabled' : 'disabled'} successfully`,
          enabled: newEnabledState
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in agents POST:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process request'
      },
      { status: 500 }
    );
  }
}