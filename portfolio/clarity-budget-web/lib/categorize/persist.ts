import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Suggestion, SuggestionStatus } from "./types";
import type { CategorizableTxn } from "./types";

const TABLE = "clarity_budget_categorization_suggestions";

export type SuggestionRow = {
  id?: string;
  user_id: string;
  ynab_txn_id: string;
  status: SuggestionStatus;
  category_id: string | null;
  category_name: string | null;
  confidence: number;
  reasoning: string;
  model_id: string;
  prompt_hash: string;
  subtransactions: Suggestion["subtransactions"] | null;
  txn_snapshot: {
    date: string;
    amount: number;
    payee_name: string | null;
    memo: string | null;
    is_split: boolean;
  };
  resolved_at?: string | null;
  resolved_by_action?: string | null;
};

export function buildSuggestionRow(args: {
  userId: string;
  txn: CategorizableTxn;
  suggestion: Suggestion;
  status: SuggestionStatus;
  modelId: string;
  promptHash: string;
}): SuggestionRow {
  const { userId, txn, suggestion, status, modelId, promptHash } = args;
  const resolved =
    status === "auto_applied" || status === "user_applied" || status === "dismissed"
      ? new Date().toISOString()
      : null;
  return {
    user_id: userId,
    ynab_txn_id: txn.id,
    status,
    category_id: suggestion.categoryId,
    category_name: suggestion.categoryName,
    confidence: suggestion.confidence,
    reasoning: suggestion.reasoning,
    model_id: modelId,
    prompt_hash: promptHash,
    subtransactions: suggestion.subtransactions ?? null,
    txn_snapshot: {
      date: txn.date,
      amount: txn.amount,
      payee_name: txn.payeeName,
      memo: txn.memo,
      is_split: txn.isSplit,
    },
    resolved_at: resolved,
    resolved_by_action: status === "auto_applied" ? "categorize_auto_applied" : null,
  };
}

/**
 * Upsert a batch of suggestion rows. Conflict on (user_id, ynab_txn_id) — the
 * unique index lets re-runs replace stale pending rows without losing audit
 * trail (resolved rows are out of `?type=uncategorized` once applied).
 */
export async function upsertSuggestions(
  supabase: SupabaseClient,
  rows: SuggestionRow[]
): Promise<void> {
  if (rows.length === 0) return;
  const { error } = await supabase.from(TABLE).upsert(rows as never, {
    onConflict: "user_id,ynab_txn_id",
  });
  if (error) throw new Error(`suggestion upsert failed: ${error.message}`);
}

export async function fetchPendingHashes(
  supabase: SupabaseClient,
  userId: string,
  txnIds: string[]
): Promise<Map<string, { promptHash: string; status: SuggestionStatus }>> {
  if (txnIds.length === 0) return new Map();
  const { data, error } = await supabase
    .from(TABLE)
    .select("ynab_txn_id, prompt_hash, status")
    .eq("user_id", userId)
    .in("ynab_txn_id", txnIds);
  if (error) throw new Error(`suggestion read failed: ${error.message}`);
  const map = new Map<string, { promptHash: string; status: SuggestionStatus }>();
  for (const r of data ?? []) {
    map.set(r.ynab_txn_id as string, {
      promptHash: r.prompt_hash as string,
      status: r.status as SuggestionStatus,
    });
  }
  return map;
}

export async function markStatus(
  supabase: SupabaseClient,
  args: {
    userId: string;
    suggestionId: string;
    status: SuggestionStatus;
    action: string;
    overrideCategoryId?: string | null;
    overrideCategoryName?: string | null;
  }
): Promise<void> {
  const patch: Record<string, unknown> = {
    status: args.status,
    resolved_at: new Date().toISOString(),
    resolved_by_action: args.action,
  };
  if (args.overrideCategoryId !== undefined) {
    patch.category_id = args.overrideCategoryId;
  }
  if (args.overrideCategoryName !== undefined) {
    patch.category_name = args.overrideCategoryName;
  }
  const { error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq("id", args.suggestionId)
    .eq("user_id", args.userId);
  if (error) throw new Error(`suggestion update failed: ${error.message}`);
}
