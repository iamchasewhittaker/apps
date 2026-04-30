"use client";

import { useState } from "react";

export type Proposal = {
  id: string;
  user_id: string;
  type: "payee_rename";
  status: "pending" | "approved" | "dismissed";
  ynab_txn_id: string | null;
  privacy_txn_token: string | null;
  current_payee_name: string | null;
  proposed_payee_name: string | null;
  proposed_payee_id: string | null;
  confidence: number | null;
  reason: string | null;
  created_at: string;
};

type Props = {
  proposal: Proposal;
  onResolved: (id: string) => void;
};

export function ProposalRow({ proposal, onResolved }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handle(action: "approve" | "dismiss") {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/proposals/${proposal.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? `Failed (HTTP ${res.status})`);
        setLoading(false);
        return;
      }
      onResolved(proposal.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  const confidence = proposal.confidence ?? 0;
  const confidenceLabel = `${Math.round(confidence * 100)}%`;
  const high = confidence >= 0.8;

  return (
    <div className="mb-3 rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="text-sm font-medium text-white">
          {proposal.current_payee_name ?? "(unknown)"}
        </span>
        <span className="text-sm text-muted">→</span>
        <span className="text-sm font-semibold text-accent">
          {proposal.proposed_payee_name ?? "(unknown)"}
        </span>
        <span
          className={`ml-auto rounded px-1.5 py-0.5 text-[11px] font-semibold border ${
            high
              ? "text-accent bg-accent/15 border-accent/30"
              : "text-warning bg-warning/15 border-warning/30"
          }`}
        >
          {confidenceLabel}
        </span>
      </div>

      {proposal.reason && (
        <p className="mb-3 text-xs leading-relaxed text-muted">
          {proposal.reason}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handle("approve")}
          disabled={loading}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold ${
            loading
              ? "bg-muted text-bg cursor-wait"
              : "bg-accent text-bg cursor-pointer"
          }`}
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => handle("dismiss")}
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
