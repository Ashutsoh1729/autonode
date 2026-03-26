# Ngrok Setup for Webhook Development

Setup ngrok to expose local development server to the internet for receiving webhooks from cron-job.org.

> **Note**: This setup is only for local development. In production, the app will be deployed to Vercel with a public URL, so ngrok won't be needed.

## Implementation Steps

### Step 1: Install ngrok

- [x] Install ngrok via npm or download from ngrok.com
- [x] Add ngrok authentication token (if needed for custom subdomains)

### Step 2: Add ngrok to mprocs.yaml

- [x] Add ngrok service to run alongside Next.js and Inngest
- [x] Configure ngrok to tunnel to port 3000
- [x] Set up authtoken for persistent tunnels

### Step 3: Configure app to use ngrok URL

- [x] Create a way to dynamically get the ngrok URL (via NGROK_URL env var)
- [x] Update the cron-job.org webhook creation to use the ngrok URL instead of localhost
- [x] Add NGROK_URL to environment variables

### Step 4: Verify webhook connectivity

- [x] Test that cron-job.org can reach the local server through ngrok
- [ ] Verify the webhook endpoint returns expected response

---

## Troubleshooting

### ERR_NGROK_3200 - Endpoint Offline

The ngrok output shows the URL but the destination is blank:

```
Forwarding  https://xxxx.ngrok-free.app -> (blank)
```

This means ngrok started but couldn't connect to localhost:3000. **Next.js must be running before ngrok can forward to it.**

**Solution**:

1. Make sure Next.js is running on port 3000 first
2. In mprocs, ngrok should start after next, or restart ngrok after Next.js is ready:
   ```bash
   # Kill current ngrok and restart
   # Then access your ngrok URL
   ```

**Important**: The ngrok URL changes each time the agent restarts. After getting it working:

1. Copy the URL from ngrok output (look for `Forwarding` line)
2. Update `NGROK_URL` in `.env.local`
3. Save a workflow to re-sync cron jobs with the new URL

---

## Status: In Progress

