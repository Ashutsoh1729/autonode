# AutoNode Specification

## Overview

AutoNode is an AI workflow automation platform that enables users to create visual workflows with various node types (triggers, HTTP requests, AI actions).

---

## Tech Stack

| Category         | Technology                      |
| ---------------- | ------------------------------- |
| Framework        | Next.js 15 (App Router)         |
| Language         | TypeScript                      |
| Database         | PostgreSQL (Neon) + Drizzle ORM |
| Authentication   | Better Auth                     |
| Payments         | Polar SDK                       |
| API Layer        | tRPC                            |
| Background Jobs  | Inngest                         |
| State Management | Jotai + React Query             |
| UI               | Tailwind CSS v4, shadcn/ui      |
| Workflow Editor  | React Flow (@xyflow/react)      |
| AI SDK           | Vercel AI SDK                   |

---

## Node Types

| Node Type      | Enum Value       | Status     | Description                    |
| -------------- | ---------------- | ---------- | ------------------------------ |
| Initial        | `INITIAL`        | ✅         | Starting point for workflows   |
| Manual Trigger | `MANUAL_TRIGGER` | ✅         | Trigger workflow manually      |
| Cron Trigger   | `CRON_TRIGGER`   | ✅         | Schedule workflow execution    |
| HTTP Request   | `HTTP_REQUEST`   | ✅         | Make HTTP API calls            |
| AI             | `AI`             | ✅         | Generate text using AI models  |
| Code Executor  | -                | 📋 Planned | Execute custom JavaScript code |

---

## Credentials Providers

| Provider      | Enum Value  | Status |
| ------------- | ----------- | ------ |
| OpenAI        | `OPENAI`    | ✅     |
| Anthropic     | `ANTHROPIC` | ✅     |
| Google Gemini | `GEMINI`    | ✅     |

---

## tRPC API Routers

| Router        | Features                                 |
| ------------- | ---------------------------------------- |
| `workflows`   | CRUD operations, execution, editor state |
| `credentials` | Manage API credentials                   |
| `executions`  | Execution history, status updates        |

---

## Database Tables

| Table             | Description                                      |
| ----------------- | ------------------------------------------------ |
| `workflows`       | User workflow definitions                        |
| `nodes`           | Nodes within workflows                           |
| `connections`     | Connections between nodes                        |
| `credentials`     | User API credentials                             |
| `executions`      | Workflow execution records                       |
| `execution_nodes` | Node-level execution data (infrastructure ready) |

---

## Features

### Implemented

- [x] User authentication (sign-up, sign-in, session management)
- [x] Workflow CRUD operations
- [x] Visual workflow editor (React Flow)
- [x] Node configuration dialogs
- [x] Manual workflow execution
- [x] Scheduled (cron) workflow execution
- [x] Webhook-triggered execution
- [x] HTTP request node
- [x] AI text generation node
- [x] Credential management (API keys)
- [x] Execution history (list view + detail view)
- [x] Real-time execution status (Inngest)
- [x] Premium/subscription gating (Polar)

### Planned / In Progress

- [ ] Code executor node
- [ ] Node-level execution tracking (requires executor updates)
- [ ] Webhook URL generation per workflow

---

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── (auth)/            # Auth pages
│   ├── (dashboard)/       # Dashboard pages
│   └── api/               # API routes
├── components/            # Shared UI components
│   ├── ui/               # shadcn/ui
│   └── react-flow/       # React Flow nodes
├── db/                   # Database
│   └── schema/           # Drizzle schema
├── features/             # Feature modules
│   ├── credentials/      # API credentials
│   ├── executions/      # Execution history
│   ├── triggers/        # Trigger types
│   ├── workflows/        # Workflow CRUD
│   └── executors/        # Node executors
├── inngest/              # Background jobs
├── lib/                  # Utilities
└── trpc/                 # API routers
```

---

## Key Files

| Purpose                | File                                  |
| ---------------------- | ------------------------------------- |
| Node types enum        | `src/db/schema/workflows.ts`          |
| Node executor registry | `src/lib/node-registery.ts`           |
| Executor types         | `src/features/executors/lib/types.ts` |
| Inngest functions      | `src/inngest/functions.ts`            |
| tRPC routers           | `src/trpc/routers/_app.ts`            |
| Auth config            | `src/lib/auth.ts`                     |

---

## Documentation

| Doc                       | Location                     |
| ------------------------- | ---------------------------- |
| Node Implementation Guide | `docs/plan/features/node.md` |
| Project Structure         | `docs/init/structure.md`     |
| Error Logs                | `docs/errors/`               |
| Feature Plans             | `docs/plan/features/`        |

---

_Last updated: April 2026_
