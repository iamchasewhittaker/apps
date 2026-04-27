import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { decrypt } from "@/lib/crypto";
import { SUPABASE_APP_KEY } from "@/lib/constants";

type CredentialsRow = {
  ynab_token_ciphertext: string | null;
  ynab_token_iv: string | null;
  ynab_token_tag: string | null;
  default_budget_id: string | null;
};

type UserDataRow = {
  data: { ynabBudgetId?: string | null } | null;
};

export async function loadYnabCredentials(
  supabase: SupabaseClient,
  userId: string
): Promise<{ token: string; budgetId: string }> {
  const { data, error } = await supabase
    .from("clarity_budget_credentials")
    .select(
      "ynab_token_ciphertext, ynab_token_iv, ynab_token_tag, default_budget_id"
    )
    .eq("user_id", userId)
    .maybeSingle<CredentialsRow>();
  if (error) throw new Error(`credentials read failed: ${error.message}`);
  if (
    !data?.ynab_token_ciphertext ||
    !data.ynab_token_iv ||
    !data.ynab_token_tag
  ) {
    throw new Error("ynab token not configured");
  }
  const token = decrypt({
    ciphertext: data.ynab_token_ciphertext,
    iv: data.ynab_token_iv,
    tag: data.ynab_token_tag,
  });

  if (data.default_budget_id) {
    return { token, budgetId: data.default_budget_id };
  }

  const fallbackId = await readBudgetIdFromUserData(supabase, userId);
  if (!fallbackId) {
    throw new Error("no YNAB budget selected — open Settings and pick one");
  }

  // Self-heal: write it back so subsequent calls skip the fallback.
  void backfillDefaultBudgetId(supabase, userId, fallbackId);

  return { token, budgetId: fallbackId };
}

async function readBudgetIdFromUserData(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("user_data")
    .select("data")
    .eq("user_id", userId)
    .eq("app_key", SUPABASE_APP_KEY)
    .maybeSingle<UserDataRow>();
  if (error) {
    console.warn("[categorize] user_data read failed", error);
    return null;
  }
  const id = data?.data?.ynabBudgetId;
  return typeof id === "string" && id.trim().length > 0 ? id.trim() : null;
}

async function backfillDefaultBudgetId(
  supabase: SupabaseClient,
  userId: string,
  budgetId: string
): Promise<void> {
  const { error } = await supabase
    .from("clarity_budget_credentials")
    .update({ default_budget_id: budgetId })
    .eq("user_id", userId);
  if (error) {
    console.warn("[categorize] default_budget_id backfill failed", error);
  }
}
