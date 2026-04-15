# HANDOFF — Funded iOS

> Current session state for Claude Code / Cursor. Update before ending a session.

---

## State

| Field | Value |
|-------|-------|
| **Focus** | Stable v0.3 — rename Conto → Funded complete; AppIcon updated; installed on device |
| **Status** | v0.3 — `Funded.xcodeproj` builds; `FundedTests` pass; installed on iPhone 12 Pro Max |
| **Last touch** | 2026-04-15 — rename Conto → Funded; FUNDED AppIcon; reinstalled on device |
| **Next** | V1 backlog: Fund from Overview underfunded goals card (PATCH parity with Bills tab) |

---

## Deploy & test (CLI + device)

| Step | Command / action |
|------|------------------|
| **Simulator tests** | `xcodebuild test --scheme Funded -derivedDataPath /tmp/Funded-dd-test -destination 'platform=iOS Simulator,id=<iPhone 15 UDID>' -only-testing:FundedTests` — use a **separate** `-derivedDataPath` if Xcode GUI is also building (avoids `build.db` locked) |
| **Device build (no signing)** | `xcodebuild --scheme Funded -destination 'generic/platform=iOS' -configuration Debug build CODE_SIGNING_ALLOWED=NO` |
| **Physical install** | Open `Funded.xcodeproj` → select iPhone → Signing & Capabilities: Team + bundle `com.chasewhittaker.Funded` → **⌘R** |

### Optional: YNAB test budget

Create a **second budget** in the YNAB app/website; use the **same** Personal Access Token. In setup, pick the test budget on both **iOS** and **Web** when exercising Fund / PATCH / categorization so production category assignments stay untouched.

---

## What was done (this session — v0.3)

| Area | Detail |
|------|--------|
| **`CategoryOverride` model** | New SwiftData `@Model` — `payeeSubstring`, `ynabCategoryID`, `ynabCategoryName`, `createdAt`; registered in Schema in `FundedApp.swift` |
| **Learning system** | `BillsPlannerView` saves a `CategoryOverride` after each manual category assignment via `AssignCategorySheet`; future suggestions for that payee use the override at confidence 1.0 |
| **`CategorySuggestionEngine`** | 80+ `payeeRules` patterns; `suggest()` accepts `overrides: [CategoryOverride]` and checks them first; three-tier: overrides (1.0) → payeeRules (0.9) → flexible fallback (0.3) |
| **`PayeeDisplayFormatter`** | Known merchant map expanded from 17 → 70+ entries; `itemContextSubtitle` shows "No item details yet" universally (not Amazon-only) |
| **`BillsPlannerView`** | `@Query var overrides: [CategoryOverride]`; `@Environment(\.modelContext)`; passes overrides to suggestion engine; saves override on assignment |
| **`project.pbxproj`** | `CategoryOverride.swift` added to Models group + Sources build phase (IDs: `AC020000000000000000023` file ref, `AC010000000000000000023` build file) |

---

## Previous session (v0.2)

| Area | Detail |
|------|--------|
| **App icon** | `AppIcon.png` 1024×1024; `Contents.json` universal + `ios-marketing` |
| **PayeeDisplayFormatter** | Leading ACH / withdrawal / bill-pay noise stripping; initial merchant map (17 merchants) |
| **Adjust** | `GoalStatus.ynabCategoryID`; rows open `FundCategoryConfirmationSheet` → `fundCategory` |
| **Shared sheet** | `Views/Components/FundCategoryConfirmationSheet.swift`; Bills uses same component |
| **Theme / a11y** | Brighter `muted`, `supportingFont`; removed forced dark color scheme |
| **Tests** | `MetricsEngineTests` — payee + subtitle + `underfundedGoals` id |

---

## Notes

- **`CategoryOverride` matching** uses `payee.contains(override.payeeSubstring)` — the stored substring is the full lowercased raw payee name. This is intentionally broad (catches all future transactions from the same merchant) but could over-match if payee names are ambiguous. Tune via `category_overrides.yaml` on the Python side.
- **actool** may still warn about missing icon sizes (60×60@2x etc.) — build and tests succeed regardless.
- **Tests:** pass `-destination 'platform=iOS Simulator,id=…'` if a physical iPhone is connected and locked.
