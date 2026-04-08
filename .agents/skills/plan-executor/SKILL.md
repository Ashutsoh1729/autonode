---
name: plan-executor
description: Updates plan file checkboxes and tracks progress when executing feature plans from @docs/plan/
---

# Plan Executor Skill

## Overview

This skill provides instructions for executing feature plans from `@docs/plan/`.

## Instructions

When executing a plan from `@docs/plan/...`:

### 1. Update Checkboxes

After completing each implementation step, update the plan file to mark the checkbox as complete:
- Change `[ ]` to `[x]` for completed tasks
- Keep `[ ]` for pending tasks

### 2. Track Progress

- After completing ALL implementation steps, update the status at the end of the plan
- Change "Status: Pending" to "Status: Completed"

### 3. Modified Files Section

Ensure the plan file has a "Modified Files" section listing:
- **New Files Created**: All new files created during implementation
- **Modified Files**: All existing files that were modified

### 4. Archive Completed Plans

When a plan is fully completed:
- Move the plan directory to `@docs/plan/<category>/archive/<feature-name>/`

## Example

```markdown
### Step 1: Create database schema

- [x] Add new table to schema
- [x] Add migrations

---

## Status: Completed
```

---

## Usage

The agent will automatically load this skill when executing plans. No manual invocation needed.
