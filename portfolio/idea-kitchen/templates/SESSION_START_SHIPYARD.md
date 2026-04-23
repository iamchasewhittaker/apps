# SESSION_START — Shipyard

> Paste into Claude Code at the start of any Shipyard session.

---

**App:** Shipyard
**Slug:** shipyard
**Workspace:** `~/Developer/chase/portfolio/shipyard/`
**GitHub:** `https://github.com/iamchasewhittaker/apps` (path: `portfolio/shipyard/`)
**Live URL:** `https://shipyard-iamchasewhittakers-projects.vercel.app`
**Linear:** — (add URL when project created)
**Deploy:** `git push` only — never `vercel --prod`

---

## Read first

1. `~/Developer/chase/CLAUDE.md` — repo conventions, stack defaults, portfolio table
2. `portfolio/shipyard/HANDOFF.md` — current state, last touch, next action
3. `portfolio/shipyard/LEARNINGS.md` — past mistakes; read before touching scanner or schema

---

## Current state (as of 2026-04-22)

Phase 2 in progress. Auth gate live. 48 projects synced. Ship detail editable. Decommission flow complete. Nightly scan cron running.

Pending Phase 2 items:
- Apply `0003_add_retirement.sql` in Supabase SQL Editor (manual step — do not auto-run)
- Fix learnings unique constraint
- Learnings ingestion from LEARNINGS.md files
- WIP enforcement via wip_decisions
- Linear Harbor Master sync

---

## Goal for this session

State your goal here before proceeding. Example: "Implement learnings ingestion — parse LEARNINGS.md files and upsert to learnings table."

If no goal is stated, stop and ask.

---

## V1 scope (what's in)

- Fleet dashboard with status, compliance, WIP flag
- Ship detail with inline-editable fields
- Drydock Gate (WIP queue, drag-to-reorder)
- Port Inspection (weekly review form)
- Captain's Log (learnings aggregated from LEARNINGS.md files)
- Auth gate (email + password)
- Local scanner CLI + nightly launchd cron

## NOT in scope

- Linear Harbor Master sync (Phase 2, separate session)
- Charts & Constellations thematic analysis (Phase 3)
- Fleet Showcase public portfolio view (Phase 3)
- Multi-user auth
- Mobile-native version
- Automated compliance scoring rules

---

## End-of-session checklist

```
 1. checkpoint
 2. Update CHANGELOG.md under ## [Unreleased]            # MANDATORY
 3. Update portfolio/shipyard/ROADMAP.md
 4. Update root ROADMAP.md Change Log row
 5. Update portfolio/shipyard/HANDOFF.md — State, Focus, Next, Last touch
 6. Update portfolio/shipyard/LEARNINGS.md               # MANDATORY — always at least one line
 6.5. If user-visible state changed: update docs/SHOWCASE.md
 7. Linear — heartbeat comment + move completed issues to Done
 8. If root CLAUDE.md portfolio table changed:
       cd portfolio/shipyard && npm run sync:projects
 8.5. Update brain/02-Projects/shipyard/README.md — bump frontmatter (status / shipped date if v1 cut), add a one-line dated log entry if user-visible state changed. Index only; don't mirror repo docs.
 9. git add <paths>
10. git commit -m "<type>(shipyard): <summary>"
11. git push
12. Report: what shipped / what's next / any blockers.
```

## Security checklist

```
- Public repo. Never commit secrets, real financial figures, or real names tied to private data.
- .env gitignored. .env.example template only.
- Supabase RLS on every table. anon key OK in client; service-role server-only.
- Parameterized queries only.
- No dangerouslySetInnerHTML. HTTPS only. No user-controlled redirects.
- npm audit --production before each release.
- If a secret is committed: rotate immediately, then purge history.
- AI keys server-side only. Prompt-injection resistance on any tool-use path.
- Run /secure before first push.
```

## Best-practices checklist

```
1. Vertical slice: one full flow per session.
2. Verify in browser before claiming done.
3. npm run build locally before push (Node 20 CI is strict).
4. Small diffs. Conventional commits.
5. Empty + error states on every screen.
6. Accessibility from day one. Chase has low vision.
7. Portfolio table + Shipyard metadata stay in sync.
8. HANDOFF.md = resume context. Linear + git = shipped truth.
9. Honor kill criteria.
10. /audit before push on non-trivial changes.
11. No speculative abstractions.
12. 15-minute stuck rule: if stuck 15 min, change approach or ask.
```
