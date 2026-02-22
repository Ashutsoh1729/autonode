"use client";

import { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseExecutionNode } from "./base-execution-node";
import { GlobeIcon } from "lucide-react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

export type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const NodeData = props.data;
  const nodeStatus: NodeStatus = "error";
  const description = NodeData.endpoint
    ? `${NodeData.method || "GET"}:${NodeData.endpoint}`
    : "Not Configured";

  return (
    <>
      <BaseExecutionNode
        icon={GlobeIcon}
        name={"HTTP Request"}
        description={description}
        onSettings={() => {}}
        onDoubleClick={() => {}}
        status={nodeStatus}
        {...props}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
