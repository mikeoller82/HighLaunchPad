import { NextRequest, NextResponse } from 'next/server';
import { AdminTaskExecutionService } from '@/lib/ai-agents/admin-task-execution-service';
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
    const taskService = AdminTaskExecutionService.getInstance();
    const result = await taskService.executeTask(db, userId, taskId, 'data_integration', parameters, undefined);

    return NextResponse.json({
      success: true,
      result: result.result,
      executionTime: result.executionTime,
      agentId: 'data_integration',
      taskId
    });

  } catch (error) {
    console.error('Data Integration agent API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      agentId: 'data_integration'
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

    // Get data integration agent info
    const unifiedService = UnifiedAgentService.getInstance();
    const agentInfo = unifiedService.getAgentInfo('data_integration');

    return NextResponse.json({
      success: true,
      agent: agentInfo,
      availableTasks: [
        {
          id: 'sync_data',
          name: 'Sync Data',
          description: 'Synchronize data across all connected platforms',
          estimatedTime: '5-10 minutes',
          parameters: ['platforms', 'dataTypes']
        },
        {
          id: 'validate_data',
          name: 'Validate Data',
          description: 'Check data integrity and consistency',
          estimatedTime: '3-8 minutes',
          parameters: ['validationType', 'scope']
        },
        {
          id: 'integrate_apis',
          name: 'Integrate APIs',
          description: 'Connect new data sources and APIs',
          estimatedTime: '10-20 minutes',
          parameters: ['apiType', 'credentials', 'mappings']
        }
      ]
    });

  } catch (error) {
    console.error('Data Integration agent GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}