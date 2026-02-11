# tRPC Integration Plan

> **Date:** February 11, 2026
> **Goal:** Integrate tRPC for end-to-end type-safe API communication.

## Why tRPC for Autonode?

Autonode is a complex application with heavy client-side interaction (Visual Workflow Builder). tRPC provides significant advantages:

1.  **End-to-End Type Safety**: The frontend editor immediately knows if the backend node schema changes. This prevents an entire class of runtime errors.
2.  **Developer Experience (DX)**: "Code-first" approach. We define backend functions, and they are instantly available as fully typed hooks on the frontend. No manual API clients or code generation needed.
3.  **Validation**: Built-in `zod` validation ensures that workflow configurations, node parameters, and credentials are valid before they reach our logic.
4.  **React Query Power**: tRPC uses TanStack Query under the hood. We get caching, optimistic updates, and loading states out of the box — essential for a responsive node-based editor.

## Implementation Steps

### 1. Dependencies
Install necessary packages for tRPC v11 (or latest stable compatible with App Router) and TanStack Query.
- `@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@trpc/next`
- `@tanstack/react-query`
- `zod`, `superjson`

### 2. Implementation Structure

```
src/
├── server/
│   ├── api/
│   │   ├── trpc.ts            # Initialization, Middleware (Auth)
│   │   ├── root.ts            # App Router (merges all routers)
│   │   └── routers/
│   │       ├── workflow.ts    # Workflow CRUD
│   │       └── node.ts        # Node definitions
│   └── db.ts                  # DB export (already exists)
├── trpc/
│   ├── server.ts              # Server-side caller (for RSC)
│   ├── react.tsx              # Client Provider (TRPCReactProvider)
│   └── query-client.ts        # Query Client configuration
├── app/
    └── api/
        └── trpc/
            └── [trpc]/
                └── route.ts   # API Handler
```

### 3. Better Auth Integration
- **Context**: extracting the session in `createTRPCContext`.
- **Middleware**: `protectedProcedure` middleware that checks `ctx.session` and throws `UNAUTHORIZED` if missing.

### 4. Verification
- Create a simple `health.check` procedure.
- Query it from the Dashboard.
