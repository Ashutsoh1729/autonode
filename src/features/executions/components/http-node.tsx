"use client";

import { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";
import { BaseExecutionNode } from "./base-execution-node";
import { GlobeIcon } from "lucide-react";

export type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const NodeData = props.data;
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
        {...props}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
