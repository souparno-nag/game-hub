# Game Hub Requirements

## 1. Product Vision

Game Hub is a playable arcade site for original browser games created in this repository. The first release should feel like a crisp indie arcade: polished, playful, fast to enter, and centered on actual play rather than marketing copy.

The site must let anyone browse and play public games without creating an account. Authentication is required only for score submission and leaderboard-backed features.

## 2. Goals

- Provide a public game library as the first screen.
- Let visitors launch and play games directly in the browser.
- Ship with two starter games that make the hub feel real immediately.
- Support online leaderboards for score-chasing games.
- Use Supabase for authentication, profiles, game records, and scores.
- Use Vercel as the primary deployment target.
- Keep the v1 architecture simple enough to extend with more games later.

## 3. User Roles

### Guest Player

- Can view the public arcade library.
- Can open any public game page.
- Can play games without login.
- Can view public leaderboards.
- Cannot submit scores.
- Is prompted to sign in when attempting to submit a score.

### Authenticated Player

- Can do everything a guest player can do.
- Can sign in with an email magic link.
- Can create or update a display name.
- Can submit eligible game scores.
- Can see their submitted scores on leaderboards.

### Future Maintainer/Admin

- Can add new games to the local catalog and Supabase `games` table.
- Can adjust scoring rules and validation limits per game.
- May eventually moderate scores, users, or game visibility, but admin tooling is out of scope for v1.

## 4. Functional Requirements

### 4.1 Arcade Library

- The home page must be the playable game library, not a landing or marketing page.
- Each game card must show title, short description, tags or genre, scoring type, and play action.
- The library must distinguish playable/public games from any future draft or hidden games.
- The library must work for unauthenticated visitors.

### 4.2 Game Pages

- Each public game must have a dedicated route.
- A game page must include the playable game, concise instructions, score or progress state, and leaderboard area.
- Games must provide clear start, restart, completion, and score submission states.
- Games must remain playable when the user is not signed in.
- When a guest finishes a leaderboard-eligible run, the submit action must direct them to sign in rather than blocking gameplay itself.

### 4.3 Starter Games

- V1 must include two playable games:
  - One skill/reflex game with short sessions and score chasing.
  - One puzzle/strategy game with scoring based on completion quality, efficiency, or time.
- Both games must use the shared game contract for metadata, lifecycle, and score results.
- Both games must support reset/replay without a full page reload.
- Both games must produce deterministic score payloads that can be validated before submission.

### 4.4 Authentication

- Supabase Auth must provide email magic-link sign-in.
- The site must show signed-in state clearly without requiring login to browse or play.
- Sign-in must be required before score submission.
- Sign-out must be available to authenticated players.
- V1 must not include password auth, social auth, or multiple auth providers.

### 4.5 Profiles

- Each authenticated user must have one profile tied to their Supabase auth user id.
- A profile must include a display name used on leaderboards.
- Users must be able to set or update their display name before or during score submission.
- Leaderboards must avoid exposing private auth data such as email addresses.

### 4.6 Scores

- Only authenticated users may submit scores.
- A submitted score must be tied to a known game id and authenticated user id.
- Scores must include a numeric score and may include extra run metadata such as duration, moves, or completed status.
- The app must prevent guest score writes at both the UI and database policy layers.
- The app must reject malformed, impossible, or out-of-range scores with basic validation.

### 4.7 Leaderboards

- Leaderboards must be publicly readable.
- Each game page must show that game's leaderboard.
- Leaderboards must order scores according to the game's scoring mode.
- Empty leaderboard states must be handled gracefully.
- A score submission should refresh or update the visible leaderboard.

## 5. Non-Functional Requirements

### 5.1 Responsiveness

- The arcade library, game pages, auth UI, and leaderboards must work on desktop and mobile.
- Fixed-format game areas must have stable responsive dimensions to avoid layout shifts.
- Controls and score panels must not overlap gameplay or each other.

### 5.2 Accessibility

- Interactive controls must be keyboard reachable where practical.
- Buttons and form fields must have clear labels.
- Text contrast must be readable.
- Error, loading, and success states must be visible without relying only on color.

### 5.3 Performance

- Initial load should stay lightweight.
- Game modules should be organized so future lazy loading is straightforward.
- Leaderboard queries should fetch only the rows needed for visible rankings.
- Gameplay should avoid avoidable re-renders during fast interaction loops.

### 5.4 Maintainability

- Games must share a consistent module interface.
- Supabase calls must be centralized behind a small data access layer or hooks.
- UI components for auth, leaderboard, and game shell should be reusable.
- New games should be addable without changing global routing logic in many places.

### 5.5 Deployment

- The app must be compatible with Vercel.
- Runtime configuration must use environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- The repository must include enough setup documentation for local development and deployment configuration.

### 5.6 Score Trust

- V1 uses casual trust with basic guardrails, not strong anti-cheat.
- Validation must check known game ids, numeric score ranges, authenticated user ownership, and required metadata shape.
- Strong server-side gameplay replay, event validation, and cheat detection are out of scope for v1.

## 6. Out Of Scope For V1

- Comments, reactions, or social feeds.
- Friends, follows, or player-to-player messaging.
- Achievements or badges.
- Strong anti-cheat based on server-issued sessions or gameplay event replay.
- Admin moderation UI.
- Password auth, GitHub OAuth, or other login providers.
- Native mobile apps.
- Monetization, payments, or ads.
