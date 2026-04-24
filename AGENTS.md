<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-agent-rules -->
# Agent Instructions — Link Shortener Project

> **This project uses Next.js 16.2.4 with React 19.** APIs, conventions, and file structure
> may differ significantly from your training data. Always read
> `node_modules/next/dist/docs/` before writing any code. Heed all deprecation notices.

---

> # 🚨 MANDATORY — READ BEFORE WRITING A SINGLE LINE OF CODE 🚨
>
> **You MUST read ALL relevant instruction files in the `/docs` folder BEFORE generating any code, making any edit, or suggesting any implementation.**
>
> Failure to do so will result in incorrect, inconsistent, or non-compliant code that violates the architecture and standards of this project.
>
> | Topic | File | When to read |
> |---|---|---|
> | Authentication (Clerk) | [`docs/authentication.md`](docs/authentication.md) | Before ANY auth-related code |
> | UI Components (shadcn/ui) | [`docs/ui-components.md`](docs/ui-components.md) | Before ANY UI-related code |
>
> ⛔ **Do NOT skip this step. Do NOT assume you already know the conventions. Always read the relevant `/docs` file first — every time, without exception.**

---

## Table of Contents

1. [Golden Rules](#golden-rules)
2. [Project Overview](#project-overview)
3. [Technology Stack](#technology-stack)
4. [Architecture](#architecture)
5. [Coding Standards](#coding-standards)
6. [UI Standards](#ui-standards)
7. [Build and Run](#build-and-run)

---
Fai SEMPRE riferimento al rilevante file .md PRIMA di generare qualsiasi codice:

| Argomento | File |
|---|---|
| Autenticazione (Clerk) | [`docs/authentication.md`](docs/authentication.md) |
| Componenti UI (shadcn/ui) | [`docs/ui-components.md`](docs/ui-components.md) |


## Golden Rules

1. **App Router only** — never use `pages/` directory. All routes live under `app/`.
2. **Server Components by default** — only add `"use client"` when strictly necessary (interactivity, hooks, browser APIs).
3. **Database access via Drizzle ORM only** — never write raw SQL strings outside of Drizzle query builders.
4. **Authentication via Clerk** — never roll custom auth. Use `@clerk/nextjs` helpers.
5. **UI components via shadcn/ui** — generate with `npx shadcn add <component>`, never write from scratch.
6. **Path alias `@/`** maps to the project root — always use it for internal imports.
7. **TypeScript strict mode is on** — no `any`, no type suppression without explicit justification.
8. **Environment variables** must never be hard-coded; always read from `.env.local` via `process.env`.

---

## Project Overview

### What is this project?

A **URL shortener** web application built with Next.js 16 (App Router). Users can:

- Create short aliases for long URLs.
- Authenticate with Clerk (sign-in / sign-up).
- View and manage their own shortened links.
- Be redirected from a short slug to the original URL.

### Repository Layout

```
linkshortenerproject/
├── app/                        # Next.js App Router root
│   ├── layout.tsx              # Root layout — ClerkProvider, fonts, header
│   ├── page.tsx                # Home page
│   ├── globals.css             # Tailwind CSS base + CSS variables (shadcn tokens)
│   └── favicon.ico
├── components/
│   └── ui/                     # shadcn/ui generated components (do NOT hand-edit)
│       └── button.tsx
├── db/
│   ├── index.ts                # Drizzle client (Neon serverless, reads DATABASE_URL)
│   └── schema.ts               # Drizzle table definitions (source of truth for DB shape)
├── lib/
│   └── utils.ts                # `cn()` helper (clsx + tailwind-merge)
├── public/                     # Static assets
├── proxy.ts                    # Clerk middleware (route protection)
├── drizzle.config.ts           # Drizzle Kit config (PostgreSQL / Neon)
├── components.json             # shadcn/ui config (style: radix-nova, baseColor: neutral)
├── next.config.ts              # Next.js config
├── tsconfig.json               # TypeScript config (strict, bundler resolution, @/* alias)
├── eslint.config.mjs           # ESLint flat config
├── postcss.config.mjs          # PostCSS (Tailwind v4 plugin)
└── package.json
```

### Environment Variables

All secrets are stored in `.env.local` (never committed). Required variables:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `CLERK_SECRET_KEY` | Clerk server-side secret |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Clerk sign-in redirect path (e.g. `/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Clerk sign-up redirect path (e.g. `/sign-up`) |

Never hard-code these values anywhere in source code.

### Current State

The project is in early development. `db/schema.ts` is currently empty and must be populated with the link shortener domain model (links table, etc.) before any database features can be implemented.

---

## Technology Stack

| Concern | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | **16.2.4** |
| Language | TypeScript | ^5 |
| UI | React | **19.2.4** |
| Styling | Tailwind CSS | ^4 |
| Component library | shadcn/ui (style: `radix-nova`) | ^4.4.0 |
| Primitive components | Radix UI (`radix-ui` package) | ^1.4.3 |
| Icons | Lucide React | ^1.9.0 |
| ORM | Drizzle ORM | ^0.45.2 |
| Database | Neon (serverless PostgreSQL) | `@neondatabase/serverless ^1.1.0` |
| DB migrations | Drizzle Kit | ^0.31.10 |
| Authentication | Clerk | `@clerk/nextjs ^7.2.5` |
| Class utilities | clsx + tailwind-merge | ^2.1.1 / ^3.5.0 |
| CVA (variants) | class-variance-authority | ^0.7.1 |
| Animations | tw-animate-css | ^1.4.0 |
| Env loading (scripts) | dotenv | ^17.4.2 |
| Linting | ESLint | ^9 + eslint-config-next 16.2.4 |
| PostCSS | @tailwindcss/postcss | ^4 |

### Key Version Notes

- **Next.js 16** introduces breaking changes versus Next.js 13/14/15. Always consult `node_modules/next/dist/docs/` before using any Next.js API.
- **React 19** includes new hooks and changed behaviour for `use()`, `useActionState`, Server Actions, etc. Do not assume React 18 patterns are unchanged.
- **Tailwind CSS v4** uses a CSS-first configuration (no `tailwind.config.js`). Theme tokens are defined in `app/globals.css` via `@theme`. Do not create a `tailwind.config.js`.
- **Drizzle ORM 0.45+** — use `drizzle-orm/neon-http` adapter for Neon serverless.

### Dependency Rules

- **Never** install a second UI component library (MUI, Chakra, Ant Design, etc.).
- **Never** add a CSS-in-JS library (styled-components, Emotion, etc.).
- **Never** install a separate auth library (NextAuth, Auth.js, etc.) — Clerk is the auth layer.
- **Never** use `pg` or `postgres` directly — all DB access goes through Drizzle.
- **Never** use `fetch` to call your own API routes when a Server Action or direct DB call is sufficient.
- When adding a new shadcn component, use: `npx shadcn add <component>` — do not copy-paste component code manually.
- When adding new icons, use `lucide-react` only.

---

## Architecture

### App Router — Directory Structure under `app/`

```
app/
├── layout.tsx                  # Root layout (ClerkProvider, fonts, global header)
├── page.tsx                    # Home page → "/"
├── globals.css                 # Tailwind v4 theme + shadcn CSS variables
│
├── (auth)/                     # Route group — Clerk sign-in/up pages (to be created)
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx
│   └── sign-up/[[...sign-up]]/
│       └── page.tsx
│
├── [slug]/                     # Dynamic redirect route (to be created)
│   └── page.tsx                # Looks up slug in DB, calls redirect()
│
└── dashboard/                  # Authenticated user area (to be created)
    ├── layout.tsx              # Protects route, fetches user links
    └── page.tsx                # List / manage links
```

> Directories marked "to be created" represent the intended structure. Do not deviate from this layout without good reason.

### Server vs Client Components

| Rule | Details |
|---|---|
| Default to **Server Component** | Omit `"use client"` unless the component needs state, effects, or browser APIs |
| `"use client"` boundary | Place it as **deep** in the tree as possible to minimise client bundle size |
| Data fetching | Fetch in Server Components via Drizzle directly — no `useEffect` + `fetch` pattern |
| Server Actions | Use `"use server"` functions for mutations (create link, delete link, etc.) |

### Database Layer

**Client (`db/index.ts`)**
```ts
import { drizzle } from 'drizzle-orm/neon-http';
const db = drizzle(process.env.DATABASE_URL!);
export default db;
```
- Import `db` from `@/db` in Server Components and Server Actions only.
- Never import `db` inside a Client Component.

**Schema (`db/schema.ts`)** — single source of truth for the DB shape. Suggested minimal links table:
```ts
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id:        text('id').primaryKey(),           // nanoid / cuid
  slug:      text('slug').notNull().unique(),
  url:       text('url').notNull(),
  userId:    text('user_id').notNull(),          // Clerk user ID
  clicks:    integer('clicks').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Authentication (Clerk)

- `ClerkProvider` wraps the entire app in `app/layout.tsx`.
- Route protection is enforced in `proxy.ts` via `clerkMiddleware()`.
- Use `Show when="signed-in"` / `Show when="signed-out"` from `@clerk/nextjs` for conditional UI.
- In Server Components / Actions, use `auth()` from `@clerk/nextjs/server` to get the current user.
- Public routes (e.g., `[slug]` redirect) must be explicitly marked as public in the middleware matcher.

### Routing Conventions

| Pattern | Use case |
|---|---|
| `app/page.tsx` | Marketing / home page |
| `app/dashboard/page.tsx` | Authenticated user dashboard |
| `app/[slug]/page.tsx` | Short URL redirect handler |
| `app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Clerk hosted sign-in |
| `app/api/...` | API routes only when a Server Action is not sufficient |

- Prefer **Server Actions** over API routes for mutations.
- Use `redirect()` from `next/navigation` (server-side) for slug redirects.
- Use `notFound()` from `next/navigation` when a slug does not exist.

---

## Coding Standards

### TypeScript

- **Strict mode is enabled** (`"strict": true`). All code must pass without errors.
- No `any` types. Use `unknown` with type guards if the shape is truly unknown.
- No `// @ts-ignore` or `// @ts-expect-error` without an explicit comment explaining why.
- Prefer `type` over `interface` for object shapes unless declaration merging is needed.
- Export types explicitly: `export type { MyType }`.

### File & Folder Naming

| Kind | Convention | Example |
|---|---|---|
| React component files | `kebab-case.tsx` | `link-card.tsx` |
| Non-component TS files | `kebab-case.ts` | `generate-slug.ts` |
| Directories | `kebab-case` | `components/ui/` |
| Route segments | `kebab-case` | `app/dashboard/` |
| Dynamic route segments | `[param]` | `app/[slug]/` |

### Component Conventions

- One component per file (except small co-located sub-components).
- Use **named exports** for all components — never default export from `components/`.
- Root-level page/layout files (`app/**/page.tsx`, `app/**/layout.tsx`) use **default exports** (Next.js requirement).
- Define component props as a `type Props` directly above the component:

```tsx
type Props = {
  slug: string;
  url: string;
};

export function LinkCard({ slug, url }: Props) { ... }
```

### Imports

- Always use the `@/` path alias for internal imports:
  ```ts
  import { cn } from "@/lib/utils";
  import db from "@/db";
  import { links } from "@/db/schema";
  ```
- Never use relative paths that traverse up more than one level (`../../`).
- Import order: 1) React/Next.js, 2) third-party, 3) internal (`@/`), 4) types.

### Server Actions

- Place Server Actions in `app/actions/` or co-located in the route folder.
- Always mark Server Action files with `"use server"` at the top.
- Validate all inputs before touching the database.
- Return a typed result object, not `void`:
  ```ts
  type ActionResult = { success: true; slug: string } | { success: false; error: string };
  ```

### Error Handling

- Use `notFound()` for missing resources.
- Use `redirect()` for navigation side effects.
- Never `throw` plain strings — throw `Error` instances or use typed result objects.
- Wrap DB calls in `try/catch` in Server Actions and return a typed error result.

### Utility: `cn()`

Always use `cn()` from `@/lib/utils` to merge Tailwind classes. Never concatenate class strings with template literals or `+`:
```ts
className={cn("base-class", condition && "conditional-class", className)}
```

---

## UI Standards

### Tailwind CSS v4

- **No `tailwind.config.js`** — theme customisation is done in `app/globals.css` via `@theme { ... }`.
- Do **not** create a `tailwind.config.js` or `tailwind.config.ts` file.
- Use `@tailwindcss/postcss` plugin only.

### shadcn/ui

- Style: `radix-nova`, base colour: `neutral`.
- Files in `components/ui/` are **auto-generated — never hand-edit them**.
- To customise a component, wrap it in a new file under `components/`.
- Add new components with: `npx shadcn add <component-name>`
- All shadcn components consume CSS variables from `app/globals.css`.
- **ALL UI elements MUST use shadcn/ui components — never create custom UI components from scratch.**
- If a shadcn/ui component exists for a UI element, it MUST be used. Do NOT build equivalent components manually with raw HTML + Tailwind classes.
- If a required component is not yet installed, install it with `npx shadcn add <component-name>` before using it.

### Radix UI

- Import from the umbrella `radix-ui` package: `import { Slot } from "radix-ui"`.
- Prefer shadcn wrappers over using Radix primitives directly.

### Icons

- Use **Lucide React** exclusively: `import { LinkIcon } from "lucide-react"`.
- Control size via the `size` prop or Tailwind `size-*` classes.

### Class Variance Authority (CVA)

- Use `cva()` when a component needs multiple visual variants.
- Follow `components/ui/button.tsx` as the reference pattern.

### Layout

- Use Tailwind flex/grid utilities — never `style` attributes for layout.
- Root `<body>` is `min-h-full flex flex-col` — pages should use `flex-1`.
- Global header is in `app/layout.tsx` — do not duplicate it in page components.
- Mobile-first responsive design: use `sm:`, `md:`, `lg:` prefixes.

### Dark Mode

- Use Tailwind `dark:` variants alongside light-mode classes.
- Never toggle themes manually via JavaScript — CSS variable tokens handle it automatically.

### Accessibility

- All interactive elements must be keyboard-accessible.
- Use semantic HTML (`<button>`, `<a>`, `<nav>`, `<main>`, etc.).
- Provide `aria-label` on icon-only buttons.
- Do not override ARIA roles set by Radix UI / shadcn.

---

## Build and Run

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Clerk](https://clerk.com) application

### Environment Setup

Create `.env.local` at the project root:

```env
DATABASE_URL=postgresql://...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Install Dependencies

```bash
npm install
```

### Database Migrations

```bash
# Generate migration files from schema changes
npx drizzle-kit generate

# Apply migrations to the database
npx drizzle-kit migrate

# Open Drizzle Studio (visual DB browser)
npx drizzle-kit studio
```

> Always run `generate` after editing `db/schema.ts`, then `migrate` to apply changes.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Hot-reload is active.

### Lint

```bash
npm run lint
```

ESLint 9 flat config (`eslint.config.mjs`). All lint errors must be resolved before committing.

### Build for Production

```bash
npm run build
npm run start
```

### Deploy

Recommended target: **Vercel**.

1. Push to GitHub.
2. Import the repository in the Vercel dashboard.
3. Set environment variables in the Vercel project settings.
4. Deploy — Vercel auto-detects Next.js and configures the build.

`@neondatabase/serverless` works natively on Vercel Edge and Node.js runtimes without extra configuration.

<!-- END:project-agent-rules -->