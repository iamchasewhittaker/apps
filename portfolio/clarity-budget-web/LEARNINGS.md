# Clarity Budget Web — LEARNINGS

## 2026-04-20 — Transaction architecture

**Decision:** Transactions stored in a separate `chase_budget_web_tx_v1` localStorage key rather than inside `BudgetBlob`. This keeps the Supabase sync clean — `pushBlob` never needs to strip transactions before syncing, and there's no risk of merchant-level PII leaking to the cloud.

**YNAB split transactions:** Parent transactions with `subtransactions.length > 0` have no `category_name` on the parent. Always iterate `subtransactions` for category attribution. Missing this gives misleading "Uncategorized" totals.

**Cache dependency order:** `refreshTransactions` is a dep of `refreshMetrics` (not the other way). Changing token or budgetId invalidates both. The `force` flag bypasses the 15-min cache when user explicitly clicks "Refresh numbers".

**useMemo for spending analytics:** Computed inline in HomeDashboard for now. When Session 2 extracts `SpendingBreakdown.tsx`, move these memos into that component or into `lib/aggregations.ts`.
