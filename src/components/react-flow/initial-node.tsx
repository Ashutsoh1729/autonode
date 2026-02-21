"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selecter";

export const InitialNode = memo((props: NodeProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode>
        <PlaceholderNode
          {...props}
          onClick={() => {
            setSelectorOpen(true);
          }}
        >
          <div className="cursor-pointer flex items-center  justify-center">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";
