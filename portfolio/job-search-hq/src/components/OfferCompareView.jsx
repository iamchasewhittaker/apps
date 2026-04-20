import React from "react";
import { s, getOfferCompareRows, formatCurrency } from "../constants";

const GREEN = "#22c55e";
const GREEN_BG = "#0f2b1a";

function bestValue(rows, key, dir = "max") {
  const values = rows.map(r => r[key]).filter(v => v != null);
  if (values.length === 0) return null;
  return dir === "max" ? Math.max(...values) : Math.min(...values);
}

function cell(value, { best, render, align = "right" }) {
  const isBest = value != null && best != null && value === best;
  return {
    children: render ? render(value) : (value ?? "—"),
    style: {
      padding: "10px 12px",
      fontSize: 13,
      color: value == null ? "#4b5563" : "#e5e7eb",
      textAlign: align,
      background: isBest ? GREEN_BG : "transparent",
      borderLeft: isBest ? `3px solid ${GREEN}` : "3px solid transparent",
      fontWeight: isBest ? 700 : 400,
    },
  };
}

function textCell(value, align = "left") {
  return {
    children: value && String(value).trim() ? value : "—",
    style: {
      padding: "10px 12px",
      fontSize: 13,
      color: value && String(value).trim() ? "#e5e7eb" : "#4b5563",
      textAlign: align,
      verticalAlign: "top",
      whiteSpace: "pre-wrap",
    },
  };
}

function SingleOfferCard({ row, onEdit }) {
  return (
    <div style={{ background: "#0a0d14", border: `1.5px solid ${GREEN}44`, borderRadius: 10, padding: "14px 16px", maxWidth: 420 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f3f4f6" }}>{row.company}</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{row.title}</div>
        </div>
        <button style={s.btnSecondary} onClick={onEdit}>Edit</button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0", borderTop: "1px solid #1f2937", borderBottom: "1px solid #1f2937", marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.8 }}>Total comp</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: row.total != null ? GREEN : "#4b5563" }}>
          {formatCurrency(row.total)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
        <div><span style={{ color: "#6b7280" }}>Base </span><span style={{ color: "#e5e7eb" }}>{formatCurrency(row.base)}</span></div>
        <div><span style={{ color: "#6b7280" }}>Bonus </span><span style={{ color: "#e5e7eb" }}>{formatCurrency(row.bonus)}</span></div>
        <div><span style={{ color: "#6b7280" }}>Sign-on </span><span style={{ color: "#e5e7eb" }}>{formatCurrency(row.signOn)}</span></div>
        <div><span style={{ color: "#6b7280" }}>Equity/yr </span><span style={{ color: "#e5e7eb" }}>{formatCurrency(row.equity)}</span></div>
        <div><span style={{ color: "#6b7280" }}>PTO </span><span style={{ color: "#e5e7eb" }}>{row.pto != null ? `${row.pto}w` : "—"}</span></div>
        <div><span style={{ color: "#6b7280" }}>Start </span><span style={{ color: "#e5e7eb" }}>{row.start || "—"}</span></div>
      </div>
    </div>
  );
}

export default function OfferCompareView({ offerApps, onEdit }) {
  const rows = getOfferCompareRows(offerApps);

  if (rows.length === 0) {
    return (
      <div style={{ color: "#6b7280", fontSize: 13, textAlign: "center", padding: "14px 0" }}>
        No offers yet — flip an application to the <span style={{ color: "#22c55e" }}>Offer</span> stage and click 💰 Offer on the card.
      </div>
    );
  }

  if (rows.length === 1) {
    return <SingleOfferCard row={rows[0]} onEdit={() => onEdit(rows[0].appId)} />;
  }

  const bests = {
    base:   bestValue(rows, "base",   "max"),
    bonus:  bestValue(rows, "bonus",  "max"),
    signOn: bestValue(rows, "signOn", "max"),
    equity: bestValue(rows, "equity", "max"),
    pto:    bestValue(rows, "pto",    "max"),
    total:  bestValue(rows, "total",  "max"),
  };

  const TH_LABEL = {
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    textAlign: "left",
    background: "#0a0d14",
    borderBottom: "1.5px solid #1f2937",
  };

  const TH_COL = {
    ...TH_LABEL,
    color: "#f3f4f6",
    textTransform: "none",
    letterSpacing: 0,
    fontSize: 13,
    textAlign: "right",
  };

  return (
    <div style={{ overflowX: "auto", border: "1.5px solid #1f2937", borderRadius: 10 }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 520 }}>
        <thead>
          <tr>
            <th style={TH_LABEL}>Field</th>
            {rows.map(row => (
              <th key={row.appId} style={TH_COL}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                  <span>{row.company}</span>
                  <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 400 }}>{row.title}</span>
                  <button style={{ ...s.btnSecondary, fontSize: 11, padding: "4px 8px", marginTop: 4 }} onClick={() => onEdit(row.appId)}>Edit</button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#9ca3af", fontSize: 13 }}>Base salary</td>
            {rows.map(row => {
              const c = cell(row.base, { best: bests.base, render: formatCurrency });
              return <td key={row.appId} style={c.style}>{c.children}</td>;
            })}
          </tr>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#9ca3af", fontSize: 13 }}>Bonus target</td>
            {rows.map(row => {
              const c = cell(row.bonus, { best: bests.bonus, render: formatCurrency });
              return <td key={row.appId} style={c.style}>{c.children}</td>;
            })}
          </tr>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#9ca3af", fontSize: 13 }}>Sign-on bonus</td>
            {rows.map(row => {
              const c = cell(row.signOn, { best: bests.signOn, render: formatCurrency });
              return <td key={row.appId} style={c.style}>{c.children}</td>;
            })}
          </tr>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#9ca3af", fontSize: 13 }}>Equity (annualized)</td>
            {rows.map(row => {
              const c = cell(row.equity, { best: bests.equity, render: formatCurrency });
              return <td key={row.appId} style={c.style}>{c.children}</td>;
            })}
          </tr>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#9ca3af", fontSize: 13 }}>PTO (weeks)</td>
            {rows.map(row => {
              const c = cell(row.pto, { best: bests.pto, render: v => `${v}w` });
              return <td key={row.appId} style={c.style}>{c.children}</td>;
            })}
          </tr>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#9ca3af", fontSize: 13 }}>Start date</td>
            {rows.map(row => {
              const t = textCell(row.start, "right");
              return <td key={row.appId} style={t.style}>{t.children}</td>;
            })}
          </tr>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#9ca3af", fontSize: 13 }}>Decide by</td>
            {rows.map(row => {
              const t = textCell(row.decisionBy, "right");
              return <td key={row.appId} style={t.style}>{t.children}</td>;
            })}
          </tr>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#9ca3af", fontSize: 13 }}>Location</td>
            {rows.map(row => {
              const t = textCell(row.location, "right");
              return <td key={row.appId} style={t.style}>{t.children}</td>;
            })}
          </tr>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#9ca3af", fontSize: 13 }}>Remote / flex</td>
            {rows.map(row => {
              const t = textCell(row.remoteFlex, "right");
              return <td key={row.appId} style={t.style}>{t.children}</td>;
            })}
          </tr>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#9ca3af", fontSize: 13 }}>Benefits</td>
            {rows.map(row => {
              const t = textCell(row.benefits, "right");
              return <td key={row.appId} style={t.style}>{t.children}</td>;
            })}
          </tr>
          <tr>
            <td style={{ ...TH_LABEL, background: "transparent", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: GREEN, fontSize: 13, borderTop: `2px solid ${GREEN}44` }}>Total comp</td>
            {rows.map(row => {
              const isBest = row.total != null && bests.total != null && row.total === bests.total;
              return (
                <td key={row.appId} style={{
                  padding: "14px 12px",
                  fontSize: 16,
                  fontWeight: 800,
                  color: row.total == null ? "#4b5563" : GREEN,
                  textAlign: "right",
                  background: isBest ? GREEN_BG : "transparent",
                  borderLeft: isBest ? `3px solid ${GREEN}` : "3px solid transparent",
                  borderTop: `2px solid ${GREEN}44`,
                }}>
                  {formatCurrency(row.total)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
