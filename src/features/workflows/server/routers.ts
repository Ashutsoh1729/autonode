import { db } from "@/db";
import { user, workflows } from "@/db/schema";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import * as z from "zod";

export const workflowsRouter = createTRPCRouter({
  // creating new workflow
  create: premiumProcedure.mutation(({ ctx }) => {
    return db
      .insert(workflows)
      .values({
        name: "workflow",
        userId: ctx.session.user.id,
      })
      .returning();
  }),

  // deleting a workflow
  // here we are using remove, as delete is a reserved keyword in js
  remove: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return db
        .delete(workflows)
        .where(
          and(eq(workflows.id, input.id), eq(user.id, ctx.session.user.id)),
        );
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return db
        .update(workflows)
        .set({ name: input.name })
        .where(
          and(eq(workflows.id, input.id), eq(user.id, ctx.session.user.id)),
        );
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return db.query.workflows.findFirst({
        where: and(
          eq(workflows.id, input.id),
          eq(user.id, ctx.session.user.id),
        ),
      });
    }),

  getMany: protectedProcedure.query(({ ctx }) => {
    return db.query.workflows.findMany({
      where: and(eq(workflows.userId, ctx.session.user.id)),
    });
  }),
});
