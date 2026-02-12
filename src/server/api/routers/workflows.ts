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
});
