# tRPC Route Implementation Guide

> **Date:** February 11, 2026
> **Topic:** How to create a new tRPC route and consume it on the frontend.

## 1. Backend: Define the Router

Create a new file in `src/server/api/routers` (e.g., `post.ts`).

```ts
// src/server/api/routers/post.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  // 1. Define a procedure
  hello: publicProcedure
    .input(z.object({ text: z.string() })) // Validation
    .query(({ input }) => {
      // Logic
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // 2. Secured procedure (requires login)
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // ctx.session is guaranteed here
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: ctx.session.user.id,
        },
      });
    }),
});
```

## 2. Backend: Register in Root Router

Add your new router to `src/server/api/root.ts`.

```ts
// src/server/api/root.ts
import { postRouter } from "@/server/api/routers/post";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  post: postRouter, // <--- Add this line
});
```

## 3. Frontend: Consume the Query

In your client component, import `api` from `src/trpc/react`.

```tsx
"use client";
import { api } from "@/trpc/react";

export default function HelloComponent() {
  // Query (GET)
  const hello = api.post.hello.useQuery({ text: "World" });

  // Mutation (POST)
  const createPost = api.post.create.useMutation();

  if (hello.isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>{hello.data?.greeting}</p>
      
      <button
        onClick={() => {
          createPost.mutate({ name: "My New Post" });
        }}
        disabled={createPost.isPending}
      >
        Create Post
      </button>
    </div>
  );
}
```

### Key Takeaway
You define the input schema (`zod`) and logic on the **backend**. The **frontend** gets full type safety (arguments, return types) automatically via the `api` object.
