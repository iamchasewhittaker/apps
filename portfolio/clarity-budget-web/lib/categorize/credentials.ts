import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { decrypt } from "@/lib/crypto";

type CredentialsRow = {
  ynab_token_ciphertext: string | null;
  ynab_token_iv: string | null;
  ynab_token_tag: string | null;
  default_budget_id: string | null;
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
  if (!data.default_budget_id) {
    throw new Error("no YNAB budget selected — open Settings and pick one");
  }
  const token = decrypt({
    ciphertext: data.ynab_token_ciphertext,
    iv: data.ynab_token_iv,
    tag: data.ynab_token_tag,
  });
  return { token, budgetId: data.default_budget_id };
}
