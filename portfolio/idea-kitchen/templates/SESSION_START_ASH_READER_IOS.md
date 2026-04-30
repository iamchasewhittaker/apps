# Session Start — Ash Reader iOS (2026-04-29)

> Paste this at the start of any new Claude Code chat to resume with full context.
> Say: "Read CLAUDE.md and HANDOFF.md first, then this prompt."

---

## Journey so far

- **2026-04-17** — v0.1: initial SwiftUI app -- paste input, smart Q&A chunker, chunk reader with copy + mark sent + progress bar, UserDefaults persistence, deployed to iPhone 12 Pro Max
- **2026-04-17** — v0.2: baked doc.txt (138k words) into bundle -- no paste required, app opens directly to reader, recursive refineSegments() to prevent oversized chunks, settings sheet with size picker
- **2026-04-17** — v0.3: full web v1.1 parity -- Themes tab (12 accordion cards with per-theme ChunkReader), AI summary picker (1k/1.5k/2k via summary.json), Actions tab (~190 items with filter bar + progress), Settings tab (prompt prefix, export/import, reset), stripMarkdown pipeline on all copies, haptic feedback, P6 "AR" yellow AppIcon, 26/26 tests
- **2026-04-29** — Phases 5-7 shipped: iCloud Key-Value sync (SyncedStore wrapping NSUbiquitousKeyValueStore with UserDefaults fallback + one-time migration), local reading reminders (NotificationManager with weekday calendar triggers), share sheet + streak tracking (StreakStore with current/longest streak), 41/41 tests passing

---

## Still needs action

- Device testing: verify iCloud sync, reminders, and share sheet on physical iPhone 12 Pro Max
- Xcode UI step required: Target > Signing & Capabilities > + Capability > iCloud > check "Key-Value storage"

---

## Ash Reader iOS state at a glance

| Field | Value |
|-------|-------|
| Version | v0.4-dev (Phases 5-7 complete) |
| URL | local Xcode |
| Storage key | `ash_reader_ios_` prefix (UserDefaults + NSUbiquitousKeyValueStore) |
| Stack | SwiftUI + iOS 17 + UserDefaults + iCloud KVS + UNUserNotificationCenter |
| Xcode prefix | -- (standard Xcode) |
| Bundle ID | com.chasewhittaker.AshReader |
| Linear | -- |
| Last touch | 2026-04-29 |

---

## Key files for this session

| File | Purpose |
|------|---------|
| portfolio/ash-reader-ios/CLAUDE.md | App-level instructions |
| portfolio/ash-reader-ios/HANDOFF.md | Session state + notes |
| AshReader/Chunker.swift | Q&A-aware smart chunker + stripMarkdown helper |
| AshReader/ChunkReaderView.swift | Chunk cards, copy, mark-sent, progress bar, share button |
| AshReader/SyncedStore.swift | iCloud KVS wrapper with UserDefaults fallback + migration |
| AshReader/StreakStore.swift | Current/longest reading streak tracking |
| AshReader/NotificationManager.swift | Weekday reading reminders via UNCalendarNotificationTrigger |
| AshReader/ProgressStore.swift | Per-tab UserDefaults persistence with key isolation |

---

## Suggested next actions (pick one)

1. Device testing: build + install on iPhone 12 Pro Max, verify iCloud sync + reminders + share sheet
2. App Store prep: review metadata, screenshots, privacy policy
3. Spotlight search over theme titles and action items
