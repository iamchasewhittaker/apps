import { NextResponse } from "next/server";
import { pullCards, pullTransactions } from "@/lib/privacy/sync";
import { createRouteClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;
  try {
    const cards = await pullCards(userId);
    const transactions = await pullTransactions(userId);
    return NextResponse.json({ cards: cards.fetched, transactions: transactions.fetched });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "sync failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
