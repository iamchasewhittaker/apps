# Session Start — RollerTask Tycoon iOS (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-04-12** — Initial Park Checklist: SwiftUI + SwiftData, task list with gamification (park cash, rating, toasts, haptics)
- **2026-04-12** — Park Operations Console: 5-tab shell, attractions with Open/Testing/Broken Down/Closed lifecycle, profit ledger, backup schema v2
- **2026-04-12** — V1 simplification: reduced to 3 tabs (Overview/Attractions/Finances), in-app Park Guide, zone + staff filter chips, backup in Settings
- **2026-04-12** — Rebrand to RollerTask Tycoon (bundle ID com.chasewhittaker.ParkChecklist unchanged for continuity)
- **2026-04-14** — App icon: portfolio-standard text logo, installed on physical iPhone 12 Pro Max
- **2026-04-14** — Phase 2 Supabase sync plan added (docs/SYNC_PHASE2.md)
- **2026-04-15** — Ship polish: brighter app icon, empty state copy, overdue due-date red styling
- **2026-04-28** — V2 Game Feel shipped: subtasks (SubtaskItem SwiftData model, auto-advance Open to Testing), 24 pre-built templates across 6 zones, haptic feedback on transitions, coin burst animation on close, smarter park rating (zone balance + streak bonuses), drag-to-reorder with sortOrder, backup schema v3

---

## Still needs action

- Install V2 on iPhone 12 Pro Max and walk the golden path (subtasks + templates + haptics)
- Import merge mode (by task id) still deferred to V3

---

## RollerTask Tycoon state at a glance

| Field | Value |
|-------|-------|
| Version | v2.0 |
| URL | local Xcode |
| Storage key | SwiftData + UserDefaults (`chase_roller_task_tycoon_ios_cash`, `chase_roller_task_tycoon_ios_readable`) |
| Stack | SwiftUI + SwiftData + @AppStorage + UserDefaults |
| Xcode prefix | -- (standard Xcode) |
| Bundle ID | com.chasewhittaker.ParkChecklist |
| Linear | [Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) |
| Last touch | 2026-04-28 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/roller-task-tycoon-ios/CLAUDE.md | App-level instructions |
| portfolio/roller-task-tycoon-ios/HANDOFF.md | Session state + notes |
| RollerTaskTycoon/Models/ChecklistTaskItem.swift | @Model: attraction with status, zone, staff role, subtasks |
| RollerTaskTycoon/Models/SubtaskItem.swift | @Model: subtask with cascade-delete relationship |
| RollerTaskTycoon/Data/ParkStatusTransitions.swift | Status lifecycle + haptic feedback |
| RollerTaskTycoon/Data/TemplateLibrary.swift | 24 pre-built templates across 6 zones |
| RollerTaskTycoon/Views/OverviewConsoleView.swift | Dashboard: rating, profit, guest thoughts, alerts |
| RollerTaskTycoon/ContentView.swift | TabView (Overview / Attractions / Finances) |

---

## Suggested next actions (pick one)

1. Install V2 on iPhone 12 Pro Max and verify golden path (subtasks + templates + haptics + coin burst)
2. V3 Ecosystem: recurring attractions (daily/weekly/monthly)
3. Supabase sync (see docs/SYNC_PHASE2.md)
