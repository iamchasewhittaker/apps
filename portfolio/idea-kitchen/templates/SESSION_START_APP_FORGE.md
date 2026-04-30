# Session Start — App Forge (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **v1** — Initial build: Audit, Lessons, Learn, Ideas tabs; dark mode; localStorage key chase_forge_v1
- **v2** — Fixed duplicate CSS borderBottom; vercel.json check changed to always-pass reminder; pre-deploy.sh false positive fixes
- **v3** — Added audit.sh (terminal framework checks, auto-copies to clipboard)
- **v4** — Audit detection order fix (App Forge checked first); confirm() false positive in audit.sh fixed
- **v5** — Apps tab: one card per app tracking version, changelog summary, live URL, storage key, local folder, notes
- **v6** — Fixed white border around app edges (global margin/padding reset)
- **v7** — Fixed Job Search HQ audit detection (removed stale marker, added CHASE_CONTEXT)
- **v8** — APP_META comment parsing replaces brittle substring detection; detectApp() reads metadata first, falls back to marker scoring
- **v8.1** — Updated APP_SNAPSHOT_DEFAULTS: Wellness v15.9, Growth v6 retired, Job Search v8.2; added Supabase notes
- **2026-04-13** — Theme alignment: C tokens updated to portfolio BASE set; DM Sans font added; theme-color meta updated
- **2026-04-14** — Favicon white-corner fix (solid #0f1117 fill); CI docs added
- **2026-04-20** — Vercel URL retired; app runs locally only

---

## Still needs action

- Split App.jsx monolith (~1100 lines) into separate tab files
- Wire Supabase sync (Phase 3 of rollout, shared project pattern)

---

## App Forge state at a glance

| Field | Value |
|-------|-------|
| Version | v8.1 |
| URL | local only (Vercel URL retired 2026-04-20) |
| Storage key | `chase_forge_v1` |
| Stack | React CRA + inline styles + localStorage (no Supabase yet) |
| Linear | [App Forge](https://linear.app/whittaker/project/app-forge-64221811d236) |
| Last touch | 2026-04-13 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/app-forge/CLAUDE.md | App-level instructions |
| portfolio/app-forge/HANDOFF.md | Session state + design tokens reference |
| portfolio/app-forge/src/App.jsx | Full monolith: all tabs, components, audit engine, data, styles (~1100 lines) |
| portfolio/app-forge/public/index.html | Font loading, PWA meta |

---

## Suggested next actions (pick one)

1. Split App.jsx monolith into separate tab files (Audit, Lessons, Ideas, Apps)
2. Wire Supabase sync (APP_KEY 'app-forge', shared project pattern)
3. Update APP_SNAPSHOT_DEFAULTS to reflect latest portfolio versions
