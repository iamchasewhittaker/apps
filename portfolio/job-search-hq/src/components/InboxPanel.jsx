import React, { useEffect, useState } from "react";
import { s, isInboxPending } from "../constants";
import { connectGmail, disconnectGmail, ensureAccessToken, getCachedConnection } from "../inbox/oauth";
import { runInboxSync } from "../inbox/syncInbox";
import InboxItem from "./InboxItem";

const VISIBLE_LIMIT = 5;

export default function InboxPanel({ inbox, applications, handlers, showError }) {
  const [connection, setConnection] = useState(() => getCachedConnection());
  const [isConnecting, setConnecting] = useState(false);
  const [isSyncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState("");
  const [labelMissing, setLabelMissing] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [hasPolledOnMount, setHasPolledOnMount] = useState(false);

  // Probe connection state on mount — if we have a refresh token in Supabase,
  // ensureAccessToken() succeeds silently and the panel switches to connected.
  useEffect(() => {
    if (hasPolledOnMount) return;
    setHasPolledOnMount(true);
    let cancelled = false;
    ensureAccessToken()
      .then(token => {
        if (cancelled) return;
        if (token) setConnection(getCachedConnection());
      })
      .catch(() => { /* not connected — fine */ });
    return () => { cancelled = true; };
  }, [hasPolledOnMount]);

  const isConnected = !!connection.accessToken || (connection.gmailEmail && !!connection.expiresAt);
  const pending = (inbox || []).filter(item => isInboxPending(item));
  const visible = pending.slice(0, VISIBLE_LIMIT);
  const overflow = Math.max(0, pending.length - visible.length);

  async function handleConnect() {
    if (isConnecting) return;
    setError("");
    setConnecting(true);
    try {
      const conn = await connectGmail();
      setConnection(conn);
      // Auto-pull right after connecting so the panel feels alive
      await doSync(true);
    } catch (e) {
      const msg = e?.message || "Connection failed";
      if (msg.includes("popup_closed") || msg.includes("popup_failed_to_open")) {
        setError("Popup closed before granting access. Try again.");
      } else if (msg === "access_denied") {
        setError("Access denied. You need to allow Gmail read access for the inbox feed.");
      } else {
        setError(msg);
      }
    } finally {
      setConnecting(false);
    }
  }

  async function doSync(silent = false) {
    if (isSyncing) return;
    setSyncing(true);
    if (!silent) setError("");
    try {
      const result = await runInboxSync({
        existingInbox: inbox || [],
        labelName: connection.labelName || "JobSearch",
      });
      if (result.notConnected) {
        setConnection(getCachedConnection());
        return;
      }
      setLabelMissing(!!result.labelMissing);
      if (result.newItems?.length) {
        handlers.mergeInboxItems(result.newItems);
      }
      setLastSync(new Date().toISOString());
    } catch (e) {
      if (e?.code === "reconnect_required") {
        setConnection(getCachedConnection());
        setError("Gmail access expired. Reconnect to continue.");
      } else {
        setError(e?.message || "Sync failed");
      }
    } finally {
      setSyncing(false);
    }
  }

  async function handleDisconnect() {
    if (!window.confirm("Disconnect Gmail? Already-saved inbox items stay.")) return;
    try {
      await disconnectGmail();
    } finally {
      setConnection(getCachedConnection());
      setLastSync(null);
    }
  }

  // ── Not-connected state ───────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div style={s.inboxPanel}>
        <div style={s.inboxHeader}>
          <div style={s.inboxTitleWrap}>
            <span style={s.inboxTitle}>📬 Inbox</span>
            <span style={s.inboxSub}>Triage recruiter mail without leaving HQ</span>
          </div>
          <div style={s.inboxActions}>
            <button style={s.inboxConnectBtn} onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? "Connecting…" : "Connect Gmail"}
            </button>
          </div>
        </div>
        <div style={s.inboxIntro}>
          Reads a single Gmail label (default <strong>JobSearch</strong>) and surfaces recruiter pings, ATS updates, interview invites, and LinkedIn notifications here. Read-only — replies still happen in Gmail.
        </div>
        {error && <div style={s.inboxError}>{error}</div>}
        <button
          type="button"
          onClick={() => setShowSetup(v => !v)}
          style={{ ...s.inboxBtnDismiss, alignSelf: "flex-start" }}
        >
          {showSetup ? "Hide setup guide" : "Show one-time Gmail setup"}
        </button>
        {showSetup && <SetupGuide />}
      </div>
    );
  }

  // ── Connected state ───────────────────────────────────────────────────────
  return (
    <div style={s.inboxPanel}>
      <div style={s.inboxHeader}>
        <div style={s.inboxTitleWrap}>
          <span style={s.inboxTitle}>
            📬 Inbox{pending.length > 0 && <span style={s.aqBadge}>{pending.length}</span>}
          </span>
          <span style={s.inboxSub}>
            {connection.gmailEmail || "Gmail"}
            {lastSync ? ` · synced ${formatLastSync(lastSync)}` : ""}
          </span>
        </div>
        <div style={s.inboxActions}>
          <button
            style={isSyncing ? s.inboxRefreshBtnSpin : s.inboxRefreshBtn}
            onClick={() => doSync(false)}
            disabled={isSyncing}
            title="Refresh from Gmail"
          >
            {isSyncing ? "Syncing…" : "↻ Refresh"}
          </button>
          <button style={s.inboxDisconnect} onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
      </div>

      {error && <div style={s.inboxError}>{error}</div>}

      {labelMissing && (
        <div style={s.inboxError}>
          Label <strong>{connection.labelName || "JobSearch"}</strong> not found in Gmail. Create it and apply to a few emails, then refresh.
          <div style={{ marginTop: 4 }}>
            <button
              type="button"
              onClick={() => setShowSetup(v => !v)}
              style={{ ...s.inboxBtnDismiss, padding: "2px 0", border: "none", background: "transparent", color: "inherit", textDecoration: "underline" }}
            >
              {showSetup ? "Hide setup guide" : "Show setup guide"}
            </button>
          </div>
        </div>
      )}

      {pending.length === 0 ? (
        <div style={s.inboxEmpty}>
          {labelMissing
            ? "Add the JobSearch label to a few recruiter emails in Gmail, then refresh."
            : "You're caught up — nothing new in the inbox."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visible.map(item => {
            const matchedApp = handlers.matchAppFromInboxItem
              ? handlers.matchAppFromInboxItem(item, applications || [])
              : null;
            return (
              <InboxItem
                key={item.id}
                item={item}
                matchedApp={matchedApp}
                handlers={handlers}
              />
            );
          })}
          {overflow > 0 && (
            <div style={{ fontSize: 12, color: "#6b7280", textAlign: "center", marginTop: 4 }}>
              +{overflow} more pending — triage these {visible.length} first
            </div>
          )}
        </div>
      )}

      {showSetup && <SetupGuide />}
    </div>
  );
}

function SetupGuide() {
  return (
    <div style={s.inboxSetupGuide}>
      <div
        style={{
          padding: 8,
          borderRadius: 6,
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          marginBottom: 12,
          fontSize: 13,
          color: "#065f46",
        }}
      >
        <strong>Using Gmail Forge?</strong> The <code>JobSearch</code> label is created
        and applied automatically every 5 minutes — skip the steps below. Verify by running{" "}
        <code>healthCheck_jobSearch_()</code> in the Apps Script editor.
      </div>
      <div style={s.inboxSetupTitle}>One-time Gmail filters</div>
      <ol style={{ margin: 0, paddingLeft: 18 }}>
        <li>Gmail → Settings → <strong>Labels</strong> → create label <strong>JobSearch</strong>.</li>
        <li>Settings → <strong>Filters</strong> → Create new filter:
          <ul style={{ marginTop: 4, paddingLeft: 18 }}>
            <li>From: <code>linkedin.com</code> → apply label JobSearch</li>
            <li>From: <code>greenhouse.io</code> OR <code>hire.lever.co</code> OR <code>myworkday.com</code> OR <code>ashbyhq.com</code> → apply label JobSearch</li>
            <li>Subject: <code>interview OR schedule OR availability</code> → apply label JobSearch</li>
          </ul>
        </li>
        <li>Add recruiter senders to the label as you encounter them.</li>
      </ol>
      <div style={{ marginTop: 8 }}>
        Existing emails: open Gmail, search <code>label:inbox from:linkedin.com</code> → select all → label as JobSearch.
      </div>
    </div>
  );
}

function formatLastSync(iso) {
  if (!iso) return "";
  const ms = Date.now() - Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  if (ms < 60_000) return "just now";
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  return `${hr}h ago`;
}
