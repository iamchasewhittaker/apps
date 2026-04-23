# PRD — Wellness Tracker

## V1 features (shipped at v15.10)

1. **Morning/evening check-in** — Done when: Chase can log sleep, mood, energy, supplements, meds, and notes for both AM and PM in a single form and save the entry.
2. **Task management** — Done when: Chase can add, complete, and view tasks and ideas in a dedicated tab with no data loss on reload.
3. **Time tracking** — Done when: Chase can start/stop a focus timer and maintain a scripture streak counter that persists across sessions.
4. **Budget tool** — Done when: Chase can log spending and wants, view totals, and understand where money went without leaving the app.
5. **90-day history** — Done when: Chase can scroll back 90 days, see analytics, generate an AI summary, and export data.
6. **Growth logging** — Done when: Chase can log habit entries across growth areas, see streaks, and record wins.
7. **Supabase sync** — Done when: `pull()` fires on load and `push()` fires on every save, with email OTP auth gate.

## NOT in V1

- HistoryTab split into sub-components (58 KB monolith — deferred to V2)
- iOS feature parity (handled by wellness-tracker-ios)
- Multi-user or shared data
- Notifications / reminders
- Vercel deployment (removed 2026-04-20; runs via `npm start`)
- Budget forecasting or recurring transactions

## Prior art & positioning

**Verdict:** PROCEED  
**Justification:** No single free tool covers morning/evening check-ins, task management, time tracking, budget, and growth habits in one localStorage/Supabase blob with Chase's identity voice and low-vision a11y requirements.  
**Positioning:** Wellness Tracker earns its seat as the canonical daily-loop surface for `chase_wellness_v1` — the data stack that Chase owns, controls, and cross-syncs to iOS.

## Constraints

- **Platform:** Web — React CRA, runs via `npm start`, local only
- **Storage:** localStorage (`chase_wellness_v1`, `chase_wellness_draft_v1`, `chase_wellness_meds_v1`) + Supabase sync (LIVE)
- **Stack:** React CRA + inline styles + Supabase (`unqtnnxlltiadzbqpyhh`, `app_key = 'wellness'`)
- **Auth:** Email OTP via Supabase
- **Monorepo path:** `portfolio/wellness-tracker/`
- **Entry:** `src/App.jsx` (shell owns all state)

## Success metrics

- Chase opens the app every morning and evening without friction.
- All six tabs load and save without errors after a cold reload.

## Risks

1. **Monolith growth** — `App.jsx` + HistoryTab are large; mitigation: split HistoryTab in V2, not mid-session.
2. **Supabase sync conflicts** — push-on-every-save can overwrite across devices; mitigation: `_syncAt` timestamp + pull-first-on-load pattern already in place.
3. **localStorage quota** — 90 days of rich data may approach limits; mitigation: export + prune workflow in HistoryTab.
