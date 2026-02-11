# Authentication Verification Steps

> **Date:** February 11, 2026
> **Goal:** Verify the implementation of Better Auth with Next.js 16 route groups.

## Prerequisites

1.  Ensure Docker is running: `task db:up`
2.  Start the dev server: `pnpm dev`

## Manual Verification Flow

### 1. Landing Page (Public)
- **Navigate to:** `http://localhost:3000/`
- **Expected:** You should see the "Automate Your Workflows with AI" landing page.
- **Action:** Click "Sign In" or "Get Started".

### 2. Sign Up (Auth)
- **Navigate to:** `http://localhost:3000/sign-up` (or click "Get Started")
- **Action:** Fill in Name, Email, Password and click "Sign Up".
- **Expected:**
    - Loading spinner appears.
    - On success, redirects to `/dashboard`.
    - Database: A new user and session should be created in Postgres.

### 3. Dashboard (Protected)
- **Navigate to:** `http://localhost:3000/dashboard`
- **Expected:** You should see "Welcome back, [Name]!".
- **Action:** Try to navigate to `/dashboard` in an Incognito window (unauthenticated).
- **Expected:** Redirects to `/sign-in`.

### 4. Sign Out
- **Action:** Click "Sign Out" in the dashboard sidebar (bottom).
- **Expected:** Redirects to `/sign-in`.

### 5. Sign In (Auth)
- **Navigate to:** `http://localhost:3000/sign-in`
- **Action:** Enter credentials created in step 2.
- **Expected:** Redirects to `/dashboard` on success.

## Troubleshooting

- **Proxy/Middleware**: If redirects don't work, ensure `src/proxy.ts` exists and is properly configured in `next.config.ts` (if needed, though Next.js 16 auto-detects `proxy.ts` usually, or fallback to `middleware.ts` if acceptable).
    - *Note:* We migrated `middleware.ts` to `src/proxy.ts` for Next.js 16 compatibility.
- **Database**: Check `docker logs autonode-db` if auth fails.
