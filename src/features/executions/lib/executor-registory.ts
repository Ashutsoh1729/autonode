import { NodeType } from "@/db/schema";
import { NodeExecutor } from "./types";
import { manualExecutor } from "@/features/triggers/lib/manual-executor";
import { httpNodeExecutor } from "./http.executor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const executorRegistry: Partial<Record<NodeType["type"], NodeExecutor<any>>> =
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
