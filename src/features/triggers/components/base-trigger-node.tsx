"use client";

import { Position, type NodeProps } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import { memo, ReactNode } from "react";
import Image from "next/image";
import { BaseHandle } from "@/components/base-handle";
import { WorkflowNode } from "@/components/react-flow/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description: string;
  children?: ReactNode;
  // status?: NodeStatus; //  TODO: it will be implemented when we will implement real time pub-sub messaging
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {
    //  TODO: Add handleDelete
    const handleDelete = () => {};

    return (
      <WorkflowNode
        name="name"
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        {/*  TODO: Warp under node status indicator  */}
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
      </WorkflowNode>
    );
  },
);

BaseTriggerNode.displayName = "BaseTriggerNode";
