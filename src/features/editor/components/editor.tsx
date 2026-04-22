"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
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
import { useSetAtom, useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";
import { ExecutionWorkflowBtn } from "./execution-workflow-btn";
import { AiWorkflowGeneratorSheet } from "@/features/workflow-generator/components/ai-workflow-generator-sheet";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error in loading editor" />;
};

const Editor = ({ workflowId }: { workflowId: number }) => {
  const { data: workflow } = useSuspenceWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);
  const editor = useAtomValue(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (editor) {
        console.log("Editor state changed:", { nodes: editor.getNodes(), edges: editor.getEdges() });
      }
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
    },
    [editor],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (editor) {
        console.log("Editor state changed:", { nodes: editor.getNodes(), edges: editor.getEdges() });
      }
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
    },
    [editor],
  );
  const onConnect = useCallback(
    (params: Connection) => {
      if (editor) {
        console.log("Editor state changed:", { nodes: editor.getNodes(), edges: editor.getEdges() });
      }
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
    },
    [editor],
  );

  const prevNodesRef = useRef(nodes);
  const prevEdgesRef = useRef(edges);

  useEffect(() => {
    const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(prevNodesRef.current);
    const edgesChanged = JSON.stringify(edges) !== JSON.stringify(prevEdgesRef.current);

    if ((nodesChanged || edgesChanged) && editor) {
      console.log("Editor state changed:", { nodes: editor.getNodes(), edges: editor.getEdges() });
    }

    prevNodesRef.current = nodes;
    prevEdgesRef.current = edges;
  }, [nodes, edges, editor]);

  const hasManualTrigger = useMemo(() => nodes.some((node) => node.type === "MANUAL_TRIGGER"), [nodes]);

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
        onInit={setEditor}
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background />
        <Controls className="mb-16 ml-4" />
        <Panel position="top-right">
          <div className="flex flex-col items-center gap-2">
            <AddNodeButton />
            <AiWorkflowGeneratorSheet />
          </div>

        </Panel>
        <Panel position="bottom-center">
          {hasManualTrigger && <ExecutionWorkflowBtn workflowId={workflowId} />}
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default Editor;
