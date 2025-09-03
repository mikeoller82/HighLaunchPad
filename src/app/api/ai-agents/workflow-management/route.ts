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
    const result = await taskService.executeTask(db, userId, taskId, 'workflow_management', undefined, parameters);

    return NextResponse.json({
      success: true,
      result: result.result,
      executionTime: result.executionTime,
      agentId: 'workflow_management',
      taskId
    });

  } catch (error) {
    console.error('Workflow Management agent API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      agentId: 'workflow_management'
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

    // Get workflow management agent info
    const unifiedService = UnifiedAgentService.getInstance();
    const agentInfo = unifiedService.getAgentInfo('workflow_management');

    return NextResponse.json({
      success: true,
      agent: agentInfo,
      availableTasks: [
        {
          id: 'manage_tasks',
          name: 'Manage Tasks',
          description: 'Organize and prioritize workflow tasks',
          estimatedTime: '3-7 minutes',
          parameters: ['taskType', 'priority']
        },
        {
          id: 'automate_processes',
          name: 'Automate Processes',
          description: 'Set up automated business workflows',
          estimatedTime: '8-15 minutes',
          parameters: ['processType', 'triggerConditions']
        },
        {
          id: 'monitor_workflows',
          name: 'Monitor Workflows',
          description: 'Track workflow performance and issues',
          estimatedTime: '5-10 minutes',
          parameters: ['monitoringType', 'timeframe']
        }
      ]
    });

  } catch (error) {
    console.error('Workflow Management agent GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}