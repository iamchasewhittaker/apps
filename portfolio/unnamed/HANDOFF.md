# HANDOFF — Unnamed

> Per-app session state. **Monorepo session routine** still uses repo-root [`HANDOFF.md`](../../HANDOFF.md) — update that file's **State** when you stop, and keep *this* file in sync when work is app-only.

---

## State

| Field | Value |
|-------|-------|
| **Path** | `portfolio/unnamed/` (web) · `portfolio/unnamed-ios/` (iOS) |
| **Focus** | **Deployed to Vercel 2026-04-25.** Production: https://unnamed-gold.vercel.app. Phase 1 7-day clock running — install on phone as PWA and use it. **No new features until 7 consecutive days of use.** |
| **Stack** | Web: Next.js 16 + TypeScript + Tailwind 4 + localStorage. iOS: SwiftUI + @Observable + UserDefaults |
| **Last touch** | 2026-04-25 — UX clarifications from real use: inbox rows now have visible pencil + trash buttons (with confirm-delete), each sort lane has an ⓘ help sheet (summary + examples + rule), `/check` shows today's locked lanes as chips and the two questions are reworded for concreteness. 5 src files + 3 docs committed; verified end-to-end in preview. Earlier today: Vercel deploy with `framework: nextjs`, `rootDirectory: portfolio/unnamed`, SSO disabled, git auto-deploy connected. |
| **Next** | 1. Add to home screen on iPhone (PWA install). 2. Use both iOS + web for 7 consecutive days — log notes in private memory, do not modify the app. 3. After day 7, review what (if anything) actually felt missing in real use; update `ROADMAP.md` Phase 2 candidates accordingly. |

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
