# SESSION_START — RollerTask Tycoon Web Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — RollerTask Tycoon Web is a stable v1.0 app.
**App:** RollerTask Tycoon Web
**Slug:** rollertask-tycoon-web
**One-liner:** Standalone points-based task and motivation tracker — complete tasks to earn points and park cash, track totals in a gamified ledger; web companion to RollerTask Tycoon iOS with shared Supabase sync.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is at v1.0 and stable.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/rollertask-tycoon-web`
2. **BRANDING.md** — ROLLER amber / TASK white bold text logo, park-tycoon gamification aesthetic
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect V1 shipped scope; next items go in V2
5. **APP_FLOW.md** — document the task → complete → earn points → ledger flow
6. **SESSION_START_rollertask-tycoon-web.md** — stub only

Output paths: `portfolio/rollertask-tycoon-web/docs/`

---

## App context — CLAUDE.md

**Version:** v1.0
**Storage key:** `chase_hub_rollertask_v1` (localStorage — must never change; shared with clarity-hub for continuity)
**Supabase `app_key`:** `rollertask` (must never change — iOS sync depends on it)
**URL:** local only (Vercel project removed 2026-04-20; runs via `npm start`)
**Entry:** `src/App.jsx`
**Stack:** React CRA + inline styles + localStorage + Supabase sync (live)

**What this app is:**
A standalone points-based task and motivation tracker split out from Clarity Hub. Complete tasks to earn points, track totals, and stay accountable. Web companion to RollerTask Tycoon iOS, sharing the same Supabase blob via `app_key = rollertask`.

**Single-tab structure:**
- `RollerTaskTab.jsx` — task list, points earned, park cash balance, profit ledger
- Settings accessible via gear icon (modal, not a tab)
- Auth gate: email OTP via Supabase

**Architecture:**
- Single-blob app: `App.jsx` owns one `rollertask` state object
- `RollerTaskTab` receives `blob` + `setBlob` as props — dumb component
- `theme.js` — T (colors), `loadBlob`/`saveBlob`, `DEFAULT_ROLLERTASK`
- `sync.js` — `pushRollertask`/`pullRollertask` with `app_key = 'rollertask'`
- Supabase project: `unqtnnxlltiadzbqpyhh` (shared portfolio project)

**Brand system:**
- Text logo: `ROLLER` (amber label) / `TASK` (white bold) — park/tycoon aesthetic
- Park-themed gamification: points = "park cash", tasks = "attractions"
- Fun but grounded — not cartoonish
- Logo assets: `logo.svg`, `favicon.svg`, `logo192.png`, `logo512.png`

**iOS companion:** `portfolio/roller-task-tycoon-ios/` — SwiftUI + SwiftData; local-first, no Supabase yet.

---

## App context — HANDOFF.md

**Version:** v1.0
**Focus:** Stable. Portfolio-standard text logo added (ROLLER amber / TASK white bold), redeployed 2026-04-14.
**Last touch:** 2026-04-14
**Status:** Local only (Vercel removed 2026-04-20)

**Next (V2 candidates):**
- Task categories filter
- Ledger pagination
- Task metadata (due date, ride type)
