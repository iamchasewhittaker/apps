import "server-only";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase-server";
import { generateObject, DEFAULT_MODEL } from "@/lib/ai";
import {
  bulkUpdateTransactions,
  fetchCategories,
  fetchTransactions,
  fetchUncategorizedTransactions,
} from "@/lib/ynab";
import { buildPrompt } from "./prompt";
import { loadYnabCredentials } from "./credentials";
import {
  buildSuggestionRow,
  upsertSuggestions,
  fetchPendingHashes,
  type SuggestionRow,
} from "./persist";
import {
  buildAllowlist,
  buildFewShots,
  buildPatchBody,
  classifySuggestion,
  toCategorizable,
} from "./logic";
import { type RunSummary, type Suggestion } from "./types";

export {
  buildAllowlist,
  buildFewShots,
  buildPatchBody,
  classifySuggestion,
  toCategorizable,
};

const BATCH_SIZE = 20;
const SYNC_SOURCE = "ynab_categorize" as const;

const SuggestionSchema = z.object({
  ynabTxnId: z.string(),
  categoryId: z.string().nullable(),
  categoryName: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  subtransactions: z
    .array(
      z.object({
        id: z.string().optional(),
        amount: z.number(),
        categoryId: z.string().nullable(),
        categoryName: z.string().nullable(),
      })
    )
    .optional(),
});

const ResponseSchema = z.object({
  suggestions: z.array(SuggestionSchema),
});

async function recordSyncResult(
  supabase: SupabaseClient,
  userId: string,
  err: unknown | null
): Promise<void> {
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = {
    user_id: userId,
    source: SYNC_SOURCE,
    last_run_at: now,
  };
  if (err === null) {
    patch.last_success_at = now;
    patch.last_error = null;
  } else {
    const msg = err instanceof Error ? err.message : String(err);
    patch.last_error = msg.slice(0, 500);
  }
  const { error } = await supabase
    .from("clarity_budget_sync_state")
    .upsert(patch, { onConflict: "user_id,source" });
  if (error) console.warn("[categorize] sync_state write failed", error);
}

async function recordAudit(
  supabase: SupabaseClient,
  userId: string,
  action: string,
  payload: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase.from("clarity_budget_audit_log").insert({
    user_id: userId,
    actor: "system",
    action,
    entity_type: "categorize",
    payload,
  });
  if (error) console.warn(`[categorize] audit insert failed (${action})`, error);
}

export async function runCategorization(userId: string): Promise<RunSummary> {
  const supabase = createServiceClient();
  await recordAudit(supabase, userId, "categorize_run_started", {});

  try {
    const { token, budgetId } = await loadYnabCredentials(supabase, userId);

    const [uncategorized, categoryGroups] = await Promise.all([
      fetchUncategorizedTransactions(token, budgetId),
      fetchCategories(token, budgetId),
    ]);

    const allowlist = buildAllowlist(categoryGroups);
    const txns = uncategorized.map(toCategorizable);

    if (txns.length === 0) {
      await recordSyncResult(supabase, userId, null);
      await recordAudit(supabase, userId, "categorize_run_succeeded", {
        fetched: 0,
        cached: 0,
        suggested: 0,
        auto_applied: 0,
        queued: 0,
        invalid: 0,
        model: DEFAULT_MODEL,
      });
      return {
        fetched: 0,
        cached: 0,
        suggested: 0,
        autoApplied: 0,
        queued: 0,
        invalid: 0,
        modelId: DEFAULT_MODEL,
        usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      };
    }

    // Few-shot history (last 90 days of categorized txns).
    const since = new Date();
    since.setDate(since.getDate() - 90);
    const sinceStr = since.toISOString().slice(0, 10);
    const history = await fetchTransactions(token, budgetId, sinceStr);
    const fewShots = buildFewShots(history);

    // Idempotency: any txn whose prompt_hash matches an existing pending or
    // resolved row gets skipped — we already paid the LLM cost for it.
    const existingHashes = await fetchPendingHashes(
      supabase,
      userId,
      txns.map((t) => t.id)
    );

    let totalUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    let cached = 0;
    const allRows: SuggestionRow[] = [];
    const suggestionsByTxnId = new Map<string, Suggestion>();
    const txnsById = new Map(txns.map((t) => [t.id, t]));

    for (let i = 0; i < txns.length; i += BATCH_SIZE) {
      const batch = txns.slice(i, i + BATCH_SIZE);
      const built = buildPrompt({
        categories: allowlist.list,
        fewShots,
        batch,
      });

      // Filter out txns whose existing row shares this prompt hash.
      const txnsToAsk = batch.filter((t) => {
        const ex = existingHashes.get(t.id);
        return !ex || ex.promptHash !== built.hash;
      });
      cached += batch.length - txnsToAsk.length;
      if (txnsToAsk.length === 0) continue;

      const askPrompt =
        txnsToAsk.length === batch.length
          ? built
          : buildPrompt({
              categories: allowlist.list,
              fewShots,
              batch: txnsToAsk,
            });

      const { object, usage, modelId } = await generateObject({
        prompt: askPrompt.prompt,
        system: askPrompt.system,
        schema: ResponseSchema,
        maxOutputTokens: 1500,
      });

      totalUsage = {
        inputTokens: totalUsage.inputTokens + usage.inputTokens,
        outputTokens: totalUsage.outputTokens + usage.outputTokens,
        totalTokens: totalUsage.totalTokens + usage.totalTokens,
      };

      for (const txn of txnsToAsk) {
        const sug = object.suggestions.find((s) => s.ynabTxnId === txn.id);
        if (!sug) continue;
        const { status, suggestion } = classifySuggestion({
          suggestion: sug,
          txn,
          allowedIds: allowlist.ids,
        });
        suggestionsByTxnId.set(txn.id, suggestion);
        allRows.push(
          buildSuggestionRow({
            userId,
            txn,
            suggestion,
            status,
            modelId,
            promptHash: askPrompt.hash,
          })
        );
      }
    }

    await upsertSuggestions(supabase, allRows);

    const autoRows = allRows.filter((r) => r.status === "auto_applied");
    const patchBody = buildPatchBody({
      rows: autoRows,
      txnsById,
      suggestionsByTxnId,
    });

    if (patchBody.length > 0) {
      try {
        const { token: ynabToken, budgetId: bid } = await loadYnabCredentials(
          supabase,
          userId
        );
        await bulkUpdateTransactions(ynabToken, bid, patchBody);
        await recordAudit(supabase, userId, "categorize_auto_applied", {
          count: patchBody.length,
        });
      } catch (patchErr) {
        // Roll the rows back to pending so the user can apply manually.
        const txnIds = autoRows.map((r) => r.ynab_txn_id);
        await supabase
          .from("clarity_budget_categorization_suggestions")
          .update({
            status: "pending",
            resolved_at: null,
            resolved_by_action: null,
          })
          .eq("user_id", userId)
          .in("ynab_txn_id", txnIds);
        await recordAudit(supabase, userId, "categorize_run_failed", {
          phase: "ynab_patch",
          error: patchErr instanceof Error ? patchErr.message : String(patchErr),
        });
        throw patchErr;
      }
    }

    const queued = allRows.filter((r) => r.status === "pending").length;
    const invalid = allRows.filter((r) => r.status === "invalid").length;

    await recordSyncResult(supabase, userId, null);
    await recordAudit(supabase, userId, "categorize_run_succeeded", {
      fetched: txns.length,
      cached,
      suggested: allRows.length,
      auto_applied: patchBody.length,
      queued,
      invalid,
      model: DEFAULT_MODEL,
      usage: totalUsage,
    });

    return {
      fetched: txns.length,
      cached,
      suggested: allRows.length,
      autoApplied: patchBody.length,
      queued,
      invalid,
      modelId: DEFAULT_MODEL,
      usage: totalUsage,
    };
  } catch (err) {
    await recordSyncResult(supabase, userId, err);
    await recordAudit(supabase, userId, "categorize_run_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
