# AGENTS.md

Guide for AI coding agents (Codex etc.) and people working in this repo.
Read this before making changes.

## Project

Public website for Epikaizo Guesthouse. Guests can browse rooms, request a
room booking, view the restaurant menu, order food (room service or
collection, open to anyone) and reserve a table with optional pre-ordered food.

- Bookings, orders and reservations are **requests**. No payments. Staff confirm them.
- The backend API is a **separate repo** built by another developer. This repo
  only calls it, through `src/lib/api.ts`.
- The owner/staff dashboard is **not** in this repo. Pen-Sar builds it in a
  separate app against the same backend. Keep field names and statuses in
  `src/lib/types.ts` matching the Docking Spec and the dashboard
  compatibility guide, so both sides stay compatible.
- Owner and staff are not tech-savvy, and many guests won't be either. Keep
  every screen simple, uncluttered and familiar, with plain wording.
- The visual style is set (see "Design" below). Reuse it; don't add new
  colours, fonts or UI libraries.

## Stack

Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS 4,
ESLint 9 (flat config), Prettier. Cache Components is on
(`cacheComponents: true` in `next.config.ts`).

## Commands

```bash
npm install          # once
npm run dev          # local site at http://localhost:3000
npm run check        # lint + typecheck + format check: must pass before you finish
npm run build        # full production build: run it if you changed routes or data loading
npm run format       # auto-format
```

There are no automated tests yet.

## Structure

```
src/
  app/                  Routes (one folder per URL, page.tsx inside)
    layout.tsx          Shared header, footer and <main> wrapper
    not-found.tsx       404 page
    rooms/[slug]/       One room page (static params from getRooms())
    book/room/          Room booking request
    book/table/         Table reservation (+ optional pre-order)
    events/             Meetings & Events + enquiry form
    order/              Food order (room service or collection)
    restaurant/         Menu
    about/ contact/ privacy/ terms/
  components/           Shared UI components (PascalCase.tsx, named exports)
  content/site.ts       Site name, contact details, nav links (placeholder text)
  lib/
    config.ts           The ONLY place that reads process.env
    types.ts            Shared data types (Room, MenuItem, booking requests…)
    api.ts              The ONLY place that talks to the backend
  lib/actions.ts        Server Actions the forms call (they call api.ts)
  lib/format.ts         N$ money, dates (end dates exclusive) and Outapi time
  components/forms/     The four request forms and their shared pieces
  mocks/data.ts         ALL mock data, used while NEXT_PUBLIC_USE_MOCKS=true
```

## Conventions

- **Data:** pages and components get data only from functions in
  `src/lib/api.ts`. Never `fetch` the backend elsewhere, and never import
  `src/mocks` from a page. New endpoint = new function in `api.ts` with a mock
  branch + mock data in `src/mocks/data.ts` + types in `src/lib/types.ts`.
- **Env vars:** add new ones to `src/lib/config.ts` and `.env.example`, and
  the README table. Values the browser needs must start with `NEXT_PUBLIC_`.
- **Caching:** read functions in `api.ts` are NOT cached (`cache: "no-store"`), so
  edits saved in the admin dashboard show on the next refresh. The root layout
  wraps the page in `<Suspense>` so this works with Cache Components. Don't add
  `"use cache"` to request functions (bookings, orders).
- **Server first:** pages are Server Components. Add `"use client"` only to the
  small component that needs state or event handlers (e.g. a form), not the page.
- **Dynamic params:** `params` is a Promise. Use `PageProps<"/route">` and
  `await props.params`.
- **Routes:** each page exports `metadata` (or `generateMetadata`) with a title.
- **Styling:** Tailwind utility classes only. No new CSS files or UI libraries
  unless the task asks. Design tokens live in `src/app/globals.css`; shared
  button and field classes in `src/components/ui.ts`.
- **Text:** plain, friendly English. Short labels ("Request this room", not
  "Initiate reservation"). Placeholder copy stays obviously placeholder.
- **Accessibility:** real `<label>`s on form fields, `<button>` for actions,
  `<Link>` for navigation, alt text on images.
- **Imports:** use the `@/` alias (`@/lib/api`), not long relative paths.
- **Formatting:** Prettier decides. Don't hand-format.

## How to work on a task

- Keep each change small and focused on the task. Don't refactor unrelated files.
- Don't add dependencies unless the task needs them; say why if you do.
- Don't change the API contract in `types.ts`/`api.ts` unless the task is about
  the API, and then tell the dashboard developer too.

## Design

- Colours: brand brown `#3E160C`, gold `#B9942C`, white, plus the tints in
  `globals.css` (`sand`, `gold-light`, `brown-deep`...). Nothing else.
- Fonts: Rozha One for headings (`font-display`), Karla for text.
- Motifs: woven bands and basket rings (`components/Patterns.tsx`),
  baobab/palm/homestead silhouettes (`components/Landscape.tsx`).
- Interactivity lives in presentation (hero sky, story cross, bunker plan),
  never in the forms. Forms stay short, one column on phones, big targets.
- Every animation must stop under `prefers-reduced-motion`.
- Money is shown as `N$ 1,450.00` (`formatMoney`). Dates stay `YYYY-MM-DD`
  strings; never `new Date("2026-12-20")`.
- Finish with `npm run check` passing (and `npm run build` if routes or data changed).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
