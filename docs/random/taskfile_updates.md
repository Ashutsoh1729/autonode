# Taskfile Updates — Feb 11, 2026

Updated `Taskfile.yml` with:

1. **`db:up` now auto-starts Docker** — checks if Docker daemon is running, opens Docker Desktop if not, waits until ready, then runs `docker compose up -d`.
2. **`task start`** — starts the Postgres container (with Docker check) then launches the Next.js dev server. Single command to boot everything.
3. **`task stop`** — stops the Postgres container. Volumes are preserved (no `-v` flag).
4. **`db:down`** explicitly noted as volume-preserving. Only `db:reset` removes volumes.
