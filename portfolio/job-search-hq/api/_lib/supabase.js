// Server-side Supabase helpers for Vercel API routes.
// Uses SERVICE_ROLE_KEY (bypasses RLS) — safe because we always derive user_id
// from the caller's JWT before reading/writing.

const { createClient } = require("@supabase/supabase-js");

const URL = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

let _service = null;
function service() {
  if (!URL || !SERVICE_KEY) throw new Error("Supabase service credentials missing");
  if (!_service) {
    _service = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });
  }
  return _service;
}

// Validate a Supabase access-token JWT and return { user_id, email }.
// Throws if the token is invalid, expired, or the user lookup fails.
async function getUserFromAuthHeader(req) {
  const header = req.headers.authorization || req.headers.Authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    const err = new Error("Missing bearer token");
    err.status = 401;
    throw err;
  }
  if (!URL || !ANON_KEY) {
    const err = new Error("Supabase anon credentials missing on server");
    err.status = 500;
    throw err;
  }
  const userClient = createClient(URL, ANON_KEY, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await userClient.auth.getUser(token);
  if (error || !data?.user?.id) {
    const err = new Error("Invalid session");
    err.status = 401;
    throw err;
  }
  return { user_id: data.user.id, email: data.user.email };
}

const APP_KEY = "job-search:gmail";

async function readGmailRow(user_id) {
  const { data, error } = await service()
    .from("user_data")
    .select("data, updated_at")
    .eq("user_id", user_id)
    .eq("app_key", APP_KEY)
    .maybeSingle();
  if (error) throw new Error(`readGmailRow: ${error.message}`);
  return data?.data || null;
}

async function writeGmailRow(user_id, data) {
  const { error } = await service()
    .from("user_data")
    .upsert(
      { user_id, app_key: APP_KEY, data },
      { onConflict: "user_id,app_key" }
    );
  if (error) throw new Error(`writeGmailRow: ${error.message}`);
}

async function deleteGmailRow(user_id) {
  const { error } = await service()
    .from("user_data")
    .delete()
    .eq("user_id", user_id)
    .eq("app_key", APP_KEY);
  if (error) throw new Error(`deleteGmailRow: ${error.message}`);
}

module.exports = { service, getUserFromAuthHeader, readGmailRow, writeGmailRow, deleteGmailRow, APP_KEY };
