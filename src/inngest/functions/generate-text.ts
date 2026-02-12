import { inngest } from "../client";
import { generateWithGemini } from "@/services/ai";

/**
 * Inngest function: ai/generate.text
 *
 * Receives a prompt via the event data, calls Gemini's generateText,
 * and returns the AI-generated response.
 *
 * Uses step.ai.wrap() instead of step.run() for:
 * - AI-specific observability (token usage, prompts tracked in Inngest dashboard)
 * - Durable retry with AI-aware error handling
 */
export const aiGenerateText = inngest.createFunction(
    {
        id: "ai-generate-text",
        retries: 2, // limit retries — quota errors won't resolve with retries
    },
    { event: "ai/generate.text" },
    async ({ event, step }) => {
        const prompt = event.data.prompt;

        const result = await step.ai.wrap(
            "call-generate-text",
            generateWithGemini,
            prompt,
        );

        return { prompt, result };
    },
);
