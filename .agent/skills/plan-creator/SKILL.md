---
name: plan-creator
description: Instructions and workflow for creating structured feature plans before implementation.
---

# Planning Workflow

This document outlines the planning workflow for implementing features in AutoNode.

---

## Currently Active Plans

> **For Implementation**: Reference the detailed plan in the respective category directory before implementing.

| Feature | Category | Plan File | Status |
|---------|----------|-----------|--------|
| AI Node Implementation | features | docs/plan/features/ai_node/ai-node-implementation.md | in_progress |

*To add an active plan, create it in `docs/plan/<category>/<feature>.md` and update this table.*

---

## Overview

Before implementing any feature, create a structured plan. This ensures:
- Clear implementation roadmap
- Checkpoint tracking for resumability
- Reference for future changes

---

## Plan Structure

### Major Project Parts (`docs/plan/`)

For overarching project infrastructure, create plans directly in `docs/plan/`:

```
docs/plan/<feature-name>/
```

Categories: `init/`, `db/`, `auth/`, `api/`, etc.

Example: `docs/plan/init/` - Contains project initialization and setup plans

### Feature Implementation (`docs/plan/features/`)

For specific feature implementations, create plans in `docs/plan/features/`:

```
docs/plan/features/<feature-name>/
```

Categories: `ai_node/`, `node/`, `http-node/`, etc.

Example: `docs/plan/features/ai_node/` - Contains AI node implementation plan (can have multiple plan files: `index.md`, `credentials.md`, etc.)

---

## Creating Plans

### Step 1: Check for Existing Plan Directory

Before creating a new plan, first check if a related directory already exists:

- Check `docs/plan/<category>/` for major project parts
- Check `docs/plan/features/` for feature implementations

If a related directory exists (e.g., `docs/plan/features/email-node/`), add the new plan file there instead of creating a new directory.

### Step 2: Create Plan Directory & File

**For major project parts:**
```
docs/plan/<feature-name>/index.md
```

**For features:**
```
docs/plan/features/<feature-name>/index.md
```

Note: A plan directory can contain multiple plan files (e.g., `index.md`, `credentials.md`, `api-design.md`) to organize different aspects of the feature.

### Step 3: Write the Plan

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
1. Mark all tasks as `[x]` completed in the plan file
2. Move **entire plan directory** to `docs/plan/<category>/archive/<feature>/` or `docs/plan/features/archive/<feature>/`
3. Add "Status: Completed" at end of plan
4. Update the "Currently Active Plans" table above to remove the entry

---

## Example Plans

Reference existing plans:
- Major parts: `docs/plan/init/` - Project initialization workflow
- Features: `docs/plan/features/node.md` - Node implementation guide
- Features: `docs/plan/features/ai_node/` - AI node implementation

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
   - Check existing plan directories in `docs/plan/` and `docs/plan/features/` first
   - If related directory exists, add new plan file there
   - If new directory needed, create `docs/plan/<category>/<feature>/index.md`
   - Update the "Currently Active Plans" table above with the new feature

3. **Implementation Phase**:
   - Check the "Currently Active Plans" table to find current feature
   - Read the detailed plan from the respective category directory
   - Execute the implementation, updating checklist as tasks complete
   - If error occurs, reference the last successful step in the plan file

4. **Completion**:
   - Mark all tasks as `[x]` done in the plan file
   - Add "Status: Completed" at end of plan
   - Ask user for permission before moving to archive
   - Update the "Currently Active Plans" table to remove the entry