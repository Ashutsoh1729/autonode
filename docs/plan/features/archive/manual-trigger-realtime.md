# Manual Trigger Real-time Updates

## Description

Add real-time status updates to Manual Trigger node, similar to HTTP Request node. This allows users to see the execution status (loading, success, error) in real-time when a workflow is triggered manually.

## Goals
- Users can see real-time status when executing a workflow with Manual Trigger
- Consistent with HTTP Request node's real-time updates

## Implementation Steps

### Step 1: Create Manual Trigger Channel
- [x] Create `src/inngest/channels/manual-trigger.ts` with channel definition
- [x] Reuse `NodeStatus` type from `node-status-indicator.ts`

### Step 2: Update Manual Trigger Executor
- [x] Import the manual trigger channel
- [x] Publish "loading" status when execution starts
- [x] Publish "success" status when execution completes
- [x] Publish "error" status if any error occurs
- [x] **FIX LSP ERROR**: Fixed by calling `manualTriggerChannel()` as a function

### Step 3: Subscribe to Status Updates in Node UI
- [x] Create token fetcher action in `src/features/executions/lib/actions.ts`
- [x] Update `ManualTriggerNode` to subscribe to channel using `useNodeStatus` hook
- [x] Pass `status` prop to `BaseTriggerNode`

### Step 4: Test the Implementation
- [x] Run a workflow with Manual Trigger
- [x] Verify status updates appear in real-time

## Files to Modify
- `src/inngest/channels/manual-trigger.ts` (new file)
- `src/features/triggers/mannual_trigger/lib/manual-executor.ts`
- `src/features/executions/lib/actions.ts` (add token fetcher)
- `src/features/triggers/mannual_trigger/components/manual.trigger.tsx`

## Files to Reference
- `src/inngest/channels/http-request.ts` - for channel pattern
- `src/features/executions/lib/http.executor.ts` - for publish usage

## Considerations
- Handle error case properly - use try/catch to publish error status
- Follow the same pattern as HTTP Request node for consistency
