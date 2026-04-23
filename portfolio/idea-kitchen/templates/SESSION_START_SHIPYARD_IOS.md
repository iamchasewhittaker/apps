# SESSION_START — Shipyard iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Shipyard iOS is a functional v0.1 SwiftUI app.
**App:** Shipyard iOS
**Slug:** shipyard-ios
**One-liner:** Mobile companion to Shipyard — read-only fleet view of the portfolio; fetches real `projects` from Supabase, email/password auth, SY monogram AppIcon.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. Phase 2 is complete; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/shipyard-ios`
2. **BRANDING.md** — nautical palette (#07101E bg, #D7AA3A gold), Big Shoulders Display spirit, SY monogram
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect Phase 2 scope; Phase 3 = editable fields + push status updates
5. **APP_FLOW.md** — document the auth → projects list → project detail → status flow
6. **SESSION_START_shipyard-ios.md** — stub only

Output paths: `portfolio/shipyard-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** SwiftUI + @Observable + supabase-swift v2 + UserDefaults
**Storage key:** `chase_shipyard_ios_v1`
**Bundle ID:** `com.chasewhittaker.Shipyard`
**Xcodeproj prefix:** `SY*`
**URL:** local Xcode

**What this app is:**
The native iOS companion to Shipyard (the web fleet command center). Phase 2 features: fetches real `projects` rows from Supabase (RLS-secured), email/password auth, UserDefaults cache for offline viewing. Currently read-only — the iOS app shows portfolio project status without allowing edits.

**Web companion:**
- `portfolio/shipyard/` — v0.1, Next.js, shipyard-sandy-seven.vercel.app
- Shared Supabase project (`unqtnnxlltiadzbqpyhh`) — same `projects` table
- RLS: authenticated users can read all projects; write requires owner claim

**Architecture:**
- `@Observable` state management
- supabase-swift v2 for auth + data fetch
- UserDefaults cache: `chase_shipyard_ios_v1` (last-fetched projects list)
- SY* prefix for all xcodeproj identifiers

**Brand system:**
- Nautical palette: `#07101E` deep navy background, `#D7AA3A` gold accent
- SY monogram AppIcon (navy background, gold SY lettermark)
- Big Shoulders Display type spirit (matches web Shipyard)
- Voice: fleet-commander confidence — "all ships accounted for"

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** Phase 2 complete. Real projects fetch + auth + UserDefaults cache all working.
**Last touch:** 2026-04-21

**Next (Phase 3):**
- Enable project status updates from iOS (read-write)
- Add editable `status`, `last_touch`, and `notes` fields
- Add push notification when a project status changes
- Ship detail view: show recent git activity + Linear issue count
