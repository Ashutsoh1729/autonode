import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "./base-trigger-node";
import { memo, useState } from "react";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./manual-dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        icon={MousePointerIcon}
        name={"Manual Trigger"}
        description={"It is working"}
        onDoubleClick={handleOpenSettings}
        onSettings={handleOpenSettings}
        {...props}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
