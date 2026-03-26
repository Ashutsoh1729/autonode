import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { db } from "@/db";
import { workflows } from "@/db/schema";
import { eq } from "drizzle-orm";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/executions/lib/executor-registory";
import { httpRequestChannel } from "./channels/http-request";

export { aiGenerateText } from "./functions/generate-text";

// TODO: Change the execute-http name, as it is very specific
export const executeWorkflow = inngest.createFunction(
  { id: "execute-http-workflow" },
  { event: "workflow/execute-http", channels: [httpRequestChannel()] },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is required");
    }

    const nodes = await step.run("run-workflow", async () => {
      const workflow = await db.query.workflows.findFirst({
        with: {
          nodes: true,
          connections: true,
        },
        where: eq(workflows.id, workflowId),
      });
      // NOTE: Consider for if the database connection is busy, how to retry it for some time, normal error will let the inngest to try for atleast 3 times
      if (!workflow) {
        throw new Error("Workflow not found");
      }

      const sortedNodes = topologicalSort(workflow.nodes, workflow.connections);
      return sortedNodes;
    });

    let context = event.data.initialData || {};

    for (const node of nodes) {
      const executor = getExecutor(node.type);
      // here the executor in itself returns the context
      context = await executor({
        //  TODO: current patch up work
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return context;
  },
);
