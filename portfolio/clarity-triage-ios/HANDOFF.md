# Handoff — Clarity Triage (iOS)

## Current status: Phase 2 complete

- **Version:** v0.1
- **Last session:** 2026-04-13
- **Bundle ID:** `com.chasewhittaker.ClarityTriage`
- **Storage key:** `chase_triage_ios_v1`
- **Shared package:** `../clarity-ui` (local SPM — `ClarityUI`)
- **Branding / launcher:** [`docs/BRANDING.md`](docs/BRANDING.md) · shipped **`AppIcon.png`** (1024) from nested-chevron wide mockup [`docs/design/app-icon-mockup-wide.png`](docs/design/app-icon-mockup-wide.png) (+ `app-icon-mockup-explore-*.png` alternates). Shared rules: [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md).

### Build / test

- `ClarityTriage.xcodeproj` is **generated in-repo** (no manual Xcode project step). PBX object IDs use prefix **`CT`**.
- Verified with `xcodebuild` on **iPhone 15 (iOS 17.2) simulator** + `CODE_SIGNING_ALLOWED=NO`. This host does not list **iPhone 16** in `-showdestinations`; use an installed simulator name or add the iOS 18+ runtime in Xcode → Settings → Platforms.
- Checkpoint commit on `main`: `checkpoint (clarity-triage-ios) [2026-04-12 21:56]`

### Open project

```bash
open portfolio/clarity-triage-ios/ClarityTriage.xcodeproj
```

---

## What shipped (MVP)

| Area | Notes |
|------|--------|
| Capacity | Four levels (Survival → Strong), slots 1/2/3/5; persists with `capacityDate`; clears level when date rolls (calendar day via `DateHelpers.todayString`) |
| Tasks | Title, category, size; complete + delete; optional filter “only tasks that fit remaining **weighted** slots” |
| Slots | quick=1, short=2, medium=3 vs day capacity (see `TriageStore.slotsRequired`) |
| Ideas | Three stages; add, advance (cap stage 2), delete |
| Wins | Eight categories; optional note; “today” list by `date` |
| Quote | `triageQuotes` + `QuoteBanner` on Tasks tab |
| Tests | `ClarityTriageTests` — JSON round-trip, slot math, stage cap, date guard |

---

## Done when (checklist)

- [x] Capacity picker sets level, persists, resets next day
- [x] Add task → list → complete removes from active workload
- [x] Capacity slots reflect weighted task sizes
- [x] Ideas: add → advance → delete
- [x] Log win → today’s wins list
- [x] Daily quote on Tasks screen
- [x] `xcodebuild build` clean (simulator, no signing)
- [x] `xcodebuild test` pass (same)

---

## Store reference (actual implementation)

Slot usage is **not** raw incomplete-task count; it sums weighted slots per active task. See `TriageStore.swift`.

---

## Next (repo roadmap)

**Phase 3 — Clarity Time (iOS)** — ✅ shipped at `portfolio/clarity-time-ios/` (`CX*` PBX prefix). **Phase 4 — Clarity Budget** — `portfolio/clarity-budget-ios/` (when scaffolded): dual-scenario budget + wants; pick a **new** PBX prefix (not `CC`, `CT`, or `CX`).

---

## Session start prompt — **Triage maintenance only**

Paste when continuing **this** app (bugs, v0.2 polish):

```
Read CLAUDE.md and portfolio/clarity-triage-ios/CLAUDE.md first.

Goal: Work on Clarity Triage iOS at portfolio/clarity-triage-ios/.

Read portfolio/clarity-triage-ios/HANDOFF.md for shipped scope and verification notes.
Run checkpoint before edits; update CHANGELOG / ROADMAP / this HANDOFF when you stop.
```

For **Phase 3 (Clarity Time)**, use the prompt in `portfolio/clarity-time-ios/HANDOFF.md`.
