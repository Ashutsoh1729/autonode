# Email Node

## Overview

A node that sends emails via SMTP or email API (e.g., Resend, SendGrid, Postmark).

## Implementation Steps

### Step 1: Add node type to database schema

- [x] Add "EMAIL" to nodeType enum in src/db/schema/workflows.ts

### Step 2: Create Email executor

- [x] Create src/features/executors/lib/email.executor.ts
- [x] Implement email sending logic
- [x] Support SMTP and API providers

### Step 3: Register executor

- [x] Register in node_executor_registery.ts

### Step 4: Create Email node component

- [x] Create src/features/executors/nodes/email_node/components/email-node.tsx
- [x] Create src/features/executors/nodes/email_node/components/email-node-dialog.tsx

### Step 5: Register node component

- [x] Add to src/lib/node-components.tsx

### Step 6: Register in sidebar/node selector

- [x] Add to executionNodes array in src/components/react-flow/node-selecter.tsx

### Step 7: Create Inngest channel (Optional)

- [ ] Create src/inngest/channels/email-request.ts

### Step 8: Run migration

- [x] Run `pnpm drizzle-kit generate`
- [x] Run `pnpm drizzle-kit push`

### Step 9: Credentials Integration

See `credentials.md` for detailed implementation steps.

---

## Future Improvements

- Track sent emails in database
- Retry logic and error handling
- Additional providers (SMTP, SendGrid, Postmark)
- Email open/click tracking
- HTML template editor in UI

---

## Modified Files

### New Files Created
- `src/features/executors/lib/email.executor.ts`
- `src/features/executors/nodes/email_node/components/email-node.tsx`
- `src/features/executors/nodes/email_node/components/email-node-dialog.tsx`
- `src/inngest/channels/email-request.ts`

### Modified Files
- `src/db/schema/workflows.ts`
- `src/lib/node_executor_registery.ts`
- `src/lib/node-components.tsx`
- `src/components/react-flow/node-selecter.tsx`

---

## Status: Completed
