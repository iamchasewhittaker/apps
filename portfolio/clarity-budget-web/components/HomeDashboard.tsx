"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultBlob,
  mergeBlob,
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
import { createSupabaseBrowserClient, pullBlob, pushBlob } from "@/lib/sync";
import { suggestRole, type RoleRaw } from "@/lib/suggestRole";
import { groupMappingsForDisplay, mergeCategoryMappingsFromGroups } from "@/lib/ynabCategoryMerge";
import {
  fetchBudgets,
  fetchCategories,
  fetchMonth,
  fetchTransactions,
  type YNABTransaction,
} from "@/lib/ynab";

const ROLE_OPTIONS: { value: RoleRaw; label: string }[] = [
  { value: "mortgage", label: "Mortgage / Housing" },
  { value: "bill", label: "Fixed Bill" },
  { value: "essential", label: "Essential Variable" },
  { value: "flexible", label: "Flexible Spending" },
  { value: "ignore", label: "Ignore" },
];

const TX_CACHE_MS = 15 * 60 * 1000;

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

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

function loadLocalBlob(): BudgetBlob {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultBlob();
    return mergeBlob(JSON.parse(raw));
  } catch {
    return defaultBlob();
  }
}

function saveLocalBlob(b: BudgetBlob) {
  const next = { ...b, _syncAt: Date.now() };
  localStorage.setItem(STORE_KEY, JSON.stringify(next));
  return next;
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMsg, setAuthMsg] = useState<string | null>(null);
  const [userLabel, setUserLabel] = useState<string | null>(null);

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
    const sb = createSupabaseBrowserClient();
    if (!sb) return;
    void sb.auth.getSession().then(({ data: { session } }) => {
      setUserLabel(session?.user?.email ?? null);
    });
  }, []);

  const syncFromCloud = useCallback(async (b: BudgetBlob) => {
    const sb = createSupabaseBrowserClient();
    if (!sb) return b;
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
    const sb = createSupabaseBrowserClient();
    if (!sb) return;
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

  const persistToken = (t: string) => {
    setYnabToken(t);
    if (t) localStorage.setItem(YNAB_TOKEN_KEY, t);
    else localStorage.removeItem(YNAB_TOKEN_KEY);
  };

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

  // ── Spending analytics (all computed from raw transactions) ──────────────

  const spendByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of transactions) {
      if (t.deleted) continue;
      if (t.subtransactions?.length) {
        for (const sub of t.subtransactions) {
          if (sub.amount >= 0 || sub.deleted) continue;
          const key = sub.category_name || t.category_name || "Uncategorized";
          map[key] = (map[key] ?? 0) + Math.abs(sub.amount) / 1000;
        }
      } else {
        if (t.amount >= 0) continue;
        const key = t.category_name || "Uncategorized";
        map[key] = (map[key] ?? 0) + Math.abs(t.amount) / 1000;
      }
    }
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
  }, [transactions]);

  const totalSpent = useMemo(() => {
    return transactions.reduce((sum, t) => {
      if (t.deleted) return sum;
      if (t.subtransactions?.length) {
        return (
          sum +
          t.subtransactions
            .filter((s) => s.amount < 0 && !s.deleted)
            .reduce((ss, s) => ss + Math.abs(s.amount) / 1000, 0)
        );
      }
      return t.amount < 0 ? sum + Math.abs(t.amount) / 1000 : sum;
    }, 0);
  }, [transactions]);

  const txDateRange = useMemo(() => {
    if (!transactions.length) return "";
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    const from = new Date(sorted[0].date + "T12:00:00");
    const to = new Date(sorted[sorted.length - 1].date + "T12:00:00");
    const fmtD = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmtD(from)} – ${fmtD(to)}`;
  }, [transactions]);

  const outflowCount = useMemo(
    () => transactions.filter((t) => t.amount < 0 && !t.deleted).length,
    [transactions]
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
  const hasSpending = spendByCategory.length > 0;
  const maxCategorySpend = spendByCategory[0]?.amount ?? 1;

  const signIn = async () => {
    setAuthMsg(null);
    const sb = createSupabaseBrowserClient();
    if (!sb) {
      setAuthMsg("Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setAuthMsg(error.message);
      return;
    }
    setUserLabel(email.trim());
    const b = await syncFromCloud(loadLocalBlob());
    setBlob(b);
  };

  const signOut = async () => {
    const sb = createSupabaseBrowserClient();
    await sb?.auth.signOut();
    setUserLabel(null);
  };

  return (
    <div className="min-h-screen px-5 py-10" style={{ background: T.bg, color: T.text }}>
      <div className="mx-auto max-w-lg space-y-7">
        <header className="space-y-1.5">
          <p
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: T.muted }}
          >
            Clarity Budget
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Safe to spend</h1>
          <p className="text-sm leading-relaxed" style={{ color: T.muted }}>
            From your YNAB categories and Ready to Assign, after bills and essentials — same
            math as the iOS app.
          </p>
        </header>

        {/* STS skeleton */}
        {loading && (
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: T.border, background: T.surface }}
            aria-busy="true"
            aria-label="Loading YNAB"
          >
            <div className="h-4 w-40 animate-pulse rounded" style={{ background: T.border }} />
            <div
              className="mt-4 h-12 w-3/4 max-w-[220px] animate-pulse rounded-lg"
              style={{ background: T.border }}
            />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="h-24 animate-pulse rounded-xl" style={{ background: T.border }} />
              <div className="h-24 animate-pulse rounded-xl" style={{ background: T.border }} />
            </div>
          </div>
        )}

        {/* STS cards */}
        {hasMetrics && !loading && (
          <div className="space-y-3">
            <section
              className="rounded-[20px] border p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
              style={{
                borderColor: T.border,
                background: `linear-gradient(145deg, ${T.surface} 0%, #121826 100%)`,
              }}
            >
              <p
                className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: T.muted }}
              >
                This month
              </p>
              <p className="mt-0.5 text-sm" style={{ color: T.muted }}>
                Full pool
              </p>
              <p
                className="mt-2 text-[2.5rem] font-bold leading-none tabular-nums tracking-tight"
                style={{ color: T.safe, fontFeatureSettings: '"tnum" 1' }}
              >
                {fmt(safeM)}
              </p>
            </section>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl border p-4"
                style={{ borderColor: T.border, background: T.surface }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: T.muted }}
                >
                  This week
                </p>
                <p className="mt-1 text-lg font-bold tabular-nums">
                  {safeW != null ? fmt(safeW) : "—"}
                </p>
                <p className="mt-1 text-[11px] leading-snug" style={{ color: T.muted }}>
                  ~7 days at today&apos;s pace
                </p>
              </div>
              <div
                className="rounded-2xl border p-4"
                style={{ borderColor: T.border, background: T.surface }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: T.muted }}
                >
                  Today
                </p>
                <p className="mt-1 text-lg font-bold tabular-nums">
                  {safeD != null ? fmt(safeD) : "—"}
                </p>
                <p className="mt-1 text-[11px] leading-snug" style={{ color: T.muted }}>
                  Per day left in month
                </p>
              </div>
            </div>

            {shortfall != null && shortfall > 0.01 && (
              <div
                className="flex gap-3 rounded-[14px] border p-3.5"
                style={{ borderColor: "rgba(232, 187, 50, 0.35)", background: T.surface }}
              >
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ color: T.caution }}
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.517 11.59c.75 1.334-.213 2.98-1.742 2.98H3.482c-1.53 0-2.493-1.646-1.743-2.98l6.518-11.59zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold">Obligations gap</p>
                  <p className="mt-0.5 text-xs leading-relaxed" style={{ color: T.muted }}>
                    About {fmt(shortfall)} still needed for mortgage, bills, and essentials this
                    month. Fund those in YNAB first.
                  </p>
                </div>
              </div>
            )}

            {updated && (
              <p className="text-xs" style={{ color: T.muted }}>
                Updated {updated.toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* ── Where your money went ── */}
        {hasSpending && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: T.muted }}
              >
                Where your money went
              </p>
              <span className="text-xs" style={{ color: T.muted }}>
                {txDateRange}
              </span>
            </div>

            <div
              className="rounded-[20px] border p-5"
              style={{ borderColor: T.border, background: T.surface }}
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wide"
                    style={{ color: T.muted }}
                  >
                    Total spent
                  </p>
                  <p
                    className="mt-1 text-[2rem] font-bold leading-none tabular-nums"
                    style={{ color: T.text }}
                  >
                    {fmt(totalSpent)}
                  </p>
                </div>
                <span className="text-xs" style={{ color: T.muted }}>
                  {outflowCount} transactions
                </span>
              </div>

              <div className="mt-5 space-y-3.5">
                {spendByCategory.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className="truncate pr-3 text-xs"
                        style={{ color: T.text, maxWidth: "72%" }}
                        title={cat.name}
                      >
                        {cat.name}
                      </span>
                      <span
                        className="shrink-0 tabular-nums text-xs"
                        style={{ color: T.muted }}
                      >
                        {fmt(cat.amount)}
                      </span>
                    </div>
                    <div
                      className="h-1.5 overflow-hidden rounded-full"
                      style={{ background: T.border }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(cat.amount / maxCategorySpend) * 100}%`,
                          background: T.accent,
                          opacity: Math.max(0.35, 1 - i * 0.09),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
          </section>
        )}

        {showEmpty && !loading && (
          <div
            className="rounded-[18px] border p-5"
            style={{ borderColor: T.border, background: T.surface }}
          >
            <p className="font-medium">Connect YNAB to see live safe-to-spend.</p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: T.muted }}>
              Add a personal access token and pick a budget below. Map category roles in the
              YNAB section (or sync from Supabase after signing in).
            </p>
          </div>
        )}

        {err && (
          <p
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: T.danger, color: T.danger }}
          >
            {err}
          </p>
        )}

        {/* YNAB config */}
        <section
          className="space-y-3 rounded-xl border p-4"
          style={{ borderColor: T.border, background: T.surface }}
        >
          <h2 className="text-sm font-semibold">YNAB</h2>
          <label className="block text-xs" style={{ color: T.muted }}>
            Personal access token
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm text-neutral-100"
              style={{ borderColor: T.border, background: T.bg }}
              type="password"
              autoComplete="off"
              value={ynabToken}
              onChange={(e) => persistToken(e.target.value)}
            />
          </label>
          <BudgetPicker
            token={ynabToken}
            budgetId={blob.ynabBudgetId ?? ""}
            onSelect={(id) =>
              persistBlob({
                ...blob,
                ynabBudgetId: id || null,
                ynabCategoryMappings: id ? blob.ynabCategoryMappings : [],
                ynabAutoSuggestGroupIds: id ? (blob.ynabAutoSuggestGroupIds ?? []) : [],
              })
            }
          />

          {ynabReady && categorySyncErr && (
            <p className="text-xs" style={{ color: T.danger }}>
              {categorySyncErr}
            </p>
          )}
          {ynabReady && !categorySyncErr && blob.ynabCategoryMappings.length === 0 && (
            <p className="text-xs" style={{ color: T.muted }}>
              Loading categories…
            </p>
          )}

          {ynabReady && blob.ynabCategoryMappings.length > 0 && (
            <div className="space-y-3 border-t pt-3" style={{ borderColor: T.border }}>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: T.muted }}
              >
                Category roles
              </p>
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

          <button
            type="button"
            className="w-full rounded-lg py-2 text-sm font-medium"
            style={{ background: T.accent, color: "#fff" }}
            onClick={() => void refreshMetrics(true)}
          >
            Refresh numbers
          </button>
        </section>

        {/* Supabase sync */}
        <section
          className="space-y-2 rounded-xl border p-4"
          style={{ borderColor: T.border, background: T.surface }}
        >
          <h2 className="text-sm font-semibold">Supabase sync</h2>
          <p className="text-xs" style={{ color: T.muted }}>
            Sign in to merge your blob with{" "}
            <code className="text-neutral-300">user_data</code> (
            <code className="text-neutral-300">clarity_budget</code>). YNAB token and
            transactions stay in this browser only.
          </p>
          {userLabel ? (
            <div className="flex items-center justify-between gap-2 text-sm">
              <span>{userLabel}</span>
              <button
                type="button"
                className="text-xs underline"
                style={{ color: T.muted }}
                onClick={() => void signOut()}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm text-neutral-100"
                style={{ borderColor: T.border, background: T.bg }}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full rounded-lg border px-3 py-2 text-sm text-neutral-100"
                style={{ borderColor: T.border, background: T.bg }}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="w-full rounded-lg py-2 text-sm"
                style={{ background: T.border, color: T.text }}
                onClick={() => void signIn()}
              >
                Sign in
              </button>
              {authMsg && <p className="text-xs text-red-400">{authMsg}</p>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function BudgetPicker({
  token,
  budgetId,
  onSelect,
}: {
  token: string;
  budgetId: string;
  onSelect: (id: string) => void;
}) {
  const [budgets, setBudgets] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (!token.trim()) {
      setBudgets([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const b = await fetchBudgets(token.trim());
        if (!cancelled) setBudgets(b);
      } catch {
        if (!cancelled) setBudgets([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <label className="block text-xs" style={{ color: T.muted }}>
      Budget
      <select
        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm text-neutral-100"
        style={{ borderColor: T.border, background: T.bg }}
        value={budgetId}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">— Select —</option>
        {budgets.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
    </label>
  );
}
