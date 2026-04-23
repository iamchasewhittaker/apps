# SESSION_START — Funded iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Funded iOS is a functional v0.3 SwiftUI app (renamed from Conto).
**App:** Funded iOS
**Slug:** funded-ios
**One-liner:** YNAB read + assign flow for iOS — browse budget categories, see available amounts, and Fund a category with one tap; YNAB token secured in Keychain with confirmation before any PATCH.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. v0.3 is functional; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/funded-ios`
2. **BRANDING.md** — green accent, "funded" confidence framing, Keychain security aesthetic
3. **PRODUCT_BRIEF.md** — distill from context below; note renamed from Conto
4. **PRD.md** — reflect v0.3 shipped scope; V4 = multi-month view + transaction drill-down
5. **APP_FLOW.md** — document the YNAB fetch → category browse → Fund → confirm → PATCH flow
6. **SESSION_START_funded-ios.md** — stub only

Output paths: `portfolio/funded-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.3 (renamed from Conto)
**Stack:** SwiftUI + SwiftData + `AppStorage` + YNAB API + Keychain
**Storage:**
- SwiftData: local category cache
- `AppStorage` keys: `chase_ynab_clarity_ios_*` (settings, selected budget)
- Keychain: YNAB Personal Access Token (`com.chasewhittaker.Funded`)
**Bundle ID:** `com.chasewhittaker.Funded`
**URL:** local Xcode

**What this app is:**
A native iOS YNAB companion focused on the "Fund" flow — the act of assigning money to a budget category. Browse all YNAB categories, see available amounts and month-to-date spending, tap a category, enter an amount, confirm → YNAB PATCH (`PUT /budgets/{budget_id}/months/current/categories/{category_id}`). YNAB token is in Keychain (never in UserDefaults or committed code).

**YNAB integration:**
- Read: GET current month's categories for the selected budget
- Write: PUT category `budgeted` amount (assign/reassign)
- Auth: Personal Access Token in Keychain — confirmation dialog before every PATCH

**Relationship to Funded Web:**
- `portfolio/funded-web/` is the read-only web companion (YNAB assign not yet wired on web)
- iOS has the more complete implementation (read + write)

**Brand system:**
- Green accent (`#22c55e`) — "funded" confidence, money positive
- Clean, trust-inspiring — Keychain badge, confirmation dialog before writes
- Voice: calm and decisive — "Netflix: $15 remaining. Fund it?"

---

## App context — HANDOFF.md

**Version:** v0.3
**Focus:** Fund flow (read + write) fully functional. Keychain auth stable.
**Last touch:** 2026-04-21

**Next (V4 candidates):**
- Multi-month view (trend: how much was budgeted vs. spent per category, last 3 months)
- Transaction drill-down per category (list of recent transactions for the tapped category)
- Quick assign: "move money from [category] to [category]" flow
- Share available-to-assign balance prominently at the top
