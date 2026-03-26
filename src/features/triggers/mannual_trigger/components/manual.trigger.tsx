import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../../components/base-trigger-node";
import { memo, useState } from "react";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./manual-dialog";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerRealTime } from "@/features/executions/lib/actions";
import { useAtomValue } from "jotai";
import { isExecutingAtom } from "@/features/executions/store/atoms";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isExecuting = useAtomValue(isExecutingAtom);

  const nodeStatus: NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: manualTriggerChannel().name,
    topic: "status",
    refreshToken: fetchManualTriggerRealTime,
    enabled: isExecuting,
  });

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
        status={nodeStatus}
        {...props}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
