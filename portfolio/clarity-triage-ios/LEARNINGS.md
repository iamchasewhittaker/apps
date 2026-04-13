# Learnings — Clarity Triage (iOS)

## 2026-04-12 — Phase 2 ship

- **`xcodebuild` destination matters:** `name=iPhone 16` is not present on every Mac; use `xcodebuild -scheme ClarityTriage -showdestinations` and pick an installed simulator (here: **iPhone 15, OS=17.2**). Using a generic simulator name can resolve to a **physical** `iphoneos` device and then `CODE_SIGNING_ALLOWED=NO` fails at install with “No code signature found.”
- **Slot model:** MVP counts **size-weighted** slots (quick=1, short=2, medium=3) against the day’s capacity total — aligns “filter tasks that fit” with energy budgeting better than raw task count alone.
- **ClarityUI consumer path:** From `portfolio/clarity-triage-ios/`, local package reference in `project.pbxproj` is `relativePath = "../clarity-ui"` (sibling under `portfolio/`), same as Check-in.
