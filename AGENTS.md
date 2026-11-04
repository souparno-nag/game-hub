# Repository Guidelines

## Project Structure & Module Organization

`.agent/initial/` contains requirements, design notes, and the milestone plan (`requirements.md`, `design.md`, `tasks.md`); see **Project State** below for current progress. The app is a Vite + React + TypeScript arcade deployed to Vercel with Supabase.

When implementing the scaffold, keep source code under `src/`:

- `src/app/` for `App.tsx`, routing, and global providers.
- `src/pages/` for route-level screens such as `ArcadePage`, `GamePage`, and `NotFoundPage`.
- `src/components/` for reusable UI like game cards, auth controls, game shell, and leaderboards.
- `src/games/` for the catalog, shared game types, and each playable game module.
- `src/lib/` for Supabase clients, auth helpers, leaderboard queries, and score validation.
- `src/styles/` for global CSS and theme tokens.

Keep `.env.local` untracked. Document `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Build, Test, and Development Commands

Commands:

- `npm install`: install dependencies.
- `npm run dev`: start the Vite dev server.
- `npm run build`: run TypeScript checks and produce a production build.
- `npm run preview`: preview the production build.
- `npm run lint`: run lint checks.
- `npm test`: run the Vitest suite once (jsdom + Testing Library).
- `npm run test:watch`: run Vitest in watch mode.

Update this guide when scripts or tooling change.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Prefer explicit domain types for game metadata, score payloads, and Supabase rows. Name components in `PascalCase`, hooks as `useSomething`, utilities in `camelCase`, and game ids in kebab-case such as `reflex-runner`.

Keep game logic, shared UI, and Supabase data access separated. Game components report completed runs to `GameShell`; they do not write scores directly.

## Testing Guidelines

Vitest runs in jsdom with `src/test/setup.ts` (Testing Library cleanup). Vitest globals are off: import `describe`/`it`/`expect` from `vitest`.

Prioritize tests for catalog lookup, score validation, leaderboard ordering, and game reset/completion flows. Use colocated `*.test.ts` or `*.test.tsx` files, or `src/__tests__/` if that pattern becomes clearer.

Manual checks should cover guest play, sign-in prompts, authenticated score submission, leaderboard refresh, and mobile/desktop layout.

## Commit & Pull Request Guidelines

Recent history uses short, imperative summaries such as `clean the repo` and `add difficulty and timer logic`. Keep commits concise and focused.

- **Commit after every minor change.** Each self-contained change (a file added, a bug fixed, a config tweak) gets its own commit right away. Don't batch unrelated changes.
- Before committing, run `npm run build` and `npm run lint` when the change touches code or config. Don't commit a broken build.
- Stage only the files you changed (`git add <paths>`), not `git add -A`, so unrelated work-in-progress isn't swept in.
- **No AI attribution in commits:** no `Co-Authored-By` trailers, and no assistant, tool, or vendor names in commit messages.

Pull requests should include a clear description, tests run, linked issue or task when available, screenshots for UI changes, and notes for Supabase schema or environment changes.

## Security & Configuration Tips

Never commit Supabase secrets or `.env.local`. Use the anon key only through `VITE_SUPABASE_ANON_KEY`, enforce row-level security for profiles and scores, and validate score ranges before submitting leaderboard entries.

## Project State

Keep this section current: update it in the same commit as each change (milestone progress, what exists, known issues, next steps).

_Last updated: 2026-11-04_

**Current milestone:** 2 — Visual And Layout Foundation (not started)

**Milestone 1 — Project Scaffold:** complete.

**Done**
- Vite 8 + React 19 + TypeScript 6 scaffold; deps installed.
- Scripts: `dev`, `build` (`tsc -b && vite build`), `preview`, `lint`, `test` (`vitest run`), `test:watch`. Build, lint, and tests pass.
- Vitest 5 configured in `vite.config.ts` (jsdom, setup in `src/test/setup.ts`); smoke test in `src/app/App.test.tsx`.
- Scaffold committed; `AGENTS.md` and `.agent/` are tracked.
- Basic arcade shell in `src/app/App.tsx`: header with brand link, "Arcade" library heading, empty state. Minimal base styles (light/dark) in `src/styles/global.css`; full theme tokens are Milestone 2.
- Base folders exist: `src/app` (`App.tsx`), `src/styles` (`global.css`), plus `src/components`, `src/games`, `src/lib`, `src/pages` (empty, held by `.gitkeep`).
- `.env.example` documents `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`; `.env.local` is ignored via `*.local`.
- `README.md` covers setup, env vars, scripts, and structure. Node 22.12+ required (Vitest 5).
- Agent skills vendored in `.agents/skills/` (pinned in `skills-lock.json`, symlinked into `.claude/skills/`): `find-skills` (vercel-labs/skills), `handoff` (mattpocock/skills), `frontend-design` (anthropics/skills), `agent-browser` (vercel-labs/agent-browser), `review-animations` (emilkowalski/skills), and the obra/superpowers set.

**Known issues**
- `npm audit` reports 17 advisories (12 moderate, 5 high), mostly in Vite's dev server and transitive dev deps; `npm audit fix` not yet run.

**Upcoming dependencies:** a router (Milestone 3), `@supabase/supabase-js` (Milestone 6).

**Next (Milestone 2):** theme tokens, responsive app shell, reusable button/panel/form/status styles.

**Milestones 2–10:** not started.
