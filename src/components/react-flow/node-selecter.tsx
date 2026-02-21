"use client";

import React, { useCallback } from "react";
import { createId } from "@paralleldrive/cuid2";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeTypeValue } from "@/lib/node-components";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";

export type NodeTypeOptions = {
  type: NodeTypeValue;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

// The nodes that will just trigger the workflows
const triggerNode: NodeTypeOptions[] = [
  {
    type: "MANUAL_TRIGGER",
    label: "Trigger Manually",
    description:
      "Runs the flow on clicking a button. Good for getting started.",
    icon: MousePointerIcon,
  },
];

/*
 * Nodes that will be used for executing different tasks of the workflow
 *
 * INFO: I don't know it's usage. Learn it. ( Both executionNodes and triggerNode)
 *
 */

const executionNodes: NodeTypeOptions[] = [
  {
    type: "HTTP_REQUEST",
    label: "HTTP Request",
    description: "Make an http request",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const NodeSelector = ({
  children,
  open,
  onOpenChange,
}: NodeSelectorProps) => {
  // getting the current state of the editor
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();
  const handleNodeSelect = useCallback(
    (selections: NodeTypeOptions) => {
      // check if trying to add a mannual trigger while one already exists
      if (selections.type === "MANUAL_TRIGGER") {
        const nodes = getNodes();
        const hasManualNode = nodes.some(
          (node) => node.type === "MANUAL_TRIGGER",
        );

        if (hasManualNode) {
          toast.error("Only one manual node is allowed per workflow");
          return;
        }
      }
      // otherwise we can move to add nodes
      // here the nodes are the already existing nodes in the canvas
      setNodes((nodes) => {
        const hasInitializerTrigger = nodes.some(
          (node) => node.type === "INITIAL",
        );

        // deciding the node position
        // using the current canvas position to set the node position, with some random element in it
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selections.type,
        };

        if (hasInitializerTrigger) return [newNode];

        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [setNodes, getNodes, onOpenChange, screenToFlowPosition],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full md:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Nodes</SheetTitle>
          <SheetDescription>
            Drag and drop nodes onto the canvas to build your workflow.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 px-4 flex flex-col gap-3">
          {triggerNode.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className="w-full justify-start h-auto px-4 py-5 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                onClick={() => {
                  handleNodeSelect(nodeType);
                }}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden ">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.description}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm ">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <Separator />

          {executionNodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className="w-full justify-start h-auto px-4 py-5 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                onClick={() => {
                  handleNodeSelect(nodeType);
                }}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden ">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.description}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm ">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
