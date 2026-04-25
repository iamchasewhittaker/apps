# LEARNINGS — Clarity Time (iOS)

> Append after anything surprising in build, test, or App Store prep.

## 2026-04-12 — Phase 3 scaffold

- **`xcodebuild test` + pipe:** piping `xcodebuild test` to `tail` buffers until the command finishes — use a log file or `tee` if you need live progress.
- **Concurrent `xcodebuild`:** two processes sharing the same DerivedData path can hit `build.db` locked; use a fresh `-derivedDataPath` or stop overlapping builds.
- **Simulator:** use `-showdestinations` when `iPhone 16` (or another name) is missing on the host; `CODE_SIGNING_ALLOWED=NO` requires a **simulator** destination.


---

## 2026-04-25 — iOS 17.2 runtime DMG (shared across all iOS apps)

**The iOS 17.2 simulator runtime DMG unmounts on every reboot.**
actool (invoked by every `xcodebuild` call, even for device targets) looks up the runtime at:
`/Library/Developer/CoreSimulator/Volumes/iOS_21C62/Library/Developer/CoreSimulator/Profiles/Runtimes/iOS 17.2.simruntime`
If the DMG is not mounted, actool fails with a runtime-not-found error and the build fails.

Run this once per session before any `xcodebuild` call:
```bash
sudo hdiutil attach \
  /Library/Developer/CoreSimulator/Images/B3B0953C-8EEB-4DF1-8149-B9770CC90CC7.dmg \
  -mountpoint /Library/Developer/CoreSimulator/Volumes/iOS_21C62 \
  -readonly -noverify
```

The SDK plist patch (`iPhoneSimulator17.2.sdk SystemVersion.plist ProductBuildVersion = 21C62`) is **persistent** — no re-run after reboot. Only the DMG mount is needed each session. Full diagnostic trail: `portfolio/unnamed-ios/LEARNINGS.md` (2026-04-24 and 2026-04-25).
