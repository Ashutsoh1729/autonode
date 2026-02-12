# tRPC Routing & Request Handling

> **Date:** February 11, 2026
> **Topic:** Internal working of tRPC routing and request mapping.

## 1. Single Entry Point

Unlike a traditional REST API where you have `/api/users`, `/api/posts`, etc., tRPC has **one** single HTTP endpoint. In our Next.js app, this is:

```
/api/trpc/[trpc]
```

This Next.js Dynamic Route catches **all** requests starting with `/api/trpc/`.

## 2. How the Client Calls the Server

When you call `api.health.check.useQuery()` on the client, the `httpBatchStreamLink` (configured in `src/trpc/react.tsx`) constructs an HTTP request.

**The URL looks like this:**
```
GET /api/trpc/health.check?batch=1&input={}
```

- **Path**: The procedure path (`health.check`) is part of the URL.
- **Input**: Arguments are serialized (via `superjson`) and passed as query parameters (for GET) or body (for POST).

## 3. Server-Side Routing

When the request hits `/api/trpc/[trpc]`, the `fetchRequestHandler` in `src/app/api/trpc/[trpc]/route.ts` takes over:

1.  **Parsing**: It looks at the URL to extract the "procedures" being called (e.g., `health.check`).
2.  **Router Traversal**: It looks at your `appRouter` (defined in `src/server/api/root.ts`).
    - It finds the `health` sub-router.
    - Inside `health`, it finds the `check` procedure.
3.  **Execution**: It runs the procedure's resolver function.
    - It first runs any middleware (like `protectedProcedure` auth checks).
    - Then it executes the logic (e.g., returning `{ status: "ok" }`).

## 4. Batching

If your component requests multiple things at once:
```tsx
const health = api.health.check.useQuery();
const user = api.user.me.useQuery();
```

tRPC automatically **batches** these into a single HTTP request to save network overhead:
```
GET /api/trpc/health.check,user.me?batch=1&...
```

The server processes both and returns an ordered array of results. The client then maps them back to the correct hooks.

## 5. Security: Queries vs. Mutations

**Critical Distinction:**
You raised a valid concern: _"If input arguments are passed as query parameters, isn't it a security vulnerability for login/signup credentials?"_

**Answer:** Yes, putting passwords in the URL is insecure. However, tRPC handles this by distinguishing between **Queries** and **Mutations**:

1.  **Queries (`useQuery`)**
    -   **Method:** `GET`
    -   **Input:** Passed in **URL Query Parameters** (serialized JSON).
    -   **Use Case:** Fetching data (e.g., `getUser(id: "123")`, `search(term: "foo")`).
    -   **Security:** **Never** send sensitive data (passwords, tokens) in a query input.

2.  **Mutations (`useMutation`)**
    -   **Method:** `POST`
    -   **Input:** Passed in the **Request Body** (JSON payload).
    -   **Use Case:** Changing data (e.g., `login`, `signup`, `createPost`).
    -   **Security:** This is secure. The body is encrypted over HTTPS and not logged in URL history.

**Example:**
For login, you would define a **procedure mutation**:
```ts
// backend
login: publicProcedure.mutation(({ input }) => { ... })
```
And call it on the frontend:
```tsx
// frontend
const login = api.auth.login.useMutation();
login.mutate({ email, password }); // Sent in POST body
```
