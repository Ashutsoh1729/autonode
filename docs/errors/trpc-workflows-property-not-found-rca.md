# RCA: Property 'workflows' does not exist on type 'CreateTRPCReactBase<...>'

**Date**: 2026-02-11
**Status**: Resolved

## 1. Issue Description
When attempting to use `api.workflows.getWorkflows.useQuery()` in the client component `dashboard.sections.tsx`, TypeScript threw the error:
> Property 'workflows' does not exist on type 'CreateTRPCReactBase<AppRouter>...'.

This indicated that the `workflows` router was not being correctly inferred or exposed in the `AppRouter` type definition, despite being included in `src/server/api/root.ts`.

## 2. Root Cause
**Naming Conflict / Variable Shadowing**.

In `src/server/api/routers/workflows.ts`, we had the following code:

```typescript
import { workflows } from "@/db/schema"; // <--- 1. Imported table definition

export const workflowsRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(() => {
    // 2. Logic attempting to access db.query.workflows
    return db.query.workflows.findMany();
  }),
  createWorkflows: protectedProcedure.mutation(() => {
      // ...
      return db.insert(workflows).values({...})
  })
});
```

The import name `workflows` clashed with the property name `workflows` on the `db.query` object (or potentially the key name in the router object). This likely caused TypeScript's complex type inference engine—which both Drizzle and tRPC rely heavily on—to fail in correctly mapping the return type of the procedure. Essentially, the local variable `workflows` shadowed the context needed for correct inference of `db.query.workflows`.

## 3. Resolution
We renamed the import to `workflowsTable` to eliminate the ambiguity.

**Fix Applied**:
```typescript
import { workflows as workflowsTable } from "@/db/schema"; // Renamed import

export const workflowsRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(() => {
    return db.query.workflows.findMany(); // Unambiguous reference
  }),
  createWorkflows: protectedProcedure.mutation(() => {
    return db.insert(workflowsTable).values({ // Updated usage
      name: "testing-workflow",
    }).returning();
  }),
});
```

After this change, TypeScript correctly inferred the return type of the router, allowing `AppRouter` to include the `workflows` property with its procedures.

## 4. Prevention Measures
- **Avoid Ambiguous Naming**: When working with Drizzle and tRPC, avoid naming generic imports (like table definitions) exactly the same as the router keys or database query properties.
- **Use Suffixes**: Adopt a convention such as aliasing schema imports with `Table` suffix (e.g., `import { workflows as workflowsTable }`) to prevent shadowing and improve code readability.
