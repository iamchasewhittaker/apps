# Clarity Command — Roadmap

## Now (Phase 1 — complete)
- [x] Web app: morning mission + evening reflection + scoreboard + settings
- [x] LDS scripture bank (15 entries, expandable)
- [x] Wife's words rotation (15 entries, expandable)
- [x] Conviction messages for missed targets
- [x] Both urgency counters
- [x] Daily log with job action logger
- [x] Deploy-ready (needs .env + Vercel)

## Next (Phase 2 — verified 2026-04-27)
- [x] Job Search HQ: add daily action counter to FocusTab
- [x] Job Search HQ: write daily summary blob to Supabase so Command can read cross-app
- [x] Pull live Job Search data into Scoreboard (cross-app Supabase reads)
- [x] iOS native Clarity Command app
- [x] iOS Clarity Command pulls + renders cross-app summaries
- [ ] Wellness Tracker: add morning/evening accountability prompts to TrackerTab
- [ ] Pull Wellness check-in data into Scoreboard (web pulls; awaiting first per-user push to verify iOS rendering)
- [ ] Redeploy web to Vercel (deferred — `npm start` sufficient for current daily use)

## Later (Phase 3+)
- [ ] Push notifications for missed morning commit (reminder at 9am)
- [ ] Weekly summary email/notification
- [ ] Integrate Clarity Time productive hours
- [ ] Integrate Clarity Budget daily check-in
- [ ] Integrate Clarity Growth scripture streak
