# Epikaizo Guesthouse – frontend

The public website for Epikaizo Guesthouse: rooms, room booking requests,
the restaurant menu, food ordering (room service or collection) and table
reservations. Bookings and orders are **requests**: there are no online
payments, and staff confirm each one.

The backend API lives in a separate repo. Pages read it through `API_URL`;
set `NEXT_PUBLIC_USE_MOCKS=true` to work on mock data instead.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, ESLint and Prettier.

## Design in one paragraph

The site is built around the place itself: the Ombalantu baobab, the
cross-shaped bunker under the guesthouse, and the woven patterns of northern
Namibian basketry. The home page sky follows the real time in Outapi (dawn,
day, dusk or a starry night), greetings change with the hour in Oshiwambo,
the home page stories sit on the four arms of the bunker's cross, and the
About page has a tappable plan of the bunker. Colours are only the brand
brown (#3E160C), gold (#B9942C) and white with their tints, headings use
Rozha One and text uses Karla. The forms stay plain and quick: the
playfulness is in the presentation, never in the booking steps. All motion
switches off for visitors who ask for reduced motion.

## Setup

You need Node.js 20.9 or newer (`node -v` to check).

```bash
npm install
cp .env.example .env.local   # on Windows: copy .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Settings (`.env.local`)

| Name                    | What it does                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `API_URL`               | Base URL of the backend API, no trailing slash. Server side only.                                                          |
| `NEXT_PUBLIC_USE_MOCKS` | Leave unset or `false` to use the real API (the default). Set `true` only to work offline on the mock data in `src/mocks`. |

## Commands

| Command             | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Run the site locally with live reload.             |
| `npm run build`     | Production build (also catches most errors).       |
| `npm start`         | Run the production build.                          |
| `npm run lint`      | ESLint.                                            |
| `npm run typecheck` | TypeScript check.                                  |
| `npm run format`    | Format all files with Prettier.                    |
| `npm run check`     | Lint, typecheck and format check. Run before a PR. |

## Pages

| URL             | Page                                                |
| --------------- | --------------------------------------------------- |
| `/`             | Home                                                |
| `/about`        | About the guesthouse                                |
| `/contact`      | Contact details                                     |
| `/rooms`        | All rooms                                           |
| `/rooms/[slug]` | One room                                            |
| `/book/room`    | Room booking request (staff confirm)                |
| `/restaurant`   | Restaurant and menu                                 |
| `/order`        | Food order: room service or collection, open to all |
| `/book/table`   | Table reservation, with optional food pre-order     |
| `/events`       | Meetings & Events, with an enquiry form             |
| `/privacy`      | Privacy policy                                      |
| `/terms`        | Terms and conditions                                |
| anything else   | 404 page (`src/app/not-found.tsx`)                  |

All pages are placeholders until the designs and content arrive.

## Where things live

See [AGENTS.md](./AGENTS.md) for the folder layout and coding conventions.
