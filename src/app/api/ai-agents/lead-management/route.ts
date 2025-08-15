import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth, getAdminDb } from '@/lib/firebase-admin';
import { createLeadManagementAgent } from '@/lib/ai-agents/lead-management-agent';
import { EventType } from '@/lib/ai-agents/types';

async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ') && !process.env.NODE_ENV?.includes('development')) {
    throw new Error('No valid authorization header');
  }

  if (process.env.NODE_ENV?.includes('development')) {
    // For development, allow requests without auth
    return { uid: 'dev-user' };
  }

  const token = authHeader!.split('Bearer ')[1];
  const auth = getFirebaseAuth();
  const decodedToken = await auth.verifyIdToken(token);
  return decodedToken;
}

// POST /api/ai-agents/lead-management - Process lead events
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    const body = await request.json();

    const { action, leadData, eventType, ...requestData } = body;

    // Create lead management agent instance
    const leadAgent = createLeadManagementAgent({
      id: `lead-agent-${user.uid}`,
      enabled: true
    });

    const db = getAdminDb();

    switch (action) {
      case 'score_lead':
        if (!leadData) {
          return NextResponse.json(
            { success: false, error: 'Lead data is required' },
            { status: 400 }
          );
        }

        // Score the lead
        const leadScore = await leadAgent.scoreLead(leadData);
        const qualification = leadAgent.qualifyLead(leadScore.total);

        // Save lead scoring to Firestore
        const leadRef = db.collection('workspaces').doc(user.uid)
          .collection('leads').doc(leadData.id || `lead_${Date.now()}`);

        await leadRef.set({
          ...leadData,
          score: leadScore,
          qualification: qualification,
          lastScoredAt: new Date(),
          scoredBy: 'lead_management_agent'
        }, { merge: true });

        // Log activity
        const activityRef = db.collection('workspaces').doc(user.uid)
          .collection('agentActivities').doc();

        await activityRef.set({
          agentId: 'lead_management',
          agentName: 'Lead Management Agent',
          activity: `Scored lead: ${leadData.name || leadData.email || 'Unknown'}`,
          details: `Score: ${leadScore.total}/100, Qualification: ${qualification}`,
          status: 'success',
          timestamp: new Date(),
          leadId: leadData.id,
          leadScore: leadScore.total,
          qualification: qualification
        });

        return NextResponse.json({
          success: true,
          leadScore: leadScore,
          qualification: qualification,
          message: 'Lead scored successfully'
        });

      case 'process_event':
        if (!eventType || !leadData) {
          return NextResponse.json(
            { success: false, error: 'Event type and lead data are required' },
            { status: 400 }
          );
        }

        // Create event
        const event = {
          id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          type: eventType as EventType,
          timestamp: new Date(),
          source: 'api_request',
          data: leadData,
          priority: requestData.priority || 5,
          customerId: leadData.customerId,
          leadId: leadData.id
        };

        // Process event with agent
        const result = await leadAgent.processEvent(event);

        // Save event processing result to Firestore
        const eventRef = db.collection('workspaces').doc(user.uid)
          .collection('leadEvents').doc();

        await eventRef.set({
          eventId: event.id,
          eventType: eventType,
          leadId: leadData.id,
          processingResult: result,
          timestamp: new Date(),
          processedBy: 'lead_management_agent'
        });

        // Log activity
        const eventActivityRef = db.collection('workspaces').doc(user.uid)
          .collection('agentActivities').doc();

        await eventActivityRef.set({
          agentId: 'lead_management',
          agentName: 'Lead Management Agent',
          activity: `Processed ${eventType} event`,
          details: `Success: ${result.success}, Actions: ${result.actions?.length || 0}, Confidence: ${result.confidence}`,
          status: result.success ? 'success' : 'error',
          timestamp: new Date(),
          leadId: leadData.id,
          eventType: eventType,
          confidence: result.confidence
        });

        return NextResponse.json({
          success: true,
          result: result,
          eventId: event.id,
          message: 'Event processed successfully'
        });

      case 'assign_lead':
        if (!leadData) {
          return NextResponse.json(
            { success: false, error: 'Lead data is required' },
            { status: 400 }
          );
        }

        // Assign lead
        const assignedUserId = await leadAgent.assignLead(leadData);

        if (assignedUserId) {
          // Update lead in Firestore
          const assignLeadRef = db.collection('workspaces').doc(user.uid)
            .collection('leads').doc(leadData.id || `lead_${Date.now()}`);

          await assignLeadRef.set({
            ...leadData,
            assignedTo: assignedUserId,
            assignedAt: new Date(),
            assignedBy: 'lead_management_agent'
          }, { merge: true });

          // Log activity
          const assignActivityRef = db.collection('workspaces').doc(user.uid)
            .collection('agentActivities').doc();

          await assignActivityRef.set({
            agentId: 'lead_management',
            agentName: 'Lead Management Agent',
            activity: `Assigned lead to ${assignedUserId}`,
            details: `Lead: ${leadData.name || leadData.email || 'Unknown'}`,
            status: 'success',
            timestamp: new Date(),
            leadId: leadData.id,
            assignedTo: assignedUserId
          });
        }

        return NextResponse.json({
          success: true,
          assignedTo: assignedUserId,
          message: assignedUserId ? 'Lead assigned successfully' : 'No available users for assignment'
        });

      case 'get_performance':
        const performanceMetrics = await leadAgent.getPerformanceMetrics();

        return NextResponse.json({
          success: true,
          metrics: performanceMetrics,
          agentId: leadAgent.id
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: score_lead, process_event, assign_lead, or get_performance' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in lead management agent:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process lead management request'
      },
      { status: 500 }
    );
  }
}

// GET /api/ai-agents/lead-management - Get lead management status and metrics
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const db = getAdminDb();

    // Get recent lead activities
    const activitiesRef = db.collection('workspaces').doc(user.uid)
      .collection('agentActivities')
      .where('agentId', '==', 'lead_management')
      .orderBy('timestamp', 'desc')
      .limit(limit);

    const activitiesSnapshot = await activitiesRef.get();
    const recentActivities = activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));

    // Get recent leads
    const leadsRef = db.collection('workspaces').doc(user.uid)
      .collection('leads')
      .orderBy('lastScoredAt', 'desc')
      .limit(limit);

    const leadsSnapshot = await leadsRef.get();
    const recentLeads = leadsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lastScoredAt: doc.data().lastScoredAt?.toDate()
    }));

    // Calculate stats with proper typing
    const totalLeads = recentLeads.length;
    const scoredLeads = recentLeads.filter((lead: any) => lead.score).length;
    const qualifiedLeads = recentLeads.filter((lead: any) =>
      lead.qualification === 'SALES_QUALIFIED' || lead.qualification === 'MARKETING_QUALIFIED'
    ).length;
    const assignedLeads = recentLeads.filter((lead: any) => lead.assignedTo).length;

    return NextResponse.json({
      success: true,
      agent: {
        id: 'lead_management',
        name: 'Lead Management Agent',
        status: 'active'
      },
      recentActivities: recentActivities,
      recentLeads: recentLeads,
      stats: {
        totalLeads: totalLeads,
        scoredLeads: scoredLeads,
        qualifiedLeads: qualifiedLeads,
        assignedLeads: assignedLeads,
        qualificationRate: totalLeads > 0 ? (qualifiedLeads / totalLeads * 100).toFixed(1) : '0',
        assignmentRate: totalLeads > 0 ? (assignedLeads / totalLeads * 100).toFixed(1) : '0'
      }
    });

  } catch (error) {
    console.error('Error fetching lead management status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch lead management status'
      },
      { status: 500 }
    );
  }
}