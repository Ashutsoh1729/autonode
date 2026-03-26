# Codebase Structure Report

This document outlines the high-level organization and architecture of the Autonode codebase. 

The project is built around a modern full-stack web application structure, utilizing Next.js (App Router), tRPC for full-stack API capabilities, Drizzle ORM for the database layer, and Inngest for background worker functions.

## High-Level Directory Map

- **`docs/`**: Project documentation, conceptual plans, error logs, and verification reports.
- **`public/`**: Static assets for the application.
- **`src/`**: The core application source code.
  - **`app/`**: Next.js App Router containing route segments grouped by feature:
    - `(auth)`: Authentication-related pages.
    - `(dashboard)`: Main application dashboard and tool interface.
    - `(marketing)`: Public-facing landing and marketing pages.
    - `api/`: API endpoints, likely including tRPC handlers and Next.js route handlers.
  - **`components/`**: Shared React components.
    - `ui/`: Fundamental UI building blocks.
    - `react-flow/`: Specialized components for building interactive node-based editors.
    - Feature-specific component groups (`dashboard`, `marketing`, etc.).
  - **`db/`**: Database configuration and Drizzle schema structures.
    - `schema/`: Entity definitions and architectures.
    - `migration/`: Code or commands handling database migrations.
  - **`features/`**: Feature-sliced architecture modules containing the core domain logic. Groups contain their own specific state and functions.
    - `credentials`: Managing external service credentials.
    - `editor`: The node-based workflow editor logic.
    - `executions`: Logging and managing workflow executions.
    - `triggers`: Trigger configurations for workflows.
    - `workflows`: Flow configurations and logic.
  - **`hooks/`**: Global custom React hooks (e.g., `use-mobile.ts`, `use-subscription.ts`).
  - **`inngest/`**: Inngest workflow and task queue configurations for handling background/async operations.
  - **`lib/`**: Global utilities, configuration, and fundamental setups. Contains Better-Auth configuration (`auth.ts`).
  - **`services/`**: Integration layers with third-party software (e.g., `ai` services).
  - **`trpc/`**: Configuration and routers for tRPC:
    - `routers/`: Procedures and endpoints for the API, handling the server-side logic matching the client queries.
    - Client and server setups for Next.js environments.

## Key Technologies and Libraries

1. **Framework**: Next.js (App Router)
2. **Database & ORM**: PostgreSQL (Neon Database) and Drizzle ORM.
3. **API & Data Fetching**: tRPC with React Query (`@tanstack/react-query`)
4. **Authentication**: Better Auth (`@polar-sh/better-auth`)
5. **Background Functions**: Inngest (`@inngest/realtime`)
6. **Node Editor Interface**: React Flow (`@xyflow/react`)
7. **AI Integrations**: Vercel AI SDK (`@ai-sdk/google`)
8. **Payments and Billing**: Polar SDK (`@polar-sh/sdk`)
9. **Observability**: Sentry for Next.js

## Organization Summary

By splitting domain-heavy operations into `src/features/` and maintaining backend data structures in `src/db/` and background tasks in `src/inngest/`, the application architecture effectively separates web rendering, API execution layer, database, and background processing. The Node-based editor logic leverages React Flow in both the `components` structure and the specific `editor` feature.
