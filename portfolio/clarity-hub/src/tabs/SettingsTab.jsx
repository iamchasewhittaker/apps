import React, { useState, useEffect } from "react";
import { T } from "../theme";
import { auth } from "../sync";

const S = {
  card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  btnOutline: { width: "100%", padding: 10, borderRadius: 8, background: "transparent", border: `1px solid ${T.border}`, color: T.text, fontSize: 13, cursor: "pointer" },
  row: { fontSize: 13, color: T.muted, marginBottom: 8 },
};

const STORAGE_KEYS = [
  "chase_hub_checkin_v1",
  "chase_hub_triage_v1",
  "chase_hub_time_v1",
  "chase_hub_budget_v1",
  "chase_hub_growth_v1",
];

export default function SettingsTab({ signOut, checkin, triage, time, budget, growth }) {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (auth) auth.getUser().then(({ data }) => setUserEmail(data?.user?.email || ""));
  }, []); // eslint-disable-line

  const lastSynced = (() => {
    const blobs = [checkin, triage, time, budget, growth];
    const timestamps = blobs.map((b) => b?._syncAt || 0).filter((t) => t > 0);
    if (timestamps.length === 0) return null;
    return Math.max(...timestamps);
  })();

  const exportData = () => {
    const payload = { checkin, triage, time, budget, growth, exportedAt: new Date().toISOString() };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clarity-hub-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 16, color: T.text }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Settings</h2>

      {/* Account */}
      <div style={S.card}>
        <div style={S.cardTitle}>Account</div>
        <div style={S.row}>Signed in as: <span style={{ color: T.text }}>{userEmail || "Loading\u2026"}</span></div>
        <button onClick={signOut} style={{ padding: "10px 20px", borderRadius: 8, background: T.red, border: "none", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Sign Out</button>
      </div>

      {/* Standalone Apps */}
      <div style={S.card}>
        <div style={S.cardTitle}>Standalone Apps</div>
        <div style={S.row}>YNAB and RollerTask are now standalone apps:</div>
        <a href="https://ynab-clarity-web.vercel.app" target="_blank" rel="noopener noreferrer" style={{ ...S.btnOutline, display: "block", textAlign: "center", textDecoration: "none", marginBottom: 8 }}>YNAB Clarity {"\u2197"}</a>
        <a href="https://rollertask-tycoon-web.vercel.app" target="_blank" rel="noopener noreferrer" style={{ ...S.btnOutline, display: "block", textAlign: "center", textDecoration: "none" }}>RollerTask Tycoon {"\u2197"}</a>
      </div>

      {/* Data */}
      <div style={S.card}>
        <div style={S.cardTitle}>Data</div>
        <div style={S.row}>
          Last synced: {lastSynced ? new Date(lastSynced).toLocaleString() : "Never"}
        </div>
        <button onClick={exportData} style={S.btnOutline}>Export All Data (JSON)</button>
      </div>

      {/* App Info */}
      <div style={S.card}>
        <div style={S.cardTitle}>App Info</div>
        <div style={S.row}>Version: v0.2</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Storage keys:</div>
        {STORAGE_KEYS.map((key) => (
          <div key={key} style={{ fontSize: 11, color: T.muted, fontFamily: "monospace", padding: "2px 0" }}>{key}</div>
        ))}
      </div>
    </div>
  );
}
