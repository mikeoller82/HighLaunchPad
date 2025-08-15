import {
  AIAgent,
  AgentType,
  AgentStatus,
  Event,
  Action,
  ExecutionResult,
  Feedback,
  AgentConfiguration
} from './types';
import { BaseAgent } from './base-agent';
import { Firestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface AgentRegistryEntry {
  agent: AIAgent;
  configuration: AgentConfiguration;
  registeredAt: Date;
  lastActivity: Date;
}

// Removed global declaration to prevent performance issues

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<string, AgentRegistryEntry> = new Map();
  private agentsByType: Map<AgentType, AIAgent[]> = new Map();
  private eventSubscriptions: Map<string, Set<string>> = new Map(); // eventType -> agentIds
  private activeAgents: Record<string, boolean> = {};
  private instanceId: string;

  private constructor() {
    this.instanceId = `registry_${Date.now()}`;
    
    // Initialize agent type maps
    Object.values(AgentType).forEach(type => {
      this.agentsByType.set(type, []);
    });
  }

  public async loadActiveAgents(db: Firestore, workspaceId: string): Promise<void> {
    try {
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      const snap = await getDoc(workspaceRef);
      if (snap.exists()) {
        this.activeAgents = snap.data().activeAgents || {};
      } else {
        // If workspace doesn't exist, initialize with default values
        console.warn(`Workspace ${workspaceId} not found, using default agent states`);
        this.activeAgents = {};
      }
    } catch (error) {
      console.error('Error loading active agents:', error);
      this.activeAgents = {};
    }
  }

  public isActive(agentId: string): boolean {
    // Default to false if not specified
    return this.activeAgents[agentId] === true;
  }

  public async toggleAgentStatus(db: Firestore, workspaceId: string, agentId: string, enabled: boolean): Promise<void> {
    const workspaceRef = doc(db, 'workspaces', workspaceId);
    const snap = await getDoc(workspaceRef);

    if (snap.exists()) {
      await updateDoc(workspaceRef, {
        [`activeAgents.${agentId}`]: enabled,
      });
    } else {
      await setDoc(workspaceRef, {
        activeAgents: {
          [agentId]: enabled,
        }
      });
    }
    this.activeAgents[agentId] = enabled; // Update local cache
    console.log(`Agent ${agentId} toggled to ${enabled ? 'enabled' : 'disabled'} in Firestore.`);
  }

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  // Agent registration and management
  public async registerAgent(agent: AIAgent): Promise<void> {
    if (this.agents.has(agent.id)) {
      console.warn(`Agent with id ${agent.id} is already registered, skipping`);
      return;
    }

    const entry: AgentRegistryEntry = {
      agent,
      configuration: agent.configuration,
      registeredAt: new Date(),
      lastActivity: new Date()
    };

    this.agents.set(agent.id, entry);
    
    // Add to type-based index
    const typeAgents = this.agentsByType.get(agent.type) || [];
    typeAgents.push(agent);
    this.agentsByType.set(agent.type, typeAgents);

    // Subscribe to relevant events
    agent.capabilities.forEach(capability => {
      capability.supportedEventTypes.forEach(eventType => {
        if (!this.eventSubscriptions.has(eventType as string)) {
          this.eventSubscriptions.set(eventType as string, new Set());
        }
        this.eventSubscriptions.get(eventType as string)!.add(agent.id);
      });
    });

    console.log(`Agent ${agent.id} (${agent.type}) registered successfully. Total agents: ${this.agents.size}`);
  }

  public async unregisterAgent(agentId: string): Promise<void> {
    const entry = this.agents.get(agentId);
    if (!entry) {
      throw new Error(`Agent with id ${agentId} is not registered`);
    }

    const agent = entry.agent;

    // Stop the agent
    await agent.stop();

    // Remove from type-based index
    const typeAgents = this.agentsByType.get(agent.type) || [];
    const filteredAgents = typeAgents.filter(a => a.id !== agentId);
    this.agentsByType.set(agent.type, filteredAgents);

    // Remove event subscriptions
    this.eventSubscriptions.forEach((agentIds, eventType) => {
      agentIds.delete(agentId);
      if (agentIds.size === 0) {
        this.eventSubscriptions.delete(eventType);
      }
    });

    // Remove from main registry
    this.agents.delete(agentId);

    console.log(`Agent ${agentId} unregistered successfully`);
  }

  // Agent retrieval
  public getAgent(agentId: string): AIAgent | undefined {
    return this.agents.get(agentId)?.agent;
  }

  public getAgentsByType(type: AgentType): AIAgent[] {
    return [...(this.agentsByType.get(type) || [])];
  }

  public getAllAgents(): AIAgent[] {
    return Array.from(this.agents.values()).map(entry => entry.agent);
  }

  public getActiveAgents(): AIAgent[] {
    return this.getAllAgents().filter(agent => 
      this.isActive(agent.id) &&
      agent.getStatus() !== AgentStatus.DISABLED && 
      agent.getStatus() !== AgentStatus.ERROR
    );
  }

  public getAgentsByCapability(eventType: string): AIAgent[] {
    const agentIds = this.eventSubscriptions.get(eventType) || new Set();
    return Array.from(agentIds)
      .map(id => this.getAgent(id))
      .filter((agent): agent is AIAgent => agent !== undefined && this.isActive(agent.id));
  }

  // Agent status management
  public async startAgent(agentId: string): Promise<void> {
    const agent = this.getAgent(agentId);
    if (!agent) {
      // Debug information
      console.warn(`Agent ${agentId} not found in registry. Available agents:`, Array.from(this.agents.keys()));
      console.warn('Registry stats:', this.getRegistryStats());
      
      // Don't throw error, just log warning and return
      console.warn(`Skipping start for agent ${agentId} - not found in registry`);
      return;
    }
    await agent.start();
    this.updateLastActivity(agentId);
  }

  public async stopAgent(agentId: string): Promise<void> {
    const agent = this.getAgent(agentId);
    if (!agent) {
      // Debug information
      console.warn(`Agent ${agentId} not found in registry. Available agents:`, Array.from(this.agents.keys()));
      console.warn('Registry stats:', this.getRegistryStats());
      
      // Don't throw error, just log warning and return
      console.warn(`Skipping stop for agent ${agentId} - not found in registry`);
      return;
    }
    await agent.stop();
    this.updateLastActivity(agentId);
  }

  public async startAllAgents(): Promise<void> {
    const startPromises = this.getAllAgents().map(agent => agent.start());
    await Promise.all(startPromises);
    console.log('All agents started');
  }

  public async stopAllAgents(): Promise<void> {
    const stopPromises = this.getAllAgents().map(agent => agent.stop());
    await Promise.all(stopPromises);
    console.log('All agents stopped');
  }

  // Registry information
  public getRegistryStats(): {
    totalAgents: number;
    activeAgents: number;
    agentsByType: Record<string, number>;
    agentsByStatus: Record<string, number>;
  } {
    const allAgents = this.getAllAgents();
    const agentsByType: Record<string, number> = {};
    const agentsByStatus: Record<string, number> = {};

    allAgents.forEach(agent => {
      // Count by type
      agentsByType[agent.type] = (agentsByType[agent.type] || 0) + 1;
      
      // Count by status
      const status = agent.getStatus();
      agentsByStatus[status] = (agentsByStatus[status] || 0) + 1;
    });

    return {
      totalAgents: allAgents.length,
      activeAgents: this.getActiveAgents().length,
      agentsByType,
      agentsByStatus
    };
  }

  public getAgentInfo(agentId: string): AgentRegistryEntry | undefined {
    return this.agents.get(agentId);
  }

  // Utility methods
  private updateLastActivity(agentId: string): void {
    const entry = this.agents.get(agentId);
    if (entry) {
      entry.lastActivity = new Date();
    }
  }

  // Health check
  public async performHealthCheck(): Promise<{
    healthy: boolean;
    issues: string[];
    agentStatuses: Record<string, string>;
  }> {
    const issues: string[] = [];
    const agentStatuses: Record<string, string> = {};
    
    for (const [agentId, entry] of Array.from(this.agents.entries())) {
      const agent = entry.agent;
      const status = agent.getStatus();
      agentStatuses[agentId] = status;
      
      if (status === AgentStatus.ERROR) {
        issues.push(`Agent ${agentId} is in error state`);
      }
      
      // Check for inactive agents
      const timeSinceLastActivity = Date.now() - entry.lastActivity.getTime();
      if (timeSinceLastActivity > 300000) { // 5 minutes
        issues.push(`Agent ${agentId} has been inactive for ${Math.round(timeSinceLastActivity / 60000)} minutes`);
      }
    }

    return {
      healthy: issues.length === 0,
      issues,
      agentStatuses
    };
  }
}