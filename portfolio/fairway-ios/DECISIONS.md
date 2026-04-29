# Decisions — Fairway iOS

> Architecture and design decisions for this app.
> Each entry records what was decided, why, and what was considered.
> Read alongside LEARNINGS.md (what went wrong) and CHANGELOG.md (what shipped).
>
> See also: `/PATTERNS.md` (reusable code recipes) at repo root.

---

## 2026-04-18 — @Observable + Codable blob over SwiftData

**Context:** Fairway tracks 4 zones, ~20 sprinkler heads, and ~20 problems. Needed a persistence strategy that handles schema evolution without crashes.

**Options considered:**
1. **SwiftData with VersionedSchema + MigrationPlan** — Apple-native, relational, but migration crashes on schema mismatch are catastrophic
2. **@Observable + Codable blob in UserDefaults** — Lightweight, single JSON document, `decodeIfPresent` for new fields

**Decision:** @Observable + Codable blob — total data is trivially small and fits in UserDefaults.

**Why:** Adding fields is simple (`var newField: String = ""`); no migration crashes. SwiftData's VersionedSchema adds significant complexity for a dataset that never needs relational queries. All other portfolio iOS apps use this pattern, so it's a known quantity.

**Revisit when:** Data exceeds ~1MB or needs relational queries (e.g., cross-zone analytics).

> **Chase:**

---

## 2026-04-27 — Open-Meteo API over WeatherKit

**Context:** Fairway needed soil temperature data at 6cm depth to show optimal overseeding windows.

**Options considered:**
1. **Apple WeatherKit** — Native, but requires `com.apple.developer.weatherkit` entitlement and provisioning
2. **Open-Meteo** — Free, no API key, returns soil temperature at 6cm depth (not available from WeatherKit)

**Decision:** Open-Meteo — free, no provisioning, and has the exact data we need.

**Why:** Portfolio apps build with `CODE_SIGNING_ALLOWED=NO` for simulator testing; WeatherKit can't work without entitlement provisioning. Open-Meteo returns soil temp at 6cm (WeatherKit doesn't), is HTTPS-only, and works with async/await URLSession. Wrapped in `OpenMeteoDTO` namespace to isolate wire format.

**Revisit when:** WeatherKit adds soil temperature data AND the app moves to App Store distribution with full provisioning.

> **Chase:**

---

## 2026-04-25 — KML reimport: split tooling and app-side into separate sessions

**Context:** Adding new zone/head data from KML files required both Python tooling (parsing, photo downloads) and Swift changes (seed data, migrations).

**Options considered:**
1. **Single session for both** — do everything at once
2. **Split: tooling first, app-side second** — two focused sessions

**Decision:** Split into two sessions — tooling in session 1, Swift in session 2.

**Why:** First half produces ~50 photo downloads and burns context on file operations. Second half needs clean context for code edits and `xcodebuild test` verification. Different verification needs (shell + Python vs Xcode tests).

**Revisit when:** N/A — one-time workflow decision, but the principle applies to any mixed shell+code task.

> **Chase:**

---

## 2026-04-27 — NavigationLink registration at NavigationStack parent

**Context:** AlertRow subviews had `.navigationDestination` modifiers that were silently ignored by SwiftUI.

**Options considered:**
1. **`.navigationDestination` on subviews** — seems logical, but SwiftUI silently ignores it
2. **`.navigationDestination` on ScrollView inside the NavigationStack root** — works correctly

**Decision:** Place `.navigationDestination` at or above the NavigationStack root view, never on subviews.

**Why:** SwiftUI silently ignores `.navigationDestination` in subviews — no error, no warning, just doesn't navigate. This is a framework behavior, not a bug.

**Revisit when:** N/A — this is a SwiftUI framework constraint, unlikely to change.

> **Chase:**
