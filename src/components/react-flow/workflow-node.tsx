"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";
import { SettingsIcon, Trash } from "lucide-react";

interface WorkflowNodeProps {
  children: ReactNode;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
  name?: string;
  description?: string;
}

export const WorkflowNode = ({
  children,
  showToolbar = true,
  onDelete,
  onSettings,
  name,
  description,
}: WorkflowNodeProps) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button variant={"ghost"} size={"sm"} onClick={onSettings}>
            <SettingsIcon className="size-4" />
          </Button>

          <Button variant={"ghost"} size={"sm"} onClick={onDelete}>
            <Trash className="size-4" />
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          isVisible
          position={Position.Bottom}
          className="text-center max-w-[200px]"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="font-medium text-muted-foreground truncate text-sm">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};
