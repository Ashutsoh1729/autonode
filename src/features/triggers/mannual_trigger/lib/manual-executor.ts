import { NodeExecutor } from "@/features/executions/lib/types";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";

// as for manual trigger data does not exists
export const manualExecutor: NodeExecutor<Record<string, unknown>> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(manualTriggerChannel().status({ nodeId, status: "loading" }));

  try {
    const res = await step.run("manual-trigger", async () => {
      return {};
    });

    await publish(manualTriggerChannel().status({ nodeId, status: "success" }));

    return res;
  } catch (error) {
    await publish(manualTriggerChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
