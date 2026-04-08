import { db } from "@/db";
import { credentials } from "@/db/schema";
import { PAGINATION } from "@/lib/constants";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { and, desc, eq, ilike } from "drizzle-orm";
import * as z from "zod";
import { TRPCError } from "@trpc/server";
import { decrypt, encrypt } from "@/lib/security";

export const credentialsRouter = createTRPCRouter({
  // creating new workflow
  // status - Working Fine
  create: premiumProcedure
    .input(
      z.object({
        name: z.string(),
        key: z.string(),
        provider: z.enum(["OPENAI", "ANTHROPIC", "GEMINI", "RESEND"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Endcode the key before saving it

      const encryptedKey = encrypt(input.key);

      const credential = await db
        .insert(credentials)
        .values({
          name: input.name,
          value: encryptedKey,
          provider: input.provider,
          userId: ctx.session.user.id,
        })
        .returning();
      return credential;
    }),

  // deleting a workflow
  // here we are using remove, as delete is a reserved keyword in js
  // status - Working Fine

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return db
        .delete(credentials)
        .where(eq(credentials.id, input.id))
        .returning();
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        key: z.optional(z.string()),
        name: z.optional(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.key && !input.name) {
        const encryptedKey = encrypt(input.key);
        await db.update(credentials).set({
          value: encryptedKey,
        });
      } else if (input.name && !input.key) {
        await db.update(credentials).set({
          name: input.name,
        });
      } else {
        // TODO: Check no logical error is there
        const encryptedKey = encrypt(input.key!);
        await db.update(credentials).set({
          name: input.name,
          value: encryptedKey,
        });
      }
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const credential = await db.query.credentials.findFirst({
        where: and(eq(credentials.id, input.id)),
      });

      if (!credential) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found",
        });
      }
      return {
        ...credential,
        value: decrypt(credential.value),
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
      // TODO: We don't need to decrypt here, i guess
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        db.query.credentials.findMany({
          where: and(
            eq(credentials.userId, ctx.session.user.id),
            search ? ilike(credentials.name, `%${search}%`) : undefined,
          ),
          limit: pageSize,
          offset: (page - 1) * pageSize,
          orderBy: desc(credentials.updatedAt),
        }),
        db.$count(
          credentials,
          and(
            eq(credentials.userId, ctx.session.user.id),
            search ? ilike(credentials.name, `%${search}%`) : undefined,
          ),
        ),
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
});
