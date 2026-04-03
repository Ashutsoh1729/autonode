# Cron Node Dialog - Data Flow Fix

## Problem

The cron node dialog (`cron-node-dialog.tsx`) doesn't:

- Receive node data (cronExpression, enabled, jobId)
- Save changes back to the workflow
- Handle preset button clicks
- Support custom date/time (only cron expression)

## Implementation Steps

### Step 1: Update CronJobTriggerDialog props

- [x] Add `nodeData` prop to receive current cron settings
- [x] Add `onSave` callback to save changes
- [x] Add `onDelete` callback to remove cron job

### Step 2: Add state management in dialog

- [x] Add local state for cronExpression
- [x] Initialize from nodeData
- [x] Add Save/Cancel buttons
- [x] Add delete/disable toggle option

### Step 3: Support custom date/time input

- [x] Add option to choose between Cron Expression or Custom Date/Time
- [x] For custom date/time: show date picker + time picker
- [x] Convert custom date/time to cron expression or store as timestamp

### Step 4: Handle preset clicks

- [x] Add onClick handlers for preset buttons to update local state

### Step 5: Update cron.ts - createJob

- [ ] Support `scheduledAt` timestamp for one-time execution
- [ ] Support both cron expression and specific timestamp

### Step 6: Update cron.ts - updateJob

- [ ] Support updating to different execution type (cron vs one-time)
- [ ] Handle enabling/disabling job

### Step 7: Connect in CronJobTriggerNode

- [x] Pass nodeData from props.data to dialog
- [x] Handle save to update node data
- [ ] Handle delete to remove from cron-job.org (not connected yet)

### Step 8: Backend sync on save

- [ ] When user clicks Save, update node data in DB
- [ ] Sync cron-job.org job with new settings
- [ ] Handle case where job doesn't exist yet (create new)

---

## Modified Files

### New Files Created

- None

### Modified Files

- `src/features/triggers/cron_job_trigger/components/cron-node-dialog.tsx`
- `src/features/triggers/cron_job_trigger/components/cron-node.tsx`
- `src/features/triggers/cron_job_trigger/lib/cron.ts` (pending)
- `src/features/workflows/server/routers.ts` (pending)

---

## Status: In Progress

e

