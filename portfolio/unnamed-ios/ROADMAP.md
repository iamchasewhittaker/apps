# Roadmap — Unnamed (iOS)

> Native iOS port of the Unnamed daily OS. Same flows as the web app. Containment is the feature.

---

## Change Log

| Date | Version | Summary |
|------|---------|---------|
| 2026-04-25 | v0.1.2 | UX parity with web: inbox edit/delete, sort lane help sheet (ⓘ), check clarification with locked-lane chips |
| 2026-04-25 | v0.1.1 | Build unblocked: mounted iOS 17.2 DMG; BUILD SUCCEEDED; installed on device |
| 2026-04-17 | v0.1 | Phase 1 complete: all 5 flows, 10/10 tests, installed on iPhone 12 Pro Max |

---

## Phase 1 — Use It (current)

**Rule: No new features until Chase has used the app for 7 consecutive days.**

- [x] All 5 flows functional
- [x] Persistent state via UserDefaults (`unnamed_ios_v1`)
- [x] Bottom tab navigation with badges
- [x] Lane lock irreversible until midnight
- [x] Check result shows correct phrase
- [x] Dark UI matching web app palette
- [x] Haptic feedback on Done and Lock
- [x] App icon (amber triangle)
- [x] 10/10 unit tests passing
- [x] Installed on iPhone 12 Pro Max
- [ ] **Use for 7 days — no features until then**

---

## Phase 2 — Evidence-Based (after 7 days of use)

Only add what real use proves is needed. Candidates:

- **Swipe gestures** — swipe item Done/Skip in focus view
- **Lane history** — which lanes got locked most often?
- **Streak** — how many days used? (only if it helps, not gamification)
- **iCloud sync** — data across devices
- **Share extension** — capture from other apps
- **Widget** — today's lane status on home screen
- **Notification** — morning nudge to lock lanes (only if he actually needs it)

**Phase 2 rule:** only add what 7+ days of real use proves is missing. Nothing else.

---

## Anti-Features (protect these forever)

- No additional lanes (4 is the permanent max)
- No due dates or priorities
- No tags or labels
- No settings or customization
- No streaks for streaks' sake
- No social features
- No integrations (v1)
