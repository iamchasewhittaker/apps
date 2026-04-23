import { NextResponse } from "next/server";
import { encrypt, KEY_VERSION } from "@/lib/crypto";
import { createRouteClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  ynab_token?: string;
  privacy_token?: string;
  default_budget_id?: string;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: Request) {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const user = userData.user;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const { ynab_token, privacy_token, default_budget_id } = body as Body;

  const row: Record<string, string | number> = {
    user_id: user.id,
    key_version: KEY_VERSION,
  };
  const stored: string[] = [];

  if (isNonEmptyString(ynab_token)) {
    const enc = encrypt(ynab_token.trim());
    row.ynab_token_ciphertext = enc.ciphertext;
    row.ynab_token_iv = enc.iv;
    row.ynab_token_tag = enc.tag;
    stored.push("ynab_token");
  }

  if (isNonEmptyString(privacy_token)) {
    const enc = encrypt(privacy_token.trim());
    row.privacy_token_ciphertext = enc.ciphertext;
    row.privacy_token_iv = enc.iv;
    row.privacy_token_tag = enc.tag;
    stored.push("privacy_token");
  }

  if (isNonEmptyString(default_budget_id)) {
    row.default_budget_id = default_budget_id.trim();
    stored.push("default_budget_id");
  }

  if (stored.length === 0) {
    return NextResponse.json({ error: "no fields provided" }, { status: 400 });
  }

  const { error: upsertErr } = await supabase
    .from("clarity_budget_credentials")
    .upsert(row, { onConflict: "user_id" });
  if (upsertErr) {
    console.error("[credentials] upsert failed", upsertErr);
    return NextResponse.json({ error: "write failed" }, { status: 500 });
  }

  const { error: auditErr } = await supabase
    .from("clarity_budget_audit_log")
    .insert({
      user_id: user.id,
      actor: "user",
      action: "credentials_upsert",
      entity_type: "credentials",
      entity_id: user.id,
      payload: { fields: stored },
    });
  if (auditErr) {
    console.warn("[credentials] audit insert failed", auditErr);
  }

  return NextResponse.json({ ok: true, stored });
}

export async function DELETE() {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const user = userData.user;

  const { error: delErr } = await supabase
    .from("clarity_budget_credentials")
    .delete()
    .eq("user_id", user.id);
  if (delErr) {
    console.error("[credentials] delete failed", delErr);
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }

  const { error: auditErr } = await supabase
    .from("clarity_budget_audit_log")
    .insert({
      user_id: user.id,
      actor: "user",
      action: "credentials_revoke",
      entity_type: "credentials",
      entity_id: user.id,
      payload: {},
    });
  if (auditErr) {
    console.warn("[credentials] audit insert failed", auditErr);
  }

  return NextResponse.json({ ok: true });
}
