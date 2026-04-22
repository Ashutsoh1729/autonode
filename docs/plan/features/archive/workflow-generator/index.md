# AI Workflow Generator

## Overview

A feature that allows users to describe their workflow idea in plain language, and AI generates the workflow structure using available nodes.

## Implementation Steps

### Step 1: Create Frontend UI Structure

- [x] Add an "AI Generate" button below the "Add Node" button in the top-right Panel of `Editor`
- [x] Create a `Sheet` component to act as the AI generation interface (chat-like UI with a textarea and submit button)
- [x] Add a dummy placeholder function for the "Generate" action to test the UI flow

**Files:**
- `src/features/workflow-generator/components/ai-workflow-generator-sheet.tsx` (using shadcn Sheet)
- Integrate into `src/features/editor/components/editor.tsx`

### Step 2: Set up AI Service & Frontend tRPC Integration

- [x] Define the output schema (Zod) for the expected LLM response. *(Note: This is strictly required by the AI SDK's `generateObject` function so the LLM knows to return valid React Flow nodes & edges instead of plain text.*)
- [x] Create the AI generation service using `generateObject` and the schema
- [x] Add the `generate` procedure to a new tRPC router
- [x] Hook up the frontend `AiWorkflowGeneratorSheet` to call this tRPC mutation, managing loading and error states.

**Files:**
- `src/features/workflow-generator/types/workflow-generator.ts`
- `src/features/workflow-generator/services/workflow-generator.service.ts`
- `src/features/workflow-generator/server/workflow-generator.router.ts`
- Update `src/features/workflow-generator/components/ai-workflow-generator-sheet.tsx`

### Step 3: Prompt & Context Engineering

- [x] Explore the codebase (specifically `src/features/executors` and `src/features/triggers`) to inspect the input forms and Zod schemas for all available nodes (e.g. HTTP, AI, EMAIL, CRON).
- [x] Create a dedicated file `src/features/workflow-generator/services/prompt.ts` to hold the complete system prompt, isolating it from the function code.
- [x] Write the system prompt by including strict guidelines and field descriptions for the AI so it accurately outputs the `data` object required by each of those nodes.
- [x] Hook up this new dedicated prompt to the `generateObject` call inside `workflow-generator.service.ts`.

**Files:**
- Create `src/features/workflow-generator/services/prompt.ts`
- Update `src/features/workflow-generator/services/workflow-generator.service.ts`

### Step 4: Sync LLM Response to React Flow State

- [x] Create a hook or utility to safely format and merge the AI-generated nodes/edges into the existing React Flow state
- [x] Render the generated nodes onto the canvas (the user can then manually position and use the existing "Save" button)

---

## Modified Files

### New Files Created
- `src/features/workflow-generator/types/workflow-generator.ts`
- `src/features/workflow-generator/services/workflow-generator.service.ts`
- `src/features/workflow-generator/server/workflow-generator.router.ts`
- `src/features/workflow-generator/services/prompt.ts`

### Modified Files
- `src/features/editor/components/editor.tsx`
- `src/features/workflow-generator/components/ai-workflow-generator-sheet.tsx`
- `src/trpc/routers/_app.ts`
- `src/features/workflow-generator/hooks/workflow-generator.ts`

---

## Status: Completed

**Files:**
- Update `src/features/workflow-generator/components/ai-workflow-generator-sheet.tsx`

## Available Node Types

| Type | Description |
|------|-------------|
| INITIAL | Start node |
| MANUAL_TRIGGER | Manual trigger |
| CRON_TRIGGER | Scheduled trigger |
| HTTP_REQUEST | API call |
| AI | AI model call |
| EMAIL | Send email |

## Key Files to Create

```
src/features/workflow-generator/
├── types/
│   └── workflow-generator.ts       # Output schema
├── services/
│   └── workflow-generator.service.ts  # AI logic
├── server/
│   └── workflow-generator.router.ts   # tRPC endpoint
└── components/
    └── ai-workflow-generator-dialog.tsx  # UI
```

## Notes

- Use existing AI SDK integration from `src/services/ai/`
- Use React Flow node structure from existing editor
- Reuse existing workflow creation patterns

---

## Status: In Progress