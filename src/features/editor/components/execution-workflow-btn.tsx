"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";

export const ExecutionWorkflowBtn = ({
  workflowId,
}: {
  workflowId: number;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  function handleExecute() {
    executeWorkflow.mutate({ id: workflowId });
  }

  return (
    <Button
      disabled={executeWorkflow.isPending}
      onClick={handleExecute}
    >
      {executeWorkflow.isPending ? (
        <Loader2Icon
          size={16}
          className="animate-spin [animation-name:loader-spin]"
        />
      ) : (
        <PlayIcon />
      )}
      {executeWorkflow.isPending ? "Executing..." : "Execute"}
    </Button>
  );
};
