# Fix Unauthorized Error in Executions Page

## Problem

Race condition between session initialization and tRPC query execution:
1. Client-side `useSuspenseQuery` fires immediately without waiting for session
2. First request returns 401 Unauthorized (no auth token)
3. Page returns 500 error
4. After session loads, retry succeeds with 200

## Implementation Steps

### Step 1: Update use-executions.ts hook

- [x] Import `authClient` from `@/lib/auth-client`
- [x] Use `authClient.useSession()` to get session state
- [x] Keep `useSuspenseQuery` but add `enabled` option that waits for session (`enabled: !!session`)
- [x] Apply same pattern to all other hooks using protectedProcedure

### Step 2: Verify other hooks follow same pattern

- [x] Check `use-workflows.ts` for same issue - Fixed
- [x] Check `credentials.hooks.ts` for same issue - Fixed

### Step 3: Test the fix

- [ ] Visit `/executions` page and verify no 401 errors in console
- [ ] Visit `/workflows` page and verify no 401 errors
- [ ] Visit `/credentials` page and verify no 401 errors

## Modified Files

### Modified Files
- `src/features/executions/hooks/use-executions.ts`
- `src/features/workflows/hooks/use-workflows.ts`
- `src/features/credentials/hooks/credentials.hooks.ts`

---

## Status: Completed
