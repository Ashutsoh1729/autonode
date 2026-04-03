"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../../../components/base-execution-node";
import { BrainIcon } from "lucide-react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { AiNodeFormSchemaType, AiExecutionDialog } from "./ai-node-dialog";
import { useNodeStatus } from "../../../hooks/use-node-status";
import { aiRequestChannel } from "@/inngest/channels/ai-request";
import { fetchAiRequestRealTime } from "../../../lib/actions";
import { useAtomValue } from "jotai";
import { isExecutingAtom } from "../../../store/atoms";

export type AiRequestNodeData = {
  variableName: string; // it is set to optional as it may not be required in some nodes
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  credentialId?: string;
  [key: string]: unknown;
};

type AiRequestNodeType = Node<AiRequestNodeData>;

export const AINode = memo((props: NodeProps<AiRequestNodeType>) => {
  const NodeData = props.data;

  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const isExecuting = useAtomValue(isExecutingAtom);
  const nodeStatus: NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: aiRequestChannel().name,
    topic: "status",
    refreshToken: fetchAiRequestRealTime,
    enabled: isExecuting,
  });
  const description = NodeData.prompt
    ? `${NodeData.model || "AI"}: ${NodeData.prompt.substring(0, 50)}${NodeData.prompt.length > 50 ? "..." : ""}`
    : "Not Configured";

  const handleSubmit = (values: AiNodeFormSchemaType) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values,
            },
          };
        }
        return node;
      }),
    );
  };

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };
  return (
    <>
      <AiExecutionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={NodeData}
      />
      <BaseExecutionNode
        icon={BrainIcon}
        name={NodeData.variableName || "AI Node"}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
        {...props}
      />
    </>
  );
});

AINode.displayName = "AiRequestNode";

