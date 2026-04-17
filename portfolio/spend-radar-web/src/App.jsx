import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, AlertTriangle, TrendingDown } from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";
import {
  CSV_URLS, C, CATEGORY_TINT, s,
  parseCSV, parseDollar, formatDollar, monthlyEquivalent,
  loadCache, saveCache, relativeTime,
} from "./constants";

function Brand() {
  return (
    <div style={s.brand}>
      <svg viewBox="0 0 64 64" style={s.brandMark}>
        <circle cx="32" cy="32" r="20" fill="none" stroke={C.accent} strokeWidth="2" opacity="0.4" />
        <circle cx="32" cy="32" r="13" fill="none" stroke={C.accent} strokeWidth="2" opacity="0.6" />
        <circle cx="32" cy="32" r="6"  fill="none" stroke={C.accent} strokeWidth="2" opacity="0.8" />
        <line x1="32" y1="32" x2="48" y2="20" stroke={C.accent2} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="32" r="2" fill={C.accent2} />
      </svg>
      <div style={s.brandName}>Spend Radar</div>
    </div>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div style={s.metric}>
      <div style={s.metricLabel}>{label}</div>
      <div style={{ ...s.metricValue, color: accent || C.text }}>{value}</div>
    </div>
  );
}

function SubscriptionCard({ sub }) {
  const statusColor =
    sub.Status === "Active" ? C.active
    : sub.Status === "Lapsed?" ? C.lapsed
    : C.muted;
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <div style={s.merchant}>{sub.Service || sub["Sender Domain"]}</div>
        <span style={s.chip(statusColor)}>{sub.Status || "—"}</span>
      </div>
      <div style={s.item}>{sub["Sender Domain"]}</div>
      <div style={s.cardRow}>
        <span style={s.amount}>{sub["Last Amount"] || "—"}</span>
        <span style={{ color: C.muted, fontSize: 12 }}>{sub.Cadence}</span>
      </div>
      <div style={{ ...s.cardRow, color: C.muted, fontSize: 11 }}>
        <span>Last {formatDate(sub["Last Charge"])}</span>
        <span>Next {formatDate(sub["Est. Next Charge"])}</span>
      </div>
    </div>
  );
}

function formatDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function App() {
  const [subs, setSubs] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [syncAt, setSyncAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // initial — hydrate from cache
  useEffect(() => {
    const cached = loadCache();
    if (cached) {
      setSubs(cached.subs || []);
      setReceipts(cached.receipts || []);
      setSyncAt(cached._syncAt || null);
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAll() {
    if (!CSV_URLS.subscriptions && !CSV_URLS.receipts) {
      setError("Paste CSV_URLS into src/constants.js after publishing Sheet tabs to web.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [subCsv, recCsv] = await Promise.all([
        CSV_URLS.subscriptions ? fetch(CSV_URLS.subscriptions).then((r) => r.text()) : Promise.resolve(""),
        CSV_URLS.receipts       ? fetch(CSV_URLS.receipts).then((r) => r.text())       : Promise.resolve(""),
      ]);
      const parsedSubs = subCsv ? parseCSV(subCsv) : [];
      const parsedReceipts = recCsv ? parseCSV(recCsv) : [];
      // Filter trailing summary rows that snuck in
      const cleanSubs = parsedSubs.filter(
        (r) => r.Service && r.Service !== "Monthly est." && r.Service !== "Yearly est."
      );
      setSubs(cleanSubs);
      setReceipts(parsedReceipts);
      const now = Date.now();
      setSyncAt(now);
      saveCache({ subs: cleanSubs, receipts: parsedReceipts });
    } catch (e) {
      setError("Fetch failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  const metrics = useMemo(() => {
    const active = subs.filter((r) => r.Status === "Active");
    const lapsed = subs.filter((r) => r.Status && r.Status !== "Active");
    let monthly = 0;
    for (const r of active) monthly += monthlyEquivalent(r.Cadence, r["Last Amount"]);
    return {
      monthly,
      yearly: monthly * 12,
      activeCount: active.length,
      lapsedCount: lapsed.length,
    };
  }, [subs]);

  const byCategory = useMemo(() => {
    const g = {};
    for (const r of subs) {
      if (r.Status !== "Active") continue;
      const cat = r.Category || "Other";
      if (!g[cat]) g[cat] = [];
      g[cat].push(r);
    }
    // Sort subs inside each category by monthly-equivalent desc
    Object.keys(g).forEach((k) => {
      g[k].sort((a, b) =>
        monthlyEquivalent(b.Cadence, b["Last Amount"]) -
        monthlyEquivalent(a.Cadence, a["Last Amount"])
      );
    });
    // Sort categories by total monthly spend desc
    return Object.keys(g)
      .map((k) => ({
        name: k,
        subs: g[k],
        total: g[k].reduce((sum, r) => sum + monthlyEquivalent(r.Cadence, r["Last Amount"]), 0),
      }))
      .sort((a, b) => b.total - a.total);
  }, [subs]);

  const recentReceipts = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return receipts
      .filter((r) => {
        const d = new Date(r.Date);
        return !isNaN(d.getTime()) && d.getTime() >= cutoff;
      })
      .slice(0, 50);
  }, [receipts]);

  const cancelCandidates = useMemo(() => {
    return subs.filter((r) =>
      r.Status === "Lapsed?" || (r.Cadence || "").startsWith("Irregular")
    );
  }, [subs]);

  return (
    <ErrorBoundary name="Spend Radar">
      <div style={s.page}>
        <div style={s.container}>
          {/* Header */}
          <div style={s.headerBar}>
            <Brand />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: C.muted, fontSize: 12 }}>
                Synced {relativeTime(syncAt)}
              </span>
              <button
                onClick={fetchAll}
                disabled={loading}
                style={s.button}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <RefreshCw size={14} style={loading ? { animation: "spr-spin 1s linear infinite" } : {}} />
                  {loading ? "Refreshing…" : "Refresh"}
                </span>
              </button>
            </div>
          </div>
          <style>{`@keyframes spr-spin { to { transform: rotate(360deg); } }`}</style>

          {error && (
            <div style={{ ...s.empty, color: C.cancel, borderColor: C.cancel + "66", marginBottom: 20 }}>
              <AlertTriangle size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
              {error}
            </div>
          )}

          {/* Metrics */}
          <div style={s.metricRow}>
            <Metric label="Monthly est." value={formatDollar(metrics.monthly)} accent={C.accent} />
            <Metric label="Yearly est."  value={formatDollar(metrics.yearly)}  accent={C.accent2} />
            <Metric label="Active"       value={metrics.activeCount} accent={C.active} />
            <Metric label="Lapsed"       value={metrics.lapsedCount} accent={C.lapsed} />
          </div>

          {/* Subscriptions by category */}
          <div style={s.sectionTitle}>Subscriptions</div>
          {byCategory.length === 0 ? (
            <div style={s.empty}>
              No active subscriptions yet. Run <code>Refresh All</code> in the Sheet.
            </div>
          ) : byCategory.map((group) => {
            const tint = CATEGORY_TINT[group.name] || CATEGORY_TINT.Other;
            return (
              <div key={group.name}>
                <div style={s.categoryBand}>
                  <div style={s.categoryLabel}>
                    <span style={{ ...s.categoryDot, background: tint }} />
                    {group.name}
                    <span style={{ color: C.muted, fontSize: 12, marginLeft: 4 }}>
                      {group.subs.length}
                    </span>
                  </div>
                  <span style={{ color: C.muted, fontSize: 12 }}>
                    {formatDollar(group.total)} / mo
                  </span>
                </div>
                <div style={s.cardGrid}>
                  {group.subs.map((sub, i) => (
                    <SubscriptionCard key={`${sub["Sender Email"] || i}-${i}`} sub={sub} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Cancel candidates */}
          {cancelCandidates.length > 0 && (
            <>
              <div style={s.sectionTitle}>
                <TrendingDown size={14} style={{ verticalAlign: "middle", marginRight: 6, color: C.cancel }} />
                Cancel candidates
              </div>
              <div style={s.cardGrid}>
                {cancelCandidates.map((sub, i) => (
                  <div key={`cc-${i}`} style={{ ...s.card, borderColor: C.cancel + "55" }}>
                    <div style={s.cardHeader}>
                      <div style={s.merchant}>{sub.Service || sub["Sender Domain"]}</div>
                      <span style={s.chip(C.cancel)}>{sub.Status || "Irregular"}</span>
                    </div>
                    <div style={s.item}>{sub.Cadence}</div>
                    <div style={s.cardRow}>
                      <span style={s.amount}>{sub["Last Amount"] || "—"}</span>
                      <span style={{ color: C.muted, fontSize: 12 }}>
                        Last {formatDate(sub["Last Charge"])}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recent receipts */}
          <div style={s.sectionTitle}>Recent receipts (30d)</div>
          {recentReceipts.length === 0 ? (
            <div style={s.empty}>No receipts in the last 30 days.</div>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Date</th>
                  <th style={s.th}>Merchant</th>
                  <th style={s.th}>Item</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Amount</th>
                  <th style={s.th}>Category</th>
                </tr>
              </thead>
              <tbody>
                {recentReceipts.map((r, i) => (
                  <tr key={`r-${i}`}>
                    <td style={s.td}>{formatDate(r.Date)}</td>
                    <td style={s.td}>{r.Merchant || "—"}</td>
                    <td style={{ ...s.td, color: C.muted }}>{r.Item || ""}</td>
                    <td style={{ ...s.td, textAlign: "right", fontWeight: 600 }}>
                      {r.Amount || formatDollar(parseDollar(r.Amount))}
                    </td>
                    <td style={s.td}>
                      <span
                        style={s.chip(CATEGORY_TINT[r.Category] || CATEGORY_TINT.Other)}
                      >
                        {r.Category || "Other"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={s.footer}>
            Read-only view of the Spend Radar Google Sheet.
            Refresh fetches the latest published CSV.
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
