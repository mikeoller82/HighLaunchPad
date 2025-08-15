import { Firestore, collection, addDoc, updateDoc, doc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { AgentActivityMonitor, ActivityFeedItem } from './agent-activity-monitor';
import { AgentActionExecutor } from './agent-action-executor';

export interface DashboardSyncResult {
  success: boolean;
  syncedItems: number;
  errors: string[];
}

export class DashboardSynchronizer {
  private static instance: DashboardSynchronizer;
  private monitor: AgentActivityMonitor;
  private executor: AgentActionExecutor;

  private constructor() {
    this.monitor = AgentActivityMonitor.getInstance();
    this.executor = AgentActionExecutor.getInstance();
  }

  public static getInstance(): DashboardSynchronizer {
    if (!DashboardSynchronizer.instance) {
      DashboardSynchronizer.instance = new DashboardSynchronizer();
    }
    return DashboardSynchronizer.instance;
  }

  /**
   * Ensures that all agent activities are properly reflected in their respective dashboard sections
   */
  public async synchronizeAgentActivities(db: Firestore, workspaceId: string): Promise<DashboardSyncResult> {
    const result: DashboardSyncResult = {
      success: true,
      syncedItems: 0,
      errors: []
    };

    try {
      // Get all recent activities from the monitor
      const activities = this.monitor.getActivityFeed();
      
      for (const activity of activities) {
        try {
          await this.syncActivityToDashboard(db, workspaceId, activity);
          result.syncedItems++;
        } catch (error) {
          const errorMsg = `Failed to sync activity ${activity.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      if (result.errors.length > 0) {
        result.success = false;
      }

      console.log(`📊 Dashboard sync completed: ${result.syncedItems} items synced, ${result.errors.length} errors`);
      
    } catch (error) {
      result.success = false;
      result.errors.push(`Sync process failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Syncs a specific activity to its appropriate dashboard section
   */
  private async syncActivityToDashboard(db: Firestore, workspaceId: string, activity: ActivityFeedItem): Promise<void> {
    // Only sync successful activities that haven't been synced yet
    if (activity.status !== 'success') return;

    // Determine the agent type and sync accordingly
    const agentType = this.getAgentTypeFromId(activity.agentId);
    
    switch (agentType) {
      case 'content_creation':
        await this.syncContentCreationActivity(db, workspaceId, activity);
        break;
      case 'social_media':
        await this.syncSocialMediaActivity(db, workspaceId, activity);
        break;
      case 'lead_management':
        await this.syncCRMActivity(db, workspaceId, activity);
        break;
      case 'automation':
        await this.syncAutomationActivity(db, workspaceId, activity);
        break;
      default:
        console.log(`Unknown agent type for activity: ${activity.agentId}`);
    }
  }

  /**
   * Syncs content creation activities to blog dashboard
   */
  private async syncContentCreationActivity(db: Firestore, workspaceId: string, activity: ActivityFeedItem): Promise<void> {
    if (activity.activity.includes('blog post')) {
      // Execute actual content creation if not already done
      const result = await this.executor.executeContentCreation(db, workspaceId, 'blog');
      
      if (result.success && result.data) {
        console.log(`✅ Blog post created and synced: ${result.data.title}`);
      }
    } else if (activity.activity.includes('social media captions')) {
      // Execute social content creation
      const result = await this.executor.executeContentCreation(db, workspaceId, 'social');
      
      if (result.success && result.data) {
        console.log(`✅ Social content created and synced: ${result.data.title}`);
      }
    } else if (activity.activity.includes('email')) {
      // Execute email content creation
      const result = await this.executor.executeContentCreation(db, workspaceId, 'email');
      
      if (result.success && result.data) {
        console.log(`✅ Email content created and synced: ${result.data.title}`);
      }
    }
  }

  /**
   * Syncs social media activities to social scheduler dashboard
   */
  private async syncSocialMediaActivity(db: Firestore, workspaceId: string, activity: ActivityFeedItem): Promise<void> {
    if (activity.activity.includes('Scheduling social media posts')) {
      // Execute actual social media scheduling
      const result = await this.executor.executeSocialMediaScheduling(db, workspaceId);
      
      if (result.success && result.data) {
        console.log(`✅ Social media post scheduled and synced: ${result.data.caption?.substring(0, 50)}...`);
      }
    }
  }

  /**
   * Syncs CRM activities to CRM dashboard
   */
  private async syncCRMActivity(db: Firestore, workspaceId: string, activity: ActivityFeedItem): Promise<void> {
    if (activity.activity.includes('lead')) {
      // Determine the type of CRM action
      let actionType: 'score_lead' | 'qualify_lead' | 'assign_lead' | 'schedule_followup' = 'score_lead';
      
      if (activity.activity.includes('scoring') || activity.activity.includes('analyzing')) {
        actionType = 'score_lead';
      } else if (activity.activity.includes('qualifying')) {
        actionType = 'qualify_lead';
      } else if (activity.activity.includes('assigning')) {
        actionType = 'assign_lead';
      } else if (activity.activity.includes('follow')) {
        actionType = 'schedule_followup';
      }

      // Execute the CRM action
      const result = await this.executor.executeCRMAction(db, workspaceId, actionType);
      
      if (result.success && result.data) {
        console.log(`✅ CRM action executed and synced: ${result.data.result}`);
      }
    }
  }

  /**
   * Syncs automation activities to automation dashboard
   */
  private async syncAutomationActivity(db: Firestore, workspaceId: string, activity: ActivityFeedItem): Promise<void> {
    // Determine the type of automation workflow
    let workflowType: 'email_sequence' | 'lead_nurturing' | 'crm_update' | 'social_posting' = 'email_sequence';
    
    if (activity.activity.includes('email')) {
      workflowType = 'email_sequence';
    } else if (activity.activity.includes('nurturing')) {
      workflowType = 'lead_nurturing';
    } else if (activity.activity.includes('CRM')) {
      workflowType = 'crm_update';
    } else if (activity.activity.includes('social')) {
      workflowType = 'social_posting';
    }

    // Execute the automation workflow
    const result = await this.executor.executeAutomationWorkflow(db, workspaceId, workflowType);
    
    if (result.success && result.data) {
      console.log(`✅ Automation workflow executed and synced: ${result.data.result}`);
    }
  }

  /**
   * Determines agent type from agent ID
   */
  private getAgentTypeFromId(agentId: string): string {
    if (agentId.includes('content') || agentId === 'content') {
      return 'content_creation';
    } else if (agentId.includes('social') || agentId === 'social') {
      return 'social_media';
    } else if (agentId.includes('crm') || agentId === 'crm') {
      return 'lead_management';
    } else if (agentId.includes('automation') || agentId === 'automation') {
      return 'automation';
    }
    return 'unknown';
  }

  /**
   * Forces synchronization of all pending activities
   */
  public async forceSynchronization(db: Firestore, workspaceId: string): Promise<DashboardSyncResult> {
    console.log('🔄 Forcing dashboard synchronization...');
    
    // Generate some test activities if none exist
    const activities = this.monitor.getActivityFeed();
    if (activities.length === 0) {
      console.log('📝 No activities found, generating test activities...');
      
      // Force generate activities for each agent type
      const agentIds = ['content', 'social', 'crm', 'automation'];
      for (const agentId of agentIds) {
        try {
          await this.monitor.forceGenerateActivity(agentId, db, workspaceId);
        } catch (error) {
          console.error(`Failed to generate activity for ${agentId}:`, error);
        }
      }
      
      // Wait a moment for activities to be generated
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return await this.synchronizeAgentActivities(db, workspaceId);
  }

  /**
   * Sets up automatic synchronization
   */
  public startAutoSync(db: Firestore, workspaceId: string, intervalMs: number = 30000): () => void {
    console.log(`🔄 Starting auto-sync every ${intervalMs / 1000} seconds`);
    
    const interval = setInterval(async () => {
      try {
        await this.synchronizeAgentActivities(db, workspaceId);
      } catch (error) {
        console.error('Auto-sync failed:', error);
      }
    }, intervalMs);

    // Return cleanup function
    return () => {
      clearInterval(interval);
      console.log('🛑 Auto-sync stopped');
    };
  }

  /**
   * Validates that agent activities are properly reflected in dashboard sections
   */
  public async validateDashboardSync(db: Firestore, workspaceId: string): Promise<{
    blogPosts: number;
    socialPosts: number;
    crmActions: number;
    automationActions: number;
    totalAgentGenerated: number;
  }> {
    const validation = {
      blogPosts: 0,
      socialPosts: 0,
      crmActions: 0,
      automationActions: 0,
      totalAgentGenerated: 0
    };

    try {
      // Count blog posts
      const blogQuery = query(
        collection(db, 'workspaces', workspaceId, 'blog_drafts'),
        where('agentGenerated', '==', true)
      );
      const blogSnapshot = await getDocs(blogQuery);
      validation.blogPosts = blogSnapshot.size;

      // Count social posts
      const socialQuery = query(
        collection(db, 'workspaces', workspaceId, 'posts'),
        where('agentGenerated', '==', true)
      );
      const socialSnapshot = await getDocs(socialQuery);
      validation.socialPosts = socialSnapshot.size;

      // Count CRM actions
      const crmCollections = ['lead_scores', 'lead_qualifications', 'lead_assignments', 'followups'];
      for (const collectionName of crmCollections) {
        const crmQuery = query(
          collection(db, 'workspaces', workspaceId, collectionName),
          where('agentGenerated', '==', true)
        );
        const crmSnapshot = await getDocs(crmQuery);
        validation.crmActions += crmSnapshot.size;
      }

      // Count automation actions
      const automationCollections = ['email_sequences', 'nurturing_actions', 'crm_updates'];
      for (const collectionName of automationCollections) {
        const automationQuery = query(
          collection(db, 'workspaces', workspaceId, collectionName),
          where('agentGenerated', '==', true)
        );
        const automationSnapshot = await getDocs(automationQuery);
        validation.automationActions += automationSnapshot.size;
      }

      validation.totalAgentGenerated = validation.blogPosts + validation.socialPosts + validation.crmActions + validation.automationActions;

      console.log('📊 Dashboard validation results:', validation);
      
    } catch (error) {
      console.error('Dashboard validation failed:', error);
    }

    return validation;
  }
}