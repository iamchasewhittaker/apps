import { NextResponse } from "next/server";
import { createRouteClient, createServiceClient } from "@/lib/supabase-server";
import { bulkUpdateTransactions } from "@/lib/ynab";
import { markStatus } from "@/lib/categorize/persist";
import { loadYnabCredentials } from "@/lib/categorize/credentials";
import type { Suggestion } from "@/lib/categorize/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  suggestion_id?: string;
  action?: "apply" | "dismiss" | "undo";
  override_category_id?: string | null;
};

type Row = {
  id: string;
  user_id: string;
  ynab_txn_id: string;
  status: string;
  category_id: string | null;
  category_name: string | null;
  subtransactions: Suggestion["subtransactions"] | null;
  txn_snapshot: { is_split?: boolean } & Record<string, unknown>;
};

export async function POST(req: Request) {
  const route = await createRouteClient();
  const { data: userData, error: userErr } = await route.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = userData.user.id;

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const action = body.action ?? "apply";
  if (!body.suggestion_id) {
    return NextResponse.json({ error: "suggestion_id required" }, { status: 400 });
  }

  const { data: row, error: readErr } = await route
    .from("clarity_budget_categorization_suggestions")
    .select(
      "id, user_id, ynab_txn_id, status, category_id, category_name, subtransactions, txn_snapshot"
    )
    .eq("id", body.suggestion_id)
    .maybeSingle<Row>();
  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (row.user_id !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const service = createServiceClient();

  try {
    if (action === "dismiss") {
      await markStatus(service, {
        userId,
        suggestionId: row.id,
        status: "dismissed",
        action: "categorize_dismissed",
      });
      await service.from("clarity_budget_audit_log").insert({
        user_id: userId,
        actor: "user",
        action: "categorize_dismissed",
        entity_type: "categorize",
        entity_id: row.id,
        payload: { ynab_txn_id: row.ynab_txn_id },
      });
      return NextResponse.json({ ok: true });
    }

    if (action === "undo") {
      const { token, budgetId } = await loadYnabCredentials(service, userId);
      await bulkUpdateTransactions(token, budgetId, [
        { id: row.ynab_txn_id, category_id: null, approved: false },
      ]);
      await markStatus(service, {
        userId,
        suggestionId: row.id,
        status: "pending",
        action: "categorize_user_undo",
      });
      await service.from("clarity_budget_audit_log").insert({
        user_id: userId,
        actor: "user",
        action: "categorize_user_undo",
        entity_type: "categorize",
        entity_id: row.id,
        payload: { ynab_txn_id: row.ynab_txn_id },
      });
      return NextResponse.json({ ok: true });
    }

    // action === "apply"
    const isSplit = row.txn_snapshot.is_split === true;
    const overrideId =
      body.override_category_id !== undefined
        ? body.override_category_id
        : row.category_id;

    if (isSplit) {
      const subs = row.subtransactions ?? [];
      if (subs.length === 0 || subs.some((s) => s.categoryId === null)) {
        return NextResponse.json(
          { error: "split needs full sub coverage; pick categories per sub first" },
          { status: 400 }
        );
      }
      const { token, budgetId } = await loadYnabCredentials(service, userId);
      await bulkUpdateTransactions(token, budgetId, [
        {
          id: row.ynab_txn_id,
          approved: true,
          subtransactions: subs.map((s) => ({
            id: s.id ?? undefined,
            amount: s.amount,
            category_id: s.categoryId,
          })),
        },
      ]);
    } else {
      if (!overrideId) {
        return NextResponse.json(
          { error: "category_id required" },
          { status: 400 }
        );
      }
      const { token, budgetId } = await loadYnabCredentials(service, userId);
      await bulkUpdateTransactions(token, budgetId, [
        { id: row.ynab_txn_id, category_id: overrideId, approved: true },
      ]);
    }

    await markStatus(service, {
      userId,
      suggestionId: row.id,
      status: "user_applied",
      action: "categorize_user_applied",
      overrideCategoryId: overrideId === undefined ? undefined : overrideId,
    });
    await service.from("clarity_budget_audit_log").insert({
      user_id: userId,
      actor: "user",
      action: "categorize_user_applied",
      entity_type: "categorize",
      entity_id: row.id,
      payload: {
        ynab_txn_id: row.ynab_txn_id,
        category_id: overrideId,
        is_split: isSplit,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[categorize/apply] failed", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
