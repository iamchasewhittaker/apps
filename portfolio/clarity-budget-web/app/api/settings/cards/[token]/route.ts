import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { linked_payee_id: string | null };

type CardRow = { token: string; user_id: string };

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = userData.user.id;
  const { token } = await params;

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (
    body.linked_payee_id !== null &&
    typeof body.linked_payee_id !== "string"
  ) {
    return NextResponse.json(
      { error: "linked_payee_id must be string or null" },
      { status: 400 }
    );
  }

  const { data: row, error: readErr } = await supabase
    .from("clarity_budget_privacy_cards")
    .select("token, user_id")
    .eq("token", token)
    .maybeSingle<CardRow>();

  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (row.user_id !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { error: updateErr } = await supabase
    .from("clarity_budget_privacy_cards")
    .update({ linked_payee_id: body.linked_payee_id })
    .eq("token", token);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  await supabase.from("clarity_budget_audit_log").insert({
    user_id: userId,
    actor: "user",
    action: "card_payee_linked",
    entity_type: "privacy_card",
    entity_id: token,
    payload: { linked_payee_id: body.linked_payee_id },
  });

  return NextResponse.json({ ok: true });
}
