# SESSION_START — ClarityUI Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — ClarityUI is a functional v0.1 shared Swift package.
**App:** ClarityUI
**Slug:** clarity-ui
**One-liner:** Shared Swift package providing ClarityPalette, FlowLayout, and reusable SwiftUI components for all Clarity iOS apps — imported via Swift Package Manager.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The package is in use across the iOS suite; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/clarity-ui`
2. **BRANDING.md** — developer-library aesthetic, component system framing
3. **PRODUCT_BRIEF.md** — distill from context below; note it's a package not a user-facing app
4. **PRD.md** — reflect v0.1 shipped scope; V2 = expand component library as Clarity apps grow
5. **APP_FLOW.md** — document the import → use pattern (how apps consume the package)
6. **SESSION_START_clarity-ui.md** — stub only

Output paths: `portfolio/clarity-ui/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Stack:** Swift package (Swift 5.9+, SwiftUI) — no build system beyond `swift build`
**Storage:** n/a (shared package — no persistence)
**URL:** n/a (local package reference; not deployed)
**Build:** `swift build` (runs clean in all Clarity iOS apps)

**What this app is:**
A shared Swift package that provides design tokens and reusable components for all six Clarity iOS apps. Rather than copy-pasting palette definitions and common UI components across projects, each Clarity app imports `clarity-ui` via Swift Package Manager (local path reference).

**Key exports:**
- `ClarityPalette` — design tokens: brand colors (sky, emerald, violet, amber, gold, midnight), semantic tokens (primary, background, surface, text)
- `FlowLayout` — public SwiftUI layout for wrapping chips/tags in flowing rows
- Shared utility extensions and view modifiers (reused across Clarity apps)

**Consumer apps (all import clarity-ui):**
- `clarity-checkin-ios`
- `clarity-triage-ios`
- `clarity-time-ios`
- `clarity-budget-ios`
- `clarity-growth-ios`
- `clarity-command-ios`
- `job-search-hq-ios` (also imports ClarityUI for brand consistency)

**Local path reference:**
Each app's `Package.swift` or Xcode project references `clarity-ui` via local path: `../../clarity-ui` (relative to the app folder within the monorepo).

**Brand system:**
- The package IS the brand system — it's not a user-facing app
- Clarity palette: sky (`#38bdf8`), emerald (`#34d399`), violet (`#a78bfa`), amber (`#f59e0b`), gold (`#c8a84b`)
- Background: midnight (`#0a0f1e`)

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** Stable. In active use across all 6 Clarity iOS apps + Job Search HQ iOS.
**Last touch:** 2026-04-21

**Next (V2 candidates — as Clarity apps grow):**
- Add more shared view components (Modal, Sheet, PrimaryButton)
- Add accessibility modifiers (Dynamic Type scaling, high contrast tokens)
- Add animation presets (consistent transition curves across apps)
- Consider publishing as a GitHub package for reuse outside the monorepo
