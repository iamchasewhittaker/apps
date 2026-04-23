# SESSION_START — Unnamed iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.
> Note: "Unnamed" is the placeholder name — a permanent name hasn't been chosen yet. Generate BRANDING.md and SHOWCASE.md using "Unnamed" but flag naming as a follow-up.

---

**Mode:** Retroactive documentation — Unnamed iOS is a functional v0.1 on-device SwiftUI app.
**App:** Unnamed iOS
**Slug:** unnamed-ios
**One-liner:** Native iOS companion to Unnamed — mirrors the web's 5-flow daily OS (Capture / Sort / Today / Check), amber-triangle AppIcon, 10/10 tests; same anti-optimization philosophy, no gamification.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. v0.1 is on-device; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/unnamed-ios`
2. **BRANDING.md** — amber triangle icon, 4-lane color system, anti-optimization voice
3. **PRODUCT_BRIEF.md** — distill from context below; note name is still a placeholder
4. **PRD.md** — reflect v0.1 shipped scope; note 7-day rule before any V2 features
5. **APP_FLOW.md** — document the 5-flow daily loop (Capture → Sort → Today → Check)
6. **SESSION_START_unnamed-ios.md** — stub only

Output paths: `portfolio/unnamed-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** SwiftUI + @Observable + UserDefaults
**Storage key:** `unnamed_ios_v1`
**Bundle ID:** `com.chasewhittaker.Unnamed`
**Xcodeproj prefix:** `UN*`
**URL:** on-device (physical iPhone)
**Tests:** 10/10 passing

**What this app is:**
The native iOS companion to Unnamed web. A daily operating system for ADHD brains — not a task manager. Exactly mirrors the web's 5 flows:
1. **Capture** — type → enter → inbox
2. **Sort** — one inbox item at a time; assign to a lane or discard
3. **Today** — lane lock (pick 2 of 4) + one-at-a-time focus view
4. **Check** — end-of-day: did you produce? did you stay in your lanes?
5. Bottom nav ties all 4 together

**The 4 lanes (fixed — never changes):**
| Lane | Color | Description |
|---|---|---|
| Regulation | Sky | Sleep, food, water, meds, walks, rest |
| Maintenance | Emerald | Dishes, laundry, cleaning, errands |
| Support Others | Violet | Kids, wife, church, family |
| Future | Amber | Job search, GMAT, building, planning |

**Architecture:**
- `@Observable` state management — mirrors web immutable update pattern
- UserDefaults for persistence (`unnamed_ios_v1`) — same data shape as web `unnamed_v1`
- UN* prefix for all xcodeproj identifiers
- 10/10 SwiftUI tests passing
- No Supabase — localStorage/UserDefaults only (by design; anti-feature)

**Anti-features (the product philosophy):**
- No streaks, no points, no gamification
- No push notifications pressuring you to "open the app"
- You can't optimize it — that's the point
- Built for Chase first

**Brand system:**
- Amber triangle icon — focal point, decisive
- Lane colors: Sky, Emerald, Violet, Amber (same as web)
- Voice: direct, minimal — "one thing. not ten."
- AppIcon: amber triangle on dark background

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** All 5 flows on-device. 10/10 tests. 7-day rule in effect — no new features until used daily for a week.
**Last touch:** 2026-04-17

**Next:**
1. Use the iOS app daily for 7 days — no features until then
2. Choose a permanent name
3. Sync with web app (shared UserDefaults/Supabase schema TBD)
4. Deploy web app to Vercel
