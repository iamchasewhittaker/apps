# LEARNINGS — Clarity Budget (iOS)

## Swift 6 / MainActor

- `@Observable @MainActor` store methods called from helper views (e.g. a `private func` that returns `Button { … store.mutate() }`) can trigger **“call to main actor-isolated instance method in a synchronous nonisolated context”**. Fix: mark the SwiftUI view `@MainActor` (see `WantsTrackerView`, `BudgetScenariosView`, `ContentView`).

## Simulator / CI

- `xcodebuild test` needs a bootable Simulator. If CoreSimulator / `launchd_sim` fails, `build` can still succeed — retry locally or pick another destination from `-showdestinations`.

## YNAB

- **Separate PAT / Keychain from YNAB Clarity iOS:** this app uses `BudgetYNABKeychain` service `com.chasewhittaker.ClarityBudget`. Do not read the other app’s token; users can create two tokens in YNAB Developer settings for independent revoke.
