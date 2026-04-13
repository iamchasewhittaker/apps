# Handoff — Clarity Triage (iOS)

## Current status: Phase 2 — not started

- **Version:** v0.1 (planned)
- **Bundle ID:** `com.chasewhittaker.ClarityTriage`
- **Storage key:** `chase_triage_ios_v1`
- **Shared package:** `../clarity-ui` (local SPM dependency)

---

## Context for the next session

Phase 1 (Clarity Check-in) is complete and proven the pattern works:
- Source files written first, then `xcodeproj` generated programmatically
- ClarityUI linked as a local package via `relativePath = "../clarity-ui"` in `project.pbxproj`
- Swift 6 concurrency: `nonisolated init()` on stores, `@MainActor` on view structs/methods that access the store outside `body`

**Reference projects:**
- `portfolio/clarity-checkin-ios/` — complete Phase 1 app (copy xcodeproj structure, adapt IDs)
- `portfolio/clarity-ui/` — shared package (FlowLayout, ClarityCard, ClarityRating, ClarityMultiChip, etc.)
- `portfolio/wellness-tracker/src/tabs/TasksTab.jsx` — web reference for task/capacity/win logic

---

## MVP scope

### 1. Capacity picker (home screen)
Four capacity levels. Pick once per day; resets at midnight.

| Level | Label | Slots |
|-------|-------|-------|
| 1 | Survival Mode | 1 |
| 2 | Limited | 2 |
| 3 | Average | 3 |
| 4 | Strong | 5 |

### 2. Task list
- Add task: title, category, size
- Categories: Job Search, Home & Family, Health, Financial, Other
- Sizes: Quick (≤15 min), Short (≤45 min), Medium (≤2 hr)
- Mark complete / delete
- Filter to show only tasks that fit remaining capacity slots

### 3. Ideas pipeline
Three stages (capture → pressure test → explore). Each idea has: title, stage, optional note.
- Swipe/button to advance stage
- Delete from any stage

### 4. Win logger
Eight win categories: Task, OCD, Present, Health, Brave, Job, Calm, Other.
Log a win: pick category + optional note. Wins stored in the blob, shown as a today list.

---

## Data model

```swift
// TriageBlob.swift
struct TriageBlob: Codable {
    var capacity: Int = 0           // 0 = not set, 1-4 = level
    var capacityDate: String = ""   // ISO date string — reset if stale
    var tasks: [TriageTask] = []
    var ideas: [TriageIdea] = []
    var wins: [TriageWin] = []
}

struct TriageTask: Codable, Identifiable {
    var id: String = UUID().uuidString
    var title: String
    var category: String            // "job" | "home" | "health" | "financial" | "other"
    var size: String                // "quick" | "short" | "medium"
    var isComplete: Bool = false
    var createdDate: String
}

struct TriageIdea: Codable, Identifiable {
    var id: String = UUID().uuidString
    var title: String
    var stage: Int = 0              // 0 = capture, 1 = pressure test, 2 = explore
    var note: String = ""
    var createdDate: String
}

struct TriageWin: Codable, Identifiable {
    var id: String = UUID().uuidString
    var category: String            // "task" | "ocd" | "present" | "health" | "brave" | "job" | "calm" | "other"
    var note: String = ""
    var date: String
    var timestamp: Int64
}
```

## File structure

```
ClarityTriage/
  ClarityTriageApp.swift
  Models/
    TriageBlob.swift
  Services/
    TriageConfig.swift     — keys enum + capacity slot table + category/size constants
    TriageStore.swift      — @Observable @MainActor store
  Constants/
    Quotes.swift           — triageQuotes (productivity, focus, execution themes)
  Views/
    ContentView.swift      — TabView: Tasks | Ideas | Wins
    Tasks/
      CapacityPickerView.swift
      TaskListView.swift
      AddTaskView.swift    — sheet
    Ideas/
      IdeasView.swift      — 3-column pipeline or staged list
    Wins/
      WinLoggerView.swift
      AddWinView.swift     — sheet
    Components/
      CapacityBadge.swift
ClarityTriageTests/
  TriageBlobTests.swift
```

## Store pattern (same as Check-in)

```swift
@Observable @MainActor
final class TriageStore {
    private(set) var blob: TriageBlob = .init()

    nonisolated init() {}

    func load() { blob = StorageHelpers.load(TriageBlob.self, key: TriageConfig.storeKey) ?? .init() }
    func save() { StorageHelpers.save(blob, key: TriageConfig.storeKey) }

    var slotsUsed: Int { blob.tasks.filter { !$0.isComplete }.count }
    var slotsAvailable: Int { max(0, TriageConfig.slots(for: blob.capacity) - slotsUsed) }

    func addTask(_ task: TriageTask) { blob.tasks.insert(task, at: 0); save() }
    func completeTask(_ id: String) { /* toggle isComplete */ }
    func deleteTask(_ id: String) { /* remove */ }
    func advanceIdea(_ id: String) { /* stage + 1, max 2 */ }
    func logWin(category: String, note: String) { /* insert TriageWin */ }
}
```

## xcodeproj generation

Follow the exact same pattern as `clarity-checkin-ios/ClarityCheckin.xcodeproj/project.pbxproj`:
- Use `CT` prefix for IDs (ClarityTriage)
- `relativePath = "../clarity-ui"` for XCLocalSwiftPackageReference
- `DEVELOPMENT_TEAM = 9XVT527KP3`
- `PRODUCT_BUNDLE_IDENTIFIER = com.chasewhittaker.ClarityTriage`
- `INFOPLIST_KEY_CFBundleDisplayName = "Clarity Triage"`
- Same build settings (iOS 17, Swift 5.0, GENERATE_INFOPLIST_FILE = YES)

## Swift 6 concurrency — apply from day one

- `nonisolated init()` on TriageStore
- `@MainActor` on any view struct that has computed properties accessing the store
- `@MainActor` on any private func in a view that calls store methods

## Quotes (productivity / execution themes)

File: `Constants/Quotes.swift`, exported as `triageQuotes: [ClarityQuote]`

Suggested themes (36 total):
- Execution / ship it (8)
- Focus / single-tasking (8)
- Discipline / habit (7)
- Priority / saying no (7)
- Progress / momentum (6)

## Done when

- [ ] Capacity picker sets level, persists, resets next day
- [ ] Add task → appears in filtered list → mark complete removes from active
- [ ] Capacity slots count down as tasks added
- [ ] Add idea → advance through 3 stages → delete
- [ ] Log win → appears in today's wins list
- [ ] Daily quote shows on home/tasks screen
- [ ] `xcodebuild build` clean
- [ ] `xcodebuild test` all pass

---

## Session start prompt

Paste this at the start of the next Claude Code session:

```
Read CLAUDE.md and HANDOFF.md first.

Goal: Build Phase 2 — Clarity Triage iOS app at portfolio/clarity-triage-ios/.

Follow the exact same structure and pattern as portfolio/clarity-checkin-ios/ (Phase 1, complete).
Reference: portfolio/clarity-triage-ios/HANDOFF.md for full MVP scope, data model, file structure, and xcodeproj instructions.

The xcodeproj must be generated programmatically (same as Phase 1 — no manual Xcode step).
Use CT prefix for pbxproj IDs.

Start with: models → store → views → xcodeproj → verify build → run tests.
```
