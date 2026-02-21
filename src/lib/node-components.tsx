import { InitialNode } from "@/components/react-flow/initial-node";
import { nodeType } from "@/db/schema";
import { HttpRequestNode } from "@/features/executions/components/http-node";
import { ManualTriggerNode } from "@/features/triggers/components/manual.trigger";
import { NodeProps, NodeTypes } from "@xyflow/react";

export type NodeTypeValue = (typeof nodeType.enumValues)[number];

// Map each enum value to its component
const componentMap: Record<NodeTypeValue, React.ComponentType<NodeProps>> = {
  INITIAL: InitialNode,
  MANUAL_TRIGGER: ManualTriggerNode,
  HTTP_REQUEST: HttpRequestNode,
};

export const nodeComponents = componentMap satisfies NodeTypes;
export type RegisteredNodeType = keyof typeof componentMap;
