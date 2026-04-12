# Release plan — RollerTask Tycoon (iOS)

Park-specific; canonical blank: `docs/ios-app-starter-kit/RELEASE_PLAN.md`.

## Preconditions

- [ ] [QA_CHECKLIST.md](QA_CHECKLIST.md) passed for the build
- [ ] `CHANGELOG.md` updated under shipped version (not only `[Unreleased]` if tagging)
- [ ] Version / build number bumped in Xcode as needed
- [ ] No known crashers on checklist + export paths

## Apple / compliance

- [ ] **Signing:** correct team, bundle ID, provisioning
- [ ] **App Privacy:** data collection answers (local-only baseline: minimal)
- [ ] **Encryption export compliance** answered in App Store Connect if required
- [ ] **Icons:** including 1024×1024 App Store icon when approaching store submission

## TestFlight

- [ ] Archive → Distribute → TestFlight
- [ ] Internal tester smoke: install, checklist, export
- [ ] Collect one round of feedback before wider distribution

## App Store (when ready)

- [ ] Screenshots for required device sizes
- [ ] Description, keywords, support URL
- [ ] Review notes (test account N/A if none)

## Post-release

- [ ] Tag git (optional) or note commit in CHANGELOG
- [ ] Linear project / issues updated to **Done** or next milestone
- [ ] Repo root [ROADMAP.md](../../../../ROADMAP.md) Change Log row if portfolio-visible

## References

- Planning workflow: [PLANNING_WORKFLOW.md](PLANNING_WORKFLOW.md)
- App context: [CLAUDE.md](../../CLAUDE.md)
