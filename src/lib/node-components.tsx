import { InitialNode } from "@/components/react-flow/initial-node";
import { nodeType } from "@/db/schema";
import { ManualTriggerNode } from "@/features/triggers/nodes/mannual_trigger/components/manual.trigger";
import { CronJobTriggerNode } from "@/features/triggers/nodes/cron_job_trigger/components/cron-node";
import { NodeProps, NodeTypes } from "@xyflow/react";
import { HttpRequestNode } from "@/features/executors/nodes/http_node/components/http-node";
import { AINode } from "@/features/executors/nodes/ai_node/components/ai-node";

export type NodeTypeValue = (typeof nodeType.enumValues)[number];

// Map each enum value to its component
const componentMap: Record<NodeTypeValue, React.ComponentType<NodeProps>> = {
  INITIAL: InitialNode,
  MANUAL_TRIGGER: ManualTriggerNode,
  CRON_TRIGGER: CronJobTriggerNode,
  // TODO: check the error
  HTTP_REQUEST: HttpRequestNode as unknown as React.ComponentType<NodeProps>,
  AI: AINode as unknown as React.ComponentType<NodeProps>,
};

export const nodeComponents = componentMap satisfies NodeTypes;
export type RegisteredNodeType = keyof typeof componentMap;
