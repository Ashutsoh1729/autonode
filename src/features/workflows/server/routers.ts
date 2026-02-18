import { db } from "@/db";
import { user, workflows } from "@/db/schema";
import { PAGINATION } from "@/lib/constants";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { and, desc, eq, ilike } from "drizzle-orm";
import * as z from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

export const workflowsRouter = createTRPCRouter({
  // creating new workflow
  create: premiumProcedure.mutation(({ ctx }) => {
    return db
      .insert(workflows)
      .values({
        name: generateSlug(3),
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
          and(
            eq(workflows.id, input.id),
            eq(workflows.userId, ctx.session.user.id),
          ),
        )
        .returning();
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return db
        .update(workflows)
        .set({ name: input.name, updatedAt: new Date() })
        .where(
          and(
            eq(workflows.id, input.id),
            eq(workflows.userId, ctx.session.user.id),
          ),
        )
        .returning();
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const workflow = await db.query.workflows.findFirst({
        where: and(
          eq(workflows.id, input.id),
          eq(workflows.userId, ctx.session.user.id),
        ),
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }
      return workflow;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        db.query.workflows.findMany({
          where: and(
            eq(workflows.userId, ctx.session.user.id),
            search ? ilike(workflows.name, `%${search}%`) : undefined,
          ),
          limit: pageSize,
          offset: (page - 1) * pageSize,
          orderBy: desc(workflows.updatedAt),
        }),

        db.$count(
          workflows,
          and(
            eq(workflows.userId, ctx.session.user.id),
            search ? ilike(workflows.name, `%${search}%`) : undefined,
          ),
        ),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
