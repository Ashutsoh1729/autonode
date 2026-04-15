---
name: project-reference
description: Requires reading project state document before exploring codebase
---

# Project Reference Skill

## Overview

Before exploring or modifying any code in this project, the agent MUST read `@docs/project-state.md` first. This document contains all necessary reference information.

## Instructions

### 1. Read Project State FIRST

When asked to work on this project:
1. Immediately read `@docs/project-state.md`
2. Use the information in that document as your primary reference
3. Only explore additional files if the specific information you need is not in project-state.md

### 2. When to Explore Further

Only read individual source files if:
- You need to see the full implementation details not covered in the summary
- You're asked to make specific code changes
- The project-state.md references point to the wrong location

### 3. Avoid Token Waste

The project-state.md document is designed to help you:
- Find the right file directly (no need to glob/grep first)
- Understand the architecture without reading every file
- Locate key functions by line numbers

---

## Usage

This skill auto-loads when working on this project. No manual invocation needed.