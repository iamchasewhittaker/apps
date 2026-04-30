"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Suggestion } from "@/lib/categorize/types";

type Row = {
  id: string;
  ynab_txn_id: string;
  category_id: string | null;
  category_name: string | null;
  confidence: number;
  reasoning: string;
  subtransactions: Suggestion["subtransactions"] | null;
  txn_snapshot: {
    date: string;
    amount: number;
    payee_name: string | null;
    memo: string | null;
    is_split: boolean;
  };
};

function formatAmount(milliunits: number): string {
  const sign = milliunits < 0 ? "-" : "+";
  return `${sign}$${(Math.abs(milliunits) / 1000).toFixed(2)}`;
}

function confidencePct(c: number): string {
  return `${Math.round(c * 100)}%`;
}

function confidenceColor(c: number): string {
  if (c >= 0.75) return "text-accent";
  if (c >= 0.5) return "text-warning";
  return "text-danger";
}

export function CategorizeRow({ row }: { row: Row }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"apply" | "dismiss" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function send(action: "apply" | "dismiss") {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch("/api/categorize/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestion_id: row.id, action }),
      });
      const json = (await res.json()) as { ok?: true; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? `HTTP ${res.status}`);
        return;
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  }

  const snap = row.txn_snapshot;
  const canApply =
    snap.is_split
      ? Array.isArray(row.subtransactions) &&
        row.subtransactions.length > 0 &&
        row.subtransactions.every((s) => s.categoryId !== null)
      : row.category_id !== null;

  return (
    <div className="rounded-lg border border-dimmer bg-surface/80 backdrop-blur-sm p-3.5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm font-medium">
              {snap.payee_name ?? "(no payee)"}
            </span>
            <span className="text-sm text-muted">
              {formatAmount(snap.amount)}
            </span>
            <span className="text-xs text-muted">{snap.date}</span>
            {snap.is_split ? (
              <span className="rounded border border-dimmer bg-bg px-1.5 py-0.5 text-[11px] text-muted">
                split
              </span>
            ) : null}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {snap.is_split ? (
              <div className="text-xs text-muted">
                {row.subtransactions?.length ?? 0} subtransaction
                {row.subtransactions?.length === 1 ? "" : "s"} —{" "}
                {row.subtransactions?.every((s) => s.categoryId !== null)
                  ? "all subs assigned"
                  : "some subs need manual review"}
              </div>
            ) : (
              <span
                className={`rounded border border-dimmer bg-bg px-2 py-0.5 text-xs ${
                  row.category_name ? "text-white" : "text-muted"
                }`}
              >
                {row.category_name ?? "(no suggestion)"}
              </span>
            )}
            <span className={`text-[11px] font-medium ${confidenceColor(row.confidence)}`}>
              {confidencePct(row.confidence)} confidence
            </span>
          </div>

          {row.reasoning ? (
            <div className="mt-2 text-xs text-muted">
              {row.reasoning}
            </div>
          ) : null}

          {snap.is_split && row.subtransactions ? (
            <ul className="mt-2 list-disc pl-4 text-xs text-muted">
              {row.subtransactions.map((s, i) => (
                <li key={s.id ?? i}>
                  {formatAmount(s.amount)} → {s.categoryName ?? "(unassigned)"}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            disabled={!canApply || busy !== null}
            onClick={() => send("apply")}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
              canApply
                ? "border-accent bg-accent text-bg"
                : "border-dimmer bg-transparent text-muted"
            } ${canApply && busy === null ? "cursor-pointer" : "cursor-not-allowed"}`}
          >
            {busy === "apply" ? "Applying…" : "Apply"}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => send("dismiss")}
            className={`rounded-md border border-dimmer bg-transparent px-3 py-1.5 text-xs text-muted ${
              busy === null ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            {busy === "dismiss" ? "…" : "Dismiss"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-2 text-xs text-danger">
          {error}
        </div>
      ) : null}
    </div>
  );
}
