# Game Hub

A browser arcade of original games. Anyone can play as a guest; signed-in players can post scores to per-game leaderboards.

Built with Vite, React, and TypeScript. Supabase provides auth, profiles, and leaderboards. Deploys to Vercel.

## Getting Started

Requires Node.js 22.12+ (or 24+).

```sh
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

## Environment Variables

Set these in `.env.local` for local development, and in Vercel project settings for deploys. `.env.local` is git-ignored; never commit it.

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL (Project Settings → API). |
| `VITE_SUPABASE_ANON_KEY` | The project's public anon key. Never use the service-role key here. |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server. |
| `npm run build` | Type-check and build for production into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the test suite once. |
| `npm run test:watch` | Run tests in watch mode. |

Kit preview: `npm run dev`, then open `/kit.html`. Dev only; not in the production build.

## Project Structure

```text
src/
  app/          App root, routing, global providers
  pages/        Route-level screens
  components/   Reusable UI (game cards, game shell, leaderboards, auth)
  games/        Game catalog, shared game types, one folder per game
  lib/          Supabase client, auth, leaderboard queries, score validation
  styles/       Global CSS and theme tokens
  test/         Test setup
```

Requirements, design notes, and the milestone plan live in `.agent/initial/`. Contributor guidelines and current project state are in `AGENTS.md`.
