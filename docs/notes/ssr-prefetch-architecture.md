# tRPC + React Query + Next.js SSR Prefetch Architecture

## Q: Why is React Query used on the server? Isn't it a client library?

**Short Answer:** React Query is used on the server only as a **data container** - not for making HTTP requests.

**What's Actually Happening:**

| Location | What React Query Does |
|----------|----------------------|
| **Server** | Executes query function directly, stores result in memory |
| **Client** | Makes HTTP requests via tRPC, manages cache |

**Key Insight:**

```
Server (prefetchQuery):
┌─────────────────────────────────────┐
│ queryClient.prefetchQuery()         │
│         │                           │
│         │ (NO HTTP request!)        │
│         ▼                           │
│ queryFn() → executes DIRECTLY       │
│      ↓                              │
│ Database query (SQL)               │
│      ↓                              │
│ Stores in cache (in-memory)        │
└─────────────────────────────────────┘

Client (useQuery):
┌─────────────────────────────────────┐
│ useQuery()                          │
│         │                           │
│         │ (makes HTTP request)      │
│         ▼                           │
│ tRPC API call → /api/trpc           │
│      ↓                              │
│ Server executes SQL                 │
│      ↓                              │
│ Returns JSON to client              │
└─────────────────────────────────────┘
```

**Why Use React Query on Server?**

1. **Unified API** - Same `queryOptions` work on server and client
2. **Serialization** - `dehydrate()` easily serializes cached data
3. **Cache key matching** - Client finds exact same cache key for instant data

---

## Q: What does "store in cache" mean? Is it a different cache from client?

**Answer:** Yes, completely different. Let me explain:

### What is "cache" on the server?

It's literally just a JavaScript **Map/Object in memory**:

```typescript
// This is what QueryClient.cache looks like internally:
const serverCache = new Map();

// Structure:
serverCache.set("queryHash_abc123", {
  data: [{ id: 1, name: "Workflow 1" }],
  status: "success",
  updatedAt: Date.now(),
});
```

### Server vs Client Cache Comparison

| Aspect | Server Cache | Client Cache |
|--------|--------------|--------------|
| **Location** | Server RAM (Node.js) | Browser RAM |
| **Lifetime** | Single HTTP request | Until page refresh |
| **Type** | Plain JavaScript Map | React Query's QueryClient |
| **Purpose** | Temporary data holding | Persistent state management |

### The Key Insight: They Are Not Connected

```
SERVER (page.tsx runs)              CLIENT (browser runs)
┌─────────────────────────┐         ┌─────────────────────────┐
│                         │         │                         │
│ QueryClient.cache = {  │         │ QueryClient.cache = {   │
│   "workflows": [...]   │         │   "workflows": [...]     │
│ }                       │         │ }                       │
│         │               │         │         │               │
│         │ dehydrate()   │         │         │ hydrate()     │
│         │ (serialize)   │─────────│         │ (deserialize) │
│         ▼               │         │         ▼               │
│ {queries: [...]}       │         │ {queries: [...]}         │
│                         │         │                         │
└─────────────────────────┘         └─────────────────────────┘
        │                                     │
        └─────────── copied as JSON ──────────┘
                    (NOT shared!)
```

### Visual: Complete Separation

```
REQUEST: GET /workflows
           │
           ▼
┌─────────────────────────────────────────────┐
│            SERVER (Node.js)                 │
│                                             │
│  1. QueryClient created                     │
│     (new QueryClient())                     │
│           │                                  │
│           ▼                                  │
│  2. prefetchQuery() executes                │
│     - queryFn() runs → DB query             │
│     - Result stored in:                     │
│       queryClient.cache                     │
│       (in-memory Map)                        │
│           │                                  │
│           ▼                                  │
│  3. dehydrate() serializes                  │
│     - Converts cache to JSON                │
│     - Passes as prop to HTML                │
│           │                                  │
│           ▼                                  │
│  4. Response sent to browser                │
│     - HTML + serialized data                │
│     - QueryClient is DESTROYED              │
│       (garbage collected)                   │
└─────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│            CLIENT (Browser)                 │
│                                             │
│  5. HydrationBoundary receives state        │
│     - New QueryClient created               │
│     - Populates cache from JSON             │
│           │                                  │
│           ▼                                  │
│  6. useQuery() reads from cache             │
│     - Finds data instantly                  │
│     - No network request needed!             │
└─────────────────────────────────────────────┘
```

### Why React Query Calls It "Cache"?

React Query was designed for client-side **caching** of API responses. When using it on server for SSR:

1. We **reuse** the same concept (storing data in a Map)
2. We **reuse** the same API (`prefetchQuery`, `dehydrate`)
3. We **reuse** the serialization logic

But technically, on server it's not "caching" - it's just **temporarily holding data** until we serialize it to the client.

---

## Q: Why so many layers of abstraction? I'm new to React Query.

**Answer:** The abstractions are there to make your life easier. Let me break down each layer:

### Layer by Layer

```
┌────────────────────────────────────────────────────────────────┐
│ LAYER 1: Your Server Page (page.tsx)                          │
│                                                                │
│   await prefetchWorkflows(params)                              │
│   return <HydrateClient><WorkflowLists /></HydrateClient>      │
│                                                                │
│   → You just call a function and wrap a component             │
└────────────────────────────┬───────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│ LAYER 2: Feature Prefetch (prefetch.ts)                       │
│                                                                │
│   export const prefetchWorkflows = (params) => {              │
│     return prefetch(trpc.workflows.getMany.queryOptions(...)) │
│   }                                                            │
│                                                                │
│   → Wraps tRPC query in easy-to-use function                   │
└────────────────────────────┬───────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│ LAYER 3: Core Prefetch (trpc/server.tsx)                      │
│                                                                │
│   export function prefetch(queryOptions) {                     │
│     const queryClient = getQueryClient()                     │
│     void queryClient.prefetchQuery(queryOptions)              │
│   }                                                            │
│                                                                │
│   → Calls React Query's prefetchQuery internally               │
└────────────────────────────┬───────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│ LAYER 4: React Query Core                                     │
│                                                                │
│   queryClient.prefetchQuery({                                  │
│     queryKey: [...],                                           │
│     queryFn: () => trpc.fetch(...)                            │
│   })                                                           │
│                                                                │
│   → Executes query, stores in internal Map                    │
└────────────────────────────┬───────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│ LAYER 5: Your tRPC Router (routers/workflows.ts)             │
│                                                                │
│   getMany: publicProcedure.query(() => {                       │
│     return db.select(...).from(workflows)                     │
│   })                                                           │
│                                                                │
│   → This is your actual DB query                              │
└────────────────────────────────────────────────────────────────┘
```

### Why These Layers Exist

| Layer | Why | You Touch It? |
|-------|-----|---------------|
| **Your Page** | Entry point | ✅ Always |
| **Feature Prefetch** | Type-safe, reusable | ✅ Per feature |
| **Core Prefetch** | Shared logic | ✅ Never (hidden) |
| **React Query** | Data management | ✅ Never (library) |
| **tRPC Router** | Your API | ✅ When defining routes |

### Think of It Like This

```
You: "I want to show workflows"
  │
  ▼
Page: "I'll call prefetchWorkflows()"
  │
  ▼
Feature: "Here's the query options"
  │
  ▼
Core: "I'll prefetch it"
  │
  ▼
React Query: "I'll execute and store"
  │
  ▼
tRPC: "I'll run the SQL"
  │
  ▼
Database: "Here's your data"
```

You only need to understand **Layer 1 and 2** to use it. The rest is handled automatically.

---

## Components Responsible for Prefetching

### Core Components

| Component | File Path | Purpose |
|-----------|-----------|---------|
| `getQueryClient` | `src/trpc/server.tsx` | Creates & caches QueryClient per request |
| `prefetch()` | `src/trpc/server.tsx` | Executes query, stores in cache |
| `HydrateClient` | `src/trpc/server.tsx` | Serializes cache, passes to client |
| `prefetchWorkflows` | `src/features/workflows/server/prefetch.ts` | Feature-specific prefetch wrapper |
| `makeQueryClient` | `src/trpc/query-client.ts` | QueryClient configuration |
| `query-client.ts` | `src/trpc/client.tsx` | Client-side QueryClient provider |
| `TRPCReactProvider` | `src/trpc/client.tsx` | Sets up React Query context |

### Feature Prefetch Files

| Feature | File |
|---------|------|
| Workflows | `src/features/workflows/server/prefetch.ts` |
| Credentials | `src/features/credentials/server/credentials.prefetch.ts` |
| Executions | `src/features/executions/server/prefetch.ts` |

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              SERVER (page.tsx)                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. await requireAuth()                                                      │
│            ↓                                                                 │
│  2. await workflowParamsLoader(searchParams)                                │
│            ↓                                                                 │
│  3. await prefetchWorkflows(params)  ───────────────┐                       │
│            ↓                                         │                       │
│     ┌─────▼──────────────────────────────────────────▼────────────┐          │
│     │           FEATURE PREFETCH LAYER                          │          │
│     │  src/features/workflows/server/prefetch.ts              │          │
│     │                                                          │          │
│     │  export const prefetchWorkflows = (params) => {          │          │
│     │    return prefetch(trpc.workflows.getMany.queryOptions(params));       │
│     │  };                                                           │          │
│     └──────────────────────┬──────────────────────────────────────┘          │
│                            │                                                 │
│     ┌──────────────────────▼──────────────────────────────────────┐          │
│     │                  CORE PREFETCH LAYER                        │          │
│     │  src/trpc/server.tsx                                        │          │
│     │                                                              │          │
│     │  export function prefetch(queryOptions) {                  │          │
│     │    const queryClient = getQueryClient();  ← cache()         │          │
│     │    void queryClient.prefetchQuery(queryOptions);            │          │
│     │  }                                                           │          │
│     │                                                              │          │
│     │  const queryClient = getQueryClient()                       │          │
│     │       │                                                      │          │
│     │       │ cache(makeQueryClient)                               │          │
│     │       │ (memoizes per request)                               │          │
│     │       ▼                                                      │          │
│     │  ┌─────────────────────────────────────────────────────┐     │          │
│     │  │ QueryClient (in-memory)                             │     │          │
│     │  │ ┌─────────────────────────────────────────────────┐ │     │          │
│     │  │ │ queryKey: ["workflows", "getMany", {...}]       │ │     │          │
│     │  │ │ queryFn: () => fetch from API                   │ │     │          │
│     │  │ │ data: [{id: 1, name: "..."}, ...]  ← CACHED    │ │     │          │
│     │  │ │ status: "success"                               │ │     │          │
│     │  │ └─────────────────────────────────────────────────┘ │     │          │
│     │  └─────────────────────────────────────────────────────┘     │          │
│     └──────────────────────┬──────────────────────────────────────┘          │
│                            │                                                 │
│     ┌──────────────────────▼──────────────────────────────────────┐          │
│     │                  HYDRATION LAYER                             │          │
│     │                                                              │          │
│     │  return (                                                   │          │
│     │    <HydrateClient>                    ← dehydrate()         │          │
│     │      <WorkflowLists />                                   │          │
│     │    </HydrateClient>                                      │          │
│     │  )                                                         │          │
│     │                                                              │          │
│     │  export function HydrateClient(props) {                    │          │
│     │    const queryClient = getQueryClient();                   │          │
│     │    return (                                                │          │
│     │      <HydrationBoundary                                    │          │
│     │        state={dehydrate(queryClient)}                      │          │
│     │      >                                                      │          │
│     │        {props.children}                                     │          │
│     │      </HydrationBoundary>                                   │          │
│     │    );                                                       │          │
│     │  }                                                          │          │
│     │                                                              │          │
│     │  ┌─────────────────────────────────────────────────────┐      │          │
│     │  │ dehydrate() output:                                │      │          │
│     │  │ {                                                   │      │          │
│     │  │   queries: [{                                      │      │          │
│     │  │     queryKey: ["workflows", "getMany", {...}],    │      │          │
│     │  │     queryHash: "...",                              │      │          │
│     │  │     data: [{id: 1, name: "..."}],  ← SERIALIZED   │      │          │
│     │  │     state: { status: "success", ... }              │      │          │
│     │  │   }]                                                │      │          │
│     │  │ }                                                   │      │          │
│     │  └─────────────────────────────────────────────────────┘      │          │
│     └───────────────────────────────────────────────────────────────┘          │
│                            │                                                 │
│                            ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐      │
│  │                    HTML OUTPUT                                       │      │
│  │                                                                       │      │
│  │  <div>                                                                │      │
│  │    <HydrationBoundary state="{serialized JSON}">  ← INLINE SCRIPT   │      │
│  │      <WorkflowLists />                                              │      │
│  │    </HydrationBoundary>                                              │      │
│  │  </div>                                                               │      │
│  │                                                                       │      │
│  └─────────────────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ (Serialized state passed as prop)
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. HTML loads with serialized state in __NEXT_DATA__ or inline script       │
│                                                                              │
│  2. React hydrates:                                                          │
│                                                                              │
│     ┌─────────────────────────────────────────────────────────────────┐       │
│     │  HydrationBoundary (React Query)                               │       │
│     │                                                                 │       │
│     │  - Reads `state` prop (serialized JSON)                        │       │
│     │  - deserializeData: superjson.deserialize()                    │       │
│     │  - Populates query cache with deserialized data                 │       │
│     │                                                                 │       │
│     │  ┌─────────────────────────────────────────────────────────┐   │       │
│     │  │ QueryClient cache (rehydrated):                        │   │       │
│     │  │ ┌─────────────────────────────────────────────────────┐ │   │       │
│     │  │ │ queryKey: ["workflows", "getMany", {...}]         │ │   │       │
│     │  │ │ data: [{id: 1, name: "..."}, ...]  ← READY        │ │   │       │
│     │  │ │ staleTime: 30000                                   │ │   │       │
│     │  │ └─────────────────────────────────────────────────────┘ │   │       │
│     │  └─────────────────────────────────────────────────────────┘   │       │
│     └─────────────────────────────────────────────────────────────────┘       │
│                            │                                                 │
│                            ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │  useSuspenseQuery / useQuery (client component)                   │       │
│  │                                                                 │       │
│  │  const { data } = useSuspenseQuery(                              │       │
│  │    trpc.workflows.getMany.queryOptions(params)                 │       │
│  │  );                                                             │       │
│  │       │                                                          │       │
│  │       │ (reads from cache - INSTANT, no network!)               │       │
│  │       ▼                                                          │       │
│  │  [{id: 1, name: "..."}, ...]  ← rendered immediately            │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Request Flow

### Server Side

```
REQUEST: GET /workflows
    │
    ▼
┌─────────────────────────────────────┐
│ 1. page.tsx (Server Component)      │
├─────────────────────────────────────┤
│ await requireAuth()                 │
│ await prefetchWorkflows(params)    │ ──┐
│ return (                            │   │
│   <HydrateClient>                  │   │
│     <WorkflowLists />              │   │
│   </HydrateClient>                 │   │
│ )                                  │   │
└─────────────────────────────────────┘   │
                                        ▼
┌─────────────────────────────────────────────────────┐
│ 2. prefetchWorkflows()                              │
│     src/features/workflows/server/prefetch.ts      │
├─────────────────────────────────────────────────────┤
│ prefetch(trpc.workflows.getMany.queryOptions(params)) │
│         │                                           │
│         ▼                                           │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 3. prefetch()                                   │ │
│ │    src/trpc/server.tsx                          │ │
│ ├─────────────────────────────────────────────────┤ │
│ │ getQueryClient() ← uses cache()                  │ │
│ │ queryClient.prefetchQuery(queryOptions)        │ │
│ │       │                                         │ │
│ │       │ (executes query, stores result in cache)│ │
│ │       ▼                                         │ │
│ │ ┌─────────────────────────────────────────────┐ │ │
│ │ │ QueryClient.cache                           │ │ │
│ │ │ ["workflows", "getMany", {...}] → DATA     │ │ │
│ │ └─────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Serialization

```
┌─────────────────────────────────────┐
│ 4. HydrateClient                   │
│    src/trpc/server.tsx             │
├─────────────────────────────────────┤
│ const queryClient = getQueryClient()│
│ return (                            │
│   <HydrationBoundary              │
│     state={dehydrate(queryClient)} │ ← serializes cache
│   >                                │
│     {props.children}               │
│   </HydrationBoundary>             │
│ )                                  │
└─────────────────────────────────────┘
        │
        │ dehydrate() with superjson.serialize()
        ▼
┌─────────────────────────────────────┐
│ Serialized State (JSON)             │
├─────────────────────────────────────┤
│ {                                   │
│   queries: [{                      │
│     queryKey: ["workflows",...],   │
│     data: [...],  ← WORKFLOWS      │
│     state: { status: "success" }  │
│   }]                               │
│ }                                   │
└─────────────────────────────────────┘
        │
        ▼ (sent as HTML prop)
```

### Client Side

```
┌─────────────────────────────────────┐
│ 5. Client Browser                  │
├─────────────────────────────────────┤
│ React Query HydrationBoundary       │
│ reads state prop                    │
│ superjson.deserialize()             │
│ populates QueryClient.cache         │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ 6. WorkflowLists (Client Component) │
├─────────────────────────────────────┤
│ useSuspenseQuery(                   │
│   trpc.workflows.getMany.queryOptions() │
│ )                                   │
│       │                             │
│       │ (reads from cache - HIT!)  │
│       ▼                            │
│ data: [{id:1, name:"..."}, ...]   │
│       │                             │
│       ▼                            │
│ Renders instantly (no loading!)    │
└─────────────────────────────────────┘
```

---

## Query Cache Key Structure

```
queryKey: ["workflows", "getMany", { page: 1, search: "" }]
                    │       │        │
                    │       │        └── Input parameters
                    │       └── Procedure name
                    └── Router name
```

---

## Cache Lifecycle

```
┌────────────────────────────────────────────────────────────────────────┐
│                    CACHE LIFECYCLE                                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. CREATE (Server)                                                    │
│     getQueryClient() → cache(makeQueryClient)                         │
│           │                                                             │
│           ▼                                                             │
│     QueryClient created once per request                               │
│                                                                        │
│  2. PREFETCH (Server)                                                 │
│     queryClient.prefetchQuery(queryOptions)                           │
│           │                                                             │
│           │ executes query + stores in cache                           │
│           ▼                                                             │
│     cache: { "queryHash": { data, status } }                          │
│                                                                        │
│  3. DEHYDRATE (Server)                                                │
│     dehydrate(queryClient)                                             │
│           │                                                             │
│           │ serializes cache to JSON                                   │
│           ▼                                                             │
│     { queries: [{ queryKey, data, state }] }                          │
│                                                                        │
│  4. HYDRATE (Client)                                                  │
│     <HydrationBoundary state={...}>                                   │
│           │                                                             │
│           │ deserializes + populates cache                            │
│           ▼                                                             │
│     QueryClient.cache populated                                        │
│                                                                        │
│  5. READ (Client)                                                     │
│     useQuery() reads from cache                                        │
│           │                                                             │
│           │ cache hit → instant data                                  │
│           │ cache miss → fetch from API                               │
│           ▼                                                             │
│     UI renders                                                         │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Files Responsible for Each Step

| Step | File | Function |
|------|------|----------|
| Cache creation | `src/trpc/server.tsx` | `getQueryClient = cache(makeQueryClient)` |
| Query execution | `src/trpc/server.tsx` | `prefetch(queryOptions)` |
| Serialization | `src/trpc/server.tsx` | `dehydrate(queryClient)` |
| Wrapper component | `src/trpc/server.tsx` | `HydrateClient` |
| Feature prefetch | `src/features/*/server/prefetch.ts` | `prefetchWorkflows()`, etc. |
| Server page | `src/app/(dashboard)/**/page.tsx` | Calls prefetch + HydrateClient |
| Client setup | `src/trpc/client.tsx` | `TRPCReactProvider` |
| Client query | `src/features/*/hooks/*.ts` | `useSuspenseQuery()` |

---

## Summary Table

| Concept | Purpose |
|---------|---------|
| `cache(react)` | Memoizes QueryClient creation per request |
| `prefetchQuery()` | Executes query on server, stores result in cache |
| `dehydrate()` | Serializes cache to JSON (for SSR) |
| `HydrationBoundary` | Rehydrates cache on client from serialized state |
| `superjson` | Handles Date, Map, Set serialization |
| `staleTime` | How long data stays "fresh" before refetching |
| `useSuspenseQuery` | Reads from cache with Suspense integration |
