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

interface BaseExecutionNodeProps extends NodeProps {
  id: string;
  icon: LucideIcon | string;
  name: string;
  description: string;
  children?: ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
  ({
    id,
    icon: Icon,
    name,
    status,
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseExecutionNodeProps) => {
    // we can use the useReactFlow hook, as this node is inside the ReactFlow Component
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
        <NodeStatusIndicator status={status} variant="border">
          <BaseNode onDoubleClick={onDoubleClick}>
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image src={Icon} width={16} height={16} alt={name} />
              ) : (
                <Icon className="size-4 text-muted-foreground " />
              )}
              {children}
              <BaseHandle
                type={"target"}
                id={"target-1"}
                position={Position.Left}
              />
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

BaseExecutionNode.displayName = "BaseExecutionNode";
