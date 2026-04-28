# Learnings — Clarity Command (iOS)

> Mistakes, fixes, and "aha" moments captured from real sessions.
> **AI tools:** read this at session start alongside CLAUDE.md for project-specific gotchas.

---

## Format

### YYYY-MM-DD — Short title
**What happened:** 1-2 sentences.
**Root cause:** The non-obvious part.
**Fix / lesson:** What to do differently.
**Tags:** gotcha | swift | xcode | accessibility | clarity-ui | ...

---

## Entries

### 2026-04-14 — @MainActor annotation required on view structs
**What happened:** Views with computed properties accessing the `@MainActor CommandStore` failed to compile with concurrency errors.
**Root cause:** Computed properties and private methods on view structs do not automatically inherit `@MainActor` isolation from the store — only `body` does. Swift 5.9+ strict concurrency enforces this.
**Fix / lesson:** Annotate the entire view struct with `@MainActor` when it has computed properties or helper methods that read from the store outside of `body`.
**Tags:** swift, concurrency, gotcha

### 2026-04-14 — ClaritySectionLabel unlabeled first parameter
**What happened:** Using `ClaritySectionLabel(text: "Header")` failed to compile.
**Root cause:** `ClaritySectionLabel` init uses an unlabeled first parameter: `init(_ text: String)`.
**Fix / lesson:** Always use `ClaritySectionLabel("Header")` — no argument label. Check ClarityUI source when unsure about init signatures.
**Tags:** clarity-ui, api

### 2026-04-14 — ClarityTypography has no bodyBold / captionBold
**What happened:** Attempted to use `ClarityTypography.bodyBold` and `ClarityTypography.captionBold` — neither exists.
**Root cause:** ClarityUI provides semantic font styles (`.body`, `.caption`, `.headline`, `.title`, etc.) but no bold variants as separate properties.
**Fix / lesson:** Use `.headline` for bold body-weight text, or apply `.bold()` modifier: `ClarityTypography.caption.bold()`. Do not assume bold variants exist.
**Tags:** clarity-ui, api

### 2026-04-14 — ClarityProgressBar requires labeled parameters
**What happened:** `ClarityProgressBar(0.75)` and `ClarityProgressBar("Label", 0.75)` both failed.
**Root cause:** The init signature requires explicit labels: `ClarityProgressBar(label: String, value: Double)`.
**Fix / lesson:** Always use `ClarityProgressBar(label: "Progress", value: fraction)` with both labels.
**Tags:** clarity-ui, api

### 2026-04-14 — String interpolation of enums needs String(describing:)
**What happened:** Interpolating a Swift enum value in a string (`"\(myEnum)"`) produced a compiler warning about non-sendable or ambiguous interpolation.
**Root cause:** Swift strict concurrency and string interpolation of non-String-conforming types triggers warnings.
**Fix / lesson:** Use `String(describing: myEnum)` or explicitly conform the enum to `CustomStringConvertible`.
**Tags:** swift, gotcha


---

### 2026-04-27 — Cross-app Supabase reads use the same RLS row, no schema change
**What happened:** Adding `LiveAppDataView` to show Job Search HQ + Wellness daily summaries on iOS.
**Root cause:** Originally I assumed I'd need either a new table or a Supabase view to expose cross-app data. Investigation showed the existing `user_data` table's RLS policy is `auth.uid() = user_id` — user-scoped, NOT app-scoped — which means any signed-in user can already read every row they own across all `app_key` values.
**Fix / lesson:** No SQL change needed. Just add a second/third REST GET with `app_key=eq.<other-app>` using the same anon key + bearer token. `CommandCloudSync.fetchAppData(appKey:token:)` is now the generic helper; `pullCrossAppSummaries` runs the two reads in parallel via `async let`. The same pattern works for any future cross-app read (Clarity Time, Budget, Growth).
**Tags:** supabase, rls, cross-app, gotcha-avoided

### 2026-04-27 — Web Phase 2 was fully coded but dormant
**What happened:** I budgeted hours for "build the Job Search HQ → Command bridge" only to discover Job Search HQ already pushes `job-search-daily` (App.jsx:304-315) and Wellness pushes `wellness-daily` (App.jsx:325-345), and Command web already pulls and renders them.
**Root cause:** A previous session shipped the writes + reads but the local `.env` files were never created, so dev sync never fired and the production deploy of Command was removed before anyone saw the live panel work.
**Fix / lesson:** Always check Supabase directly (`SELECT app_key, updated_at FROM user_data WHERE app_key IN (...)`) before assuming a feature isn't built. Saved hours of rebuild work. The .env files are now in place for `clarity-command`, `job-search-hq`, `wellness-tracker`.
**Tags:** verification, dont-rebuild

### 2026-04-27 — Pull was never auto-triggered on app launch
**What happened:** With cross-app reads added, I noticed Command iOS only pulled when the user manually tapped Settings → Pull from cloud, or right after OTP verification.
**Root cause:** `CommandCloudSync.pull(into:)` was wired but never invoked at startup. `ClarityCommandApp.onAppear` only loaded local state.
**Fix / lesson:** Added `.task { await commandSync.bootstrapSession(); if signedIn { await commandSync.pull(into: store) } }` to the root `WindowGroup` content. Cross-app data now refreshes on every cold launch without user action.
**Tags:** lifecycle, sync, ux

---

### 2026-04-28 — `nonisolated init()` on `@MainActor @Observable` class is a Swift 6 error
**What happened:** `CommandStore` showed 10 "Cannot access property '_X' in non-isolated initializer; this is an error in Swift 6" warnings across all stored properties.
**Root cause:** The class is `@Observable @MainActor`, making every stored property MainActor-isolated. An explicit `nonisolated init() {}` promises Swift the init can run off-actor, but the property default expressions (`.init()`, `Calendar.current.component`, etc.) all require MainActor. Swift 5.10+ flags this as a future error.
**Fix / lesson:** Remove `nonisolated` — a bare `init()` inherits the class's `@MainActor` isolation. The only construction site is `@State private var store = CommandStore()` in `ClarityCommandApp`, which is already MainActor (App body is MainActor in iOS 17+). The same `nonisolated init()` pattern exists in all 5 sibling Clarity iOS stores (`CheckinStore`, `TriageStore`, `TimeStore`, `GrowthStore`) — fix each when that app is next opened.
**Tags:** swift, concurrency, swift6, gotcha

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
