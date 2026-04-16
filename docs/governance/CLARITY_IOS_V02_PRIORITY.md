# Clarity iOS suite — v0.2 portfolio priority

> **Decision (2026-04-15):** After resolving web roles ([`PRODUCT_LINES.md`](PRODUCT_LINES.md)), the first **domain** app to receive **v0.2 feature depth** is **Clarity Check-in (iOS)** — highest-touch daily medical / mood data and the strongest case for exports + charts before rolling the same pattern to Triage, Time, Budget, and Growth.

## Order of operations

1. **Clarity Check-in iOS** — ship items in [`portfolio/clarity-checkin-ios/ROADMAP.md`](../clarity-checkin-ios/ROADMAP.md) § v0.2 (doctor prep, 14-day charts, quote history, export, streak badges).
2. **Supabase on the five domain apps** — only after Check-in v0.2 **or** if multi-device pain exceeds feature depth; use the same shared project and `app_key` pattern as Clarity Hub (`checkin`, `triage`, `time`, `budget`, `growth`). **Clarity Command iOS** already uses Supabase for `command` (web parity).

## Out of scope for this note

- **Clarity Command iOS** widgets / push / Siri — tracked in that app’s `ROADMAP.md`.
- **Wellness Tracker** — separate product; see web roles table in `PRODUCT_LINES.md`.
