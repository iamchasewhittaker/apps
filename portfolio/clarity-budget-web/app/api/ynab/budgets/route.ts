import { NextResponse } from "next/server";
import { decrypt } from "@/lib/crypto";
import { createRouteClient } from "@/lib/supabase-server";
import { fetchBudgets } from "@/lib/ynab";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("clarity_budget_credentials")
    .select("ynab_token_ciphertext, ynab_token_iv, ynab_token_tag")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: "read failed" }, { status: 500 });
  }
  if (!data?.ynab_token_ciphertext || !data.ynab_token_iv || !data.ynab_token_tag) {
    return NextResponse.json({ error: "ynab token not configured" }, { status: 400 });
  }

  const token = decrypt({
    ciphertext: data.ynab_token_ciphertext,
    iv: data.ynab_token_iv,
    tag: data.ynab_token_tag,
  });

  try {
    const budgets = await fetchBudgets(token);
    return NextResponse.json({ budgets });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "fetch failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
