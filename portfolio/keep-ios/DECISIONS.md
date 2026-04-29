# Decisions — Keep (iOS)

> Architecture and design decisions for this app.
> Each entry records what was decided, why, and what was considered.
> Read alongside LEARNINGS.md (what went wrong) and CHANGELOG.md (what shipped).
>
> See also: `/PATTERNS.md` (reusable code recipes) at repo root.

---

## 2026-04-29 — Storage: @Observable + Codable + UserDefaults (not SwiftData)

**Decision:** Use `@Observable @MainActor KeepStore` with a single `KeepBlob: Codable` struct serialized to one UserDefaults key (`chase_keep_ios_v1`).

**Considered:**
- SwiftData (scaffolded by `scripts/new-app`) — relational, ModelContainer, automatic migrations
- Core Data — mature but heavyweight
- `@Observable` + Codable + UserDefaults — portfolio-standard pattern (Unnamed, Fairway, Ash Reader)

**Why this:**
- Every other iOS app in the portfolio uses this pattern — consistency > novelty
- Zero external dependencies; the whole data model is plain Swift structs
- Easy to inspect (dump UserDefaults key to see the full state)
- Simpler to add new fields safely: `decodeIfPresent` + one backward-compat test
- Data size: home inventory items + photo *references* (UUIDs) are small; no relational query perf needed

**Trade-off accepted:** If the data grows into tens of thousands of items with complex queries, UserDefaults would become a bottleneck. Phase 2 could migrate to SwiftData. For V1 use cases (one house, ~500 items max), this is fine.

> **Chase:** —

---

## 2026-04-29 — Photos: filesystem (Documents/keep-photos/), not in the blob

**Decision:** Store photos as JPEG files at `Documents/keep-photos/<uuid>.jpg` via `PhotoStore`. Items store only a `UUID?` reference (`photoID`).

**Considered:**
- Store raw `Data` in the Codable blob — simple but ~1-2MB per photo × many items = UserDefaults explosion
- Core Data Binary Large Object — overkill for this stack
- Filesystem via `PhotoStore` — same pattern used in Fairway iOS

**Why this:**
- UserDefaults has a practical limit of ~1MB per key (undocumented but real); raw photo Data would blow it immediately
- File references are tiny; blob stays small and fast to serialize
- Photos are deletable independently (when item is deleted, photo is deleted)
- Follows `portfolio/fairway-ios/Fairway/Services/PhotoStore.swift` exactly

**Quality ladder:** `PhotoStore.save()` walks quality from 0.8 → 0.4 → 0.2 → 0.05 until the JPEG is ≤500KB, balancing quality against storage.

> **Chase:** —

---

## 2026-04-29 — Coach threshold: 3 consecutive Unsure (not cumulative)

**Decision:** `CoachSheet` appears after 3 **consecutive** Unsure decisions in a single triage session. The streak resets on any Keep/Donate/Toss decision.

**Considered:**
- Cumulative Unsure count (total Unsure across the session) — triggers even if user is making progress
- 3 consecutive — triggers only when user is genuinely stuck on a run of items
- User-configurable threshold — YAGNI for V1

**Why this:**
- Consecutive is the right signal for "stuck" — a user who triages 10 items successfully and then hits 3 Unsure in a row needs a nudge; a user who scattered 3 Unsure across 20 items is fine
- The coach is a *soft suggestion* — it asks 3 questions and suggests Keep or Let Go but doesn't force a decision. Low friction matters for ADHD users
- `KeepConfig.coachThreshold = 3` makes it trivially changeable without magic numbers

> **Chase:** —

---

## 2026-04-29 — Name: "Keep"

**Decision:** App is named **Keep**.

**Considered:** Shed, Zone, Stash, Sort, Purge, Clear, Nest, Haven, Anchor, Vault

**Why this:** Works on two levels simultaneously:
1. *"Do I keep this?"* — the triage verb, the question asked for every item
2. *"The Keep"* — a fortress keep, the innermost stronghold, what you protect and value

The name is one word, positive, and implies both the act of deciding and the destination of kept items. "Shed" felt too negative (associated with getting rid of things), "Zone" too generic, "Stash" too casual.

> **Chase:** —
