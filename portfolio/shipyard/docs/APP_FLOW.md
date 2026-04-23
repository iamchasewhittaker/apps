# App Flow — Shipyard

## Primary flow — Fleet review session

1. Chase navigates to the deployed URL.
2. Auth gate intercepts; redirects to `/login`.
3. Chase enters email + password; Supabase validates.
4. App redirects to fleet dashboard (`/`).
5. Dashboard loads all project cards from Supabase — status badge, compliance score, WIP flag visible at a glance.
6. Chase spots a project card with a WIP flag; clicks it.
7. Ship detail page (`/ship/[slug]`) loads — full metadata, editable fields visible.
8. Chase edits `next_action` inline; change persists to Supabase on blur.
9. Chase navigates to Drydock Gate (`/wip`) to reorder priority queue.
10. Chase reorders two items via drag; new order persists on refresh.
11. Session ends — state is accurate, no manual file edits needed.

## Alternate flows

**Empty state (new install, no scan run yet):**
Fleet dashboard renders with zero cards and a banner: "No ships found — run `npx tsx scripts/scan.ts` to populate."

**Scan failure:**
Scan script logs error with field name and project slug; upsert skips that project; other projects update normally. Dashboard shows last-scan timestamp so Chase knows data may be stale.

**Auth failure:**
Supabase returns error; login page shows inline message "Invalid credentials." No redirect. No data exposed.

## Screens

| Screen | Purpose | Empty state | Error state |
|--------|---------|-------------|-------------|
| `/login` | Auth gate | n/a | "Invalid credentials" inline |
| `/` Fleet dashboard | All projects at a glance | "No ships found — run scan" banner | "Failed to load fleet" with retry button |
| `/ship/[slug]` Ship detail | Per-project metadata + inline edit | n/a | "Ship not found" with back link |
| `/wip` Drydock Gate | WIP priority queue, drag-to-reorder | "No active WIP" message | "Failed to load queue" with retry |
| `/review` Port Inspection | Weekly review form | Pre-filled date, empty fields | "Save failed — try again" |
| `/learnings` Captain's Log | Aggregated learnings across apps | "No learnings ingested yet" | "Failed to load log" with retry |
| `/themes` Charts & Constellations | Thematic analysis (Phase 3) | Phase 3 placeholder | n/a |
| `/portfolio` Fleet Showcase | Public portfolio (Phase 3) | Phase 3 placeholder | n/a |
| `/linear` Harbor Master | Linear sync (Phase 2) | "Sync not configured" | Linear API error message |

## Accessibility notes

All screens:
- Minimum tap target 44×44pt on interactive elements.
- Color is never the sole indicator of status — status badges use text labels alongside color.
- 4.5:1 contrast ratio between sail cream (`#F2EEE6`) and deep sea (`#07101E`) = 14.3:1 — passes AAA.
- Brass gold (`#D7AA3A`) on hull navy (`#0C1A34`) = ~4.6:1 — passes AA. Verify on accent text.
- VoiceOver labels on icon-only buttons (drag handles, decommission, etc.) — aria-label required.
- Dynamic Type: `font-size` in rem, no px locks on body text.
- Focus order: logical DOM order; no focus traps except auth modal.
- Drag-to-reorder: keyboard fallback required (move up/down arrows on focused row).

## Data model sketch

```
projects {
  slug         text PK
  name         text
  status       text   -- active | paused | archived | decommissioned
  stack        text
  next_action  text
  compliance   int    -- 0–100
  wip          bool
  last_scan    timestamptz
}

blockers      { id uuid PK, project_slug FK, text, resolved bool, created_at }
scans         { id uuid PK, project_slug FK, scanned_at, raw jsonb }
wip_decisions { id uuid PK, project_slug FK, priority int, decided_at }
reviews       { id uuid PK, week_of date, notes text, created_at }
learnings     { id uuid PK, project_slug FK, text, source_file text, created_at, UNIQUE(project_slug, text) }
themes        { id uuid PK, name text, project_slugs text[] }
```
