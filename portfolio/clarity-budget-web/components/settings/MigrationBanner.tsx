"use client";

import { useEffect, useState } from "react";
import { YNAB_TOKEN_KEY } from "@/lib/constants";

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
    <div className="mb-5 rounded-lg border border-warning bg-[#3a2f10] p-4 text-white">
      <div className="mb-1 font-semibold">Move your YNAB token to encrypted storage</div>
      <div className="mb-3 text-sm leading-relaxed text-muted">
        Your YNAB token is currently in this browser&apos;s localStorage. Migrate it to encrypted
        Supabase storage so it works across devices and is never exposed in local JS state.
      </div>
      <button
        type="button"
        onClick={handleMigrate}
        disabled={state === "migrating"}
        className={`rounded-md bg-warning px-3.5 py-2 text-sm font-semibold text-[#1a1306] ${
          state === "migrating" ? "cursor-wait" : "cursor-pointer"
        }`}
      >
        {state === "migrating" ? "Migrating…" : "Migrate token"}
      </button>
      {state === "error" && error && (
        <div className="mt-2.5 text-sm text-danger">{error}</div>
      )}
    </div>
  );
}
