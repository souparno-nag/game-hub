# Milestone 2: Visual And Layout Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Game Hub its Coral & Mint neobrutalist theme (light and dark, with a header toggle), a responsive shell, and a reusable kit (button and panel classes; `Field`, `StatusMessage`, `ThemeToggle` components).

**Architecture:** CSS custom properties hold every token, set per theme under `:root[data-theme]`. Looks-only pieces are opt-in classes; pieces with behaviour or accessibility are small React components with colocated tests. Theme resolution lives in `src/lib/theme.ts`, mirrored by an inline script in `index.html` that sets the theme before first paint.

**Tech Stack:** Vite 8, React 19, TypeScript 6, plain CSS, Vitest 5 + Testing Library (jsdom), `@fontsource-variable/rubik`.

**Spec:** `.agent/specs/2026-11-04-milestone-2-design.md` (token values, contrast figures, copy, and rules live there; this plan does not repeat them).

## Global Constraints

- Every colour, type size, space, radius, border and shadow value comes from the spec's token tables, exactly.
- Coral (`--color-accent`) is never text on the light page; fills only. Focus ring sits outside the element, `outline-offset` ≥ 2px.
- No element-wide styling of `button`, `input`, headings below `h1`, etc. Kit looks are opt-in classes (spec, "Per-game themes" rule 1).
- Storage key `game-hub:theme`, values `light` | `dark`. All storage access in try/catch.
- Vitest globals are off: import `describe`/`it`/`expect`/`vi` from `vitest`. jsdom has no `matchMedia`; tests stub it with `src/test/matchMedia.ts` (Task 1).
- Before every commit: `npm run build`, `npm run lint`, `npm test` all pass. Stage explicit paths only. Short imperative lowercase commit messages; no `Co-Authored-By` trailer, no assistant/tool/vendor names.
- Update `AGENTS.md` Project State in the same commit when a task changes what exists (Tasks 7 and 9 at minimum).

## Review Focus

1. `localStorage` throws on access (private mode, blocked site data) → app renders, theme follows device. Pinned in Task 1 and Task 3 tests.
2. Stored value is garbage (e.g. `"blue"`) → ignored, device setting used. Pinned in Task 1 and Task 3 tests.
3. No `matchMedia` (old browser, jsdom) → light theme, no crash, toggle still works. Pinned in Task 1 and Task 6 tests.
4. Long status or error text at 375px wraps inside its box, no horizontal scroll. Checked in Task 9 with a long-text sample in the kit preview (Task 8).
5. Keyboard-only use: every control shows a visible ring against the page in both themes, and the press motion is off under reduced motion. Checked in Task 9.

---

### Task 1: Theme logic

**Files:**
- Create: `src/lib/theme.ts`, `src/lib/theme.test.ts`, `src/test/matchMedia.ts`

**Interfaces:**
- Produces:
  - `type Theme = 'light' | 'dark'`
  - `const THEME_STORAGE_KEY = 'game-hub:theme'`
  - `readStoredTheme(): Theme | null` — null when missing, invalid, or storage throws.
  - `writeStoredTheme(theme: Theme): void` — swallows storage errors.
  - `systemTheme(): Theme` — `'dark'` when `matchMedia('(prefers-color-scheme: dark)').matches`; `'light'` when it doesn't or `matchMedia` is absent.
  - `resolveTheme(): Theme` — `readStoredTheme() ?? systemTheme()`.
  - `applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void` — sets `root.dataset.theme`.
  - Test helper `mockMatchMedia(initialDark: boolean): { setDark(dark: boolean): void; restore(): void }` in `src/test/matchMedia.ts` — installs `window.matchMedia` returning a `MediaQueryList`-shaped object whose `addEventListener('change', fn)` listeners fire on `setDark`.

- [ ] **Step 1: Write failing tests in `src/lib/theme.test.ts`** (`afterEach`: `localStorage.clear()`, `vi.restoreAllMocks()`, restore matchMedia, remove `data-theme`)
  - `readStoredTheme` returns `'dark'` after `localStorage.setItem('game-hub:theme', 'dark')`.
  - `readStoredTheme` returns `null` for stored `'blue'`.
  - `readStoredTheme` returns `null` when `vi.spyOn(Storage.prototype, 'getItem')` throws.
  - `writeStoredTheme('light')` stores `'light'`; does not throw when `setItem` throws.
  - `systemTheme` returns `'dark'` with `mockMatchMedia(true)`, `'light'` with `mockMatchMedia(false)`, `'light'` with no `matchMedia`.
  - `resolveTheme` returns stored `'light'` even when `mockMatchMedia(true)`; returns `'dark'` when nothing stored and `mockMatchMedia(true)`.
  - `applyTheme('dark')` sets `document.documentElement.dataset.theme === 'dark'`.
- [ ] **Step 2:** `npm test -- src/lib/theme.test.ts` → FAIL (module not found).
- [ ] **Step 3:** Implement `src/test/matchMedia.ts` and `src/lib/theme.ts` with the signatures above. Access `window.localStorage` inside the try (the property access itself can throw).
- [ ] **Step 4:** `npm test -- src/lib/theme.test.ts` → PASS.
- [ ] **Step 5:** build, lint, test; commit `add theme resolution helpers`.

### Task 2: Tokens, base styles, kit classes, font

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/kit.css`
- Modify: `src/styles/global.css` (becomes imports only, in order tokens → base → kit), `src/main.tsx` (import `@fontsource-variable/rubik` before `./styles/global.css`), `package.json`/`package-lock.json` (`npm install @fontsource-variable/rubik`)

**Interfaces:**
- Produces (CSS, used by every later task):
  - Tokens named exactly as the spec tables (`--color-*`, `--text-*`, `--space-1..6`, `--radius-lg`, `--radius-sm`, `--border`, `--border-thick`, `--shadow-sm`, `--shadow`), plus `--font-body: 'Rubik Variable', system-ui, sans-serif`. Light values under `:root, :root[data-theme='light']` (light is the default with no attribute); dark under `:root[data-theme='dark']`. Each sets `color-scheme`.
  - `base.css`: box sizing, `body` margin 0 / bg / ink / font / line-height 1.5, `h1` (weight 800, `--text-2xl`, line-height 1.1; 2.5rem from 768px), global `:focus-visible` outline `3px solid var(--color-focus)` offset 3px, `.visually-hidden` utility, reduced-motion rule disabling transitions/transforms.
  - `kit.css`: `.btn` (primary), `.btn--secondary`, `.btn--sm` (compact, for the header toggle), states per spec (pressed = translate by shadow offset + no shadow, ~80ms; disabled = 0.5 opacity, no shadow, `not-allowed`; min height 40px; `.btn--sm` min height 32px, still above the WCAG 2.2 24px target minimum), `.panel`.
- [ ] **Step 1:** Install the font; write the three CSS files and rewire `global.css` / `main.tsx`. Delete the old placeholder tokens and `.app-*` rules (Task 7 re-adds shell rules in `kit.css`).
- [ ] **Step 2:** `npm run build` → exit 0; `dist/assets` contains a Rubik `.woff2`.
- [ ] **Step 3:** `npm test` → existing App smoke test still passes.
- [ ] **Step 4:** lint; commit `add coral and mint theme tokens and kit classes`.

### Task 3: No-flash theme script

**Files:**
- Modify: `index.html` (inline `<script>` in `<head>`, before any stylesheet)
- Create: `src/lib/themeScript.test.ts`

**Interfaces:**
- Consumes: storage key and resolve order from Task 1 (duplicated, not imported).
- Exact script (the one place the plan fixes code, because it must match `resolveTheme` behaviour exactly):

```html
<script>
  // Mirrors resolveTheme() in src/lib/theme.ts. Keep both in sync.
  (function () {
    var theme = null
    try {
      var stored = window.localStorage.getItem('game-hub:theme')
      if (stored === 'light' || stored === 'dark') theme = stored
    } catch (e) {}
    if (!theme) {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    document.documentElement.dataset.theme = theme
  })()
</script>
```

Add the matching comment above `resolveTheme` in `theme.ts`: `// Mirrored by the inline script in index.html. Keep both in sync.`

- [ ] **Step 1: Write failing tests.** Load the page source with `import indexHtml from '../../index.html?raw'`, extract the inline script with `/<script>([\s\S]*?)<\/script>/`, run it with `new Function(code)()`. Cases, each asserting `document.documentElement.dataset.theme`:
  - stored `'dark'` + `mockMatchMedia(false)` → `'dark'`
  - stored `'blue'` + `mockMatchMedia(true)` → `'dark'`
  - `getItem` throws + `mockMatchMedia(false)` → `'light'`
  - nothing stored, no `matchMedia` → `'light'`
- [ ] **Step 2:** run → FAIL (no inline script found).
- [ ] **Step 3:** Add the script to `index.html`.
- [ ] **Step 4:** run → PASS.
- [ ] **Step 5:** build, lint, test; commit `set theme before first paint`.

### Task 4: StatusMessage

**Files:**
- Create: `src/components/StatusMessage.tsx`, `src/components/StatusMessage.test.tsx`
- Modify: `src/styles/kit.css` (status styles)

**Interfaces:**
- Produces: `type StatusTone = 'info' | 'success' | 'warning' | 'error'`; `StatusMessage({ tone, children }: { tone: StatusTone; children: ReactNode })`. Renders a `div.status.status--{tone}` with `role="alert"` for error, `role="status"` otherwise; a badge `span.status__badge` (`aria-hidden="true"`) holding the glyph `i` / `✓` / `!` / `×`; a `span.visually-hidden` holding `Info:` / `Success:` / `Warning:` / `Error:`; then children.
- [ ] **Step 1: Write failing tests.**
  - `tone="error"` → `getByRole('alert')` has text content containing `Error:` and the message.
  - `tone="info"` → `getByRole('status')`; `queryByRole('alert')` is null.
  - each tone → the accessible text starts with its word (`Info:`, `Success:`, `Warning:`, `Error:`).
  - the glyph element has `aria-hidden="true"`.
- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3:** Implement component and `.status*` styles (badge fill per tone token, `--color-on-fill` glyph, 2px outline, `--radius-sm`; text wraps, `overflow-wrap: anywhere`).
- [ ] **Step 4:** run → PASS.
- [ ] **Step 5:** build, lint, test; commit `add status message component`.

### Task 5: Field

**Files:**
- Create: `src/components/Field.tsx`, `src/components/Field.test.tsx`
- Modify: `src/styles/kit.css` (`.field`, `.field__label`, `.field__hint`, `.field__error`, `.input`, `.input[aria-invalid='true']` border `--color-danger`)

**Interfaces:**
- Produces:
  - `type FieldControlProps = { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }`
  - `Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: (control: FieldControlProps) => ReactNode })`. Ids from `useId()`. `aria-describedby` lists hint id then error id, omitted when neither. Error renders as `p.field__error` with an `aria-hidden` `×` then the text.
  - Class `.input` for text inputs (later screens use it).
- [ ] **Step 1: Write failing tests** (render with `{(c) => <input className="input" {...c} />}`):
  - `getByLabelText('Email')` returns the input.
  - with `hint` only: input's `aria-describedby` resolves to the hint text; no `aria-invalid`.
  - with `hint` and `error`: `aria-describedby` contains both ids; `aria-invalid="true"`; error text visible.
  - with neither: no `aria-describedby` attribute.
- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3:** Implement component and styles.
- [ ] **Step 4:** run → PASS.
- [ ] **Step 5:** build, lint, test; commit `add accessible form field component`.

### Task 6: ThemeToggle

**Files:**
- Create: `src/components/ThemeToggle.tsx`, `src/components/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: Task 1 helpers; `.btn .btn--secondary .btn--sm` from Task 2.
- Produces: `ThemeToggle()` (no props). Initial state: `document.documentElement.dataset.theme` if it is `light`/`dark`, else `resolveTheme()`. Renders `<button type="button" className="btn btn--secondary btn--sm" aria-label="Switch to dark theme">` with `aria-hidden` glyph `☾` and visible text `Dark` (inverse when dark: `☀`, `Light`, "Switch to light theme"). Click: `applyTheme(next)`, `writeStoredTheme(next)`, update state. While `readStoredTheme()` is null, subscribes to the `(prefers-color-scheme: dark)` change event (if `matchMedia` exists) and follows it; unsubscribes on unmount.
- [ ] **Step 1: Write failing tests** (reset `data-theme`, storage, matchMedia in `afterEach`):
  - `data-theme="light"` → button named "Switch to dark theme".
  - click → `data-theme === 'dark'`, `localStorage['game-hub:theme'] === 'dark'`, button named "Switch to light theme".
  - nothing stored, `mockMatchMedia(false)`, then `act(() => mq.setDark(true))` → `data-theme === 'dark'`, button named "Switch to light theme".
  - stored `'light'`, `mockMatchMedia(false)`, then `setDark(true)` → stays `'light'`.
  - no `matchMedia` → renders and clicking still flips the theme.
- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** run → PASS.
- [ ] **Step 5:** build, lint, test; commit `add theme toggle`.

### Task 7: App shell

**Files:**
- Modify: `src/app/App.tsx`, `src/app/App.test.tsx`, `src/styles/kit.css` (shell rules), `AGENTS.md` (Project State: shell and kit exist)

**Interfaces:**
- Consumes: `ThemeToggle`, `StatusMessage`.
- Structure: `.app-shell` (max-width 1120px, centred, side padding `--space-3`, `--space-5` from 768px) → `header.app-header` (surface bg, `--border-thick` bottom rule, flex space-between) with `a.app-brand` "Game Hub" href `/` (coral block, `--radius-lg`, 2px outline, `--shadow-sm`, weight 800) and `div.app-header__actions` holding an empty `div.app-header__account` (reserved for Milestone 7, renders nothing) and `<ThemeToggle />` → `main.app-main` with the existing `section` / `h1#library-heading` "Arcade", `p.app-intro` "Pick a game. No account needed to play." (muted), `<StatusMessage tone="info">No games yet. Starter games are on the way.</StatusMessage>`. Header must stay one row at 375px. The header bar spans the viewport width; content inside it aligns to the 1120px column.
- [ ] **Step 1: Extend `App.test.tsx`** (keep the two existing assertions):
  - `getByRole('button', { name: /switch to (dark|light) theme/i })` exists.
  - `getByRole('status')` has text containing "No games yet. Starter games are on the way."
  - `getByText('Pick a game. No account needed to play.')` exists.
- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3:** Implement `App.tsx` and shell CSS.
- [ ] **Step 4:** run → PASS.
- [ ] **Step 5:** build, lint, test; update Project State; commit `build responsive app shell`.

### Task 8: Dev-only kit preview

**Files:**
- Create: `kit.html` (repo root; same head as `index.html` incl. the theme script, title "Game Hub kit", script `src/dev/kit-main.tsx`), `src/dev/kit-main.tsx` (imports font + `global.css`, renders `KitPreview` in StrictMode), `src/dev/KitPreview.tsx`
- Modify: `README.md` (one line under Scripts or Project Structure: "Kit preview: `npm run dev`, then open `/kit.html`. Dev only; not in the production build.")

**Interfaces:**
- Consumes: everything from Tasks 2 and 4–6.
- `KitPreview` renders inside the same header/shell markup as `App` (so the toggle is present): buttons (primary, secondary, `--sm`, disabled); a `.panel` with an Email `Field` (hint "We'll email you a sign-in link.") and a Display name `Field` with error "Enter a display name to appear on leaderboards."; all four `StatusMessage` tones using the spec mockup copy; one status with a deliberately long unbroken string (e.g. a 60-character email address) for the overflow check.
- [ ] **Step 1:** Implement the three files.
- [ ] **Step 2:** `npm run build` → exit 0 and `ls dist` shows no `kit.html`.
- [ ] **Step 3:** `npm run dev`, request `/kit.html` → 200 and the page renders (quick curl or browser check).
- [ ] **Step 4:** lint, test; commit `add dev-only kit preview page`.

### Task 9: Browser verification, polish, wrap-up

**Files:**
- Modify: any of the above only to fix issues found; `AGENTS.md` (Project State: Milestone 2 complete, approved style, kit preview, known issues, next = Milestone 3).

- [ ] **Step 1:** With `webapp-testing` (or `agent-browser`), screenshot `/` and `/kit.html` at 375×812 and 1280×800 in light and dark (set via the toggle, then reload to confirm persistence and no flash). Save screenshots to the session scratchpad, not the repo.
- [ ] **Step 2:** Tab through every control on both pages in both themes; confirm a visible ring each time. Emulate `prefers-reduced-motion: reduce`; confirm the button no longer moves on press.
- [ ] **Step 3:** Confirm at 375px: no horizontal scroll (`document.documentElement.scrollWidth <= 375`), the long-text status wraps, the header stays on one row.
- [ ] **Step 4:** Review screenshots against the spec and with `design-taste-frontend` app-screen rules; fix issues, one commit per fix.
- [ ] **Step 5:** `verification-before-completion`: fresh `npm run build`, `npm run lint`, `npm test`, all green; check each spec Goal line has evidence.
- [ ] **Step 6:** Update Project State; commit `complete milestone 2 visual foundation`.
- [ ] **Step 7:** `requesting-code-review` on the range from `4c6341f` to HEAD; act on findings.
