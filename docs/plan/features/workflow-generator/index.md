# AI Workflow Generator

## Overview

A feature that allows users to describe their workflow idea in plain language, and AI generates the workflow structure using available nodes.

## Implementation Steps

### Step 1: Create Output Schema

- [ ] Define TypeScript interface for AI-generated workflow
- [ ] Include: nodes (type, name, position, data), connections (fromNodeId, toNodeId)

**Files:**
- `src/features/workflow-generator/types/workflow-generator.ts`

### Step 2: Create AI Generator Service

- [ ] Use existing `generateText` from AI SDK (already in project)
- [ ] Build prompt with available node types
- [ ] Use `generateObject` for structured output

**Files:**
- `src/features/workflow-generator/services/workflow-generator.service.ts`

**Prompt structure:**
- List available nodes: INITIAL, MANUAL_TRIGGER, CRON_TRIGGER, HTTP_REQUEST, AI, EMAIL
- Each node has required fields (id, type, position, data)
- Output valid nodes + connections

### Step 3: Create tRPC Router

- [ ] Add `generate` procedure
- [ ] Input: user description string
- [ ] Output: generated workflow structure

**Files:**
- `src/features/workflow-generator/server/workflow-generator.router.ts`

### Step 4: Create Frontend UI

- [ ] Add "AI Generate" button in editor header
- [ ] Modal with textarea for description
- [ ] Show preview before saving

**Files:**
- `src/features/workflow-generator/components/ai-workflow-generator-dialog.tsx`
- Integrate into `src/features/editor/components/editor-header.tsx`

### Step 5: Save Generated Workflow

- [ ] Convert AI output to actual workflow in database
- [ ] Use existing workflow creation logic

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