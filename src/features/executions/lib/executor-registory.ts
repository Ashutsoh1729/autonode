import { NodeType } from "@/db/schema";
import { NodeExecutor } from "./types";
import { manualExecutor } from "@/features/triggers/lib/manual-executor";
import { httpNodeExecutor } from "./http.executor";

export const executorRegistry: Partial<Record<NodeType["type"], NodeExecutor>> =
  {
    INITIAL: manualExecutor,
    MANUAL_TRIGGER: manualExecutor,
    HTTP_REQUEST: httpNodeExecutor,
  };

export const getExecutor = (nodeType: NodeType["type"]) => {
  const executor = executorRegistry[nodeType];
  if (!executor) {
    throw new Error(`Executor not found for node type: ${nodeType}`);
  }
  return executor;
};
