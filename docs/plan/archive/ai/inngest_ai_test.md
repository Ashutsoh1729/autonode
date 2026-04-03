# Inngest + AI SDK — `generateText` Test Plan

A minimal integration test: wire up the Vercel AI SDK's `generateText` inside an Inngest function, trigger it from the Inngest Dev Server, and confirm end-to-end execution.

---

## Goal

Create one Inngest function that calls `generateText` (AI SDK v6) via the **AI Gateway**, logs the response, and returns it. No frontend, no DB — just a serverless function we can invoke from the Inngest dashboard.

---

## Prerequisites

| Item | Status |
|---|---|
| `ai` package installed | ✅ `ai@6.0.82` |
| `inngest` package installed | ✅ `inngest@3.52.0` |
| `@ai-sdk/gateway` available (transitive dep of `ai`) | ✅ `@3.0.42` |
| `AI_GATEWAY_API_KEY` in `.env` | ⚠️ Placeholder — needs real key |
| Provider API key (e.g. OpenAI `OPENAI_API_KEY`) | ❌ Needs to be added to `.env` |

> [!IMPORTANT]
> You need **two** keys:
> 1. `AI_GATEWAY_API_KEY` — authenticates your app with the Vercel AI Gateway
> 2. A provider key (e.g. `OPENAI_API_KEY`) — passed via BYOK so the gateway can forward requests to the provider
>
> Alternatively, if you want to skip the gateway for this test, you can install a **direct provider SDK** like `@ai-sdk/openai` and use it without the gateway. Both approaches are documented below.

---

## Proposed Changes

### 1. Environment Variables

#### [MODIFY] [.env](file:///Users/ashutoshhota/Coding/play_ground/ai_apps/autonode/.env)

Add the provider API key:
```diff
 # for ai
 AI_GATEWAY_API_KEY=your_ai_gateway_api_key
+OPENAI_API_KEY=your_openai_api_key
```

---

### 2. AI Service Layer

#### [MODIFY] [index.ts](file:///Users/ashutoshhota/Coding/play_ground/ai_apps/autonode/src/services/ai/index.ts)

Create a thin helper that wraps `generateText`. This keeps the AI logic reusable outside Inngest too.

**Option A — Via AI Gateway (BYOK)**
```typescript
import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";

export async function generateWithGateway(prompt: string) {
  const { text } = await generateText({
    model: gateway("openai/gpt-4o-mini"),
    prompt,
  });
  return text;
}
```
> The gateway provider reads `AI_GATEWAY_API_KEY` from env automatically and handles BYOK via `providerOptions` if needed.

**Option B — Direct provider (no gateway)**

If you haven't set up the AI Gateway key yet and just want to test quickly:

```bash
pnpm add @ai-sdk/openai
```

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function generateDirect(prompt: string) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt,
  });
  return text;
}
```
> `@ai-sdk/openai` reads `OPENAI_API_KEY` from env automatically.

---

### 3. Inngest Function

#### [NEW] [ai-generate.ts](file:///Users/ashutoshhota/Coding/play_ground/ai_apps/autonode/src/inngest/ai-generate.ts)

A new Inngest function that listens for an `ai/generate.text` event:

```typescript
import { inngest } from "./client";
import { generateWithGateway } from "@/services/ai";

export const aiGenerateText = inngest.createFunction(
  { id: "ai-generate-text" },
  { event: "ai/generate.text" },
  async ({ event, step }) => {
    const prompt = event.data.prompt;

    const result = await step.run("call-generate-text", async () => {
      const text = await generateWithGateway(prompt);
      console.log("AI Response:", text);
      return text;
    });

    return { prompt, result };
  }
);
```

**Key design decisions:**
- The `generateText` call is wrapped in `step.run()` so Inngest treats it as a **retriable step** — if the LLM call fails (rate limit, timeout, etc.), Inngest will auto-retry
- The event schema expects `{ data: { prompt: string } }`

---

### 4. Register the Function

#### [MODIFY] [route.ts](file:///Users/ashutoshhota/Coding/play_ground/ai_apps/autonode/src/app/api/inngest/route.ts)

Add the new function to the `serve()` call:

```diff
 import { helloWorld } from "@/inngest/functions";
+import { aiGenerateText } from "@/inngest/ai-generate";

 export const { GET, POST, PUT } = serve({
   client: inngest,
   functions: [
     helloWorld,
+    aiGenerateText,
   ],
 });
```

---

## File Summary

| File | Action | Purpose |
|---|---|---|
| `.env` | Modify | Add `OPENAI_API_KEY` |
| `src/services/ai/index.ts` | Modify | `generateText` wrapper |
| `src/inngest/ai-generate.ts` | New | Inngest function definition |
| `src/app/api/inngest/route.ts` | Modify | Register new function |

---

## Verification Plan

### Manual Testing via Inngest Dev Server

This is the primary verification method — no unit tests needed for this spike.

**Steps:**

1. **Set real API keys** in `.env`:
   - `AI_GATEWAY_API_KEY` (from Vercel Dashboard) — *only if using Option A*
   - `OPENAI_API_KEY` (from OpenAI) — *required for both options*

2. **Start the dev servers** (2 terminals or use `mprocs`):
   ```bash
   # Terminal 1 — Next.js
   pnpm dev

   # Terminal 2 — Inngest Dev Server
   pnpm inngest:dev
   ```

3. **Open Inngest Dev Server** at `http://localhost:8288`

4. **Verify the function is registered**: You should see `ai-generate-text` listed in the Functions tab alongside `hello-world`

5. **Trigger the function**: Go to the **Test** tab (or send an event), use this payload:
   ```json
   {
     "name": "ai/generate.text",
     "data": {
       "prompt": "What is 2 + 2? Reply in one word."
     }
   }
   ```

6. **Check the result**: The function run should complete successfully and the output should contain:
   ```json
   {
     "prompt": "What is 2 + 2? Reply in one word.",
     "result": "Four"
   }
   ```
   (The exact response text will vary, but it should be a coherent answer.)

7. **Check the logs**: The Next.js terminal should show `AI Response: Four` (or similar) from the `console.log`.

### What a successful test looks like

- ✅ Function appears in Inngest Dev Server
- ✅ Event triggers the function
- ✅ `step.run("call-generate-text")` completes without error
- ✅ Response contains a coherent AI-generated answer
- ✅ Function returns `{ prompt, result }`

---

## Open Decisions

1. **Gateway vs Direct provider?** — If you already have the `AI_GATEWAY_API_KEY`, go with Option A (gateway). If not, Option B (direct `@ai-sdk/openai`) is faster to set up for testing. Let me know which you prefer and I'll implement accordingly.

2. **Which model?** — Plan uses `gpt-4o-mini` (cheapest/fastest for testing). Can swap to any other model.
