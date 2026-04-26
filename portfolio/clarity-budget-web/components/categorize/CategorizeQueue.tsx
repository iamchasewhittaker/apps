"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { T } from "@/lib/constants";
import type { Suggestion } from "@/lib/categorize/types";
import { CategorizeRow } from "./CategorizeRow";

type Row = {
  id: string;
  ynab_txn_id: string;
  status: string;
  category_id: string | null;
  category_name: string | null;
  confidence: number;
  reasoning: string;
  model_id: string;
  subtransactions: Suggestion["subtransactions"] | null;
  txn_snapshot: {
    date: string;
    amount: number;
    payee_name: string | null;
    memo: string | null;
    is_split: boolean;
  };
  created_at: string;
};

type SyncState = {
  last_run_at: string | null;
  last_success_at: string | null;
  last_error: string | null;
};

type RunSummary = {
  fetched: number;
  cached: number;
  suggested: number;
  autoApplied: number;
  queued: number;
  invalid: number;
  modelId: string;
};

export function CategorizeQueue({
  rows,
  syncState,
}: {
  rows: Row[];
  syncState: SyncState | null;
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<RunSummary | null>(null);

  async function runNow() {
    setRunning(true);
    setError(null);
    setLastRun(null);
    try {
      const res = await fetch("/api/categorize/run", { method: "POST" });
      const json = (await res.json()) as
        | { ok: true; summary: RunSummary }
        | { error: string };
      if (!res.ok || !("ok" in json)) {
        setError("error" in json ? json.error : `HTTP ${res.status}`);
        return;
      }
      setLastRun(json.summary);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 16,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          background: T.surface,
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>
            {rows.length === 0
              ? "No suggestions waiting"
              : `${rows.length} suggestion${rows.length === 1 ? "" : "s"} waiting for review`}
          </div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
            {syncState?.last_success_at
              ? `Last run: ${new Date(syncState.last_success_at).toLocaleString()}`
              : "Never run"}
            {syncState?.last_error ? (
              <span style={{ color: T.danger, marginLeft: 8 }}>
                · last error: {syncState.last_error}
              </span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={runNow}
          disabled={running}
          style={{
            padding: "8px 14px",
            borderRadius: 6,
            border: `1px solid ${T.accent}`,
            background: running ? T.surface : T.accent,
            color: running ? T.muted : "#fff",
            fontSize: 13,
            fontWeight: 500,
            cursor: running ? "not-allowed" : "pointer",
          }}
        >
          {running ? "Running…" : "Run categorization"}
        </button>
      </div>

      {error ? (
        <div
          style={{
            padding: 12,
            border: `1px solid ${T.danger}`,
            borderRadius: 6,
            color: T.danger,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      ) : null}

      {lastRun ? (
        <div
          style={{
            padding: 12,
            border: `1px solid ${T.border}`,
            borderRadius: 6,
            color: T.muted,
            fontSize: 13,
            marginBottom: 16,
            background: T.surface,
          }}
        >
          Run complete · fetched {lastRun.fetched} · auto-applied{" "}
          <span style={{ color: T.safe }}>{lastRun.autoApplied}</span> · queued{" "}
          <span style={{ color: T.text }}>{lastRun.queued}</span>
          {lastRun.invalid > 0
            ? ` · invalid ${lastRun.invalid}`
            : ""}
          {lastRun.cached > 0 ? ` · cached ${lastRun.cached}` : ""}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div
          style={{
            padding: 32,
            border: `1px dashed ${T.border}`,
            borderRadius: 8,
            color: T.muted,
            fontSize: 13,
            textAlign: "center",
          }}
        >
          You&rsquo;re all caught up. Click &ldquo;Run categorization&rdquo; to
          check for new uncategorized transactions.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((r) => (
            <CategorizeRow key={r.id} row={r} />
          ))}
        </div>
      )}
    </>
  );
}
