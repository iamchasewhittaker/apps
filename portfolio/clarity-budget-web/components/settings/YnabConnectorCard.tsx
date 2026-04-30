"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  hasEncryptedYnabToken: boolean;
  defaultBudgetId: string | null;
};

type Budget = { id: string; name: string };

async function postCredentials(payload: {
  ynab_token?: string;
  default_budget_id?: string;
}) {
  return fetch("/api/credentials", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function YnabConnectorCard({ hasEncryptedYnabToken, defaultBudgetId }: Props) {
  const router = useRouter();
  const [replacing, setReplacing] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(defaultBudgetId ?? "");

  const stored = hasEncryptedYnabToken && !replacing;

  useEffect(() => {
    if (!stored) {
      setBudgets([]);
      return;
    }
    let cancelled = false;
    setLoadingBudgets(true);
    void fetch("/api/ynab/budgets", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((json: { budgets: Budget[] }) => { if (!cancelled) setBudgets(json.budgets); })
      .catch(() => { if (!cancelled) setBudgets([]); })
      .finally(() => { if (!cancelled) setLoadingBudgets(false); });
    return () => { cancelled = true; };
  }, [stored]);

  async function handleBudgetChange(id: string) {
    setSelectedBudget(id);
    if (!id) return;
    await postCredentials({ default_budget_id: id });
    router.refresh();
  }

  return (
    <section className="mb-5 rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5">
      <h2 className="text-base font-semibold text-white">YNAB</h2>
      <p className="mt-1 mb-4 text-sm text-muted">
        Personal access token and active budget. Encrypted before sync.
      </p>

      <div className="mb-3.5">
        <div className="mb-1.5 text-xs text-muted">Personal access token</div>
        {stored ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-dimmer bg-bg px-3 py-2.5">
            <span className="text-sm text-white">Token stored in Supabase ✓</span>
            <button
              type="button"
              onClick={() => { setReplacing(true); }}
              className="rounded-md border border-dimmer bg-transparent px-3 py-1.5 text-sm text-white cursor-pointer"
            >
              Replace
            </button>
          </div>
        ) : (
          <ReplaceTokenInput
            onCancel={hasEncryptedYnabToken ? () => setReplacing(false) : undefined}
            onSubmit={async (next) => {
              await postCredentials({ ynab_token: next });
              setReplacing(false);
              router.refresh();
            }}
          />
        )}
      </div>

      <label className="block text-xs text-muted">
        Budget
        <select
          value={selectedBudget}
          onChange={(e) => void handleBudgetChange(e.target.value)}
          disabled={!stored || loadingBudgets}
          className="mt-1.5 block w-full rounded-lg border border-dimmer bg-bg px-3 py-2 text-sm text-white"
        >
          <option value="">
            {!stored
              ? "Add a token first"
              : loadingBudgets
              ? "Loading…"
              : budgets.length === 0
              ? "No budgets found"
              : "— Select —"}
          </option>
          {budgets.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}

function ReplaceTokenInput({
  onCancel,
  onSubmit,
}: {
  onCancel?: () => void;
  onSubmit: (next: string) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSaving(true);
    setError("");
    try {
      await onSubmit(trimmed);
    } catch {
      setError("Save failed. Check the token and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <input
        type="password"
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="ynab_..."
        className="block w-full rounded-lg border border-dimmer bg-bg px-3 py-2 text-sm text-white"
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={saving || !value.trim()}
          className={`rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-bg ${
            saving || !value.trim() ? "opacity-60 cursor-wait" : "cursor-pointer"
          }`}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-md border border-dimmer bg-transparent px-3 py-1.5 text-sm text-white cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
      {error && <div className="mt-2 text-sm text-danger">{error}</div>}
    </div>
  );
}
