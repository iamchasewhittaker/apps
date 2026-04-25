# Learnings — Clarity Triage (iOS)

## 2026-04-12 — Phase 2 ship

- **`xcodebuild` destination matters:** `name=iPhone 16` is not present on every Mac; use `xcodebuild -scheme ClarityTriage -showdestinations` and pick an installed simulator (here: **iPhone 15, OS=17.2**). Using a generic simulator name can resolve to a **physical** `iphoneos` device and then `CODE_SIGNING_ALLOWED=NO` fails at install with “No code signature found.”
- **Slot model:** MVP counts **size-weighted** slots (quick=1, short=2, medium=3) against the day’s capacity total — aligns “filter tasks that fit” with energy budgeting better than raw task count alone.
- **ClarityUI consumer path:** From `portfolio/clarity-triage-ios/`, local package reference in `project.pbxproj` is `relativePath = "../clarity-ui"` (sibling under `portfolio/`), same as Check-in.


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
