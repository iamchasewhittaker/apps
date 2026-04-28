"use client";

import { useState } from "react";
import { T } from "@/lib/constants";

type Props = {
  hasEncryptedPrivacyToken: boolean;
};

async function postCredentials(payload: { privacy_token: string }) {
  return fetch("/api/credentials", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function PrivacyConnectorCard({ hasEncryptedPrivacyToken }: Props) {
  const [replacing, setReplacing] = useState(false);
  const [savingToken, setSavingToken] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [storedJustNow, setStoredJustNow] = useState(false);

  const stored = (hasEncryptedPrivacyToken || storedJustNow) && !replacing;

  async function handleSubmit(next: string) {
    const trimmed = next.trim();
    if (!trimmed) return;
    setSavingToken(true);
    setTokenError("");
    try {
      const res = await postCredentials({ privacy_token: trimmed });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setTokenError(body.error ?? `Save failed (HTTP ${res.status})`);
        return;
      }
      setReplacing(false);
      setStoredJustNow(true);
    } finally {
      setSavingToken(false);
    }
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
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: T.text }}>
        Privacy.com
      </h2>
      <p style={{ margin: "4px 0 16px", fontSize: 13, color: T.muted }}>
        API token for card + transaction sync. Encrypted before storage.
      </p>

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>
          API token
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
        ) : (
          <PrivacyTokenInput
            saving={savingToken}
            error={tokenError}
            showCancel={replacing}
            onCancel={() => {
              setReplacing(false);
              setTokenError("");
            }}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      <p style={{ margin: "10px 0 0", fontSize: 12, color: T.muted }}>
        After saving, the daily cron will pull your cards and transactions on its next run.
      </p>
    </section>
  );
}

function PrivacyTokenInput({
  saving,
  error,
  showCancel,
  onCancel,
  onSubmit,
}: {
  saving: boolean;
  error: string;
  showCancel: boolean;
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
        placeholder="privacy api token"
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
        {showCancel && (
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
        )}
      </div>
      {error && (
        <div style={{ marginTop: 8, color: T.danger, fontSize: 13 }}>{error}</div>
      )}
    </div>
  );
}
