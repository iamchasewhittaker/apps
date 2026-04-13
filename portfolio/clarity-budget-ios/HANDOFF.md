# Handoff — Clarity Budget (iOS)

## Current status: Phase 4 — not started

- **Version:** v0.1 (planned)
- **Bundle ID:** *(define — e.g. `com.chasewhittaker.ClarityBudget`)*
- **Storage key:** `chase_budget_ios_v1` (per repo root [`CLAUDE.md`](../../CLAUDE.md)) — **never rename after ship**
- **Shared package:** `../clarity-ui` (local SPM — `ClarityUI`)

---

## Product intent (from portfolio roadmap)

**Dual-scenario budget + wants** — local-first app in the Clarity iOS family: one `Codable` root blob, `StorageHelpers`, ClarityUI shell (`ClarityPalette`, `ClarityTypography`, `QuoteBanner`, etc.).

**Before coding:** Capture PRD-level notes in this file (or link a plan): two scenarios (e.g. baseline vs stretch), how “wants” are tracked, and persistence keys.

---

## Engineering pattern (match Phases 1–3)

1. **Order:** models → `*Config` + store → views → **programmatic** `*.xcodeproj` + shared scheme → `xcodebuild build` → `xcodebuild test`.
2. **Xcodeproj:** No manual “New Project” wizard. Clone `ClarityTime.xcodeproj/project.pbxproj` or `ClarityTriage.xcodeproj/project.pbxproj` structure; assign a **new** two-letter PBX ID prefix (**suggested: `CB`** for Clarity Budget). Do **not** reuse `CC`, `CT`, or `CX`.
3. **SPM:** `XCLocalSwiftPackageReference` with `relativePath = "../clarity-ui"` from `portfolio/clarity-budget-ios/`.
4. **Concurrency:** `@Observable @MainActor` store, `nonisolated init()`; `@MainActor` on views that touch the store outside `body`.
5. **Team / plist:** Same defaults as siblings unless told otherwise — `DEVELOPMENT_TEAM = 9XVT527KP3`, `GENERATE_INFOPLIST_FILE = YES`, iOS 17, Swift 5.0.

---

## Verification (when the project exists)

```bash
cd portfolio/clarity-budget-ios
xcodebuild -scheme ClarityBudget -showdestinations   # pick an installed simulator
xcodebuild build -scheme ClarityBudget -destination 'platform=iOS Simulator,name=REPLACE_ME,OS=REPLACE_ME' CODE_SIGNING_ALLOWED=NO
xcodebuild test  -scheme ClarityBudget -destination 'platform=iOS Simulator,name=REPLACE_ME,OS=REPLACE_ME' CODE_SIGNING_ALLOWED=NO
```

*(Replace scheme name if you choose a different target name; keep scheme and product names consistent in `project.pbxproj`.)*

---

## Session start prompt — Phase 4 build (copy into new chat)

After `checkpoint`:

```
Read CLAUDE.md and HANDOFF.md first.

Goal: Build Phase 4 — Clarity Budget iOS at portfolio/clarity-budget-ios/.

Read portfolio/clarity-budget-ios/HANDOFF.md for scope, constraints, and PBX prefix guidance.
Follow the same structure and pattern as portfolio/clarity-time-ios/ (Phase 3), portfolio/clarity-triage-ios/ (Phase 2), and portfolio/clarity-checkin-ios/ (Phase 1):
  models → store → views → programmatic xcodeproj → verify build → run tests.

The xcodeproj must be generated programmatically (no manual Xcode project wizard).
Use a NEW two-letter PBX ID prefix (do not use CC, CT, or CX — reserved for prior Clarity iOS apps). Document the chosen prefix (e.g. CB) in portfolio/clarity-budget-ios/HANDOFF.md.

Wire local package ../clarity-ui as ClarityUI.

Start with: product/data model notes in HANDOFF if still TBD, then models → store → views → xcodeproj → build → test.
```

---

## After implementation

Replace placeholder sections with real bundle ID, file tree, MVP checklist, and “done when” rows — same style as [`portfolio/clarity-time-ios/HANDOFF.md`](../clarity-time-ios/HANDOFF.md) after Phase 3.
