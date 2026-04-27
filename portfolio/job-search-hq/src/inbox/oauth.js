// Browser-side Gmail OAuth helper — loads Google Identity Services lazily,
// requests an authorization code via popup, and exchanges via /api/gmail/exchange.
// Never touches client_secret (lives only on the server).
//
// Token lifecycle:
//   - access_token kept in memory only (this module's closure)
//   - refresh_token encrypted at rest in Supabase, never sent to the browser
//   - Calls auto-refresh via /api/gmail/refresh when within REFRESH_BUFFER_MS of expiry

import { auth } from "../sync";

const GIS_SRC = "https://accounts.google.com/gsi/client";
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // refresh 5 minutes before expiry

let _gisPromise = null;
function loadGis() {
  if (_gisPromise) return _gisPromise;
  _gisPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("GIS requires a browser"));
      return;
    }
    if (window.google?.accounts?.oauth2) {
      resolve(window.google.accounts.oauth2);
      return;
    }
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google.accounts.oauth2));
      existing.addEventListener("error", () => reject(new Error("GIS load failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.accounts.oauth2);
    script.onerror = () => reject(new Error("GIS load failed"));
    document.head.appendChild(script);
  });
  return _gisPromise;
}

function getClientId() {
  const id = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
  if (!id) throw new Error("REACT_APP_GOOGLE_CLIENT_ID not configured");
  return id;
}

async function authHeader() {
  if (!auth) throw new Error("Auth client not configured");
  const { data } = await auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error("Not signed in");
  return { Authorization: `Bearer ${token}` };
}

// In-memory access token cache. Cleared on refresh failure / disconnect.
let _accessToken = null;
let _expiresAt = 0;
let _gmailEmail = "";
let _labelName = "JobSearch";

export function getCachedConnection() {
  return {
    accessToken: _accessToken,
    expiresAt: _expiresAt,
    gmailEmail: _gmailEmail,
    labelName: _labelName,
    isFresh: !!_accessToken && Date.now() < _expiresAt - REFRESH_BUFFER_MS,
    isStale: !!_accessToken && Date.now() >= _expiresAt - REFRESH_BUFFER_MS,
  };
}

function setConnection({ access_token, expires_at, gmail_email, label_name }) {
  _accessToken = access_token || null;
  _expiresAt = Number(expires_at) || 0;
  if (gmail_email) _gmailEmail = gmail_email;
  if (label_name) _labelName = label_name;
}

function clearConnection() {
  _accessToken = null;
  _expiresAt = 0;
}

// Trigger the OAuth popup. Returns connection details on success.
// Throws on user cancel or any error.
export async function connectGmail() {
  const oauth2 = await loadGis();
  const clientId = getClientId();
  const headers = await authHeader();

  const code = await new Promise((resolve, reject) => {
    let client;
    try {
      client = oauth2.initCodeClient({
        client_id: clientId,
        scope: SCOPES,
        ux_mode: "popup",
        access_type: "offline",
        prompt: "consent",
        callback: (response) => {
          if (response?.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }
          if (!response?.code) {
            reject(new Error("No authorization code returned"));
            return;
          }
          resolve(response.code);
        },
        error_callback: (err) => {
          reject(new Error(err?.message || err?.type || "OAuth popup failed"));
        },
      });
    } catch (e) {
      reject(e);
      return;
    }
    try {
      client.requestCode();
    } catch (e) {
      reject(e);
    }
  });

  const res = await fetch("/api/gmail/exchange", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({
      code,
      codeVerifier: "unused-popup-flow",
      redirectUri: "postmessage",
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(json.error || `exchange_failed (${res.status})`);
  }
  setConnection({
    access_token: json.access_token,
    expires_at: json.expires_at,
    gmail_email: json.gmail_email,
    label_name: "JobSearch",
  });
  return getCachedConnection();
}

// Ensure we have a usable access_token. Calls /api/gmail/refresh if the cached
// token is missing or about to expire. Returns null if not connected.
export async function ensureAccessToken() {
  if (_accessToken && Date.now() < _expiresAt - REFRESH_BUFFER_MS) {
    return _accessToken;
  }
  const headers = await authHeader();
  const res = await fetch("/api/gmail/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
  });
  if (res.status === 404) {
    clearConnection();
    return null;
  }
  if (res.status === 410) {
    clearConnection();
    const err = new Error("reconnect_required");
    err.code = "reconnect_required";
    throw err;
  }
  const json = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(json.error || `refresh_failed (${res.status})`);
  }
  setConnection({
    access_token: json.access_token,
    expires_at: json.expires_at,
    gmail_email: json.gmail_email,
    label_name: json.label_name || "JobSearch",
  });
  return _accessToken;
}

export async function disconnectGmail() {
  try {
    const headers = await authHeader();
    await fetch("/api/gmail/disconnect", { method: "POST", headers });
  } finally {
    clearConnection();
    _gmailEmail = "";
  }
}
