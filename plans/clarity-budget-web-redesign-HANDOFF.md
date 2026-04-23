# Handoff — Clarity Budget Web redesign

Paste this into a fresh Claude Code session opened in `~/Developer/chase`.

---

Read these files first, in order:

1. `CLAUDE.md` (root) — portfolio conventions, tech stack, storage rules, auto-update rule.
2. `HANDOFF.md` (root) — current focus.
3. `plans/clarity-budget-web-redesign.md` — **the plan**. Goal, decisions, file paths, acceptance criteria, gotchas, out-of-scope.
4. `portfolio/clarity-budget-web/CLAUDE.md` + `HANDOFF.md` + `ROADMAP.md`.
5. `portfolio/clarity-budget-web/components/HomeDashboard.tsx` — the 750-line god component to split.
6. `portfolio/clarity-budget-web/lib/ynab.ts`, `lib/metrics.ts`, `lib/blob.ts`, `lib/sync.ts`, `lib/constants.ts` — reuse.
7. `portfolio/spend-clarity/src/privacy_client.py` + `src/ynab_client.py` — API shape reference.
8. `portfolio/shipyard/supabase/migrations/0001_init.sql` — migration format reference.

## What we're building

Clarity Budget Web v1 redesign. Adds Privacy.com payee-rename review queue, weirdness flags inbox, and 15-min Vercel cron. Frontend IA restructure (no visual refresh). Backend goes from localStorage-only to encrypted Supabase tokens + server-side cron.

The Spend Clarity Python CLI at `portfolio/spend-clarity/` stays untouched. The two will converge naturally over time.

## Locked decisions

- Target: `portfolio/clarity-budget-web/`. Not a new app.
- IA restructure only, no brand pass. Keep `T` tokens in `lib/constants.ts`, Geist fonts, dark theme.
- Tokens encrypted in Supabase (`clarity_budget_credentials` table, AES-256-GCM).
- Supabase auth becomes required. Magic link.
- Cron cadence `*/15 * * * *`. Backfill window 90 days.
- Write mode: queue for review. No auto-writes to YNAB.
- Kill criteria: if review queue or flags inbox goes untouched for 7 days after v1 ships, stop.
- Money Companion (Claude chat): deferred to Phase 2.

## Out of scope

See "Out of scope" section in `plans/clarity-budget-web-redesign.md`. Short version: no visual refresh, no Gmail / Amazon, no category suggestions, no splits, no Claude chat, no Stripe, no iOS, no CSV export, no YNAB cache migration to Supabase. Do not modify Spend Clarity.

## Start here

Follow the implementation order in the plan:

1. Backend foundation — `lib/crypto.ts`, `lib/supabase-server.ts`, first two migrations, `/api/credentials`.
2. Auth refactor — `/login`, `(app-shell)/layout.tsx` gate, token migration banner.
3. Privacy integration.
4. Reconcile logic + first unit tests.
5. Cron endpoints + `vercel.json`.
6. `/review` UI.
7. `/flags` UI.
8. `/settings` UI.
9. Split `HomeDashboard.tsx` into `components/dashboard/*`.
10. Run migration banner end-to-end on my real data.

## Env vars to add (Vercel + `.env.example`)

```
SUPABASE_SERVICE_ROLE_KEY=   # pull from Supabase dashboard
CRON_SECRET=                 # openssl rand -base64 32
TOKEN_ENCRYPTION_KEY=        # openssl rand -base64 32
```

Use `scripts/vercel-add-env portfolio/clarity-budget-web` once they're in `.env.supabase`. Do not commit the secrets.

## First checkpoint, then start

Run `checkpoint` before touching anything. When you stop, run the full auto-update rule from root `CLAUDE.md` (CHANGELOG, ROADMAP, root ROADMAP change log, HANDOFF, LEARNINGS, Shipyard sync, Linear heartbeat).

## Acceptance criteria

11 checks in the plan file under "Acceptance criteria." Do not declare v1 shipped until all 11 pass.

## Questions to flag early

- Is `@supabase/ssr` already installed in `portfolio/clarity-budget-web/package.json`? If not, install it before writing `lib/supabase-server.ts`.
- Does `portfolio/clarity-budget-web/supabase/` folder exist? It doesn't yet — create it with `migrations/` subfolder.
- Are the three new env vars already in Vercel? If no, generate and add before deploying cron.
