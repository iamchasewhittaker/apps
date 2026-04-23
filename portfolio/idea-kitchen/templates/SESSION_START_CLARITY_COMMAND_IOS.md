# SESSION_START — Clarity Command iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Clarity Command iOS is a functional v0.1 SwiftUI app.
**App:** Clarity Command iOS
**Slug:** clarity-command-ios
**One-liner:** Mission + Scoreboard + Settings — the command center for the Clarity iOS suite; aggregates data from all 5 Clarity apps via Supabase and presents a daily accountability dashboard.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. Phase 6 is done; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/clarity-command-ios`
2. **BRANDING.md** — gold accent `#c8a84b`, command/authority aesthetic, deep navy background
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.1 shipped scope; Phase 7 = live data feeds from all 5 Clarity apps
5. **APP_FLOW.md** — document the Mission → Scoreboard (live feeds) → Settings 3-tab flow
6. **SESSION_START_clarity-command-ios.md** — stub only

Output paths: `portfolio/clarity-command-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** SwiftUI + @Observable + UserDefaults + Supabase (sync wired)
**Storage key:** `chase_command_ios_v1`
**Bundle ID:** `com.chasewhittaker.ClarityCommand`
**Xcodeproj prefix:** `CD*`
**URL:** local Xcode
**Tests:** 14/14 passing

**What this app is:**
The command center for the Clarity iOS suite. Three tabs: Mission (today's focus, scripture quote, purpose statement), Scoreboard (aggregated metrics from all 5 Clarity apps — check-in, capacity, time sessions, growth streaks, budget STS), and Settings (name, family photo, motivation phrase). Supabase sync is wired — when Phase 7 lands, it will pull live data from all five Clarity apps.

**Architecture:**
- `@Observable` state management
- UserDefaults for local state (`chase_command_ios_v1`)
- Supabase sync wired (reads from shared Supabase project `unqtnnxlltiadzbqpyhh`)
- Currently reads stub data — live data feeds come in Phase 7
- CD* prefix for all xcodeproj identifiers
- 14/14 SwiftUI tests passing

**Clarity iOS suite position:**
- This is the capstone app — all other Clarity apps feed data INTO Command
- Aggregation order: Check-in → Triage → Time → Budget → Growth → Command

**Brand system:**
- Gold accent: `#c8a84b` — command/authority, "gold standard"
- Background: deep navy `#0a0f1e`
- Text logo: `CLARITY` (gold) / `COMMAND` (white bold)
- Voice: direct, mission-driven — "you said you'd do this. did you?"
- Faith anchors: LDS (Book of Mormon, D&C) + KJV Bible scripture in Mission tab
- Family urgency: "For Reese. For Buzz." in purpose statement
- `docs/BRANDING.md` + AppIcon exist in-repo

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** Phase 6 complete. 3 tabs functional with stub data. Supabase sync wired. 14/14 tests pass.
**Last touch:** 2026-04-21

**Next (Phase 7 — live data feeds):**
- Pull live check-in data from `chase_checkin_ios_v1` via Supabase
- Pull live capacity/wins from `chase_triage_ios_v1`
- Pull live session totals from `chase_time_ios_v1`
- Pull live STS from `chase_budget_ios_v1`
- Pull live growth streaks from `chase_growth_ios_v1`
- Once live data is in: all 6 Clarity iOS apps are unified in Command
