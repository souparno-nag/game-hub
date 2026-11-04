# Milestone 2 Design: Visual And Layout Foundation

Status: draft for approval · 2026-11-04

## Intent

Give Game Hub its look and a reusable visual kit before any real screens exist, so Milestones 3–8 (library, game pages, sign-in, leaderboards) build on shared tokens and pieces instead of styling one-off. The direction is "crisp indie arcade" (`.agent/initial/design.md` §8): game-forward, lively but restrained colour, readable, no marketing hero.

## Decisions made with the user

- **Aesthetic:** `neobrutalism` skill, in the **Arcade Yellow** direction: off-white page, yellow fills, violet as the second colour, thick dark outlines, hard offset shadows, tight corners, Archivo headings set wide and heavy. The user briefly chose Coral & Mint for its warmth, then switched back to Arcade Yellow; the quieter Ink & Blue option was also rejected.
- **Themes:** a real light theme **and** a real dark theme (not light-only).
- **Theme choice:** follows the device setting by default; a toggle in the header overrides it and the choice is remembered.
- **Build approach:** B — CSS variables and classes, plus small React components only where a piece carries behaviour or accessibility (see Approaches).
- **Home page content** stays as today (heading, one line, empty state), restyled. The kit is not shown on the home page.

## Goals

- Theme tokens for colour, type, spacing, radii, borders, shadows, focus, in both themes.
- Responsive app shell: header (brand, theme toggle, reserved slot for sign-in in Milestone 7) and a main content column.
- Reusable kit: buttons (primary, secondary), panel, form field, status message (info, success, warning, error), theme toggle.
- WCAG AA text contrast in both themes; visible keyboard focus on every interactive element.
- Stable layout at 375px and desktop widths; no overlapping text; no theme flash on load.

## Non-goals

- Game cards, routing, catalog (Milestone 3). Cards seen in mockups were placeholders.
- Sign-in UI (Milestone 7); only the header slot is reserved.
- Favicon and app icons (left for Milestone 10 polish).
- `npm audit` fixes.

## Anti-goals (failure even if it works)

- A marketing hero or promotional copy on the home page.
- States told apart by colour alone.
- Decoration that encodes nothing (gradients, glows, extra icons, motion on load).
- A flash of the wrong theme on page load.
- Copying a specific existing game's or brand's look.

## Approaches considered

| | Approach | Trade-off | Verdict |
|---|---|---|---|
| A | CSS variables + classes only; `ThemeToggle` the only component | Smallest change, but label/error wiring and screen-reader announcements get hand-written on every later screen | Rejected |
| **B** | **CSS variables + classes, plus components where behaviour or accessibility lives: `ThemeToggle`, `Field`, `StatusMessage`** | **Accessibility is enforced once and tested; looks-only pieces (button, panel) stay as classes** | **Chosen** |
| C | Every piece a typed component with CSS Modules | Most uniform, but designs component APIs for screens that don't exist yet; likely churn in M3–M8 | Rejected |
| — | Tailwind | Extra dependency and a second styling system beside existing CSS | Ruled out |

## Design tokens

All tokens are CSS custom properties. Theme-dependent tokens are set under `:root[data-theme="light"]` and `:root[data-theme="dark"]`. Each theme also sets `color-scheme` so native controls and scrollbars match.

### Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | `#FBFBF9` | `#17171C` | Page background |
| `--color-surface` | `#FFFFFF` | `#22222A` | Header, panels, secondary buttons |
| `--color-ink` | `#141414` | `#F5F3EC` | Body text |
| `--color-muted` | `#4A4A52` | `#B4B2AC` | Secondary text, hints |
| `--color-line` | `#141414` | `#F5F3EC` | Outlines and hard shadows |
| `--color-accent` | `#FDC800` | `#FDC800` | Yellow: primary buttons, brand block (fill only) |
| `--color-accent-2` | `#432DD7` | `#8B7CFF` | Violet: focus ring in light, reserved for game artwork (M5) |
| `--color-on-accent` | `#141414` | `#141414` | Text on yellow and on status badges, both themes |
| `--color-on-accent-2` | `#FFFFFF` | `#141414` | Text on violet fills |
| `--color-focus` | `#432DD7` | `#FDC800` | Focus ring |
| `--color-info` | `#A99BFF` | `#A99BFF` | Info status badge |
| `--color-success` | `#3DDC97` | `#4BE3A3` | Success status badge |
| `--color-warning` | `#FF9F1C` | `#FFA94D` | Warning status badge (orange, so it is not confused with yellow primary) |
| `--color-danger` | `#F2555A` | `#FF6B70` | Error status badge, invalid field border |

Measured contrast (WCAG, light / dark): ink on bg 17.8 / 16.1; muted on bg 8.5 / 8.4; `#141414` on yellow 11.8, info 7.7, success 10.4 / 11.2, warning 9.0 / 9.7, danger 5.5 / 6.7; text on violet 8.1 / 5.6; focus ring vs page bg 7.8 / 11.4. Rule: **yellow is never text or an unoutlined shape on the light page** (1.5:1); it is always a fill inside a dark outline. The focus ring must sit **outside** the element (`outline-offset` ≥ 2px) so it is measured against the page, not against the fill.

### Type

- Family: Archivo (variable, weight and width axes), self-hosted via `@fontsource-variable/archivo` using its `wdth.css` entry (no third-party request), fallback `system-ui, sans-serif`. One family; headings get their character from width, not a second typeface.
- Widths: headings and the brand at `font-stretch: 125%`; body, labels and buttons at normal width (100%).
- Weights: 400 body, 600 labels and buttons, 800 headings. (One more than the Swiss two-weight rule; the heavy, wide heading is what makes the style read as neobrutalist.)
- Scale: `--text-sm` 0.875rem, `--text-base` 1rem, `--text-lg` 1.25rem, `--text-xl` 1.5rem, `--text-2xl` 2rem (h1 on mobile), 2.5rem for h1 from 768px.
- Body line-height 1.5, headings 1.1. Body measure capped at ~65ch where text runs long.

### Space, shape, depth

- Spacing on an 8px base: `--space-1` 4px, `--space-2` 8px, `--space-3` 16px, `--space-4` 24px, `--space-5` 32px, `--space-6` 48px.
- Radii: `--radius-lg` 6px (panels, header brand block), `--radius-sm` 4px (buttons, inputs, badges).
- Borders: `--border-thick` 3px (panels, header rule), `--border` 2px (controls).
- Shadows (hard, no blur): `--shadow-sm` `3px 3px 0 var(--color-line)` (controls), `--shadow` `5px 5px 0 var(--color-line)` (panels).
- Motion: button press only — translate by the shadow offset and drop the shadow, ~80ms. Disabled under `prefers-reduced-motion: reduce`.

## Shell

- Content column: max width 1120px, centred; side padding 16px, 32px from 768px.
- Header: surface background, thick bottom rule. Left: "Game Hub" brand link set wide and heavy, styled as a yellow block with outline and small shadow. Right: a group holding an empty slot for sign-in (Milestone 7; renders nothing now) and the `ThemeToggle`.
- Main: h1 "Arcade", one muted line ("Pick a game. No account needed to play."), then the empty state as an info `StatusMessage` ("No games yet. Starter games are on the way.").
- Mobile (<768px): single column; header keeps brand and toggle on one row.
- Existing smoke test (brand link to `/`, h1 "Arcade") must keep passing.

## Kit

### Classes (looks only)

- `.btn` primary: yellow fill, on-accent text, 2px outline, `--shadow-sm`, weight 600. `.btn--secondary`: surface fill, ink text. States: hover (slight shadow growth or none — builder's call, keep subtle), `:focus-visible` ring, `:active` pressed, `:disabled` 50% opacity and no shadow, `cursor: not-allowed`. Minimum target 40px tall.
- `.panel`: surface fill, 3px outline, `--radius-lg`, `--shadow`, `--space-3` padding.

### Components (behaviour/accessibility)

- **`ThemeToggle`** (`src/components/ThemeToggle.tsx`): a `<button>` showing the theme it switches to ("Dark" / "Light" with a ☾/☀ glyph marked `aria-hidden`), accessible name "Switch to dark theme" / "Switch to light theme". Click sets `data-theme` on `<html>` and stores the choice. While no choice is stored, it follows live changes to the device setting. Once a choice is stored there is no "back to system" option in v1 (designer's call: two states keep the button simple; clearing site data resets it).
- **`Field`** (`src/components/Field.tsx`): renders label, control, hint and error. Requirements: label linked to the control (`useId`); hint and error linked via `aria-describedby`; `aria-invalid` set when there is an error; error text shown with a × glyph and never by border colour alone. API shape is the builder's call (a render prop handing the control its `id`/`aria-*` props is suggested).
- **`StatusMessage`** (`src/components/StatusMessage.tsx`): `tone` of `info | success | warning | error`; badge glyph per tone (i, ✓, !, ×) with `aria-hidden`, plus a visually hidden tone word ("Error:") so meaning survives without colour or glyph. `role="alert"` for error, `role="status"` otherwise.

### Theme logic

- `src/lib/theme.ts`: pure helpers — read stored choice (storage key `game-hub:theme`, values `light`/`dark`), resolve effective theme (stored, else `prefers-color-scheme`), apply to `<html>`. All storage access wrapped in try/catch (private mode).
- No-flash: a small inline script in `index.html` `<head>` runs the same resolve-and-apply before first paint. It duplicates the resolve logic (it cannot import modules); a comment in both places points at the other.

## Files

- `src/styles/tokens.css` (tokens, both themes), `src/styles/base.css` (reset, typography, focus), `src/styles/kit.css` (`.btn`, `.panel`, field, status, toggle, shell), with `src/styles/global.css` as the single entry importing them. Builder may merge files if one ends up trivial.
- `src/components/ThemeToggle.tsx`, `Field.tsx`, `StatusMessage.tsx`, each with a colocated `*.test.tsx`.
- `src/lib/theme.ts` with `theme.test.ts`.
- `src/app/App.tsx` updated for the shell.
- `index.html`: inline theme script.
- Dev-only kit preview: `kit.html` at the repo root plus `src/dev/KitPreview.tsx`, rendering every kit piece in both states. Vite's dev server serves it at `/kit.html`; the production build only includes `index.html`, so it never ships (verify `dist/` has no `kit.html`).
- New dependency: `@fontsource-variable/archivo`.

## Testing and verification

- TDD for `theme.ts`, `ThemeToggle`, `Field`, `StatusMessage` (Vitest + Testing Library): resolve order, storage failure fallback, toggle flips `data-theme` and persists, label/hint/error wiring and `aria-invalid`, status roles and hidden tone word.
- `npm run build`, `npm run lint`, `npm test` pass before each commit.
- Browser check (`webapp-testing` / `agent-browser`): screenshots of `/` and `/kit.html` at 375px and 1280px, in both themes; tab through every control to confirm visible focus; reload after toggling to confirm no flash and that the choice persists; check reduced motion.
- `design-taste-frontend` app-screen review of the screenshots as a cross-check.

## Left to the builder

- Hover treatment details, exact focus `outline-offset` (≥ 2px), and whether `tokens/base/kit` stay as three files.
- `Field` API shape, within the accessibility requirements above.
- Fine-tuning any colour, provided every pair in the contrast list stays at or above WCAG AA (4.5:1 text, 3:1 non-text).
