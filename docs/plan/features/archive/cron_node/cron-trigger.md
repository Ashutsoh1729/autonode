# Cron Trigger Node Implementation Plan

## Overview
Add a new `CRON_TRIGGER` node type that starts workflow execution based on a cron schedule using cron-job.org API.

---

## Implementation Steps

### Step 1: Database Schema
- [x] Add `CRON_TRIGGER` to `nodeType` enum in `src/db/schema/workflows.ts`

### Step 2: Inngest Channel
- [x] Create `src/inngest/channels/cron-trigger.ts` with status channel (similar to manual-trigger)

### Step 3: Cron Executor
- [x] Create `src/features/triggers/cron_job_trigger/lib/cron-executor.ts`
- [x] Implement executor that handles cron trigger execution
- [x] Publish status updates to the channel

### Step 4: Node Registry
- [x] Register cron executor in `src/lib/node-registery.ts`
- [x] Add `CRON_TRIGGER` mapping

### Step 5: Cron Job Management Service
- [x] Enhance `src/features/triggers/cron_job_trigger/lib/cron.ts`:
  - [x] Add `CronJobParams` type with: `url`, `cronExpression`, `enabled`, `webhookSecret`
  - [x] Update `createJob(params)` to accept URL, parse cron expression, add Basic Auth
  - [x] Update `updateJob(jobId, params)` to accept partial params
  - [x] Add cron expression parser (convert "0 * * * *" to cron-job.org schedule format)
  - [x] Return jobId on create, store in node data

### Step 6: API Route (Webhook)
- [x] Create `src/app/api/cron-webhook/route.ts`
- [x] Validate cron-job.org requests
- [x] Look up workflow by cron job ID
- [x] Trigger workflow execution via Inngest event

### Step 7: Workflow Save Integration
- [x] Update `src/features/workflows/server/routers.ts` (update mutation)
- [x] When saving a workflow with CRON_TRIGGER node:
  - [x] Extract cron schedule from node data
  - [x] Create/update/delete cron job via cron-job.org API
  - [x] Store cron job ID in node data

### Step 7b: Workflow Deletion
- [x] Update `src/features/workflows/server/routers.ts` (`remove` mutation)
- [x] When deleting a workflow, delete all associated cron jobs via cron-job.org API

### Step 8: React Flow Component
- [x] Enhance existing `src/features/triggers/cron_job_trigger/components/cron-node.tsx`
- [x] Enhance existing `src/features/triggers/cron_job_trigger/components/cron-node-dialog.tsx`
- [x] Add cron expression input with presets (hourly, daily, weekly)
- [x] Show next run time

### Step 9: Node Components Registration
- [x] Update `src/lib/node-components.tsx` to register CRON_TRIGGER component
- [x] Add CronTriggerNode to component map

### Step 10: Node Selector
- [x] Update `src/components/react-flow/node-selecter.tsx`
- [x] Add CRON_TRIGGER option to node selector

### Step 11: Environment Variables
- [x] Add `CRON_WEBHOOK_SECRET` to `.env.example` and `src/lib/config.ts`
- [x] Implement webhook secret validation in API route (Basic auth or custom header)

### Step 12: TypeScript & Lint
- [x] Run `pnpm tsc --noEmit` to check types
- [x] Run `pnpm lint` to fix any linting issues

### Step 13: Testing
- [ ] Test cron job creation via API
- [ ] Test workflow execution triggered by cron
- [ ] Test cron job updates when workflow is saved

---

## Technical Notes

### Cron Job Data Structure
```typescript
type CronTriggerData = {
  cronExpression: string; // e.g., "0 * * * *"
  jobId?: number; // Stored after creation
  enabled: boolean;
  timezone: string;
};
```

### API Route Flow
1. cron-job.org makes POST request to `/api/cron-webhook`
2. Request includes job metadata (jobId)
3. API looks up workflow with matching cron job ID
4. Sends `workflow/execute` event to Inngest

### Environment Variables
- `CRON_KEY` - cron-job.org API key (already configured)
- `CRON_WEBHOOK_SECRET` - Secret for validating incoming webhook requests (required)

---

## Modified Files

### New Files Created
- `src/inngest/channels/cron-trigger.ts` - Inngest channel for cron trigger status
- `src/features/triggers/cron_job_trigger/lib/cron-executor.ts` - Cron node executor
- `src/app/api/cron-webhook/route.ts` - Webhook API route for cron-job.org

### Modified Files
- `src/db/schema/workflows.ts` - Added CRON_TRIGGER to nodeType enum
- `src/lib/node-registery.ts` - Registered cron executor
- `src/lib/config.ts` - Added cronWebhookSecret config
- `src/features/triggers/cron_job_trigger/lib/cron.ts` - Enhanced with params, auth, cron parser
- `src/features/triggers/cron_job_trigger/components/cron-node.tsx` - Added status and real-time
- `src/features/triggers/cron_job_trigger/components/cron-node-dialog.tsx` - Added cron config UI
- `src/features/workflows/server/routers.ts` - Added cron sync on save/delete
- `src/features/executions/lib/actions.ts` - Added fetchCronTriggerRealTime
- `src/lib/node-components.tsx` - Registered CRON_TRIGGER component
- `src/components/react-flow/node-selecter.tsx` - Added CRON_TRIGGER option

---

## Status: Completed
