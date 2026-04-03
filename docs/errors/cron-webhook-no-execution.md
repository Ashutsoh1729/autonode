# Cron Webhook Returns 200 but No Workflow Execution

## Summary

Cron-job.org successfully calls the webhook endpoint (`/api/cron-webhook`) and receives 200 OK, but the workflow doesn't execute in Inngest.

## Symptoms

1. Cron-job.org shows: Status 200 OK, Timing ~839ms
2. Response body contains ngrok error page HTML with `ERR_NGROK_6024` code
3. Inngest dev server shows no `workflow/execute` event being processed
4. Workflow execution doesn't trigger

## Timeline

- **2026-03-26**: Webhook called from cron-job.org
- URL: `https://solid-bengal-violently.ngrok-free.app/api/cron-webhook?workflowId=1&nodeId=c0eyolkf24u06x6mkqzcg2xw`

## Possible Causes

### 1. ngrok Consent Page (ERR_NGROK_6024) - ROOT CAUSE
The response body shows ngrok's "trust this site" error page. The 200 OK is from ngrok's consent page, NOT from your Next.js app. Cron-job.org never actually reaches your webhook.

**Fix**: Add `ngrok-skip-browser-warning: true` header in cron-job.org request configuration.

### 2. Inngest Event Not Received
The webhook sends `workflow/execute` event to Inngest, but the Inngest dev server might not be receiving or processing it.

**Check**: Look at Inngest dev server console for event logs.

### 3. Workflow Not Properly Configured
The workflow (ID: 1) might not have:
- Proper nodes
- Proper connections/edges between nodes
- Topological sort returning empty array

**Check**: Verify workflow has nodes and connections in database.

### 4. Webhook Returns Success but Fails Silently
The webhook returns `NextResponse.json({ success: true })` but the actual `inngest.send()` might be failing.

## Code Flow

1. `src/app/api/cron-webhook/route.ts` - Receives POST from cron-job.org
2. Validates auth header (`CRON_WEBHOOK_SECRET`)
3. Finds matching cron node by `jobId`
4. Sends `workflow/execute` event to Inngest
5. `src/inngest/functions.ts` - `executeWorkflow` function processes the event
6. Fetches workflow with nodes and connections
7. Runs topological sort
8. Executes each node via executor

## Things to Check

- [x] Visit ngrok URL directly in browser to accept consent
- [ ] Add `ngrok-skip-browser-warning: true` header in cron-job.org (PRIMARY FIX)
- [ ] Check Inngest dev server logs for `workflow/execute` event
- [ ] Verify workflow has nodes in database
- [ ] Verify workflow has connections/edges in database
- [ ] Add more logging in webhook to capture errors
- [ ] Check if `inngest.send()` is throwing errors

## Error Resolution Plan

### Step 1: Fix ngrok consent issue (PRIORITY - Most Likely Root Cause)

The 200 OK is from ngrok's consent page, not your Next.js app. Fix by:

- [ ] **Option A**: In cron-job.org dashboard, add header `ngrok-skip-browser-warning: true` to the request
- [ ] **Option B**: Visit the ngrok URL directly in browser first to accept the consent (for manual testing)
- [ ] After fixing, verify the response is JSON from your app, not HTML from ngrok

### Step 2: Add error handling in webhook

Wrap `inngest.send()` with try-catch to catch silent failures:

```ts
try {
   await inngest.send({ name: "workflow/execute", data: {...} });
  console.log("Event sent to Inngest ✓");
} catch (err) {
  console.error("Inngest send failed:", err);
}
```

- [x] Add try-catch around `inngest.send()` in `src/app/api/cron-webhook/route.ts`
- [x] Add logging to confirm event was sent

### Step 3: Verify Inngest function is registered

- [ ] Check Inngest dev server at `http://localhost:8288`
- [ ] Confirm `executeWorkflow` function appears in the functions list
- [ ] If not, verify the serve handler is registered properly

### Step 4: Verify webhook is receiving requests

- [ ] Check Next.js dev server console for incoming POST requests
- [ ] Verify the webhook is logging the jobId
- [ ] Confirm request actually reaches your app (not blocked by ngrok)

### Step 5: Test manually

- [ ] Trigger the workflow manually using the Execute button
- [ ] Compare the behavior between manual trigger and cron trigger
- [ ] This will help identify if the issue is with the webhook or the execution

---

## Related Files

- `src/app/api/cron-webhook/route.ts` - Webhook handler
- `src/inngest/functions.ts` - Inngest function that executes workflow
- `src/inngest/utils.ts` - Topological sort utility
- `src/features/executions/lib/executor-registory.ts` - Node executors

---

## Status: Investigating