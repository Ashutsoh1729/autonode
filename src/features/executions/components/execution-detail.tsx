"use client";

import { formatDistanceToNow } from "date-fns";
import { useSuspenseExecution } from "../hooks/use-executions";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, PlayIcon } from "lucide-react";
import Link from "next/link";

const statusColors = {
  PENDING: "bg-yellow-500",
  RUNNING: "bg-blue-500",
  SUCCESS: "bg-green-500",
  FAILED: "bg-red-500",
  SKIPPED: "bg-gray-400",
};

const nodeStatusColors = {
  PENDING: "border-yellow-500 bg-yellow-50",
  RUNNING: "border-blue-500 bg-blue-50",
  SUCCESS: "border-green-500 bg-green-50",
  FAILED: "border-red-500 bg-red-50",
  SKIPPED: "border-gray-400 bg-gray-50",
};

export const ExecutionDetailView = ({
  execution: serverExecution,
}: {
  execution: {
    id: number;
    workflowId: number;
    status: string;
    triggeredAt: Date;
    completedAt: Date | null;
    triggerType: string;
    input: unknown;
    output: unknown;
    workflow: { name: string };
    nodes: Array<{
      id: number;
      nodeId: string;
      status: string;
      input: unknown;
      output: unknown;
      startedAt: Date | null;
      completedAt: Date | null;
      error: string | null;
    }>;
  };
}) => {
  const { data: execution } = useSuspenseExecution(serverExecution.id);

  const duration = execution.completedAt
    ? execution.completedAt.getTime() - execution.triggeredAt.getTime()
    : null;

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <Link
        href="/executions"
        className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeftIcon className="size-4 mr-1" />
        Back to Executions
      </Link>

      <div className="bg-card rounded-lg border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 bg-muted rounded-lg">
              <PlayIcon className="size-5 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">
                Execution #{execution.id}
              </h1>
              <p className="text-sm text-muted-foreground">
                {execution.workflow.name}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "px-3 py-1 text-sm text-white rounded-full",
              statusColors[execution.status as keyof typeof statusColors] ||
                "bg-gray-500",
            )}
          >
            {execution.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Trigger Type</p>
            <p className="font-medium">{execution.triggerType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Started</p>
            <p className="font-medium">
              {formatDistanceToNow(execution.triggeredAt, { addSuffix: true })}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="font-medium">
              {duration ? formatDuration(duration) : "-"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Workflow ID</p>
            <p className="font-medium">{execution.workflowId}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Input</h2>
        <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-40">
          {JSON.stringify(execution.input as Record<string, unknown>, null, 2)}
        </pre>
      </div>

      {(execution.output as Record<string, unknown>) && (Object.keys(execution.output as Record<string, unknown>).length > 0) && (
        <div className="bg-card rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Output</h2>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-40">
            {JSON.stringify(execution.output as Record<string, unknown>, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Node Executions</h2>
        {execution.nodes.length === 0 ? (
          <p className="text-muted-foreground">No node executions recorded</p>
        ) : (
          <div className="space-y-3">
            {execution.nodes.map((node, index) => (
              <div
                key={node.id}
                className={cn(
                  "border rounded-lg p-4",
                  nodeStatusColors[node.status as keyof typeof nodeStatusColors] ||
                    "border-gray-200",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      #{index + 1}
                    </span>
                    <span className="font-mono text-sm font-medium">
                      {node.nodeId}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs text-white rounded-full",
                      statusColors[node.status as keyof typeof statusColors] ||
                        "bg-gray-500",
                    )}
                  >
                    {node.status}
                  </span>
                </div>

                {node.startedAt && node.completedAt && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Duration:{" "}
                    {formatDuration(
                      node.completedAt.getTime() - node.startedAt.getTime(),
                    )}
                  </p>
                )}

                {node.error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                    {node.error}
                  </div>
                )}

                {(node.input as Record<string, unknown>) && (Object.keys(node.input as Record<string, unknown>).length > 0) && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                      Input
                    </summary>
                    <pre className="mt-1 bg-muted p-2 rounded text-xs overflow-auto max-h-24">
                      {JSON.stringify(node.input as Record<string, unknown>, null, 2)}
                    </pre>
                  </details>
                )}

                {(node.output as Record<string, unknown>) && (Object.keys(node.output as Record<string, unknown>).length > 0) && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                      Output
                    </summary>
                    <pre className="mt-1 bg-muted p-2 rounded text-xs overflow-auto max-h-24">
                      {JSON.stringify(node.output, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
