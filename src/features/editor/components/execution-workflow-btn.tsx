"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useSetAtom } from "jotai";
import { isExecutingAtom } from "@/features/executors/store/atoms";

export const ExecutionWorkflowBtn = ({
  workflowId,
}: {
  workflowId: number;
}) => {
  const executeWorkflow = useExecuteWorkflow();
  const setIsExecuting = useSetAtom(isExecutingAtom);

  function handleExecute() {
    setIsExecuting(true);
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
