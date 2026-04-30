"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const router = useRouter();
  const [replacing, setReplacing] = useState(false);
  const [savingToken, setSavingToken] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [storedJustNow, setStoredJustNow] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

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

  async function handleSyncNow() {
    setSyncing(true);
    setSyncResult(null);
    setSyncError(null);
    try {
      const res = await fetch("/api/privacy/sync", { method: "POST" });
      const body = (await res.json().catch(() => ({}))) as { cards?: number; transactions?: number; error?: string };
      if (!res.ok) {
        setSyncError(body.error ?? `Sync failed (HTTP ${res.status})`);
        return;
      }
      setSyncResult(`Synced ${body.cards ?? 0} cards, ${body.transactions ?? 0} transactions`);
      router.refresh();
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <section className="mb-5 rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5">
      <h2 className="text-base font-semibold text-white">Privacy.com</h2>
      <p className="mt-1 mb-4 text-sm text-muted">
        API token for card + transaction sync. Encrypted before storage.
      </p>

      <div className="mb-2">
        <div className="mb-1.5 text-xs text-muted">API token</div>
        {stored ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-dimmer bg-bg px-3 py-2.5">
            <span className="text-sm text-white">Token stored in Supabase ✓</span>
            <button
              type="button"
              onClick={() => { setReplacing(true); setTokenError(""); }}
              className="rounded-md border border-dimmer bg-transparent px-3 py-1.5 text-sm text-white cursor-pointer"
            >
              Replace
            </button>
          </div>
        ) : (
          <PrivacyTokenInput
            saving={savingToken}
            error={tokenError}
            showCancel={replacing}
            onCancel={() => { setReplacing(false); setTokenError(""); }}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {stored && (
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => void handleSyncNow()}
            disabled={syncing}
            className={`rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-bg ${syncing ? "opacity-60 cursor-wait" : "cursor-pointer"}`}
          >
            {syncing ? "Syncing…" : "Sync now"}
          </button>
          {syncResult && <span className="text-xs text-accent">{syncResult}</span>}
          {syncError && <span className="text-xs text-danger">{syncError}</span>}
        </div>
      )}
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
        className="block w-full rounded-lg border border-dimmer bg-bg px-3 py-2 text-sm text-white"
      />
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => onSubmit(value)}
          disabled={saving || !value.trim()}
          className={`rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-bg ${
            saving || !value.trim() ? "opacity-60 cursor-wait" : "cursor-pointer"
          }`}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {showCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-md border border-dimmer bg-transparent px-3 py-1.5 text-sm text-white cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
      {error && (
        <div className="mt-2 text-sm text-danger">{error}</div>
      )}
    </div>
  );
}
