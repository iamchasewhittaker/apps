import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("clarity_budget_privacy_cards")
    .select("token, memo, state, type, linked_payee_id")
    .eq("user_id", userData.user.id)
    .order("memo", { ascending: true, nullsFirst: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cards: data ?? [] });
}
