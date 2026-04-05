# Backlog — RollerTask Tycoon (iOS)

Park-specific; canonical blank: `docs/ios-app-starter-kit/BACKLOG.md`.

**Linear:** [Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e) — execution lives in issues; keep this file in sync when scope changes.

| Issue | Title |
|-------|--------|
| [WHI-15](https://linear.app/whittaker/issue/WHI-15) | JSON backup import / restore |
| [WHI-16](https://linear.app/whittaker/issue/WHI-16) | Pixel font + optional background art |
| [WHI-17](https://linear.app/whittaker/issue/WHI-17) | Widgets / Siri |
| [WHI-18](https://linear.app/whittaker/issue/WHI-18) | Cloud sync |
| [WHI-19](https://linear.app/whittaker/issue/WHI-19) | TestFlight / App Store hardening |

## Status legend

Not Started | In Progress | Blocked | In Review | Done

---

### Title: JSON backup import / restore

**Description:** Replace-all import from `RollerTaskTycoon-backup-*.json` (or legacy `ParkChecklist-backup-*.json` if user still has old exports), `schemaVersion` 1 only, confirmed by user. **Linear:** [WHI-15](https://linear.app/whittaker/issue/WHI-15).

**Acceptance criteria:**

- Reject unknown `schemaVersion` with clear message.
- Destructive **replace** confirmed before writes.
- Import reflected in checklist; CHANGELOG + tests for decode path.

**Status:** Done (merge mode deferred)

---

### Title: Pixel font (OFL) + optional background art

**Description:** Add licensed pixel font and optional subtle park/grass background; respect **readable fonts** toggle.

**Acceptance criteria:**

- Font licensed (OFL) and credited in app or README.
- Toggle still switches to system-readable fonts.
- No layout regressions on small devices.

**Dependencies:** Asset selection.

**Estimate:** M

**Status:** Not Started

---

### Title: Widgets / Siri — open task count or quick add

**Description:** Widget showing open count and/or Siri shortcut to add task.

**Acceptance criteria:**

- Widget updates when tasks change (within system limits).
- Siri phrase documented; errors handled gracefully.

**Dependencies:** App Groups or shared container decision.

**Estimate:** L

**Status:** Not Started

---

### Title: Cloud sync (CloudKit or portfolio-aligned backend)

**Description:** Multi-device sync with conflict strategy; product decision vs Supabase pattern used by web apps.

**Acceptance criteria:**

- Documented privacy + auth model.
- Conflict rules explicit; no silent overwrites.

**Dependencies:** Product approval; likely post-import.

**Estimate:** XL

**Status:** Not Started

---

### Title: TestFlight / App Store release hardening

**Description:** Follow [RELEASE_PLAN.md](RELEASE_PLAN.md); privacy manifest, icons, screenshots, App Store copy.

**Acceptance criteria:**

- Archive succeeds; internal TestFlight build smoke-tested.
- App Privacy answers match data collection (local-only baseline).

**Dependencies:** Apple Developer account, bundle ID, signing.

**Estimate:** M

**Status:** Not Started

---

## Done (reference)

- v1 scaffold: SwiftData checklist, templates, export, settings, layout polish (see [ROADMAP.md](../../ROADMAP.md)).
