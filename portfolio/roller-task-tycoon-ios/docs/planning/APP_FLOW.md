# App Flow — RollerTask Tycoon (iOS)

Park-specific; canonical blank: `docs/ios-app-starter-kit/APP_FLOW.md`.

For product narrative and glossary, see `docs/PARK_OPERATIONS_CONSOLE.md` and the how-to reference `docs/PARK_OPERATIONS_KEY.md`.

## Screen list (current)

- **Overview (Park Operations Console)** — dashboard: header metrics, park status / guest thoughts / priority / alerts cards, quick actions. Toolbar: Templates, Export, Import, Settings.
- **Attractions** — board (four status columns) or list; tap card → detail “ride panel” (status buttons, subtasks, edit). Optional column/zone focus from Overview quick actions or Map.
- **Staff** — role-centric summary derived from task assignments.
- **Finances** — today / week profit from ledger; top earners.
- **Map** — zone list → switches to Attractions with zone filter.
- **New Attraction** — sheet (global inset button): create/edit fields (see key doc).
- **Log Profit** — sheet from Overview quick action: manual ledger + cash.
- **Templates** — sheet: categorized presets → add tasks.
- **Settings** — sheet: readable fonts (and room for future prefs).
- **Share sheet** — system UI for exported JSON.
- **File picker** — system document import for `.json` backup.

No separate onboarding or auth in v1.

## Navigation structure

- **Tab bar** — five primary destinations: Overview · Attractions · Staff · Finances · Map (`TabView` in `ContentView`).
- **Navigation stacks** — each tab that needs push uses its own `NavigationStack` (e.g. Overview, Attractions, Map → filtered list).
- **Modal sheets** — New Attraction, Log Profit, Templates, Settings, Attraction editor from detail.
- **Alerts** — import replace-all confirmation, export/import errors as needed.
- **Activity view** — `UIActivityViewController` wrapper for export.
- **Global inset** — **+ New Attraction** above the tab bar (not duplicated per tab).

## First screen

**Overview** — user lands on the operations console; header shows rating, profit today, guests, alerts; cards summarize park state and shortcuts.

## Main actions

- **Move an attraction through workflow** — Open → Testing → Broken Down → Closed (from detail panel buttons). **Closed** pays `rewardDollars` into park cash and appends a **ProfitLedgerEntry** (V1: no completion sound).
- **Add / edit** — New Attraction or Edit from detail; templates bulk-add from Overview toolbar.

## Primary flow

Launch → **Overview** visible → user switches tab or uses quick actions / global add → on **Attractions**, open detail → change status or edit → on **Close**, cash + ledger update → **Finances** reflects entries.

## Secondary flows

- **Templates:** Overview toolbar → Templates sheet → pick template / category → tasks added.
- **Export:** Overview toolbar → Export → JSON generated → share sheet.
- **Import:** Overview toolbar → Import → pick `.json` → if valid, **Replace all** confirmation → tasks + ledger + cash per backup → feedback (toast / alert).
- **Settings:** Overview toolbar → Settings → toggle readable fonts → dismiss.
- **Log profit:** Overview quick action or equivalent → enter amount → ledger + cash.
- **Map → zone:** Map tab → tap zone → **Attractions** tab with that zone filter.

## Empty states

- **No attractions:** Board/list shows empty columns or empty list; user can **New Attraction**, use **Templates**, or import backup. See `ParkAttractionsView` / `ContentView`.

## Error states

- **Export failure:** Surface error if file write fails; do not claim success.
- **SwiftData failures:** Rare; log / crash in dev; avoid silent data loss (follow existing patterns).
- **Import:** Invalid JSON, unsupported envelope, bad fields → alert with message; **no** partial apply before user confirms replace.

## Permission flows

None required for v1 (no camera, location, notifications yet).

## UX questions (answered for baseline)

| Question | Answer |
|----------|--------|
| First screen? | Overview (Park Operations Console) |
| Main action? | Progress attractions / close for profit / add attractions |
| Minimal taps to success? | Open app → switch to Attractions → open task → status button |
| Stuck points? | First-time user may need to discover templates/import in Overview toolbar |
| No data? | Empty attractions + New Attraction / templates |

## Low-fidelity wireframes

Add Figma or screenshots here when available.

## Notes

Import uses Overview toolbar + file picker + confirm dialog; optional future: post-import summary counts.
