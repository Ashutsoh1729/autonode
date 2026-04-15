# SMTP Email Support for Email Node

## Overview

Add SMTP provider support to the existing email node while keeping Resend as the primary provider. This allows users to send emails from any email account (Gmail, Outlook, custom SMTP servers, etc.) without requiring a company domain.

## Implementation Steps

### Step 1: Add SMTP credential type to database schema

- [x] Add "SMTP" to `credentialType` enum in `src/db/schema/workflows.ts`
- [x] Add migration for the new enum value
- [x] Push schema to database

### Step 2: Create SMTP credential input form

- [x] Add SMTP credentials form in credentials UI
- [x] Fields: host, port, secure (TLS/SSL), username, password, from email
- [x] Store as encrypted JSON in credentials table

### Step 3: Update Email Node form to support SMTP provider

- [x] Update `provider` field to accept both "resend" and "smtp"
- [x] When SMTP selected, show credential selector for SMTP credentials
- [x] Hide Resend-specific fields when SMTP selected

### Step 4: Implement SMTP sending logic in executor

- [x] Add SMTP transport using `nodemailer` package
- [x] Create `sendViaSMTP` function in `src/features/executors/lib/email.executor.ts`
- [x] Update executor to branch based on provider type
- [x] Store SMTP config encrypted, decrypt at runtime

### Step 5: Add environment variable fallback for SMTP

- [x] Add optional env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- [x] Use as fallback when no credential selected

### Step 6: Test the implementation

- [ ] Test SMTP with Gmail SMTP
- [ ] Test SMTP with custom SMTP server
- [x] Verify Resend still works as before

---

## Modified Files

### New Files Created
- `src/features/executors/lib/smtp-transport.ts` (SMTP sending implementation)

### Modified Files
- `src/db/schema/workflows.ts` - Add SMTP to credentialType enum
- `src/features/credentials/server/credentials.router.ts` - Add SMTP provider option
- `src/features/executors/lib/email.executor.ts` - Add SMTP provider support
- `src/features/executors/nodes/email_node/components/email-node-dialog.tsx` - Update form for SMTP

### Database Changes
- Migration: Add "SMTP" to credentials_type enum

---

## Status: Pending