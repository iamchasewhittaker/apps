# SHOWCASE Template

> Copy this file to `portfolio/<slug>/docs/SHOWCASE.md` and fill it in. Shipyard reads the shape below to render `/ship/<slug>` (Phase 2). Until then, the markdown itself is the surface.

Replace every `<placeholder>`. Delete the "example fills" notes once filled. Do not rename section headers — Shipyard parses them.

---

# <AppName>

> <One-sentence tagline. Plain English. No marketing.>

**Status:** <Scaffolding | Active | Paused | Archived>
**Version:** <v0.1>
**Stack:** <React CRA + localStorage | Next.js + Supabase + Tailwind | SwiftUI + SwiftData | Python CLI | Apps Script>
**Updated:** <YYYY-MM-DD>

---

## Problem

<1–3 sentences on what's broken today without this app. Specific. No hedging.>

## Solution

<1–3 sentences on how the app solves it. What it does, not how.>

## Who it's for

<Usually "Chase." Sometimes Reese, Buzz, or a narrow persona. One sentence.>

---

## Key features (V1)

- **<Feature 1>** — <one-line outcome, not mechanism>
- **<Feature 2>** — <one-line outcome>
- **<Feature 3>** — <one-line outcome>

<Keep to 3–5. If it's longer, the PRD hasn't cut enough.>

---

## Primary flow

1. <User action>
2. <System response>
3. <User action>
4. <System response>
5. <End state>

---

## Screens

| Screen | Purpose | Empty state | Error state |
|---|---|---|---|
| <Home> | <what it's for> | <what shows when no data> | <what shows when broken> |
| <Detail> | ... | ... | ... |

<Pre-ship: use chips / short descriptions. Post-ship: add screenshot paths under `docs/screenshots/`.>

---

## Milestones

- [x] **M0 — Scaffold** — repo set up, builds clean, CLAUDE.md + docs in place
- [ ] **M1 — Primary flow** — <one-sentence vertical slice>
- [ ] **M2 — <next>** — <one-sentence>
- [ ] **M3 — <next>** — <one-sentence>

---

## Links

- **GitHub:** [apps](https://github.com/iamchasewhittaker/apps) (monorepo path: `portfolio/<slug>/`)
- **Linear:** <URL or "—">
- **Live:** <URL or "local">
- **Shipyard:** [/ship/<slug>](https://shipyard-sandy-seven.vercel.app/ship/<slug>)

---

## Why it exists

<2–3 sentences on the motivation. The specific pain, the specific person, the specific reason this is worth building over doing nothing.>

<If identity is on, close with the family-urgency line: *"For Reese. For Buzz. Forward — no excuses."* Only include if it actually lands.>
