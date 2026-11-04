# Game Hub: Playable Indie Arcade

## Summary

Build a modern React arcade site for original games hosted in this repo. The first release should feel like a crisp indie arcade: visitors can browse games, launch playable experiences in-page, sign in with Supabase magic links, and submit scores to online leaderboards.

## Key Changes

- Create a Vite + React + TypeScript app designed for Vercel deployment.
- Add a game catalog model with title, description, genre/tags, thumbnail, route, scoring mode, and leaderboard eligibility.
- Build the main arcade experience:
  - Game library as the first screen, not a marketing landing page.
  - Individual game pages with embedded playable game area, instructions, current player state, and leaderboard.
  - Responsive desktop/mobile layout with polished, game-forward visuals.
- Implement two starter games:
  - One quick skill/reflex game with short sessions and score chasing.
  - One puzzle/strategy game with slower scoring based on completion quality or efficiency.
- Add Supabase integration:
  - Email magic-link authentication.
  - Profiles table for display names tied to auth users.
  - Scores table tied to game ids and users.
  - Public read access for leaderboards.
  - Authenticated score submission only.
- Add basic leaderboard guardrails:
  - Validate score shape, game id, and plausible score ranges before inserting.
  - Prevent unauthenticated score writes.
  - Keep anti-cheat casual for v1; no server-replayed gameplay validation.

## Interfaces

- Frontend game modules expose a consistent contract: metadata, React game component, scoring result, and reset/play lifecycle.
- Supabase tables:
  - `profiles`: user id, display name, timestamps.
  - `games`: stable game id, title, visibility/status metadata.
  - `scores`: game id, user id, numeric score, optional duration/moves metadata, created timestamp.
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## Test Plan

- Verify the app builds successfully with TypeScript.
- Test unauthenticated browsing and playing.
- Test magic-link login flow with Supabase configured.
- Test score submission only works when authenticated.
- Test leaderboard ordering, empty states, and per-game filtering.
- Test mobile and desktop layouts for the library, game page, and leaderboard.
- Manually play both starter games through win/loss/reset/submit flows.

## Assumptions

- Use Supabase as the backend and Vercel as the first deployment target.
- Use email magic-link auth only in v1.
- Require login for submitting scores, but allow anyone to browse and play.
- Keep the first release focused on the playable arcade, not community features like comments, friends, achievements, or admin moderation.
