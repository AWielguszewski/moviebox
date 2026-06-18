# Moviebox

A movie search app built on the [OMDb API](https://www.omdbapi.com/). Search movies and series, filter by year and type, browse details, and save favorites that persist across reloads.

## Features

- **Immersive home** with an animated poster mosaic and a central search.
- **Search results** with year and type filters, infinite scroll, and loading / empty / error states.
- **Movie details** rendered server-side for SEO, opened as a modal over the list via intercepting routes (a shared link or refresh loads the full SSR page).
- **Favorites** stored in `localStorage`, persistent across reloads.
- **SEO**: SSR, dynamic Open Graph / Twitter metadata, JSON-LD, `sitemap.xml`, `robots.txt`, web manifest.
- **Accessible**: keyboard navigation, focus trap in the modal, skip link, `prefers-reduced-motion`, semantic landmarks.
- **Works without an API key** by falling back to a built-in mock dataset.

## Tech stack

- **Next.js (App Router) + TypeScript** — SSR/SEO, deployable to Vercel.
- **Tailwind CSS** — styling.
- **TanStack Query** — search caching and infinite scroll.
- **Zustand** (`persist`) — favorites.
- **Zod** — runtime validation and types for the OMDb responses.
- **Vitest + Testing Library** (unit) and **Playwright** (E2E).

## Getting started

Requirements: Node 18+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
cp .env.example .env.local   # then add your OMDb key (optional)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Without `OMDB_API_KEY` the app runs on mock data, so it works out of the box.

## Environment variables

| Variable               | Required | Description                                                          |
| ---------------------- | -------- | -------------------------------------------------------------------- |
| `OMDB_API_KEY`         | No\*     | OMDb API key ([get one free](https://www.omdbapi.com/apikey.aspx)). Falls back to mock data when unset. |
| `NEXT_PUBLIC_SITE_URL` | No       | Public base URL used for SEO metadata, sitemap, and robots.          |

\*Required to use real OMDb data.

## Scripts

| Command          | Description                  |
| ---------------- | ---------------------------- |
| `pnpm dev`       | Start the dev server.        |
| `pnpm build`     | Production build.            |
| `pnpm start`     | Run the production build.    |
| `pnpm lint`      | Run ESLint.                  |
| `pnpm test`      | Run unit tests (Vitest).     |
| `pnpm test:e2e`  | Run E2E tests (Playwright).  |

Playwright runs against the mock dataset for deterministic, offline tests. First run: `pnpm exec playwright install chromium`.

## Architecture notes

- The OMDb key is never exposed to the client: the browser calls an internal proxy (`/api/omdb/search`), while server components fetch details directly.
- Responses are validated with Zod and normalized into a `Result<T>` type, so the UI handles errors without thrown exceptions.
- Detail views use **intercepting + parallel routes**: a modal on client navigation, a full SSR page on direct visits — UX and SEO without duplication.

## Deployment (Vercel)

1. Import the repository into Vercel.
2. Add `OMDB_API_KEY` (and optionally `NEXT_PUBLIC_SITE_URL`) in project settings.
3. Deploy — the default Next.js build settings work as-is.
