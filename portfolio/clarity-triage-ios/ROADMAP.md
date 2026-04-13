# Roadmap — Clarity Triage (iOS)

## v0.1 — Shipped (MVP)

- [x] Capacity picker (four levels, daily reset)
- [x] Tasks: add, category, size, complete, delete, “fit remaining slots” filter
- [x] Ideas: capture → pressure test → explore, advance, delete
- [x] Wins: eight categories, optional note, today’s list
- [x] Daily quote on Tasks tab (`QuoteBanner` + `triageQuotes`)
- [x] Programmatic `ClarityTriage.xcodeproj` + unit tests
- [x] **App icon + branding** — `AppIcon.png` (nested chevron), `docs/design/` wide + explore mockups, [`docs/BRANDING.md`](docs/BRANDING.md), `CLAUDE.md` links (2026-04-13)

## v0.2 — Next

- [ ] Swipe actions on tasks / ideas (optional polish)
- [ ] Haptics on complete / stage advance
- [ ] Accessibility pass with Accessibility Inspector
- [ ] Re-run `xcodebuild test` on **iPhone 16** simulator when that runtime is installed (match Phase 1 doc command)

## v0.3 — Later

- [ ] Widget: today capacity + active task count
- [ ] Export blob (JSON) for backup
- [ ] iCloud / sync (only if multi-device becomes a requirement)

## Out of scope (by design)

- SwiftData (blob + UserDefaults only, same family pattern as Check-in)
- Web / Supabase (local-first)
