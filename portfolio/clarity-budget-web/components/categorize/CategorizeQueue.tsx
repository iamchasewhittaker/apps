"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-dimmer bg-surface/80 backdrop-blur-sm p-4">
        <div className="flex-1">
          <div className="text-sm font-medium">
            {rows.length === 0
              ? "No suggestions waiting"
              : `${rows.length} suggestion${rows.length === 1 ? "" : "s"} waiting for review`}
          </div>
          <div className="mt-0.5 text-xs text-muted">
            {syncState?.last_success_at
              ? `Last run: ${new Date(syncState.last_success_at).toLocaleString()}`
              : "Never run"}
            {syncState?.last_error ? (
              <span className="ml-2 text-danger">
                · last error: {syncState.last_error}
              </span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={runNow}
          disabled={running}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium ${
            running
              ? "border border-dimmer bg-surface text-muted cursor-not-allowed"
              : "bg-accent text-white cursor-pointer"
          }`}
        >
          {running ? "Running…" : "Run categorization"}
        </button>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-danger p-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {lastRun ? (
        <div className="mb-4 rounded-md border border-dimmer bg-surface/80 backdrop-blur-sm p-3 text-sm text-muted">
          Run complete · fetched {lastRun.fetched} · auto-applied{" "}
          <span className="text-accent">{lastRun.autoApplied}</span> · queued{" "}
          <span className="text-white">{lastRun.queued}</span>
          {lastRun.invalid > 0
            ? ` · invalid ${lastRun.invalid}`
            : ""}
          {lastRun.cached > 0 ? ` · cached ${lastRun.cached}` : ""}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-dimmer p-8 text-center text-sm text-muted">
          You&rsquo;re all caught up. Click &ldquo;Run categorization&rdquo; to
          check for new uncategorized transactions.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <CategorizeRow key={r.id} row={r} />
          ))}
        </div>
      )}
    </>
  );
}
