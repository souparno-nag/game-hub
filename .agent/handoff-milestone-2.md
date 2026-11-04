# Handoff: Game Hub — Milestone 2 (Visual And Layout Foundation)

Repo: `/home/souparno/Projects/game-hub` · branch `main` · written after `c1faf20`.

## Read first (don't re-derive)

- `AGENTS.md` — repo guidelines, **commit/workflow rules**, **Skills** usage rules, and the **Project State** section (current status, known issues). This is the source of truth; keep its Project State current in every commit.
- `.agent/initial/tasks.md` — Milestone 2 tasks and acceptance criteria.
- `.agent/initial/design.md` §8 "UI Direction" and `.agent/initial/requirements.md` — visual and layout requirements ("crisp indie arcade", game-forward, no marketing hero, mobile stacking).
- `git log --oneline` — Milestone 1 history.

## Goal for next session

Complete Milestone 2: theme tokens, responsive app shell, reusable button/panel/form/status styles, readable contrast and focus states on mobile and desktop.

Current starting point: `src/styles/global.css` (minimal light/dark base, a few placeholder tokens) and `src/app/App.tsx` (header + "Arcade" heading + empty state). Smoke test in `src/app/App.test.tsx` checks the brand link and the heading. Keep it passing or update it on purpose.

## Decisions and preferences from this session (not recorded elsewhere)

- **Style skill is NOT approved yet. Consult the user before applying any aesthetic skill.** The user wants the agent to judge which style fits, then propose it and wait for approval. Last proposal given:
  1. `flat` (recommended): bright color, clean type, no 3D. Sits on the `swiss-design` baseline and adds "lively but restrained" color.
  2. `neobrutalism`: thick borders and vivid accents, more personality, louder.
  3. `geometric`: closest to `swiss-design`, may be too muted for an arcade.
  Ask the user to pick (or confirm) **before** writing theme tokens, then record the choice in Project State.
- Avoid style skills that copy a specific existing game or brand (e.g. `pacman`, `tetris`, `sega`). The project builds original games only.
- **Commit after every minor change**, sequentially, staging explicit paths. Run `npm run build`, `npm run lint`, and `npm test` before committing code or config.
- **No AI attribution in commits**: no `Co-Authored-By` trailer, and no assistant, tool, or vendor names in messages. Avoid those names in committed file content too where possible (AGENTS.md says "the agent").
- The user sometimes commits directly (e.g. `fcab166` started tracking `.agent/`). Check `git log` and status before assuming state.
- Answer in short lists. The user prefers minimal, direct summaries.

## Open items

- `npm audit`: 17 advisories (5 high), mostly Vite dev server and transitive dev deps. Logged in Project State. Not fixed, so don't fix it unless asked.
- The shell hasn't been checked visually in a real browser yet. Milestone 2 needs mobile and desktop checks with screenshots.
- `public/` exists but is empty. There's no favicon, and the link to it was removed from `index.html`.

## Suggested skills

- `brainstorming`: before designing the theme and layout system.
- `swiss-design` + `frontend-design`: the baseline for all UI work.
- The approved aesthetic skill (`flat` / `neobrutalism` / `geometric`), **only after the user approves it**.
- `writing-plans` → `executing-plans`: break Milestone 2 into small committed steps.
- `webapp-testing` or `agent-browser`: screenshot the shell at mobile (~375px) and desktop widths, and check focus states and contrast.
- `verification-before-completion`: before claiming Milestone 2 done.
- `requesting-code-review`: after the milestone.
