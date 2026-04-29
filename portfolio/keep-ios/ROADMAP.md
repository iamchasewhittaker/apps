# Roadmap — Keep (iOS)

MVP-first. Ship one slice at a time.

## Vision
Give every item a home. Triage one thing at a time, assign kept items to a spot, and watch the chaos shrink.

## v0.1 — Phase 1 ✅ Built (2026-04-29)
- [x] Product docs: PRODUCT_BRIEF.md, PRD.md, APP_FLOW.md
- [x] Data models: Room, Spot, Item, KeepBlob
- [x] `@Observable @MainActor KeepStore` + Codable + UserDefaults
- [x] PhotoStore — file-based JPEG storage
- [x] KeepTheme — warm amber palette, dark mode only
- [x] HomeView — room list + progress bars + stats banner
- [x] RoomDetailView — spots + unsorted items
- [x] AddItemView — camera + name, batch mode
- [x] TriageView — Keep / Donate / Toss / Unsure, one item at a time
- [x] SpotPickerSheet — assign kept items to a spot
- [x] CoachSheet — 3 yes/no questions after 3+ consecutive Unsure
- [x] StatsView — breakdown + donation bags counter
- [x] KeepBlobTests — 7 backward-compat + roundtrip tests

## Next — Verify & Install
- [ ] Open `Keep.xcodeproj`, run ⌘U — verify all 7 tests pass
- [ ] ⌘R — install on iPhone, walk through full triage loop
- [ ] Create first real room (Garage or wherever)
- [ ] Add 5+ real items with photos
- [ ] Complete a full triage session
- [ ] Verify donation bags counter works
- [ ] AppIcon — warm amber on dark, letter K or house motif

## Phase 2 — Ideas parking lot

From PRD "Not in V1" cut list:
- Search: "Where is my camping stove?" → "Garage → Shelf B"
- Barcode scanning for product identification
- Categories / tags (camping gear, kitchen tools, seasonal)
- Kassie access — shared data (iCloud sync or Supabase)
- Export donation list (share sheet → text/PDF)
- Web companion (`keep-web`)
- "New item arrives" quick-add from home screen widget
- Smart suggestions: "23 items untouched since you added them"
- Photo gallery per room
- iCloud sync
- Notifications / reminders

## Out of scope (V1)
- Network access — fully offline
- Barcode scanning
- Categories or tags
- Multi-user / Kassie access
- Web companion
- Export
- iCloud sync
- Notifications

## Definition of done (for any item)
1. Works on first run with no prior state
2. Works on subsequent runs with existing data
3. Doesn't break existing features
4. Builds + `xcodebuild test` passes
5. No new magic numbers — use `KeepConfig`
