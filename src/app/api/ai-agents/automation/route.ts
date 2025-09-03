import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth, getAdminDb } from '@/lib/firebase-admin';
import { AutomationAgent } from '@/lib/ai-agents/automation-agent';

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

    // Create automation agent and execute task
    const automationAgent = new AutomationAgent();
    const result = await automationAgent.executeTask(db as any, userId, taskId, parameters);

    return NextResponse.json({
      success: true,
      result: result,
      agentId: 'automation',
      taskId
    });

  } catch (error) {
    console.error('Automation agent API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      agentId: 'automation'
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

    // Get automation agent info
    const automationAgent = new AutomationAgent();
    const agentInfo = automationAgent.getAgentInfo();

    return NextResponse.json({
      success: true,
      agent: agentInfo,
      availableTasks: [
        {
          id: 'execute_workflow',
          name: 'Execute Workflow',
          description: 'Run automated business processes',
          estimatedTime: '1-3 minutes',
          parameters: ['workflowName', 'parameters']
        },
        {
          id: 'optimize_processes',
          name: 'Optimize Processes',
          description: 'Analyze and improve workflow efficiency',
          estimatedTime: '10-15 minutes',
          parameters: ['processType']
        },
        {
          id: 'create_automation',
          name: 'Create Automation',
          description: 'Set up new automated workflows',
          estimatedTime: '5-12 minutes',
          parameters: ['type', 'triggerConditions', 'actions']
        }
      ]
    });

  } catch (error) {
    console.error('Automation agent GET error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}