import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase-server";
import { loadYnabCredentials } from "@/lib/categorize/credentials";
import { fetchTransactions, type YNABTransaction } from "@/lib/ynab";
import { matchPrivacyToYnab, type PrivacyRow, type YnabRow } from "./match";
import { buildProposals, type CardInfo } from "./propose-rename";
import { detectWeirdness } from "./detect-weirdness";

const MS_PER_DAY = 86_400_000;

export type ReconcileResult = {
  privacyTxnsConsidered: number;
  ynabTxnsConsidered: number;
  totalMatches: number;
  newMatches: number;
  newProposals: number;
  newFlags: number;
};

type PrivacyTxnDb = {
  token: string;
  card_token: string | null;
  amount_cents: number;
  created: string;
  status: string;
  settled: string | null;
  matched_ynab_txn_id: string | null;
};

type PrivacyCardDb = {
  token: string;
  memo: string | null;
  linked_payee_id: string | null;
};

function ynabToRow(t: YNABTransaction): YnabRow {
  return {
    id: t.id,
    amount: t.amount,
    date: t.date,
    payee_name: t.payee_name,
    account_id: t.account_id,
    cleared: t.cleared,
  };
}

function dbToPrivacyRow(t: PrivacyTxnDb): PrivacyRow {
  return {
    token: t.token,
    amount_cents: t.amount_cents,
    created: t.created,
    status: t.status,
    settled: t.settled,
  };
}

async function writeBackNewMatches(
  supabase: SupabaseClient,
  userId: string,
  matches: Map<string, string>,
  txnsByToken: Map<string, PrivacyTxnDb>
): Promise<number> {
  let written = 0;
  for (const [privToken, ynabId] of matches) {
    const existing = txnsByToken.get(privToken)?.matched_ynab_txn_id ?? null;
    if (existing === ynabId) continue;
    const { error } = await supabase
      .from("clarity_budget_privacy_transactions")
      .update({ matched_ynab_txn_id: ynabId })
      .eq("user_id", userId)
      .eq("token", privToken);
    if (error) {
      console.warn("[reconcile] match write-back failed", { privToken, error });
      continue;
    }
    written += 1;
  }
  return written;
}

async function insertProposals(
  supabase: SupabaseClient,
  userId: string,
  matches: Map<string, string>,
  ynabById: Map<string, YnabRow>,
  txnsByToken: Map<string, PrivacyTxnDb>,
  cardByToken: Map<string, CardInfo>
): Promise<number> {
  const ynabIds = [...matches.values()];
  if (ynabIds.length === 0) return 0;

  const { data: existing, error } = await supabase
    .from("clarity_budget_proposals")
    .select("ynab_txn_id")
    .eq("user_id", userId)
    .eq("type", "payee_rename")
    .in("ynab_txn_id", ynabIds);
  if (error) {
    throw new Error(`existing proposals read failed: ${error.message}`);
  }

  const existingIds = new Set(
    (existing ?? []).map((r) => r.ynab_txn_id as string)
  );

  const privacyTxnByToken = new Map(
    [...txnsByToken.entries()].map(([token, t]) => [
      token,
      { card_token: t.card_token },
    ])
  );

  const proposals = buildProposals(
    matches,
    ynabById,
    privacyTxnByToken,
    cardByToken,
    existingIds
  );
  if (proposals.length === 0) return 0;

  const rows = proposals.map((p) => ({
    user_id: userId,
    type: "payee_rename" as const,
    status: "pending" as const,
    ynab_txn_id: p.ynab_txn_id,
    privacy_txn_token: p.privacy_txn_token,
    current_payee_name: p.current_payee_name,
    proposed_payee_name: p.proposed_payee_name,
    proposed_payee_id: p.proposed_payee_id,
    confidence: p.confidence,
    reason: p.reason,
  }));

  const { error: insertErr } = await supabase
    .from("clarity_budget_proposals")
    .insert(rows);
  if (insertErr) {
    throw new Error(`proposals insert failed: ${insertErr.message}`);
  }
  return rows.length;
}

async function insertFlags(
  supabase: SupabaseClient,
  userId: string,
  ynabTxns: YnabRow[],
  privacyTxns: PrivacyRow[],
  matches: Map<string, string>
): Promise<number> {
  const flags = detectWeirdness(ynabTxns, privacyTxns, matches);
  if (flags.length === 0) return 0;

  const fingerprintsByType = new Map<string, string[]>();
  for (const f of flags) {
    const list = fingerprintsByType.get(f.type) ?? [];
    list.push(f.fingerprint);
    fingerprintsByType.set(f.type, list);
  }

  const existing = new Set<string>();
  for (const [type, fps] of fingerprintsByType) {
    const { data, error } = await supabase
      .from("clarity_budget_flags")
      .select("fingerprint")
      .eq("user_id", userId)
      .eq("type", type)
      .in("fingerprint", fps);
    if (error) {
      throw new Error(`existing flags read failed: ${error.message}`);
    }
    for (const row of data ?? []) {
      existing.add(`${type}:${row.fingerprint as string}`);
    }
  }

  const newFlags = flags.filter(
    (f) => !existing.has(`${f.type}:${f.fingerprint}`)
  );
  if (newFlags.length === 0) return 0;

  const rows = newFlags.map((f) => ({
    user_id: userId,
    type: f.type,
    status: "open" as const,
    severity: f.severity,
    related_ids: f.related_ids,
    details: f.details,
    fingerprint: f.fingerprint,
  }));

  const { error: insertErr } = await supabase
    .from("clarity_budget_flags")
    .insert(rows);
  if (insertErr) {
    throw new Error(`flags insert failed: ${insertErr.message}`);
  }
  return rows.length;
}

async function recordAudit(
  supabase: SupabaseClient,
  userId: string,
  action: string,
  payload: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase.from("clarity_budget_audit_log").insert({
    user_id: userId,
    actor: "cron",
    action,
    entity_type: "reconcile",
    payload,
  });
  if (error) console.warn(`[reconcile] audit insert failed (${action})`, error);
}

export async function runReconcileForUser(
  userId: string,
  daysBack = 60
): Promise<ReconcileResult> {
  const supabase = createServiceClient();

  try {
    const sinceIso = new Date(Date.now() - daysBack * MS_PER_DAY).toISOString();
    const sinceDate = sinceIso.slice(0, 10);

    const [cardsRes, txnsRes] = await Promise.all([
      supabase
        .from("clarity_budget_privacy_cards")
        .select("token, memo, linked_payee_id")
        .eq("user_id", userId)
        .returns<PrivacyCardDb[]>(),
      supabase
        .from("clarity_budget_privacy_transactions")
        .select(
          "token, card_token, amount_cents, created, status, settled, matched_ynab_txn_id"
        )
        .eq("user_id", userId)
        .gte("created", sinceIso)
        .returns<PrivacyTxnDb[]>(),
    ]);
    if (cardsRes.error) {
      throw new Error(`cards read failed: ${cardsRes.error.message}`);
    }
    if (txnsRes.error) {
      throw new Error(`txns read failed: ${txnsRes.error.message}`);
    }

    const cards = cardsRes.data ?? [];
    const txns = txnsRes.data ?? [];

    if (txns.length === 0) {
      await recordAudit(supabase, userId, "reconcile_succeeded", {
        privacy_txns: 0,
        ynab_txns: 0,
        new_matches: 0,
        new_proposals: 0,
        new_flags: 0,
        days_back: daysBack,
      });
      return {
        privacyTxnsConsidered: 0,
        ynabTxnsConsidered: 0,
        totalMatches: 0,
        newMatches: 0,
        newProposals: 0,
        newFlags: 0,
      };
    }

    const { token: ynabToken, budgetId } = await loadYnabCredentials(
      supabase,
      userId
    );
    const ynabRaw = await fetchTransactions(ynabToken, budgetId, sinceDate);
    const ynabTxns = ynabRaw.map(ynabToRow);
    const privacyTxns = txns.map(dbToPrivacyRow);

    const matches = matchPrivacyToYnab(privacyTxns, ynabTxns);

    const txnsByToken = new Map(txns.map((t) => [t.token, t]));
    const ynabById = new Map(ynabTxns.map((y) => [y.id, y]));
    const cardByToken = new Map<string, CardInfo>(
      cards.map((c) => [
        c.token,
        {
          token: c.token,
          memo: c.memo,
          linked_payee_id: c.linked_payee_id,
        },
      ])
    );

    const newMatches = await writeBackNewMatches(
      supabase,
      userId,
      matches,
      txnsByToken
    );

    const newProposals = await insertProposals(
      supabase,
      userId,
      matches,
      ynabById,
      txnsByToken,
      cardByToken
    );

    const newFlags = await insertFlags(
      supabase,
      userId,
      ynabTxns,
      privacyTxns,
      matches
    );

    await recordAudit(supabase, userId, "reconcile_succeeded", {
      privacy_txns: privacyTxns.length,
      ynab_txns: ynabTxns.length,
      total_matches: matches.size,
      new_matches: newMatches,
      new_proposals: newProposals,
      new_flags: newFlags,
      days_back: daysBack,
    });

    return {
      privacyTxnsConsidered: privacyTxns.length,
      ynabTxnsConsidered: ynabTxns.length,
      totalMatches: matches.size,
      newMatches,
      newProposals,
      newFlags,
    };
  } catch (err) {
    await recordAudit(supabase, userId, "reconcile_failed", {
      error: err instanceof Error ? err.message : String(err),
      days_back: daysBack,
    });
    throw err;
  }
}
