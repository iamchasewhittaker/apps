import { NextResponse } from "next/server";
import { loadYnabCredentials } from "@/lib/categorize/credentials";
import { createRouteClient } from "@/lib/supabase-server";
import { fetchPayees } from "@/lib/ynab";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { token, budgetId } = await loadYnabCredentials(
      supabase,
      userData.user.id
    );
    const payees = await fetchPayees(token, budgetId);
    return NextResponse.json({ payees });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "fetch failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
