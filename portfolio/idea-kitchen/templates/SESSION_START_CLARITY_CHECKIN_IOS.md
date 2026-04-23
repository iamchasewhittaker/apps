# SESSION_START — Clarity Check-in iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Clarity Check-in iOS is a functional v0.1 SwiftUI app.
**App:** Clarity Check-in iOS
**Slug:** clarity-checkin-ios
**One-liner:** Morning check-in wizard and evening review — meds tracker, mood capture, and daily reflection; first app in the Clarity iOS suite.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. Phase 1 is done; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/clarity-checkin-ios`
2. **BRANDING.md** — Clarity palette (sky blue), morning/check-in aesthetic, soft sunrise framing
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.1 shipped scope; Phase 2 = streaks + Supabase sync
5. **APP_FLOW.md** — document the morning wizard → meds → mood → evening review flow
6. **SESSION_START_clarity-checkin-ios.md** — stub only

Output paths: `portfolio/clarity-checkin-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** SwiftUI + @Observable + UserDefaults
**Storage key:** `chase_checkin_ios_v1` (+ draft key, + meds key)
**Bundle ID:** `com.chasewhittaker.ClarityCheckin`
**URL:** local Xcode
**Tests:** 4/4 passing

**What this app is:**
The first app in the Clarity iOS suite. A morning/evening check-in wizard covering: meds reminder, sleep quality (1–5), mood (1–5), energy (1–5), one intention for the day, and an evening reflection (did you follow through?). Stores check-ins in UserDefaults, with a draft save so partial check-ins are never lost.

**Architecture:**
- `@Observable` state management — single source of truth
- UserDefaults for persistence (no Supabase yet)
- Draft save: partial check-ins persist between app launches
- 4/4 SwiftUI tests passing

**Clarity iOS suite position:**
- Part of 6-app suite (Check-in, Triage, Time, Budget, Growth, Command)
- All apps import `ClarityUI` (shared palette + FlowLayout)
- Command iOS coordinates data across all 5 apps via Supabase

**Brand system:**
- Sky blue primary (`#38bdf8`) — Clarity Check-in's lane color
- Morning sunrise / soft start aesthetic
- AppIcon: 1024×1024, sky blue background, check mark symbol
- `docs/BRANDING.md` + AppIcon exist in-repo

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** Phase 1 complete. Meds + mood + sleep + intention + evening review all functional.
**Last touch:** 2026-04-21

**Next (Phase 2):**
- Add check-in streaks (days in a row)
- Supabase sync (`chase_checkin_ios_v1` → shared project)
- Share check-in data with Clarity Command iOS (scoreboard feed)
- Add meds adherence history chart (7-day view)
