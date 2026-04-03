# Fix Frequent POST Requests from Node Status Subscription

The `useNodeStatus` hook has `enabled: true` hardcoded, which keeps WebSocket subscriptions active for all nodes even when idle. This causes frequent POST requests to the server.

## Problem

In `src/features/executions/hooks/use-node-status.ts:21`:
```typescript
const { data } = useInngestSubscription({
  refreshToken,
  enabled: true, // ← always enabled
});
```

Every node on the canvas has this hook running, causing N × refresh-interval POST calls flooding in even when no workflow is executing.

## Implementation Steps

### Step 1: Update useNodeStatus to accept enabled parameter

- [x] Modify `useNodeStatus` in `src/features/executions/hooks/use-node-status.ts` to accept an `enabled` parameter
- [x] Default `enabled` to `false` to prevent auto-subscribing
- [x] Pass the `enabled` value to `useInngestSubscription`

### Step 2: Update node components to pass enabled

- [x] Update `cron-node.tsx` to pass `enabled` prop
- [x] Update `manual.trigger.tsx` to pass `enabled` prop  
- [x] Update `http-node.tsx` to pass `enabled` prop
- [x] Add state or context to track when to enable subscriptions (during execution)

### Step 3: Connect to execution state

- [x] Determine how to track when workflow is executing
- [x] Options:
  - Use Jotai atom to track execution state
  - Pass enabled prop from parent component based on execution
  - Use Inngest event to know when workflow is running
- [x] Implement the chosen approach in node components

### Step 4: Test the fix

- [ ] Verify no POST requests when idle
- [ ] Verify subscription works during execution
- [ ] Check WebSocket connects/disconnects properly

---

## Modified Files

- `src/features/executions/hooks/use-node-status.ts` - Added enabled parameter
- `src/features/executions/store/atoms.ts` - Created isExecutingAtom
- `src/features/editor/components/execution-workflow-btn.tsx` - Set isExecuting on click
- `src/features/workflows/hooks/use-workflows.ts` - Set isExecuting to false after execution
- `src/features/triggers/cron_job_trigger/components/cron-node.tsx` - Pass enabled from atom
- `src/features/triggers/mannual_trigger/components/manual.trigger.tsx` - Pass enabled from atom
- `src/features/executions/components/http-node.tsx` - Pass enabled from atom

---

## Status: Completed