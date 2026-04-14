import React, { useState, useEffect } from "react";
import { T, loadYnabToken, saveYnabToken } from "../theme";
import { auth } from "../sync";

const S = {
  card: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  btn: { padding: "10px 16px", borderRadius: 8, background: T.accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  btnOutline: { width: "100%", padding: 10, borderRadius: 8, background: "transparent", border: `1px solid ${T.border}`, color: T.text, fontSize: 13, cursor: "pointer" },
  input: { width: "100%", padding: "8px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "monospace" },
  row: { fontSize: 13, color: T.muted, marginBottom: 8 },
};

const STORAGE_KEYS = [
  "chase_hub_ynab_v1",
  "chase_hub_checkin_v1",
  "chase_hub_triage_v1",
  "chase_hub_time_v1",
  "chase_hub_budget_v1",
  "chase_hub_growth_v1",
  "chase_hub_rollertask_v1",
];

export default function SettingsTab({ signOut, ynab, setYnab, checkin, triage, time, budget, growth, rollertask }) {
  const [userEmail, setUserEmail] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const currentToken = loadYnabToken();

  useEffect(() => {
    if (auth) auth.getUser().then(({ data }) => setUserEmail(data?.user?.email || ""));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateToken = () => {
    if (tokenInput.trim()) {
      saveYnabToken(tokenInput.trim());
      setTokenInput("");
      setShowToken(false);
    }
  };

  const resetSetup = () => {
    if (setYnab) setYnab((prev) => ({ ...prev, preferences: { ...prev.preferences, setupComplete: false } }));
  };

  const lastSynced = (() => {
    const blobs = [ynab, checkin, triage, time, budget, growth, rollertask];
    const timestamps = blobs.map((b) => b?._syncAt || 0).filter((t) => t > 0);
    if (timestamps.length === 0) return null;
    return Math.max(...timestamps);
  })();

  const exportData = () => {
    const payload = { ynab, checkin, triage, time, budget, growth, rollertask, exportedAt: new Date().toISOString() };
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

      {/* YNAB */}
      <div style={S.card}>
        <div style={S.cardTitle}>YNAB</div>
        <div style={S.row}>Token: {currentToken ? `${currentToken.slice(0, 8)}\u2026` : "Not set"}</div>
        {!showToken ? (
          <button onClick={() => setShowToken(true)} style={{ ...S.btnOutline, marginBottom: 8 }}>Update Token</button>
        ) : (
          <div style={{ marginBottom: 8 }}>
            <input style={{ ...S.input, marginBottom: 6 }} value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="Paste new token" />
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={updateToken} disabled={!tokenInput.trim()} style={{ ...S.btn, flex: 1, opacity: tokenInput.trim() ? 1 : 0.5 }}>Save</button>
              <button onClick={() => { setShowToken(false); setTokenInput(""); }} style={{ ...S.btnOutline, flex: 1, width: "auto" }}>Cancel</button>
            </div>
          </div>
        )}
        <button onClick={resetSetup} style={{ width: "100%", padding: 10, borderRadius: 8, background: "transparent", border: `1px solid ${T.accent}`, color: T.accent, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Re-run YNAB Setup</button>
      </div>

      {/* Data */}
      <div style={S.card}>
        <div style={S.cardTitle}>Data</div>
        <div style={S.row}>
          Last synced: {lastSynced ? new Date(lastSynced).toLocaleString() : "Never"}
        </div>
        <button onClick={exportData} style={{ ...S.btnOutline }}>Export All Data (JSON)</button>
      </div>

      {/* App Info */}
      <div style={S.card}>
        <div style={S.cardTitle}>App Info</div>
        <div style={S.row}>Version: v0.1</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>Storage keys:</div>
        {STORAGE_KEYS.map((key) => (
          <div key={key} style={{ fontSize: 11, color: T.muted, fontFamily: "monospace", padding: "2px 0" }}>{key}</div>
        ))}
      </div>
    </div>
  );
}
