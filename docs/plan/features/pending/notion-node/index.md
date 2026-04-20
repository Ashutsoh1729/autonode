# Notion Node

## Overview

A node that fetches rows from a Notion database, filters by column value, and optionally marks rows as done after downstream processing.

## Implementation Steps

### Step 1: Add node type to database schema

- [ ] Add "NOTION" to nodeType enum in src/db/schema/workflows.ts

### Step 2: Create Notion executor

- [ ] Create src/features/executors/lib/notion.executor.ts
- [ ] Implement fetch function using Notion API client
- [ ] Support filtering by column/value
- [ ] Support marking rows as done (update property)
- [ ] Register in node_executor_registery.ts

### Step 3: Create Notion node component

- [ ] Create src/features/executors/nodes/notion_node/components/notion-node.tsx
- [ ] Create src/features/executors/nodes/notion_node/components/notion-node-dialog.tsx

### Step 4: Create Inngest channel

- [ ] Create src/inngest/channels/notion-request.ts

### Step 5: Register node component

- [ ] Add to src/lib/node-components.tsx

### Step 6: Register in sidebar/node selector

- [ ] Add to executionNodes array in src/components/react-flow/node-selecter.tsx

---

## Notion Node Configuration Options

- **Database ID**: Notion database to query
- **Filter Column**: Column name to filter by
- **Filter Value**: Value to match
- **Output Variable Name**: Where to store fetched results
- **Mark as Done**: Whether to update status after processing
- **Done Column**: Column to update (e.g., "Status")
- **Done Value**: Value to set (e.g., "done")

## Discussion Points

1. How to handle authentication? Global credentials vs per-node?
2. Should "mark done" happen automatically or configurable?
3. How to handle rate limiting from Notion API?
4. Support for partial updates (only unprocessed rows)?
5. Output format for each row (full page object vs specific columns)?

---

## Modified Files

### New Files Created

- `src/features/executors/lib/notion.executor.ts`
- `src/features/executors/nodes/notion_node/components/notion-node.tsx`
- `src/features/executors/nodes/notion_node/components/notion-node-dialog.tsx`
- `src/inngest/channels/notion-request.ts`

### Modified Files

- `src/db/schema/workflows.ts`
- `src/lib/node_executor_registery.ts`
- `src/lib/node-components.tsx`

---

## Status: Pending
