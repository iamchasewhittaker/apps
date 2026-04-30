# Session Start — Shipyard (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-04-16 (v0.1)** — Initial release: Next.js 15 + TypeScript + Tailwind scaffold; full Supabase schema (projects, blockers, scans, wip_decisions, review_cadence, reviews, learnings, themes); 8 pages built; scanner CLI; 29 projects seeded from audit CSV + 28 live-scanned; deployed to Vercel via GitHub auto-deploy
- **2026-04-18** — Sidebar logo (SY monogram) + dynamic favicon
- **2026-04-19** — Nightly auto-scan cron via launchd (3:00 AM daily); first cron run: 36 projects in 10.5s
- **2026-04-20** — Full nautical rebrand: helm SVG logo, 8-token palette (bg/surface/ghost/dimmer/dim/steel/gold/white), BigShoulders + DM Mono + Instrument Sans typography; chart-grid background
- **2026-04-20** — Auth gate fixed (config export name bug); login swapped to email+password; stable alias in docs; local_port column + dev links on Ship detail
- **2026-04-20** — Polish pass: contrast fix (dim/dimmer lifted), gold nav separators, theme toggle (nautical/regular), Fleet Showcase rebuild (all ~38 apps), per-app design detail page, build-branding.ts prebuild, Drydock Gate full queue + drag-to-reorder, category+tagline+summary per app, sync-projects.ts
- **2026-04-20** — /portfolio 500 fix (RSC boundary extraction); route smoke test added
- **2026-04-21** — Decommission Ship workflow (UI + CLI + API + Linear helper); editable Ship detail fields (status, next_action, blockers); clipboard dev-link (replaces dead localhost anchor)
- **2026-04-26** — Analytics & Themes: heading fix (mode-aware label), plain mode as default, scanner auto-populates Common Inputs + Cross-App Patterns (15 theme rows), Portfolio Thesis inline editor

---

## Still needs action

- Apply `supabase/migrations/0003_add_retirement.sql` manually in SQL Editor
- Fix learnings unique constraint to enable LEARNINGS.md ingestion
- Narrative Threads (manual or structured CLAUDE.md format)
- Linear Harbor Master sync
- WIP enforcement via wip_decisions
- Dynamic review prompts

---

## Shipyard state at a glance

| Field | Value |
|-------|-------|
| Version | v0.1 |
| URL | https://shipyard-iamchasewhittakers-projects.vercel.app |
| Storage key | n/a (Supabase-backed) |
| Stack | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Supabase |
| Linear | [Shipyard](https://linear.app/whittaker/project/shipyard-2847e4a05666) |
| Last touch | 2026-04-26 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/shipyard/CLAUDE.md | App-level instructions |
| portfolio/shipyard/HANDOFF.md | Session state + deploy notes |
| portfolio/shipyard/src/app/page.tsx | Fleet dashboard (main) |
| portfolio/shipyard/src/app/layout.tsx | Root layout with sidebar nav + ModeProvider |
| portfolio/shipyard/src/lib/types.ts | All TypeScript types (Project is canonical) |
| portfolio/shipyard/src/lib/supabase.ts | Server client factory (service role key, bypasses RLS) |
| portfolio/shipyard/scripts/scan.ts | Local filesystem scanner (nightly + manual) |

---

## Suggested next actions (pick one)

1. Fix learnings unique constraint and enable LEARNINGS.md ingestion
2. Wire Linear Harbor Master sync (pull open issues, map to ships)
3. Implement WIP enforcement via wip_decisions table
