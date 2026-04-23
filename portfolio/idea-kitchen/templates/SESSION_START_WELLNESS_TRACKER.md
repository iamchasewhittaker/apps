# SESSION_START — Wellness Tracker

> Paste into Claude Code from `~/Developer/chase`. This is a stub for single-app change sessions.

---

**App:** Wellness Tracker
**Slug:** wellness-tracker
**Path:** `portfolio/wellness-tracker/`
**Version:** v15.10
**Stack:** React CRA + inline styles + localStorage + Supabase

---

## Before you do anything

1. Read `CLAUDE.md` (repo root)
2. Read `portfolio/wellness-tracker/HANDOFF.md`
3. Read `portfolio/wellness-tracker/LEARNINGS.md`

---

## Goal

> [Replace this line with the session goal — e.g., "Split HistoryTab into sub-components (analytics / export / AI summary)"]

---

## Scope

From PRD V1 (all shipped at v15.10):
- Tracker tab: morning/evening check-in
- Tasks + Time + Budget + Growth + History tabs
- Supabase sync (LIVE)

## Not in scope

- iOS changes (use `wellness-tracker-ios` session)
- Multi-user features
- Vercel redeployment (local only)
- Budget forecasting

---

## End-of-session checklist

```
 1. checkpoint
 2. Update CHANGELOG.md under ## [Unreleased]
 3. Update portfolio/wellness-tracker/ROADMAP.md
 4. Update root ROADMAP.md Change Log row
 5. Update portfolio/wellness-tracker/HANDOFF.md — State, Focus, Next, Last touch
 6. Update portfolio/wellness-tracker/LEARNINGS.md
 6.5. If user-visible state changed: update docs/SHOWCASE.md
 7. Linear — heartbeat comment + move completed issues to Done
 8. If root CLAUDE.md portfolio table changed: cd portfolio/shipyard && npm run sync:projects
 8.5. Update brain/02-Projects/wellness-tracker/README.md
 9. git add <paths>
10. git commit -m "<type>(wellness-tracker): <summary>"
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
- AI keys server-side only.
```
