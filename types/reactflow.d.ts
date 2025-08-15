// ReactFlow type extensions

import { Node, Edge } from 'reactflow'

declare module 'reactflow' {
  interface NodeData {
    [key: string]: any
  }
  
  interface EdgeData {
    animated?: boolean
  }
  
  interface ReactFlowInstance {
    screenToFlowPosition: (position: { x: number; y: number }) => { x: number; y: number }
    fitView: () => void
    getNodes: () => Node[]
    getEdges: () => Edge[]
    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
  }
}

export interface FlowData {
  nodes: Node[]
  edges: Edge[]
}

export interface NodeData {
  label?: string
  config?: Record<string, any>
  [key: string]: any
}

export {};