// POST /api/gmail/disconnect
// Headers: Authorization: Bearer <supabase access_token>
//
// Revokes the stored refresh token with Google (best effort) and removes the
// row from Supabase. Browser then drops in-memory access_token.

const { decrypt } = require("../_lib/crypto");
const { getUserFromAuthHeader, readGmailRow, deleteGmailRow } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }
  try {
    const user = await getUserFromAuthHeader(req);
    const row = await readGmailRow(user.user_id);
    if (row?.refresh_token_encrypted) {
      try {
        const refreshToken = decrypt(row.refresh_token_encrypted);
        const params = new URLSearchParams();
        params.set("token", refreshToken);
        await fetch("https://oauth2.googleapis.com/revoke", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
      } catch {
        // best effort — even if Google call fails we still drop the row
      }
    }
    await deleteGmailRow(user.user_id);
    res.status(200).json({ ok: true });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "disconnect_failed" });
  }
};
