# Roadmap — Spend Radar (web)

> Read-only companion dashboard for the Spend Radar Google Sheet.

---

## Current state — v0.1

| Area | Status |
|------|--------|
| CRA scaffold + React 18 entry | ✅ Done |
| Header with brand + refresh + sync timestamp | ✅ Done |
| Monthly/Yearly/Active/Lapsed metric row | ✅ Done |
| Subscriptions by Category card grid | ✅ Done |
| Cancel candidates section (Lapsed + Irregular) | ✅ Done |
| Recent receipts (30d) table | ✅ Done |
| `localStorage` cache with `_syncAt` | ✅ Done |
| Tiny CSV parser | ✅ Done |
| `CSV_URLS` pasted into `constants.js` | 🔲 User step |
| Vercel deploy | 🔲 User step |

---

## V1 Backlog

| # | Priority | Task | Why |
|---|----------|------|-----|
| 1 | 🟡 Medium | Group receipts by day with a subtotal row | Faster at-a-glance daily spend check |
| 2 | 🟡 Medium | Merchant detail modal — click a row to see all receipts from that sender | Quick audit of a specific service |
| 3 | 🟢 Low | Month selector for the Receipts table (default: last 30d) | Scroll further back without pulling the whole history |
| 4 | 🟢 Low | Cancel-candidate "open in Sheet" button | Jump to the source row |
| 5 | 🟢 Low | Dark/light toggle | Default dark; light mode for bright-room debugging |

---

## V2 Ideas

| # | Idea | Notes |
|---|------|-------|
| V2-1 | Install as PWA on phone | Manifest + icons already present; add install banner |
| V2-2 | Monthly trend chart | Sparkline per category over 6 months |
| V2-3 | Merge with `funded-web` as a shared spending tab | Only after Clarity Budget bridge lands |
