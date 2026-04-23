# SESSION_START — Clarity Triage iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Clarity Triage iOS is a functional v0.1 SwiftUI app.
**App:** Clarity Triage iOS
**Slug:** clarity-triage-ios
**One-liner:** Daily triage for capacity, ideas, and wins — energy-based capacity slots let you decide what you can actually take on today before the day runs away.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. Phase 2 is done; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/clarity-triage-ios`
2. **BRANDING.md** — Clarity palette (emerald green), triage/priority aesthetic, nested chevron icon
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.1 shipped scope; Phase 3 = Supabase sync + Command data feed
5. **APP_FLOW.md** — document the capacity set → item triage → wins log flow
6. **SESSION_START_clarity-triage-ios.md** — stub only

Output paths: `portfolio/clarity-triage-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** SwiftUI + @Observable + UserDefaults
**Storage key:** `chase_triage_ios_v1`
**Bundle ID:** `com.chasewhittaker.ClarityTriage`
**Xcodeproj prefix:** `CT*`
**URL:** local Xcode

**What this app is:**
A daily triage tool for the Clarity iOS suite. Three sections: Capacity (pick energy level → see how many slots you have today), Ideas (capture and tag incoming ideas before they crowd your day), and Wins (log what you actually accomplished). Energy-based capacity prevents overcommitting — if you're at 40% energy, you get 2 slots, not 10.

**Architecture:**
- `@Observable` state management
- UserDefaults for persistence (`chase_triage_ios_v1`)
- CT* prefix for all xcodeproj identifiers
- No Supabase yet

**Clarity iOS suite position:**
- Energy and capacity data feeds into Command iOS scoreboard (Phase 3)
- All apps import `ClarityUI` package

**Brand system:**
- Emerald green primary (`#34d399`) — Clarity Triage's lane color
- Priority / sorting aesthetic — chevron arrows, triage language
- AppIcon: nested chevron on emerald background
- `docs/BRANDING.md` + AppIcon exist in-repo

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** Phase 2 complete. Capacity slots + ideas + wins all functional.
**Last touch:** 2026-04-21

**Next (Phase 3):**
- Supabase sync (`chase_triage_ios_v1` → shared project)
- Feed capacity + wins data to Clarity Command iOS
- Add "triage history" — see past days' capacity decisions
- Add idea → task promotion (elevate idea to today's active triage)
