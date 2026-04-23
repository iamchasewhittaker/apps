# SESSION_START — Wellness Tracker iOS

> Paste into Claude Code from `~/Developer/chase`. This is a stub for single-app change sessions.

---

**App:** Wellness Tracker iOS
**Slug:** wellness-tracker-ios
**Path:** `portfolio/wellness-tracker-ios/`
**Version:** Phase 2 shell
**Stack:** SwiftUI + @Observable + UserDefaults + optional Supabase
**Bundle ID:** `com.chasewhittaker.WellnessTracker`

---

## Before you do anything

1. Read `CLAUDE.md` (repo root)
2. Read `portfolio/wellness-tracker-ios/HANDOFF.md`
3. Read `portfolio/wellness-tracker-ios/LEARNINGS.md`
4. Read `docs/design/CLARITY_IOS_APP_ICON_SPEC.md` if touching the AppIcon

---

## Goal

> [Replace this line with the session goal — e.g., "Implement Tracker tab: morning/evening check-in wizard (Phase 3 M2)"]

---

## Scope (Phase 2 shell — shipped)

- Tasks tab: today's task list, UserDefaults local
- Time tab: basic focus timer, persists across launches
- Capture tab: quick note entry
- Sync tab: Supabase connection status (display only)
- W+sunrise AppIcon

## Not in scope (Phase 2)

- Supabase read/write (Phase 3)
- Tracker tab check-in wizard (Phase 3)
- Full task CRUD with categories (Phase 3)
- Growth tab (Phase 3)
- Budget tab (Phase 3+)
- iPad layout

---

## Web companion context

- Web app: `portfolio/wellness-tracker/` — v15.10, 6 tabs
- Same Supabase project: `unqtnnxlltiadzbqpyhh`
- Same app key: `'wellness'`
- iOS reads/writes should match the web blob shape when sync is enabled in Phase 3

---

## End-of-session checklist

```
 1. checkpoint
 2. Update CHANGELOG.md under ## [Unreleased]
 3. Update portfolio/wellness-tracker-ios/ROADMAP.md
 4. Update root ROADMAP.md Change Log row
 5. Update portfolio/wellness-tracker-ios/HANDOFF.md — State, Focus, Next, Last touch
 6. Update portfolio/wellness-tracker-ios/LEARNINGS.md
 6.5. If user-visible state changed: update docs/SHOWCASE.md
 7. Linear — heartbeat comment + move completed issues to Done (if Linear project exists)
 8. If root CLAUDE.md portfolio table changed: cd portfolio/shipyard && npm run sync:projects
 8.5. Update brain/02-Projects/wellness-tracker-ios/README.md
 9. git add <paths>
10. git commit -m "<type>(wellness-tracker-ios): <summary>"
11. git push
12. Report: what shipped / what's next / any blockers.
```

## Security checklist

```
- Public repo. Never commit secrets, real financial data, or real names tied to private data.
- .env / xcconfig gitignored. Template only committed.
- Supabase anon key OK in client; service-role server-only.
- No hardcoded credentials anywhere in Swift source.
- If a secret is committed: rotate immediately, then purge history.
```
