---
name: nextjs-app
description: Next.js (App Router) specific development guidelines
---

# Next.js App Skill

## Overview

This skill provides Next.js-specific development guidelines (App Router).

## Code Style

### Structure
- Use App Router: `app/` directory
- Route handlers: `app/api/route.ts`
- Server components by default
- "use client" for client-side interactivity

### Imports
- Use absolute imports
- Group related imports: `@/components`, `@/lib`, `@/hooks`

### Types
- Use TypeScript with strict mode
- Avoid `any`, use `unknown` when uncertain
- Define interfaces for props and API responses

### Naming
- Files: `kebab-case.ts` or `ComponentName.tsx`
- Directories: `kebab-case`
- Components match file names

### Data Fetching
- Server components for data fetching
- Use `fetch()` with `cache: 'no-store'` for dynamic data
- Use `revalidate` for ISR
- TanStack Query for client-side state

---

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit

# Run tests
npm run test
```

---

## Usage

This skill auto-loads for Next.js projects. No manual invocation needed.