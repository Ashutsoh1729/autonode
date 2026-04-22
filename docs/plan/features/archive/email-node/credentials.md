# Email Node - Credentials Integration

## Overview

Update the email node to use credentials from the credential manager instead of inline API keys.

## Current State

- Email node has inline API key field
- Credentials are stored encrypted but only support OPENAI, ANTHROPIC, GEMINI

## Implementation Steps

### Step 1: Add Resend to credentialType enum

- [ ] Add "RESEND" to credentialType enum in src/db/schema/workflows.ts
- [ ] Generate and push migration

### Step 2: Update email node dialog

- [ ] Add credential selection dropdown to email-node-dialog.tsx
- [ ] Replace inline API key field with credential selector
- [ ] Use existing credentialsAtom for credential list

### Step 3: Update email executor

- [ ] Update EmailNodeData to use credentialId instead of inline apiKey
- [ ] Fetch credential value at runtime using credentials query

### Step 4: Test integration

- [ ] Test saving credentials
- [ ] Test using credential in email node

---

## Discussion Points

1. Should we keep fallback to env RESEND_API_KEY?
2. Handle case when credential is deleted but still referenced?

---

## Modified Files

### Modified Files

- `src/db/schema/workflows.ts`
- `src/features/executors/nodes/email_node/components/email-node-dialog.tsx`
- `src/features/executors/lib/email.executor.ts`

---

## Status: Completed
