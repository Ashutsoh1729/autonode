# Planning Workflow

This document outlines the planning workflow for implementing features in AutoNode.

---

## Currently Active Plans

> **For Implementation**: Reference the detailed plan in the respective category directory before implementing.

| Feature | Category | Plan File | Status |
|---------|----------|-----------|--------|
| AI Node Implementation | ai_node | docs/plan/features/ai_node/ai-node-implementation.md | in_progress |

*To add an active plan, create it in `docs/plan/<category>/<feature>.md` and update this table.*

---

## Overview

Before implementing any feature, create a structured plan in the `docs/plan/<category>/` directory. This ensures:
- Clear implementation roadmap
- Checkpoint tracking for resumability
- Reference for future changes

---

## Creating Plans

### Step 1: Create Plan Directory & File

Create a new plan file at:
```
docs/plan/<category>/<feature-name>.md
```

Categories: `ai/`, `auth/`, `db/`, `react-flow/`, `trpc/`, etc.

### Step 2: Write the Plan

Each plan file should contain:

```markdown
# <Feature Name>

## Description
Brief description of what this feature does.

## Goals
- Goal 1
- Goal 2

## Implementation Steps

### Step 1: <Title>
- [ ] Task 1
- [ ] Task 2

### Step 2: <Title>
- [ ] Task 1
- [ ] Task 2

### Step 3: <Title>
- [ ] Task 1
- [ ] Task 2

## Files to Modify
- `src/path/to/file1.ts`
- `src/path/to/file2.tsx`

## Considerations
- Any edge cases or important notes
```

---

## Implementing Plans

> **Important**: Always check the "Currently Active Plans" table above to see which feature is currently being worked on.

### Step 3: Execute with Checkpoint Tracking

When implementing:
1. Mark each task as `[x]` when completed
2. If interrupted/error occurs, the plan serves as resume point
3. Reference the last `[x]` marked task to continue

### Step 4: Mark Complete

When finished:
1. Mark all tasks as `[x]` completed
2. Rename file to `done.md` or move to `done/` subfolder
3. Update the "Currently Active Plans" table above to remove the entry

---

## Example Plan

See existing plans for reference:
- `docs/plan/trpc/execution.md`
- `docs/plan/auth/implementation.md`
- `docs/plan/db/setup.md`

---

## Key Principles

1. **Be Specific**: Each task should be actionable and verifiable
2. **Small Steps**: Break into small, manageable tasks
3. **Checkpoint Frequently**: Mark progress as you go
4. **Reference Existing Code**: Look at similar features in `docs/plan/` for patterns
5. **Update on Resume**: When resuming after error, update the plan with what was actually done

---

## Using with OpenCode

When working with OpenCode agent:

1. **Read First**: Read `docs/plan/init.md` to understand the workflow

2. **Planning Phase**: 
   - Create/update detailed plan in `docs/plan/<category>/<feature>.md`
   - Update the "Currently Active Plans" table above with the new feature

3. **Implementation Phase**:
   - Check the "Currently Active Plans" table to find current feature
   - Read the detailed plan from the respective category directory
   - Execute the implementation, updating checklist as tasks complete
   - If error occurs, reference the last successful step in the plan file

4. **Completion**:
   - Mark all tasks as `[x]` done in the plan file
   - Rename to `done.md` or move to `done/` folder
   - Update the "Currently Active Plans" table to remove the entry
