import { NextResponse } from "next/server";
import { loadYnabCredentials } from "@/lib/categorize/credentials";
import { createRouteClient } from "@/lib/supabase-server";
import { fetchTransactions } from "@/lib/ynab";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const since = searchParams.get("since") ?? (() => {
    const d = new Date();
    d.setDate(d.getDate() - 60);
    return d.toISOString().slice(0, 10);
  })();

  try {
    const { token, budgetId } = await loadYnabCredentials(supabase, userData.user.id);
    const transactions = await fetchTransactions(token, budgetId, since);
    return NextResponse.json({ transactions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "fetch failed";
    const status = msg.includes("not configured") || msg.includes("not selected") ? 400 : 502;
    return NextResponse.json({ error: msg }, { status });
  }
}
