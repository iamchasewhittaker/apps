// Orchestrates a one-shot Gmail sync: ensure access token, list labeled
// messages, fetch + classify each new one, return inbox items the App.jsx
// can merge into data.inbox.

import { ensureAccessToken } from "./oauth";
import { listLabeledMessages, fetchMessage } from "./gmailClient";
import { classifyMessage } from "./classifier";
import { generateId } from "../constants";

const MAX_PER_SYNC = 25;
const SNIPPET_MAX = 240;

function clip(text, max) {
  if (!text) return "";
  const t = String(text);
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

function toInboxItem(msg, classification, fetchedAt) {
  return {
    id: generateId(),
    gmailMessageId: msg.id,
    gmailThreadId: msg.threadId || "",
    receivedAt: msg.internalDate ? new Date(msg.internalDate).toISOString() : null,
    fetchedAt,
    from: {
      name: msg.from?.name || "",
      email: msg.from?.email || "",
      domain: msg.from?.domain || "",
    },
    subject: msg.subject || "",
    snippet: clip(msg.snippet || msg.bodyText || "", SNIPPET_MAX),
    classification,
    status: "pending",
    snoozeUntil: null,
    actionedAt: null,
    actionedAs: null,
  };
}

// Returns { newItems, labelMissing, gmailEmail, labelName }
// Throws on auth or transport errors. Caller catches "reconnect_required".
export async function runInboxSync({ existingInbox = [], labelName = "JobSearch" } = {}) {
  const accessToken = await ensureAccessToken();
  if (!accessToken) {
    return { newItems: [], labelMissing: false, notConnected: true };
  }

  const list = await listLabeledMessages(accessToken, labelName, MAX_PER_SYNC);
  if (list.labelMissing) {
    return { newItems: [], labelMissing: true };
  }

  const knownIds = new Set(existingInbox.map(i => i.gmailMessageId).filter(Boolean));
  const newRefs = (list.messages || []).filter(m => m.id && !knownIds.has(m.id));

  if (newRefs.length === 0) {
    return { newItems: [], labelMissing: false };
  }

  const fetchedAt = new Date().toISOString();
  const fetched = await Promise.allSettled(
    newRefs.map(ref => fetchMessage(accessToken, ref.id))
  );

  const newItems = [];
  fetched.forEach(result => {
    if (result.status !== "fulfilled") return;
    const msg = result.value;
    let classification;
    try {
      classification = classifyMessage(msg);
    } catch (e) {
      classification = { kind: "other", confidence: 0, parsed: { subject: msg.subject || "" } };
    }
    newItems.push(toInboxItem(msg, classification, fetchedAt));
  });

  // newest first
  newItems.sort((a, b) => (b.receivedAt || "").localeCompare(a.receivedAt || ""));

  return { newItems, labelMissing: false };
}
