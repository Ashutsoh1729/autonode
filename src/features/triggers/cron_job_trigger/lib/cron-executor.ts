import { NodeExecutor } from "@/features/executions/lib/types";
import { cronTriggerChannel } from "@/inngest/channels/cron-trigger";

export const cronExecutor: NodeExecutor<Record<string, unknown>> = async ({
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(cronTriggerChannel().status({ nodeId, status: "loading" }));

  try {
    const res = await step.run("cron-trigger", async () => {
      return {};
    });

    await publish(cronTriggerChannel().status({ nodeId, status: "success" }));

    return res;
  } catch (error) {
    await publish(cronTriggerChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};
