# Handoff: Game Hub — Milestone 3 (Routing And Game Catalog)

Repo: `/home/souparno/Projects/game-hub` · `main` after `fb9f370` (Milestone 2 merged via PR #1, https://github.com/souparno-nag/game-hub/pull/1) · written 2026-11-04.

## Read first (don't re-derive)

- `AGENTS.md`: the repo rules (commits, skills, style-skill approval) and **Project State**, including "Carried from the Milestone 2 review". It is the source of truth; update Project State in every commit.
- `.agent/initial/tasks.md` § Milestone 3: tasks and acceptance criteria.
- `.agent/initial/design.md` §3 (routing), §4 (`GameMetadata` / `ScoreResult` contract, catalog), §8 (UI direction).
- `.agent/initial/requirements.md` §4.1–4.2: library and game-page requirements.
- `.agent/specs/2026-11-04-milestone-2-design.md`: tokens, kit, and the **"Per-game themes"** rules. Games own their play area; hub chrome uses the hub theme.
- `.agent/plans/2026-11-04-milestone-2-plan.md`: the format and level of detail the user approved for plans.
- `.agent/handoff-milestone-2.md` is historical; ignore it.

## What the next session does

Milestone 3: router (`/`, `/games/:gameId`, not-found), `GameMetadata` and `ScoreResult` types, a catalog with two starter entries, `ArcadePage` + `GameCard`, and `GamePage` lookup. The games themselves are Milestone 5; here they are catalog entries plus a placeholder play area.

### Open questions for the user (ask during brainstorming, one at a time)

1. **Router library.** AGENTS.md only says "a router (Milestone 3)". Propose one with a recommendation; it's a new dependency.
2. **Starter game names and ids.** `design.md` uses `reflex-runner` / `puzzle-grid` as examples, and ids must stay stable once introduced. They must be original games, not recreations of existing ones.
3. **Game card look.** The Coral & Mint kit is approved and needs no new style skill. The card layout, thumbnail treatment and what a "Play" action looks like are new UI, so show mockups in the visual companion. The user liked it and picked from side-by-side options.
4. **Lazy-load game routes now or later?** `requirements.md` §5.3 says "future lazy loading is straightforward".

### Things Milestone 3 should fold in (from the Milestone 2 review, see AGENTS.md)

- Extract a shared `AppHeader` (or layout route). The header markup is duplicated in `src/app/App.tsx` and `src/dev/KitPreview.tsx`. The brand link should become a router link.
- Add `src/dev/` to the README Project Structure list.
- Check that `/kit.html` still loads in dev once the router's SPA fallback exists.
- Vercel needs an SPA rewrite so `/games/:id` works on deploy. Note it; deployment config is Milestone 10.

## How the user likes to work (not recorded elsewhere)

- Answer in short lists; minimal, direct summaries.
- **Process that worked:**
  1. `brainstorming` produced the design doc in `.agent/specs/YYYY-MM-DD-<topic>-design.md`, committed.
  2. `writing-plans` produced the plan in `.agent/plans/`, committed.
  3. Execution was inline (`executing-plans`), one commit per task, on a feature branch, with a git-ignored ledger in `.superpowers/sdd/<plan>/progress.md`.
  4. Then browser checks, then one fresh reviewer subagent for the whole branch, then the user chose "push + PR".
- The user may say "implement Task N and stop". Plain "go on" meant run the rest continuously.
- The user changes their mind on visual choices (Coral & Mint → Arcade Yellow → back). Settle the look with mockups before writing the design doc, and use `git revert` for clean reversals.
- **Commits:** no `Co-Authored-By` trailer, and no assistant, tool or vendor names. This overrides the harness's attribution reminder. PR descriptions were also written without an attribution line, and the user didn't object.
- **Never delete branches** after a merge, local or remote, unless asked; this is also in memory. Don't touch `sudoku-ui-update` (unrelated). The local `milestone-2` branch is kept.
- The user merges PRs themselves on GitHub, as a regular merge commit. After a merge: `git pull` on `main`, then verify build, lint and tests.
- `gh` auth was refreshed this session. If it fails, ask the user to run `! gh auth login`.

## Tooling gotchas

- **Browser checks:**
  - Python Playwright and the `agent-browser` CLI are not installed; Chrome is at `/usr/bin/google-chrome`.
  - What worked: a small Node script importing `Browser` from `.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs` (zero dependencies; `newPage({width,height,mobile,reducedMotion})`, `goto`, `eval`, `screenshot`, `send` for `Input.*` events). Put scripts in the session scratchpad.
  - `inspect.mjs --app` from the same skill flags the approved neobrutalist shadows, the cream page and the h1 size. Those are defended, not bugs.
- **Dev servers:**
  - Start with `node node_modules/.bin/vite --port 5199 --strictPort &`, then stop with `kill $!`.
  - `npx` wraps the process, so killing it orphans vite.
  - Never `pkill -f`/grep-kill by "vite": the pattern matches your own shell and kills it.
  - Wait for readiness with `curl --retry 20 --retry-connrefused`.
- **Tests:**
  - jsdom has no `matchMedia`; use `src/test/matchMedia.ts` (`mockMatchMedia`).
  - Vitest globals are off.
  - `index.html?raw` imports work in tests.
- **Theme script:** the theme script lives in `index.html`, `kit.html`, and `resolveTheme()` in `src/lib/theme.ts`; keep all three in sync if routing touches the HTML entry.

## Suggested skills (call via the Skill tool)

- `brainstorming`: first, before any Milestone 3 design. Offer the visual companion for the card and game-page layout.
- `swiss-design` + `frontend-design`: the baseline for `ArcadePage`, `GameCard`, `GamePage` and `NotFoundPage`. The approved aesthetic is `neobrutalism` (Coral & Mint); don't propose a new style skill unless the user asks.
- `writing-plans`, then `executing-plans` (inline). The latter requires `test-driven-development`: catalog lookup and route resolution are prime TDD targets.
- `systematic-debugging`: for any failing test or unexpected behaviour.
- `verification-before-completion`: before any "done" claim or commit.
- `requesting-code-review`: one fresh reviewer for the whole branch at the end.
- `finishing-a-development-branch`: then present merge / PR / keep.
- `handoff`: at the end of the session.
