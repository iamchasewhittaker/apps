# Learnings — Keep (iOS)

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.
> **Chase:** append an entry any time something goes wrong or clicks.
>
> See also: `DECISIONS.md` (architecture choices) in this app, `/PATTERNS.md` (reusable recipes) at repo root.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences describing the problem or discovery.
**Root cause:** Why it happened — the non-obvious part.
**Fix / lesson:** What was done, or what to do differently next time.
**Tags:** gotcha | react | swift | python | git | deploy | supabase | ...

---

## Entries

### 2026-04-29 — `nonisolated init()` breaks @MainActor property assignment
**What happened:** `KeepStore.init()` was marked `nonisolated` (copied from a template), causing a compile error: "main actor-isolated property 'blob' can not be mutated from a non-isolated context."
**Root cause:** A `nonisolated` init runs outside the actor's isolation, so it can't write to `@MainActor`-isolated stored properties.
**Fix / lesson:** Remove `nonisolated` from `init()`. The store is always created on `@MainActor` anyway — `nonisolated` was unnecessary cargo-culted from a pattern that needed it for a different reason.
**Tags:** swift | gotcha | concurrency

---

### 2026-04-29 — `@State private var store = KeepStore()` fails without `@MainActor` on App struct
**What happened:** After removing `nonisolated` from `KeepStore.init()`, KeepApp got a new error: "call to main actor-isolated initializer 'init()' in a synchronous nonisolated context."
**Root cause:** `struct KeepApp: App` is not `@MainActor` by default. `@State private var store = KeepStore()` is evaluated in a nonisolated context at init time, which can't call a `@MainActor`-isolated initializer.
**Fix / lesson:** Add `@MainActor` to the App struct itself. This propagates actor isolation to the entire struct, so `KeepStore()` becomes callable. Same pattern used in Unnamed iOS.
**Tags:** swift | gotcha | concurrency

---

### 2026-04-29 — `invalid redeclaration` from two methods with the same `(UUID) -> [Item]` signature
**What happened:** `KeepBlob` had `func items(for roomID: UUID)` and `func items(for spotID: UUID)` — same name, same signature, different internal variable names. Swift treats them as identical.
**Root cause:** Parameter labels (`for roomID:` vs `for spotID:`) look different in Swift call syntax but produce identical function signatures from the compiler's perspective when the external label is the same (`for:`).
**Fix / lesson:** Use distinct external labels: `itemsInRoom(_ roomID:)` and `itemsInSpot(_ spotID:)`. The underscore makes the label positional/unlabeled, and the distinct method name communicates intent clearly.
**Tags:** swift | gotcha

---

### 2026-04-29 — `UIImage` not in scope in KeepStore.swift
**What happened:** Compile error: "cannot find type 'UIImage' in scope" in KeepStore.swift — specifically in the `addItem(photo: UIImage?)` signature.
**Root cause:** `UIImage` is part of UIKit, which SwiftUI files don't import automatically. The compiler only brought in `SwiftUI`, not `UIKit`.
**Fix / lesson:** Add `import UIKit` at the top of any Swift file that references UIKit types (`UIImage`, `UIColor`, `UIViewController`, etc.) — even when the file primarily uses SwiftUI.
**Tags:** swift | gotcha

---

### 2026-04-29 — Scaffold generated SwiftData — but the portfolio uses @Observable + UserDefaults
**What happened:** `scripts/new-app` scaffolded a SwiftData template. SwiftData requires a `ModelContainer`, schema migrations, and a completely different storage pattern than every other iOS app in the portfolio.
**Root cause:** The scaffold template defaults to SwiftData (newer, first-class in Xcode 15). But the portfolio pattern established by Unnamed, Fairway, and Ash Reader uses `@Observable @MainActor` + Codable + UserDefaults.
**Fix / lesson:** Always verify the generated stack against the portfolio pattern. For this app family: `@Observable` store, single `Codable` blob, one UserDefaults key, `decodeIfPresent` for backward compat. Never SwiftData unless a feature explicitly requires relational queries.
**Tags:** swift | architecture | gotcha

---

### 2026-04-29 — Device must be unlocked for xcodebuild install + test
**What happened:** `xcodebuild test` on a real device stalls/fails at the install step if the iPhone is locked (screen off / passcode required).
**Root cause:** iOS requires the device to be unlocked to allow an app install from a development machine. The `MICodeSigningVerifier` / install step silently hangs or errors out.
**Fix / lesson:** Before running `xcodebuild test ... -destination 'platform=iOS,id=...'`, **unlock the iPhone first**. Keep it awake during the build. Once installed, the app persists and subsequent test runs don't require unlocking unless the device reboots.
**Tags:** swift | device | gotcha

> **Chase:** "I need to make sure my iPhone is unlocked"
