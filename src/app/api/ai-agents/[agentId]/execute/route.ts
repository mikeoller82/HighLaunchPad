import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth, getAdminDb } from '@/lib/firebase-admin';
import { AgentRegistry } from '@/lib/ai-agents/agent-registry';
import { EventType, ActionType } from '@/lib/ai-agents/types';

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

// POST /api/ai-agents/[agentId]/execute - Execute agent with specific event or task
export async function POST(
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

    if (!agent.configuration.enabled) {
      return NextResponse.json(
        { success: false, error: 'Agent is disabled' },
        { status: 400 }
      );
    }

    const { eventType, eventData, action } = body;

    let result;

    if (action === 'test') {
      // Generate test activity directly
      const testActivity = {
        agentId: agentId,
        agentName: agent.configuration.name,
        activity: `Test execution for ${agent.configuration.name}`,
        details: 'Agent test execution completed successfully',
        status: 'success',
        timestamp: new Date(),
        testExecution: true
      };

      // Save test activity to Firestore
      const activityRef = db.collection('workspaces').doc(user.uid)
        .collection('agentActivities').doc();
      
      await activityRef.set(testActivity);

      result = {
        testExecuted: true,
        activity: testActivity,
        message: `Test execution completed for agent ${agentId}`
      };
    } else if (eventType && eventData) {
      // Create and process a specific event
      const event = {
        id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type: eventType as EventType,
        timestamp: new Date(),
        source: 'api_request',
        data: eventData,
        priority: eventData.priority || 5,
        customerId: eventData.customerId,
        leadId: eventData.leadId,
        dealId: eventData.dealId
      };

      // Process the event with the agent
      await agent.perceive([event]);

      // Create decision context
      const decisionContext = {
        events: [event],
        currentContext: agent.getContext(),
        availableActions: agent.capabilities.flatMap(cap => cap.supportedActionTypes),
        businessConstraints: {}
      };

      // Make decisions
      const actions = await agent.decide(decisionContext);

      // Execute actions
      const executionResults = await agent.execute(actions);

      // Log activity to Firestore
      const activityRef = db.collection('workspaces').doc(user.uid)
        .collection('agentActivities').doc();
      
      await activityRef.set({
        agentId: agentId,
        agentName: agent.configuration.name,
        activity: `Processed ${eventType} event`,
        details: `Generated ${actions.length} actions, executed ${executionResults.length} results`,
        status: executionResults.every(r => r.success) ? 'success' : 'error',
        timestamp: new Date(),
        eventData: eventData,
        actionsGenerated: actions.length,
        resultsExecuted: executionResults.length,
        successfulResults: executionResults.filter(r => r.success).length
      });

      result = {
        eventProcessed: event,
        actionsGenerated: actions,
        executionResults: executionResults,
        success: executionResults.every(r => r.success)
      };
    } else {
      return NextResponse.json(
        { success: false, error: 'Either action=test or eventType+eventData required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      agentId: agentId,
      result: result,
      timestamp: new Date()
    });

  } catch (error) {
    console.error(`Error executing agent ${params.agentId}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to execute agent' 
      },
      { status: 500 }
    );
  }
}

// GET /api/ai-agents/[agentId]/execute - Get execution history
export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const user = await authenticateUser(request);
    const { agentId } = params;

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Get execution history from Firestore
    const activitiesRef = db.collection('workspaces').doc(user.uid)
      .collection('agentActivities')
      .where('agentId', '==', agentId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset);
    
    const activitiesSnapshot = await activitiesRef.get();
    const activities = activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));

    // Get total count
    const totalCountRef = db.collection('workspaces').doc(user.uid)
      .collection('agentActivities')
      .where('agentId', '==', agentId);
    
    const totalSnapshot = await totalCountRef.count().get();
    const totalCount = totalSnapshot.data().count;

    return NextResponse.json({
      success: true,
      agentId: agentId,
      activities: activities,
      pagination: {
        limit: limit,
        offset: offset,
        total: totalCount,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error(`Error fetching execution history for agent ${params.agentId}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch execution history' 
      },
      { status: 500 }
    );
  }
}