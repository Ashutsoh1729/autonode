"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "./base-execution-node";
import { GlobeIcon } from "lucide-react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { HttpNodeFormSchemaType, HttpExecutionDialog } from "./http-node-dialog";

export type HttpRequestNodeData = {

  variableName?: string; // it is set to optional as it may not be required in some nodes
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
  const nodeStatus: NodeStatus = "initial";
  const description = NodeData.endpoint
    ? `${NodeData.method || "GET"}:${NodeData.endpoint}`
    : "Not Configured";

  const handleSubmit = (values: HttpNodeFormSchemaType) => {
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
        defaultVlaues={NodeData}
      />
      <BaseExecutionNode
        icon={GlobeIcon}
        name={NodeData.variableName || "HTTP Request"}
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
