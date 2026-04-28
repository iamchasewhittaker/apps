import "server-only";
import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase-server";
import { pullCards, pullTransactions } from "@/lib/privacy/sync";
import { runReconcileForUser } from "@/lib/reconcile/run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const DEFAULT_BACKFILL_DAYS = 365;
const MS_PER_DAY = 86_400_000;

type Body = {
  days_back?: number;
};

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

export async function POST(req: Request) {
  const cronAuthorized = authorized(req);

  let userId: string;
  if (cronAuthorized) {
    const url = new URL(req.url);
    const queryUser = url.searchParams.get("user_id");
    if (!queryUser) {
      return NextResponse.json(
        { error: "user_id query param required when calling with cron secret" },
        { status: 400 }
      );
    }
    userId = queryUser;
  } else {
    const route = await createRouteClient();
    const { data: userData, error: userErr } = await route.auth.getUser();
    if (userErr || !userData.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    userId = userData.user.id;
  }

  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    // Empty body is fine — defaults apply.
  }

  const daysBack =
    typeof body.days_back === "number" && body.days_back > 0
      ? Math.floor(body.days_back)
      : DEFAULT_BACKFILL_DAYS;

  try {
    const since = new Date(Date.now() - daysBack * MS_PER_DAY)
      .toISOString()
      .slice(0, 10);
    const cards = await pullCards(userId);
    const txns = await pullTransactions(userId, since);
    const reconcile = await runReconcileForUser(userId, daysBack);

    return NextResponse.json({
      ok: true,
      user_id: userId,
      days_back: daysBack,
      privacy_cards_fetched: cards.fetched,
      privacy_txns_fetched: txns.fetched,
      total_matches: reconcile.totalMatches,
      new_matches: reconcile.newMatches,
      new_proposals: reconcile.newProposals,
      new_flags: reconcile.newFlags,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, user_id: userId, error: msg },
      { status: 500 }
    );
  }
}
