# Execution History - Layer 2: Detail View

## Overview

Add the execution detail page to view individual execution data with node-level details.

## Dependencies

- Requires Layer 1 (MVP) to be completed

## Implementation Steps

### Step 1: Add execution_nodes table

- [ ] Add `execution_nodes` table for node-level execution data: id, executionId, nodeId, status, input, output, startedAt, completedAt
- [ ] Create database migration

### Step 2: Update tRPC router

- [ ] Add `getById` procedure - fetch single execution with node details

### Step 3: Create execution detail page

- [ ] Create `/executions/[executionId]/page.tsx`
- [ ] Show execution metadata (status, timing, trigger info)
- [ ] Show node-level execution details in order

### Step 4: Integrate with execution flow

- [ ] Update Inngest functions to create execution record on start
- [ ] Update node executors to create execution_node records
- [ ] Update status updates to reflect in execution history

---

## Modified Files

### New Files Created
- `src/app/(dashboard)/(rest)/executions/[executionId]/page.tsx` (to be created)

### Modified Files
- `src/db/schema/executions.ts` - add execution_nodes table

---

## Status: Pending