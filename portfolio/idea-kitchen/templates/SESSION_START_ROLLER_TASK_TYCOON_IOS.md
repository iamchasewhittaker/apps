# SESSION_START — RollerTask Tycoon iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — RollerTask Tycoon iOS is a stable v1.0 SwiftUI app.
**App:** RollerTask Tycoon iOS
**Slug:** roller-task-tycoon-ios
**One-liner:** Park-themed tycoon task tracker for iOS — complete tasks to earn park cash, track totals in a gamified ledger; built with SwiftUI + SwiftData, local-first.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. v1.0 is stable; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/roller-task-tycoon-ios`
2. **BRANDING.md** — ROLLER amber / TASK white bold text logo, park-tycoon gamification aesthetic
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v1.0 shipped scope; V2 = Supabase sync to match web companion
5. **APP_FLOW.md** — document the task list → complete → earn park cash → ledger flow
6. **SESSION_START_roller-task-tycoon-ios.md** — stub only

Output paths: `portfolio/roller-task-tycoon-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v1.0
**Stack:** SwiftUI + SwiftData + `UserDefaults` (`AppStorage`)
**Storage:** SwiftData (persistent model store) + `chase_roller_task_tycoon_ios_*` UserDefaults keys
**Bundle ID:** `com.chasewhittaker.ParkChecklist` (legacy bundle ID — kept stable)
**URL:** local Xcode
**Linear:** [RollerTask Tycoon](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e)

**What this app is:**
The native iOS companion to RollerTask Tycoon Web. Complete tasks to earn "park cash" (points). Track totals in a gamified ledger. Park-themed tycoon aesthetic — tasks are "attractions," points are "park cash." Uses SwiftData for task persistence and UserDefaults for settings/totals.

**Note on bundle ID:**
Bundle ID is `com.chasewhittaker.ParkChecklist` (the original name before the rebrand to RollerTask Tycoon). Kept stable to avoid App Store complications.

**Web companion:**
- `portfolio/rollertask-tycoon-web/` — v1.0, CRA, `chase_hub_rollertask_v1`
- Web and iOS share the same Supabase project (`unqtnnxlltiadzbqpyhh`) via `app_key = 'rollertask'`
- iOS does NOT yet have Supabase sync wired (V2 goal)

**Architecture:**
- SwiftUI + SwiftData (`@Model` task entities)
- `AppStorage` / UserDefaults for settings + running totals
- Local-first — no cloud sync yet

**Brand system:**
- Text logo: `ROLLER` (amber label) / `TASK` (white bold) — park/tycoon aesthetic
- Park-themed gamification: tasks = "attractions," points = "park cash"
- Fun but grounded — not cartoonish

---

## App context — HANDOFF.md

**Version:** v1.0
**Focus:** Stable. Local-first task completion + park cash ledger fully functional.
**Last touch:** 2026-04-21

**Next (V2 candidates):**
- Wire Supabase sync (`app_key = 'rollertask'`) — sync with web companion
- Task categories filter
- Ledger pagination
- Task metadata (due date, ride type / task category)
