import { InitialNode } from "@/components/react-flow/initial-node";
import { nodeType } from "@/db/schema";
import { HttpRequestNode } from "@/features/executions/components/http-node";
import { ManualTriggerNode } from "@/features/triggers/mannual_trigger/components/manual.trigger";
import { CronJobTriggerNode } from "@/features/triggers/cron_job_trigger/components/cron-node";
import { NodeProps, NodeTypes } from "@xyflow/react";

export type NodeTypeValue = (typeof nodeType.enumValues)[number];

// Map each enum value to its component
const componentMap: Record<NodeTypeValue, React.ComponentType<NodeProps>> = {
  INITIAL: InitialNode,
  MANUAL_TRIGGER: ManualTriggerNode,
  CRON_TRIGGER: CronJobTriggerNode,
  // TODO: check the error
  HTTP_REQUEST: HttpRequestNode as unknown as React.ComponentType<NodeProps>,
  AI: ManualTriggerNode,
};

export const nodeComponents = componentMap satisfies NodeTypes;
export type RegisteredNodeType = keyof typeof componentMap;
