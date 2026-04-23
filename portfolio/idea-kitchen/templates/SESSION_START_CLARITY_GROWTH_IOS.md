# SESSION_START — Clarity Growth iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Clarity Growth iOS is a functional v0.1 SwiftUI app.
**App:** Clarity Growth iOS
**Slug:** clarity-growth-ios
**One-liner:** Seven growth areas with streaks — track daily progress across physical, spiritual, mental, relational, financial, professional, and creative dimensions; fifth app in the Clarity iOS suite.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. Phase 5 is done; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/clarity-growth-ios`
2. **BRANDING.md** — Clarity palette (emerald/growth accent), sprout AppIcon, growth/progress aesthetic
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.1 shipped scope; Phase 6 = Supabase sync + Command data feed
5. **APP_FLOW.md** — document the 7-area daily check → streak update → history view flow
6. **SESSION_START_clarity-growth-ios.md** — stub only

Output paths: `portfolio/clarity-growth-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** SwiftUI + @Observable + UserDefaults
**Storage key:** `chase_growth_ios_v1`
**Bundle ID:** `com.chasewhittaker.ClarityGrowth`
**Xcodeproj prefix:** `CG*`
**URL:** local Xcode

**What this app is:**
A daily growth tracker across 7 fixed dimensions. Each day, mark each area as done (or skip). Streaks track consecutive days of engagement per area. Designed as the iOS native replacement for the GrowthTab in Wellness Tracker (now merged there, but this app provides a dedicated focused view).

**The 7 growth areas (fixed — never changes):**
1. Physical — exercise, movement, sleep quality
2. Spiritual — scripture, prayer, faith practice
3. Mental — learning, reading, journaling
4. Relational — family, friends, community
5. Financial — YNAB review, saving, debt progress
6. Professional — job search, GMAT, building, career development
7. Creative — building apps, design, expression

**Architecture:**
- `@Observable` state management
- UserDefaults for persistence (`chase_growth_ios_v1`)
- CG* prefix for all xcodeproj identifiers
- No Supabase yet

**Brand system:**
- Emerald green primary (`#34d399`) — growth/vitality accent
- AppIcon: sprout symbol on dark Clarity background
- Progress-forward aesthetic — streaks, check marks, daily habit cadence
- `docs/BRANDING.md` + AppIcon exist in-repo

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** Phase 5 complete. All 7 areas + streaks functional.
**Last touch:** 2026-04-21

**Next (Phase 6):**
- Supabase sync (`chase_growth_ios_v1` → shared project)
- Feed streak data to Clarity Command iOS scoreboard
- Add 7-day history grid per area (color coded: done / skipped / missed)
- Add weekly growth score (% of areas touched that week)
