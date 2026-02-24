# `.filter(Boolean)` — Remove Falsy Values from an Array

## What it does

`.filter(Boolean)` passes each element through the `Boolean` constructor. Any **falsy** value is removed.

## Falsy values in JavaScript

`false`, `0`, `""`, `null`, `undefined`, `NaN`

## Example

```ts
["abc", undefined, "def", null, 0, "", "ghi"].filter(Boolean);
// → ["abc", "def", "ghi"]
```

## It's shorthand for

```ts
.filter((value) => !!value)
// or
.filter((value) => value !== undefined && value !== null && value !== "" && ...)
```

## When to use

- Cleaning up arrays that may contain `null`/`undefined` gaps
- After operations like `toposort` that inject `undefined` as placeholder nodes
- Stripping empty strings from split results, e.g. `"a,,b".split(",").filter(Boolean)` → `["a", "b"]`

## ⚠️ Gotcha

`filter(Boolean)` also removes `0` and `""`. If those are valid values in your array, use a more specific filter:

```ts
.filter((value) => value !== undefined && value !== null)
```
