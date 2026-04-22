# Loop Node

## Overview

A node that iterates through a list and executes downstream nodes for each item, accumulating results.

## Implementation Steps

### Step 1: Add node type to database schema

- [ ] Add "LOOP" to nodeType enum in src/db/schema/workflows.ts

### Step 2: Create Loop executor

- [ ] Create src/features/executors/lib/loop.executor.ts
- [ ] Implement iteration logic
- [ ] Handle context passing for each item
- [ ] Accumulate results from each iteration
- [ ] Register in node_executor_registery.ts

### Step 3: Create Loop node component

- [ ] Create src/features/executors/nodes/loop_node/components/loop-node.tsx
- [ ] Create src/features/executors/nodes/loop_node/components/loop-node-dialog.tsx

### Step 4: Create Inngest channel

- [ ] Create src/inngest/channels/loop-request.ts

### Step 5: Register node component

- [ ] Add to src/lib/node-components.tsx

### Step 6: Register in sidebar/node selector

- [ ] Add to executionNodes array in src/components/react-flow/node-selecter.tsx

---

## Loop Node Configuration Options

- **Input Variable**: Variable containing array to iterate
- **Item Variable Name**: Name for current item in each iteration (e.g., "item")
- **Output Variable Name**: Where to store accumulated results
- **Continue on Error**: Whether to continue if one iteration fails

## Discussion Points

1. How to handle the execution flow? Each iteration runs full downstream branch?
2. How to track iteration index for context?
3. Should loop be sequential or parallel execution?
4. How to pass data back from downstream nodes for accumulation?
5. Handle empty arrays or single-item arrays?

## Relationship with Notion Node

- Loop node receives list from Notion node
- For each item, triggers downstream nodes (e.g., Email node)
- Returns accumulated results
- Notion node handles marking as "done" (separate discussion)

---

## Modified Files

### New Files Created

- `src/features/executors/lib/loop.executor.ts`
- `src/features/executors/nodes/loop_node/components/loop-node.tsx`
- `src/features/executors/nodes/loop_node/components/loop-node-dialog.tsx`
- `src/inngest/channels/loop-request.ts`

### Modified Files

- `src/db/schema/workflows.ts`
- `src/lib/node_executor_registery.ts`
- `src/lib/node-components.tsx`

---

## Status: Pending
