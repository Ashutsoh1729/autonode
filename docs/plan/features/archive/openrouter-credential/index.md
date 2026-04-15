# OpenRouter Credential Support

Add OPENROUTER as a credential provider option, allowing users to store their OpenRouter API key.

## Implementation Steps

### Step 1: Update Database Schema

- [x] Add "OPENROUTER" to the `credentialType` enum in `src/db/schema/workflows.ts:26`
- [x] Generate and run database migration

### Step 2: Update Credentials Router

- [x] Add "OPENROUTER" to the provider zod enum in `src/features/credentials/server/credentials.router.ts:22`
- [x] Test that creating credentials works with the new provider

### Step 3: Update UI

- [x] Verify credential creation form supports the new provider

---

## Modified Files

### Modified Files
- `src/db/schema/workflows.ts`
- `src/features/credentials/server/credentials.router.ts`
- `src/lib/logo.tsx`
- `src/features/credentials/component/credentials.form.tsx`
- `src/features/credentials/component/credentials.component.tsx`

---

## Status: Completed
