import { NodeType } from "@/db/schema";
import { manualExecutor } from "@/features/triggers/nodes/mannual_trigger/lib/manual-executor";
import { cronExecutor } from "@/features/triggers/nodes/cron_job_trigger/lib/cron-executor";
import { httpNodeExecutor } from "@/features/executors/lib/http.executor";
import { aiNodeExecutor } from "@/features/executors/lib/ai-executor";
import { emailNodeExecutor } from "@/features/executors/lib/email.executor";
import { NodeExecutor } from "@/features/executors/lib/types";

type AnyExecutor = NodeExecutor<Record<string, unknown>>;

export const executorRegistry: Partial<Record<NodeType["type"], AnyExecutor>> =
  {
    INITIAL: manualExecutor as AnyExecutor,
    MANUAL_TRIGGER: manualExecutor as AnyExecutor,
    CRON_TRIGGER: cronExecutor as AnyExecutor,
    HTTP_REQUEST: httpNodeExecutor as AnyExecutor,
    AI: aiNodeExecutor as AnyExecutor,
    EMAIL: emailNodeExecutor as AnyExecutor,
  };

export const getExecutor = (nodeType: NodeType["type"]) => {
  const executor = executorRegistry[nodeType];
  if (!executor) {
    throw new Error(`Executor not found for node type: ${nodeType}`);
  }
  return executor;
};
