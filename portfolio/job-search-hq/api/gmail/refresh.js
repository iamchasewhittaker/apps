// POST /api/gmail/refresh
// Headers: Authorization: Bearer <supabase access_token>
//
// Reads the encrypted refresh_token for the caller from Supabase, exchanges
// with Google, returns a fresh access_token + expiry. If the refresh token
// is revoked or expired (Google returns 400 invalid_grant), responds 410 so
// the browser knows to prompt for re-consent.

const { decrypt } = require("../_lib/crypto");
const { getUserFromAuthHeader, readGmailRow, writeGmailRow, deleteGmailRow } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }
  try {
    const user = await getUserFromAuthHeader(req);
    const row = await readGmailRow(user.user_id);
    if (!row || !row.refresh_token_encrypted) {
      res.status(404).json({ error: "not_connected" });
      return;
    }

    let refreshToken;
    try {
      refreshToken = decrypt(row.refresh_token_encrypted);
    } catch {
      res.status(500).json({ error: "decrypt_failed" });
      return;
    }

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    if (!clientId || !clientSecret) {
      res.status(500).json({ error: "google_oauth_not_configured" });
      return;
    }

    const params = new URLSearchParams();
    params.set("client_id", clientId);
    params.set("client_secret", clientSecret);
    params.set("refresh_token", refreshToken);
    params.set("grant_type", "refresh_token");

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok || !tokenJson.access_token) {
      // invalid_grant => user revoked or 7-day testing token expired
      if (tokenJson.error === "invalid_grant") {
        await deleteGmailRow(user.user_id);
        res.status(410).json({ error: "reconnect_required" });
        return;
      }
      res.status(400).json({ error: "refresh_failed", detail: tokenJson });
      return;
    }

    const expiresAt = Date.now() + (Number(tokenJson.expires_in) || 3600) * 1000;

    // Update last_synced_at touch + scope (refresh tokens don't change)
    await writeGmailRow(user.user_id, {
      ...row,
      last_synced_at: new Date().toISOString(),
      scope: tokenJson.scope || row.scope || "",
    });

    res.status(200).json({
      ok: true,
      access_token: tokenJson.access_token,
      expires_at: expiresAt,
      gmail_email: row.gmail_email || "",
      label_name: row.label_name || "JobSearch",
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "refresh_failed" });
  }
};
