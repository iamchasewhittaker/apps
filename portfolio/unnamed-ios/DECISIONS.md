# Decisions — Unnamed iOS

> Architecture and design decisions for this app.
> Each entry records what was decided, why, and what was considered.
> Read alongside LEARNINGS.md (what went wrong) and CHANGELOG.md (what shipped).
>
> See also: `/PATTERNS.md` (reusable code recipes) at repo root.

---

## 2026-04-17 — Hand-crafted .xcodeproj without xcodegen

**Context:** Needed an Xcode project for the Unnamed daily OS app. xcodegen wouldn't install on macOS 13 + Xcode 15.3.

**Options considered:**
1. **xcodegen** — standard scaffolding tool, but installation failed on this macOS version
2. **Hand-crafted `project.pbxproj`** — manual but guaranteed to work

**Decision:** Hand-crafted pbxproj — adapted from `clarity-checkin-ios` template with sequential `UN*` UUIDs.

**Why:** xcodegen has macOS compatibility issues on 13.x. Adapting an existing project template was faster and more reliable. The 4-step file addition pattern (PBXBuildFile, PBXFileReference, PBXGroup, PBXSourcesBuildPhase) is documented in PATTERNS.md.

**Revisit when:** macOS upgrades fix xcodegen compatibility, or Swift Package Manager replaces the need for .xcodeproj entirely.

> **Chase:**

---

## 2026-04-17 — @Observable + Codable with nonisolated init()

**Context:** Needed a store pattern that works with `@State private var store = AppStore()` in the SwiftUI App struct.

**Options considered:**
1. **Standard `@Observable` with default init** — may have MainActor init overhead
2. **`nonisolated init()`** — zero-cost initialization, clean `@State` usage

**Decision:** nonisolated init() — avoids MainActor overhead for store initialization.

**Why:** Zero-cost pattern; `@State` in the App struct works cleanly. Same pattern used across all portfolio iOS apps.

**Revisit when:** N/A — this is the standard portfolio pattern.

> **Chase:**

---

## 2026-04-17 — No ClarityUI package dependency (inlined StorageHelpers)

**Context:** StorageHelpers is ~15 lines of code. Needed to decide between importing it via ClarityUI SPM package or inlining.

**Options considered:**
1. **ClarityUI SPM package** — shared code, but adds `XCLocalSwiftPackageReference` complexity to hand-crafted pbxproj
2. **Inline ~15 lines** — duplicated but zero setup complexity

**Decision:** Inline — `Services/StorageHelpers.swift` contains the ~15 lines directly.

**Why:** Adding SPM dependencies to a hand-crafted pbxproj is fragile. 15 lines of code doesn't justify the dependency overhead. If the shared code grows beyond 50 lines, reconsider.

**Revisit when:** StorageHelpers exceeds 50 lines or needs changes that affect multiple apps.

> **Chase:**

---

## 2026-04-25 — Visible edit/delete buttons over swipeActions

**Context:** InboxRowView needs edit and delete controls for captured items.

**Options considered:**
1. **SwiftUI `.swipeActions`** — native pattern, but invisible (no affordance)
2. **Visible pencil/trash button columns** — always visible, explicit tap targets

**Decision:** Visible buttons — pencil and trash columns shown in every row.

**Why:** Swipe actions require gesture knowledge, have no visual affordance, and are unfriendly for low-vision users. User explicitly requested visible controls matching the web version.

**Revisit when:** N/A — this is a UX accessibility decision.

> **Chase:**

---

## 2026-04-25 — HStack column separation over ZStack layering

**Context:** Sort button + info button in SortView competed for touches when layered with ZStack.

**Options considered:**
1. **ZStack(alignment: .trailing)** — buttons overlap, compete for touch targets
2. **HStack with `.frame(maxWidth: .infinity)`** — each button gets its own non-overlapping space

**Decision:** HStack — stable, non-overlapping tap areas.

**Why:** ZStack buttons compete for touches — tapping near the boundary activates the wrong button. HStack gives each element a clean tap zone. Prefer stable visible targets.

**Revisit when:** N/A — HStack is strictly better for non-overlapping interactive elements.

> **Chase:**

---

## 2026-04-24 — DailyLock with explicit encode(to:) for legacy compatibility

**Context:** DailyLock model needed custom decoding for legacy data (`lane1`, `lane2` keys) while encoding only current fields.

**Options considered:**
1. **Synthesized Codable** — requires all CodingKeys cases to map to properties, breaks with legacy keys
2. **Custom `init(from:)` + explicit `encode(to:)`** — decodes legacy, encodes current

**Decision:** Custom both — `init(from:)` for legacy decoding, `encode(to:)` for current-only encoding.

**Why:** Synthesized `encode(to:)` requires all `CodingKeys` cases to map to properties. Legacy keys (`lane1`, `lane2`) don't have corresponding properties in the current model. Custom encoding avoids the crash.

**Revisit when:** All users have been migrated off legacy format (check UserDefaults for old keys).

> **Chase:**
