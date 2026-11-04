# Game Hub Design

## 1. Architecture Overview

Game Hub will be a Vite + React + TypeScript single-page app deployed on Vercel. Supabase will provide authentication, profile storage, game records, and online leaderboards.

The frontend must allow public browsing and gameplay without authentication. Authentication is introduced only when a player wants to submit a score or manage leaderboard identity.

Primary layers:

- App shell: routing, layout, theme, and global session state.
- Game catalog: static local metadata for available games.
- Game modules: playable React components with a shared scoring contract.
- Supabase data layer: auth, profiles, games, and scores.
- UI components: library, game shell, auth controls, profile form, and leaderboard.

## 2. Frontend Structure

Use a conventional Vite React structure:

```text
src/
  app/
    App.tsx
    router.tsx
  components/
    AuthButton.tsx
    GameCard.tsx
    GameShell.tsx
    Leaderboard.tsx
    ProfileNameForm.tsx
  games/
    catalog.ts
    types.ts
    reflex-runner/
      ReflexRunnerGame.tsx
      metadata.ts
    puzzle-grid/
      PuzzleGridGame.tsx
      metadata.ts
  lib/
    supabase.ts
    auth.ts
    leaderboards.ts
    scoreValidation.ts
  pages/
    ArcadePage.tsx
    GamePage.tsx
    NotFoundPage.tsx
  styles/
    global.css
```

Exact filenames may change during implementation, but the architecture must keep game logic, shared UI, and Supabase access separated.

## 3. Routing

- `/` displays the arcade library.
- `/games/:gameId` displays the selected game page.
- Unknown routes display a not-found state with a path back to the arcade.

Routes must be generated from or validated against the local game catalog so that adding a new game is predictable.

## 4. Game Catalog And Contract

Each game module must provide metadata and a playable component. The shared contract should include:

```ts
type GameMetadata = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  route: string;
  thumbnail: string;
  scoring: {
    enabled: boolean;
    mode: "higher-is-better" | "lower-is-better";
    unit: "points" | "seconds" | "moves";
    minScore?: number;
    maxScore?: number;
  };
};

type ScoreResult = {
  score: number;
  metadata?: {
    durationMs?: number;
    moves?: number;
    completed?: boolean;
  };
};
```

Game components should report completed runs to `GameShell` instead of writing scores directly. `GameShell` owns submit behavior, auth gating, and leaderboard refresh.

## 5. Starter Games

### Reflex Game

- Short session skill game.
- Scoring mode should be `higher-is-better`.
- Produces a numeric score and duration metadata.
- Must support restart immediately after game over.

### Puzzle Game

- Slower puzzle or strategy game.
- Scoring may use `lower-is-better` for moves/time or `higher-is-better` for efficiency points.
- Must clearly define win/completion state.
- Produces score plus metadata such as moves, duration, and completed status.

The implementation should choose names that fit the final game concepts, but the catalog ids must be stable once introduced.

## 6. Supabase Design

### Tables

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.games (
  id text primary key,
  title text not null,
  status text not null default 'public',
  scoring_mode text not null,
  created_at timestamptz not null default now()
);

create table public.scores (
  id bigint generated always as identity primary key,
  game_id text not null references public.games(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
```

Add indexes:

- `scores(game_id, score desc, created_at asc)` for higher-is-better leaderboards.
- `scores(game_id, score asc, created_at asc)` for lower-is-better leaderboards.
- `scores(user_id, created_at desc)` for future player history.

### Row-Level Security Expectations

- Enable RLS on `profiles`, `games`, and `scores`.
- `games`: public read for rows where `status = 'public'`.
- `profiles`: public read of display names, authenticated users may insert/update only their own profile.
- `scores`: public read, authenticated users may insert only scores where `user_id = auth.uid()`.
- Guests must not be able to write profiles or scores.

Score range validation may be implemented in application code first. If practical, add database constraints or an RPC function for stronger server-side validation.

## 7. Data Flow

### Browse And Play

1. Visitor opens `/`.
2. App loads local catalog metadata.
3. Visitor opens a game page.
4. Game runs entirely in the browser whether or not the visitor is signed in.

### Sign In

1. Visitor opens the auth control.
2. Visitor enters email.
3. App requests a Supabase magic link.
4. Supabase restores the session after link completion.
5. App prompts for display name if the profile is missing.

### Submit Score

1. Game reports a `ScoreResult` to `GameShell`.
2. `GameShell` checks whether scoring is enabled for the game.
3. If the user is not signed in, show a sign-in prompt and keep the completed score available during the current page session.
4. If the user is signed in, ensure a display name exists.
5. Validate score shape, range, game id, and metadata.
6. Insert the score into Supabase.
7. Refresh the leaderboard for that game.

### Leaderboard

1. Game page requests top scores for the current game id.
2. Query joins or maps score rows to public profile display names.
3. Results render publicly for guests and authenticated players.
4. Empty, loading, and error states render inside the leaderboard area.

## 8. UI Direction

- First screen is the arcade library.
- Use a crisp indie arcade mood: clear hierarchy, lively but restrained color, readable typography, and game-forward visuals.
- Avoid a marketing hero as the primary experience.
- Use compact cards only for individual game entries and leaderboard rows.
- Game pages should prioritize the playable area, with instructions and leaderboard nearby.
- Mobile layout should stack gameplay, run state, auth/submission controls, and leaderboard without overlap.

## 9. Deployment And Configuration

- Deploy as a Vercel static/frontend app.
- Configure Supabase credentials through Vercel environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Local development uses the same variables in `.env.local`, which must not be committed.
- Supabase SQL setup should live in a checked-in setup or migration file once implementation begins.

## 10. Testing Strategy

- TypeScript build verifies app-level correctness.
- Component and utility tests should cover score validation, catalog lookup, and leaderboard formatting.
- Manual testing must cover:
  - Guest browse and play.
  - Guest blocked from score submission.
  - Magic-link authenticated score submission.
  - Public leaderboard visibility.
  - Mobile and desktop layouts.
