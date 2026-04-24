import "server-only";
import { decrypt } from "@/lib/crypto";
import { createServiceClient } from "@/lib/supabase-server";
import { createPrivacyClient } from "./client";
import type { PrivacyCard, PrivacyTransaction } from "./types";

const UPSERT_CHUNK = 500;

type CredentialsRow = {
  privacy_token_ciphertext: string | null;
  privacy_token_iv: string | null;
  privacy_token_tag: string | null;
};

async function loadPrivacyToken(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string
): Promise<string> {
  const { data, error } = await supabase
    .from("clarity_budget_credentials")
    .select("privacy_token_ciphertext, privacy_token_iv, privacy_token_tag")
    .eq("user_id", userId)
    .maybeSingle<CredentialsRow>();

  if (error) throw new Error(`Credentials read failed: ${error.message}`);
  if (!data) throw new Error("No Privacy token stored for user");

  const { privacy_token_ciphertext, privacy_token_iv, privacy_token_tag } = data;
  if (!privacy_token_ciphertext || !privacy_token_iv || !privacy_token_tag) {
    throw new Error("No Privacy token stored for user");
  }

  return decrypt({
    ciphertext: privacy_token_ciphertext,
    iv: privacy_token_iv,
    tag: privacy_token_tag,
  });
}

async function upsertInChunks<T>(
  supabase: ReturnType<typeof createServiceClient>,
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

export async function pullCards(
  userId: string
): Promise<{ fetched: number; upserted: number }> {
  const supabase = createServiceClient();
  const token = await loadPrivacyToken(supabase, userId);
  const client = createPrivacyClient(token);

  const cards: PrivacyCard[] = await client.listCards();
  if (cards.length === 0) return { fetched: 0, upserted: 0 };

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
  return { fetched: cards.length, upserted };
}

export async function pullTransactions(
  userId: string,
  since: string
): Promise<{ fetched: number; upserted: number }> {
  const supabase = createServiceClient();
  const token = await loadPrivacyToken(supabase, userId);
  const client = createPrivacyClient(token);

  const txns: PrivacyTransaction[] = await client.listTransactions({
    begin: since,
  });
  if (txns.length === 0) return { fetched: 0, upserted: 0 };

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
  return { fetched: txns.length, upserted };
}
