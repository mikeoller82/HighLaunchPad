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

    // Use AdminTaskExecutionService for execution
    const taskService = AdminTaskExecutionService.getInstance();
    const result = await taskService.executeTask(db, userId, taskId, 'customer_interaction', parameters, undefined);

    return NextResponse.json({
      success: true,
      result: result.result,
      executionTime: result.executionTime,
      agentId: 'customer_interaction',
      taskId
    });

  } catch (error) {
    console.error('Customer Interaction agent API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      agentId: 'customer_interaction'
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

    // Get customer interaction agent info
    const unifiedService = UnifiedAgentService.getInstance();
    const agentInfo = unifiedService.getAgentInfo('customer_interaction');

    return NextResponse.json({
      success: true,
      agent: agentInfo,
      availableTasks: [
        {
          id: 'respond_to_inquiries',
          name: 'Respond to Inquiries',
          description: 'Handle customer questions and support requests',
          estimatedTime: '2-5 minutes',
          parameters: ['type', 'priority']
        },
        {
          id: 'escalate_issues',
          name: 'Escalate Issues',
          description: 'Route complex issues to appropriate team members',
          estimatedTime: '1-2 minutes',
          parameters: ['type', 'urgency']
        },
        {
          id: 'analyze_sentiment',
          name: 'Analyze Sentiment',
          description: 'Assess customer satisfaction and sentiment',
          estimatedTime: '3-7 minutes',
          parameters: ['type', 'timeframe']
        }
      ]
    });

  } catch (error) {
    console.error('Customer Interaction agent GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}