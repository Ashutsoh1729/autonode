"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "./base-execution-node";
import { GlobeIcon } from "lucide-react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { formSchemaType, HttpExecutionDialog } from "./http-node-dialog";

export type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const NodeData = props.data;

  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus: NodeStatus = "error";
  const description = NodeData.endpoint
    ? `${NodeData.method || "GET"}:${NodeData.endpoint}`
    : "Not Configured";

  const handleSubmit = (values: formSchemaType) => {
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
      <HttpExecutionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultEndpoint={NodeData.endpoint} //  TODO: Check whether it can be improved
        defaultMethod={NodeData.method}
        defaultBody={NodeData.body}
      />
      <BaseExecutionNode
        icon={GlobeIcon}
        name={"HTTP Request"}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
        {...props}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
