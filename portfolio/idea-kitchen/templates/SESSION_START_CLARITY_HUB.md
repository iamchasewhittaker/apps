# SESSION_START — Clarity Hub Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Clarity Hub is a stable v0.2 app in maintenance mode.
**App:** Clarity Hub
**Slug:** clarity-hub
**One-liner:** Unified 5-tab hub (Check-in / Triage / Time / Budget / Growth) — web companion to the five Clarity iOS apps; now in maintenance mode as individual apps take over.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. The app is stable; all major decisions are made.

---

## What to produce

All six STEP 6 artifacts (downloadable panels, not code blocks in chat). Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/clarity-hub`
2. **BRANDING.md** — Clarity palette, multi-tab hub aesthetic, sky blue primary accent
3. **PRODUCT_BRIEF.md** — distill from context below; note the hub-to-dedicated-apps migration story
4. **PRD.md** — reflect v0.2 shipped scope; V3 = maintenance only, tabs being superseded
5. **APP_FLOW.md** — document the 5-tab structure and how each maps to a dedicated Clarity iOS app
6. **SESSION_START_clarity-hub.md** — stub only

Output paths: `portfolio/clarity-hub/docs/`

---

## App context — CLAUDE.md

**Version:** v0.2
**Stack:** React CRA + inline styles + localStorage + Supabase sync (live)
**Storage keys (5):**
- `chase_hub_checkin_v1` — Check-in tab
- `chase_hub_triage_v1` — Triage tab
- `chase_hub_time_v1` — Time tab
- `chase_hub_ynab_v1` — Budget tab (now split out as Funded Web)
- `chase_hub_rollertask_v1` — RollerTask tab (now split out as RollerTask Tycoon Web)
**URL:** local only

**What this app is:**
A unified 5-tab daily operating hub that was the original home for all Clarity functionality on the web. Tabs: Check-in (morning/evening wizard), Triage (capacity + ideas), Time (focus sessions), Budget (YNAB integration), Growth (7 growth areas + streaks). The Budget and RollerTask tabs were split into standalone apps (`funded-web`, `rollertask-tycoon-web`).

**Status:**
Maintenance mode. Each tab is gradually being superseded by a dedicated app. The hub still works; it's kept alive for continuity and as a reference implementation.

**Architecture:**
- Multi-blob: each tab owns its own localStorage key
- Tabs receive `blob` + `setBlob` props — dumb components
- `App.jsx` owns auth gate (email OTP via Supabase) + tab routing

**Brand system:**
- Clarity palette: sky blue primary (`#38bdf8`), midnight background (`#0a0f1e`)
- Tab icons + color coding per tab

---

## App context — HANDOFF.md

**Version:** v0.2
**Focus:** Maintenance mode. No new features — individual Clarity apps are the future.
**Last touch:** 2026-04-21

**Migration status:**
- Budget tab → `portfolio/funded-web/` (standalone)
- RollerTask tab → `portfolio/rollertask-tycoon-web/` (standalone)
- Check-in tab → `portfolio/clarity-checkin-ios/` (iOS primary)
- Triage tab → `portfolio/clarity-triage-ios/` (iOS primary)
- Time tab → `portfolio/clarity-time-ios/` (iOS primary)
- Growth tab → `portfolio/clarity-growth-ios/` (iOS primary)

**Next:**
No active development planned. If hub is ever deprecated, archive at `portfolio/archive/clarity-hub/`.
