# SESSION_START — Wellness Tracker iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Wellness Tracker iOS is a Phase 2 shell SwiftUI app.
**App:** Wellness Tracker iOS
**Slug:** wellness-tracker-ios
**One-liner:** Native SwiftUI companion to the Wellness Tracker web app — Phase 2 shell with Tasks, Time, Capture, and Sync tabs; W+sunrise AppIcon; optional Supabase sync.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The Phase 2 shell exists; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/wellness-tracker-ios`
2. **BRANDING.md** — W+sunrise AppIcon, Clarity palette, wellness/morning aesthetic
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect Phase 2 shell scope; Phase 3 = full feature parity with web v15.10
5. **APP_FLOW.md** — document the 4-tab Phase 2 shell structure
6. **SESSION_START_wellness-tracker-ios.md** — stub only

Output paths: `portfolio/wellness-tracker-ios/docs/`

---

## App context — CLAUDE.md

**Version:** Phase 2 shell
**Stack:** SwiftUI + @Observable + UserDefaults + optional Supabase
**Storage key:** `chase_wellness_ios_v1`
**Bundle ID:** `com.chasewhittaker.WellnessTracker`
**URL:** local Xcode

**What this app is:**
The native iOS companion to Wellness Tracker web (v15.10). Currently a Phase 2 shell with four tabs: Tasks (today's task list), Time (basic timer), Capture (quick note/capture), and Sync (Supabase connection status). The shell demonstrates the tab structure and Supabase wiring; full feature parity with the web app comes in Phase 3.

**Web companion:**
- `portfolio/wellness-tracker/` — v15.10, 6 tabs (Tracker / Tasks / Time / Budget / History / Growth)
- Shares the same Supabase project (`unqtnnxlltiadzbqpyhh`)
- `app_key = 'wellness'` — same blob, cross-platform

**Architecture:**
- `@Observable` state management
- UserDefaults for local state (`chase_wellness_ios_v1`)
- Optional Supabase sync (wiring exists in Phase 2 shell — enabled in Phase 3)
- W+sunrise AppIcon

**Brand system:**
- W+sunrise AppIcon — the "W" with a sunrise gradient behind it
- Clarity palette: sky blue primary
- Morning / wellness aesthetic — light, energizing
- Voice: gentle encouragement — "how are you starting today?"

---

## App context — HANDOFF.md

**Version:** Phase 2 shell
**Focus:** Shell is on-device. Tab structure + Supabase wiring in place. No active development.
**Last touch:** 2026-04-21

**Next (Phase 3 — full parity):**
- Tracker tab: morning/evening check-in wizard (match web TrackerTab)
- Tasks tab: full task CRUD with categories (match web TasksTab)
- Time tab: focus session timer with history (match web TimeTrackerTab)
- Growth tab: 7 growth areas + streaks (match web GrowthTab)
- Sync: enable Supabase read/write with `app_key = 'wellness'`
