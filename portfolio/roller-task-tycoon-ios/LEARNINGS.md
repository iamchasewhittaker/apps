# Learnings — RollerTask Tycoon (iOS)

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.

---

## Format

```
### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | xcode | git | data-loss | swift | api | ...
```

---

## Entries

### 2026-04-14 — `CODE_SIGNING_ALLOWED=NO` build doesn't install on device
**What happened:** Ran `xcodebuild build … CODE_SIGNING_ALLOWED=NO` to verify the build after swapping the AppIcon, confirmed `BUILD SUCCEEDED`, but the new icon was not on the phone — the old one was still there.
**Root cause:** `CODE_SIGNING_ALLOWED=NO` skips code signing and produces a build that cannot be installed on a physical device. It's a compile check only, not a device build.
**Fix / lesson:** Use `-allowProvisioningUpdates` (not `CODE_SIGNING_ALLOWED=NO`) for any build meant for a real device. Reserve the no-sign flag purely for CI compile verification. Always follow with `xcrun devicectl device install app` to confirm the new asset is actually on the phone.
**Tags:** xcode, gotcha, device-install

### 2026-04-14 — `qlmanage` is the right tool for SVG → PNG on macOS
**What happened:** Needed a 1024×1024 PNG from a text-based SVG logo; tried PIL but it has no native SVG renderer.
**Root cause:** PIL doesn't support SVG — it would require `cairosvg` or `rsvg`. macOS has `qlmanage` built in which uses the system Quick Look renderer (same engine as Finder previews) and handles SVG perfectly.
**Fix / lesson:** For SVG → PNG on macOS: `qlmanage -t -s 1024 -o /tmp logo.svg` → produces `logo.svg.png`. Then use `sips` to resize. No extra dependencies needed.
**Tags:** gotcha, tooling, assets

### 2026-04-11 — Code lost after accidental Xcode deletion
**What happened:** Code was accidentally deleted in Xcode with no recent commit to recover from. Recovery required reverting to an older version, losing recent work.
**Root cause:** No habit of committing before manual editing sessions. Xcode's undo does not survive file closes or app restarts, and there was no git safety net.
**Fix / lesson:** Always run `checkpoint` in Terminal before opening Xcode to edit. The checkpoint + restore system was created specifically because of this incident. One command saves everything.
**Tags:** data-loss, xcode, git


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
