import React from "react";
import { s, STAGES, inboxKindMeta } from "../constants";

function relativeTime(iso) {
  if (!iso) return "";
  const ms = Date.now() - Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  const min = Math.round(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  const wk = Math.round(day / 7);
  if (wk < 5) return `${wk}w ago`;
  return iso.slice(0, 10);
}

function PrimaryActions({ item, matchedApp, handlers }) {
  const kind = item.classification?.kind;
  const parsed = item.classification?.parsed || {};

  if (kind === "recruiter") {
    return (
      <>
        <button style={s.inboxBtnPrimary} onClick={() => handlers.inboxOpenContactAndApp(item)}>
          Save Contact + App
        </button>
        <button style={s.inboxBtnSecondary} onClick={() => handlers.inboxOpenContact(item)}>
          Save Contact
        </button>
      </>
    );
  }

  if (kind === "ats_update") {
    if (parsed.subKind === "auto_reject") {
      const target = matchedApp || null;
      return (
        <>
          {target && (
            <button style={s.inboxBtnPrimary} onClick={() => handlers.inboxBumpStage(item, target, "Rejected")}>
              Mark {target.company || "app"} rejected
            </button>
          )}
          {!target && (
            <button style={s.inboxBtnSecondary} disabled>
              No matching application
            </button>
          )}
        </>
      );
    }
    const target = matchedApp || null;
    const suggested = parsed.suggestedStage && STAGES.includes(parsed.suggestedStage) ? parsed.suggestedStage : "";
    if (target && suggested && target.stage !== suggested) {
      return (
        <>
          <button style={s.inboxBtnPrimary} onClick={() => handlers.inboxBumpStage(item, target, suggested)}>
            Bump {target.company || "app"} → {suggested}
          </button>
          <button style={s.inboxBtnSecondary} onClick={() => handlers.inboxOpenAppEdit(item, target)}>
            Open application
          </button>
        </>
      );
    }
    if (target) {
      return (
        <button style={s.inboxBtnSecondary} onClick={() => handlers.inboxOpenAppEdit(item, target)}>
          Open {target.company || "application"}
        </button>
      );
    }
    return (
      <button style={s.inboxBtnSecondary} disabled>
        No matching application
      </button>
    );
  }

  if (kind === "interview_invite") {
    return (
      <button style={s.inboxBtnPrimary} onClick={() => handlers.inboxSetInterview(item, matchedApp || null)}>
        {matchedApp ? `Schedule + open prep` : `Set interview + create app`}
      </button>
    );
  }

  if (kind === "linkedin") {
    if (parsed.subKind === "inmail") {
      return (
        <button style={s.inboxBtnSecondary} onClick={() => handlers.inboxOpenContact(item)}>
          Save Contact
        </button>
      );
    }
    return null;
  }

  return null;
}

export default function InboxItem({ item, matchedApp, handlers }) {
  const kindMeta = inboxKindMeta(item.classification?.kind);
  const fromName = item.from?.name || item.from?.email || "Unknown sender";
  const parsed = item.classification?.parsed || {};
  const headline = parsed.company ? `${fromName} · ${parsed.company}` : fromName;

  return (
    <div style={s.inboxItem}>
      <div style={s.inboxItemTop}>
        <span style={{ ...s.inboxKindBadge, background: kindMeta.bg, color: kindMeta.color }}>
          {kindMeta.label}
        </span>
        <span style={s.inboxItemTitle}>{headline}</span>
        <span style={s.inboxItemTime}>{relativeTime(item.receivedAt)}</span>
      </div>
      {item.subject && <div style={s.inboxItemSubject}>{item.subject}</div>}
      {item.snippet && <div style={s.inboxItemSnippet}>{item.snippet}</div>}
      <div style={s.inboxItemActions}>
        <PrimaryActions item={item} matchedApp={matchedApp} handlers={handlers} />
        <button style={s.inboxBtnSecondary} onClick={() => handlers.snoozeInboxItem(item.id, 24)}>
          Snooze 24h
        </button>
        <button style={s.inboxBtnDismiss} onClick={() => handlers.dismissInboxItem(item.id)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
