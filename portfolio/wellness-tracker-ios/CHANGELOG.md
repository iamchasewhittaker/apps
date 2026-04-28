# Changelog — Wellness Tracker (iOS)

## [Unreleased]

- **Phase 2 #5 — Tasks top-3 triage + one-thing modes:** `WellnessStore` gains `tasksOneThing`, `tasksTodayTriage`, `triageIsNeeded`, `pinnedTasks`, `waitingTasks` computed properties and `saveTriage(pinned:)`, `completeTask(id:)`, `setOneThing(_:)`, `clearOneThing()` mutations. `TasksTabView` fully rewritten: triage-needed banner (auto-triggers when >3 undone tasks), inline triage picker (multi-select up to 3), "Your 3" pinned section with auto-replenishment on completion, collapsible Waiting + Done sections, one-thing focus banner, paralysis mode (stripped full-screen single-task view). Backward-compat: existing blobs without `triage`/`oneThing` keys degrade gracefully. 2 new tests added. Fulfils `ROADMAP.md` Phase 2 #5; Phase 2 now complete (6/6).
- **Phase 2 #6 — live timer + active-session controls (Time tab):** new `TimeCategories` (11 categories ported from web), `WellnessStore.startCategorySession` / `stopActiveSession` / `activeTimeSession`, day-rollover + DST-midnight guard, scripture streak increments on stop. `TimeTabView` rewritten: ticking active card (HH:MM:SS, monospaced), 2-col category grid (start / switch-to), Today's log. Retroactive `addTimeSession` API kept untouched. Backward-compat tests added for blobs without `timeData.active`. (Fulfils `ROADMAP.md` Phase 2 #6.)
- **Unarchived** — project restored to `portfolio/wellness-tracker-ios` (active companion again).
- **Cloud sync:** Supabase Swift + **Sync** tab (email OTP); REST upsert to `user_data` for `wellness` + `wellness-daily` (matches web + Clarity Command); debounced push after local saves; pull-on-launch when signed in.
- **App icon:** fixed **1024×1024** square requirement (was 1376×768; Xcode “no applicable content”); `Contents.json` now includes `universal` + `ios-marketing` slots. Web `public/logo-*.png` re-synced from corrected master.
- **App icon:** `AppIcon.appiconset/AppIcon.png` — **W + sunrise** on Clarity-family `#0e1015` (see web `docs/BRANDING.md`). Added [HANDOFF.md](./HANDOFF.md) for iOS session notes.
- **Phase 2 foundation:** replaced single-screen root with native `TabView` shell (`Check-in`, `Tasks`, `Time`, `Capture`) so daily workflows can expand incrementally from a stable app structure.
- **First parity slice shipped:** added native `Tasks`, `Time`, and quick `Win`/`Pulse` capture tabs backed by `WellnessStore` mutations and existing blob persistence.
- **Store hardening:** `WellnessStore` now supports test-safe `UserDefaults` injection, bounded section navigation helpers, and reusable blob mutation utilities for new tabs.
- **Test coverage:** expanded `WellnessBlobTests` to cover draft restore, stale-draft discard, and section navigation/draft-save behavior.
- **QA:** verified simulator build with `xcodebuild build-for-testing ... CODE_SIGNING_ALLOWED=NO` (full `xcodebuild test` still depends on local simulator/signing conditions).
- **Local-only:** removed Supabase sync, email OTP, Keychain session, and login UI. App opens straight to check-in; data persists via `chase_wellness_ios_*` UserDefaults keys only.
- Initial Phase 1 (prior): SwiftUI check-in sections, draft + meds, optional Past days; prior sunrise-style icon in `AppIcon.appiconset`.
