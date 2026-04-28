import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  action: "dismiss";
};

type FlagRow = {
  id: string;
  user_id: string;
  status: string;
  type: string;
  severity: string | null;
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

  if (body.action !== "dismiss") {
    return NextResponse.json({ error: "action must be dismiss" }, { status: 400 });
  }

  const { data: row, error: readErr } = await supabase
    .from("clarity_budget_flags")
    .select("id, user_id, status, type, severity")
    .eq("id", id)
    .maybeSingle<FlagRow>();

  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (row.user_id !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (row.status !== "open") {
    return NextResponse.json({ error: "flag already resolved" }, { status: 409 });
  }

  const acknowledgedAt = new Date().toISOString();

  const { error: updateErr } = await supabase
    .from("clarity_budget_flags")
    .update({ status: "acknowledged", acknowledged_at: acknowledgedAt })
    .eq("id", id);

  if (updateErr) {
    console.error("[flags] update failed", updateErr);
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  await supabase.from("clarity_budget_audit_log").insert({
    user_id: userId,
    actor: "user",
    action: "flag_dismissed",
    entity_type: "flag",
    entity_id: id,
    payload: { type: row.type, severity: row.severity },
  });

  return NextResponse.json({ ok: true });
}
