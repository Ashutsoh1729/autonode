import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "./base-trigger-node";
import { memo, useState } from "react";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./manual-dialog";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus: NodeStatus = "loading";
  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        icon={MousePointerIcon}
        name={"When clicking 'Execute Workflow'"}
        description={""}
        // TODO: Add the properties
        // onDoubleClick={()=>{}}
        onSettings={() => {
          setDialogOpen(true);
        }}
        status={nodeStatus}
        {...props}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
