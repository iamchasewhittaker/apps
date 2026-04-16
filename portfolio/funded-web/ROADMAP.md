# Roadmap — Funded Web

MVP-first. Ship one slice at a time.

## Vision

YNAB dashboard in the browser — config synced via Supabase; live numbers from YNAB API. Parity with **Funded iOS** for money clarity (income hints, categorization triage).

## Shipped

- [x] Split from clarity-hub — CRA, single blob, `app_key: ynab`
- [x] Setup: token → budget → category roles → income sources
- [x] Dashboard: safe-to-spend, budget health, bills + fund, income gap, cash flow, spending
- [x] Shared portfolio auth (OTP) + env-driven canonical redirect
- [x] **Income setup hints** — YNAB this month / last month / RTA fallbacks + errors
- [x] **Categorization Review** — uncategorized outflows, suggestions, triage fields → YNAB memo PATCH; overrides + `transactionMetadata` in blob
- [x] Deploy: https://funded-web.vercel.app

## Next (ideas)

- [ ] PWA polish / offline banner for stale YNAB data (iOS has 24h stale pattern)
- [ ] Surface PATCH errors inline everywhere (some paths use modal error only)
- [ ] Optional: web↔iOS parity doc for blob field naming (`transactionMetadata` vs SwiftData)

## Out of scope (for now)

- Multi-budget switcher
- Full YNAB rule engine in web (keep suggestion engine aligned with iOS only)

## Definition of done

1. Works with empty localStorage and with existing blob
2. `npm run build` clean
3. Docs touched when behavior or ops change: CHANGELOG, HANDOFF, LEARNINGS as appropriate
