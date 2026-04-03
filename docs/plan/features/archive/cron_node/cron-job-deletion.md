# Plan: Fix Cron Job Deletion When Nodes Are Removed From Workflow

## Problem Description
When a user deletes a cron trigger node from a workflow and saves the workflow, the associated cron job in cron-job.org is not being deleted. The cron job should be automatically removed when its corresponding node is removed from the workflow.

## Root Cause Analysis
After reviewing the code, the issue appears to be in the workflow update route in `src/features/workflows/server/routers.ts`. While the `syncCronJobs` function correctly handles deletion of cron jobs for nodes that are removed, there may be an issue with how node data is being processed or how the synchronization is triggered.

Key areas to investigate:
1. Workflow update route node processing logic
2. `syncCronJobs` function implementation
3. Node data structure and jobId extraction
4. Potential timing/async issues

## Implementation Steps

### Step 1: Verify Current Behavior
- [ ] Add debug logging to track node deletions in workflow update
- [ ] Test deleting a cron node and verify if syncCronJobs is called
- [ ] Check if existingCronNodes and newCronNodes are correctly identified

### Step 2: Examine Workflow Update Logic
- [ ] Review the transaction in the update workflow route (lines 269-334)
- [ ] Verify that existingCronNodes collection happens before node deletion
- [ ] Check that jobId extraction from node data is correct
- [ ] Ensure syncCronJobs is called with correct parameters

### Step 3: Examine syncCronJobs Function
- [ ] Verify the logic for identifying nodes to delete (lines 47-58)
- [ ] Check that jobId extraction from existing nodes is correct
- [ ] Verify deleteJob is called with correct jobId
- [ ] Add error handling improvements

### Step 4: Test and Validate
- [ ] Create test scenario: workflow with cron node -> delete node -> save workflow
- [ ] Verify cron job is deleted from cron-job.org
- [ ] Test edge cases: multiple cron nodes, partial deletions
- [ ] Ensure no regression in cron job creation/update

### Step 5: Code Cleanup
- [ ] Remove any temporary debug logging
- [ ] Ensure code follows existing patterns and conventions
- [ ] Update any relevant comments

## Modified Files
- `src/features/workflows/server/routers.ts` - Workflow update logic
- `src/features/triggers/cron_job_trigger/lib/cron.ts` - Cron job deletion (if needed)
- `src/features/workflows/server/routers.ts` - syncCronJobs function (if needed)

## Status: Completed

---

## Modified Files

### Modified Files
- `src/features/workflows/server/routers.ts` - Updated syncCronJobs function and workflow update logic