'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { doc } from 'firebase/firestore';
import { WorkspaceData } from '@/lib/ai-agents/workspace-initializer';
import { AgentRegistry } from '@/lib/ai-agents/agent-registry';
import { useOptimizedDocument } from '@/hooks/use-optimized-firestore';

const agents = [
  { id: 'crm', name: 'CRM Agent' },
  { id: 'content', name: 'Content Creation Agent' },
  { id: 'social', name: 'Social Media Agent' },
  { id: 'automation', name: 'Automation Agent' },
  { id: 'customer_interaction', name: 'Customer Interaction Agent' },
  { id: 'sales_pipeline', name: 'Sales Pipeline Agent' },
  { id: 'journey_orchestration', name: 'Journey Orchestration Agent' },
  { id: 'data_integration', name: 'Data Integration Agent' },
  { id: 'workflow_management', name: 'Workflow Management Agent' },
  { id: 'intelligence_reporting', name: 'Intelligence & Reporting Agent' },
  { id: 'conversational_ai', name: 'Conversational AI Agent' }
];

export default function AgentToggles() {
  const { user, db } = useAuth();
  const [activeAgentsState, setActiveAgentsState] = useState<Record<string, boolean>>({});

  // Use optimized Firestore hook
  const workspaceRef = user && db ? doc(db, 'workspaces', user.uid) : null;
  const { data: workspaceData } = useOptimizedDocument<WorkspaceData>(
    workspaceRef,
    `workspace-${user?.uid}`,
    { enabled: !!user && !!db }
  );

  useEffect(() => {
    if (workspaceData) {
      const agentData = workspaceData.activeAgents || {};
      setActiveAgentsState(agentData);
    }
  }, [workspaceData]);

  const toggleAgent = async (id: string, newValue: boolean) => {
    if (!user || !db) return;

    try {
      const registry = AgentRegistry.getInstance();
      
      // Update Firestore first
      await registry.toggleAgentStatus(db, user.uid, id, newValue);
      
      // Then update the agent's actual status
      const agent = registry.getAgent(id);
      if (agent) {
        if (newValue) {
          await agent.start();
          console.log(`✅ Agent ${id} started`);
        } else {
          await agent.stop();
          console.log(`⏸️ Agent ${id} stopped`);
        }
      } else {
        console.warn(`Agent ${id} not found in registry`);
      }
      
      // Update local state
      setActiveAgentsState(prev => ({
        ...prev,
        [id]: newValue
      }));
      
    } catch (error) {
      console.error(`Failed to toggle agent ${id}:`, error);
    }
  };

  return (
    <div className="space-y-4">
      {agents.map(agent => (
        <div key={agent.id} className="flex items-center justify-between">
          <Label htmlFor={agent.id}>{agent.name}</Label>
          <Switch
            id={agent.id}
            checked={activeAgentsState[agent.id] ?? false}
            onCheckedChange={(checked) => toggleAgent(agent.id, checked)}
          />
        </div>
      ))}
    </div>
  );
}
