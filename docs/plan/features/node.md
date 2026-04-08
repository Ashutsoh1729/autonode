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

### 3. Registry (`src/lib/node_executor_registery.ts`)

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

### 4. Node Component & Dialog

Create React Flow node component and configuration dialog in `src/features/executors/nodes/[node_name]_node/components/`:

```tsx
// src/features/executors/nodes/your_node/components/your-node.tsx
"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../../../components/base-execution-node";
import { YourIcon } from "lucide-react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { YourNodeFormSchemaType, YourExecutionDialog } from "./your-node-dialog";
import { useNodeStatus } from "../../../hooks/use-node-status";
import { yourNodeChannel } from "@/inngest/channels/your-node-request";
import { fetchYourNodeRealTime } from "../../../lib/actions";

export type YourNodeData = {
  variableName: string;
  // other config fields
  [key: string]: unknown;
};

type YourNodeType = Node<YourNodeData>;

export const YourNode = memo((props: NodeProps<YourNodeType>) => {
  const NodeData = props.data;
  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const nodeStatus: NodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: yourNodeChannel().name,
    topic: "status",
    refreshToken: fetchYourNodeRealTime,
    enabled: isExecuting,
  });

  const handleSubmit = (values: YourNodeFormSchemaType) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return { ...node, data: { ...node.data, ...values } };
        }
        return node;
      }),
    );
  };

  return (
    <>
      <YourExecutionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={NodeData}
      />
      <BaseExecutionNode
        icon={YourIcon}
        name={NodeData.variableName || "Your Node"}
        description={NodeData.description || "Not Configured"}
        onSettings={() => setDialogOpen(true)}
        onDoubleClick={() => setDialogOpen(true)}
        status={nodeStatus}
        {...props}
      />
    </>
  );
});
```

```tsx
// src/features/executors/nodes/your_node/components/your-node-dialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { YourDialog } from "@/components/ui/your-dialog";

const yourNodeSchema = z.object({
  variableName: z.string().min(1),
  // other fields
});

export type YourNodeFormSchemaType = z.infer<typeof yourNodeSchema>;

export function YourExecutionDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  defaultValues 
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: YourNodeFormSchemaType) => void;
  defaultValues?: YourNodeData;
}) {
  const form = useForm({
    resolver: zodResolver(yourNodeSchema),
    defaultValues: defaultValues || { variableName: "" },
  });

  return (
    <YourDialog open={open} onOpenChange={onOpenChange}>
      <YourDialog.Content>
        <YourDialog.Header>
          <YourDialog.Title>Configure Your Node</YourDialog.Title>
        </YourDialog.Header>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Form fields */}
        </form>
      </YourDialog.Content>
    </YourDialog>
  );
}
```

### 5. Node Component Registry

Register the node component in `src/lib/node-components.tsx`:

```typescript
import { YourNode } from "./your-node";

const componentMap: Record<NodeTypeValue, React.ComponentType<NodeProps>> = {
  INITIAL: InitialNode,
  MANUAL_TRIGGER: ManualTriggerNode,
  HTTP_REQUEST: HttpRequestNode,
  YOUR_NEW_NODE: YourNode,  // Add here
};

export const nodeComponents = componentMap;
```

### 6. Node Selector (Sidebar)

Add the node to the sidebar in `src/components/react-flow/node-selecter.tsx`:

```typescript
const executionNodes: NodeTypeOptions[] = [
  {
    type: "HTTP_REQUEST",
    label: "HTTP Request",
    description: "Make an http request",
    icon: GlobeIcon,
  },
  {
    type: "YOUR_NEW_NODE",  // Add here
    label: "Your Node Name",
    description: "What it does",
    icon: YourIcon,
  },
];
```

### 7. Real-time Updates (Optional)

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
- [ ] Create executor function in `src/features/executors/lib/`
- [ ] Register executor in `src/lib/node_executor_registery.ts`
- [ ] Create node component and dialog in `src/features/executors/nodes/[node_name]_node/components/`
- [ ] Register node component in `src/lib/node-components.tsx`
- [ ] Add to sidebar in `src/components/react-flow/node-selecter.tsx`
- [ ] (Optional) Create real-time channel if needed
- [ ] Run migration: `pnpm drizzle-kit generate` && `pnpm drizzle-kit push`
- [ ] Add plan entry in `docs/plan/init.md` active plans table