# Pagination — A Complete Guide

---

## 1. What is Pagination?

Pagination is the technique of **splitting a large dataset into smaller, discrete chunks (pages)** that are loaded and displayed one at a time. Instead of fetching and rendering thousands of records at once, you serve them in manageable portions — typically 10, 20, or 50 items per page.

**Real-world analogy:** A book has hundreds of pages; you read one page at a time rather than the entire book on a single scroll.

**Why it matters:**

| Problem without pagination | How pagination solves it |
|---|---|
| Massive API responses slow down the network | Only the current page of data is fetched |
| Browser freezes rendering 10k DOM nodes | A small, fixed number of items are rendered |
| Database scans entire table every request | Query uses `LIMIT` / `OFFSET` to read a slice |
| Poor UX — user is overwhelmed with data | Content is digestible and navigable |

---

## 2. How Does Pagination Work?

### Core Mechanism

At its simplest, pagination relies on two values:

- **`page`** (or `skip` / `offset`) — which slice the client wants.
- **`limit`** (or `pageSize`) — how many items per slice.

The server translates these into a database query:

```sql
-- Page 1 (items 1–20)
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 0;

-- Page 2 (items 21–40)
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 20;

-- Page N
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET (N-1) * 20;
```

### Common Pagination Strategies

#### a) Offset-Based (Traditional)

```
GET /api/products?page=3&limit=20
```

- Server calculates `offset = (page - 1) * limit`.
- Simple to implement, easy to jump to any page.
- **Downside:** Performance degrades on large offsets because the DB still scans skipped rows.

#### b) Cursor-Based (Keyset)

```
GET /api/products?cursor=eyJpZCI6MTAwfQ&limit=20
```

- Uses the last item's unique identifier (cursor) to fetch the next set.
- The cursor is typically a Base64-encoded value of the sort key.
- **Upside:** Consistent performance regardless of how deep you paginate.
- **Downside:** Cannot jump to an arbitrary page number.

#### c) Infinite Scroll / Load More

- A UX pattern on top of either offset or cursor pagination.
- New items are appended as the user scrolls or clicks "Load More".
- Common in social feeds (Twitter, Instagram).

### Typical API Response Shape

```json
{
  "data": [ /* array of items */ ],
  "meta": {
    "currentPage": 3,
    "pageSize": 20,
    "totalItems": 487,
    "totalPages": 25,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

---

## 3. Step-by-Step Process to Add Pagination

### Step 1 — Define Requirements

- Decide on the pagination strategy (offset vs cursor).
- Choose default page size and maximum allowed page size.
- Determine  
### Step 2 — Backend: Update the Database Query

```ts
// Example using Drizzle ORM (offset-based)
const page = input.page ?? 1;
const limit = Math.min(input.limit ?? 20, 100); // cap at 100
const offset = (page - 1) * limit;

const items = await db
  .select()
  .from(products)
  .orderBy(products.createdAt)
  .limit(limit)
  .offset(offset);
```

### Step 3 — Backend: Return Pagination Metadata

```ts
const totalItems = await db
  .select({ count: sql`count(*)` })
  .from(products);

return {
  data: items,
  meta: {
    currentPage: page,
    pageSize: limit,
    totalItems: totalItems[0].count,
    totalPages: Math.ceil(totalItems[0].count / limit),
    hasNextPage: page * limit < totalItems[0].count,
    hasPreviousPage: page > 1,
  },
};
```

### Step 4 — Backend: Validate Input

- `page` must be ≥ 1.
- `limit` must be between 1 and your max (e.g., 100).
- Return a `400 Bad Request` for invalid values.

```ts
// Example with Zod
const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});
```

### Step 5 — Frontend: Add Page Controls UI

- Display page numbers, "Previous" / "Next" buttons, or a "Load More" button.
- Disable "Previous" on page 1; disable "Next" on the last page.
- Show current page indicator and optionally total pages.

### Step 6 — Frontend: Fetch Data with Page Parameters

```ts
// React Query + tRPC example
const [page, setPage] = useState(1);

const { data, isLoading } = api.products.list.useQuery({
  page,
  limit: 20,
});
```

### Step 7 — Sync Page State with the URL

```ts
// Next.js example using searchParams
// URL: /products?page=3
const searchParams = useSearchParams();
const page = Number(searchParams.get("page")) || 1;
```

This enables shareable links, browser back/forward navigation, and bookmarking.

### Step 8 — Test & Polish

- Verify first page, last page, and edge cases (empty results, single page).
- Add loading states and error handling.
- Test with large datasets for performance.

---

## 4. Common Errors & Pitfalls

### ❌ Off-by-One Errors

**Problem:** Using `page * limit` as offset instead of `(page - 1) * limit`, causing the first page to skip items.

```diff
- const offset = page * limit;       // WRONG — skips first page of items
+ const offset = (page - 1) * limit; // CORRECT
```

### ❌ Not Capping `limit`

**Problem:** A malicious or careless client sends `limit=999999`, defeating the purpose of pagination.

**Fix:** Always enforce a maximum:
```ts
const limit = Math.min(input.limit, 100);
```

### ❌ Missing `ORDER BY`

**Problem:** Without a stable sort order, the same item can appear on multiple pages or be skipped entirely because the database returns rows in an unpredictable order.

**Fix:** Always include an `ORDER BY` clause, ideally on a unique column like `id` or `createdAt`.

### ❌ Expensive `COUNT(*)` on Large Tables

**Problem:** Running `SELECT COUNT(*) FROM table` on millions of rows is slow and blocks the response.

**Fixes:**
- Cache the count and refresh periodically.
- Use an approximate count (`pg_class.reltuples` in PostgreSQL).
- Skip total count entirely and only expose `hasNextPage`.

### ❌ Data Shifting (Offset-Based)

**Problem:** If a new row is inserted (or deleted) while the user is paginating, items shift — causing duplicates or missing entries across pages.

**Fix:** Use cursor-based pagination for real-time or frequently updated data.

### ❌ Not Handling Edge Cases

| Edge case | Expected behavior |
|---|---|
| `page` exceeds total pages | Return empty `data` array, not a 500 error |
| `page=0` or negative | Return `400 Bad Request` |
| No results at all | Return empty array with `totalItems: 0` |

### ❌ Forgetting to Disable Navigation Buttons

**Problem:** "Previous" button is clickable on page 1, or "Next" is clickable on the last page, leading to empty or broken pages.

**Fix:** Use `hasPreviousPage` and `hasNextPage` from the API response to conditionally disable buttons.

### ❌ Not Syncing with URL

**Problem:** Page state lives only in component state. Refreshing the browser resets to page 1, and the user can't share a link to page 5.

**Fix:** Store the current page in the URL query string and read from it on mount.

### ❌ Loading State Jank

**Problem:** The entire list disappears while fetching the next page, causing a jarring flash.

**Fix:** Use `keepPreviousData: true` (React Query) to show stale data while the next page loads.

```ts
const { data } = useQuery({
  queryKey: ["products", page],
  queryFn: () => fetchProducts(page),
  placeholderData: keepPreviousData, // keeps old data visible during fetch
});
```

---

## Quick Reference Cheat Sheet

```
Offset-Based                          Cursor-Based
─────────────                         ────────────
✅ Jump to any page                    ❌ Sequential only
❌ Slow on deep pages                  ✅ Constant performance
✅ Simple to implement                 ⚠️  Slightly more complex
❌ Data shifting on live data          ✅ Stable across inserts/deletes
Best for: Admin panels, dashboards    Best for: Feeds, infinite scroll
```

---

*Created: 2026-02-17*
