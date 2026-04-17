# HANDOFF — Unnamed

> Per-app session state. **Monorepo session routine** still uses repo-root [`HANDOFF.md`](../../HANDOFF.md) — update that file's **State** when you stop, and keep *this* file in sync when work is app-only.

---

## State

| Field | Value |
|-------|-------|
| **Path** | `portfolio/unnamed/` (web) · `portfolio/unnamed-ios/` (iOS) |
| **Focus** | **iOS v0.1 complete (2026-04-17).** Native SwiftUI app built, 10/10 tests passing, installed and launched on iPhone 12 Pro Max. Web MVP also live at localhost:3000 (not yet deployed to Vercel). |
| **Stack** | Web: Next.js 16 + TypeScript + Tailwind 4 + localStorage. iOS: SwiftUI + @Observable + UserDefaults |
| **Last touch** | 2026-04-17 — **iOS Phase 1 complete:** all 5 flows, logo, tests pass, on-device. |
| **Next** | 1. Use the iOS app for 7 days — no features until then. 2. Deploy web app to Vercel. 3. Generate PWA icons for web (192px + 512px). |

---

## Quick links

- [CLAUDE.md](CLAUDE.md) · [CHANGELOG.md](CHANGELOG.md) · [ROADMAP.md](ROADMAP.md) · [LEARNINGS.md](LEARNINGS.md)

---

## Origin

This app emerged from a long conversation exploring Chase's ADHD-related behavioral loops (control-seeking, urgency illusion, certainty-seeking, consumption-as-regulation). The app is built FOR Chase first — not a portfolio piece, not an employer demo. A real tool for a real problem. See `~/.claude/projects/-Users-chase-Developer/memory/checkin_loops.md` for the full loop context.

The emotional/mental health side is handled by Ash (talktoash.com). This app handles the practical side: what do I actually do today?

---

## Architecture

```
src/
  app/
    page.tsx          ← redirects to /today
    layout.tsx        ← AppProvider + BottomNav + globals
    inbox/page.tsx    ← capture (type → enter → inbox)
    sort/page.tsx     ← lane assignment (one item at a time)
    today/page.tsx    ← lane lock → one-at-a-time focus view
    check/page.tsx    ← end-of-day: produced? stayed in lanes?
  lib/
    types.ts          ← Lane, Item, DailyLock, DailyCheck, LANE_LABELS, LANE_DESCRIPTIONS
    store.ts          ← load/save (localStorage), all state mutations
    context.tsx       ← AppContext + AppProvider + useApp()
  components/
    nav.tsx           ← BottomNav (4 tabs: Capture/Sort/Today/Check)
public/
  manifest.json       ← PWA manifest (icons pending)
```

## The 4 lanes (fixed — cannot be changed)

| Lane | Color | Description |
|------|-------|-------------|
| Regulation | Sky | Sleep, food, water, meds, walks, rest |
| Maintenance | Emerald | Dishes, laundry, cleaning, errands |
| Support Others | Violet | Kids, wife, church, family |
| Future | Amber | Job search, GMAT, building, planning |

**Daily rule:** pick 2 lanes. The others disappear. One item at a time within active lanes.

## Anti-features (things we will NOT add)

- Due dates / priorities
- Tags / labels
- Settings / customization
- More than 4 lanes
- Notifications (v1)
- Analytics dashboard
- Integrations

Containment IS the feature.
