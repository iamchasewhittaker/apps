# RollerTask Tycoon — roadmap (iOS)

## Done (V1 — Clean Foundation)

- **3-tab shell**: Overview · Attractions · Finances (Staff and Map merged into Attractions filters)
- **Overview dashboard**: park rating %, profit today, guest count, alerts; rotating guest thoughts (30+ phrases, 10s timer); park status, priority attractions, quick actions
- **Attractions**: horizontal board (4 columns) + list toggle; zone + staff role filter chips; detail "ride panel" with status actions, edit sheet, delete
- **Finances**: today/weekly profit; top earning attractions
- **In-app Park Guide** (ParkGuideView): explains statuses, zones, staff roles, rating, profit, tips
- **Four statuses**: Open / Testing / Broken Down / Closed
- **Six zones**: Home / Career / Family / Growth / Health / Errands
- **Four staff roles**: Operator / Janitor / Mechanic / Entertainer
- **Backup**: schema v2 export/import via Settings; share sheet + file picker
- **Product docs**: [`docs/PRD.md`](docs/PRD.md) + [`docs/APP_FLOW.md`](docs/APP_FLOW.md)
- **Rebrand** to RollerTask Tycoon; bundle id `com.chasewhittaker.ParkChecklist` unchanged

## V2 — Game Feel

- **Subtasks** — checklist items within an attraction
- **Templates** — pre-built attractions for common task types
- **Drag-to-reorder** on board columns
- **Haptic feedback** on status change (completion, close)
- **Animations** — subtle coin / rating tick on attraction close
- **Smarter park rating** — streak bonus (no broken for 3+ days), zone balance bonus
- **Streaks** — track days with no broken attractions
- **Import merge mode** (by task `id`) — optional; replace-all is current default

## V3 — Ecosystem

- **Recurring attractions** (daily / weekly / monthly)
- **iOS Widgets** — glanceable park status (rating, open count, today's profit)
- **Siri shortcuts** — "Add attraction to Career zone"
- **Apple Watch** companion — quick status view
- **Push notifications** — overdue alerts, morning summary
- **Optional cloud sync** — iCloud or Supabase

## Planning & Tracking

- **Product framework:** [`PRODUCT_BUILD_FRAMEWORK.md`](../../PRODUCT_BUILD_FRAMEWORK.md) — 6-phase process for all apps
- **PRD:** [`docs/PRD.md`](docs/PRD.md)
- **App flow:** [`docs/APP_FLOW.md`](docs/APP_FLOW.md)
- **Linear:** [Park Checklist (iOS)](https://linear.app/whittaker/project/park-checklist-ios-b0d5872be46e)
