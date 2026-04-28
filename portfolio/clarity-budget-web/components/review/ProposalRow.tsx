"use client";

import { useState } from "react";
import { T } from "@/lib/constants";

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
  const confidenceColor = confidence >= 0.8 ? T.safe : T.caution;

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
        <span style={{ color: T.text, fontWeight: 500, fontSize: 14 }}>
          {proposal.current_payee_name ?? "(unknown)"}
        </span>
        <span style={{ color: T.muted, fontSize: 13 }}>→</span>
        <span style={{ color: T.accent, fontWeight: 600, fontSize: 14 }}>
          {proposal.proposed_payee_name ?? "(unknown)"}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontWeight: 600,
            color: confidenceColor,
            background: `${confidenceColor}22`,
            border: `1px solid ${confidenceColor}44`,
            borderRadius: 4,
            padding: "2px 6px",
          }}
        >
          {confidenceLabel}
        </span>
      </div>

      {proposal.reason && (
        <p style={{ margin: "0 0 12px", fontSize: 12, color: T.muted, lineHeight: 1.5 }}>
          {proposal.reason}
        </p>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => handle("approve")}
          disabled={loading}
          style={{
            padding: "7px 14px",
            borderRadius: 6,
            border: "none",
            background: loading ? T.muted : T.safe,
            color: "#0a1f13",
            fontWeight: 600,
            fontSize: 13,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => handle("dismiss")}
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
