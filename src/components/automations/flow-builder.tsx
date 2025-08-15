"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  type Edge,
  type Connection,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";

import { NodeLibrarySidebar } from "./sidebar";
import { ConfigSidebar } from "./config-sidebar";
import { TriggerNode, ActionNode, DelayNode, ConditionNode, type AutomationNodeData } from "./nodes";
import { Button } from "../ui/button";
import { PanelLeft, Save } from "lucide-react";

/*----------------------------------------------------------------------------------*/

interface FlowBuilderProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

/*----------------------------------------------------------------------------------*/

const getId = (() => {
  let id = 100;
  return () => `${id++}`;
})();

export function FlowBuilder({
  initialNodes = [],
  initialEdges = [],
}: FlowBuilderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as any);
  const [instance, setInstance] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const nodeTypes = useMemo(
    () => ({
      trigger: TriggerNode,
      action: ActionNode,
      delay: DelayNode,
      condition: ConditionNode,
    }),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelected(node);
      setSidebarOpen(true);
    },
    [setSelected, setSidebarOpen]
  );

  const onPaneClick = useCallback(() => setSelected(null), [setSelected]);
  const onNodesDelete = useCallback(() => setSelected(null), [setSelected]);

  const onDragOver = useCallback((evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (evt: React.DragEvent<HTMLDivElement>) => {
      evt.preventDefault();
      if (!wrapperRef.current || !instance) return;

      const type = evt.dataTransfer.getData("application/reactflow/node-type");
      if (!type) return;

      const pos = instance.screenToFlowPosition({
        x: evt.clientX,
        y: evt.clientY,
      });

      const raw = evt.dataTransfer.getData("application/reactflow/node-data");
      let nodeData: AutomationNodeData = {
        icon: 'HelpCircle',
        title: 'New Node',
        config: {}
      };
      
      try {
        if (raw) {
          const parsedData = JSON.parse(raw);
          nodeData = { ...nodeData, ...parsedData };
        }
      } catch (error) {
        console.warn("Failed to parse node data:", error);
      }

      const newNode: any = {
        id: getId(),
        type,
        position: pos,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [instance, setNodes]
  );

  const handleConfigChange = useCallback(
    (config: Record<string, unknown>) => {
      if (!selected) return;

      setNodes((nds) =>
        nds.map((n) =>
          n.id === selected.id ? { ...n, data: { ...n.data, config } } : n
        )
      );
      setSelected((prev: any) =>
        prev ? { ...prev, data: { ...prev.data, config } } : null
      );
    },
    [selected, setNodes]
  );

  const handleSave = useCallback(() => {
    try {
      const flowData = { nodes, edges };
      console.log("Saving flow:", JSON.stringify(flowData, null, 2));
      alert("Flow saved! Check the console for the JSON output.");
    } catch (error) {
      console.error("Failed to save flow:", error);
      alert("Failed to save flow. Check the console for details.");
    }
  }, [nodes, edges]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  /*----------------------------------------------------------------------------*/

  return (
    <div className="flex h-full w-full bg-background">
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-80" : "w-0"
        } h-full overflow-hidden`}
      >
        {selected ? (
          <ConfigSidebar
            key={selected.id}
            node={selected}
            onConfigChange={handleConfigChange}
            onClose={() => setSelected(null)}
          />
        ) : (
          <NodeLibrarySidebar />
        )}
      </div>

      <div ref={wrapperRef} className="flex-grow h-full select-none">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={16} size={1} />
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="bg-card"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSave}
              className="bg-card text-card-foreground hover:bg-card/80"
            >
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </ReactFlow>
      </div>
    </div>
  );
}