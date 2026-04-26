"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { T } from "@/lib/constants";
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
  if (c >= 0.75) return T.safe;
  if (c >= 0.5) return T.caution;
  return T.danger;
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
    <div
      style={{
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        background: T.surface,
        padding: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {snap.payee_name ?? "(no payee)"}
            </span>
            <span style={{ fontSize: 13, color: T.muted }}>
              {formatAmount(snap.amount)}
            </span>
            <span style={{ fontSize: 12, color: T.muted }}>{snap.date}</span>
            {snap.is_split ? (
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: T.bg,
                  color: T.muted,
                  border: `1px solid ${T.border}`,
                }}
              >
                split
              </span>
            ) : null}
          </div>

          <div
            style={{
              marginTop: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {snap.is_split ? (
              <div style={{ fontSize: 12, color: T.muted }}>
                {row.subtransactions?.length ?? 0} subtransaction
                {row.subtransactions?.length === 1 ? "" : "s"} —{" "}
                {row.subtransactions?.every((s) => s.categoryId !== null)
                  ? "all subs assigned"
                  : "some subs need manual review"}
              </div>
            ) : (
              <span
                style={{
                  fontSize: 12,
                  padding: "3px 8px",
                  borderRadius: 4,
                  background: T.bg,
                  border: `1px solid ${T.border}`,
                  color: row.category_name ? T.text : T.muted,
                }}
              >
                {row.category_name ?? "(no suggestion)"}
              </span>
            )}
            <span
              style={{
                fontSize: 11,
                color: confidenceColor(row.confidence),
                fontWeight: 500,
              }}
            >
              {confidencePct(row.confidence)} confidence
            </span>
          </div>

          {row.reasoning ? (
            <div style={{ marginTop: 8, fontSize: 12, color: T.muted }}>
              {row.reasoning}
            </div>
          ) : null}

          {snap.is_split && row.subtransactions ? (
            <ul
              style={{
                marginTop: 8,
                paddingLeft: 16,
                fontSize: 12,
                color: T.muted,
                listStyle: "disc",
              }}
            >
              {row.subtransactions.map((s, i) => (
                <li key={s.id ?? i}>
                  {formatAmount(s.amount)} → {s.categoryName ?? "(unassigned)"}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            disabled={!canApply || busy !== null}
            onClick={() => send("apply")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 12,
              border: `1px solid ${canApply ? T.safe : T.border}`,
              background: canApply ? T.safe : "transparent",
              color: canApply ? "#0b1f15" : T.muted,
              fontWeight: 500,
              cursor: canApply && busy === null ? "pointer" : "not-allowed",
            }}
          >
            {busy === "apply" ? "Applying…" : "Apply"}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => send("dismiss")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 12,
              border: `1px solid ${T.border}`,
              background: "transparent",
              color: T.muted,
              cursor: busy === null ? "pointer" : "not-allowed",
            }}
          >
            {busy === "dismiss" ? "…" : "Dismiss"}
          </button>
        </div>
      </div>

      {error ? (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: T.danger,
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
