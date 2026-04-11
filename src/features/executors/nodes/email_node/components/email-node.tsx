"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../../../components/base-execution-node";
import { Mail } from "lucide-react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import {
  EmailNodeFormSchemaType,
  EmailExecutionDialog,
} from "./email-node-dialog";
import { useNodeStatus } from "../../../hooks/use-node-status";
import { emailRequestChannel } from "@/features/executors/lib/email.executor";
import { fetchEmailRequestRealTime } from "../../../lib/actions";
import { useAtomValue } from "jotai";
import { isExecutingAtom } from "../../../store/atoms";

export type EmailNodeData = {
  variableName?: string;
  provider: "resend";
  fromEmail: string;
  fromName?: string;
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
  credentialId?: string;
  [key: string]: unknown;
};

type EmailNodeType = Node<EmailNodeData>;

export const EmailNode = memo((props: NodeProps<EmailNodeType>) => {
  const NodeData = props.data;

  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  const isExecuting = useAtomValue(isExecutingAtom);
  const nodeStatus: NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: emailRequestChannel().name,
    topic: "status",
    refreshToken: fetchEmailRequestRealTime,
    enabled: isExecuting,
  });

  const description = NodeData.to
    ? `To: ${NodeData.to}`
    : "Not Configured";

  const handleSubmit = (values: EmailNodeFormSchemaType) => {
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
      <EmailExecutionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={NodeData}
      />
      <BaseExecutionNode
        icon={Mail}
        name={NodeData.provider === "resend" ? "Resend" : "SMTP Email"}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        status={nodeStatus}
        {...props}
      />
    </>
  );
});

EmailNode.displayName = "EmailNode";