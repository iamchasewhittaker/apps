# ADR 001: Vite vanilla + shared Supabase blob sync

- **Status:** Accepted
- **Date:** 2026-04-03

## Context

RollerTask Tycoon started as a single HTML file with inline script. The portfolio already standardizes on **Supabase `user_data`** JSON blobs, **offline-first** `push`/`pull`, and **email OTP** for iPhone PWAs (Wellness Tracker, Job Search HQ). Those apps use **Create React App** and `REACT_APP_*` env vars.

## Decision

1. **Vite 6 + vanilla ES modules** — no React for this small surface area; faster scaffold and smaller conceptual footprint than pulling CRA into an HTML-first toy app.
2. **`VITE_*` env vars** — idiomatic for Vite; values are **inlined at build time**, same security model as `REACT_APP_*` (anon key + RLS).
3. **Reuse shared sync** — copy `/portfolio/shared/sync.js` to `src/shared/sync.js`; `APP_KEY = roller_task_tycoon_v1` so data stays isolated from `wellness` and `job-search` rows in the same Supabase project.
4. **Whole-blob last-write-wins** — acceptable for a personal todo + fake “cash” counter; avoids migrations and keeps parity with other portfolio apps.

## Consequences

**Positive:**

- One codebase file (`src/main.js`) owns UI + persistence + auth; easy to read top-to-bottom.
- Same login email can access Wellness, Job Search, and RollerTask without extra accounts.
- Build without env still produces a usable **local-only** PWA.

**Negative / risks:**

- Portfolio docs previously said “never `VITE_`” for CRA apps — this app is the **documented exception** in root `/CLAUDE.md`.
- Simultaneous edits on two devices can lose one side’s changes (inherent to LWW blob).

## Alternatives considered

1. **CRA + React** — consistent with other `apps/*` but heavy for static UI; rejected for this app.
2. **Separate Supabase project** — rejected; shared project + `app_key` matches portfolio strategy.
3. **Normalized `tasks` table** — better for multi-device CRDT-style merge; deferred as unnecessary complexity for v1.
