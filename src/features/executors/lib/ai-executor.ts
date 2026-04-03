import { AiRequestNodeData } from "../nodes/ai_node/components/ai-node";
import { NonRetriableError } from "inngest";
import { generateText, LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

import { anthropic } from "@ai-sdk/anthropic";
import { aiRequestChannel } from "@/inngest/channels/ai-request";
import { NodeExecutor } from "./types";
import { decrypt } from "@/lib/security";
import { resolveVariables } from "@/lib/variable-resolution";

// TODO: Add more AI providers as needed (OpenAI, Anthropic, etc.)

function resolveModel(modelId: string): LanguageModel {
  // Gemini models
  if (modelId.startsWith("gemini")) return google(modelId);
  // OpenAI models
  if (
    modelId.startsWith("gpt") ||
    modelId.startsWith("o1") ||
    modelId.startsWith("o3")
  )
    return openai(modelId);
  // Anthropic models
  if (modelId.startsWith("claude")) return anthropic(modelId);

  throw new NonRetriableError(`Unsupported model: ${modelId}`);
}

export const aiNodeExecutor: NodeExecutor<AiRequestNodeData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(aiRequestChannel().status({ nodeId, status: "loading" }));

  if (!data.prompt) {
    await publish(aiRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("No AI prompt is configured");
  }

  if (!data.variableName) {
    await publish(aiRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("No AI variable name is configured");
  }

  // Default values
  const model = data.model || "gemini-2.5-flash";
  const temperature = data.temperature ?? 0.7;
  const maxTokens = data.maxTokens;

  const result = await step.run("ai-trigger", async () => {
    // TODO: Implement credential-based API key retrieval
    // For now, we'll rely on environment variables as the ai-sdk does

    // TODO: Support multiple providers based on model selection
    // For now, we'll use Google Gemini as default

    // Debug: Log the prompt and context to see what's happening
    console.log('[AI Executor] Original prompt:', data.prompt);
    console.log('[AI Executor] Context keys:', Object.keys(context));
    console.log('[AI Executor] Context:', JSON.stringify(context, null, 2));

    // Resolve variable references in the prompt using workflow context
    const resolvedPrompt = resolveVariables(data.prompt, context);

    console.log('[AI Executor] Resolved prompt:', resolvedPrompt);

    const { text } = await generateText({
      model: resolveModel(model),
      prompt: resolvedPrompt,
      temperature,
      maxOutputTokens: maxTokens ? Number(maxTokens) : undefined,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    const responsePayload = {
      aiResponse: {
        text: text,
        model: model,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  await publish(
    aiRequestChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return result;
};
