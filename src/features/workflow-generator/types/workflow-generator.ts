import { z } from "zod";
import { nodeType } from "@/db/schema";

export const workflowGeneratorSchema = z.object({
  nodes: z.array(
    z.object({
      id: z.string().describe("A unique identifier for this node (e.g. 'node-1')"),
      type: z.enum(nodeType.enumValues).describe("The functional type of the node"),
      position: z.object({
        x: z.number(),
        y: z.number()
      }).describe("The 2D layout position. Provide sequentially staggered coordinates (e.g., x=0, y=0; x=0, y=150; etc.) to prevent overlapping."),
      data: z.record(z.string(), z.any()).optional().describe("Minimal scaffolding data for this node type if necessary")
    })
  ).describe("The generated workflow nodes"),
  edges: z.array(
    z.object({
      source: z.string().describe("The ID of the source node where this edge originates"),
      target: z.string().describe("The ID of the target node where it connects"),
    })
  ).describe("The connections defining execution order")
});

export type WorkflowGeneratorOutput = z.infer<typeof workflowGeneratorSchema>;
