# Theme Setup & Configuration

> **Date:** February 11, 2026
> **Topic:** Understanding the Tailwind CSS v4 Theme System in Next.js.

## 1. How Themes Work

Our project uses **Tailwind CSS v4** with CSS variables for theming. This allows dynamic switching between Light and Dark modes without changing class names.

-   **CSS Variables**: Defined in `src/app/globals.css` inside `:root` (light) and `.dark` blocks.
-   **Theme Mapping**: The `@theme inline` block maps these variables to Tailwind utility classes.
-   **Dark Mode**: Handled by `next-themes` (or manual toggling) which adds the `dark` class to the `<html>` or `<body>` element, activating the `.dark` variables.

## 2. Configuration (`globals.css`)

Open `src/app/globals.css`. You will see:

```css
/* Light Mode Colors */
:root {
  --background: oklch(1 0 0);       /* White */
  --foreground: oklch(0.145 0 0);   /* Dark text */
  --primary: oklch(0.205 0 0);      /* Brand Color */
  /* ... */
}

/* Dark Mode Colors */
.dark {
  --background: oklch(0.145 0 0);   /* Dark bg */
  --foreground: oklch(0.985 0 0);   /* Light text */
  /* ... */
}
```

To change the theme, **you only update these variable values**. We use the **OKLCH** color space for better perceptional uniformity.

## 3. Using Theme Colors

Instead of hardcoding colors (e.g., `bg-white`, `text-black`), use the semantic utility classes mapped in the `@theme` block:

| Utility Class | Purpose |
| :--- | :--- |
| `bg-background` | The main background color of the page. |
| `text-foreground` | The main text color. |
| `bg-primary` | The primary brand color (buttons, active states). |
| `text-primary-foreground` | Text color that sits on top of primary elements. |
| `bg-muted` | Subtle background for secondary items. |
| `text-muted-foreground` | Subtle text (e.g., captions, placeholders). |
| `border-border` | Default border color. |
| `ring-ring` | Focus ring color. |

### Example

```tsx
<div className="bg-card text-card-foreground border border-border p-4 rounded-lg shadow-sm">
  <h2 className="text-lg font-bold">Card Title</h2>
  <p className="text-muted-foreground">This is a description.</p>
  <button className="bg-primary text-primary-foreground px-4 py-2 mt-2 rounded">
    Action
  </button>
</div>
```

This card will automatically look correct in both Light and Dark modes because it uses the semantic classes.

## 4. Matching the Design

To match a specific design or brand:
1.  Go to `src/app/globals.css`.
2.  Find the variable you want to change (e.g., `--primary`).
3.  Update its **OKLCH** value in `:root` (for light mode) and `.dark` (for dark mode).
4.  All components using `bg-primary`, `text-primary`, etc., will instantly update.
