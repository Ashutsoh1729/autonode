"use client";

import { Position, useReactFlow, type NodeProps } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import { memo, ReactNode } from "react";
import Image from "next/image";
import { BaseHandle } from "@/components/base-handle";
import { WorkflowNode } from "@/components/react-flow/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import {
  NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
  id: string;
  icon: LucideIcon | string;
  name: string;
  description: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    status = "initial",
    children,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
      setNodes((nodes) => {
        const updatedNodes = nodes.filter((node) => node.id !== id);
        return updatedNodes;
      });
      setEdges((edges) => {
        const updatedNodes = edges.filter(
          (edge) => edge.target !== id && edge.source !== id,
        );
        return updatedNodes;
      });
    };

    return (
      <WorkflowNode
        name="name"
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <NodeStatusIndicator
          status={status}
          variant="border"
          className="rounded-l-xl "
        >
          <BaseNode
            onDoubleClick={onDoubleClick}
            className="rounded-l-xl relative group"
          >
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} width={16} height={16} alt={name} />
              ) : (
                <Icon className="size-4 text-muted-foreground " />
              )}
              {children}
              <BaseHandle
                type={"source"}
                id={"source-1"}
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  },
);

BaseTriggerNode.displayName = "BaseTriggerNode";
