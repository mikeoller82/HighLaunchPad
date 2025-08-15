'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth, getAdminDb } from '@/lib/firebase-admin';
import { AgentRegistry } from '@/lib/ai-agents/agent-registry';

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

// GET /api/ai-agents/[agentId] - Get specific agent details
export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const user = await authenticateUser(request);
    const { agentId } = params;

    const registry = AgentRegistry.getInstance();

    const agent = registry.getAgent(agentId);
    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Get detailed metrics and status using admin SDK
    const activitiesRef = db.collection('workspaces').doc(user.uid)
      .collection('agentActivities')
      .where('agentId', '==', agentId)
      .orderBy('timestamp', 'desc');

    const activitiesSnapshot = await activitiesRef.get();
    const activities = activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));

    // Calculate metrics from activities
    const totalExecutions = activities.length;
    const successfulExecutions = activities.filter((a: any) => a.status === 'success').length;
    const successRate = totalExecutions > 0 ? successfulExecutions / totalExecutions : 0;

    // Get the most recent activity (already sorted by timestamp desc)
    const lastActivity = activities[0]?.timestamp || new Date();

    // Calculate average execution time (if available in activity data)
    const activitiesWithDuration = activities.filter((a: any) => a.executionTime);
    const averageExecutionTime = activitiesWithDuration.length > 0 ?
      activitiesWithDuration.reduce((sum: number, a: any) => sum + (a.executionTime || 0), 0) / activitiesWithDuration.length :
      2500; // Default reasonable execution time

    const metrics = {
      agentId,
      tasksCompleted: successfulExecutions,
      successRate: Math.min(1, Math.max(0, successRate)),
      averageExecutionTime: averageExecutionTime,
      lastActivity: lastActivity,
      totalExecutions: totalExecutions
    };

    const context = agent.getContext();

    // Get recent activities (limit to 10 most recent)
    const recentActivities = activities.slice(0, 10).map(activity => ({
      ...activity,
      timestamp: activity.timestamp?.toDate ? activity.timestamp.toDate() : activity.timestamp
    }));

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        type: agent.type,
        name: agent.configuration.name,
        description: agent.configuration.description,
        status: agent.getStatus(),
        enabled: agent.configuration.enabled,
        capabilities: agent.capabilities,
        configuration: agent.configuration,
        metrics: metrics,
        context: {
          sessionId: context.sessionId,
          lastUpdated: context.lastUpdated,
          conversationHistoryCount: context.conversationHistory.length,
          availableActions: context.availableActions
        },
        recentActivities: recentActivities
      }
    });

  } catch (error) {
    console.error(`Error fetching agent ${params.agentId}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch agent'
      },
      { status: 500 }
    );
  }
}

// PUT /api/ai-agents/[agentId] - Update agent configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const user = await authenticateUser(request);
    const { agentId } = params;
    const body = await request.json();

    const registry = AgentRegistry.getInstance();
    const agent = registry.getAgent(agentId);

    if (!agent) {
      return NextResponse.json(
        { success: false, error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Update agent configuration
    await agent.updateConfiguration(body);

    // Save to Firestore
    const agentConfigRef = db.collection('workspaces').doc(user.uid)
      .collection('agentConfigs').doc(agentId);
    await agentConfigRef.set({
      ...body,
      lastUpdated: new Date(),
      updatedBy: user.uid
    }, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Agent configuration updated successfully',
      configuration: agent.configuration
    });

  } catch (error) {
    console.error(`Error updating agent ${params.agentId}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update agent'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/ai-agents/[agentId] - Stop and disable agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const user = await authenticateUser(request);
    const { agentId } = params;

    const registry = AgentRegistry.getInstance();

    // Stop the agent
    await registry.stopAgent(agentId);

    // Update workspace configuration
    const workspaceRef = db.collection('workspaces').doc(user.uid);
    await workspaceRef.update({
      [`activeAgents.${agentId}`]: false
    });

    return NextResponse.json({
      success: true,
      message: 'Agent stopped and disabled successfully'
    });

  } catch (error) {
    console.error(`Error stopping agent ${params.agentId}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to stop agent'
      },
      { status: 500 }
    );
  }
}