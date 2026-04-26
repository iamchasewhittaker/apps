@AGENTS.md

# Unnamed — Project Instructions

> **Voice brief:** This project follows Chase's voice rules — see [`identity/voice-brief.md`](../../identity/voice-brief.md). No em-dashes, no rule-of-threes, no hype, no consultant phrasing.


> **Name is a placeholder.** This app is called "Unnamed" until a permanent name is chosen.

> See also: `/CLAUDE.md` (repo root) for portfolio-wide conventions.

**Project tracking:** Personal use only — no Linear project (Phase 1 rule: use before adding process).

## App Identity

- **Version:** v0.1
- **Storage key:** `unnamed_v1`
- **URL:** not yet deployed (Phase 1: deploy to Vercel, install as PWA)
- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + localStorage + pnpm
- **Entry:** `src/app/page.tsx` → redirects to `/today`
- **Per-app handoff:** [HANDOFF.md](HANDOFF.md)

> *"Every day stripped to essentials, one route, no extra gear."*

## What This App Is

A daily operating system for ADHD brains. **Not a task manager.** It narrows your world to what matters today, shows you one thing at a time, and refuses to let you optimize it.

Built for Chase first. The anti-features ARE the product. See [ROADMAP.md](ROADMAP.md).

## The 4 Lanes (fixed — never changes)

| Lane | Color | Description |
|------|-------|-------------|
| Regulation | Sky | Sleep, food, water, meds, walks, rest |
| Maintenance | Emerald | Dishes, laundry, cleaning, errands |
| Support Others | Violet | Kids, wife, church, family |
| Future | Amber | Job search, GMAT, building, planning |

**Daily rule:** Chase picks 2 lanes each morning. The other 2 disappear. One item at a time.

## File Structure

```
src/
  app/
    page.tsx           ← redirects to /today
    layout.tsx         ← AppProvider + BottomNav + globals
    inbox/page.tsx     ← Capture flow (type → enter → inbox)
    sort/page.tsx      ← Sort flow (one inbox item at a time → assign to lane)
    today/page.tsx     ← Today flow (lane lock + one-at-a-time focus view)
    check/page.tsx     ← Check flow (end-of-day: produced? stayed in lanes?)
  lib/
    types.ts           ← Lane, Item, DailyLock, DailyCheck, LANE_LABELS, LANE_DESCRIPTIONS
    store.ts           ← load/save (localStorage key: unnamed_v1), all state mutations
    context.tsx        ← AppContext + AppProvider + useApp()
  components/
    nav.tsx            ← BottomNav (4 tabs: Capture/Sort/Today/Check)
public/
  manifest.json        ← PWA manifest (icons at 192px + 512px pending)
```

## State Architecture

All state is one JSON blob at `unnamed_v1`:

```typescript
{
  items: Item[];        // all captured items (inbox + sorted)
  locks: DailyLock[];  // daily lane selections
  checks: DailyCheck[]; // end-of-day check results
}
```

State mutations are immutable via `update(fn)` in AppContext:

```typescript
const { state, update } = useApp();
update(s => ({ ...s, items: [...s.items, newItem] }));
```

## The 5 Flows

1. **Capture** (`/inbox`) — type text, hit enter → goes to inbox. No metadata.
2. **Sort** (`/sort`) — one inbox item at a time; pick a lane or skip. No drag.
3. **Lock** (`/today`, LanePicker view) — pick 2 lanes. Tap "Lock lanes for today". Irreversible until tomorrow.
4. **Focus** (`/today`, FocusView) — one item at a time within active lanes. Done / Skip / Next.
5. **Check** (`/check`) — "Did you produce?" + "Did you stay in your lanes?" Yes/No. Produces Solid/Halfway/Rest result.

## Anti-Features (protect these forever)

- No additional lanes (4 is max, forever)
- No due dates or priorities
- No tags or labels
- No settings or customization pages
- No gamification / streaks / points
- No social features
- No export / import
- No integrations (v1)
- No Supabase auth (v1 — localStorage only so app is usable immediately)

**"Containment is the feature."**

## Key Behaviors to Preserve

- `DailyLock` is irreversible for the day — once lanes are locked, LanePicker is hidden
- `today()` returns `YYYY-MM-DD` in local time — used as the date key for all daily state
- Sort flow shows inbox items one-at-a-time (no list view)
- Focus view shows ONE item at a time per active lane — done/skip cycles to next
- Check flow result: both yes = "Solid day." · produced only = "Halfway there." · neither = "Rest day. That counts too."
- BottomNav shows inbox badge (count), lock dot (green if locked today), check dot (green if checked today)

## Tailwind 4 Pattern

This project uses Tailwind CSS 4. Do NOT use `@tailwind base/components/utilities`. The import is:

```css
@import "tailwindcss";
```

## Dev Commands

```bash
pnpm dev       # start dev server at localhost:3000
pnpm build     # production build
pnpm lint      # lint
```

pnpm is managed via `corepack enable pnpm` (not `npm install -g pnpm`).

## Phase 1 Rule

**No new features until Chase has used the app for 7 consecutive days.**

If Chase asks you to add a feature, ask: "Have you used it for 7 days first?"

## Learnings

Read [LEARNINGS.md](LEARNINGS.md) at session start for project-specific gotchas. Append after anything surprising.
