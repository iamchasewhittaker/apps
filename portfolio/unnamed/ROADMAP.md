# Roadmap — Unnamed

> A daily operating system for ADHD brains. Not a task manager — an app that narrows your world to what matters today.

---

## Change Log

| Date | Version | Summary |
|------|---------|---------|
| 2026-04-17 | v0.1 | MVP built: 5 flows, 4 lanes, dark UI, localStorage, PWA manifest |
| 2026-04-24 | v0.1 | Web/iOS parity: Sort Skip button, `skipItem` cycle-to-end, FocusView reads `state.items` directly. Build clean; deploy to Vercel pending. |
| 2026-04-25 | v0.1 | Deployed to Vercel — https://unnamed-gold.vercel.app. Phase 1 7-day clock starts. |

---

## Phase 1 — Use It (current)

**Rule: No new features until Chase has used the app for 7 consecutive days.**

- [x] Core 5 flows built (capture, sort, lock, focus, check)
- [x] Deploy to Vercel — https://unnamed-gold.vercel.app (2026-04-25)
- [x] Generate PWA icons (192px + 512px) — shipped with v0.1 (placeholder triangle; revisit if a permanent name lands)
- [ ] Install on phone as PWA
- [ ] Use for 7 days
- [ ] Gather real usage notes

---

## Phase 2 — Evidence-Based Improvements

Only add what 7+ days of real use proves is needed.

Candidates (not commitments):
- **History view** — see past check-in data. Which lanes got locked most? How many summit days?
- **Overflow handling** — what happens when a lane has 20+ items? Maybe a "too many" warning.
- **Supabase sync** — so data persists across devices (phone + laptop)
- **PWA push** — morning nudge to lock lanes (only if he actually needs it)
- **Quick re-sort** — ability to move a sorted item back to inbox if it was miscategorized

---

## Phase 3 — Potential Product

If this solves the problem for Chase, it may solve it for others. The market is ADHD adults who've failed every productivity app because setup and customization are the trap.

Potential differentiators:
- Fixed lanes (no customization) as a core value prop
- Mountain/cairn theme that resonates with a community
- Ash integration (connect emotional check-ins to daily practical focus)
- LDS/faith mode (optional lane: Steward — gospel, family, service)

---

## Anti-features (protect these forever)

- No additional lanes (4 is the max, forever)
- No due dates or priorities
- No tags or labels
- No settings or customization pages
- No gamification / streaks / points
- No social features
- No export / import
- No integrations (v1)

**"Containment is the feature."**

---

## Background

This app came from a conversation about Chase's ADHD behavioral loops. "Unnamed" is a placeholder — the permanent name is TBD.

Full context in `~/.claude/projects/-Users-chase-Developer/memory/project_summit_push.md`.
