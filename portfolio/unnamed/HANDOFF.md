# HANDOFF — Unnamed

> Per-app session state. **Monorepo session routine** still uses repo-root [`HANDOFF.md`](../../HANDOFF.md) — update that file's **State** when you stop, and keep *this* file in sync when work is app-only.

---

## State

| Field | Value |
|-------|-------|
| **Path** | `portfolio/summit-push/` |
| **Focus** | **v0.1 MVP built (2026-04-17).** 5 core screens live: Capture (inbox), Sort (lane assignment), Today (lane lock + one-at-a-time focus), Check (end-of-day). Dark UI, mobile-first, localStorage, PWA manifest. Builds clean. Dev server verified at localhost:3000. Not yet deployed to Vercel. |
| **Stack** | Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + localStorage + pnpm |
| **Last touch** | 2026-04-17 — **MVP v0.1 built:** 4 screens, bottom nav, lane system, dark theme, PWA manifest, clean build. |
| **Next** | 1. Deploy to Vercel (connect GitHub, set up project). 2. Generate PWA icons (192px + 512px). 3. Test on phone (install as PWA). 4. Use it for 7 days before adding any feature. |

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
