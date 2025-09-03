import { NextRequest, NextResponse } from 'next/server';
import { TaskExecutionService } from '@/lib/ai-agents/task-execution-service';
import { getFirebaseAuth, getAdminDb } from '@/lib/firebase-admin';
import { UnifiedAgentService } from '@/lib/ai-agents/unified-agent-service';

const auth = getFirebaseAuth();
const db = getAdminDb();

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let decodedToken;
    
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
    }

    const userId = decodedToken.uid;
    const { taskId, parameters } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Use TaskExecutionService for execution
    const taskService = TaskExecutionService.getInstance();
    const result = await taskService.executeTask(db, userId, taskId, 'journey_orchestration', undefined, parameters);

    return NextResponse.json({
      success: true,
      result: result.result,
      executionTime: result.executionTime,
      agentId: 'journey_orchestration',
      taskId
    });

  } catch (error) {
    console.error('Journey Orchestration agent API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      agentId: 'journey_orchestration'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let decodedToken;
    
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
    }

    const userId = decodedToken.uid;

    // Get journey orchestration agent info
    const unifiedService = UnifiedAgentService.getInstance();
    const agentInfo = unifiedService.getAgentInfo('journey_orchestration');

    return NextResponse.json({
      success: true,
      agent: agentInfo,
      availableTasks: [
        {
          id: 'map_customer_journey',
          name: 'Map Customer Journey',
          description: 'Analyze and optimize customer touchpoints',
          estimatedTime: '15-25 minutes',
          parameters: ['journeyType', 'customerSegment']
        },
        {
          id: 'trigger_touchpoints',
          name: 'Trigger Touchpoints',
          description: 'Execute personalized customer interactions',
          estimatedTime: '2-5 minutes',
          parameters: ['touchpointType', 'customerId']
        },
        {
          id: 'optimize_experience',
          name: 'Optimize Experience',
          description: 'Improve customer journey effectiveness',
          estimatedTime: '10-20 minutes',
          parameters: ['optimizationType', 'journeyStage']
        }
      ]
    });

  } catch (error) {
    console.error('Journey Orchestration agent GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}