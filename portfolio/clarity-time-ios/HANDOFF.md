# Handoff — Clarity Time (iOS)

## Current status: Phase 3 — not started

- **Version:** v0.1 (planned)
- **Bundle ID:** *(define — e.g. `com.chasewhittaker.ClarityTime`)*
- **Storage key:** `chase_time_ios_v1` (per repo root `CLAUDE.md`)
- **Shared package:** `../clarity-ui` (local SPM — `ClarityUI`)

---

## Product intent (from portfolio roadmap)

**Time sessions + scripture streak** — focused timer or session logging for deep work / spiritual habit, consistent with the Clarity iOS family (local-first, `StorageHelpers`, ClarityUI shell).

**Reference implementations (copy structure, not IDs):**

| App | Path | PBX prefix | Notes |
|-----|------|------------|--------|
| Clarity Check-in | `portfolio/clarity-checkin-ios/` | `CC` | Phase 1 complete |
| Clarity Triage | `portfolio/clarity-triage-ios/` | `CT` | Phase 2 complete |

---

## Before coding (product phases 1–3)

Per root `PRODUCT_BUILD_FRAMEWORK.md`: document **PRD + UX flow + data model** in this folder (or link a plan doc) before Swift files. At minimum capture:

1. **Time sessions** — start/stop, pause, categories/tags, daily list vs history, relationship to `Wellness` Time tab if any.
2. **Scripture streak** — what counts as “done” per day, streak reset rules, optional reading plan vs free-form reference.
3. **Single blob vs multiple keys** — follow family pattern: one primary `Codable` root + `TriageConfig`-style keys enum; never rename keys after ship.

---

## Engineering pattern (match Phases 1–2)

1. **Order:** models → `*Config` + store → views → **programmatic** `*.xcodeproj` + shared scheme → `xcodebuild build` → `xcodebuild test`.
2. **Xcodeproj:** No manual “New Project” step. Clone `ClarityTriage.xcodeproj/project.pbxproj` or `ClarityCheckin.xcodeproj/project.pbxproj` structure; use a **new** two-letter ID prefix (suggested **`CX`** for Clarity Time — do **not** reuse `CT`).
3. **SPM:** `XCLocalSwiftPackageReference` with `relativePath = "../clarity-ui"` from `portfolio/clarity-time-ios/`.
4. **Concurrency:** `@Observable @MainActor` store, `nonisolated init()`; `@MainActor` on views that touch the store outside `body`.
5. **Team / plist:** Same defaults as siblings unless told otherwise — `DEVELOPMENT_TEAM = 9XVT527KP3`, `GENERATE_INFOPLIST_FILE = YES`, iOS 17, Swift 5.0.

---

## Verification

```bash
cd portfolio/clarity-time-ios
xcodebuild -scheme ClarityTime -showdestinations   # pick an installed simulator
xcodebuild build -scheme ClarityTime -destination 'platform=iOS Simulator,name=REPLACE_ME,OS=REPLACE_ME' CODE_SIGNING_ALLOWED=NO
xcodebuild test  -scheme ClarityTime -destination 'platform=iOS Simulator,name=REPLACE_ME,OS=REPLACE_ME' CODE_SIGNING_ALLOWED=NO
```

If `CODE_SIGNING_ALLOWED=NO`, always use a **simulator** destination — physical devices require a valid signature.

---

## Session start prompt — Phase 3 build

Copy into a **new** chat (after `checkpoint`):

```
Read CLAUDE.md and HANDOFF.md first.

Goal: Build Phase 3 — Clarity Time iOS at portfolio/clarity-time-ios/.

Read portfolio/clarity-time-ios/HANDOFF.md for scope, constraints, and PBX prefix guidance.
Follow the same structure and pattern as portfolio/clarity-triage-ios/ (Phase 2) and portfolio/clarity-checkin-ios/ (Phase 1):
  models → store → views → programmatic xcodeproj → verify build → run tests.

The xcodeproj must be generated programmatically (no manual Xcode project wizard).
Use a NEW two-letter PBX ID prefix (do not use CT — reserved for Clarity Triage). Suggested: CX.

Wire local package ../clarity-ui as ClarityUI.

Start with: product/data model notes in HANDOFF if still TBD, then models → store → views → xcodeproj → build → test.
```

---

## After this file is filled in

Replace placeholder sections with real bundle ID, file tree, MVP checklist, and “done when” rows — same style as `portfolio/clarity-triage-ios/HANDOFF.md` after Phase 2.
