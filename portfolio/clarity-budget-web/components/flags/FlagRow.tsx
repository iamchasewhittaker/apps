"use client";

import { useState } from "react";

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

function severityClasses(severity: Flag["severity"]): { text: string; badge: string } {
  if (severity === "high") return { text: "text-danger", badge: "bg-danger/15 border-danger/30" };
  if (severity === "medium") return { text: "text-warning", badge: "bg-warning/15 border-warning/30" };
  return { text: "text-muted", badge: "bg-muted/15 border-muted/30" };
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
  const sev = severityClasses(flag.severity);
  const sevLabel = flag.severity ?? "unknown";

  return (
    <div className="mb-3 rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="text-sm font-medium text-white">{title}</span>
        <span
          className={`ml-auto rounded border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${sev.text} ${sev.badge}`}
        >
          {sevLabel}
        </span>
      </div>

      <p className="mb-3 text-xs leading-relaxed text-muted">
        {subtitle}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handle}
          disabled={loading}
          className={`rounded-lg border border-dimmer bg-transparent px-3.5 py-1.5 text-sm font-medium ${
            loading ? "text-muted cursor-wait" : "text-white cursor-pointer"
          }`}
        >
          Dismiss
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}
