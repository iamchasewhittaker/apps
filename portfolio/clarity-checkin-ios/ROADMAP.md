# Roadmap — Clarity Check-in (iOS)

## v0.1 — Now (in progress)
- [x] Models (CheckinBlob, MorningData, EveningData, PulseCheck, DraftBlob)
- [x] CheckinStore (@Observable, draft autosave, same-day merge, pulse, meds)
- [x] Morning check-in flow (Sleep → Morning Start)
- [x] Evening check-in flow (Med Checkin → Health/Lifestyle → End of Day)
- [x] Past days list + entry detail view
- [x] Pulse check sheet
- [x] Meds editor sheet
- [x] Daily quote banner (36 quotes, day-of-year rotation)
- [x] App icon asset in `AppIcon.appiconset` + portfolio icon spec (`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`)
- [x] Create Xcode project + wire ClarityUI package
- [ ] Verify on simulator end-to-end

## v0.2 — Next
- [ ] Doctor Prep view — screenshot-ready prescriber summary (meds + effects/side effects)
- [ ] 14-day patterns chart (mood, sleep, focus bar charts)
- [ ] Quote history view (past quotes by theme)
- [ ] CSV/JSON export of entries
- [ ] Streak badges for consecutive check-in days

## v0.3 — Later
- [ ] Widget — today's check-in status on home screen
- [ ] Supabase sync (if/when multi-device is needed)
- [ ] AI monthly summary (calls Anthropic API)
- [ ] Siri Shortcut to open morning check-in

## Out of scope (for now)
- Tasks, time tracking, budget, growth (separate apps)
- Push notifications (can add in v0.2 if daily reminder is wanted)
