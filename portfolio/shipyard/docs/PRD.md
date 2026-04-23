# PRD — Shipyard

## V1 features

1. **Fleet dashboard** — renders all portfolio projects as cards with status badge, compliance score, and active WIP flag. Done when: 48+ projects display; status and WIP state are accurate.
2. **Ship detail page** (`/ship/[slug]`) — shows full project metadata; fields for status, next_action, and blockers are inline-editable. Done when: edits persist to Supabase and reflect on fleet dashboard without a manual scan.
3. **Drydock Gate** (`/wip`) — ordered WIP queue; drag-to-reorder persists. Done when: reorder survives page refresh.
4. **Port Inspection** (`/review`) — weekly review form with structured fields. Done when: a completed review saves a row to the reviews table.
5. **Captain's Log** (`/learnings`) — aggregated learnings across all apps, sourced from per-project LEARNINGS.md ingestion. Done when: at least one project's learnings appear on the page from a real file.
6. **Auth gate** — email+password login protects all pages. Done when: unauthenticated requests redirect to /login.
7. **Local scanner CLI** (`scripts/scan.ts`) + nightly launchd cron — reads portfolio metadata and upserts to Supabase. Done when: cron runs nightly at 3 AM and scan output matches repo state.

## NOT in V1

- Linear Harbor Master sync (`/linear`) — Phase 2 item, not blocking any V1 flow
- Charts & Constellations (`/themes`) thematic analysis — Phase 3
- Fleet Showcase public portfolio view (`/portfolio`) — Phase 3
- Multi-user or team auth — single user only
- Mobile-native version — web only
- Automated compliance scoring rules — manual/heuristic for now

## Prior art & positioning

```
Verdict: PROCEED
Alternatives found:
  - Linear — project tracking with great UI — no portfolio-metadata scanning, no LEARNINGS.md ingestion, no per-app compliance view
  - GitHub Projects — kanban over repos — not aware of CLAUDE.md conventions, no learnings aggregation
  - Notion portfolio dashboards — manual, not scanner-driven, no CLI upsert
Justification: Nothing scans Chase's own conventions (CLAUDE.md, HANDOFF.md, LEARNINGS.md) and surfaces them in a single dashboard — this is custom tooling for a custom system.
Positioning: Shipyard earns its seat because it reads the portfolio's own metadata format and turns it into a living command center — no generic tool can do that without Chase building it anyway.
```

## Constraints

- Platform: Next.js 16.2, App Router, React 19, TypeScript, Tailwind CSS v4
- Storage: Supabase (schema in `0001_init.sql`); no localStorage
- Deploy: Vercel via GitHub auto-deploy on push to main — never `vercel --prod`
- Stack defaults: per root CLAUDE.md (Node 20, conventional commits, monorepo path `portfolio/shipyard/`)
- Auth: Supabase email+password (not OTP — password-based gate)

## Success metrics

- Chase opens the dashboard at the start of every dev session instead of grepping CLAUDE.md.
- Nightly scan runs 7 nights without manual intervention.

## Risks

1. **Scanner drift** — CLAUDE.md format changes break field extraction. Mitigation: scan.ts has a schema-validation step that logs unrecognized fields instead of silently dropping them.
2. **Supabase RLS gaps** — a misconfigured policy exposes project metadata publicly. Mitigation: RLS on every table; anon key returns zero rows unless authenticated.
3. **Scope creep into Phase 3 features** — thematic analysis and public portfolio are tempting. Mitigation: NOT-in-V1 list above; kill criteria = any Phase 3 feature lands before all V1 items are marked done.
