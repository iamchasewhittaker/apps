import type { YNABTransaction, YNABTransactionUpdate } from "@/lib/ynab";
import type { SuggestionRow } from "./persist";
import {
  CONFIDENCE_THRESHOLD,
  type CategorizableTxn,
  type CategoryAllowlistEntry,
  type FewShotExample,
  type Suggestion,
  type SuggestionStatus,
} from "./types";

export function buildAllowlist(
  groups: Array<{
    name: string;
    hidden: boolean;
    categories: Array<{ id: string; name: string; hidden: boolean; deleted: boolean }>;
  }>
): {
  list: CategoryAllowlistEntry[];
  ids: Set<string>;
  byId: Map<string, CategoryAllowlistEntry>;
} {
  const list: CategoryAllowlistEntry[] = [];
  for (const g of groups) {
    if (g.hidden) continue;
    for (const c of g.categories) {
      if (c.hidden || c.deleted) continue;
      list.push({ id: c.id, name: c.name, groupName: g.name });
    }
  }
  const ids = new Set(list.map((c) => c.id));
  const byId = new Map(list.map((c) => [c.id, c]));
  return { list, ids, byId };
}

export function buildFewShots(history: YNABTransaction[]): FewShotExample[] {
  const examples: FewShotExample[] = [];
  for (const t of history) {
    if (t.deleted) continue;
    if (!t.payee_name) continue;
    if (t.subtransactions.length > 0) {
      for (const s of t.subtransactions) {
        if (s.deleted || !s.category_name) continue;
        examples.push({
          payee: t.payee_name,
          amount: s.amount,
          category: s.category_name,
          group: "(split)",
        });
      }
      continue;
    }
    if (!t.category_name || t.category_name === "Split") continue;
    examples.push({
      payee: t.payee_name,
      amount: t.amount,
      category: t.category_name,
      group: "",
    });
  }
  return examples;
}

export function toCategorizable(t: YNABTransaction): CategorizableTxn {
  const isSplit = t.subtransactions.length > 0;
  return {
    id: t.id,
    date: t.date,
    amount: t.amount,
    payeeName: t.payee_name,
    memo: t.memo,
    isSplit,
    subtransactions: isSplit
      ? t.subtransactions
          .filter((s) => !s.deleted)
          .map((s) => ({ id: s.id, amount: s.amount, memo: s.memo }))
      : undefined,
  };
}

/**
 * Validate a suggestion against the category allowlist + split invariants.
 * Returns the partition (auto_applied, pending, invalid) for this row plus
 * the (possibly nulled) suggestion to persist.
 */
export function classifySuggestion(args: {
  suggestion: Suggestion;
  txn: CategorizableTxn;
  allowedIds: Set<string>;
}): { status: SuggestionStatus; suggestion: Suggestion } {
  const { suggestion, txn, allowedIds } = args;

  if (txn.isSplit) {
    const subs = suggestion.subtransactions ?? [];
    if (subs.length !== (txn.subtransactions?.length ?? 0)) {
      return {
        status: "invalid",
        suggestion: { ...suggestion, categoryId: null, categoryName: null },
      };
    }
    for (const s of subs) {
      if (s.categoryId === null) continue;
      if (!allowedIds.has(s.categoryId)) {
        return {
          status: "invalid",
          suggestion: { ...suggestion, categoryId: null, categoryName: null },
        };
      }
    }
    const allHigh =
      suggestion.confidence >= CONFIDENCE_THRESHOLD &&
      subs.every((s) => s.categoryId !== null);
    return {
      status: allHigh ? "auto_applied" : "pending",
      suggestion: { ...suggestion, categoryId: null },
    };
  }

  if (suggestion.categoryId === null) {
    return { status: "pending", suggestion };
  }
  if (!allowedIds.has(suggestion.categoryId)) {
    return {
      status: "invalid",
      suggestion: { ...suggestion, categoryId: null, categoryName: null },
    };
  }
  if (suggestion.confidence >= CONFIDENCE_THRESHOLD) {
    return { status: "auto_applied", suggestion };
  }
  return { status: "pending", suggestion };
}

/**
 * Build the YNAB bulk-PATCH body for the rows we're auto-applying. Splits PATCH
 * via `subtransactions[]`; non-splits set top-level `category_id` + `approved: true`.
 */
export function buildPatchBody(args: {
  rows: SuggestionRow[];
  txnsById: Map<string, CategorizableTxn>;
  suggestionsByTxnId: Map<string, Suggestion>;
}): YNABTransactionUpdate[] {
  const out: YNABTransactionUpdate[] = [];
  for (const row of args.rows) {
    if (row.status !== "auto_applied") continue;
    const txn = args.txnsById.get(row.ynab_txn_id);
    const sug = args.suggestionsByTxnId.get(row.ynab_txn_id);
    if (!txn || !sug) continue;
    if (txn.isSplit) {
      const subs = sug.subtransactions ?? [];
      out.push({
        id: txn.id,
        approved: true,
        subtransactions: subs.map((s, i) => {
          const orig = txn.subtransactions?.[i];
          return {
            id: orig?.id,
            amount: orig?.amount ?? s.amount,
            category_id: s.categoryId,
          };
        }),
      });
    } else {
      out.push({
        id: txn.id,
        category_id: sug.categoryId,
        approved: true,
      });
    }
  }
  return out;
}
