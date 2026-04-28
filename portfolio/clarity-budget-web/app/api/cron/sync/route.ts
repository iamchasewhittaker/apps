import "server-only";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { pullCards, pullTransactions } from "@/lib/privacy/sync";
import { runReconcileForUser } from "@/lib/reconcile/run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type UserResult =
  | {
      user_id: string;
      ok: true;
      privacy_cards_fetched: number;
      privacy_txns_fetched: number;
      total_matches: number;
      new_matches: number;
      new_proposals: number;
      new_flags: number;
    }
  | { user_id: string; ok: false; error: string };

type EligibleRow = { user_id: string };

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

async function listEligibleUsers(): Promise<string[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("clarity_budget_credentials")
    .select("user_id")
    .not("ynab_token_ciphertext", "is", null)
    .not("privacy_token_ciphertext", "is", null)
    .returns<EligibleRow[]>();
  if (error) throw new Error(`eligible users read failed: ${error.message}`);
  return (data ?? []).map((r) => r.user_id);
}

async function processUser(userId: string): Promise<UserResult> {
  try {
    const cards = await pullCards(userId);
    const txns = await pullTransactions(userId);
    const reconcile = await runReconcileForUser(userId);
    return {
      user_id: userId,
      ok: true,
      privacy_cards_fetched: cards.fetched,
      privacy_txns_fetched: txns.fetched,
      total_matches: reconcile.totalMatches,
      new_matches: reconcile.newMatches,
      new_proposals: reconcile.newProposals,
      new_flags: reconcile.newFlags,
    };
  } catch (err) {
    return {
      user_id: userId,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let users: string[];
  try {
    users = await listEligibleUsers();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const results: UserResult[] = [];
  for (const userId of users) {
    results.push(await processUser(userId));
  }

  return NextResponse.json({
    ok: true,
    processed: users.length,
    succeeded: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}

export async function GET(req: Request) {
  return POST(req);
}
