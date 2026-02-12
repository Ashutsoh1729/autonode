import { generateText } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Generate text using Google Gemini via the AI SDK.
 * Reads GOOGLE_GENERATIVE_AI_API_KEY from env automatically.
 */
export async function generateWithGemini(prompt: string) {
    const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
    });
    return text;
}
