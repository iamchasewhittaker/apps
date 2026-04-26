import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { decrypt } from "@/lib/crypto";
import { createServiceClient } from "@/lib/supabase-server";
import { createPrivacyClient } from "./client";
import type { PrivacyCard, PrivacyTransaction } from "./types";

const UPSERT_CHUNK = 500;
const SYNC_SOURCE = "privacy" as const;

type CredentialsRow = {
  privacy_token_ciphertext: string | null;
  privacy_token_iv: string | null;
  privacy_token_tag: string | null;
};

type SyncResult = { fetched: number; upserted: number };

async function loadPrivacyToken(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const { data, error } = await supabase
    .from("clarity_budget_credentials")
    .select("privacy_token_ciphertext, privacy_token_iv, privacy_token_tag")
    .eq("user_id", userId)
    .maybeSingle<CredentialsRow>();

  if (error) throw new Error(`Credentials read failed: ${error.message}`);
  if (!data) throw new Error("privacy token not configured");

  const { privacy_token_ciphertext, privacy_token_iv, privacy_token_tag } = data;
  if (!privacy_token_ciphertext || !privacy_token_iv || !privacy_token_tag) {
    throw new Error("privacy token not configured");
  }

  return decrypt({
    ciphertext: privacy_token_ciphertext,
    iv: privacy_token_iv,
    tag: privacy_token_tag,
  });
}

async function upsertInChunks<T>(
  supabase: SupabaseClient,
  table: string,
  rows: T[],
  onConflict: string
): Promise<number> {
  let upserted = 0;
  for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
    const chunk = rows.slice(i, i + UPSERT_CHUNK);
    const { error } = await supabase
      .from(table)
      .upsert(chunk as never, { onConflict });
    if (error) throw new Error(`${table} upsert failed: ${error.message}`);
    upserted += chunk.length;
  }
  return upserted;
}

async function recordSyncSuccess(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("clarity_budget_sync_state")
    .upsert(
      {
        user_id: userId,
        source: SYNC_SOURCE,
        last_run_at: now,
        last_success_at: now,
        last_error: null,
      },
      { onConflict: "user_id,source" }
    );
  if (error) console.warn("[privacy/sync] sync_state success write failed", error);
}

async function recordSyncFailure(
  supabase: SupabaseClient,
  userId: string,
  err: unknown
): Promise<void> {
  const now = new Date().toISOString();
  const message = err instanceof Error ? err.message : String(err);
  const { error } = await supabase
    .from("clarity_budget_sync_state")
    .upsert(
      {
        user_id: userId,
        source: SYNC_SOURCE,
        last_run_at: now,
        last_error: message.slice(0, 500),
      },
      { onConflict: "user_id,source" }
    );
  if (error) console.warn("[privacy/sync] sync_state failure write failed", error);
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
    entity_type: "privacy_sync",
    payload,
  });
  if (error) console.warn(`[privacy/sync] audit insert failed (${action})`, error);
}

export async function pullCards(userId: string): Promise<SyncResult> {
  const supabase = createServiceClient();
  try {
    const token = await loadPrivacyToken(supabase, userId);
    const client = createPrivacyClient(token);

    const cards: PrivacyCard[] = await client.listCards();
    if (cards.length === 0) {
      await recordSyncSuccess(supabase, userId);
      await recordAudit(supabase, userId, "privacy_sync_cards", { count: 0 });
      return { fetched: 0, upserted: 0 };
    }

    const tokens = cards.map((c) => c.token);
    const { data: existing, error: existingErr } = await supabase
      .from("clarity_budget_privacy_cards")
      .select("token, linked_payee_id")
      .eq("user_id", userId)
      .in("token", tokens);
    if (existingErr) {
      throw new Error(`Existing cards read failed: ${existingErr.message}`);
    }
    const linkedByToken = new Map<string, string | null>(
      (existing ?? []).map((r) => [
        r.token as string,
        (r.linked_payee_id as string | null) ?? null,
      ])
    );

    const rows = cards.map((c) => ({
      token: c.token,
      user_id: userId,
      memo: c.memo ?? null,
      state: c.state,
      type: c.type,
      linked_payee_id: linkedByToken.get(c.token) ?? null,
    }));

    const upserted = await upsertInChunks(
      supabase,
      "clarity_budget_privacy_cards",
      rows,
      "token"
    );

    await recordSyncSuccess(supabase, userId);
    await recordAudit(supabase, userId, "privacy_sync_cards", {
      fetched: cards.length,
      upserted,
    });
    return { fetched: cards.length, upserted };
  } catch (err) {
    await recordSyncFailure(supabase, userId, err);
    await recordAudit(supabase, userId, "privacy_sync_cards_failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

export async function pullTransactions(
  userId: string,
  since?: string
): Promise<SyncResult> {
  const supabase = createServiceClient();
  try {
    const token = await loadPrivacyToken(supabase, userId);
    const client = createPrivacyClient(token);

    const txns: PrivacyTransaction[] = await client.listTransactions(
      since ? { begin: since } : undefined
    );
    if (txns.length === 0) {
      await recordSyncSuccess(supabase, userId);
      await recordAudit(supabase, userId, "privacy_sync_transactions", {
        count: 0,
        since: since ?? null,
      });
      return { fetched: 0, upserted: 0 };
    }

    const tokens = txns.map((t) => t.token);
    const { data: existing, error: existingErr } = await supabase
      .from("clarity_budget_privacy_transactions")
      .select("token, matched_ynab_txn_id")
      .eq("user_id", userId)
      .in("token", tokens);
    if (existingErr) {
      throw new Error(`Existing transactions read failed: ${existingErr.message}`);
    }
    const matchedByToken = new Map<string, string | null>(
      (existing ?? []).map((r) => [
        r.token as string,
        (r.matched_ynab_txn_id as string | null) ?? null,
      ])
    );

    const rows = txns.map((t) => ({
      token: t.token,
      user_id: userId,
      card_token: t.card?.token ?? null,
      merchant_descriptor: t.merchant?.descriptor ?? null,
      merchant_city: t.merchant?.city ?? null,
      amount_cents: t.amount,
      status: t.status,
      created: t.created,
      settled: t.settled ?? null,
      matched_ynab_txn_id: matchedByToken.get(t.token) ?? null,
    }));

    const upserted = await upsertInChunks(
      supabase,
      "clarity_budget_privacy_transactions",
      rows,
      "token"
    );

    await recordSyncSuccess(supabase, userId);
    await recordAudit(supabase, userId, "privacy_sync_transactions", {
      fetched: txns.length,
      upserted,
      since: since ?? null,
    });
    return { fetched: txns.length, upserted };
  } catch (err) {
    await recordSyncFailure(supabase, userId, err);
    await recordAudit(supabase, userId, "privacy_sync_transactions_failed", {
      error: err instanceof Error ? err.message : String(err),
      since: since ?? null,
    });
    throw err;
  }
}
