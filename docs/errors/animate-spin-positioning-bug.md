# RCA: `animate-spin` Icon Jumping to Top-Left Corner

**Date:** 2026-02-24  
**Component:** `ExecutionWorkflowBtn` (React Flow editor toolbar)  
**Status:** Resolved ✅

## Symptom

The `<Loader2Icon>` with Tailwind's `animate-spin` class rendered at the **top-left corner** of the page instead of staying inline inside the `<Button>`, whenever the spin animation was active.

## Root Cause

**CSS `transform` property is not composable across keyframes.**

React Flow positions canvas nodes using `transform: translate(-50%, -50%)` on ancestor elements. Tailwind's `@keyframes spin` applies:

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

When the `spin` animation runs, the browser **completely replaces** any existing `transform` on the element's computed style — including the `translate(-50%, -50%)` inherited from React Flow's node positioning. This caused the icon (and its containing node) to lose its translate offset and snap to `(0, 0)` — the top-left corner.

### Why `translate: none` didn't fix it

Adding `translate: none` as an inline style didn't help because the `transform` shorthand used in the keyframe overrides the individual transform properties during animation.

## Fix

Created a custom `@keyframes loader-spin` in `globals.css` using the **`rotate` CSS property** instead of `transform: rotate()`:

```css
/* globals.css */
@keyframes loader-spin {
  to {
    rotate: 360deg;
  }
}
```

The `rotate` property is an **independent transform property** (part of CSS Individual Transform Properties spec). It does **not** clobber `translate` or `scale` — they compose independently.

In the component, override the animation name while keeping `animate-spin`'s timing:

```tsx
<Loader2Icon className="animate-spin [animation-name:loader-spin]" />
```

## Key Takeaway

> When using `animate-spin` (or any `transform`-based animation) inside **React Flow nodes** or any context where ancestors use `transform: translate(...)`, the animation will clobber the positioning. Use the independent `rotate` CSS property instead.

## Files Changed

- `src/app/globals.css` — Added `@keyframes loader-spin`
- `src/features/editor/components/execution-workflow-btn.tsx` — Used custom animation name
