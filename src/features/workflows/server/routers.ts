import { db } from "@/db";
import { connections, nodes, nodeType, workflows } from "@/db/schema";
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
import { Edge, Node } from "@xyflow/react";
import { createId } from "@paralleldrive/cuid2";

export const workflowsRouter = createTRPCRouter({
  // creating new workflow
  // status - Working Fine
  create: premiumProcedure.mutation(async ({ ctx }) => {
    const data = await db.transaction(async (tx) => {
      const workflowsData = await tx
        .insert(workflows)
        .values({
          name: generateSlug(3),
          userId: ctx.session.user.id,
        })
        .returning();

      const nodeData = await tx
        .insert(nodes)
        .values({
          id: createId(),
          workflowId: workflowsData[0].id,
          type: "INITIAL",
          position: { x: 0, y: 0 },
        })
        .returning();
      const finalData = {
        workflow: workflowsData,
        node: nodeData,
      };
      return finalData;
    });
    return data;
  }),

  // deleting a workflow
  // here we are using remove, as delete is a reserved keyword in js
  // status - Working Fine

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

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.enum(nodeType.enumValues).optional(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional(),
          }),
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes: data, edges } = input;
      const workflow = await db.query.workflows.findFirst({
        where: and(
          eq(workflows.id, id),
          eq(workflows.userId, ctx.session.user.id),
        ),
      });

      // throwing error
      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return await db.transaction(async (tx) => {
        // first delete all the nodes
        await tx.delete(nodes).where(eq(nodes.workflowId, workflow.id));

        // create new nodes
        await tx
          .insert(nodes)
          .values(data.map((node) => ({ ...node, workflowId: workflow.id })));

        // now we have to create connections
        if (edges.length > 0) {
          await tx.insert(connections).values(
            edges.map((edge) => ({
              workflowId: workflow.id,
              fromNodeId: edge.source,
              toNodeId: edge.target,
              toInput: edge.targetHandle,
              fromOutput: edge.sourceHandle,
            })),
          );
        }

        // update workflow updateAt value
        await tx.update(workflows).set({ updatedAt: new Date() });

        return workflow;
      });
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
        with: {
          nodes: true,
          connections: true,
        },
      });

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id.toString(),
        position: node.position as { x: number; y: number },
        data: node.data as Record<string, unknown>,
        type: node.type,
      }));

      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id.toString(),
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
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
