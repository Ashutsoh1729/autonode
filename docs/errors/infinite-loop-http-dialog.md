## Error Type
Runtime Error

## Error Message
Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.


    at div (<anonymous>:null:null)
    at DialogOverlay (src/components/ui/dialog.tsx:39:5)
    at DialogContent (src/components/ui/dialog.tsx:60:7)
    at DialogPortal (src/components/ui/dialog.tsx:25:10)
    at DialogContent (src/components/ui/dialog.tsx:59:5)
    at HttpExecutionDialog (src/features/executions/components/http-node-dialog.tsx:99:7)
    at HttpRequestNode (src/features/executions/components/http-node.tsx:53:7)
    at Editor (src/features/editor/components/editor.tsx:64:7)
    at WorkflowIndivisualPage (src/app/(dashboard)/(editor)/workflows/[workflowId]/page.tsx:30:13)

## Code Frame
  37 | }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  38 |   return (
> 39 |     <DialogPrimitive.Overlay
     |     ^
  40 |       data-slot="dialog-overlay"
  41 |       className={cn(
  42 |         "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",

Next.js version: 16.1.6 (Turbopack)
# RCA: Maximum Update Depth Exceeded — HttpExecutionDialog

**Date:** 2026-02-27  
**Severity:** High (UI crash)  
**Component:** `HttpExecutionDialog`, `HttpRequestNode`

---

## Symptom

Double-clicking an HTTP node to open its settings dialog caused:

```
Maximum update depth exceeded. This can happen when a component
repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
React limits the number of nested updates to prevent infinite loops.
```

---

## Root Cause

**Two compounding issues:**

### 1. Prop name typo in `http-node.tsx`

```tsx
// ❌ Typo — prop never reached the dialog
<HttpExecutionDialog defaultVlaues={NodeData} />
```

The dialog's prop was renamed from `defaultVlaues` to `defaultValues`, but the **call site was not updated**. So `defaultValues` was always `undefined`, falling back to the inline default `{}`.

### 2. Object reference instability in `useEffect` deps (`http-node-dialog.tsx`)

```tsx
// ❌ {} creates a new reference on every render
export const HttpExecutionDialog = ({
  defaultValues = {},  // ← new object each render
}: HttpExecutionDialogProps) => {

  useEffect(() => {
    if (open) form.reset({ ... });
  }, [open, defaultValues, form]);  // ← defaultValues changes every render
```

Because `defaultValues` was always a **new `{}` object** (due to the typo), React detected a dependency change on every render → `form.reset()` → state update → re-render → new `{}` → `useEffect` fires again → **infinite loop**.

---

## Fix

| File | Change |
|------|--------|
| `http-node.tsx:57` | `defaultVlaues` → `defaultValues` (typo fix) |
| `http-node-dialog.tsx:86` | Removed `defaultValues` and `form` from `useEffect` deps; only depend on `open` |

---

## Lesson

- **Object/array literals as default props** (e.g. `prop = {}`) create new references every render — never put them in `useEffect` dependency arrays.
- **Typos in prop names** fail silently in JS/TS when the prop is optional, making them hard to catch. Consider using **required props** or stricter types where possible.
