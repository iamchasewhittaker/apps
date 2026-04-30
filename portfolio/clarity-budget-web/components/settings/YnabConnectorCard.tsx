"use client";

import { useEffect, useState } from "react";
import {
  defaultBlob,
  loadLocalBlob,
  saveLocalBlob,
  type BudgetBlob,
} from "@/lib/blob";
import { YNAB_TOKEN_KEY } from "@/lib/constants";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { pushBlob } from "@/lib/sync";
import { fetchBudgets } from "@/lib/ynab";

type Props = {
  hasEncryptedYnabToken: boolean;
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

async function pushIfSignedIn(b: BudgetBlob) {
  const sb = getSupabaseBrowserClient();
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (!session?.user) return;
  await pushBlob(sb, b, session.user.id);
}

async function fetchBudgetsViaServer(): Promise<Budget[]> {
  const res = await fetch("/api/ynab/budgets", { cache: "no-store" });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  const json = (await res.json()) as { budgets: Budget[] };
  return json.budgets;
}

export function YnabConnectorCard({ hasEncryptedYnabToken }: Props) {
  const [token, setToken] = useState("");
  const [blob, setBlob] = useState<BudgetBlob>(defaultBlob());
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [savingToken, setSavingToken] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    setBlob(loadLocalBlob());
    setToken(window.localStorage.getItem(YNAB_TOKEN_KEY) ?? "");
  }, []);

  const stored = hasEncryptedYnabToken && !replacing;

  useEffect(() => {
    let cancelled = false;
    if (stored) {
      setLoadingBudgets(true);
      void (async () => {
        try {
          const list = await fetchBudgetsViaServer();
          if (!cancelled) setBudgets(list);
        } catch {
          if (!cancelled) setBudgets([]);
        } finally {
          if (!cancelled) setLoadingBudgets(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }

    const t = token.trim();
    if (!t) {
      setBudgets([]);
      return;
    }
    setLoadingBudgets(true);
    void (async () => {
      try {
        const list = await fetchBudgets(t);
        if (!cancelled) setBudgets(list);
      } catch {
        if (!cancelled) setBudgets([]);
      } finally {
        if (!cancelled) setLoadingBudgets(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stored, token]);

  function handleTokenChange(next: string) {
    setToken(next);
    if (next.trim()) {
      window.localStorage.setItem(YNAB_TOKEN_KEY, next);
      void postCredentials({ ynab_token: next.trim() });
    } else {
      window.localStorage.removeItem(YNAB_TOKEN_KEY);
    }
  }

  async function handleReplaceSubmit(next: string) {
    const trimmed = next.trim();
    if (!trimmed) return;
    setSavingToken(true);
    setTokenError("");
    try {
      const res = await postCredentials({ ynab_token: trimmed });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setTokenError(body.error ?? `Save failed (HTTP ${res.status})`);
        return;
      }
      window.localStorage.setItem(YNAB_TOKEN_KEY, trimmed);
      setReplacing(false);
      setToken(trimmed);
    } finally {
      setSavingToken(false);
    }
  }

  function handleBudgetChange(id: string) {
    const next: BudgetBlob = {
      ...blob,
      ynabBudgetId: id || null,
      ynabCategoryMappings: id ? blob.ynabCategoryMappings : [],
      ynabAutoSuggestGroupIds: id ? (blob.ynabAutoSuggestGroupIds ?? []) : [],
    };
    const saved = saveLocalBlob(next);
    setBlob(saved);
    void pushIfSignedIn(saved);
    if (id) void postCredentials({ default_budget_id: id });
  }

  const budgetDisabled =
    (stored ? loadingBudgets : !token.trim() || loadingBudgets);

  return (
    <section className="mb-5 rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5">
      <h2 className="text-base font-semibold text-white">
        YNAB
      </h2>
      <p className="mt-1 mb-4 text-sm text-muted">
        Personal access token and active budget. Encrypted before sync.
      </p>

      <div className="mb-3.5">
        <div className="mb-1.5 text-xs text-muted">
          Personal access token
        </div>
        {stored ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-dimmer bg-bg px-3 py-2.5">
            <span className="text-sm text-white">
              Token stored in Supabase ✓
            </span>
            <button
              type="button"
              onClick={() => {
                setReplacing(true);
                setToken("");
                setTokenError("");
              }}
              className="rounded-md border border-dimmer bg-transparent px-3 py-1.5 text-sm text-white cursor-pointer"
            >
              Replace
            </button>
          </div>
        ) : replacing ? (
          <ReplaceTokenInput
            saving={savingToken}
            error={tokenError}
            onCancel={() => {
              setReplacing(false);
              setTokenError("");
            }}
            onSubmit={handleReplaceSubmit}
          />
        ) : (
          <input
            type="password"
            autoComplete="off"
            value={token}
            onChange={(e) => handleTokenChange(e.target.value)}
            placeholder="ynab_..."
            className="block w-full rounded-lg border border-dimmer bg-bg px-3 py-2 text-sm text-white"
          />
        )}
      </div>

      <label className="block text-xs text-muted">
        Budget
        <select
          value={blob.ynabBudgetId ?? ""}
          onChange={(e) => handleBudgetChange(e.target.value)}
          disabled={budgetDisabled}
          className="mt-1.5 block w-full rounded-lg border border-dimmer bg-bg px-3 py-2 text-sm text-white"
        >
          <option value="">
            {loadingBudgets
              ? "Loading…"
              : !stored && !token.trim()
              ? "Add a token first"
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
  saving,
  error,
  onCancel,
  onSubmit,
}: {
  saving: boolean;
  error: string;
  onCancel: () => void;
  onSubmit: (next: string) => void;
}) {
  const [value, setValue] = useState("");
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
          onClick={() => onSubmit(value)}
          disabled={saving || !value.trim()}
          className={`rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-bg ${
            saving || !value.trim() ? "opacity-60 cursor-wait" : "cursor-pointer"
          }`}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-md border border-dimmer bg-transparent px-3 py-1.5 text-sm text-white cursor-pointer"
        >
          Cancel
        </button>
      </div>
      {error && (
        <div className="mt-2 text-sm text-danger">{error}</div>
      )}
    </div>
  );
}
