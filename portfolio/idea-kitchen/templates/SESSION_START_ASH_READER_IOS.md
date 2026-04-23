# SESSION_START — Ash Reader iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Ash Reader iOS is a functional v0.3 SwiftUI app.
**App:** Ash Reader iOS
**Slug:** ash-reader-ios
**One-liner:** Native iOS companion to Ash Reader — 4 tabs (Reader, Themes, Actions, Settings), P6 yellow AppIcon, 138k words baked in, full parity with web v1.1; 26/26 tests passing.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. v0.3 is stable with full web parity; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/ash-reader-ios`
2. **BRANDING.md** — P6 yellow accent, reading/text metaphor, 4-tab structure
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.3 shipped scope; V1.0 = custom source loading
5. **APP_FLOW.md** — document the Reader → Themes → Actions → Settings 4-tab flow
6. **SESSION_START_ash-reader-ios.md** — stub only

Output paths: `portfolio/ash-reader-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.3
**Stack:** SwiftUI + @Observable + UserDefaults
**Storage:** `ash_reader_ios_` prefix (UserDefaults, multiple keys)
**Bundle ID:** `com.chasewhittaker.AshReader`
**URL:** local Xcode
**Tests:** 26/26 passing

**What this app is:**
The native iOS companion to Ash Reader web. Loads the 138k-word capture-system conversation (baked in at build time), chunks it into navigable pages, and provides 4 tabs:
1. **Reader** — paginated text with swipe navigation
2. **Themes** — light, dark, sepia, high contrast, custom font size
3. **Actions** — copy chunk, open Ash URL scheme, share sheet
4. **Settings** — chunk size, chunk overlap, display preferences

Full feature parity with web v1.1 achieved at v0.3. 26/26 SwiftUI tests pass.

**Web companion:**
- `portfolio/ash-reader/` — v1.1, ash-reader.vercel.app, Next.js 16
- Both apps carry the same 138k-word source (baked in at build time)

**Brand system:**
- P6 yellow accent (`#eab308`) — distinct from Clarity suite
- Reading / text metaphor — pages, chapters, navigation
- 4-tab structure matches web layout
- AppIcon: P6 yellow background, book/reader symbol

---

## App context — HANDOFF.md

**Version:** v0.3
**Focus:** Full web parity. Stable. 26/26 tests passing.
**Last touch:** 2026-04-21

**Next (V1.0 candidates):**
- Load custom conversation from URL or paste (not baked-in only)
- iCloud sync of reading position across devices
- Add "send all chunks" batch action for Ash
- Consider TestFlight distribution for use on any iOS device
