import React, { useState } from "react";
import { T, loadYnabToken, saveYnabToken } from "../theme";

export default function SettingsTab({ signOut, ynab, setYnab }) {
  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const currentToken = loadYnabToken();

  const updateToken = () => {
    if (tokenInput.trim()) {
      saveYnabToken(tokenInput.trim());
      setTokenInput("");
      setShowToken(false);
    }
  };

  const resetSetup = () => {
    if (setYnab) setYnab(prev => ({ ...prev, preferences: { ...prev.preferences, setupComplete: false } }));
  };

  return (
    <div style={{ padding: 16, color: T.text }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Settings</h2>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>YNAB</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 8 }}>
          Token: {currentToken ? `${currentToken.slice(0, 8)}\u2026` : "Not set"}
        </div>
        {!showToken ? (
          <button onClick={() => setShowToken(true)} style={{
            width: "100%", padding: 10, borderRadius: 8, background: "transparent",
            border: `1px solid ${T.border}`, color: T.text, fontSize: 13, cursor: "pointer", marginBottom: 8,
          }}>Update Token</button>
        ) : (
          <div style={{ marginBottom: 8 }}>
            <input style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: T.surfaceHigh, border: `1px solid ${T.border}`, color: T.text, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "monospace", marginBottom: 6 }}
              value={tokenInput} onChange={e => setTokenInput(e.target.value)} placeholder="Paste new token" />
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={updateToken} disabled={!tokenInput.trim()} style={{
                flex: 1, padding: 8, borderRadius: 8, background: T.accent, border: "none",
                color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", opacity: tokenInput.trim() ? 1 : 0.5,
              }}>Save</button>
              <button onClick={() => { setShowToken(false); setTokenInput(""); }} style={{
                flex: 1, padding: 8, borderRadius: 8, background: "transparent",
                border: `1px solid ${T.border}`, color: T.muted, fontSize: 13, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </div>
        )}
        <button onClick={resetSetup} style={{
          width: "100%", padding: 10, borderRadius: 8, background: "transparent",
          border: `1px solid ${T.accent}`, color: T.accent, fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>Re-run YNAB Setup</button>
      </div>

      <button onClick={signOut} style={{
        padding: "10px 20px", borderRadius: 8, background: T.red, border: "none",
        color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
      }}>Sign Out</button>
    </div>
  );
}
