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

async function postCredentials(payload: {
  ynab_token?: string;
  default_budget_id?: string;
}) {
  try {
    await fetch("/api/credentials", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Best-effort sync; localStorage is the canonical source for the browser.
  }
}

async function pushIfSignedIn(b: BudgetBlob) {
  const sb = getSupabaseBrowserClient();
  const {
    data: { session },
  } = await sb.auth.getSession();
  if (!session?.user) return;
  await pushBlob(sb, b, session.user.id);
}

export function YnabConnectorCard() {
  const [token, setToken] = useState("");
  const [blob, setBlob] = useState<BudgetBlob>(defaultBlob());
  const [budgets, setBudgets] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [loadingBudgets, setLoadingBudgets] = useState(false);

  useEffect(() => {
    setBlob(loadLocalBlob());
    setToken(window.localStorage.getItem(YNAB_TOKEN_KEY) ?? "");
  }, []);

  useEffect(() => {
    const t = token.trim();
    if (!t) {
      setBudgets([]);
      return;
    }
    let cancelled = false;
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
  }, [token]);

  function handleTokenChange(next: string) {
    setToken(next);
    if (next.trim()) {
      window.localStorage.setItem(YNAB_TOKEN_KEY, next);
      void postCredentials({ ynab_token: next.trim() });
    } else {
      window.localStorage.removeItem(YNAB_TOKEN_KEY);
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
      <h2
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          color: T.text,
        }}
      >
        YNAB
      </h2>
      <p
        style={{
          margin: "4px 0 16px",
          fontSize: 13,
          color: T.muted,
        }}
      >
        Personal access token and active budget. Encrypted before sync.
      </p>

      <label
        style={{
          display: "block",
          fontSize: 12,
          color: T.muted,
          marginBottom: 14,
        }}
      >
        Personal access token
        <input
          type="password"
          autoComplete="off"
          value={token}
          onChange={(e) => handleTokenChange(e.target.value)}
          placeholder="ynab_..."
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
        />
      </label>

      <label
        style={{
          display: "block",
          fontSize: 12,
          color: T.muted,
        }}
      >
        Budget
        <select
          value={blob.ynabBudgetId ?? ""}
          onChange={(e) => handleBudgetChange(e.target.value)}
          disabled={!token.trim() || loadingBudgets}
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
            {!token.trim()
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
