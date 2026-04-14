# Clarity Hub — Roadmap

## Shipped

- [x] CRA scaffold with 7-blob state management
- [x] Email OTP auth gate (Supabase, same as other portfolio apps)
- [x] MetricsEngine.js, CashFlowEngine.js, YNABClient.js (YNAB engines ported from Swift)
- [x] Placeholder tabs for all 7 apps

## In Progress / Next

### YNAB Tab (Priority 1) ✅ DONE — 2026-04-13
- [x] Setup flow: token entry + verify → budget picker → category role assignment → income sources
- [x] Dashboard: safe-to-spend (daily/weekly/monthly), budget health bar, obligations coverage
- [x] Bills planner: grouped by Needs Attention / Partial / Covered
- [x] Income gap: expected income vs required, salary target
- [x] Cash flow timeline: chronological events with today marker
- [x] Spending: yesterday/this week/this month from transactions
- [x] Fund category write-back (PATCH to YNAB with confirmation)
- [x] Settings: re-enter YNAB token, re-run setup

### Time Tab (Priority 2)
- [ ] Focus timer: start/pause/resume/stop, `Date.now()` elapsed math
- [ ] Manual session log: title, category, duration
- [ ] Sessions list: newest-first, delete
- [ ] Scripture streak: today toggle, reference, consecutive-day count

### Budget Tab (Priority 2)
- [ ] Scenario summary: baseline + stretch side-by-side
- [ ] Scenario editors: income/needs/wants fields (dollars → cents)
- [ ] Wants tracker: quick-add (+$5/+$20/+$50), custom, reset

### Check-in Tab (Priority 3)
- [ ] Morning form: sleep onset/quality/readiness (1-10), notes
- [ ] Evening form: meds checklist, focus/mood, ADHD symptoms, exercise, eating, stress, faith, caffeine, day quality, spending notes, tomorrow focus
- [ ] Pulse checks: quick mood snapshot with note
- [ ] History: past entries list with detail view

### Triage Tab (Priority 3)
- [ ] Capacity picker (0-4), auto-reset daily
- [ ] Task list: add/complete/delete with weighted slots display
- [ ] Ideas pipeline: 3 stages, advance/edit
- [ ] Wins logger: by category with note

### Growth Tab (Priority 3)
- [ ] 7 area cards (gmat/job/ai/pm/claude/bom/cfm): streak + total minutes
- [ ] Session logger: area, minutes, note, milestones, backgrounds
- [ ] History: recent sessions
- [ ] Weekly bar: last 7 days aggregated minutes

### RollerTask Tycoon Tab (Priority 4)
- [ ] Attractions list: by zone, status badges
- [ ] Attraction CRUD: add/edit/delete with status transitions
- [ ] Park cash: balance display, close-attraction earns reward
- [ ] Profit ledger: history of earnings

### Settings Tab (Priority 4)
- [ ] YNAB token entry/update
- [ ] Sign out button
- [ ] Export all data as JSON download
- [ ] Last synced timestamp per app

## Future
- [ ] Deploy to Vercel + set Supabase env vars
- [ ] Add to portfolio CI workflow
- [ ] iOS sync: add SyncService to ClarityUI Swift package
- [ ] Wire all 5 Clarity iOS apps + 2 SwiftData apps to push/pull
- [ ] Offline indicator when Supabase push fails
- [ ] Cross-tab summary dashboard (homepage view before selecting a tab)
