# Better Auth — How It Works with Next.js

> **Date:** February 11, 2026  
> **Context:** First-time setup for the Autonode project (Next.js 16 + Drizzle ORM)

---

## The Big Picture

Better Auth is a **framework-agnostic** TypeScript auth library. It runs as an **API handler** inside your Next.js app — no separate auth server needed.

```
┌─────────────────────────────────────────────┐
│              Your Next.js App                │
│                                              │
│  ┌──────────┐       ┌─────────────────────┐  │
│  │ Client   │ fetch │ API Route            │  │
│  │ (React)  │──────▶│ /api/auth/[...all]   │  │
│  │          │◀──────│ (Better Auth handler)│  │
│  └──────────┘       └────────┬────────────┘  │
│                              │               │
│                     ┌────────▼────────────┐  │
│                     │ Database             │  │
│                     │ (Drizzle + Postgres) │  │
│                     └─────────────────────┘  │
└──────────────────────────────────────────────┘
```

Better Auth exposes endpoints like `/api/auth/sign-in`, `/api/auth/sign-up`, `/api/auth/session`, etc. — all handled by a **single catch-all route**.

---

## Two Sides: Server & Client

### 1. Server Config — `src/lib/auth.ts`

This is the **core**. It configures the auth instance with your database, providers, and plugins.

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(), // auto-sets cookies in server actions — keep last
  ],
});
```

### 2. Client Helper — `src/lib/auth-client.ts`

This is for client components. Provides React hooks and action functions.

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
```

---

## 3 Key Integration Points

### A. API Route Handler

Create a catch-all route at `src/app/api/auth/[...all]/route.ts`:

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

This one file handles **all** auth endpoints (`/api/auth/*`).

### B. Using Auth in Client Components

```tsx
"use client";
import { useSession, signIn, signOut } from "@/lib/auth-client";

export function AuthButton() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  if (session) {
    return (
      <div>
        <span>Welcome, {session.user.name}</span>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn.email({ email: "...", password: "..." })}>
      Sign In
    </button>
  );
}
```

### C. Using Auth in Server Components / Server Actions

Use `auth.api` directly — no client needed:

```tsx
// Server Component
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  return <h1>Welcome {session.user.name}</h1>;
}
```

```ts
// Server Action
"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
}
```

---

## Route Protection (Next.js 16)

Next.js 16 uses **proxy** instead of middleware. Create `src/proxy.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

> **Note:** `getSessionCookie` only checks cookie **existence**, not validity. Always validate the session in the actual page/route with `auth.api.getSession()`.

---

## Database Schema

Better Auth needs 4 tables:

| Table          | Purpose                                   |
| -------------- | ----------------------------------------- |
| `user`         | User profile (name, email, image)          |
| `session`      | Active sessions (token, expiry, IP, UA)    |
| `account`      | OAuth/credential accounts per user         |
| `verification` | Email verification & password reset tokens |

These are already defined in `src/db/schema/auth.ts`.

---

## Session Flow Summary

1. **Sign Up/In** → Better Auth creates `user` + `session` rows, sets a **session cookie**
2. **Subsequent requests** → Cookie is sent automatically; `getSession()` looks up the session in the DB
3. **Sign Out** → Session row is deleted, cookie is cleared

---

## Key Gotchas

1. **`nextCookies()` plugin** — Must be added to plugins (and be the **last** plugin) if you call auth functions from server actions, otherwise cookies won't be set.
2. **`headers()` is async** in Next.js 15+ — Always `await headers()` when passing to `auth.api.getSession()`.
3. **Proxy ≠ Security** — The proxy/middleware cookie check is for UX redirects only. Real auth validation must happen in the page/route itself.
