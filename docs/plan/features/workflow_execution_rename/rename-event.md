# Workflow Execution Event Rename Plan

## Overview
Rename the Inngest event from `workflow/execute-http` to `workflow/execute` to better reflect that it's used for executing all types of workflows, not just HTTP-triggered ones.

## Implementation Steps

### Step 1: Update Inngest Function Definition
- [x] Update event name in `src/inngest/functions.ts` from `workflow/execute-http` to `workflow/execute`
- [x] Update function ID from `execute-http-workflow` to `execute-workflow`

### Step 2: Update Manual Trigger API
- [x] Update event name in `src/features/workflows/server/routers.ts` from `workflow/execute-http` to `workflow/execute`

### Step 3: Update Cron Webhook Handler
- [x] Update event name in `src/app/api/cron-webhook/route.ts` from `workflow/execute-http` to `workflow/execute`

### Step 4: Update Documentation
- [x] Update `docs/notes/data-flow-report.md`
- [x] Update `docs/plan/features/archive/cron_node/cron-trigger.md`
- [x] Update `docs/errors/cron-webhook-no-execution.md`

## Modified Files

### Code Files
- `src/inngest/functions.ts` - Updated event name and function ID
- `src/features/workflows/server/routers.ts` - Updated event name in execute procedure
- `src/app/api/cron-webhook/route.ts` - Updated event name in webhook handler

### Documentation Files
- `docs/notes/data-flow-report.md` - Updated event reference
- `docs/plan/features/archive/cron_node/cron-trigger.md` - Updated event reference
- `docs/errors/cron-webhook-no-execution.md` - Updated event references

---
## Status: Completed