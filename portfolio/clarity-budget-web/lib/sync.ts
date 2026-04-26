import type { SupabaseClient } from "@supabase/supabase-js";
import type { BudgetBlob } from "./blob";
import { SUPABASE_APP_KEY } from "./constants";

export async function pushBlob(client: SupabaseClient, blob: BudgetBlob, userId: string) {
  const payload = { ...blob, _syncAt: Date.now() };
  const { error } = await client.from("user_data").upsert(
    {
      user_id: userId,
      app_key: SUPABASE_APP_KEY,
      data: payload,
    },
    { onConflict: "user_id,app_key" }
  );
  if (error) console.warn("[clarity-budget] push failed:", error.message);
}

export async function pullBlob(
  client: SupabaseClient,
  userId: string,
  local: BudgetBlob
): Promise<BudgetBlob | null> {
  const localTs = local._syncAt || 0;
  const { data: row, error } = await client
    .from("user_data")
    .select("data,updated_at")
    .eq("user_id", userId)
    .eq("app_key", SUPABASE_APP_KEY)
    .maybeSingle();

  if (error || !row) return null;
  const remoteTs = new Date(row.updated_at as string).getTime();
  if (remoteTs > localTs) {
    return row.data as BudgetBlob;
  }
  return null;
}
