import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { workflowGeneratorSchema } from "../types/workflow-generator";
import { getSystemPrompt } from "./prompt";

export async function generateWorkflowNodes(prompt: string) {
  const { object } = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: workflowGeneratorSchema,
    prompt: getSystemPrompt(prompt),
  });

  return object;
}
