# React Flow Node Selector Implementation Plan

## Overview
We will implement a `NodeSelector` component for the React Flow editor using the Shadcn UI `Sheet` component. This selector will act as a side panel (drawer) displaying all available node types that users can drag and drop onto the canvas.

## User Review Required
Please review the proposed approach below. We will build the `NodeSelector` by generating draggable items from the exported `nodeComponents`.

## Proposed Changes

### `src/components/react-flow`
#### [MODIFY] [node-selecter.tsx](file:///Users/ashutoshhota/Coding/play_ground/ai_apps/autonode/src/components/react-flow/node-selecter.tsx)
- **Import Shadcn Sheet**: Utilize `Sheet`, `SheetContent`, `SheetDescription`, `SheetHeader`, `SheetTitle`, and `SheetTrigger` from `@/components/ui/sheet`.
- **List Available Nodes**: Import `nodeComponents` and `RegisteredNodeType` from `@/lib/node-components.tsx` and iterate through its keys to display available node types (currently just `INITIAL`).
- **Implement Drag and Drop**: 
  - Render a visual box/card for each node type with the `draggable` attribute set to `true`.
  - Add an `onDragStart` HTML5 event handler that sets the drag data: `event.dataTransfer.setData('application/reactflow', type)` and configures `effectAllowed = 'move'`.
  - The Sheet itself can be placed absolutely over the canvas or outside of it if it's integrated into the layout.

## Verification Plan

### Manual Verification
1. Run the application (`npm run dev`).
2. Open the React Flow editor page.
3. Verify that the Node Selector Sheet component renders.
4. Open the Node Selector side panel.
5. Verify that the available node types (e.g., "INITIAL") are displayed in the panel as draggable items.
6. Verify that dragging an item sets the expected drag cursor. (Wiring up the drop region will be required on the workspace side to fully instantiate the node, which may be a follow up ticket or part of the `workspace` updating stage).
