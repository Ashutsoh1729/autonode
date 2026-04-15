# AutoNode Project State

## Overview
AI Workflow Automation Platform using Next.js 15 (App Router), tRPC, Drizzle ORM, Inngest, React Flow.

## Tech Stack
- **Framework**: Next.js 15 App Router
- **Language**: TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth + Polar (payments)
- **API**: tRPC
- **Background Jobs**: Inngest
- **UI**: Tailwind CSS v4, shadcn/ui, Radix UI
- **Workflow Editor**: @xyflow/react

---

## Database Schema (`src/db/schema/`)

### Tables
| Table | Key Fields | Description |
|-------|------------|-------------|
| `workflows` | id (serial), name, userId, createdAt, updatedAt | Workflow definitions |
| `credentials` | id (uuid), name, value, provider (enum), userId | API keys (OPENAI, ANTHROPIC, GEMINI, RESEND, OPENROUTER) |
| `nodes` | id (cuid), workflowId, type (enum), position (jsonb), data (jsonb) | Workflow nodes |
| `connections` | id, workflowId, fromNodeId, toNodeId, fromOutput, toInput | Node edges |
| `executions` | id, workflowId, status, triggerType, input, output | Workflow runs |
| `executionNodes` | id, executionId, nodeId, status, output | Node execution results |

### Enums
- `nodeType`: `INITIAL`, `MANUAL_TRIGGER`, `CRON_TRIGGER`, `HTTP_REQUEST`, `AI`, `EMAIL`
- `credentialType`: `OPENAI`, `ANTHROPIC`, `GEMINI`, `RESEND`, `OPENROUTER`
- `executionStatus`: `PENDING`, `RUNNING`, `SUCCESS`, `FAILED`

---

## tRPC Routers (`src/trpc/routers/_app.ts`)

```typescript
appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
})
```

### Workflows Router (`src/features/workflows/server/routers.ts`)
| Procedure | Type | Description |
|-----------|------|-------------|
| `create` | premiumProcedure.mutation | Create workflow + initial node |
| `remove` | protectedProcedure.mutation | Delete workflow (cascades) |
| `update` | protectedProcedure.mutation | Save nodes/edges, sync cron jobs |
| `updateName` | protectedProcedure.mutation | Rename workflow |
| `getOne` | protectedProcedure.query | Get workflow with nodes/edges |
| `getMany` | protectedProcedure.query | Paginated workflow list |
| `execute` | protectedProcedure.mutation | Trigger workflow execution (Inngest) |

### Credentials Router (`src/features/credentials/server/credentials.router.ts`)
- CRUD for API credentials with encryption

### Executions Router (`src/features/executions/server/executions.router.ts`)
| Procedure | Type | Description |
|-----------|------|-------------|
| `create` | protectedProcedure.mutation | Create execution record |
| `updateStatus` | protectedProcedure.mutation | Update execution status/output |
| `remove` | protectedProcedure.mutation | Delete execution |
| `getMany` | protectedProcedure.query | By workflowId |
| `getAll` | protectedProcedure.query | All user executions |
| `getById` | protectedProcedure.query | Single execution with nodes |

---

## Node System

### Node Types (`src/db/schema/workflows.ts`)
```
INITIAL, MANUAL_TRIGGER, CRON_TRIGGER, HTTP_REQUEST, AI, EMAIL
```

### Node Executors Registry (`src/lib/node_executor_registery.ts`)
```typescript
executorRegistry = {
  INITIAL: manualExecutor,
  MANUAL_TRIGGER: manualExecutor,
  CRON_TRIGGER: cronExecutor,
  HTTP_REQUEST: httpNodeExecutor,
  AI: aiNodeExecutor,
  EMAIL: emailNodeExecutor,
}
getExecutor(nodeType) → NodeExecutor
```

### Executor Files (`src/features/executors/lib/`)
| File | Function | Purpose |
|------|----------|---------|
| `types.ts` | `NodeExecutor<T>` interface | `execute(node, context) => Promise<ExecutionResult>` |
| `manual-executor.ts` | `manualExecutor` | Manual trigger (no-op) |
| `cron-executor.ts` | `cronExecutor` | Cron trigger |
| `http.executor.ts` | `httpNodeExecutor` | HTTP request execution |
| `ai-executor.ts` | `aiNodeExecutor` | AI model calls |
| `email.executor.ts` | `emailNodeExecutor` | Email sending |
| `executor-registory.ts` | `executorRegistry` | Runtime executor lookup |

### Node Components (`src/lib/node-components.tsx`)
```typescript
nodeComponents = {
  INITIAL: InitialNode,
  MANUAL_TRIGGER: ManualTriggerNode,
  CRON_TRIGGER: CronJobTriggerNode,
  HTTP_REQUEST: HttpRequestNode,
  AI: AINode,
  EMAIL: EmailNode,
}
```

### React Flow Components (`src/components/react-flow/`)
| Component | File | Purpose |
|-----------|------|---------|
| `WorkflowNode` | `workflow-node.tsx` | Base node wrapper |
| `BaseNode` | `base-node.tsx` | Node shell with handles |
| `NodeSelecter` | `node-selecter.tsx` | Sidebar node picker |
| `NodeStatusIndicator` | `node-status-indicator.tsx` | Execution status badge |

---

## Inngest Functions (`src/inngest/`)

### Client (`src/inngest/client.ts`)
```typescript
inngest = new Inngest({ id: "autonode", ...
```

### Channels (`src/inngest/channels/`)
| Channel | Event | Purpose |
|---------|-------|---------|
| `manual-trigger.ts` | `workflow/execute` | Manual workflow run |
| `cron-trigger.ts` | `workflow/cron` | Scheduled workflow run |
| `ai-request.ts` | `ai/request` | Async AI calls |
| `http-request.ts` | `http/request` | Async HTTP requests |

### Functions (`src/inngest/functions/`)
- `research.ts` - Research workflow
- `generate-text.ts` - Text generation

---

## Key Hooks

| Hook | Location | Purpose |
|------|----------|---------|
| `useWorkflows` | `src/features/workflows/hooks/use-workflows.ts` | Workflow CRUD with React Query |
| `useCredentialsSync` | `src/features/credentials/hooks/use-credentials-sync.ts` | Credentials state sync |
| `useNodeStatus` | `src/features/executors/hooks/use-node-status.ts` | Node execution status |

---

## Pages (`src/app/`)

| Route | File | Description |
|-------|------|-------------|
| `/` | `(marketing)/page.tsx` | Landing page |
| `/sign-in` | `(auth)/sign-in/page.tsx` | Auth |
| `/credentials` | `(dashboard)/(rest)/credentials/page.tsx` | API keys management |
| `/workflows/[workflowId]` | `(dashboard)/(editor)/workflows/[workflowId]/page.tsx` | Workflow editor |

---

## Setup Commands

```bash
# Install
pnpm install

# Database
pnpm db:generate  # Generate migrations
pnpm db:push      # Push schema
pnpm db:studio    # Open Drizzle Studio

# Dev
pnpm dev          # Next.js dev
pnpm inngest:dev  # Inngest dev server
pnpm dev:all      # Both

# Lint/Typecheck
pnpm lint
pnpm tsc --noEmit
```

---

## Environment Variables
- `DATABASE_URL` - PostgreSQL
- `BETTER_AUTH_SECRET` - Auth encryption
- `POLAR_ACCESS_KEY` - Payment API
- `INNGEST_EVENT_KEY` - Inngest events
- `INNGEST_SIGNING_KEY` - Inngest signing