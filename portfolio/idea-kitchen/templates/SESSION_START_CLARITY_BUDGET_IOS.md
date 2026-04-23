# SESSION_START — Clarity Budget iOS Retroactive Foundation Docs

> Pre-filled. Paste directly into the Idea Kitchen Claude Project. No brackets to fill in.

---

**Mode:** Retroactive documentation — Clarity Budget iOS is a functional v0.2 SwiftUI app.
**App:** Clarity Budget iOS
**Slug:** clarity-budget-ios
**One-liner:** YNAB-backed Spend-Track-Save budget for iOS — Today tab shows month/week/day STS snapshot; YNAB token stored in Keychain; supports category assignment (Fund) with confirmation.

---

## What to skip

Do not run STEP 0, STEP 1.5, or STEP 2. v0.2 is functional; decisions are made.

---

## What to produce

All six STEP 6 blocks. Priority:
1. **SHOWCASE.md** — Shipyard needs this at `/ship/clarity-budget-ios`
2. **BRANDING.md** — Clarity palette (sky blue finance accent), STS aesthetic, Keychain security framing
3. **PRODUCT_BRIEF.md** — distill from context below
4. **PRD.md** — reflect v0.2 shipped scope; V3 = Supabase sync stub + multi-scenario
5. **APP_FLOW.md** — document the YNAB fetch → Today STS → category assign → Fund flow
6. **SESSION_START_clarity-budget-ios.md** — stub only

Output paths: `portfolio/clarity-budget-ios/docs/`

---

## App context — CLAUDE.md

**Version:** v0.2
**Stack:** SwiftUI + @Observable + UserDefaults + YNAB API + Keychain
**Storage key:** `chase_budget_ios_v1`
**YNAB Keychain key:** `com.chasewhittaker.ClarityBudget`
**Bundle ID:** `com.chasewhittaker.ClarityBudget`
**Xcodeproj prefix:** `CB*`
**URL:** local Xcode

**What this app is:**
A native iOS YNAB companion. The "Today" tab shows a Spend-Track-Save (STS) snapshot: current month total, current week total, today's spending. Supports category-level browsing and a Fund flow — tap a category, enter an amount, confirm → YNAB PATCH (same as Funded iOS). YNAB Personal Access Token stored in macOS/iOS Keychain, never in UserDefaults.

**YNAB integration:**
- Read: fetch current month categories + transactions
- Write: `PATCH /budgets/{budget_id}/months/current/categories/{category_id}` with new `budgeted` amount
- Token: Keychain item `com.chasewhittaker.ClarityBudget` — never committed, never in UserDefaults

**Architecture:**
- `@Observable` state management
- UserDefaults for non-sensitive state (`chase_budget_ios_v1`)
- Keychain for YNAB token
- CB* prefix for all xcodeproj identifiers
- Stub Supabase sync planned (V3)

**Dual-scenario support:**
- Two YNAB scenarios can be toggled (e.g., "if I get this job" vs. "current") — dual-scenario budget comparison

**Brand system:**
- Sky blue primary — budget/finance lane
- AppIcon: budget/graph symbol on Clarity dark background
- `docs/BRANDING.md` + AppIcon exist in-repo

---

## App context — HANDOFF.md

**Version:** v0.2
**Focus:** Today STS + YNAB import + PATCH (Fund) all functional. Keychain auth working.
**Last touch:** 2026-04-21

**Next (V3):**
- Stub Supabase sync (`chase_budget_ios_v1` → shared project)
- Transaction history view (recent debits/credits per category)
- Share STS totals with Clarity Command iOS scoreboard
- Add wants toggle (discretionary vs. essential) to STS view
