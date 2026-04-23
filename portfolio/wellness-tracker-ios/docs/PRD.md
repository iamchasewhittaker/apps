# PRD — Wellness Tracker iOS

## V1 features (Phase 2 shell — current)

1. **Check-in tab** — Done when: Chase can fill the morning/evening check-in form, same-day draft restores, past days render read-only. (Five tabs total; Check-in is the default.)
2. **Tasks tab** — Done when: Chase can view today's task list from UserDefaults local state with no crashes.
3. **Time tab** — Done when: Chase can start and stop a basic focus timer that persists across app launches.
4. **Capture tab** — Done when: Chase can type a quick note and save it to local state.
5. **Sync tab** — Done when: App displays Supabase connection status (connected / disconnected) without enabling read/write.
6. **W+sunrise AppIcon** — Done when: App icon displays on home screen with the W+sunrise design at all required iOS sizes.
7. **Supabase wiring** — Done when: The sync infrastructure (`app_key = 'wellness'`, same project as web) is present in code, not yet enabled.

## NOT in V1 (Phase 2 shell)

- Full task CRUD with categories (Phase 3 — current Tasks tab is read-only)
- Focus session timer with history (Phase 3 — current Time tab is single-session only)
- Growth tab: 7 growth areas + streaks (Phase 3)
- Supabase read/write enabled (Phase 3 — wiring present, sync display-only)
- Budget tab (Phase 3+)
- Notifications / widgets
- iPad layout

## Phase 3 scope (next)

- Check-in tab: full parity with web `TrackerTab` — richer wizard, history view beyond same-day draft
- Tasks tab: full task CRUD with categories, match web `TasksTab`
- Time tab: focus session timer with history, match web `TimeTrackerTab`
- Growth tab: 7 growth areas + streaks, match web `GrowthTab`
- Sync: enable Supabase read/write with `app_key = 'wellness'`

## Prior art & positioning

**Verdict:** PROCEED  
**Justification:** The web app is the canonical surface; this is a native companion, not a competitor. No third-party app covers Chase's specific data stack (`chase_wellness_v1`) with cross-platform Supabase sync.  
**Positioning:** Wellness Tracker iOS earns its seat as the native face of Chase's wellness data — same blob, SwiftUI feel, iOS-first UX.

## Constraints

- **Platform:** iOS — SwiftUI + `@Observable`
- **Storage:** UserDefaults (`chase_wellness_ios_v1`) — primary; Supabase optional (Phase 3)
- **Stack:** SwiftUI + `@Observable` + UserDefaults + optional Supabase
- **Bundle ID:** `com.chasewhittaker.WellnessTracker`
- **Supabase project:** `unqtnnxlltiadzbqpyhh` — same as web, `app_key = 'wellness'`
- **Monorepo path:** `portfolio/wellness-tracker-ios/`

## Success metrics

- App launches on device without crashes in all five Phase 2 tabs (Check-in, Tasks, Time, Capture, Sync).
- AppIcon appears correctly on home screen at all sizes.
- Same-day check-in draft restores after backgrounding the app.

## Risks

1. **Data divergence** — iOS UserDefaults and web localStorage may drift before Supabase sync is enabled in Phase 3; mitigation: clearly document that Phase 2 is local-only in HANDOFF.md.
2. **Phase 3 scope creep** — full parity with a 6-tab web app is large; mitigation: one tab per milestone, verify on device before proceeding.
3. **`@Observable` + UserDefaults pattern** — newer pattern with less community precedent; mitigation: establish working load/save in Phase 2 shell before expanding.
