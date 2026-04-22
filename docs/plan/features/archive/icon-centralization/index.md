# Icon Centralization

## Overview

Centralize all node icons in a single config file to make adding new nodes easier.

## Implementation Steps

### Step 1: Create icon config file

- [x] Create `src/lib/node-icons.ts`
- [x] Export nodeIcons object with all existing icons

### Step 2: Update node-selecter.tsx

- [x] Import nodeIcons from `@/lib/node-icons`
- [x] Replace manual icon imports with nodeIcons
- [x] Update sidebar arrays to use nodeIcons

---

## Modified Files

### New Files Created

- `src/lib/node-icons.ts`

### Modified Files

- `src/components/react-flow/node-selecter.tsx`

---

## Status: Completed
