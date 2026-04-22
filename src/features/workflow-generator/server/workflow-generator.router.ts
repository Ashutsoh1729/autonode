import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { generateWorkflowNodes } from "../services/workflow-generator.service";
import { TRPCError } from "@trpc/server";

export const workflowGeneratorRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(z.object({ prompt: z.string().min(1) }))
    .mutation(async ({ input }) => {
      try {
        const result = await generateWorkflowNodes(input.prompt);
        return result;
      } catch (error) {
        console.error("AI Generation failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate workflow. Please try again.",
        });
      }
    }),
});
