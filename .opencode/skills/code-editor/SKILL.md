---
name: code-editor
description: Handles bug fixes, errors, and improvements - updates project state after changes
---

# Code Editor Skill

## Overview

This skill handles direct code changes: bug fixes, error resolution, improvements, refactoring. Changes go directly to project-state.md (not plan files).

## Instructions

### 1. Read Project State First

Before making changes, read:
- `@docs/project-state.md` - Understand current architecture

### 2. Make Code Changes

Fix the error/improvement directly in the codebase.

### 3. Update Project State

After ANY code change, update `@docs/project-state.md`:

**Key Files Section** - Add if new:
- New source files to "Key Files" table
- New functions with line numbers

**Key Functions Summary** - Add if new:
- `functionName(params): returnType  // Line X`

**Dependencies** - Add if new:
- Package name and purpose

**Environment Variables** - Add if new:
- Variable name and description

**API Endpoints** - Update if changed

### 4. Track Changes

No plan file checkboxes. Just keep project-state.md accurate.

---

## Usage

This skill auto-loads when:
- User asks to fix an error
- User reports a bug
- User requests improvements
- Keywords: "fix", "error", "bug", "improve", "refactor", "broken"

No manual invocation needed.