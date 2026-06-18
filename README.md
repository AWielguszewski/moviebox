# Moviebox

### Preview: https://moviebox-livid.vercel.app/

## Getting started

Requirements: Node 18+ and [pnpm](https://pnpm.io/).

```bash
pnpm install
cp .env.example .env.local   # then add your OMDb key (optional)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

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

For playwright first run: `pnpm exec playwright install chromium`.
