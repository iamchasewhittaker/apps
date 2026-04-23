# SESSION_START — Fairway (iOS) Phase 2

> Paste into a new Claude Code session in `~/Developer/chase`. App is already built and on-device. This is a Phase 2 session — validation + edit flows, not a scaffold.

---

**Instructions for the agent**

1. Read `portfolio/fairway-ios/CLAUDE.md` and `portfolio/fairway-ios/HANDOFF.md` first.
2. Read root `CLAUDE.md` for monorepo conventions.
3. Run `cd ~/Developer/chase && git status -sb && git log -3 --oneline`.
4. Run `checkpoint` before any edits.

**Workspace:** `~/Developer/chase`
**App path:** `portfolio/fairway-ios/`
**Remote:** `github.com/iamchasewhittaker/apps`
**Linear:** —
**Xcode project prefix:** FW
**Bundle ID:** `com.chasewhittaker.Fairway`
**Storage key:** `chase_fairway_ios_v1`

**Goal:** [Fill in before pasting — e.g. "Add edit flow for heads" or "Correct seeded fertilizer dates"]

---

**In scope (V1 shipped — do not regress):**
- 5-tab structure: Zones, Lawn, Soil, Maintenance, More
- ZoneDetailView with Heads / Problems / Schedule / Beds (Zone 1)
- FertilizerView + SpreaderCalcView + ShrubBedView
- SoilTestView (13 nutrients, April 2026 data)
- MaintenanceView + MowLogView
- InventoryView
- FairwayStore + seedIfNeeded + single UserDefaults JSON blob

**Not in scope:**
- iCloud or Supabase sync
- Rachio API integration
- Push notifications
- Photo attachments
- Multi-property support
- App Store submission

---

## End-of-session checklist

```
 1. checkpoint
 2. Update CHANGELOG.md under ## [Unreleased]            # MANDATORY
 3. Update portfolio/fairway-ios/ROADMAP.md
 4. Update root ROADMAP.md Change Log row
 5. Update portfolio/fairway-ios/HANDOFF.md — State, Focus, Next, Last touch
 6. Update portfolio/fairway-ios/LEARNINGS.md            # MANDATORY — always at least one line
 6.5. If user-visible state changed: update docs/SHOWCASE.md
 7. Linear — heartbeat comment + move completed issues to Done
 8. If root CLAUDE.md portfolio table changed:
       cd portfolio/shipyard && npm run sync:projects
 8.5. Update brain/02-Projects/fairway-ios/README.md — bump frontmatter (status / shipped date if v1 cut), add a one-line dated log entry if user-visible state changed. Index only; don't mirror repo docs.
 9. git add <paths>
10. git commit -m "<type>(fairway-ios): <summary>"        # conventional commits
11. git push
12. Report: what shipped / what's next / any blockers.
```

## Security checklist

```
- Public repo. Never commit secrets, real financial figures, or real names tied to private data.
- .env gitignored. .env.example template only.
- No dangerouslySetInnerHTML (N/A — SwiftUI). No user-controlled redirects.
- If a secret is committed: rotate immediately, then purge history.
- AI keys server-side only (N/A for this app). Prompt-injection resistance on any tool-use path.
- Run /secure before first push.
```

## Best-practices checklist

```
1. xcodebuild clean build before claiming done.
2. Verify on device, not just simulator.
3. Small diffs. Conventional commits.
4. Empty + error states on every new screen.
5. Accessibility from day one. Chase has low vision — 44pt targets, VoiceOver labels, Dynamic Type, 4.5:1 contrast.
6. Honor the Phase 2 rule: no new features until Phase 1 validation is complete (Chase has used the app for a full spring setup).
7. HANDOFF.md = resume context. Git = shipped truth.
8. 15-minute stuck rule: change approach or ask.
```
