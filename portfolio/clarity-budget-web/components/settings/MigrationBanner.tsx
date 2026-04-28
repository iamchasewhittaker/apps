"use client";

import { useEffect, useState } from "react";
import { YNAB_TOKEN_KEY, T } from "@/lib/constants";

type State = "hidden" | "idle" | "migrating" | "error";

type Props = {
  hasEncryptedYnabToken: boolean;
};

export function MigrationBanner({ hasEncryptedYnabToken }: Props) {
  const [state, setState] = useState<State>("hidden");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasEncryptedYnabToken) {
      setState("hidden");
      return;
    }
    const token = window.localStorage.getItem(YNAB_TOKEN_KEY);
    setState(token ? "idle" : "hidden");
  }, [hasEncryptedYnabToken]);

  async function handleMigrate() {
    if (typeof window === "undefined") return;
    const token = window.localStorage.getItem(YNAB_TOKEN_KEY);
    if (!token) {
      setState("hidden");
      return;
    }
    setState("migrating");
    setError("");
    try {
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ynab_token: token }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? `Migration failed (HTTP ${res.status})`);
        setState("error");
        return;
      }
      setState("hidden");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setState("error");
    }
  }

  if (state === "hidden") return null;

  return (
    <div
      style={{
        background: "#3a2f10",
        border: `1px solid ${T.caution}`,
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        color: T.text,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Move your YNAB token to encrypted storage</div>
      <div style={{ color: T.muted, fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
        Your YNAB token is currently in this browser&apos;s localStorage. Migrate it to encrypted
        Supabase storage so it works across devices and is never exposed in local JS state.
      </div>
      <button
        type="button"
        onClick={handleMigrate}
        disabled={state === "migrating"}
        style={{
          padding: "8px 14px",
          borderRadius: 6,
          border: "none",
          background: T.caution,
          color: "#1a1306",
          fontWeight: 600,
          fontSize: 13,
          cursor: state === "migrating" ? "wait" : "pointer",
        }}
      >
        {state === "migrating" ? "Migrating…" : "Migrate token"}
      </button>
      {state === "error" && error && (
        <div style={{ marginTop: 10, color: T.danger, fontSize: 13 }}>{error}</div>
      )}
    </div>
  );
}
