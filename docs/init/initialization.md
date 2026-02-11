# Autonode — Project Initialization

> **Date:** February 11, 2026

## Goal

Build **Autonode**, an open-source workflow automation tool inspired by [n8n](https://n8n.io). Autonode will provide a visual, node-based interface where users can design, connect, and execute automated workflows by linking together modular "nodes" — each representing a discrete action, trigger, or integration.

## Vision

- **Visual Workflow Builder** — Drag-and-drop canvas for creating automation pipelines.
- **Node-Based Architecture** — Each node encapsulates a single responsibility (e.g., HTTP request, database query, conditional logic, webhook trigger).
- **Extensible Integrations** — Support for third-party services, APIs, and custom code nodes.
- **Real-Time Execution** — Execute workflows on demand or via scheduled/event-driven triggers.
- **User Authentication** — Secure access with Better Auth (email/password, OAuth, etc.).

## Starting Point

| Layer         | Technology              |
| ------------- | ----------------------- |
| Framework     | Next.js (App Router)    |
| Language      | TypeScript              |
| Styling       | Tailwind CSS v4         |
| UI Components | shadcn/ui               |
| Auth          | Better Auth             |
| Package Mgr   | pnpm                    |

### What's been scaffolded

1. **Next.js app** created with `create-next-app` — TypeScript, Tailwind CSS, ESLint, App Router, `src/` directory structure, Turbopack.
2. **shadcn/ui** initialized — `components.json` configured, `src/lib/utils.ts` with the `cn` utility ready to go.
3. **better-auth** installed — ready for auth configuration.

### Next Steps

- Set up the database (e.g., PostgreSQL / SQLite via Drizzle ORM).
- Configure Better Auth (server + client).
- Design the core data models (Workflows, Nodes, Edges, Executions).
- Build the visual workflow editor using React Flow.
- Implement node execution engine.
