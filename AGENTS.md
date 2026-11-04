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

## Skills

Project skills live in `.agents/skills/` (installed via `skills-lock.json`) and `.agent/skills/swiss-design/`; each is symlinked into `.claude/skills/` so it is discovered automatically. When adding a skill, add its symlink there too.

Use skills automatically, without being asked, whenever a task matches:

- **Planning new work:** `brainstorming` before designing a feature or component; `writing-plans` before multi-step implementation; `executing-plans` to carry a plan out.
- **Implementing:** `test-driven-development` for features and bug fixes; `systematic-debugging` for any bug or failing test.
- **Finishing:** `verification-before-completion` before claiming anything works or committing; `requesting-code-review` after a milestone.
- **UI work:** `swiss-design` and `frontend-design` as the baseline for every screen (matches the "crisp indie arcade" direction in `.agent/initial/design.md`).
- **Browser checks:** `webapp-testing` or `agent-browser` to verify UI in a real browser and capture screenshots.

The ~60 single-aesthetic skills (`sega`, `neobrutalism`, `glassmorphism`, `retro`, ...) conflict with each other and with the baseline. The agent judges which one fits each piece of UI work, but **consults the user first**: propose the skill (or a short list of 2–3), with a one-line reason each, and wait for approval before applying it. Record approved choices and where they apply in Project State so later work stays consistent. `handoff` and `review-animations` are user-invoked only (`/handoff`, `/review-animations`).

## Security & Configuration Tips

Never commit Supabase secrets or `.env.local`. Use the anon key only through `VITE_SUPABASE_ANON_KEY`, enforce row-level security for profiles and scores, and validate score ranges before submitting leaderboard entries.

## Project State

Keep this section current: update it in the same commit as each change (milestone progress, what exists, known issues, next steps).

_Last updated: 2026-11-04_

**Current milestone:** 2 — Visual And Layout Foundation (in progress on branch `milestone-2`; Tasks 1–7 of 9 done)

**Milestone 1 — Project Scaffold:** complete.

**Done**
- Vite 8 + React 19 + TypeScript 6 scaffold; deps installed.
- Scripts: `dev`, `build` (`tsc -b && vite build`), `preview`, `lint`, `test` (`vitest run`), `test:watch`. Build, lint, and tests pass.
- Vitest 5 configured in `vite.config.ts` (jsdom, setup in `src/test/setup.ts`); smoke test in `src/app/App.test.tsx`.
- Scaffold committed; `AGENTS.md` and `.agent/` are tracked.
- Arcade shell in `src/app/App.tsx`: full-width header (coral brand link, theme toggle, sign-in slot comment for Milestone 7) and main, each with an inner `.app-container` (1120px column); "Arcade" heading, intro line, info `StatusMessage` empty state. Shell styles at the end of `kit.css`.
- Base folders exist: `src/app` (`App.tsx`), `src/styles` (`global.css`), plus `src/components`, `src/games`, `src/lib`, `src/pages` (empty, held by `.gitkeep`).
- `.env.example` documents `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`; `.env.local` is ignored via `*.local`.
- Skills: 90 project skills discoverable via `.claude/skills/` symlinks; auto-use rules in **Skills** above. Approved aesthetic: `neobrutalism`, Coral & Mint direction (warm surfaces, coral/mint fills, thick outlines, hard shadows, Rubik), applied to all app UI on top of the `swiss-design` baseline. Light and dark themes, device default plus header toggle.
- `README.md` covers setup, env vars, scripts, and structure. Node 22.12+ required (Vitest 5).
- Agent skills vendored in `.agents/skills/` (pinned in `skills-lock.json`, symlinked into `.claude/skills/`): `find-skills` (vercel-labs/skills), `handoff` (mattpocock/skills), `frontend-design` (anthropics/skills), `agent-browser` (vercel-labs/agent-browser), `review-animations` (emilkowalski/skills), `webapp-testing` (anthropics/skills), `design-taste-frontend` (leonxlnx/taste-skill), the obra/superpowers set, and 67 design-style skills from bergside/awesome-design-skills (e.g. `pacman`, `tetris`, `sega`, `neon`).

**Known issues**
- `npm audit` reports 17 advisories (12 moderate, 5 high), mostly in Vite's dev server and transitive dev deps; `npm audit fix` not yet run.

**Upcoming dependencies:** a router (Milestone 3), `@supabase/supabase-js` (Milestone 6).

**Milestone 2 progress** (plan: `.agent/plans/2026-11-04-milestone-2-plan.md`, design: `.agent/specs/2026-11-04-milestone-2-design.md`)
- Task 1 done: theme helpers in `src/lib/theme.ts` (stored choice under `game-hub:theme`, device setting, apply to `<html data-theme>`), tested; test helper `mockMatchMedia` in `src/test/matchMedia.ts` (jsdom has no `matchMedia`).
- Task 2 done: styles split into `src/styles/tokens.css` (Coral & Mint tokens, light default, `[data-theme='dark']`), `base.css` (minimal globals inside `:where()`, focus ring, `.visually-hidden`), `kit.css` (`.btn`, `.btn--secondary`, `.btn--sm`, `.panel`); `global.css` only imports them. Rubik via `@fontsource-variable/rubik`, imported in `src/main.tsx`.
- Task 3 done: inline script in `index.html` `<head>` sets `data-theme` before first paint; it mirrors `resolveTheme()` (keep both in sync). `src/lib/themeScript.test.ts` runs the real script from `index.html`.
- Task 4 done: `src/components/StatusMessage.tsx` (`tone`: info/success/warning/error; `role="alert"` for error, `status` otherwise; hidden glyph plus a spoken tone word), styles in `kit.css`.
- Task 5 done: `src/components/Field.tsx` (label, hint, error wired by `useId`; `aria-describedby` hint then error; `aria-invalid` on error; render-prop `children(control)`), plus `.input` class for text inputs.
- Task 6 done: `src/components/ThemeToggle.tsx` (header button, `btn btn--secondary btn--sm`; click applies and stores the theme; follows the device setting until a choice is stored).
- Task 7 done: responsive app shell (see Done); `App.test.tsx` also checks the header toggle, intro line and empty state.

**Next (Milestone 2):** Task 8, dev-only kit preview at `/kit.html`. Session handoff: `.agent/handoff-milestone-2.md`.

**Milestones 2–10:** not started.
