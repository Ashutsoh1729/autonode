# RCA: Better Auth Schema Mismatch

> **Date:** February 11, 2026
> **Status:** Resolved

## Error
`[BetterAuthError]: [# Drizzle Adapter]: The model "user" was not found in the schema object.`

## Root Cause
The Drizzle schema was imported as a namespaced object (e.g., `schema.auth.user`) due to the `src/db/schema/index.ts` structure:
```ts
import * as auth from "./auth";
export { auth };
```
The Better Auth adapter expects the table objects to be at the top level of the provided schema or to find keys like `user`, `session`. Since `schema` only contained the `auth` key, the lookup failed.

## Solution
Modified `src/lib/auth.ts` to explicitly import and pass the `auth` schema object to the adapter:

```ts
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { ...schema.auth }, // Pass the flattened auth schema
  }),
});
```
