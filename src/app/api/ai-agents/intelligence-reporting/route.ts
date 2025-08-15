import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth, getAdminDb } from '@/lib/firebase-admin';
import { createIntelligenceReportingAgent } from '@/lib/ai-agents/intelligence-reporting-agent';
import { EventType } from '@/lib/ai-agents/types';

const auth = getFirebaseAuth();
const db = getAdminDb();

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
  const decodedToken = await auth.verifyIdToken(token);
  return decodedToken;
}

// POST /api/ai-agents/intelligence-reporting - Generate reports and insights
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    const body = await request.json();

    const { action, reportType, timeframe, metrics, ...requestData } = body;

    // Create intelligence reporting agent instance
    const reportingAgent = createIntelligenceReportingAgent(`reporting-agent-${user.uid}`);

    switch (action) {
      case 'generate_report':
        const reportParams = {
          reportType: reportType || 'performance_analytics',
          timeframe: timeframe || 'last_7_days',
          metrics: metrics || ['conversion_rate', 'lead_quality', 'pipeline_velocity']
        };

        // Create a data updated event to trigger report generation
        const event = {
          id: `report_request_${Date.now()}`,
          type: EventType.DATA_UPDATED,
          timestamp: new Date(),
          source: 'api_request',
          data: { reportRequest: reportParams },
          priority: 4
        };

        // Process the event
        await reportingAgent.perceive([event]);

        // Make decisions
        const context = {
          events: [event],
          currentContext: reportingAgent.getContext(),
          availableActions: reportingAgent.capabilities.flatMap(cap => cap.supportedActionTypes),
          businessConstraints: {}
        };

        const actions = await reportingAgent.decide(context);
        const results = await reportingAgent.execute(actions);

        // Extract the generated report from results
        const reportResult = results.find(r => r.success && r.result?.reportId);
        
        if (reportResult) {
          // Save report to Firestore
          const reportRef = db.collection('workspaces').doc(user.uid)
            .collection('intelligenceReports').doc();
          
          await reportRef.set({
            ...reportResult.result,
            createdAt: new Date(),
            createdBy: user.uid,
            agentId: 'intelligence_reporting'
          });

          // Log activity
          const activityRef = db.collection('workspaces').doc(user.uid)
            .collection('agentActivities').doc();
          
          await activityRef.set({
            agentId: 'intelligence_reporting',
            agentName: 'Intelligence & Reporting Agent',
            activity: `Generated ${reportParams.reportType} report`,
            details: `Timeframe: ${reportParams.timeframe}, Metrics: ${reportParams.metrics.join(', ')}`,
            status: 'success',
            timestamp: new Date(),
            reportId: reportRef.id,
            reportType: reportParams.reportType
          });

          return NextResponse.json({
            success: true,
            report: reportResult.result,
            reportId: reportRef.id,
            message: 'Report generated successfully'
          });
        } else {
          return NextResponse.json({
            success: false,
            error: 'Failed to generate report',
            results: results
          }, { status: 500 });
        }

      case 'get_insights':
        // Get recent insights from agent context
        const agentContext = reportingAgent.getContext();
        const recentReports = agentContext.conversationHistory
          .filter(h => h.type === 'report_generated')
          .slice(-5)
          .map(h => h.data);

        return NextResponse.json({
          success: true,
          insights: recentReports,
          agentId: reportingAgent.id
        });

      case 'analyze_metrics':
        if (!requestData.metricsData) {
          return NextResponse.json(
            { success: false, error: 'Metrics data is required' },
            { status: 400 }
          );
        }

        // Create analysis event
        const analysisEvent = {
          id: `analysis_${Date.now()}`,
          type: EventType.DATA_UPDATED,
          timestamp: new Date(),
          source: 'api_request',
          data: { metricsData: requestData.metricsData, analysisType: 'custom' },
          priority: 5
        };

        await reportingAgent.perceive([analysisEvent]);

        return NextResponse.json({
          success: true,
          message: 'Metrics analysis initiated',
          eventId: analysisEvent.id
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: generate_report, get_insights, or analyze_metrics' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in intelligence reporting agent:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process intelligence reporting request' 
      },
      { status: 500 }
    );
  }
}

// GET /api/ai-agents/intelligence-reporting - Get reporting status and history
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // Get recent reports
    const reportsRef = db.collection('workspaces').doc(user.uid)
      .collection('intelligenceReports')
      .orderBy('createdAt', 'desc')
      .limit(limit);
    
    const reportsSnapshot = await reportsRef.get();
    const recentReports = reportsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }));

    // Get agent activities
    const activitiesRef = db.collection('workspaces').doc(user.uid)
      .collection('agentActivities')
      .where('agentId', '==', 'intelligence_reporting')
      .orderBy('timestamp', 'desc')
      .limit(5);
    
    const activitiesSnapshot = await activitiesRef.get();
    const recentActivities = activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));

    // Calculate stats
    const totalReports = recentReports.length;
    const reportTypes = Array.from(new Set(recentReports.map((r: any) => r.reportType)));
    const avgInsightsPerReport = recentReports.length > 0 ? 
      recentReports.reduce((sum, r: any) => sum + (r.insights?.length || 0), 0) / recentReports.length : 0;

    return NextResponse.json({
      success: true,
      agent: {
        id: 'intelligence_reporting',
        name: 'Intelligence & Reporting Agent',
        status: 'active'
      },
      recentReports: recentReports,
      recentActivities: recentActivities,
      stats: {
        totalReports: totalReports,
        reportTypes: reportTypes,
        avgInsightsPerReport: avgInsightsPerReport.toFixed(1),
        lastReportGenerated: recentReports[0]?.createdAt || null
      }
    });

  } catch (error) {
    console.error('Error fetching intelligence reporting status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch intelligence reporting status' 
      },
      { status: 500 }
    );
  }
}