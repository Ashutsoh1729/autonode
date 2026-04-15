---
name: plan-executor
description: Updates plan file checkboxes and tracks progress when executing feature plans
---

# Plan Executor Skill

## Overview

This skill provides instructions for executing feature plans from `@docs/plan/` and `@docs/plan/features/`.

## Plan Locations

- **Major project parts**: `docs/plan/<feature>/index.md`
- **Feature implementations**: `docs/plan/features/<feature>/` (can contain multiple plan files like `index.md`, `credentials.md`, etc.)

## Instructions

When executing a plan from `@docs/plan/...`:

### 1. Update Checkboxes

After completing each implementation step, update the plan file to mark the checkbox as complete:

- Change `[ ]` to `[x]` for completed tasks
- Keep `[ ]` for pending tasks

### 2. Track Progress

- After completing ALL implementation steps, update the status at the end of the plan
- Add "Status: Completed" at the end of the plan file

### 3. Modified Files Section

Ensure the plan file has a "Modified Files" section listing:

- **New Files Created**: All new files created during implementation
- **Modified Files**: All existing files that were modified

### 4. Archive Completed Plans

When a plan is fully completed:

1. After completing all steps, add "Status: Completed" at end of plan
2. **Ask user for permission to archive** - user may want to test first before archiving
3. After receiving permission, move the plan directory to `@docs/plan/<category>/archive/<feature>/` or `@docs/plan/features/archive/<feature>/`
4. Remove entry from "Currently Active Plans" table in `docs/plan/init.md`

### 5. Update Project State

After completing the plan, update `@docs/project-state.md` (if exists):

- Add new files to "Key Files" section
- Add new functions to "Key Functions Summary" section
- Add new dependencies to "Dependencies" section
- Add new environment variables to "Environment Variables" section
- Update API Endpoints if changed

This ensures project-state.md stays accurate and useful for future work.

---

## Usage

The agent will automatically load this skill when executing plans. No manual invocation needed.

