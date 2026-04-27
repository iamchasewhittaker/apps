// Browser-side Gmail REST helpers — gmail.googleapis.com supports CORS for
// authorized requests, so we never round-trip through our server for fetches.
//
// Public API:
//   listLabeledMessages(accessToken, labelName, max) -> Promise<Array<{id, threadId}>>
//   fetchMessage(accessToken, messageId)             -> Promise<ParsedMessage>
//
// ParsedMessage shape:
//   { id, threadId, internalDate (ms), headers (lowercased keys),
//     from: { name, email, domain }, to, subject, snippet,
//     bodyText, bodyHtml }

const API = "https://gmail.googleapis.com/gmail/v1/users/me";

async function gfetch(accessToken, path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(`gmail_api_error ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json();
}

// Finds a label id by exact name (case-insensitive). Returns null if missing.
export async function findLabelId(accessToken, labelName) {
  const json = await gfetch(accessToken, "/labels");
  const target = (labelName || "").toLowerCase();
  const match = (json.labels || []).find(l => (l.name || "").toLowerCase() === target);
  return match?.id || null;
}

// List up to `max` recent message ids tagged with `labelName`.
// If the label doesn't exist, returns [] (no error — first-run friendly).
export async function listLabeledMessages(accessToken, labelName, max = 25) {
  const labelId = await findLabelId(accessToken, labelName);
  if (!labelId) return { labelMissing: true, messages: [] };
  const cap = Math.min(Math.max(max, 1), 100);
  const json = await gfetch(accessToken, `/messages?labelIds=${encodeURIComponent(labelId)}&maxResults=${cap}`);
  return { labelMissing: false, messages: json.messages || [] };
}

// ── MIME parsing ─────────────────────────────────────────────────────────────
// Gmail returns base64url-encoded parts. We walk the part tree and pick the
// best text/plain or text/html body. No external libraries.

function b64urlDecode(b64url) {
  if (!b64url) return "";
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  try {
    if (typeof atob === "function") {
      const bin = atob(b64 + pad);
      try {
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder("utf-8").decode(bytes);
      } catch {
        return bin;
      }
    }
  } catch {
    return "";
  }
  return "";
}

function walkParts(part, acc = { text: "", html: "" }) {
  if (!part) return acc;
  const mime = (part.mimeType || "").toLowerCase();
  const data = part.body?.data;
  if (data) {
    const decoded = b64urlDecode(data);
    if (mime === "text/plain" && !acc.text) acc.text = decoded;
    else if (mime === "text/html" && !acc.html) acc.html = decoded;
  }
  if (Array.isArray(part.parts)) {
    part.parts.forEach(p => walkParts(p, acc));
  }
  return acc;
}

function parseFrom(rawFrom) {
  // "Name <user@host.com>"  or  "user@host.com"
  if (!rawFrom) return { name: "", email: "", domain: "" };
  const angle = rawFrom.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (angle) {
    const name = angle[1].trim();
    const email = angle[2].trim();
    const domain = email.split("@")[1] || "";
    return { name, email, domain };
  }
  const justEmail = rawFrom.match(/[\w.+'-]+@[\w-]+\.[a-z]{2,}/i);
  if (justEmail) {
    const email = justEmail[0];
    return { name: "", email, domain: email.split("@")[1] || "" };
  }
  return { name: rawFrom.trim(), email: "", domain: "" };
}

function buildHeaderMap(headers = []) {
  const out = {};
  headers.forEach(h => {
    if (h?.name) out[h.name.toLowerCase()] = h.value || "";
  });
  return out;
}

export async function fetchMessage(accessToken, messageId) {
  const json = await gfetch(accessToken, `/messages/${encodeURIComponent(messageId)}?format=full`);
  const headerMap = buildHeaderMap(json.payload?.headers);
  const fromInfo = parseFrom(headerMap.from || "");
  const subject = headerMap.subject || "";
  const bodies = walkParts(json.payload, { text: "", html: "" });
  // Top-level body fallback if no parts (single-part messages)
  if (!bodies.text && !bodies.html && json.payload?.body?.data) {
    const decoded = b64urlDecode(json.payload.body.data);
    const mime = (json.payload.mimeType || "").toLowerCase();
    if (mime === "text/html") bodies.html = decoded;
    else bodies.text = decoded;
  }
  return {
    id: json.id,
    threadId: json.threadId,
    internalDate: Number(json.internalDate) || 0,
    headers: headerMap,
    from: fromInfo,
    to: headerMap.to || "",
    subject,
    snippet: json.snippet || "",
    bodyText: bodies.text || "",
    bodyHtml: bodies.html || "",
  };
}
