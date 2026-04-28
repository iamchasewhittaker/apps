"use client";

import { useState } from "react";
import { T } from "@/lib/constants";

export type Flag = {
  id: string;
  user_id: string;
  type: "duplicate_txn" | "orphan_privacy_charge" | "orphan_ynab_privacy_payee";
  status: "open" | "acknowledged";
  severity: "high" | "medium" | "low" | null;
  related_ids: string[];
  details: Record<string, unknown>;
  fingerprint: string;
  created_at: string;
  acknowledged_at: string | null;
};

type Props = {
  flag: Flag;
  onResolved: (id: string) => void;
};

function severityColor(severity: Flag["severity"]): string {
  if (severity === "high") return T.danger;
  if (severity === "medium") return T.caution;
  return T.muted;
}

function renderContext(flag: Flag): { title: string; subtitle: string } {
  if (flag.type === "duplicate_txn") {
    const d = flag.details as { amount: number; date_a: string; date_b: string };
    const dollars = (Math.abs(d.amount) / 1000).toFixed(2);
    return {
      title: "Possible duplicate transaction",
      subtitle: `$${dollars} · ${d.date_a} and ${d.date_b}`,
    };
  }
  if (flag.type === "orphan_privacy_charge") {
    const d = flag.details as { amount_cents: number; settled: string };
    const dollars = (d.amount_cents / 100).toFixed(2);
    return {
      title: "Privacy charge with no YNAB match",
      subtitle: `$${dollars} · settled ${d.settled.slice(0, 10)}`,
    };
  }
  const d = flag.details as { payee_name: string; date: string };
  return {
    title: "YNAB transaction looks like Privacy but unmatched",
    subtitle: `${d.payee_name} · ${d.date}`,
  };
}

export function FlagRow({ flag, onResolved }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handle() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/flags/${flag.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "dismiss" }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? `Failed (HTTP ${res.status})`);
        setLoading(false);
        return;
      }
      onResolved(flag.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  const { title, subtitle } = renderContext(flag);
  const sevColor = severityColor(flag.severity);
  const sevLabel = flag.severity ?? "unknown";

  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ color: T.text, fontWeight: 500, fontSize: 14 }}>{title}</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 600,
            color: sevColor,
            background: `${sevColor}22`,
            border: `1px solid ${sevColor}44`,
            borderRadius: 4,
            padding: "2px 6px",
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          {sevLabel}
        </span>
      </div>

      <p style={{ margin: "0 0 12px", fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
        {subtitle}
      </p>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={handle}
          disabled={loading}
          style={{
            padding: "7px 14px",
            borderRadius: 6,
            border: `1px solid ${T.border}`,
            background: "transparent",
            color: loading ? T.muted : T.text,
            fontWeight: 500,
            fontSize: 13,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          Dismiss
        </button>
      </div>

      {error && (
        <p style={{ margin: "8px 0 0", fontSize: 12, color: T.danger }}>{error}</p>
      )}
    </div>
  );
}
