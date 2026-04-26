import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase-server";
import { runCategorization } from "@/lib/categorize/run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST() {
  const supabase = await createRouteClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const summary = await runCategorization(userData.user.id);
    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[categorize/run] failed", err);
    const status =
      msg.includes("not configured") || msg.includes("Token invalid")
        ? 400
        : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
