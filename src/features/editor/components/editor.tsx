"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Background,
  Controls,
  Panel,
} from "@xyflow/react";
import { ErrorView, LoadingView } from "@/components/entity-components";

import "@xyflow/react/dist/style.css";
import { useSuspenceWorkflow } from "@/features/workflows/hooks/use-workflows";
import { nodeComponents } from "@/lib/node-components";
import { AddNodeButton } from "@/components/react-flow/add-node-btn";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error in loading editor" />;
};

const Editor = ({ workflowId }: { workflowId: number }) => {
  const { data: workflow } = useSuspenceWorkflow(workflowId);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeComponents}
        style={{ height: "100%" }}
      >
        <Background />
        <Controls className="mb-16 ml-4" />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Editor;
