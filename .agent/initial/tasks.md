# Game Hub Implementation Tasks

## Milestone 1: Project Scaffold

- Initialize a Vite + React + TypeScript app in the repository.
- Add standard scripts for development, build, preview, linting, and testing.
- Add base folders for `app`, `components`, `games`, `lib`, `pages`, and `styles`.
- Add environment variable documentation for Supabase.

Acceptance criteria:

- `npm run build` succeeds.
- The app renders a basic arcade shell locally.
- `.env.local` is ignored and documented.

## Milestone 2: Visual And Layout Foundation

- Create global CSS/theme tokens for the crisp indie arcade direction.
- Build the app shell with responsive layout.
- Implement reusable button, panel, form, and status styles as needed.
- Ensure mobile and desktop layouts have stable spacing and no overlapping text.

Acceptance criteria:

- The home route is usable on mobile and desktop.
- Text contrast and focus states are readable.
- The UI feels game-forward and does not present a marketing landing page.

## Milestone 3: Routing And Game Catalog

- Add routing for `/`, `/games/:gameId`, and not-found states.
- Define the shared `GameMetadata` and `ScoreResult` types.
- Create the game catalog with two starter game entries.
- Build `ArcadePage` and `GameCard` using catalog data.
- Build `GamePage` lookup behavior from route params.

Acceptance criteria:

- The arcade library shows both starter games.
- Each game card links to a dedicated game route.
- Unknown game ids show a useful not-found state.

## Milestone 4: Game Shell Contract

- Build `GameShell` to host a game component, instructions, run state, submit controls, and leaderboard.
- Ensure game components report completed runs to the shell instead of submitting directly.
- Add shared reset/replay behavior.
- Keep games playable for guests.

Acceptance criteria:

- A guest can open and play each game without login.
- Completed runs produce a visible score result.
- Restarting a game does not require a page reload.

## Milestone 5: Starter Games

- Implement the skill/reflex game with short sessions and `higher-is-better` scoring.
- Implement the puzzle/strategy game with clear completion and score rules.
- Add thumbnails or visual treatments for both game cards.
- Define plausible score ranges for validation.

Acceptance criteria:

- Both games are complete enough to replay repeatedly.
- Both games produce valid `ScoreResult` payloads.
- Both games handle start, active play, completion/game-over, and reset states.

## Milestone 6: Supabase Setup

- Add Supabase client initialization using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Create SQL setup for `profiles`, `games`, and `scores`.
- Enable RLS on all Supabase tables.
- Add policies for public reads and authenticated-only writes.
- Seed the `games` table with the two starter game ids.

Acceptance criteria:

- Guests can read public games and leaderboard rows.
- Guests cannot write scores.
- Authenticated users can write only their own profile and scores.
- Supabase credentials are not hardcoded.

## Milestone 7: Authentication And Profiles

- Implement email magic-link sign-in.
- Add signed-in and signed-out auth states.
- Add sign-out.
- Create profile fetch/create/update behavior.
- Prompt authenticated users for display name before score submission when needed.

Acceptance criteria:

- Users can request a magic link.
- Session state is restored after login.
- Users can set a display name.
- Email addresses are not displayed on leaderboards.

## Milestone 8: Leaderboards And Score Submission

- Implement leaderboard queries per game.
- Render public leaderboards on game pages.
- Add score submission flow for authenticated users.
- Add guest prompt when an unauthenticated player attempts to submit.
- Refresh leaderboard after successful submission.

Acceptance criteria:

- Guests can view leaderboards.
- Guests can play games but cannot submit scores.
- Authenticated players can submit valid scores.
- Submitted scores appear in the correct game leaderboard.

## Milestone 9: Score Validation And Guardrails

- Implement shared score validation against catalog metadata.
- Validate game id, numeric score, range, scoring eligibility, and metadata shape.
- Show clear errors for invalid or failed submissions.
- Rate-limit or debounce repeated submit attempts in the UI.

Acceptance criteria:

- Invalid score payloads are rejected before insert.
- Duplicate rapid clicks do not create accidental repeated submissions.
- Failed network or Supabase writes show recoverable error states.

## Milestone 10: Testing And Polish

- Add tests for catalog lookup, score validation, and leaderboard ordering helpers.
- Run TypeScript build and test suite.
- Manually test guest browse/play, login, profile setup, scoring, and leaderboard refresh.
- Verify responsive layouts for the arcade, both games, auth UI, and leaderboards.
- Prepare Vercel deployment notes.

Acceptance criteria:

- Build and tests pass.
- Manual verification confirms public play and authenticated scoring.
- The app is ready for Vercel configuration and Supabase project connection.

## Manual Verification Checklist

- Guest can open `/` and see the arcade library.
- Guest can open and play both games.
- Guest can view leaderboards.
- Guest cannot submit a score and sees a sign-in prompt.
- Authenticated player can set a display name.
- Authenticated player can submit scores for both games.
- Leaderboards refresh after submission.
- Mobile layout remains readable and non-overlapping.
- Desktop layout prioritizes the playable game area.
- Missing Supabase configuration produces a clear developer-facing error.
