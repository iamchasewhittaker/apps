# SESSION_START — Wellness Tracker Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Wellness Tracker is a live, actively used app.
**App:** Wellness Tracker
**Slug:** wellness-tracker
**One-liner:** Comprehensive daily wellness PWA — morning/evening check-ins, task management, time tracking, budget monitoring, and growth habit logging in a single localStorage blob synced to Supabase.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is at v15.10 and in daily use.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/wellness-tracker`
2. **BRANDING.md** — Clarity palette, W+sunrise logo, PWA conventions (see Brand System below)
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect actual shipped scope; defer split/refactor work to V2
5. **APP_FLOW.md** — document the 6-tab daily loop
6. **SESSION_START_wellness-tracker.md** — stub only

Output paths: `portfolio/wellness-tracker/docs/`

---

## App context — CLAUDE.md

**Version:** v15.10
**Storage keys:** `chase_wellness_v1` (main) · `chase_wellness_draft_v1` (draft) · `chase_wellness_meds_v1` (meds)
**URL:** local only (Vercel project removed 2026-04-20; runs via `npm start`)
**Entry:** `src/App.jsx`
**Stack:** React CRA + inline styles + localStorage + Supabase sync (LIVE)
**Linear:** https://linear.app/whittaker/project/wellness-tracker-36f4fb10e0e7

**What this app is:**
A comprehensive daily wellness PWA covering morning/evening check-ins, task management, time tracking, budget monitoring, and growth habit logging — all stored in a single localStorage blob synced to Supabase. Canonical web surface for the `chase_wellness_v1` data stack. Streak tracking, 90-day history, and AI-powered summaries built in.

**6-tab structure:**
- **Tracker** — morning/evening check-in form (sleep, mood, energy, supplements, meds, notes)
- **Tasks** — tasks + ideas sub-tab
- **Time** — time tracking + scripture streak counter
- **Budget** — budget tool + wants tracker
- **History** — 90-day history, analytics, AI summary, export (~58 KB monolith — split pending)
- **Growth** — habit/growth logging, streaks, wins log

**Architecture:**
- `App.jsx` is the shell: state, load/save, saveEntry, floating buttons, modals
- `theme.js` — T (colors), load/save/loadDraft/saveDraft/loadMeds/saveMeds, STORE keys
- Tabs are dumb; App.jsx owns all persistent state as one blob
- Supabase sync is live — `pull()` on load, `push()` on every save; email OTP auth
- Same Supabase project as Job Search HQ (`unqtnnxlltiadzbqpyhh`)

**Brand system:**
- Unified W + sunrise logo on Clarity family canvas `#0e1015`
- Accent: `#4f92f2` (portfolio blue)
- Text logo: `WELLNESS` (small label) / `TRACKER` (large bold) in accent color
- PWA assets: `logo.svg`, `favicon.svg`, `logo-wordmark.svg`, `logo192.png`, `logo512.png`, `apple-touch-icon.png`
- Voice: warm, personal, health-focused — not clinical

**iOS companion:** `portfolio/wellness-tracker-ios/` — SwiftUI check-in + Tasks/Time/Capture; UserDefaults primary; optional Supabase sync.

---

## App context — HANDOFF.md

**Version:** v15.10
**Focus:** Logos + deployment verified (2026-04-14). Portfolio text logo created, iOS AppIcon updated, build verified (149.96 KB gzip).
**Last touch:** 2026-04-14

**Next:**
1. Split HistoryTab (58 KB monolith → analytics / export / AI summary sub-components)
2. iOS palette parity — align `ClarityPalette.swift` to BASE tokens
3. Wellness iOS Phase 2+ — tab bar, richer history, export parity
