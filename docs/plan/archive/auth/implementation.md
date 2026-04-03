# Authentication & Application Structure Plan

> **Date:** February 11, 2026
> **Goal:** Implement application structure (Route Groups), Landing Page, and Authentication (Better Auth).

## 1. Application Structure (Route Groups)

We will reorganize `src/app` using Next.js Route Groups to isolate layouts and logic.

```
src/app/
├── (marketing)/           # Public facing pages
│   ├── layout.tsx         # Navbar (Logo, Auth buttons), Footer
│   └── page.tsx           # Landing Page (Hero, Features)
├── (auth)/                # Authentication pages
│   ├── layout.tsx         # Centered layout with simple background
│   ├── sign-in/
│   │   └── page.tsx       # Sign In Form
│   └── sign-up/
│       └── page.tsx       # Sign Up Form
├── (dashboard)/           # Protected Application Area
│   ├── layout.tsx         # Sidebar navigation, User dropdown
│   └── dashboard/
│       └── page.tsx       # Main app view (Workflow list)
├── api/
│   └── auth/
│       └── [...all]/
│           └── route.ts   # Better Auth API Handler
├── globals.css            # Global styles
└── layout.tsx             # Root layout (Providers, Font)
```

## 2. Implementation Steps

### Phase 1: Route Restructuring & Landing Page
1.  **Move existing `page.tsx`** to `(marketing)/page.tsx`.
2.  **Create `(marketing)/layout.tsx`**:
    *   **Navbar Component**: Includes "Sign In" / "Get Started" buttons.
    *   Checks session client-side to toggle "Dashboard" vs "Sign In".
3.  **Design Landing Page**:
    *   **Hero Section**: Title "Automate your workflows with AI", subtitle, CTA.
    *   **Features Section**: 3-column grid highlighting "Visual Builder", "Secure", "Extensible".
    *   Simple, clean UI using **shadcn/ui** and Tailwind.

### Phase 2: Authentication Implementation
1.  **API Route**: Create `src/app/api/auth/[...all]/route.ts` connecting to `src/lib/auth.ts`.
2.  **Auth Pages (`(auth)`)**:
    *   **Sign Up**: Name, Email, Password.
    *   **Sign In**: Email, Password.
    *   Use `auth-client` hooks (`signUp.email`, `signIn.email`).
    *   add `sonner` (toast) for error/success notifications.
3.  **Protected Dashboard (`(dashboard)`)**:
    *   Create a simple dashboard page that displays `User Name` and a "Log Out" button.
4.  **Route Protection**:
    *   Implement **middleware/proxy** (Next.js 16 style) to redirect unauthenticated users from `/dashboard/*` to `/sign-in`.

## 3. Tech Details

- **Auth Client**: `src/lib/auth-client.ts` (already created).
- **UI Components**:
    *   `Button`, `Input`, `Card`, `Label` (shadcn/ui).
    *   `lucide-react` for icons.
- **Middleware**: `src/middleware.ts` (using `better-auth/next-js` middleware helper or manual checking as planned in notes).

## 4. Verification

1.  Visit `/` → See Landing Page.
2.  Click "Sign In" → Go to `/sign-in`.
3.  Sign Up → Redirect to `/dashboard` (or home).
4.  Visit `/dashboard` directly (logged out) → Redirect to `/sign-in`.
5.  Log Out → Redirect to `/`.
