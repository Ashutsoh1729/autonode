import { NodeType } from "@/db/schema";
import { httpNodeExecutor } from "@/features/executions/lib/http.executor";
import { NodeExecutor } from "@/features/executions/lib/types";
import { manualExecutor } from "@/features/triggers/mannual_trigger/lib/manual-executor";
import { cronExecutor } from "@/features/triggers/cron_job_trigger/lib/cron-executor";

type AnyExecutor = NodeExecutor<Record<string, unknown>>;

export const executorRegistry: Partial<Record<NodeType["type"], AnyExecutor>> = {
  INITIAL: manualExecutor as AnyExecutor,
  MANUAL_TRIGGER: manualExecutor as AnyExecutor,
  CRON_TRIGGER: cronExecutor as AnyExecutor,
  HTTP_REQUEST: httpNodeExecutor as AnyExecutor,
};

export const getExecutor = (nodeType: NodeType["type"]) => {
  const executor = executorRegistry[nodeType];
  if (!executor) {
    throw new Error(`Executor not found for node type: ${nodeType}`);
  }
  return executor;
};
