# Changelog — Unnamed

## [Unreleased]

### Changed — UX clarifications from real use (2026-04-25)
- **Inbox edit/delete:** each captured item now shows a pencil + trash button (44×44pt, accessibility-first, no hidden gestures). Pencil swaps the row to an inline edit input (Enter saves, Escape cancels, empty cancels). First trash tap turns the row red and shows a 3-second confirm-or-keep prompt; second tap deletes. Backed by new `updateItemText` and `deleteItem` mutations in `src/lib/store.ts`.
- **Sort lane help sheet:** each lane card now has an ⓘ button (right-aligned, 44×44pt). Tapping it opens a slide-up bottom sheet with the lane's summary, 5 example items, and a "goes here when…" rule. Sheet dismisses on Escape, backdrop click, or "Sort into [Lane]" CTA. Body scroll locks while open. ⓘ click uses `stopPropagation` so it never accidentally sorts the item. Content lives in `LANE_HELP` in `src/lib/types.ts` (4 lanes × {summary, examples[], rule}).
- **Check question clarity:** `/check` now shows today's locked lanes as colored chips at the top (or a "no lanes locked today" note). Q1 reworded from "Did you produce?" → "Did you finish at least one thing today?" with a helper line. Q2 reworded from "Did you stay in your lanes?" → "Did your effort mostly stay in today's two lanes?" with a conditional helper that references the lane chips above. Result summary updated accordingly.

### Deployed — 2026-04-25
- **Production URL:** https://unnamed-gold.vercel.app
- Linked to `iamchasewhittakers-projects/unnamed`, connected to `iamchasewhittaker/apps` for git auto-deploy from `main`.
- Vercel project settings: `framework: nextjs`, `rootDirectory: portfolio/unnamed`, deployment protection (SSO) disabled.
- Phase 1 7-day clock starts.

### Changed — Web/iOS parity (2026-04-24)
- **Sort flow:** added Skip button (matches iOS, matches CLAUDE.md spec "pick a lane or skip")
- **Skip semantics:** `skipItem` now cycles the item to the end of `state.items` instead of marking `status="skipped"`. Item stays active and reappears later — matches iOS's `skipItem` / `skipActiveItem` behavior. Previously Skip was a discard.
- **FocusView ordering:** items now filtered directly from `state.items` (preserves cycle order) instead of `lanes.flatMap(...)` (which iterated by lane and broke the visible Skip cycle when there was one item per lane). Mirrors iOS `activeItems` computed property.
- `ItemStatus = "skipped"` is left in the type as dead-code parity with iOS's `enum ItemStatus { case ..., skipped }` (defined but never written).

### Added — iOS (2026-04-17)
- Native SwiftUI iOS app at `portfolio/unnamed-ios/` — all 5 flows, matches web behavior exactly
- `AppStore` (@Observable @MainActor) with UserDefaults persistence (`unnamed_ios_v1`)
- Hand-crafted Xcode project (UN* UUIDs, no xcodegen)
- AppIcon: amber triangle (▲) on near-black background, 1024×1024 PNG
- 10/10 unit tests passing; installed and launched on iPhone 12 Pro Max

### Added — Web
- v0.1 MVP: 5 core flows (capture, sort, lane lock, focus, end-of-day check)
- 4 fixed lanes: Regulation, Maintenance, Support Others, Future
- Bottom navigation with active state, inbox badge, lock/check indicators
- Dark UI, mobile-first, big touch targets
- localStorage persistence (no account required)
- PWA manifest for phone installation
- TypeScript types for all data structures
- Immutable state update pattern via AppContext
- Daily lane lock (irreversible until tomorrow)
- One-at-a-time focus view within active lanes
- End-of-day check: "Did you produce?" + "Did you stay in your lanes?"
- Summit/base camp metaphor in check results ("Summit day" / "Base camp held" / "Rest day")

## [0.1.0] — 2026-04-17

Initial build. All 5 flows functional. Clean Next.js 16 build. Dev server verified.
