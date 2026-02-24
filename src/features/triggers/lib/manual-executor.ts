import { NodeExecutor } from "@/features/executions/lib/types";

// as for manual trigger data does not exists
export const manualExecutor: NodeExecutor<Record<string, unknown>> = async ({
  nodeId,
  context,
  step,
}) => {
  //  TODO: Publish "loading " state for manual trigger

  console.log("Manual trigger is getting executed.");
  const res = await step.run("manual-trigger", async () => {
    return {};
  });

  console.log("Manual trigger execution completed");

  // TODO: Publish "success" state for manual trigger

  return res;
};
