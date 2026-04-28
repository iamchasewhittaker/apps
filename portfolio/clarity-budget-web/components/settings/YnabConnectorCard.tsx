"use client";

import { useEffect, useState } from "react";
import {
  defaultBlob,
  loadLocalBlob,
  saveLocalBlob,
  type BudgetBlob,
} from "@/lib/blob";
import { T, YNAB_TOKEN_KEY } from "@/lib/constants";
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
    <section
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.text }}>
        YNAB
      </h2>
      <p style={{ margin: "4px 0 16px", fontSize: 13, color: T.muted }}>
        Personal access token and active budget. Encrypted before sync.
      </p>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>
          Personal access token
        </div>
        {stored ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.bg,
            }}
          >
            <span style={{ fontSize: 14, color: T.text }}>
              Token stored in Supabase ✓
            </span>
            <button
              type="button"
              onClick={() => {
                setReplacing(true);
                setToken("");
                setTokenError("");
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: `1px solid ${T.border}`,
                background: "transparent",
                color: T.text,
                fontSize: 13,
                cursor: "pointer",
              }}
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
            style={{
              display: "block",
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: `1px solid ${T.border}`,
              background: T.bg,
              color: T.text,
              fontSize: 14,
            }}
          />
        )}
      </div>

      <label style={{ display: "block", fontSize: 12, color: T.muted }}>
        Budget
        <select
          value={blob.ynabBudgetId ?? ""}
          onChange={(e) => handleBudgetChange(e.target.value)}
          disabled={budgetDisabled}
          style={{
            display: "block",
            marginTop: 6,
            width: "100%",
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.bg,
            color: T.text,
            fontSize: 14,
          }}
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
        style={{
          display: "block",
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: `1px solid ${T.border}`,
          background: T.bg,
          color: T.text,
          fontSize: 14,
        }}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          type="button"
          onClick={() => onSubmit(value)}
          disabled={saving || !value.trim()}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            background: T.accent,
            color: "#0b1220",
            fontSize: 13,
            fontWeight: 600,
            cursor: saving ? "wait" : "pointer",
            opacity: saving || !value.trim() ? 0.6 : 1,
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: `1px solid ${T.border}`,
            background: "transparent",
            color: T.text,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
      {error && (
        <div style={{ marginTop: 8, color: T.danger, fontSize: 13 }}>{error}</div>
      )}
    </div>
  );
}
