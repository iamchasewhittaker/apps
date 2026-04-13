# LEARNINGS — Clarity Time (iOS)

> Append after anything surprising in build, test, or App Store prep.

## 2026-04-12 — Phase 3 scaffold

- **`xcodebuild test` + pipe:** piping `xcodebuild test` to `tail` buffers until the command finishes — use a log file or `tee` if you need live progress.
- **Concurrent `xcodebuild`:** two processes sharing the same DerivedData path can hit `build.db` locked; use a fresh `-derivedDataPath` or stop overlapping builds.
- **Simulator:** use `-showdestinations` when `iPhone 16` (or another name) is missing on the host; `CODE_SIGNING_ALLOWED=NO` requires a **simulator** destination.
