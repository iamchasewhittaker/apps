import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  action: "approve" | "dismiss";
};

type ProposalRow = {
  id: string;
  user_id: string;
  status: string;
  privacy_txn_token: string | null;
  proposed_payee_id: string | null;
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = userData.user.id;

  const { id } = await params;

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (body.action !== "approve" && body.action !== "dismiss") {
    return NextResponse.json({ error: "action must be approve or dismiss" }, { status: 400 });
  }

  const { data: row, error: readErr } = await supabase
    .from("clarity_budget_proposals")
    .select("id, user_id, status, privacy_txn_token, proposed_payee_id")
    .eq("id", id)
    .maybeSingle<ProposalRow>();

  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (row.user_id !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (row.status !== "pending") {
    return NextResponse.json({ error: "proposal already resolved" }, { status: 409 });
  }

  const newStatus = body.action === "approve" ? "approved" : "dismissed";
  const resolvedAt = new Date().toISOString();

  const { error: updateErr } = await supabase
    .from("clarity_budget_proposals")
    .update({ status: newStatus, resolved_at: resolvedAt, resolved_by_action: body.action })
    .eq("id", id);

  if (updateErr) {
    console.error("[proposals] update failed", updateErr);
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // On approve: link the privacy card to the YNAB payee
  if (body.action === "approve" && row.proposed_payee_id && row.privacy_txn_token) {
    const { data: txn } = await supabase
      .from("clarity_budget_privacy_transactions")
      .select("card_token")
      .eq("token", row.privacy_txn_token)
      .maybeSingle<{ card_token: string | null }>();

    if (txn?.card_token) {
      await supabase
        .from("clarity_budget_privacy_cards")
        .update({ linked_payee_id: row.proposed_payee_id })
        .eq("token", txn.card_token)
        .eq("user_id", userId);
    }
  }

  await supabase.from("clarity_budget_audit_log").insert({
    user_id: userId,
    actor: "user",
    action: body.action === "approve" ? "proposal_approved" : "proposal_dismissed",
    entity_type: "proposal",
    entity_id: id,
    payload: { action: body.action },
  });

  return NextResponse.json({ ok: true });
}
