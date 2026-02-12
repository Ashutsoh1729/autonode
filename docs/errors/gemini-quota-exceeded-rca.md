# RCA: Gemini `AI_RetryError` — Deprecated Model with Zero Free Tier Quota

**Date:** 2026-02-12  
**Severity:** Low (configuration issue)  
**Status:** ✅ Resolved

---

## Error

```
AI_RetryError: Failed after 3 attempts. Last error: You exceeded your current quota
Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests
limit: 0, model: gemini-2.0-flash
```

## Root Cause

The code was using `gemini-2.0-flash`, which had its **free tier quota set to `0`** after Google made `gemini-2.5-flash` the default model (GA June 2025). Older models lose free tier allocation when superseded — the `limit: 0` in the error confirmed this.

Upgrading to `gemini-2.5-flash` resolved the issue immediately.

## What made it worse

1. **AI SDK retries** — `generateText` retries 3 times by default, adding ~55s of waiting on a non-transient error
2. **Inngest retries on top** — `step.run()` triggers Inngest-level retries, compounding the delay

## Fixes Applied

### 1. Upgraded model: `gemini-2.0-flash` → `gemini-2.5-flash` *(actual fix)*

```diff
-model: google("gemini-2.0-flash"),
+model: google("gemini-2.5-flash"),
```

This directly resolved the quota error — `gemini-2.5-flash` is the current default with active free tier allocation.

### 2. Switched `step.run()` → `step.ai.wrap()`

```diff
-const result = await step.run("call-generate-text", async () => {
-    const text = await generateWithGemini(prompt);
-    return text;
-});
+const result = await step.ai.wrap(
+    "call-generate-text",
+    generateWithGemini,
+    prompt,
+);
```

`step.ai.wrap` provides AI-specific observability (token usage, prompt tracking) in the Inngest dashboard.

### 3. Limited Inngest retries to 2

```diff
-{ id: "ai-generate-text" },
+{ id: "ai-generate-text", retries: 2 },
```

Prevents burning through retries on non-transient errors like quota limits.

## Verification

After applying fixes, the function produced a successful response:

> *"Inngest is a serverless event-driven framework that enables developers to turn regular functions into durable, reliable background jobs and stateful workflows. It automatically handles event ingestion, retries, state management, and long-running process orchestration for complex application logic without bespoke infrastructure."*

## Files Changed

| File | Change |
|---|---|
| [index.ts](file:///Users/ashutoshhota/Coding/play_ground/ai_apps/autonode/src/services/ai/index.ts) | Model: `gemini-2.0-flash` → `gemini-2.5-flash` |
| [generate-text.ts](file:///Users/ashutoshhota/Coding/play_ground/ai_apps/autonode/src/inngest/functions/generate-text.ts) | `step.run` → `step.ai.wrap`, `retries: 2` |

## Lessons

- **Keep models up to date** — older Gemini models lose free tier quota when superseded
- **`limit: 0`** in quota errors often means the model has been deprioritized, not that you've exhausted usage
- **Use `step.ai.wrap`** for AI calls in Inngest — better observability than generic `step.run`
