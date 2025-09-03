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
    const result = await taskService.executeTask(db, userId, taskId, 'sales_pipeline', parameters, undefined);

    return NextResponse.json({
      success: true,
      result: result.result,
      executionTime: result.executionTime,
      agentId: 'sales_pipeline',
      taskId
    });

  } catch (error) {
    console.error('Sales Pipeline agent API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      agentId: 'sales_pipeline'
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

    // Get sales pipeline agent info
    const unifiedService = UnifiedAgentService.getInstance();
    const agentInfo = unifiedService.getAgentInfo('sales_pipeline');

    return NextResponse.json({
      success: true,
      agent: agentInfo,
      availableTasks: [
        {
          id: 'track_deals',
          name: 'Track Deals',
          description: 'Monitor deal progression and identify risks',
          estimatedTime: '3-8 minutes',
          parameters: ['pipelineStage', 'timeframe']
        },
        {
          id: 'forecast_revenue',
          name: 'Forecast Revenue',
          description: 'Predict sales performance and revenue',
          estimatedTime: '10-15 minutes',
          parameters: ['period', 'pipelineStage']
        },
        {
          id: 'update_pipeline',
          name: 'Update Pipeline',
          description: 'Refresh deal stages and probabilities',
          estimatedTime: '2-5 minutes',
          parameters: ['updateType']
        }
      ]
    });

  } catch (error) {
    console.error('Sales Pipeline agent GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}