# Node Implementation Guide

This document outlines how to implement a new node type in AutoNode.

---

## Existing Node Types

| Node Type | Enum Value | Executor | Location |
|-----------|------------|----------|----------|
| Initial | `INITIAL` | `manualExecutor` | `src/features/triggers/mannual_trigger/lib/manual-executor.ts` |
| Manual Trigger | `MANUAL_TRIGGER` | `manualExecutor` | `src/features/triggers/mannual_trigger/lib/manual-executor.ts` |
| HTTP Request | `HTTP_REQUEST` | `httpNodeExecutor` | `src/features/executions/lib/http.executor.ts` |
| AI | `AI` | (not registered) | - |

---

## What is Needed to Implement a New Node

To implement a new node type, you need to create/modify the following layers:

### 1. Database Schema (`src/db/schema/workflows.ts`)

Add the new node type to the `nodeType` enum:

```typescript
export const nodeType = pgEnum("node_types", [
  "INITIAL",
  "MANUAL_TRIGGER",
  "HTTP_REQUEST",
  "AI",
  "YOUR_NEW_NODE",  // Add here
]);
```

### 2. Executor Function

Create an executor in `src/features/executions/lib/` or appropriate location:

```typescript
// src/features/executions/lib/your-executor.ts
import { NodeExecutor } from "@/features/executions/lib/types";

export const yourNodeExecutor: NodeExecutor<YourNodeData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  // Your execution logic
  // Use step.run() for any async operations
  // Use publish() for real-time updates
  
  return {
    ...context,
    yourOutput: "value",
  };
};
```

**Executor Interface** (`src/features/executions/lib/types.ts`):
```typescript
export type NodeExecutorParams<TData = Record<string, unknown>> = {
  data: TData;           // Node configuration data
  nodeId: string;        // Current node ID
  context: WorkflowContext;  // Previous node outputs
  step: StepTools;       // Inngest step tools for async operations
  publish: Realtime.PublishFn;  // For real-time updates
};

export type NodeExecutor<TData = Record<string, unknown>> = (
  params: NodeExecutorParams<TData>,
) => Promise<WorkflowContext>;
```

### 3. Registry (`src/lib/node-registery.ts`)

Register the executor in the registry:

```typescript
import { yourNodeExecutor } from "@/features/executions/lib/your-executor";

export const executorRegistry: Partial<
  Record<NodeType["type"], NodeExecutor<any>>
> = {
  INITIAL: manualExecutor,
  MANUAL_TRIGGER: manualExecutor,
  HTTP_REQUEST: httpNodeExecutor,
  YOUR_NEW_NODE: yourNodeExecutor,  // Add here
};

export const getExecutor = (nodeType: NodeType["type"]) => {
  const executor = executorRegistry[nodeType];
  if (!executor) {
    throw new Error(`Executor not found for node type: ${nodeType}`);
  }
  return executor;
};
```

### 4. React Flow Node Component (Optional - if UI needed)

Create a React Flow node component in `src/components/react-flow/`:

```tsx
// src/components/react-flow/your-node.tsx
"use client";

import { Handle, Position } from "@xyflow/react";
import { WorkflowNode } from "./workflow-node";

interface YourNodeProps {
  data: {
    label?: string;
    // other config fields
  };
  selected?: boolean;
}

export function YourNode({ data, selected }: YourNodeProps) {
  return (
    <WorkflowNode
      name={data.label}
      showToolbar={selected}
      onDelete={() => {/* handle delete */}}
      onSettings={() => {/* open settings dialog */}}
    >
      <Handle type="target" position={Position.Top} />
      <div className="p-4">
        {/* Node UI */}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </WorkflowNode>
  );
}
```

### 5. Node Dialog/Form (Optional - for configuration)

Create a dialog for configuring the node in `src/features/[your-feature]/components/`:

```tsx
// src/features/your-feature/components/your-node-dialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const yourNodeSchema = z.object({
  field1: z.string().min(1),
  field2: z.number(),
});

export function YourNodeDialog({ node, onSave, onClose }) {
  const form = useForm({
    resolver: zodResolver(yourNodeSchema),
    defaultValues: node?.data || {},
  });

  // Render form fields and save button
}
```

### 6. Real-time Updates (Optional)

If your node needs real-time status updates, create a channel in `src/inngest/channels/`:

```typescript
// src/inngest/channels/your-channel.ts
import { channel } from "@inngest/realtime";

export const yourNodeChannel = channel({
  name: "your-node",
  schema: z.object({
    nodeId: z.string(),
    status: z.enum(["loading", "success", "error"]),
    data: z.any().optional(),
  }),
});

// Usage in executor:
await publish(yourNodeChannel.status({ 
  nodeId, 
  status: "loading" 
}));
```

---

## Checklist for New Node Implementation

- [ ] Add node type to `nodeType` enum in `src/db/schema/workflows.ts`
- [ ] Create executor function in `src/features/executions/lib/`
- [ ] Register executor in `src/lib/node-registery.ts`
- [ ] (Optional) Create React Flow node component in `src/components/react-flow/`
- [ ] (Optional) Create node dialog for configuration
- [ ] (Optional) Create real-time channel if needed
- [ ] Run migration: `pnpm drizzle-kit generate` && `pnpm drizzle-kit push`
- [ ] Add plan entry in `docs/plan/init.md` active plans table