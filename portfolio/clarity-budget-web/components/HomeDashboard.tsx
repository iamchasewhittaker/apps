"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultBlob,
  loadLocalBlob,
  mergeBlob,
  saveLocalBlob,
  type BudgetBlob,
} from "@/lib/blob";
import {
  STORE_KEY,
  YNAB_TOKEN_KEY,
  YNAB_TX_KEY,
  T,
} from "@/lib/constants";
import {
  buildBalances,
  currentShortfall,
  daysRemainingInMonth,
  safePerDay,
  safePerWeek,
  safeToSpend,
} from "@/lib/metrics";
import { pullBlob, pushBlob } from "@/lib/sync";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { suggestRole, type RoleRaw } from "@/lib/suggestRole";
import { groupMappingsForDisplay, mergeCategoryMappingsFromGroups } from "@/lib/ynabCategoryMerge";
import {
  fetchCategories,
  fetchMonth,
  fetchTransactions,
  type YNABTransaction,
} from "@/lib/ynab";
import { flattenSpendLines } from "@/lib/aggregations";
import { applyFilters, useUrlFilterState } from "@/lib/filterState";
import { TransactionFilters } from "./TransactionFilters";
import { SpendingBreakdown } from "./SpendingBreakdown";
import { TransactionList } from "./TransactionList";
import { StsCard } from "./dashboard/StsCard";
import { ShortfallBanner } from "./dashboard/ShortfallBanner";
import { LastUpdated } from "./dashboard/LastUpdated";
import { EmptyState } from "./dashboard/EmptyState";
import { PageHeader } from "./shell/PageHeader";

const ROLE_OPTIONS: { value: RoleRaw; label: string }[] = [
  { value: "mortgage", label: "Mortgage / Housing" },
  { value: "bill", label: "Fixed Bill" },
  { value: "essential", label: "Essential Variable" },
  { value: "flexible", label: "Flexible Spending" },
  { value: "ignore", label: "Ignore" },
];

const TX_CACHE_MS = 15 * 60 * 1000;

/** Returns YYYY-MM-DD for 60 days ago */
function txSinceDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 60);
  return d.toISOString().slice(0, 10);
}

interface TxCache {
  ts: number;
  data: YNABTransaction[];
}

function loadTxCache(): TxCache | null {
  try {
    const raw = localStorage.getItem(YNAB_TX_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TxCache;
  } catch {
    return null;
  }
}

function saveTxCache(data: YNABTransaction[]) {
  localStorage.setItem(YNAB_TX_KEY, JSON.stringify({ ts: Date.now(), data }));
}

export function HomeDashboard() {
  const [blob, setBlob] = useState<BudgetBlob>(defaultBlob());
  const [ynabToken, setYnabToken] = useState("");

  const [safeM, setSafeM] = useState<number | null>(null);
  const [safeD, setSafeD] = useState<number | null>(null);
  const [safeW, setSafeW] = useState<number | null>(null);
  const [shortfall, setShortfall] = useState<number | null>(null);
  const [updated, setUpdated] = useState<Date | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categorySyncErr, setCategorySyncErr] = useState<string | null>(null);

  // Transactions — stored separately from blob (never synced to Supabase)
  const [transactions, setTransactions] = useState<YNABTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(false);
  const [txErr, setTxErr] = useState<string | null>(null);

  useEffect(() => {
    const b = loadLocalBlob();
    setBlob(b);
    setYnabToken(localStorage.getItem(YNAB_TOKEN_KEY) || "");
    // Hydrate from cache immediately so breakdown renders on load
    const cache = loadTxCache();
    if (cache?.data?.length) setTransactions(cache.data);
  }, []);

  const syncFromCloud = useCallback(async (b: BudgetBlob) => {
    const sb = getSupabaseBrowserClient();
    const {
      data: { session },
    } = await sb.auth.getSession();
    if (!session?.user) return b;
    const remote = await pullBlob(sb, session.user.id, b);
    if (remote) {
      const merged = mergeBlob(remote);
      localStorage.setItem(STORE_KEY, JSON.stringify(merged));
      return merged;
    }
    return b;
  }, []);

  const pushIfSignedIn = useCallback(async (b: BudgetBlob) => {
    const sb = getSupabaseBrowserClient();
    const {
      data: { session },
    } = await sb.auth.getSession();
    if (!session?.user) return;
    await pushBlob(sb, b, session.user.id);
  }, []);

  useEffect(() => {
    void (async () => {
      const next = await syncFromCloud(loadLocalBlob());
      setBlob(next);
    })();
  }, [syncFromCloud]);

  const persistBlob = useCallback(
    (next: BudgetBlob) => {
      const saved = saveLocalBlob(next);
      setBlob(saved);
      void pushIfSignedIn(saved);
    },
    [pushIfSignedIn]
  );

  const refreshTransactions = useCallback(
    async (force = false) => {
      const t = ynabToken.trim();
      const budgetId = (blob.ynabBudgetId ?? "").trim();
      if (!t || !budgetId) return;

      const cache = loadTxCache();
      if (!force && cache && Date.now() - cache.ts < TX_CACHE_MS) return;

      setTxLoading(true);
      setTxErr(null);
      try {
        const txns = await fetchTransactions(t, budgetId, txSinceDate());
        saveTxCache(txns);
        setTransactions(txns);
      } catch (e) {
        setTxErr(e instanceof Error ? e.message : "Could not load transactions");
      } finally {
        setTxLoading(false);
      }
    },
    [blob.ynabBudgetId, ynabToken]
  );

  const refreshMetrics = useCallback(
    async (force = false) => {
      setErr(null);
      const t = ynabToken.trim();
      const budgetId = (blob.ynabBudgetId ?? "").trim();
      if (!t || !budgetId) {
        setSafeM(null);
        setSafeD(null);
        setSafeW(null);
        setShortfall(null);
        return;
      }
      setLoading(true);
      try {
        const base = loadLocalBlob();
        let mappings = base.ynabCategoryMappings;
        try {
          const groups = await fetchCategories(t, budgetId);
          const merged = mergeCategoryMappingsFromGroups(base, groups);
          mappings = merged;
          persistBlob({ ...base, ynabCategoryMappings: merged });
          setCategorySyncErr(null);
        } catch (e) {
          setCategorySyncErr(
            e instanceof Error ? e.message : "Could not load YNAB categories."
          );
        }
        if (!mappings.length) {
          setErr("Pick a budget and wait for categories to load, or map roles below.");
          return;
        }
        const month = await fetchMonth(t, budgetId, new Date());
        const tbb = (month.to_be_budgeted ?? 0) / 1000;
        const balances = buildBalances(month.categories, mappings);
        const sts = safeToSpend(balances, tbb);
        const days = daysRemainingInMonth();
        setSafeM(sts);
        setSafeD(safePerDay(balances, days, tbb));
        setSafeW(safePerWeek(balances, days, tbb));
        setShortfall(currentShortfall(balances));
        setUpdated(new Date());
        await refreshTransactions(force);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "YNAB request failed");
      } finally {
        setLoading(false);
      }
    },
    [blob.ynabBudgetId, ynabToken, persistBlob, refreshTransactions]
  );

  useEffect(() => {
    void refreshMetrics();
  }, [refreshMetrics]);

  const updateMappingRole = (categoryId: string, roleRaw: RoleRaw) => {
    persistBlob({
      ...blob,
      ynabCategoryMappings: blob.ynabCategoryMappings.map((m) =>
        m.ynabCategoryID === categoryId ? { ...m, roleRaw } : m
      ),
    });
    void refreshMetrics();
  };

  const setGroupAutoSuggest = (groupId: string, enabled: boolean) => {
    const ids = new Set(blob.ynabAutoSuggestGroupIds ?? []);
    if (enabled) {
      ids.add(groupId);
      const idArr = [...ids].sort();
      const mappings = blob.ynabCategoryMappings.map((m) =>
        m.ynabGroupId === groupId
          ? { ...m, roleRaw: suggestRole(m.ynabCategoryName, m.ynabGroupName) }
          : m
      );
      persistBlob({ ...blob, ynabAutoSuggestGroupIds: idArr, ynabCategoryMappings: mappings });
    } else {
      ids.delete(groupId);
      persistBlob({ ...blob, ynabAutoSuggestGroupIds: [...ids].sort() });
    }
    void refreshMetrics();
  };

  // ── Spending analytics — flatten once, then filter ───────────────────────

  const spendLines = useMemo(
    () => flattenSpendLines(transactions, blob.ynabCategoryMappings),
    [transactions, blob.ynabCategoryMappings]
  );

  const [filters, setFilters] = useUrlFilterState();
  const filteredLines = useMemo(
    () => applyFilters(spendLines, filters),
    [spendLines, filters]
  );

  // ─────────────────────────────────────────────────────────────────────────

  const categoryRoleGroups = groupMappingsForDisplay(blob.ynabCategoryMappings);
  const ynabReady =
    ynabToken.trim().length > 0 && (blob.ynabBudgetId ?? "").trim().length > 0;
  const hasMetrics = safeM != null;
  const showEmpty =
    !loading &&
    !hasMetrics &&
    (!ynabToken.trim() || !blob.ynabBudgetId || !blob.ynabCategoryMappings.length);
  const hasSpending = spendLines.length > 0;

  return (
    <div className="mx-auto max-w-lg space-y-7">
      <PageHeader title="Dashboard" subtitle="SAFE TO SPEND · YNAB" />

        <StsCard safeM={safeM} safeW={safeW} safeD={safeD} loading={loading} />
        <ShortfallBanner shortfall={shortfall} />
        {(hasMetrics || loading) && (
          <LastUpdated
            updated={updated}
            loading={loading}
            onRefresh={() => void refreshMetrics(true)}
          />
        )}

        {/* ── Filters + spending breakdown + list ── */}
        {hasSpending && (
          <div className="space-y-4">
            <TransactionFilters
              filters={filters}
              onChange={setFilters}
              lines={spendLines}
            />
            {txLoading && (
              <p className="animate-pulse text-xs" style={{ color: T.muted }}>
                Refreshing transactions…
              </p>
            )}
            {txErr && (
              <p className="text-xs" style={{ color: T.danger }}>
                {txErr}
              </p>
            )}
            <SpendingBreakdown lines={filteredLines} />
            <TransactionList lines={filteredLines} />
          </div>
        )}

        {showEmpty && !loading && <EmptyState />}

        {err && (
          <p
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: T.danger, color: T.danger }}
          >
            {err}
          </p>
        )}

        {/* Category roles */}
        {ynabReady && (
        <section
          className="space-y-3 rounded-xl border p-4"
          style={{ borderColor: T.border, background: T.surface }}
        >
          <h2 className="text-sm font-semibold">Category roles</h2>
          <p className="text-[11px]" style={{ color: T.muted }}>
            Token and budget live in{" "}
            <a href="/settings" className="underline" style={{ color: T.accent }}>
              Settings
            </a>
            .
          </p>

          {categorySyncErr && (
            <p className="text-xs" style={{ color: T.danger }}>
              {categorySyncErr}
            </p>
          )}
          {!categorySyncErr && blob.ynabCategoryMappings.length === 0 && (
            <p className="text-xs" style={{ color: T.muted }}>
              Loading categories…
            </p>
          )}

          {blob.ynabCategoryMappings.length > 0 && (
            <div className="space-y-3 border-t pt-3" style={{ borderColor: T.border }}>
              <p className="text-[11px] leading-relaxed" style={{ color: T.muted }}>
                Grouped like YNAB.{" "}
                <strong className="text-neutral-300">Auto from names</strong> re-applies
                suggestions whenever categories refresh.
              </p>
              {categoryRoleGroups.map((g) => (
                <details
                  key={g.groupId || g.groupName}
                  className="rounded-lg border"
                  style={{ borderColor: T.border }}
                >
                  <summary className="cursor-pointer list-none px-3 py-2 [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{g.groupName}</span>
                      <span className="text-xs" style={{ color: T.muted }}>
                        ({g.rows.length})
                      </span>
                      {g.groupId ? (
                        <label
                          className="ml-auto flex items-center gap-1.5 text-[11px]"
                          style={{ color: T.muted }}
                        >
                          <input
                            type="checkbox"
                            checked={(blob.ynabAutoSuggestGroupIds ?? []).includes(g.groupId)}
                            onChange={(e) => {
                              e.stopPropagation();
                              setGroupAutoSuggest(g.groupId, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          Auto
                        </label>
                      ) : null}
                    </div>
                  </summary>
                  <ul
                    className="space-y-2 border-t px-3 py-2"
                    style={{ borderColor: T.border }}
                  >
                    {g.rows.map((m) => (
                      <li
                        key={m.ynabCategoryID}
                        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2"
                      >
                        <span className="min-w-0 flex-1 truncate text-sm">
                          {m.ynabCategoryName}
                        </span>
                        <select
                          className="rounded-md border px-2 py-1.5 text-sm text-neutral-100"
                          style={{ borderColor: T.border, background: T.bg }}
                          value={m.roleRaw as RoleRaw}
                          onChange={(e) =>
                            updateMappingRole(m.ynabCategoryID, e.target.value as RoleRaw)
                          }
                        >
                          {ROLE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          )}

        </section>
        )}
    </div>
  );
}
