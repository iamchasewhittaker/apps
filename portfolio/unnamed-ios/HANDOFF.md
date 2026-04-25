# HANDOFF — Unnamed (iOS)

> Per-app session state. Update **State** when you stop. See repo-root [`HANDOFF.md`](../../HANDOFF.md) for multi-app context.

---

## State

| Field | Value |
|-------|-------|
| **Path** | `portfolio/unnamed-ios/` |
| **Focus** | **Phase 1 live on device — 7-day usage streak clock running.** |
| **Stack** | SwiftUI + iOS 17 + @Observable + UserDefaults + Codable |
| **Device** | iPhone 12 Pro Max · UDID `A0C65578-B1E0-4E96-A1EC-EEB8913BD11C` (iOS 26.4.1) |
| **Bundle ID** | `com.chasewhittaker.Unnamed` |
| **Last touch** | 2026-04-25 — UX parity with web: inbox edit/delete (`InboxRowView` + view/edit/confirmDelete modes), sort lane help sheet (`LaneHelpSheet` + ⓘ button), check clarification (`LockedLanesHeader` + reworded Q1/Q2 with helpers). New file `LockedLanesHeader.swift` registered in pbxproj. `BUILD SUCCEEDED`, installed + launched on device. |
| **Next** | Use the app for 7 consecutive days. Phase 2 planning starts after the streak. No new features until then. |

---

## Quick links

- [CLAUDE.md](CLAUDE.md) · [CHANGELOG.md](CHANGELOG.md) · [ROADMAP.md](ROADMAP.md) · [LEARNINGS.md](LEARNINGS.md)
- Web source of truth: [portfolio/unnamed/](../unnamed/)
- Session starter: [portfolio/unnamed/HANDOFF_IOS.md](../unnamed/HANDOFF_IOS.md)

---

## Fresh session prompt

```
Read /Users/chase/Developer/chase/CLAUDE.md and /Users/chase/Developer/chase/HANDOFF.md first,
then /Users/chase/Developer/chase/portfolio/unnamed-ios/CLAUDE.md and
/Users/chase/Developer/chase/portfolio/unnamed-ios/HANDOFF.md.

Goal: Phase 2 planning for Unnamed iOS (7-day streak ends ~2026-05-02).
Phase 1 is fully shipped — app is on device, all 5 flows working.

Machine constraints (for future builds):
- Intel 2017 MBP, macOS Ventura 13.7.8, Xcode 15.2
- iPhone on iOS 26.4.1 — use -target Unnamed -sdk iphoneos17.2 (bypasses destination resolver)
- Before each build session: sudo hdiutil attach
    /Library/Developer/CoreSimulator/Images/B3B0953C-8EEB-4DF1-8149-B9770CC90CC7.dmg
    -mountpoint /Library/Developer/CoreSimulator/Volumes/iOS_21C62 -readonly -noverify
  (DMG unmounts on reboot; SDK plist patch at ~/iPhoneSimulator17.2-SystemVersion.plist.bak
   is persistent — no need to re-patch)

Build + install commands:
  cd /Users/chase/Developer/chase/portfolio/unnamed-ios
  xcodebuild -target Unnamed -configuration Debug -sdk iphoneos17.2 -allowProvisioningUpdates build \
    2>&1 | tee /tmp/unnamed-build.log
  xcrun devicectl device install app \
    --device A0C65578-B1E0-4E96-A1EC-EEB8913BD11C \
    build/Debug-iphoneos/Unnamed.app
  xcrun devicectl device process launch \
    --device A0C65578-B1E0-4E96-A1EC-EEB8913BD11C \
    com.chasewhittaker.Unnamed

Phase 1 rule still active: NO new features until 7-day streak is confirmed.
```

---

## App overview

Native iOS port of the Unnamed daily OS web app. SwiftUI + @Observable + UserDefaults. No SwiftData, no external deps.

**5 flows:**
1. Capture → type text, add to inbox
2. Sort → one inbox item at a time, assign to lane
3. Today (lock) → pick 2 lanes, lock in for the day (irreversible until midnight)
4. Today (focus) → one active item at a time, Done/Skip
5. Check → "Did you finish at least one thing today?" + "Did your effort mostly stay in today's two lanes?" → Solid/Halfway/Rest (lanes shown as chips)

**4 lanes (fixed forever):** Regulation · Maintenance · Support Others · Future
