# HANDOFF — Unnamed (iOS)

> Per-app session state. Update **State** when you stop. See repo-root [`HANDOFF.md`](../../HANDOFF.md) for multi-app context.

---

## State

| Field | Value |
|-------|-------|
| **Path** | `portfolio/unnamed-ios/` |
| **Focus** | **v0.1 Phase 1 complete (2026-04-17).** All 5 flows built, 10/10 tests passing, installed and launched on iPhone 12 Pro Max. |
| **Stack** | SwiftUI + iOS 17 + @Observable + UserDefaults + Codable |
| **Device** | iPhone 12 Pro Max · UDID `A0C65578-B1E0-4E96-A1EC-EEB8913BD11C` |
| **Bundle ID** | `com.chasewhittaker.Unnamed` |
| **Last touch** | 2026-04-17 — Phase 1 built: all flows, tests pass, logo, installed on device. |
| **Next** | 1. Use it for 7 days — no features until then. 2. Phase 2 candidates in ROADMAP.md. |

---

## Quick links

- [CLAUDE.md](CLAUDE.md) · [CHANGELOG.md](CHANGELOG.md) · [ROADMAP.md](ROADMAP.md) · [LEARNINGS.md](LEARNINGS.md)
- Web source of truth: [portfolio/unnamed/](../unnamed/)
- Session starter: [portfolio/unnamed/HANDOFF_IOS.md](../unnamed/HANDOFF_IOS.md)

---

## Fresh session prompt

```
Read /CLAUDE.md and /HANDOFF.md first, then portfolio/unnamed-ios/CLAUDE.md and portfolio/unnamed-ios/HANDOFF.md.

Goal: Continue Unnamed iOS at portfolio/unnamed-ios/.

State (2026-04-17): Phase 1 complete. All 5 flows built, 10/10 tests passing, installed on iPhone 12 Pro Max.
Phase 1 rule: NO new features until Chase has used it for 7 days.
```

---

## App overview

Native iOS port of the Unnamed daily OS web app. SwiftUI + @Observable + UserDefaults. No SwiftData, no external deps.

**5 flows:**
1. Capture → type text, add to inbox
2. Sort → one inbox item at a time, assign to lane
3. Today (lock) → pick 2 lanes, lock in for the day (irreversible until midnight)
4. Today (focus) → one active item at a time, Done/Skip
5. Check → "Did you produce?" + "Did you stay in your lanes?" → Solid/Halfway/Rest

**4 lanes (fixed forever):** Regulation · Maintenance · Support Others · Future
