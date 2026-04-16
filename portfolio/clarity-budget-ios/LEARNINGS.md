# LEARNINGS — Clarity Budget (iOS)

## Swift 6 / MainActor

- `@Observable @MainActor` store methods called from helper views (e.g. a `private func` that returns `Button { … store.mutate() }`) can trigger **“call to main actor-isolated instance method in a synchronous nonisolated context”**. Fix: mark the SwiftUI view `@MainActor` (see `WantsTrackerView`, `BudgetScenariosView`, `ContentView`).

- **`@Observable` + `nonisolated init()`:** On a `@MainActor` class, `@Observable` synthesizes **MainActor-isolated** backing storage (`_blob`, `_ynabDashboardCache`, etc.). A **`nonisolated init()`** cannot initialize that storage and produces **“Cannot access property '…' here in non-isolated initializer”** (Xcode lists each `_…` property). **Fix:** use a normal `init()` (main-actor isolated). If you then get **“call to main actor-isolated initializer … in a synchronous nonisolated context”** on `@State private var store = BudgetStore()` in `@main struct …: App`, mark the app **`@MainActor`** (see `ClarityBudgetApp`). Avoid `MainActor.assumeIsolated` in `init` unless you truly construct off the main actor and redesign accordingly.

- **`@Observable` + inline property defaults:** If errors persist on `_ynab…` or other synthesized backing with a **non-isolated initializer**, **move inline defaults into `init()`** (`= BudgetBlobFactory.defaultBlob()`, `= false`, etc.) so every stored field is assigned inside the same `@MainActor` initializer. Inline defaults on the property lines can still be initialized in a phase Swift 6 treats as nonisolated for macro-expanded storage.

- **`@Observable` + several related optionals:** If Swift 6 still errors on **multiple** `_…` backings (e.g. YNAB error / snapshot / `Date?` only), **merge them into one `Equatable` struct** stored as a **single** property (see `BudgetYNABDashboardCache` on `BudgetStore`). Mutate via `var c = cache; …; cache = c` so Observation sees one property replace. Prefer **`@MainActor` before `@Observable`** on the type line (`@MainActor @Observable final class …`).

## Simulator / CI

- `xcodebuild test` needs a bootable Simulator. If CoreSimulator / `launchd_sim` fails, `build` can still succeed — retry locally or pick another destination from `-showdestinations`.

- **`launchd_sim` / “Clone 1 of iPhone 15” / “could not bind to session”:** Tests fail before any XCTest runs. **Recovery (usually enough):** quit Simulator and Xcode → `xcrun simctl shutdown all` → reopen Xcode and **Product → Clean Build Folder** → rerun `xcodebuild test` (same destination as `CLAUDE.md`). **If it persists:** reboot the Mac (CoreSimulator often only clears after restart). Wiping `~/Library/Developer/Xcode/DerivedData/ClarityBudget-*` can help stale builds but **not** a broken `launchd_sim`.

## YNAB

- **Separate PAT / Keychain from YNAB Clarity iOS:** this app uses `BudgetYNABKeychain` service `com.chasewhittaker.ClarityBudget`. Do not read the other app’s token; users can create two tokens in YNAB Developer settings for independent revoke.

## Docs

- **v0.2 narrative** lives in `HANDOFF.md`, `MVP-AUDIT.md`, `ROADMAP.md` (v0.2 shipped section), and root `chase/HANDOFF.md` “continue Clarity Budget” prompt. Portfolio table: `chase/CLAUDE.md`; product line: `docs/governance/PRODUCT_LINES.md`; Change Log row: `chase/ROADMAP.md`.

- **`xcodebuild test` vs Issue Navigator:** Green CLI tests with a broken Simulator session can still leave **stale** Swift diagnostics in Xcode/Cursor — clean Derived Data + reload the editor; do not treat `launchd_sim` failures as type errors in `BudgetStore`.
