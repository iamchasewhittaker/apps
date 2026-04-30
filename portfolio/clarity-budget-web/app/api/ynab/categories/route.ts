import { NextResponse } from "next/server";
import { loadYnabCredentials } from "@/lib/categorize/credentials";
import { createRouteClient } from "@/lib/supabase-server";
import { fetchCategories } from "@/lib/ynab";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { token, budgetId } = await loadYnabCredentials(supabase, userData.user.id);
    const groups = await fetchCategories(token, budgetId);
    return NextResponse.json({ groups });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "fetch failed";
    const status = msg.includes("not configured") || msg.includes("not selected") ? 400 : 502;
    return NextResponse.json({ error: msg }, { status });
  }
}
