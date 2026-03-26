import { NodeProps, useReactFlow } from "@xyflow/react";
import { BaseTriggerNode } from "../../components/base-trigger-node";
import { memo, useState } from "react";
import { Clock } from "lucide-react";
import { CronJobTriggerDialog, CronNodeFormSchemaType } from "./cron-node-dialog";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { cronTriggerChannel } from "@/inngest/channels/cron-trigger";
import { fetchCronTriggerRealTime } from "@/features/executions/lib/actions";
import { useAtomValue } from "jotai";
import { isExecutingAtom } from "@/features/executions/store/atoms";

export type CronTriggerNodeData = {
  cronExpression?: string;
  scheduledAt?: string;
  executionType?: "cron" | "one-time";
  enabled?: boolean;
  jobId?: number;
  timezone?: string;
  [key: string]: unknown;
};

export const CronJobTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();
  const isExecuting = useAtomValue(isExecutingAtom);

  const nodeData = props.data as CronTriggerNodeData;

  const nodeStatus: NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: cronTriggerChannel().name,
    topic: "status",
    refreshToken: fetchCronTriggerRealTime,
    enabled: isExecuting,
  });

  const handleSave = (values: CronNodeFormSchemaType) => {
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
      <CronJobTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        defaultValues={{
          cronExpression: nodeData.cronExpression,
          scheduledAt: nodeData.scheduledAt,
          executionType: nodeData.executionType,
          enabled: nodeData.enabled,
          timezone: nodeData.timezone,
        }}
      />
      <BaseTriggerNode
        icon={Clock}
        name={"Cron Trigger"}
        description={"Triggers workflow on a schedule"}
        onDoubleClick={handleOpenSettings}
        onSettings={handleOpenSettings}
        status={nodeStatus}
        {...props}
      />
    </>
  );
});

CronJobTriggerNode.displayName = "CronJobTriggerNode";
