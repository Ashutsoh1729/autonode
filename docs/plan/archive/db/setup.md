# Database Setup Plan

> **Date:** February 11, 2026

## Overview

Set up the database layer for **Autonode** using Drizzle ORM with a Dockerized PostgreSQL instance, integrated with Better Auth for authentication.

## Tech Stack Decisions

| Concern         | Choice                | Rationale                                                     |
| --------------- | --------------------- | ------------------------------------------------------------- |
| ORM             | Drizzle ORM           | Type-safe, SQL-like API, great Next.js integration            |
| Database        | PostgreSQL 16         | Mature, feature-rich, excellent for workflow/relational data   |
| Postgres Driver | `pg` (node-postgres)  | Well-established, widely used, battle-tested                  |
| Containerization| Docker Compose        | Reproducible local dev environment                            |
| Auth            | Better Auth + Drizzle | First-class Drizzle adapter, handles user/session/account     |
| Task Runner     | Taskfile (taskfile.dev)| Simple YAML-based, cross-platform, centralized commands       |

## Files Created

### Infrastructure

| File                 | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `docker-compose.yml` | Postgres 16 service with healthcheck & volume      |
| `.env`               | `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` |
| `Taskfile.yml`       | Centralized task runner (dev, db, auth commands)    |
| `drizzle.config.ts`  | Drizzle Kit config (schema path, migrations output) |

### Application Code

| File                        | Purpose                                      |
| --------------------------- | -------------------------------------------- |
| `src/db/index.ts`           | Database client (pg Pool + Drizzle wrapper)  |
| `src/db/schema/index.ts`    | Schema barrel file                           |
| `src/db/schema/auth.ts`     | Better Auth tables (user, session, account, verification) |
| `src/lib/auth.ts`           | Better Auth server-side config               |
| `src/lib/auth-client.ts`    | Better Auth client-side helpers               |

## Dependencies Installed

### Runtime
- `drizzle-orm` — ORM
- `pg` — PostgreSQL driver
- `dotenv` — Environment variable loading
- `better-auth` — Authentication (installed previously)

### Dev
- `drizzle-kit` — Migration tooling & Drizzle Studio
- `@types/pg` — TypeScript types for pg
- `tsx` — TypeScript execution for scripts

## Docker Compose

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: autonode-db
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: autonode
      POSTGRES_PASSWORD: autonode
      POSTGRES_DB: autonode
    volumes:
      - autonode-pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U autonode -d autonode"]
```

## Auth Schema (Better Auth)

Four core tables:
- **`user`** — id, name, email, emailVerified, image, timestamps
- **`session`** — id, token, expiresAt, ipAddress, userAgent, userId (FK → user)
- **`account`** — id, providerId, accountId, tokens, userId (FK → user)
- **`verification`** — id, identifier, value, expiresAt, timestamps

## Available Tasks

```bash
task dev          # Start Next.js dev server
task db:up        # Start Postgres container
task db:down      # Stop Postgres container
task db:generate  # Generate migration files
task db:migrate   # Apply migrations
task db:push      # Push schema directly (dev)
task db:studio    # Open Drizzle Studio
task db:reset     # Stop container & remove volume
task auth:generate # Generate Better Auth schema
```

## Next Steps

1. Start Postgres: `task db:up`
2. Push schema: `task db:push`
3. Configure Better Auth API route handler
4. Build authentication UI (sign up / sign in pages)
5. Design application-specific schema (workflows, nodes, edges, executions)
