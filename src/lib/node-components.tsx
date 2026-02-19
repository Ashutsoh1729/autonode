import { InitialNode } from "@/components/react-flow/initial-node";
import { nodeType } from "@/db/schema";
import { NodeProps, NodeTypes } from "@xyflow/react";

type NodeTypeValue = (typeof nodeType.enumValues)[number];

// Map each enum value to its component
const componentMap: Record<NodeTypeValue, React.ComponentType<NodeProps>> = {
  INITIAL: InitialNode,
};

export const nodeComponents = componentMap satisfies NodeTypes;
export type RegisteredNodeType = keyof typeof componentMap;
