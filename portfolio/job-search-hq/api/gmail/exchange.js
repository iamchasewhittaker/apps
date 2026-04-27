// POST /api/gmail/exchange
// Body: { code, codeVerifier, redirectUri }
// Headers: Authorization: Bearer <supabase access_token>
//
// Exchanges an OAuth authorization code for Gmail tokens, encrypts the
// refresh_token at rest in Supabase, returns the access_token + expiry to
// the browser.

const { encrypt } = require("../_lib/crypto");
const { getUserFromAuthHeader, writeGmailRow } = require("../_lib/supabase");

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }
  try {
    const user = await getUserFromAuthHeader(req);
    const { code, codeVerifier, redirectUri } = await readJson(req);
    if (!code || !codeVerifier || !redirectUri) {
      res.status(400).json({ error: "missing_fields" });
      return;
    }

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    if (!clientId || !clientSecret) {
      res.status(500).json({ error: "google_oauth_not_configured" });
      return;
    }

    const params = new URLSearchParams();
    params.set("code", code);
    params.set("code_verifier", codeVerifier);
    params.set("client_id", clientId);
    params.set("client_secret", clientSecret);
    params.set("redirect_uri", redirectUri);
    params.set("grant_type", "authorization_code");

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok || !tokenJson.access_token) {
      res.status(400).json({ error: "token_exchange_failed", detail: tokenJson });
      return;
    }
    if (!tokenJson.refresh_token) {
      res.status(400).json({ error: "no_refresh_token", detail: "Re-consent required (revoke prior grant first)" });
      return;
    }

    // Look up the connected Gmail address using the fresh access token.
    let gmailEmail = "";
    try {
      const profRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` },
      });
      if (profRes.ok) {
        const prof = await profRes.json();
        gmailEmail = prof.emailAddress || "";
      }
    } catch {
      // non-fatal — we can still store tokens and surface the email later
    }

    const expiresAt = Date.now() + (Number(tokenJson.expires_in) || 3600) * 1000;
    const refreshEncrypted = encrypt(tokenJson.refresh_token);

    await writeGmailRow(user.user_id, {
      gmail_email: gmailEmail,
      refresh_token_encrypted: refreshEncrypted,
      label_name: "JobSearch",
      last_history_id: null,
      connected_at: new Date().toISOString(),
      last_synced_at: null,
      scope: tokenJson.scope || "",
    });

    res.status(200).json({
      ok: true,
      access_token: tokenJson.access_token,
      expires_at: expiresAt,
      gmail_email: gmailEmail,
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "exchange_failed" });
  }
};
