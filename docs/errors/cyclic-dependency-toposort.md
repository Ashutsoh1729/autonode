# RCA: False Cyclic Dependency in Topological Sort

**Date:** 2026-02-23  
**File:** `src/inngest/utils.ts`  
**Severity:** High (blocks workflow execution)

## Error

```
Error: Cyclic dependency, node was: "mocb6f668wftx1b499przijy"
```

Thrown by the `toposort` library during `executeWorkflow` in Inngest, even though the workflow graph had **no actual cycles** — just a linear chain of 3 nodes and 1 disconnected node.

## Root Cause

In `topologicalSort()`, disconnected nodes (nodes with no connections) were added to the graph as **self-edges**:

```ts
// ❌ Bug: self-edge = cycle
nodesWithNoConnections.map((node) => [node.id, node.id])
```

A self-edge `[A, A]` tells `toposort` that node A depends on itself, which is by definition a **cycle**. The disconnected node `mocb6f668...` triggered this.

## Fix

Represent disconnected nodes using `[node.id, undefined]`, which tells `toposort` the node exists but has no dependencies:

```ts
// ✅ Fix: undefined = standalone node, no dependency
nodesWithNoConnections.map((node) => [node.id, undefined])
```

## Lesson

When using the `toposort` library, standalone/disconnected nodes should be represented as `[nodeId, undefined]`, **not** as self-edges. The library's API uses `undefined` as the second element to denote a node with no outgoing edges.
