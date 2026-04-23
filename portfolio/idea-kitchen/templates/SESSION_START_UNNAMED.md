# SESSION_START — Unnamed Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.
> Note: "Unnamed" is the placeholder name — a permanent name hasn't been chosen yet. Generate BRANDING.md and SHOWCASE.md using "Unnamed" but flag naming as a follow-up.

---

**Mode:** Retroactive documentation — Unnamed (web + iOS) exists as a functional v0.1 app.
**App:** Unnamed
**Slug:** unnamed
**One-liner:** Daily operating system for ADHD brains — pick 2 of 4 lanes each morning, focus on one item at a time, and check in at day's end; deliberately refuses to let you optimize it.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. Both web and iOS builds exist; decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/unnamed`
2. **BRANDING.md** — 4-lane color system, amber triangle icon, anti-optimization voice (see Brand System below)
3. **PRODUCT_BRIEF.md** — distill from context below; note the name is still a placeholder
4. **PRD.md** — reflect actual V1 shipped scope for both web and iOS; defer naming decision to V2
5. **APP_FLOW.md** — document the 5-flow daily loop (Capture → Sort → Today → Check)
6. **SESSION_START_unnamed.md** — stub only

Output paths: `portfolio/unnamed/docs/`

---

## App context — CLAUDE.md

**Version:** v0.1
**Storage key:** `unnamed_v1`
**URL:** not deployed (Phase 1: deploy to Vercel, install as PWA)
**Entry:** `src/app/page.tsx` → redirects to `/today`
**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + localStorage + pnpm
**iOS companion:** `portfolio/unnamed-ios/` — SwiftUI + @Observable + UserDefaults; v0.1, 10/10 tests, on-device

**What this app is:**
A daily operating system for ADHD brains. Not a task manager. It narrows your world to what matters today, shows you one thing at a time, and refuses to let you optimize it. The anti-features ARE the product. Built for Chase first.

**The 4 lanes (fixed — never changes):**
| Lane | Color | Description |
|---|---|---|
| Regulation | Sky | Sleep, food, water, meds, walks, rest |
| Maintenance | Emerald | Dishes, laundry, cleaning, errands |
| Support Others | Violet | Kids, wife, church, family |
| Future | Amber | Job search, GMAT, building, planning |

**Daily rule:** Chase picks 2 lanes each morning. The other 2 disappear. One item at a time.

**5 flows (the full daily loop):**
1. **Capture** (`/inbox`) — type → enter → inbox; no tagging yet, just capture
2. **Sort** (`/sort`) — one inbox item at a time; assign to a lane or discard
3. **Today** (`/today`) — lane lock (pick 2) + one-at-a-time focus view
4. **Check** (`/check`) — end-of-day: did you produce? did you stay in your lanes?
5. Bottom nav ties all 4 together (Capture / Sort / Today / Check)

**Architecture:**
- All state: one JSON blob at `unnamed_v1` — `{ items[], locks[], checks[] }`
- Mutations via `update(fn)` in AppContext (immutable pattern)
- `src/lib/store.ts` — load/save helpers; `src/lib/context.tsx` — AppContext + useApp()
- No Supabase yet; localStorage only

**Brand system:**
- Amber triangle icon (iOS: AppIcon in `unnamed-ios/`)
- Lane colors: Sky (Regulation), Emerald (Maintenance), Violet (Support Others), Amber (Future)
- Voice: direct, minimal, anti-productivity-hype — "one thing. not ten."
- No gamification. No streaks. No points. Restraint is the brand.

**Origin note:** Built from a long conversation about ADHD behavioral loops (control-seeking, urgency illusion, certainty-seeking, consumption-as-regulation). Real tool for a real problem, not a portfolio piece.

---

## App context — HANDOFF.md

**Version:** v0.1
**Focus:** iOS v0.1 complete (2026-04-17) — all 5 flows, logo, 10/10 tests, on-device. Web MVP functional at localhost:3000.
**Last touch:** 2026-04-17

**Next:**
1. Use the iOS app for 7 days — no features until then
2. Deploy web app to Vercel
3. Generate PWA icons for web (192px + 512px)
4. Choose a permanent name
