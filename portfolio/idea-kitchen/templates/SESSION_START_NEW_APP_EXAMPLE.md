# SESSION_START — Example (filled in)

> This is what STEP 6 Block 6 of the Claude Project produces. Use it as a reference for shape. The Project generates a fresh one per app; never paste this example into Claude Code verbatim.

---

**Instructions for the agent**

1. Read `CLAUDE.md` (repo root) and `HANDOFF.md` first.
2. Read `portfolio/pocket-coach/CLAUDE.md` and `portfolio/pocket-coach/HANDOFF.md`.
3. Goal for this session: **Scaffold Milestone 0 only. Stop after scaffold + commit. Wait for sign-off before Milestone 1.**

**Workspace:** `~/Developer/chase`
**Remote:** `github.com/iamchasewhittaker/apps`
**Linear:** https://linear.app/whittaker/project/pocket-coach-<id>
**Goal:** Scaffold Pocket Coach — a CRA web app that tracks daily "one hard thing" completions with a streak counter.

---

## Scope — V1 from PRD

1. One "today" screen with a single text field + "done" button.
2. Streak counter that increments on mark-done and breaks if yesterday was missed.
3. History list showing the last 30 days.
4. localStorage persistence (`chase_pocket_coach_v1`).
5. Empty + error states on every screen.

## Not in scope

- Reminders / notifications.
- Multi-habit tracking.
- Syncing to Supabase.
- iOS companion.
- Analytics beyond the streak counter.

## Constraints

- Stack: React CRA + inline styles (`s` object in `constants.js`, portfolio convention).
- Storage: one localStorage blob, key `chase_pocket_coach_v1`.
- Accessibility: Dynamic Type friendly, 44pt tap targets, VoiceOver labels, 4.5:1 contrast.
- No TypeScript. No component libraries. No Tailwind.

---

## Milestone 0 — Scaffold (this session)

1. `cd ~/Developer/chase`
2. `checkpoint`
3. `scripts/new-app pocket-coach "daily one-hard-thing tracker"`
4. Verify `npm start` runs clean.
5. Add `src/constants.js` with `STORAGE_KEY`, `s` styles object, `load()` / `save()` helpers.
6. Add `src/ErrorBoundary.jsx` (copy pattern from `portfolio/wellness-tracker/src/ErrorBoundary.jsx`).
7. Wrap `<App />` in `ErrorBoundary` in `src/index.js`.
8. Add `.env.example` (even if empty for now).
9. Commit: `feat(pocket-coach): scaffold Milestone 0 — CRA shell + storage helpers + ErrorBoundary`.
10. **Stop here. Do not start Milestone 1.**

---

## End-of-session checklist (all 12 steps, mandatory)

```
 1. checkpoint
 2. Update CHANGELOG.md under ## [Unreleased]
 3. Update portfolio/pocket-coach/ROADMAP.md
 4. Update root ROADMAP.md Change Log row
 5. Update portfolio/pocket-coach/HANDOFF.md — State, Focus, Next, Last touch
 6. Update portfolio/pocket-coach/LEARNINGS.md
 6.5. If user-visible state changed: update docs/SHOWCASE.md
 7. Linear — heartbeat comment + move completed issues to Done
 8. cd portfolio/shipyard && npm run sync:projects
 9. git add portfolio/pocket-coach CLAUDE.md ROADMAP.md
10. git commit -m "feat(pocket-coach): scaffold Milestone 0"
11. git push
12. Report: what shipped / what's next / any blockers.
```

## Security checklist (do not skip)

```
- Public repo. Never commit secrets, real financial figures, or real names tied to private data.
- .env gitignored. .env.example template only.
- No dangerouslySetInnerHTML. HTTPS only. No user-controlled redirects.
- npm audit --production before release.
- Run /secure before first push.
```

## Best-practices reminders

```
1. Vertical slice. M0 scaffold, M1 full primary flow.
2. Verify in browser before claiming done.
3. npm run build locally before push (Node 20 CI strictness).
4. Conventional commits.
5. Empty + error states on every screen.
6. Accessibility day one. Chase has low vision.
7. Portfolio table + Shipyard metadata stay in sync.
8. No speculative abstractions.
9. 15-minute stuck rule.
```

---

## Notes for the agent

- The six foundation docs already exist in `portfolio/pocket-coach/docs/`. Read them if you need more context than this file gives.
- If anything in this session prompt conflicts with the PRD or APP_FLOW, the PRD / APP_FLOW wins. Flag the conflict before proceeding.
- If you finish Milestone 0 and feel the urge to start Milestone 1, stop. Run the end-of-session checklist. Report. Wait.
