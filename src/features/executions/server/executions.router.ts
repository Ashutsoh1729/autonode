import { db } from "@/db";
import { executions, executionNodes, workflows } from "@/db/schema";
import { PAGINATION } from "@/lib/constants";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { and, desc, eq } from "drizzle-orm";
import * as z from "zod";
import { TRPCError } from "@trpc/server";

export const executionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        workflowId: z.number(),
        triggerType: z.enum(["MANUAL", "CRON", "WEBHOOK"]).default("MANUAL"),
        input: z.record(z.string(), z.any()).default({}),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await db.query.workflows.findFirst({
        where: and(
          eq(workflows.id, input.workflowId),
          eq(workflows.userId, ctx.session.user.id),
        ),
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      const execution = await db
        .insert(executions)
        .values({
          workflowId: input.workflowId,
          triggerType: input.triggerType,
          input: input.input,
          status: "PENDING",
        })
        .returning();

      return execution[0];
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["PENDING", "RUNNING", "SUCCESS", "FAILED"]),
        output: z.record(z.string(), z.any()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const execution = await db.query.executions.findFirst({
        where: eq(executions.id, input.id),
        with: {
          workflow: true,
        },
      });

      if (!execution || execution.workflow.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Execution not found",
        });
      }

      const updateData: Record<string, unknown> = {
        status: input.status,
      };

      if (input.status === "SUCCESS" || input.status === "FAILED") {
        updateData.completedAt = new Date();
      }

      if (input.output) {
        updateData.output = input.output;
      }

      const updated = await db
        .update(executions)
        .set(updateData)
        .where(eq(executions.id, input.id))
        .returning();

      return updated[0];
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const execution = await db.query.executions.findFirst({
        where: eq(executions.id, input.id),
        with: {
          workflow: true,
        },
      });

      if (!execution || execution.workflow.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Execution not found",
        });
      }

      return db
        .delete(executions)
        .where(eq(executions.id, input.id))
        .returning();
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        workflowId: z.number(),
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, workflowId } = input;

      const [items, totalCount] = await Promise.all([
        db.query.executions.findMany({
          where: eq(executions.workflowId, workflowId),
          limit: pageSize,
          offset: (page - 1) * pageSize,
          orderBy: desc(executions.triggeredAt),
        }),
        db.$count(executions, eq(executions.workflowId, workflowId)),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;

      const [items, totalCount] = await Promise.all([
        db
          .select({
            id: executions.id,
            workflowId: executions.workflowId,
            status: executions.status,
            triggeredAt: executions.triggeredAt,
            completedAt: executions.completedAt,
            triggerType: executions.triggerType,
            workflowName: workflows.name,
          })
          .from(executions)
          .innerJoin(workflows, eq(executions.workflowId, workflows.id))
          .where(eq(workflows.userId, ctx.session.user.id))
          .limit(pageSize)
          .offset((page - 1) * pageSize)
          .orderBy(desc(executions.triggeredAt)),
        db.$count(executions),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const execution = await db.query.executions.findFirst({
        where: and(
          eq(executions.id, input.id),
        ),
        with: {
          workflow: true,
          nodes: {
            orderBy: [executionNodes.id],
          },
        },
      });

      if (!execution || execution.workflow.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Execution not found",
        });
      }

      return execution;
    }),
});