import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "./base-trigger-node";
import { memo } from "react";
import { MousePointerIcon } from "lucide-react";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      icon={MousePointerIcon}
      name={"When clicking 'Execute Workflow'"}
      description={""}
      // TODO: Add the properties
      // onDoubleClick={()=>{}}
      // onSettings={()=>{}}
      {...props}
    />
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
