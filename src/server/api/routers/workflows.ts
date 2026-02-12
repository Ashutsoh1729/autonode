import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { workflows as workflowsTable } from "@/db/schema";
import { inngest } from "@/inngest/client";

export const workflowsRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(() => {
    return db.query.workflows.findMany();
  }),
  createWorkflows: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "ashutosh@gamil.com",
      },
    });
    return db
      .insert(workflowsTable)
      .values({
        name: "testing-workflow",
      })
      .returning();
  }),

  /** Test AI — fires the Inngest ai/generate.text function with a hardcoded prompt */
  generateText: protectedProcedure.mutation(async () => {
    const result = await inngest.send({
      name: "ai/generate.text",
      data: {
        prompt:
          "Explain what Inngest is in 2 sentences. Keep it concise and technical.",
      },
    });
    return { sent: true, ids: result.ids };
  }),
});
