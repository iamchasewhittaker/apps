# Learnings — Clarity Check-in (iOS)

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences.
**Root cause:** The non-obvious part.
**Fix / lesson:** What to do differently.
**Tags:** gotcha | swift | xcode | accessibility | ...

---

## Entries

### 2026-04-14 — Suite-wide icon docs drift
**What happened:** `SESSION_START_CLARITY_IOS_LOGOS` still read like “ship the four apps” after icons already existed.
**Root cause:** Session template was not retargeted to **fix/iterate** once the suite shipped.
**Fix / lesson:** Keep **`docs/design/README.md`** + **`SESSION_START_CLARITY_IOS_LOGOS`** in sync with shipped glyphs; root **`HANDOFF`** / **`CLAUDE`** portfolio table should list **`docs/BRANDING` + AppIcon** for every Clarity iOS row.
**Tags:** docs, branding

### 2026-04-13 — Portfolio branding template (`docs/BRANDING.md`)
**What happened:** Branding rules were easy to repeat in every new chat or app.
**Root cause:** Specs lived only in monorepo `docs/design/` without a **per-app** hub and no copy-paste template.
**Fix / lesson:** Copy **`docs/templates/PORTFOLIO_APP_BRANDING.md`** → app `docs/BRANDING.md`, fill once, link from `CLAUDE.md`; session templates tell agents to read `docs/BRANDING.md` instead of re-pasting hex codes.
**Tags:** docs, branding

### 2026-04-13 — Squaring wide app-icon mockups with `sips`
**What happened:** A wide marketing mockup (1376×768) needed to become a **1024×1024** `AppIcon.png` for Xcode’s single-size slot.
**Root cause:** `sips -p` pads to square using **black** by default, which clashes with a light presentation field.
**Fix / lesson:** Use `sips --padColor E6E7EB -p <W> <H> file.png` then `sips -z 1024 1024` — document in the shared icon spec. After icon changes, **delete the app from Simulator** before judging the result (SpringBoard caches icons).
**Tags:** xcode, design

### 2026-04-12 — @Observable binding pattern
**What happened:** `@Observable` stores don't use `@Published`. Views need `@Bindable var s = store` to get two-way bindings.
**Root cause:** iOS 17 `@Observable` macro changed the binding pattern from `ObservableObject`.
**Fix / lesson:** Always use `@Bindable var s = store` at the top of any view that needs `$store.property` bindings. Read-only views just use `store.property` directly.
**Tags:** swift, observable

### 2026-04-12 — FlowLayout is in ClarityUI
**What happened:** `FlowLayout` is defined in `ClarityMultiChip.swift` inside the ClarityUI package.
**Root cause:** It's internal to the component, but needed in Sections.swift for the meds chip display.
**Fix / lesson:** Import `ClarityUI` in any file that uses `FlowLayout` — it's public from the package.
**Tags:** swift, clarity-ui


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
