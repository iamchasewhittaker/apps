# SESSION_START — Clarity Time iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Clarity Time iOS is a functional v0.1 SwiftUI app.
**App:** Clarity Time iOS
**Slug:** clarity-time-ios
**One-liner:** Focus timer and scripture streak tracker — time your deep work sessions and maintain a daily scripture study habit; third app in the Clarity iOS suite.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. Phase 3 is done; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/clarity-time-ios`
2. **BRANDING.md** — Clarity palette (sky blue time/clock accent), clock+arc AppIcon, focus aesthetic
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.1 shipped scope; Phase 4 = Supabase sync + Command feed
5. **APP_FLOW.md** — document the start session → timer → log → scripture check flow
6. **SESSION_START_clarity-time-ios.md** — stub only

Output paths: `portfolio/clarity-time-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** SwiftUI + @Observable + UserDefaults
**Storage key:** `chase_time_ios_v1`
**Bundle ID:** `com.chasewhittaker.ClarityTime`
**Xcodeproj prefix:** `CX*`
**URL:** local Xcode

**What this app is:**
A focus session timer paired with a scripture streak tracker. Start a named focus session (e.g., "Job Search — resume"), run a timer, log completion. Separately, track daily scripture study (Book of Mormon, D&C, KJV Bible) with a streak counter. Combines focused work + faith practice in one lightweight tab view.

**Architecture:**
- `@Observable` state management
- UserDefaults for persistence (`chase_time_ios_v1`)
- CX* prefix for all xcodeproj identifiers
- No Supabase yet

**Clarity iOS suite position:**
- Time session data feeds into Command iOS scoreboard (Phase 4)
- All apps import `ClarityUI` package

**Brand system:**
- Sky blue primary with clock/time accent — distinct from Check-in (same base color, different metaphor)
- AppIcon: clock with arc overlay on dark background
- Focus / deep work aesthetic — minimal UI so the timer is front and center
- Faith context: scripture streak tracks consistency with Book of Mormon, D&C, and KJV Bible study
- `docs/BRANDING.md` + AppIcon exist in-repo

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** Phase 3 complete. Focus sessions + scripture streak both functional.
**Last touch:** 2026-04-21

**Next (Phase 4):**
- Supabase sync (`chase_time_ios_v1` → shared project)
- Feed session totals to Clarity Command iOS scoreboard
- Add session history chart (7-day time-on-task view)
- Add scripture streak to Command iOS scorecard
