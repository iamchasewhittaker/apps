import React, { useState } from "react";
import { s, API_KEY_STORAGE } from "../constants";

export default function ApiKeyModal({ current, onSave, onClose }) {
  const [key, setKey] = useState(current || "");
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={{ ...s.modal, maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <span>🔑 Anthropic API Key</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={s.modalBody}>
          <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.6 }}>
            Required for all AI features. Get your key at <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={s.link}>console.anthropic.com</a> → API Keys → Create Key.
          </p>
          <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.6, marginTop: 4 }}>
            Your key is stored locally on this device only and sent directly to Anthropic. It never passes through any server. Do not use this app on shared computers.
          </p>
          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>API Key (starts with sk-ant-)</label>
            <input
              type="password"
              style={s.input}
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              autoComplete="off"
            />
          </div>
          {current && (
            <p style={{ color: "#10b981", fontSize: 12 }}>✓ API key is currently set.</p>
          )}
        </div>
        <div style={s.modalFooter}>
          {current && (
            <button style={s.btnDanger} onClick={() => { localStorage.removeItem(API_KEY_STORAGE); onSave(""); }}>Remove Key</button>
          )}
          <div style={{ flex: 1 }} />
          <button style={s.btnSecondary} onClick={onClose}>Cancel</button>
          <button style={{ ...s.btnPrimary, opacity: !key.trim() ? 0.5 : 1 }} disabled={!key.trim()} onClick={() => onSave(key)}>Save Key</button>
        </div>
      </div>
    </div>
  );
}
