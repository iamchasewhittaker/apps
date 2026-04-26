# Wellness Tracker — Project Instructions

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions (monorepo root: `~/Developer/chase`).

**Project tracking:** [Linear — Wellness Tracker](https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7)

## App Identity
- **Version:** v15.10
- **Storage key:** `chase_wellness_v1` (main) · `chase_wellness_draft_v1` (draft) · `chase_wellness_meds_v1` (meds)
- **URL:** local only (Vercel project removed 2026-04-20)
- **Branding / icon:** Unified W + sunrise on **Clarity family** canvas `#0e1015` (tokens from YNAB Clarity `ClarityTheme` — Spend Clarity is CLI-only, no logo in-repo); PWA + iOS paths in [docs/BRANDING.md](docs/BRANDING.md). Per-app handoff: [HANDOFF.md](HANDOFF.md).
- **Entry:** `src/App.jsx`
- **Native iOS:** [`../wellness-tracker-ios`](../wellness-tracker-ios) — SwiftUI check-in + Tasks/Time/Capture; **UserDefaults** primary storage; **optional Supabase** (same project) for `wellness` + `wellness-daily` rows (Clarity Command). See that `CLAUDE.md`.
- **vs Clarity Hub:** [**Clarity Hub**](../clarity-hub/CLAUDE.md) is the canonical **web** surface for the **split Clarity iOS suite** (`checkin` / `triage` / `time` / `budget` / `growth` keys). Wellness Tracker is the canonical **web** surface for **this app’s** unified wellness data (`chase_wellness_v1`). Same life *themes* may appear in both products; pick the stack that owns the data you are editing. See [`docs/governance/PRODUCT_LINES.md`](../../docs/governance/PRODUCT_LINES.md).

> *"For Reese. For Buzz. Forward — no excuses."*

## What This App Is

A comprehensive daily wellness PWA covering morning/evening check-ins, task management, time tracking, budget monitoring, and growth habit logging — all stored in a single localStorage blob synced to Supabase. It is the canonical web surface for the unified `chase_wellness_v1` data stack, with streak tracking, 90-day history, and AI-powered summaries built in.

## Vercel & Supabase

**Vercel project removed 2026-04-20.** App runs locally only (`npm start`). Historical Vercel project ID `prj_Pv1PsLFQ87oJwuQaQM3O6ttSoobg` on team `iamchasewhittakers-projects` is retired.

**Supabase (dashboard) — project `unqtnnxlltiadzbqpyhh`**

1. **Authentication → URL configuration**
   - **Site URL:** `http://localhost:3000` (local-only).
   - **Redirect URLs** should include at least:
     - `http://localhost:3000/**` (local CRA)

2. **Authentication → Email Templates → Magic link** — must include **`{{ .Token }}`** for in-app OTP (see section below).

## File Structure
```
src/
  App.jsx          ← shell: state, load/save, saveEntry, floating buttons, modals
  theme.js         ← T (colors), load/save/loadDraft/saveDraft/loadMeds/saveMeds, STORE keys
  ErrorBoundary.jsx
  ui.jsx           ← shared UI primitives (if present)
  tabs/
    TrackerTab.jsx  ← morning/evening check-in form (largest file ~78K — split pending)
    TasksTab.jsx    ← tasks + ideas sub-tab
    TimeTrackerTab.jsx ← time tracking + scripture streak
    BudgetTab.jsx   ← budget tool + wants tracker (WantsTracker exported separately)
    HistoryTab.jsx  ← history, analytics, AI summary, export (~58K — split pending)
    GrowthTab.jsx   ← habit/growth logging, streaks
```

## State Architecture
All persistent state lives in `App.jsx` and is saved as one blob:
```js
{
  entries,         // daily check-in entries (max 90)
  budget,          // budget data
  tasks,           // task data
  ideas,           // ideas data
  growthLogs,      // growth habit logs
  wins,            // win log entries
  savedMorning,    // today's date string if morning done
  savedEvening,    // today's date string if evening done
  pulseChecks,     // pulse check entries (max 200)
  timeData,        // time tracking data
  scriptureStreak, // { count, lastDate }
  _syncAt,         // ms timestamp — set by save() for Supabase sync
}
```

Meds stored separately under `chase_wellness_meds_v1`.

## Load/Save Pattern
```js
// Load (in useEffect on mount):
const stored = load();               // reads chase_wellness_v1
// hydrate all state from stored...
setMeds(loadMeds());                 // reads chase_wellness_meds_v1

// Save (in unified useEffect watching all state):
save({ entries, budget, ... });      // writes chase_wellness_v1 + stamps _syncAt

// Draft (for in-progress check-in):
saveDraft({ formData, sectionIdx, checkinMode, date });
loadDraft() / clearDraft();
```

## Key Behaviours to Preserve
- `hasLoaded.current` ref guards: save effect must not fire on first render
- Morning check-in → auto-routes to Tasks tab on save
- Draft auto-saves as form changes; clears on save or tab switch
- Draft is discarded if it's from a previous day (stale guard)
- Scripture streak increments only when a "scripture" session is logged in TimeTracker
- `saveEntry()` merges morning + evening into the same day's entry (don't overwrite)

## Floating Buttons (always visible)
- 🛒 Want (bottom right) — opens WantsTracker modal (hidden on Budget tab)
- 🏆 Win (bottom left) — opens WinLogger modal
- 💊 Pulse (bottom center) — opens PulseCheckModal

## Supabase Sync — LIVE ✅ (wired in v15.9; email OTP auth in v15.10)

Sync is fully wired. Files involved:
- `src/sync.js` — calls `createSync()` with `process.env.REACT_APP_*` vars, exports `push`, `pull`, `auth`, `APP_KEY`
- `src/App.jsx` — auth gate (email OTP + `verifyOtp` login screen), `pull()` in load useEffect, `push()` in save useEffect
- `.env` — `REACT_APP_SUPABASE_URL` + `REACT_APP_SUPABASE_ANON_KEY` (not committed)
- `.env.example` — template (committed)

**NOTE:** This is Create React App, NOT Vite. Env vars use `REACT_APP_` prefix and `process.env.*` (not `VITE_` / `import.meta.env`).

**Auth flow:** Passwordless email — user requests a sign-in email, then enters the **code** from that email (`verifyOtp` with `type: 'email'`) so the session persists in the same browser context (required for iPhone **Add to Home Screen**; magic link alone often opens Safari). Optional: user can still tap the link in the email when using Safari. `auth.onAuthStateChange()` also handles PKCE/magic-link redirect when the URL contains `code=` or `access_token`.

**Email template (required — codes are not sent by default):** Supabase’s `signInWithOtp` uses the **Magic link** template. The default body is link-only; OTP and magic link share one flow — you must **edit that template** so the message includes the 6-digit code. In the dashboard: **Authentication → Email Templates → Magic link**. Add `{{ .Token }}` to the HTML body (and keep `{{ .ConfirmationURL }}` if you still want a link for Safari/desktop). Example snippet:

```html
<h2>Sign in to Wellness Tracker</h2>
<p>Your one-time code:</p>
<p style="font-size:24px;font-weight:bold;letter-spacing:0.2em">{{ .Token }}</p>
<p>Or tap this link to sign in:</p>
<p><a href="{{ .ConfirmationURL }}">Log in</a></p>
```

See [Passwordless email — With OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless#with-otp).

**Sync flow:** On load → `pull()` checks if remote is newer than `_syncAt`, re-hydrates if so. On save → `push()` fires in background after `save()` writes localStorage.

**Fallback:** If `.env` is missing or incomplete, `createSync()` returns no-op stubs and the app runs in localStorage-only mode (no crash).

## Pending Work (from ROADMAP)
- Split `TrackerTab.jsx` (78K) into morning/evening sub-components
- Split `HistoryTab.jsx` (58K) into analytics, export, AI summary

## CI (GitHub Actions)
This app is built by **`.github/workflows/portfolio-web-build.yml`** on **Node 20** (`npm ci` then `npm run build`). Keep **`package-lock.json`** in sync with `package.json` using **Node 20’s npm** — see repo root **[`docs/templates/SESSION_START_FIX_CI_LOCKFILES.md`](../../docs/templates/SESSION_START_FIX_CI_LOCKFILES.md)**.

## Learnings
Read `LEARNINGS.md` at session start for project-specific gotchas.
After a session where something unexpected happened or was learned, append an entry.
