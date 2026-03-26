# Cron Job Timezone Support

Add timezone selector to cron job dialog so users can configure which timezone their cron expressions are interpreted in, instead of hardcoded UTC.

## Implementation Steps

### Step 1: Add timezone field to cron node dialog UI

- [x] Add timezone field to form schema in `src/features/triggers/cron_job_trigger/components/cron-node-dialog.tsx`
- [x] Add timezone select/dropdown component with common timezones
- [x] Set default timezone to user's local timezone or UTC
- [x] Show timezone label next to cron expression input
- [x] Add timezone to saved data structure

### Step 2: Save timezone in workflow node data

- [x] Ensure timezone is passed through when saving the node configuration
- [x] Verify the timezone is stored in the workflow node data in the database

### Step 3: Use timezone when creating/updating cron job

- [x] Update `src/features/triggers/cron_job_trigger/lib/cron.ts` to accept timezone parameter
- [x] Pass stored timezone to cron-job.org API instead of hardcoded "UTC"
- [ ] Handle timezone conversion for cron expression if needed

### Step 4: Handle one-time execution timezone

- [ ] For one-time execution, ensure the scheduled date/time is stored with timezone info
- [ ] Convert to UTC when passing to cron-job.org API

### Step 5: Testing

- [ ] Test creating a cron job with different timezones
- [ ] Verify the cron job fires at the correct local time
- [ ] Test edge cases like DST transitions

---

## Modified Files

### Modified Files
- `src/features/triggers/cron_job_trigger/components/cron-node-dialog.tsx`
- `src/features/triggers/cron_job_trigger/components/cron-node.tsx`
- `src/features/triggers/cron_job_trigger/lib/cron.ts`
- `src/features/workflows/server/routers.ts`

---

## Status: In Progress