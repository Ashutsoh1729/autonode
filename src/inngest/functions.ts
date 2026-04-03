import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { db } from "@/db";
import { executions, workflows } from "@/db/schema";
import { eq } from "drizzle-orm";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/executors/lib/executor-registory";
import { httpRequestChannel } from "./channels/http-request";

export { aiGenerateText } from "./functions/generate-text";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { event: "workflow/execute", channels: [httpRequestChannel()] },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is required");
    }

    const executionRecord = await step.run("create-execution-record", async () => {
      const execution = await db
        .insert(executions)
        .values({
          workflowId,
          triggerType: event.data.triggerType || "MANUAL",
          input: event.data.initialData || {},
          status: "RUNNING",
        })
        .returning();
      return execution[0];
    });

    try {
      const nodes = await step.run("run-workflow", async () => {
        const workflow = await db.query.workflows.findFirst({
          with: {
            nodes: true,
            connections: true,
          },
          where: eq(workflows.id, workflowId),
        });
        if (!workflow) {
          throw new Error("Workflow not found");
        }

        const sortedNodes = topologicalSort(workflow.nodes, workflow.connections);
        return sortedNodes;
      });

      let context = event.data.initialData || {};

      for (const node of nodes) {
        const executor = getExecutor(node.type);
        context = await executor({
          data: node.data as Record<string, unknown>,
          nodeId: node.id,
          context,
          step,
          publish,
        });
      }

      await step.run("update-execution-success", async () => {
        await db
          .update(executions)
          .set({
            status: "SUCCESS",
            completedAt: new Date(),
            output: context,
          })
          .where(eq(executions.id, executionRecord.id));
      });

      return context;
    } catch (error) {
      await step.run("update-execution-failed", async () => {
        await db
          .update(executions)
          .set({
            status: "FAILED",
            completedAt: new Date(),
          })
          .where(eq(executions.id, executionRecord.id));
      });

      throw error;
    }
  },
);
