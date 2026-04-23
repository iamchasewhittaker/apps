# SESSION_START — Ash Reader Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Ash Reader is a live deployed v1.1 app.
**App:** Ash Reader
**Slug:** ash-reader
**One-liner:** Mobile chunker for sending long capture-system conversations (138k+ words) to Ash — splits the text into page-sized chunks with navigation, themes, and action shortcuts.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is at v1.1 and live; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/ash-reader`
2. **BRANDING.md** — P6 yellow accent, reading/text metaphor, minimal mobile aesthetic
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v1.1 shipped scope; V2 = full parity with iOS v0.3
5. **APP_FLOW.md** — document the load → chunk → read → navigate → send-to-Ash flow
6. **SESSION_START_ash-reader.md** — stub only

Output paths: `portfolio/ash-reader/docs/`

---

## App context — CLAUDE.md

**Version:** v1.1
**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS + localStorage + Vercel
**Storage:** `ash_reader_` prefix (multiple localStorage keys)
**URL:** ash-reader.vercel.app
**GitHub:** connected to `iamchasewhittaker/apps` for auto-deploy

**What this app is:**
A mobile-optimized reader for sending Chase's 138k-word capture-system conversation to Ash (his AI reflection model). The conversation is too long to paste into Claude directly, so Ash Reader chunks it into navigable pages and provides one-tap actions for sending sections. A companion tool to the capture/reflection workflow.

**Key features (v1.1):**
- Loads the full 138k-word conversation from a baked-in source
- Chunks into configurable page sizes (default ~2k words)
- Swipe / tap navigation between chunks
- Themes (light, dark, sepia, high contrast)
- Action shortcuts (copy chunk, open Ash with chunk pre-filled)
- Full parity between web v1.1 and iOS v0.3

**iOS companion:** `portfolio/ash-reader-ios/` — SwiftUI, 4 tabs (Reader/Themes/Actions/Settings), 26/26 tests, P6 yellow icon

**Brand system:**
- P6 yellow accent (`#eab308`) — distinct from other portfolio apps
- Reading/text metaphor — pages, chapters, navigation
- Voice: minimal — the content IS the product

---

## App context — HANDOFF.md

**Version:** v1.1
**Focus:** Stable and live. Full parity with iOS v0.3 achieved.
**Last touch:** 2026-04-21

**Next (V2 candidates):**
- Add ability to load a custom conversation (paste instead of baked-in)
- Add "send all remaining chunks" batch action for Ash
- Add reading progress indicator (chunk N of M, estimated read time)
- Consider converting baked-in source to a URL parameter for flexibility
