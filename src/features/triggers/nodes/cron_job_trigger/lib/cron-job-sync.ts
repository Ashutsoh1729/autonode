import { config } from "@/lib/config";

import { and, eq } from "drizzle-orm";
import {
  createJob,
  deleteJob,
  updateJob,
} from "@/features/triggers/nodes/cron_job_trigger/lib/cron";
import { nodes } from "@/db/schema";
import { db } from "@/db";

export async function syncCronJobs(
  workflowId: number,
  newNodes: (typeof nodes.$inferSelect)[],
  existingNodes: (typeof nodes.$inferSelect)[] = [],
) {
  const appUrl = config.appUrl;
  const webhookSecret = config.cronWebhookSecret;
  const isDev = process.env.NODE_ENV === "development";
  const baseUrl = isDev && config.ngrokUrl ? config.ngrokUrl : appUrl;

  if (!webhookSecret) {
    console.error("CRON_WEBHOOK_SECRET not configured, skipping cron sync");
    return;
  }

  // Use provided existing nodes or fetch from database if not provided
  const existingCronNodes =
    existingNodes.length > 0
      ? existingNodes.filter((n) => n.type === "CRON_TRIGGER")
      : await db
          .select()
          .from(nodes)
          .where(
            and(
              eq(nodes.workflowId, workflowId),
              eq(nodes.type, "CRON_TRIGGER"),
            ),
          );

  const newCronNodes = newNodes.filter((n) => n.type === "CRON_TRIGGER");
  const newCronNodeIds = new Set(newCronNodes.map((n) => n.id));

  // Delete cron jobs for nodes that were removed
  for (const existingNode of existingCronNodes) {
    if (!newCronNodeIds.has(existingNode.id)) {
      const existingData = existingNode.data as Record<string, unknown>;
      if (existingData.jobId) {
        try {
          await deleteJob(existingData.jobId as number);
        } catch (e) {
          console.error("Failed to delete cron job:", e);
        }
      }
    }
  }

  // Create/update cron jobs for new or existing nodes
  for (const newNode of newCronNodes) {
    const nodeData = newNode.data as Record<string, unknown>;
    const jobId = nodeData.jobId as number | undefined;
    const cronExpression = nodeData.cronExpression as string | undefined;
    const enabled = nodeData.enabled !== false;
    const timezone = (nodeData.timezone as string) || "UTC";

    if (!cronExpression) continue;

    const webhookUrl = `${baseUrl}/api/cron-webhook?workflowId=${workflowId}&nodeId=${newNode.id}`;

    if (jobId) {
      try {
        await updateJob(jobId, {
          url: webhookUrl,
          cronExpression,
          enabled,
          webhookSecret,
          timezone,
        });
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (errorMessage.includes("404")) {
          console.log(
            `Job ${jobId} not found on cron-job.org, creating new one`,
          );
          try {
            const newJobId = await createJob({
              url: webhookUrl,
              cronExpression,
              enabled,
              webhookSecret,
              timezone,
            });
            await db
              .update(nodes)
              .set({ data: { ...nodeData, jobId: newJobId } })
              .where(eq(nodes.id, newNode.id));
          } catch (createError) {
            console.error("Failed to create new cron job:", createError);
          }
        } else {
          console.error("Failed to update cron job:", e);
        }
      }
    } else {
      try {
        const newJobId = await createJob({
          url: webhookUrl,
          cronExpression,
          enabled,
          webhookSecret,
          timezone,
        });
        await db
          .update(nodes)
          .set({ data: { ...nodeData, jobId: newJobId } })
          .where(eq(nodes.id, newNode.id));
      } catch (e) {
        console.error("Failed to create cron job:", e);
      }
    }
  }
}
