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
    const result = await taskService.executeTask(db, userId, taskId, 'conversational_ai', parameters, undefined);

    return NextResponse.json({
      success: true,
      result: result.result,
      executionTime: result.executionTime,
      agentId: 'conversational_ai',
      taskId
    });

  } catch (error) {
    console.error('Conversational AI agent API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      agentId: 'conversational_ai'
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

    // Get conversational AI agent info
    const unifiedService = UnifiedAgentService.getInstance();
    const agentInfo = unifiedService.getAgentInfo('conversational_ai');

    return NextResponse.json({
      success: true,
      agent: agentInfo,
      availableTasks: [
        {
          id: 'train_chatbot',
          name: 'Train Chatbot',
          description: 'Improve conversational AI responses',
          estimatedTime: '10-20 minutes',
          parameters: ['trainingData', 'domain']
        },
        {
          id: 'handle_conversations',
          name: 'Handle Conversations',
          description: 'Manage automated customer conversations',
          estimatedTime: '2-5 minutes',
          parameters: ['conversationType', 'context']
        },
        {
          id: 'analyze_intent',
          name: 'Analyze Intent',
          description: 'Understand customer intent and context',
          estimatedTime: '3-8 minutes',
          parameters: ['message', 'context']
        }
      ]
    });

  } catch (error) {
    console.error('Conversational AI agent GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}