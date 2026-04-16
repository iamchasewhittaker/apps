# Roadmap — Clarity Command (iOS)

## v0.1 — Shipped (2026-04-14)
- [x] Models (CommandBlob, DayEntry, MorningCommit, EveningReflection, Target)
- [x] CommandStore (@Observable, load/save, target tracking, streaks, scoring)
- [x] CommandPalette — gold accent (`#c8a84b`) color system
- [x] Mission tab: morning commit + evening reflection
- [x] Conviction panel (faith + family urgency)
- [x] Scripture card (daily rotation — BoM, D&C, KJV)
- [x] Counter banner (days since commitment)
- [x] Target list with completion toggles
- [x] Evening reflection form with daily score
- [x] Scoreboard tab: week grid, month calendar, area streaks, stats
- [x] Settings tab: preferences, data management
- [x] Reusable components: GoldButton, StatusBadge, TargetRow
- [x] Unit tests (CommandBlobTests — encode/decode, scoring, streaks)
- [x] ClarityUI shared package integration
- [x] Standard portfolio docs (CLAUDE, CHANGELOG, HANDOFF, LEARNINGS, ROADMAP, BRANDING)

## v0.2 — In progress
- [ ] Physical device deploy + signing verification — see `docs/DEVICE_QA.md`
- [x] Supabase sync — same `user_data` / `app_key = command` as web (`CommandCloudSync`, Settings UI, `_syncAt` on `CommandBlob`)
- [ ] App icon: replace interim programmatic PNG with final command glyph (1024)
- [ ] ~~CloudKit~~ — dropped in favor of Supabase (one sync story with web)
- [ ] Today widget (WidgetKit) — morning/evening status + current streak
- [ ] Push notification reminders (configurable morning + evening times)
- [ ] Siri Shortcuts ("Start my morning commit", "Evening review")
- [ ] Haptic feedback on target completion and daily score commit

## v0.3 — Later
- [ ] Trend charts — weekly/monthly score trends over time
- [ ] Export (CSV/JSON) of daily entries
- [ ] Accessibility audit with Accessibility Inspector
- [ ] Dark/light mode toggle (currently dark-only)
- [ ] AI-powered weekly summary (Anthropic API)
- [ ] Watch companion — quick target check-off from wrist

## Out of scope (for now)
- Check-in, triage, time, budget, growth (separate Clarity apps)
- Social/sharing features
