# Reetry Frontend (Next.js 16)

Next.js 16 App Router skeleton for the Reetry frontend shell. The app is SSR-first, proxies backend
APIs only through `lib/api/fetcher.ts`, and ships two pages (`/`, `/login`) plus an OAuth callback
route placeholder.

## Quick start

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000` for the landing page and `http://localhost:3000/login` for the OAuth
entry point.

## Stack highlights

- Next.js 16 (App Router) + TypeScript
- React Query for server state, Zustand for UI/local state
- Headless UI client components for interactive controls
- Middleware-driven auth guard that checks the configured session cookie
- Fetch wrapper with timeout, AbortController, and shared config

Environment variables live in `.env` — see `.env.example` for required keys. Remember that auth is
cookie-based and no tokens are persisted on the client.
